import { FaceDetectionBox } from "../types/FaceBoxes";

export const calculateFaceBoxes = (
  faceBox: FaceDetectionBox,
  width: number,
  height: number
) => {
  return {
    left: faceBox.left * width,
    top: faceBox.top * height,
    right: width - faceBox.right * width,
    bottom: height - faceBox.bottom * height,
  };
};
