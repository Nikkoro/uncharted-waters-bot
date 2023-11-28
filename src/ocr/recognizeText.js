const { createWorker } = require("tesseract.js");

const recognizeText = async (imgBuffer) => {
  const worker = await createWorker({
    logger: (m) => console.log(m),
  });
  await worker.loadLanguage("eng2");
  await worker.initialize("eng2");

  const {
    data: { text },
  } = await worker.recognize(imgBuffer);
  await worker.terminate();
  return text;
};

module.exports = recognizeText;
