import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check for secret to confirm this is a valid request
  if (req.query.secret !== process.env.REVALIDATE_SECRET) {
    console.log('Revalidation: Secret is invalid');
    return res.status(401).json({ message: 'Invalid token' });
  }

  console.log('Attempting to Revalidate...');

  try {
    const parsedBody =
      typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    console.log(parsedBody); // Temp

    const allOptions =
      parsedBody.event === 'entry.publish' ||
      parsedBody.event === 'entry.unpublish' ||
      parsedBody.event === 'entry.update' ||
      parsedBody.event === 'entry.delete';

    /* -------------------------------- Photo Tag ------------------------------- */
    // When the user has clicked on generates or edits photo tags
    if (
      (parsedBody.event === 'entry.create' ||
        parsedBody.event === 'entry.update') &&
      parsedBody.model === 'photo-tag'
    ) {
      console.log(
        ` - Revalidating /${parsedBody.entry.State.toLowerCase()}/gallery/${
          parsedBody.entry.GallerySlug
        } ~ ${parsedBody.event}`
      );
      await res.revalidate(
        `/${parsedBody.entry.State.toLowerCase()}/gallery/${
          parsedBody.entry.GallerySlug
        }`
      );
    }

    /* ---------------------------------- Photo --------------------------------- */
    // When the user uploads a photo or an admin removes a photo
    else if (
      parsedBody.event === 'media.create' ||
      parsedBody.event === 'media.delete'
    ) {
      console.log(
        ` - Revalidating Gallery: ${parsedBody.media.alternativeText} ~ ${parsedBody.event}`
      );
      await res.revalidate(parsedBody.media.alternativeText);
    }

    /* ---------------------------------- Event --------------------------------- */
    // When an admin publishes, unpublishes, updates or deletes an event
    else if (allOptions && parsedBody.model === 'event') {
      console.log(
        ` - Revalidating /${parsedBody.entry.State.toLowerCase()}/events/${
          parsedBody.entry.Slug
        } ~ ${parsedBody.event}`
      );
      await res.revalidate(
        `/${parsedBody.entry.State.toLowerCase()}/events/${
          parsedBody.entry.Slug
        }`
      );
      console.log(
        ` - Revalidating /${parsedBody.entry.State.toLowerCase()}/events ~ ${
          parsedBody.event
        }`
      );
      await res.revalidate(`/${parsedBody.entry.State.toLowerCase()}/events`);
    }

    /* --------------------------------- Gallery -------------------------------- */
    // When an admin publishes, updates or deletes an gallery
    else if (allOptions && parsedBody.model === 'gallery') {
      console.log(
        ` - Revalidating /${parsedBody.entry.Event.State.toLowerCase()}/gallery/${
          parsedBody.entry.Event.Slug
        } ~ ${parsedBody.event}`
      );
      await res.revalidate(
        `/${parsedBody.entry.Event.State.toLowerCase()}/gallery/${
          parsedBody.entry.Event.Slug
        }`
      );
      console.log(
        ` - Revalidating /${parsedBody.entry.Event.State.toLowerCase()}/gallery ~ ${
          parsedBody.event
        }`
      );
      await res.revalidate(
        `/${parsedBody.entry.Event.State.toLowerCase()}/gallery`
      );
    }

    /* ------------------------------- Newsletter ------------------------------- */
    // When a newsletter is created or edited
    else if (allOptions && parsedBody.model === 'newsletter') {
      console.log(` - Revalidating / ~ ${parsedBody.event}`);
      await res.revalidate('/');
    }

    /* ------------------------------- None Found ------------------------------- */
    // When no matching if statement is found relating to the event
    else {
      console.log(parsedBody);
      throw new Error('No valid revalidation statement found');
    }

    console.log('Revalidation successful');
    return res.json({ revalidated: true });
  } catch (err) {
    console.log('--- ERROR: Revalidation Error ---');
    console.log(err);
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    return res.status(500).json({ message: 'Error revalidating' });
  }
}
