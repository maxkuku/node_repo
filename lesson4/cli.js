#!/usr/bin/env node
// запуск – readSearchFile

const fs = require('fs');
const path = require("path");
const inquirer = require("inquirer");
const currentDirectory = process.cwd();
const { Transform } = require('stream')




const replace_unwanted_IPs = (chunk, search) => {
    if(search){
        const chunkLines = chunk.toString().split('\n');
        const newChunkArray = chunkLines.filter( line => (line.indexOf(search) > -1) ? line : '' ); 
        // !!! newChunk
        return newChunkArray.join('\n');
    }
    return chunk;
}


const replaceIPs = (search) => new Transform ({
    transform(chunk, encoding, callback) {
      const transformedChunk = replace_unwanted_IPs(chunk, search)  
      callback(null, transformedChunk)
    }
});




const writeStream = fs.createWriteStream(`${currentDirectory}/prog_requests.log`, {
    flags: "w",
    encoding: "utf-8",
});



const processInput = (filePath, variant_to_show, search) => {
    const readStream = new fs.createReadStream(filePath, "utf8");
    
    
    if(variant_to_show[0] === 'Write file') { // !!! [0]

        readStream
        .pipe(replaceIPs(search))
        .pipe(writeStream)
        
    }
    else {

        fs.readFile(filePath, 'utf8', (err, data) => {
            console.log(data)
        });
    }

}



const isFile = fileName => {
    return fs.lstatSync(fileName).isFile();
}
const list = fs.readdirSync(currentDirectory).filter(isFile);




inquirer
.prompt([
{
    type: 'input',
    name: 'currentDirectory',
    message: "Approove folder:",
    default() {
        return currentDirectory;
    }
},
{
    name: "fileName",
    type: "list",
    message: "Type filename:",
    choices: list,
},
{
    name: 'variant_to_show',
    type: 'checkbox',
    message: 'Select option',
    choices: ['Log into console','Write file'],
},
{
    name: "search",
    type: "input",
    message: "If search, write search word:",
    when: (answers) => answers.variant_to_show[0] === 'Write file'
}])
.then((answer) => {

    const filePath = path.join(answer.currentDirectory, answer.fileName);
    fs.readFile(filePath, 'utf8', (err, data) => {
        processInput(filePath, answer.variant_to_show, answer.search);
    });
})




