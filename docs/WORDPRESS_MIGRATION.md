# WordPress posts migration (production)

This doc describes how to run the WordPress → SQLite blog migration in production (e.g. on Railway).

## What the script does

- Reads a WordPress WXR export XML (file or URL).
- Imports **published posts** into the local SQLite `blog_posts` table.
- Preserves dates, content (HTML), images/alt/captions, categories, tags.
- Assigns **Podcast** for Five Minute Family / `fmf-` / podcast embeds; prefers **Blog** (and other real categories) over **Uncategorized** when both exist.

## Option 1: Run on Railway (recommended)

The app uses the same SQLite DB path in production (`data/website.db`) with a Railway volume, so the migration must run **inside the Railway environment** so it writes to that volume.

### 1. Get the XML to a URL (one-time)

The script can load the XML from a URL, so you don’t need to upload a file to the server.

- **A) Host the export:** Upload the WordPress export XML to a temporary URL (e.g. S3, Gist, or your own server) and note the public URL.
- **B) Or use a local file on the server:** If you run a one-off command that has the file (e.g. you added it to the repo or a volume), use the file path instead (see Option 2).

### 2. Run the migration on Railway

**Using Railway CLI (one-off run):**

```bash
# From your machine, with Railway CLI installed and linked to the project:
railway run npx tsx scripts/migrate-wordpress-posts.ts "https://YOUR_URL_TO_EXPORT.xml"
```

Or with an env var:

```bash
railway run bash -c 'WORDPRESS_XML_URL="https://YOUR_URL_TO_EXPORT.xml" npx tsx scripts/migrate-wordpress-posts.ts'
```

**Using Railway Dashboard:**

1. Open your Railway project.
2. Use **“Run a command”** / **“One-off run”** (or the equivalent in your plan) in the service that has the same environment and volume as the app.
3. Command:

   ```bash
   npx tsx scripts/migrate-wordpress-posts.ts "https://YOUR_URL_TO_EXPORT.xml"
   ```

Replace `YOUR_URL_TO_EXPORT.xml` with the real URL from step 1.

### 3. Confirm

- Check logs for: `Done. Inserted: N Skipped: M`.
- Visit `/blog` on the production site and confirm posts and categories (including Podcast) look correct.

---

## Option 2: Run with a file path on the server

If the XML file is on the same machine as the app (e.g. in the repo or on a volume):

```bash
npx tsx scripts/migrate-wordpress-posts.ts /path/on/server/clearviewretreat.WordPress.YYYY-MM-DD.xml
```

Example if you put the file in the project root:

```bash
npx tsx scripts/migrate-wordpress-posts.ts ./clearviewretreat.WordPress.2026-03-12.xml
```

---

## Option 3: Run locally against a copy of production DB

Only if you have a **copy** of the production SQLite file (e.g. downloaded from a backup or volume):

1. Replace `data/website.db` locally with that copy (back up your local DB first).
2. Run:

   ```bash
   npm run migrate-wordpress-posts -- /path/to/export.xml
   ```

3. Then re-upload the updated `data/website.db` to production (e.g. restore into the volume).  
   **Note:** This can be error-prone and may cause downtime; prefer Option 1 when possible.

---

## Script usage reference

```bash
# Local file (default path if no arg: ~/Downloads/clearviewretreat.WordPress.2026-03-12.xml)
npm run migrate-wordpress-posts
npm run migrate-wordpress-posts -- /path/to/export.xml

# From URL
npm run migrate-wordpress-posts -- "https://example.com/export.xml"

# URL via env (useful in CI / one-off runs)
WORDPRESS_XML_URL="https://example.com/export.xml" npm run migrate-wordpress-posts
```

---

## Categories and Podcast

- **Podcast:** Posts are auto-assigned when the title contains “Five Minute Family” / “Five Minute Devotional”, the slug starts with `fmf-`, or the content has a podcast embed (e.g. captivate.fm, simplecast).
- **Blog / others:** If a post has both “Uncategorized” and another category (e.g. “Blog”), the script uses the non-uncategorized one.
- **Uncategorized:** Used only when it’s the only category in the export and the post isn’t detected as a podcast.

New category slugs (e.g. `podcast`) are appended to `data/categories.json` when the script runs; in production that file is part of the deployed app, so the next deploy will include the updated categories.
