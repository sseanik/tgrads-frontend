import Image from 'next/image';
import React from 'react';
import { PhotoProps } from 'react-photo-album';

import styles from '../styles/NextjsImage.module.css';

type NextJsImageProps = PhotoProps & {
  wrapperProps?: React.HTMLAttributes<HTMLDivElement>;
};

const NextJsImage = ({ photo, imageProps, wrapperProps }: NextJsImageProps) => {
  const { width, height } = photo;
  const { src, alt, title, style, sizes, className, onClick } = imageProps;
  const { style: wrapperStyle, ...restWrapperProps } = wrapperProps ?? {};

  return (
    <div
      style={{
        width: style.width,
        padding: style.padding,
        marginBottom: style.marginBottom,
        ...wrapperStyle,
      }}
      {...restWrapperProps}
    >
      <Image
        loading='lazy'
        src={src}
        alt={alt}
        title={title}
        sizes={sizes}
        width={width}
        height={height}
        className={`${className} ${styles.image}`}
        onClick={onClick}
      />
    </div>
  );
};

export default NextJsImage;
