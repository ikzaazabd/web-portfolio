# Ikzaaz — Personal Portfolio

Portfolio website as Product Manager.

Portfolio website built with vanilla HTML, CSS, and JavaScript. It includes four static pages and interactive portfolio features, with no framework, package manager, or build step.

## Tech stack

- HTML5
- CSS (one consolidated stylesheet)
- Vanilla JavaScript using browser ES modules
- Static JSON data and local image, audio, and document assets

## Project structure

```text
web-porto/
├── index.html
├── about.html
├── projects.html
├── writings.html
├── search.json
├── css/
│   └── style.css
├── js/
│   ├── about-page.js
│   ├── about.js
│   ├── ambient.js
│   ├── audio.js
│   ├── career.js
│   ├── contact.js
│   ├── findmy.js
│   ├── freeform.js
│   ├── imessage.js
│   ├── main.js
│   ├── memoji.js
│   ├── newsletter.js
│   ├── officehours.js
│   ├── photobooth.js
│   ├── photos.js
│   ├── playlists.js
│   ├── rearrange.js
│   ├── site-controls.js
│   ├── site-page.js
│   ├── spotlight.js
│   ├── switcher.js
│   ├── theme-init.js
│   └── theme.js
└── assets/
    ├── audio/
    ├── images/
    │   ├── apps/
    │   ├── books/
    │   ├── covers/
    │   ├── map/
    │   ├── photos/
    │   └── symbols/
    ├── map/
    │   └── route.json
    ├── Ikzaaz-Abdurrahman-CV.pdf
    ├── ikjas.vcf
    └── ICONS.md
```

## Local development

Run a local static server from the project root; ES modules and JSON fetches need HTTP rather than a `file://` URL.

```sh
python3 -m http.server 8000
```

Open <http://localhost:8000>. Stop the server with `Ctrl+C`.

## Deployment

### Vercel

Import the repository and use the project root as the deployment root. This is a static site: no build command or output-directory override is required. Attach a custom domain in Vercel when desired.

### GitHub Pages

The `.github/workflows/deploy-pages.yml` workflow publishes this static site from the repository root whenever changes are pushed to `main`. It can also be started manually from the repository's **Actions** tab. No build command is needed; `index.html` is the entry point.

To enable deployment:

1. Push this repository to GitHub. If no remote is configured yet, create a GitHub repository and add it as `origin` before pushing `main`.
2. In the repository, open **Settings → Pages** and set the build and deployment source to **GitHub Actions**.
3. Push to `main` or run **Deploy to GitHub Pages** from the **Actions** tab. GitHub will show the published URL in the workflow run and under **Settings → Pages**.

Site links and asset references are relative, so they also work when a project site is served below a repository subpath. The GitHub Pages URL is based on the GitHub account and repository name; a custom domain can be configured in Pages if needed.

No build configuration is required for the current static architecture; the Pages workflow handles deployment. The local folder name `web-porto` does not need to match the remote repository name.

## Maintenance

- **Pages:** keep HTML pages at the root so their current public URLs remain unchanged; add a root-level HTML file and include it in the navigation when a new page is needed.
- **Projects and writings:** update the existing portfolio content and `search.json` entries as appropriate. Keep the search data at the root; `js/spotlight.js` fetches it with a page-relative URL.
- **Images and icons:** use descriptive filenames and place them in the matching `assets/images/` category.
- **Documents and audio:** place downloadable documents in `assets/` and audio files in `assets/audio/`.
- **Styles:** add shared and page-scoped rules in `css/style.css`. Existing page-specific rules are scoped to their page body classes to prevent style leakage.
- **JavaScript:** put behavior in the existing focused modules under `js/`; use `js/main.js` for home-page initialization and `js/about-page.js` for About-page initialization. Keep module imports relative to their importing file.

## Architecture notes

- All pages stay at the root to preserve existing URLs and avoid routing or rewrite rules.
- `search.json` stays at the root so its relative fetch works on local servers, Vercel, and GitHub Pages project paths.
- There is no bundler, package manifest, or server-side runtime. Use relative paths for local resources; the configured canonical and social URLs continue to use the site's public domain.
- The Git repository and its history are independent of the local project directory name.
