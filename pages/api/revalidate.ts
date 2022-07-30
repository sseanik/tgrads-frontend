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

    // console.log(parsedBody); // Temp

    const allOptions =
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
    // When the user uploads a photo or an admin removes a photo or edits a photo's caption
    else if (
      parsedBody.event === 'media.create' ||
      parsedBody.event === 'media.update' ||
      parsedBody.event === 'media.delete'
    ) {
      console.log(
        ` - Revalidating ${parsedBody.media.alternativeText} ~ ${parsedBody.event}`
      );
      await res.revalidate(parsedBody.media.alternativeText);
    }

    /* --------------------------------- Caption -------------------------------- */
    // When the user uploads a photo or an admin removes a photo or edits a photo's caption
    else if (
      parsedBody.event === 'entry.update' && parsedBody.model === 'file'
    ) {
      console.log(
        ` - Revalidating ${parsedBody.entry.alternativeText} ~ ${parsedBody.event}`
      );
      await res.revalidate(parsedBody.entry.alternativeText);
    }

    /* ---------------------------------- Event --------------------------------- */
    // When an admin updates or deletes an event
    else if (allOptions && parsedBody.model === 'event') {
      console.log(
        ` - Revalidating /${parsedBody.entry.State.toLowerCase()}/events ~ ${
          parsedBody.event
        }`
      );
      await res.revalidate(`/${parsedBody.entry.State.toLowerCase()}/events`);
      if (parsedBody.event !== 'entry.delete') {
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
      }
    }

    /* --------------------------------- Gallery -------------------------------- */
    // When an admin updates or deletes a gallery
    else if (allOptions && parsedBody.model === 'gallery') {
      console.log(
        ` - Revalidating /${parsedBody.entry.Event.State.toLowerCase()}/gallery ~ ${
          parsedBody.event
        }`
      );
      await res.revalidate(
        `/${parsedBody.entry.Event.State.toLowerCase()}/gallery`
      );
      if (parsedBody.event !== 'entry.delete') {
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
      }
    }

    /* ------------------------------- Newsletter ------------------------------- */
    // When a newsletter is created, updated or deleted
    else if (parsedBody.model === 'newsletter') {
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
