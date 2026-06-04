# Pokémon Encyclopedia (Pokédex)

A modern, responsive Pokédex web app built with React, React Router, Context API, Tailwind CSS, and [PokéAPI](https://pokeapi.co).

## Features

- Full national Pokédex (Gen I–IX, #1–1025)
- Advanced search & multi-select filters (type, generation, region, ability, legendary/mythical/pseudo)
- Detailed Pokémon pages with stats, abilities, flavor text, evolutions, and competitive info
- Region explorer for all nine regions
- Mega Evolution & Gigantamax comparisons
- Alternate forms (Rotom, Deoxys, Necrozma, etc.)
- Type effectiveness calculator & full type chart
- Pokémon comparison (up to 6)
- Team builder with weakness/strength analysis
- Favorites & saved teams (localStorage)
- Dark/light mode, shiny sprite toggle, cry player
- Fun zone: daily Pokémon, random generator, quiz, guess game, achievements

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Build

```bash
npm run build
npm run preview
```

## Live demo

**https://ddas12345.github.io/pokemon-encyclopedia/**

### Fix a blank or broken site

1. Open [Pages settings](https://github.com/DDas12345/pokemon-encyclopedia/settings/pages).
2. Under **Build and deployment → Source**, choose **Deploy from a branch**.
3. Branch: **`gh-pages`**, folder: **`/ (root)`** — not `main`.
4. Save, wait 1–2 minutes, then hard-refresh the site (Cmd+Shift+R).

If you see only the title “PokéDex Encyclopedia” with no UI, Pages was serving raw `main` instead of the built app on `gh-pages`.

## Tech stack

- React 19 + Vite
- React Router 7
- Context API for global state
- Tailwind CSS 4
- PokéAPI for Pokémon data

## Note

First load fetches and caches Pokémon data from PokéAPI (~1025 entries). This may take a minute; subsequent visits use `localStorage` cache.
