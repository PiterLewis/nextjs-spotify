import { getAccessToken, refreshAccessToken } from './auth';

// Helper para obtener token válido
async function getValidToken() {
    let token = getAccessToken();
    if (!token) {
        token = await refreshAccessToken();
    }
    return token;
}

// Función auxiliar interna para fetch con retry automático de Auth
const fetchWithAuth = async (url) => {
    let currentToken = await getValidToken();
    if (!currentToken) throw new Error("No token available");

    let res = await fetch(url, { headers: { 'Authorization': `Bearer ${currentToken}` } });

    if (res.status === 401) {
        console.log("Token expired during fetch, refreshing...");
        currentToken = await refreshAccessToken();
        if (currentToken) {
            res = await fetch(url, { headers: { 'Authorization': `Bearer ${currentToken}` } });
        }
    }
    return res;
};

export async function searchSpotify(query, type = 'track', limit = 10) {
    try {
        const response = await fetchWithAuth(
            `https://api.spotify.com/v1/search?type=${type}&q=${encodeURIComponent(query)}&limit=${limit}`
        );
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.error("Search failed", error);
        return null;
    }
}

export async function generatePlaylist(preferences) {
    console.log("Generating playlist with preferences:", preferences);
    const { artists, genres, tracks, decade, mood, popularity } = preferences;

    let allTracks = [];

    // 1. Tracks seleccionados (Seed Tracks) y Top Tracks de sus Artistas
    if (tracks && tracks.length > 0) {
        allTracks.push(...tracks); // Añadimos los tracks elegidos

        // Buscar más canciones de los artistas de esos tracks
        for (const track of tracks) {
            if (track.artists && track.artists[0]) {
                try {
                    const res = await fetchWithAuth(
                        `https://api.spotify.com/v1/artists/${track.artists[0].id}/top-tracks?market=US`
                    );
                    if (res.ok) {
                        const data = await res.json();
                        allTracks.push(...data.tracks);
                    }
                } catch (e) { console.error(e); }
            }
        }
    }

    // 2. Top Tracks de Artistas Seleccionados
    if (artists && artists.length > 0) {
        for (const artist of artists) {
            try {
                const res = await fetchWithAuth(
                    `https://api.spotify.com/v1/artists/${artist.id}/top-tracks?market=US`
                );
                if (res.ok) {
                    const data = await res.json();
                    allTracks.push(...data.tracks);
                }
            } catch (e) { console.error(e); }
        }
    }

    // 3. Búsqueda por Géneros
    if (genres && genres.length > 0) {
        for (const genre of genres) {
            try {
                // Buscamos tracks random de ese género
                const offset = Math.floor(Math.random() * 50); // Un poco de aleatoriedad
                const res = await fetchWithAuth(
                    `https://api.spotify.com/v1/search?type=track&q=genre:${encodeURIComponent(genre)}&limit=10&offset=${offset}`
                );
                if (res.ok) {
                    const data = await res.json();
                    if (data.tracks) allTracks.push(...data.tracks.items);
                }
            } catch (e) { console.error(e); }
        }
    }

    // 3b. Búsqueda por Mood (Géneros asociados) - REEMPLAZO DE AUDIO FEATURES
    if (mood) {
        const moodGenres = {
            'happy': ['pop', 'dance', 'summer', 'happy'],
            'sad': ['acoustic', 'piano', 'sad', 'indie-folk'],
            'energetic': ['rock', 'metal', 'edm', 'work-out'],
            'calm': ['ambient', 'classical', 'chill', 'sleep']
        };

        const targetGenres = moodGenres[mood] || [];
        // Seleccionamos 2 géneros random del mood para no saturar
        const selectedMoodGenres = targetGenres.sort(() => 0.5 - Math.random()).slice(0, 2);

        for (const genre of selectedMoodGenres) {
            try {
                const offset = Math.floor(Math.random() * 50);
                const res = await fetchWithAuth(
                    `https://api.spotify.com/v1/search?type=track&q=genre:${encodeURIComponent(genre)}&limit=5&offset=${offset}`
                );
                if (res.ok) {
                    const data = await res.json();
                    if (data.tracks) allTracks.push(...data.tracks.items);
                }
            } catch (e) { console.error(e); }
        }
    }

    // --- DEDUPLICACIÓN (Importante hacerlo antes de filtrar) ---
    const uniqueMap = new Map();
    allTracks.forEach(t => {
        if (t.id && t.preview_url !== null) { // Opcional: filtrar si no tienen preview, o dejar todos
            uniqueMap.set(t.id, t);
        } else if (t.id) {
            uniqueMap.set(t.id, t);
        }
    });
    let finalTracks = Array.from(uniqueMap.values());

    console.log(`Tracks collected before filtering: ${finalTracks.length}`);

    // ID de tracks seleccionados para protegerlos de los filtros
    const selectedTrackIds = new Set(tracks ? tracks.map(t => t.id) : []);

    // 4. Filtro por Década
    if (decade && decade !== 'all') {
        const startYear = parseInt(decade);
        finalTracks = finalTracks.filter(t => {
            // Siempre mantener los tracks seleccionados manualmente
            if (selectedTrackIds.has(t.id)) return true;

            if (!t.album.release_date) return false;
            const year = parseInt(t.album.release_date.substring(0, 4));
            return year >= startYear && year < startYear + 10;
        });
    }

    // 5. Filtro por Popularidad
    if (popularity) {
        let min = 0, max = 100;
        if (popularity === 'mainstream') { min = 70; max = 100; }
        else if (popularity === 'popular') { min = 40; max = 80; }
        else if (popularity === 'underground') { min = 0; max = 40; }

        finalTracks = finalTracks.filter(t => {
            if (selectedTrackIds.has(t.id)) return true;
            return t.popularity >= min && t.popularity <= max;
        });
    }

    // 7. Mezclar y limitar
    // Shuffle simple
    finalTracks.sort(() => Math.random() - 0.5);

    // Limitar a 30 (o menos si hay pocas)
    const result = finalTracks.slice(0, 30);

    if (result.length === 0 && allTracks.length > 0) {
        console.log("Filters were too strict, returning backup tracks");
        return allTracks.slice(0, 20); // Fallback si el filtro borró todo
    }

    return result;
}

export async function savePlaylistToSpotify(tracks, name = "My AI Mix") {
    const token = await getValidToken();
    if (!token) throw new Error("No access token");

    // 1. Obtener ID del usuario actual
    const userRes = await fetch('https://api.spotify.com/v1/me', {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!userRes.ok) throw new Error("Failed to fetch user profile");
    const userData = await userRes.json();
    const userId = userData.id;

    // 2. Crear la Playlist vacía
    const createRes = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            description: "Generated with Spotify Taste Mixer",
            public: false
        })
    });
    if (!createRes.ok) throw new Error("Failed to create playlist");
    const playlistData = await createRes.json();

    // 3. Añadir las canciones (Usando URIs)
    const trackUris = tracks.map(t => t.uri); // spotify:track:xxxx

    const addRes = await fetch(`https://api.spotify.com/v1/playlists/${playlistData.id}/tracks`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            uris: trackUris
        })
    });

    if (!addRes.ok) throw new Error("Failed to add tracks");

    return playlistData; // Retornamos datos de la nueva playlist
}