const { createWorker } = require("tesseract.js");

const recognizeText = async (imgBuffer) => {
  const worker = await createWorker("eng2+osd", {
    // logger: (m) => console.log(m),
  });

  await worker.setParameters({
    tessedit_pageseg_mode: "1",
  });
  await worker.setParameters({
    tessedit_char_whitelist:
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789%() ",
  });

  const {
    data: { text },
  } = await worker.recognize(imgBuffer);
  await worker.terminate();
  return text;
};

module.exports = recognizeText;
