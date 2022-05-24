
const fs = require('fs');
const { Transform } = require('stream')
const string_one = '89.123.1.41';
const string_two = '34.48.240.111';



const replace_unwanted_IPs = (chunk, ip) => {
    const chunkLines = chunk.toString().split('\n');
    const newChunkArray = chunkLines.filter( line => (line.indexOf(ip) > -1) ? line : '' ) // !!! newChunk
    return newChunkArray.join('\n');
}





const replaceIPs = (ip) => new Transform ({
  transform(chunk, encoding, callback) {
    const transformedChunk = replace_unwanted_IPs(chunk, ip)

    callback(null, transformedChunk)
  }
});




const readStream = new fs.createReadStream(`./accessPart.log`, "utf8");



const writeStream = fs.createWriteStream(`./${string_one}_requests.log`, {
    flags: "a",
    encoding: "utf-8",
});
const writeStream2 = fs.createWriteStream(`./${string_two}_requests.log`, {
    flags: "a",
    encoding: "utf-8",
});



readStream
     .pipe(replaceIPs(string_one))
     .pipe(writeStream)

     
readStream
     .pipe(replaceIPs(string_two))
     .pipe(writeStream2)


     







