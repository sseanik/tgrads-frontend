import PhotoAlbum from 'react-photo-album';
import NextJsImage from './NextjsImage';

const PhotoGallery = ({ photos }) => {
  const data = photos.map((photo) => {
    console.log(photo);
    return {
      src: photo.attributes.url,
      width: photo.attributes.width,
      height: photo.attributes.height,
    };
  });

  return (
    <PhotoAlbum
      layout='rows'
      photos={data}
      spacing={14}
      renderPhoto={NextJsImage}
      columns={(containerWidth) => Math.floor(containerWidth / 400) + 1}
    />
  );
};

export default PhotoGallery;
