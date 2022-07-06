import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check for secret to confirm this is a valid request
  if (req.query.secret !== process.env.REVALIDATE_SECRET) {
    console.log('Secret is invalid');
    return res.status(401).json({ message: 'Invalid token' });
  }

  console.log('Revalidating...');

  try {
    const parsedBody =
      typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    if (
      parsedBody.event === 'entry.create' &&
      parsedBody.model === 'photo-tag'
    ) {
      console.log(`Revalidating Gallery: ${parsedBody.entry.GallerySlug} with new Face Boxes`);
      await res.revalidate(`/gallery/${parsedBody.entry.GallerySlug}`);
    } else if (
      parsedBody.event === 'entry.update' &&
      parsedBody.model === 'photo-tag'
    ) {
      console.log(`Revalidating Gallery: ${parsedBody.entry.GallerySlug} with updated Face Tags`);
      await res.revalidate(`/gallery/${parsedBody.entry.GallerySlug}`);
    } else if (parsedBody.event === 'media.create') {
      console.log(`Revalidating Gallery: ${parsedBody.media.caption} with new uploaded photos`);
      await res.revalidate(`/gallery/${parsedBody.media.caption}`);
    }

    return res.json({ revalidated: true });
  } catch (err) {
    console.log('Revalidate Error');
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    return res.status(500).json({ message: 'Error revalidating' });
  }
}
