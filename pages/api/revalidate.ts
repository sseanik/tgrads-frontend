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

    // When the user has clicked on generates or edits photo tags
    if (
      (parsedBody.event === 'entry.create' ||
        parsedBody.event === 'entry.update') &&
      parsedBody.model === 'photo-tag'
    ) {
      console.log(
        `Revalidating Gallery: ${parsedBody.entry.GallerySlug} - ${parsedBody.event}`
      );
      await res.revalidate(`/gallery/${parsedBody.entry.GallerySlug}`);
    }
    // When the user uploads a photo or an admin removes a photo
    else if (
      parsedBody.event === 'media.create' ||
      parsedBody.event === 'media.delete'
    ) {
      console.log(
        `Revalidating Gallery: ${parsedBody.media.caption} - ${parsedBody.event}`
      );
      await res.revalidate(`/gallery/${parsedBody.media.caption}`);
    }
    // When an admin publishes, unpublishes, updates or deletes an event
    else if (
      (parsedBody.event === 'entry.publish' ||
        parsedBody.event === 'entry.unpublish' ||
        parsedBody.event === 'entry.update' ||
        parsedBody.event === 'entry.delete') &&
      parsedBody.model === 'event'
    ) {
      console.log(
        `Revalidating Event: ${parsedBody.entry.Slug} - ${parsedBody.event}`
      );
      await res.revalidate(`/event/${parsedBody.entry.Slug}`);
    }
    // When an admin publishes, updates or deletes an gallery
    else if (
      (parsedBody.event === 'entry.publish' ||
        parsedBody.event === 'entry.update' ||
        parsedBody.event === 'entry.delete') &&
      parsedBody.model === 'gallery'
    ) {
      console.log(
        `Revalidating Gallery: ${parsedBody.entry.Slug} - ${parsedBody.event}`
      );
      await res.revalidate(`/gallery/${parsedBody.entry.Event?.Slug}`);
    } else {
      console.log(parsedBody);
      throw new Error('No valid revalidation statement found');
    }

    return res.json({ revalidated: true });
  } catch (err) {
    console.log('Revalidate Error');
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    return res.status(500).json({ message: 'Error revalidating' });
  }
}
