export type FaceBoxAttributes = {
  id: string;
  attributes: {
    FaceBoxes: string | FaceDetectionBox[];
    PhotoID: string;
  };
};

export interface FaceDetectionBox {
  bottom: number;
  left: number;
  right: number;
  top: number;
  name: string;
}
