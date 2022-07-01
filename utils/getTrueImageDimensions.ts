const MAX_WIDTH = 1100;
const MAX_HEIGHT = 900;

export const getTrueImageDimensions = (height: number, width: number) => {
  if (height > width) {
    return {
      trueHeight: MAX_HEIGHT,
      trueWidth: (MAX_HEIGHT / height) * width,
    };
  }
  return { trueHeight: (MAX_WIDTH / width) * height, trueWidth: MAX_WIDTH };
};
