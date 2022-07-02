export const revalidateGallery = (event: string, slug: string) => {
  const domain =
    process.env.NODE_ENV === 'production'
      ? 'https://tgrads.vercel.app'
      : 'http://localhost:3000';
  return fetch(
    `${domain}/api/revalidate?secret=${process.env.NEXT_PUBLIC_REVALIDATE_SECRET}`,
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
