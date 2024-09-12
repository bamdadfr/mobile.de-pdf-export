interface GetScaledDimensions {
  width: number;
  height: number;
}

export const defaultProps = {
  margin: 0.5,
};

export function getScaledDimensions(
  width: number,
  height: number,
  canvasWidth: number,
  canvasHeight: number,
  margin = defaultProps.margin,
): GetScaledDimensions {
  const targetW = canvasWidth - margin;
  const targetH = canvasHeight - margin;

  const ratio = width / height;
  let newWidth = targetW;
  let newHeight = newWidth / ratio;

  if (newHeight > targetH) {
    newHeight = targetH;
    newWidth = newHeight * ratio;
  }

  return {
    width: newWidth,
    height: newHeight,
  };
}
