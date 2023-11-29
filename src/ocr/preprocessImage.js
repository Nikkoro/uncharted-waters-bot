const Jimp = require("jimp");

const preprocessImage = async (imageBuffer) => {
  const image = await Jimp.read(imageBuffer);

  image
    .color([
      { apply: "desaturate", params: [90] },
      { apply: "darken", params: [5] },
    ])
    .contrast(0.8);

  const processedImageBuffer = await image.getBufferAsync(Jimp.MIME_JPEG);

  return processedImageBuffer;
};

module.exports = preprocessImage;
