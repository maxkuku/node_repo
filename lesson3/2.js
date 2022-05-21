const fs = require("fs");
const { Transform } = require("stream");

const readStream = new fs.createReadStream("./access2.log", "utf8");
const writeStream = fs.createWriteStream("./processed.log", {
  flags: "a",
  encoding: "utf-8",
});

const transformStream = new Transform({
  transform(chunk, encoding, callback) {
    const transformedChunk = chunk
      .toString()
      .replace(new RegExp("\n\nText after read", "g"), "");
    callback(null, transformedChunk);
  },
});

readStream.pipe(transformStream).pipe(writeStream);

console.log("Запись завершена!");