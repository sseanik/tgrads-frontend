export const calculateResponsiveDimensions = (
  width: number,
  height: number,
  widthCheck = false
) => {
  const { dimensionA, dimensionB, windowDimensionA, windowDimensionB } = {
    dimensionA: widthCheck ? width : height,
    dimensionB: widthCheck ? height : width,
    windowDimensionA: widthCheck ? window.innerWidth : window.innerHeight,
    windowDimensionB: widthCheck ? window.innerHeight : window.innerWidth,
  };
  const offset = width < height ? 50 : 20
  if (dimensionB > windowDimensionB) {
    if (dimensionA > windowDimensionA) {
      if (dimensionB - windowDimensionB < dimensionA - windowDimensionA) {
        if (dimensionA < dimensionB) {
          return (windowDimensionB / dimensionB) * dimensionA - (widthCheck ? 0 : offset);
        } else {
          return windowDimensionA;
        }
      } else {
        if (dimensionA > dimensionB) {
          return (windowDimensionB / dimensionB) * dimensionA - (widthCheck ? 0 : offset);
        } else {
          return windowDimensionA;
        }
      }
    } else {
      return (windowDimensionB / dimensionB) * dimensionA - (widthCheck ? 0 : offset);
    }
  } else {
    if (dimensionA > windowDimensionA) {
      return windowDimensionA
    } else {
      return dimensionA;
    }
  }
};
