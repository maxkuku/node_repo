const { workerData, parentPort } = require('worker_threads');
const crypto = require('crypto');

// parentPort.postMessage({
//     result: `You want to generate password ${workerData} bytes size`
// });

const password = crypto.randomBytes(workerData).toString('hex');
parentPort.postMessage({ result: `Password was generated: ${password}` });