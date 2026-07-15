# Maggie Maguire — UX Portfolio

Plain HTML/CSS/JS portfolio site. No build step — edit the files directly and refresh the browser.

Bold, editorial design: navy / warm parchment / terracotta palette, Fraunces + Inter type, animated hero headline (with a random rotation of intro lines on every load), scroll reveals, a bento-style work grid, and full light/dark mode support.

## Structure

```
index.html                Home page (hero, featured work, about teaser, contact)
about.html                About page (overview, philosophy, experience, education, skills, bio, resume)
case-studies/
  case-study-1.html         Maintenance Project Management (Buildium)
  case-study-2.html         Write with AI (Buildium)
  case-study-3.html         Placeholder — duplicate an existing case study to start a new one
css/styles.css             All styles, incl. light/dark mode variables
js/main.js                 Theme toggle, mobile nav, scroll reveals, hero animation, keyword typewriter
assets/
  MaggieMaguireResume.pdf    Downloadable resume (linked from the About page and every footer)
  case-study-1/, case-study-2/   Real screenshots used in each case study
favicon.svg
```

## Editing content

- Colors, fonts, and spacing all live in `css/styles.css` under the `:root` and `[data-theme="dark"]` blocks near the top.
- To add a new case study: duplicate `case-studies/case-study-3.html`, replace the placeholder content, add real images to a new folder under `assets/`, and add a matching card to the work grid in `index.html`.
- The hero on the home page randomly picks one of several intro lines on each load — edit the list in `js/main.js` (search for the `variations` array).

## Previewing locally

Open `index.html` directly in a browser, or run a local server from this folder:

```
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Deploying to GitHub Pages

1. Create a new GitHub repository (e.g. `portfolio`).
2. Push this folder's contents to the repository's `main` branch:
   ```
   git init
   git add .
   git commit -m "Initial portfolio"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
3. On GitHub, go to the repo's **Settings → Pages**.
4. Under **Build and deployment**, set **Source** to "Deploy from a branch", branch `main`, folder `/ (root)`.
5. Save. GitHub will publish the site at `https://<your-username>.github.io/<repo-name>/` within a minute or two.
6. Optional: add a custom domain under the same Pages settings.

The included `.nojekyll` file tells GitHub Pages to skip Jekyll processing, which avoids issues with files/folders that start with an underscore or dot.
