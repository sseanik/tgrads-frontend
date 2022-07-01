import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('revalidate')
  // Check for secret to confirm this is a valid request
  if (req.headers.secret !== process.env.REVALIDATE_SECRET) {
    console.log("problem")
    return res.status(401).json({ message: 'Invalid token' });
  }

  try {
    if (req.body.event === "entry.update" && req.body.model == "photo-tag") {
      await res.revalidate(`/gallery/${req.body.entry.GallerySlug}`);
    }

    return res.json({ revalidated: true });
  } catch (err) {
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    return res.status(500).json({ message: 'Error revalidating' });
  }
}
