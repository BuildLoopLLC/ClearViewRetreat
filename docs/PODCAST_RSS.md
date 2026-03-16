# Podcast RSS feed sync

The blog can pull podcast episodes from an RSS feed into the **Podcast** category.

## Configuring the feed

1. Go to **Admin → Blog**.
2. In the **Podcast RSS feed** section, enter your feed URL (e.g. `https://feeds.captivate.fm/fiveminutefamily/`).
3. Click **Save**, then **Sync now** to import existing episodes.

New episodes are added as published blog posts in the Podcast category. Already-imported episodes (matched by feed item GUID/link) are skipped.

## Hourly sync (cron)

To refresh the feed automatically (e.g. every hour), call the cron endpoint from an external scheduler.

### Endpoint

- **URL:** `GET /api/cron/podcast-sync`
- **Auth:** If `CRON_SECRET` is set in the environment, the request must include it.

### Setting CRON_SECRET

In `.env.local` (or your host’s env):

```bash
CRON_SECRET=your-random-secret-string
```

### Calling the endpoint

**Query parameter:**

```
GET https://your-site.com/api/cron/podcast-sync?secret=YOUR_CRON_SECRET
```

**Or header:**

```
GET https://your-site.com/api/cron/podcast-sync
Authorization: Bearer YOUR_CRON_SECRET
```

### Schedulers

- **cron-job.org / EasyCron:** Create a job that runs every hour and calls the URL above.
- **Vercel:** Add a cron in `vercel.json` that triggers this route (see [Vercel Cron](https://vercel.com/docs/cron-jobs)).

If `CRON_SECRET` is not set, the endpoint accepts unauthenticated requests (suitable only for trusted/private environments).

---

## Railway: hourly podcast sync

Railway doesn’t run cron inside your Next.js app. Use an **external cron service** to call your deployed app every hour.

### 1. Set `CRON_SECRET` in Railway

1. Open your project on [Railway](https://railway.app).
2. Select your **service** (the Next.js app).
3. Go to **Variables** and add:
   - **Name:** `CRON_SECRET`
   - **Value:** a long random string (e.g. from `openssl rand -hex 32`).

Redeploy so the new variable is applied.

### 2. Use a free cron service to call the endpoint

Use a scheduler that sends an HTTP request every hour.

**Option A: cron-job.org (free)**

1. Sign up at [cron-job.org](https://cron-job.org).
2. Create a new cron job:
   - **Title:** e.g. `Podcast RSS sync`
   - **URL:**  
     `https://YOUR-RAILWAY-APP.up.railway.app/api/cron/podcast-sync?secret=YOUR_CRON_SECRET`  
     (replace with your real Railway URL and the same value as `CRON_SECRET`).
   - **Schedule:** every hour (e.g. `0 * * * *` or the hourly preset).
   - **Request method:** GET.
3. Save and enable the job.

**Option B: EasyCron or similar**

Same idea: create a job that runs every hour and performs a GET request to:

`https://YOUR-RAILWAY-APP.up.railway.app/api/cron/podcast-sync?secret=YOUR_CRON_SECRET`

### 3. Check it works

- In the cron service, check the last run result (status 200 and JSON body with `inserted` / `skipped`).
- In **Admin → Blog**, set the podcast feed URL, save, and run **Sync now** once. After that, the hourly cron will pull new episodes automatically.
