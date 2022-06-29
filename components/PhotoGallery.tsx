import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';

import Image from 'next/image';
import { useState } from 'react';
import PhotoAlbum from 'react-photo-album';
import Lightbox from 'yet-another-react-lightbox';

import NextJsImage from './NextjsImage';

const MAX_WIDTH = 1100;
const MAX_HEIGHT = 900;

const PhotoGallery = ({ photos }) => {
  const [index, setIndex] = useState<number>(-1);

  const getTrueSize = (height: number, width: number) => {
    if (height > width) {
      return {
        trueHeight: MAX_HEIGHT,
        trueWidth: (MAX_HEIGHT / height) * width,
      };
    }
    return { trueHeight: (MAX_WIDTH / width) * height, trueWidth: MAX_WIDTH };
  };

  const data = photos.map((photo) => {
    const { trueHeight, trueWidth } = getTrueSize(
      photo.attributes.height,
      photo.attributes.width
    );
    return {
      src: photo.attributes.url,
      height: trueHeight,
      width: trueWidth,
      aspectRatio: trueWidth / trueHeight,
    };
  });

  return (
    <>
      <PhotoAlbum
        layout='masonry'
        photos={data}
        spacing={14}
        renderPhoto={NextJsImage}
        columns={(containerWidth) => Math.floor(containerWidth / 400) + 1}
        onClick={(event, photo, index) => setIndex(index)}
      />
      <Lightbox
        slides={data}
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        render={{
          slide: (image) => {
            return (
              <div
                style={{
                  position: 'relative',
                  width: image.width,
                  height: image.height,
                }}
              >
                <Image
                  src={image.src ?? ''}
                  layout='fill'
                  loading='eager'
                  objectFit='contain'
                  alt={'alt' in image ? image.alt : ''}
                  sizes={image.width}
                  onClick={(e) => console.log(e)}
                />
              </div>
            );
          },
        }}
      />
    </>
  );
};

export default PhotoGallery;
