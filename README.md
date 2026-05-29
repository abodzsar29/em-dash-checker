# Em Dash Checker - isthisanemdash.com

A lightweight static web app that checks whether a piece of text contains an em dash (—).

The app is built with plain HTML, CSS, and JavaScript. It runs entirely client-side, stores the latest input locally in the browser, and includes a persistent light/dark theme toggle.

## Features

- Detects em dash usage in pasted or typed text
- Updates the result dynamically as the user types
- Persists the latest input in localStorage
- Supports a manual light/dark mode toggle
- Falls back to the system color scheme when no manual theme is saved
- Uses semantic HTML with a proper main landmark

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- Static hosting compatible: Cloudflare Pages, Netlify, GitHub Pages, Vercel static hosting

## Project Structure

├── index.html
├── assets
│   ├── css
│   │   ├── colors.css
│   │   └── styles.css
│   ├── img
│   │   └── favicon.ico
│   ├── js
│   │   └── main.js
│   └── minified
│       ├── css
│       │   ├── colors.min.css
│       │   └── styles.min.css
│       ├── index.html
│       └── js
│           └── main.min.js


## How It Works

The page listens for input in the main textarea and checks whether the trimmed text contains the em dash character.

- If an em dash is found, the app shows a “suspicious” result message.
- If no em dash is found, the app shows a “clean” result message.
- The displayed message is randomly selected from a predefined set for each state.
- The latest input is saved to localStorage and restored on reload.
- The selected theme is also saved to localStorage.

## Minified Production Assets

The project also includes minified production assets under assets/minified/.

These are intended for deployment if you want to serve optimized files instead of the readable source files.

Current minified output includes:

- assets/minified/css/styles.min.css
- assets/minified/css/colors.min.css
- assets/minified/js/main.min.js
- assets/minified/index.html

## Minification Workflow

Readable source files should be edited first. After that, generate minified assets for production.

Example commands:

bash
npx terser assets/js/main.js -c -m -o assets/minified/js/main.min.js
npx clean-css-cli -o assets/minified/css/styles.min.css assets/css/styles.css
npx clean-css-cli -o assets/minified/css/colors.min.css assets/css/colors.css
npx html-minifier-terser index.html --collapse-whitespace --remove-comments --minify-css true --minify-js true -o assets/minified/index.html


## Deployment

This project does not require:

- a build step
- a bundler
- a package manager setup
- a backend

Deployment is static.

You can deploy either:

1. The readable root files: index.html and assets/
2. A production-ready minified variant, if you restructure the output to match your host’s expected file layout

If deploying the minified version, make sure the HTML asset paths match the deployed folder structure exactly.

## Accessibility Notes

The page includes:

- a main landmark for screen reader navigation
- semantic header, main, and footer structure
- a keyboard-accessible theme toggle button

## License

No license file is currently included in this repository.
