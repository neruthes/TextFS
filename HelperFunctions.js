const fs = require('fs');

const HelperFunctions = {};

HelperFunctions.LoadDiskImage = function () {
    return fs.readFileSync('./data.txt').toString();
};

HelperFunctions.SaveDiskImage = function (dskimgtxt) {
    fs.writeFileSync('./data.txt', dskimgtxt.trim()+'\n');
};

HelperFunctions.LoadFilesTable = function () {
    return JSON.parse(fs.readFileSync('./files.json').toString());
};

HelperFunctions.SaveFilesTable = function (jsonObj) {
    fs.writeFileSync('./files.json', JSON.stringify(jsonObj, '\t', 4));
};

HelperFunctions.LoadLocationsTable = function () {
    return JSON.parse(fs.readFileSync('./locations.json').toString());
};

HelperFunctions.SaveLocationsTable = function (jsonObj) {
    fs.writeFileSync('./locations.json', JSON.stringify(jsonObj, '\t', 4));
};

module.exports = HelperFunctions;
