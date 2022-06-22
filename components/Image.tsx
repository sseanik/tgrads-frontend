import NextImage from 'next/image';

const Image = ({ imageObj }: any) => {
  const { alternativeText, width, height, url } = imageObj.data.attributes;

  return (
    <NextImage
      layout='responsive'
      width={width}
      height={height}
      objectFit='contain'
      src={url}
      alt={alternativeText || ''}
    />
  );
};

export default Image;
