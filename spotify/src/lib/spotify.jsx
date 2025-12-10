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

    // 4. Filtro por Década
    if (decade && decade !== 'all') {
        const startYear = parseInt(decade);
        finalTracks = finalTracks.filter(t => {
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

        finalTracks = finalTracks.filter(t => t.popularity >= min && t.popularity <= max);
    }

    // 6. Filtro por Mood (Audio Features) - CON PROTECCIÓN CONTRA ERROR 403
    // Solo aplicamos si hay mood y tracks para filtrar
    if (mood && finalTracks.length > 0) {
        try {
            // Chunking para la API (máx 100 ids)
            const chunks = [];
            for (let i = 0; i < finalTracks.length; i += 100) {
                chunks.push(finalTracks.slice(i, i + 100));
            }

            let featuresMap = new Map();
            let failedToFetchFeatures = false;

            for (const chunk of chunks) {
                const ids = chunk.map(t => t.id).join(',');
                const res = await fetchWithAuth(`https://api.spotify.com/v1/audio-features?ids=${ids}`);

                if (!res.ok) {
                    console.warn(`Skipping mood filter: API returned ${res.status}`);
                    failedToFetchFeatures = true;
                    break; // Si falla uno, asumimos que falla todo (ej: 403 Forbidden)
                }

                const data = await res.json();
                if (data.audio_features) {
                    data.audio_features.forEach(f => {
                        if (f) featuresMap.set(f.id, f);
                    });
                }
            }

            // Solo filtramos si NO falló la petición
            if (!failedToFetchFeatures) {
                finalTracks = finalTracks.filter(track => {
                    const f = featuresMap.get(track.id);
                    if (!f) return true; // Si no hay features por error puntual, mantenemos la canción

                    const { energy, valence, danceability } = f;
                    switch (mood) {
                        case 'happy':
                            return valence >= 0.6 && energy >= 0.5;
                        case 'sad':
                            return valence <= 0.4;
                        case 'energetic':
                            return energy >= 0.7 && danceability >= 0.5;
                        case 'calm':
                            return energy <= 0.4 && valence >= 0.4; // Calm but not necessarily sad
                        default:
                            return true;
                    }
                });
            }

        } catch (error) {
            console.warn("Error processing mood filters (ignoring filter):", error);
            // No hacemos throw, dejamos que finalTracks pase sin filtrar
        }
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