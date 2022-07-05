export const revalidateGallery = (event: string, slug: string) => {
  return fetch(
    `${process.env.STRAPI_URL}/api/revalidate?secret=${process.env.NEXT_PUBLIC_REVALIDATE_SECRET}`,
    {
      method: 'POST',
      body: JSON.stringify({
        event: `entry.${event}`,
        model: 'photo-tag',
        entry: {
          GallerySlug: slug,
        },
      }),
    }
  );
};
