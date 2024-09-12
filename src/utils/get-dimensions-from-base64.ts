interface GetDimensionsFromBase64 {
  width: number;
  height: number;
}

export function getDimensionsFromBase64(base64: string): Promise<GetDimensionsFromBase64> {
  return new Promise((resolve) => {
    const image = new Image();
    image.src = base64;
    image.onload = () => {
      resolve({
        width: image.naturalWidth,
        height: image.naturalHeight,
      });
    };
  });
}
