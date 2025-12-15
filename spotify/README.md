# Spotify Taste Mixer

Bienvenido a Taste Mixer.

Esta no es simplemente otra aplicación de Spotify. Es un recorrido personal a través de tus gustos musicales. Creamos esto porque creemos que, aunque los algoritmos son útiles, a veces prefieres tener tú el control.

## ¿Qué es esto?

Taste Mixer es una aplicación web que te permite crear listas de reproducción de Spotify únicas, basadas en tu estado de ánimo, tus artistas favoritos y tus géneros preferidos. Está diseñada para ser una experiencia visual, interactiva y entretenida.

### Características Principales

*   **Music Quest**: Una experiencia gamificada donde recorres un camino musical para construir tu playlist perfecta.
*   **Panel de Control (Dashboard)**: Un centro de mando donde puedes ajustar cada detalle de tu mezcla.
    *   **Arrastrar y Soltar**: Organiza el orden de tus canciones de manera intuitiva.
    *   **Widgets**: Selecciona artistas, géneros, estados de ánimo y décadas mediante componentes interactivos.
*   **Historial**: Nunca pierdas una buena mezcla. Guardamos las playlists que generas para que puedas revisarlas, escuchar fragmentos o guardarlas directamente en tu cuenta de Spotify.
*   **Diseño Premium**: Una estética elegante y moderna, con efectos visuales cuidados y animaciones fluidas, que se adapta tanto al modo claro como al oscuro.

## Guía del Código

Aquí tienes una explicación humana de cómo funciona cada archivo de este proyecto. He intentado resaltar las partes más interesantes o complejas para que entiendas la "magia" detrás del telón.

### Páginas Principales (Core Pages)

#### `src/app/page.jsx` (Home Page)
Esta es la portada de nuestra aplicación. Es lo primero que ven los usuarios.
*   **Propósito**: Dar la bienvenida y permitir el inicio de sesión con Spotify.
*   **Lo Humano**: Es como el escaparate de una tienda; tiene que ser bonito y decirte claramente qué vendemos (en este caso, playlists increíbles).

#### `src/app/dashboard/page.jsx` (El Cerebro)
Aquí es donde ocurre la magia. Es el panel de control principal.
*   **Propósito**: Mostrar los widgets para configurar tu playlist, generar la mezcla y permitirte reordenar las canciones.
*   **Código Destacado**:
    *   **Drag & Drop**: Usamos `dnd-kit` para que puedas arrastrar canciones. La función `handleDragEnd` es clave aquí: detecta qué canción moviste y actualiza el orden en la lista sin que se rompa nada.
    *   **Generación**: La función `handleGenerate` toma todas tus preferencias (ánimo, género, etc.) y llama a nuestra utilidad de Spotify para cocinar la playlist perfecta.

#### `src/app/history/page.jsx` (La Memoria)
Donde guardamos tus creaciones pasadas.
*   **Propósito**: Listar las playlists que has generado anteriormente.
*   **Lo Interesante**: Guardamos el historial en `localStorage` (la memoria de tu navegador), así que tus mezclas sobreviven aunque cierres la pestaña. También manejamos el guardado real a Spotify desde aquí.

#### `src/app/game/page.jsx` (Music Quest)
Nuestra joya de la corona: la experiencia gamificada.
*   **Propósito**: Convertir la configuración de la playlist en un viaje visual.
*   **Código Destacado**:
    *   **Pasos del Mago**: Usamos un array `STEPS` para definir cada parada del viaje (Artistas, Géneros, Mood).
    *   **Movimiento**: La lógica que mueve al mago (`wizardPosition`) y actualiza el progreso (`completedSteps`) hace que se sienta como un juego real y no un formulario aburrido.

### Sistema y Configuración

#### `src/app/layout.jsx`
El esqueleto de la aplicación.
*   **Propósito**: Define la estructura básica (HTML, Body) y carga las fuentes (Outfit). Todo lo que pongas aquí aparece en TODAS las páginas.

#### `src/app/loading.jsx` & `src/app/not-found.jsx`
Nuestras páginas de "espera" y "error".
*   **Propósito**: Que incluso cuando algo carga o falla, se vea bonito. Usamos el icono del Mago y gradientes para que no rompa la inmersión.

### Conexiones (API & Libs)

#### `src/lib/spotify.jsx`
El traductor entre nosotros y Spotify.
*   **Propósito**: Contiene todas las funciones que hablan con Spotify: `searchSpotify`, `getRecommendations`, `createPlaylist`.
*   **Código Complejo**: La función `generatePlaylist` es la más lista de la clase. Toma tus inputs (ej. "Happy", "Rock") y los traduce a parámetros numéricos que Spotify entiende (valence, energy, danceability).

#### `src/app/api/spotify-token/route.jsx`
El guardián de las llaves.
*   **Propósito**: Obtiene el "token" de acceso de Spotify de forma segura. Nunca exponemos nuestras claves secretas al navegador del usuario; este archivo actúa de intermediario seguro en el servidor.

### Componentes Reutilizables

#### `src/components/SortableTrack.jsx`
*   **Propósito**: Envuelve cada canción de la playlist para darle superpoderes de "arrastrable". Usa `useSortable` de `dnd-kit` para gestionar las animaciones y la física del movimiento.

#### `src/components/widgets/*.jsx` (Artist, Genre, Mood, etc.)
*   **Propósito**: Son las piezas de lego de nuestra interfaz. Cada uno se encarga de una sola cosa (elegir artistas, elegir humor...) y lo hace bien. Son independientes y reutilizables.

## Cómo Ejecutar el Proyecto

Si deseas correr este proyecto en tu entorno local, sigue estos pasos:

1.  **Instalar Dependencias**:
    Ejecuta el siguiente comando en tu terminal:
    ```bash
    npm install
    ```

2.  **Iniciar el Servidor de Desarrollo**:
    Arranca el proyecto con:
    ```bash
    npm run dev
    ```

3.  **Abrir en el Navegador**:
    Visita `http://localhost:3000` y comienza a crear tus mezclas.

## Tecnologías Utilizadas

Para construir este proyecto hemos utilizado:
*   **Next.js**: Para ofrecer una experiencia web rápida y moderna.
*   **Tailwind CSS**: Para un diseño personalizado y de alta calidad.
*   **Spotify API**: Para conectar con la música que te gusta.
*   **dnd-kit**: Para lograr interacciones de arrastrar y soltar suaves y precisas.

---

Hecho con dedicación para los amantes de la música.
