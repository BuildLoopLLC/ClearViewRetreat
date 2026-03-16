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
- **Railway:** Use a cron service or a separate worker that hits this URL.
- **Vercel:** Add a cron in `vercel.json` that triggers this route (see [Vercel Cron](https://vercel.com/docs/cron-jobs)).

If `CRON_SECRET` is not set, the endpoint accepts unauthenticated requests (suitable only for trusted/private environments).
