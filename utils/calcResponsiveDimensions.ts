export const calcResponsiveDimensions = (width: number, height: number) => {
  // If width and height are smaller than viewport
  if (width < window.innerWidth && height < window.innerHeight) {
    return { width, height };
  } 
  // If height viewport is smaller than height
  else if (width < window.innerWidth && height > window.innerHeight) {
    return {
      width: (window.innerHeight / height) * width, // reduce
      height: window.innerHeight,
    };
  } 
  // If width viewport is smaller than width
  else if (width > window.innerWidth && height < window.innerHeight) {
    return {
      width: window.innerWidth - 32,
      height: ((window.innerWidth - 32) / width) * height, // reduce
    };
  } 
  // If width and height are smaller than viewport
  else if (width > window.innerWidth && height > window.innerHeight) {
    // If viewport width difference is greater than viewport height difference
    if (width - window.innerWidth + 32 > height - window.innerHeight) {
      // If computed height is greater than viewport height
      if ((((window.innerWidth - 32) / width) * height) > window.innerHeight) {
        return {
          width: (window.innerHeight / height) * width,
          height: window.innerHeight
        }
      } else {
        return {
          width: window.innerWidth - 32,
          height: ((window.innerWidth - 32) / width) * height,
        };
      }
    } 
      // If viewport height difference is greater than viewport width difference
    else if (width - window.innerWidth + 32 < height - window.innerHeight) {
      // If computed width is greater than viewport width
      if ((window.innerHeight / height) * width > window.innerWidth) {
        return {
          width: window.innerWidth - 32,
          height: ((window.innerWidth - 32) / width) * height
        }
      } else {
        return {
          width: (window.innerHeight / height) * width,
          height: window.innerHeight,
        };
      }
    } else {
      return { width: window.innerWidth - 32, height: window.innerHeight };
    }
  } else {
    return { width, height };
  }
};
