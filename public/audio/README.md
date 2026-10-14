# 🎵 Music for Forever With You

The player looks for one file, configured in `src/config/site.ts`:

```ts
music: {
  src: '/audio/our-song.wav',   // ← change this when you change the file
  title: 'Our Song',
  // ...
}
```

## What is here now

`our-song.wav` — an **original 16-second ambient music-box loop**, generated
by `scripts/generate-music.mjs` in this repository. Because it was written
and synthesized here, there is no licensing problem with shipping it.

Regenerate it any time:

```bash
npm run generate:music
```

## Using your own song

1. Choose a file you are allowed to share (your own recording, a royalty-free
   track, or streaming-service downloads where the licence permits it).
2. Put it in this folder, e.g. `public/audio/song.mp3`.
3. Update `music.src` to `/audio/song.mp3` (keep the leading slash).

Supported formats: **mp3, wav, ogg, m4a** — anything your browser plays.

Tips:

- Keep it under ~5 MB so the page stays fast.
- Trim it to 30–60 seconds and enable looping for the cleanest experience
  (the player already sets `loop = true`).
- The music **never autoplays** — the visitor chooses when to start it.

If the file is missing or fails to load, the player disables itself with a
hint instead of throwing console errors.
