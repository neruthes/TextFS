const fs = require('fs');
//const InternalInstructions = require('./InternalInstructions.js');

const InternalInstructions = {};

InternalInstructions.InitFS = function (options) {
    var optionsDefault = {
        disksize: 32,
        sector: 512,
        encoding: 'hex'
    };
    if (options !== undefined && options !== null && options instanceof Object) {
        if (options.sector !== undefined && typeof(options.sector) === 'number' && options.sector <= 4096 && options.sector >= 512) {
            optionsDefault.sector = options.sector;
        };
        if (options.disksize !== undefined && typeof(options.disksize) === 'number' && options.disksize <= 4096 && options.disksize >= 4) {
            optionsDefault.disksize = options.disksize;
        };
    };
    var fsmetadata = {
        "disksize": 32,
        "fs": "TextFS",
        "ver": "0.1.0",
        "sector": 512,
        "encoding": "hex",
        "heapPointer": 1
    };
    Object.keys(optionsDefault).map(function (x) {
        fsmetadata[x] = optionsDefault[x];
    });
    var bufferText = Buffer.from(JSON.stringify(fsmetadata), 'utf8').toString('hex').padEnd(fsmetadata.sector * 2, '0');
    bufferText += '\n' + (new Array(optionsDefault.disksize-1)).fill('0'.padEnd(fsmetadata.sector * 2, '0')).join('\n');
    console.log(fsmetadata.sector + 'x' + fsmetadata.disksize);

    fs.writeFileSync('./files.json', JSON.stringify({}));
    fs.writeFileSync('./locations.json', JSON.stringify({}));
    fs.writeFileSync('./fsmetadata.json', JSON.stringify(fsmetadata, '\t', 4));
    return bufferText;
};

InternalInstructions.ReadSector = function (dskimgtxt, sectorindex) {
    var dskimgarr = dskimgtxt.trim().split('\n');
    return dskimgarr[sectorindex];
};
InternalInstructions.WriteSector = function (dskimgtxt, sectorindex, sectordata) {
    var dskimgarr = dskimgtxt.trim().split('\n');
    dskimgarr[sectorindex] = sectordata;
    return dskimgarr.join('\n');
};
InternalInstructions.ReadFSMetadata = function (dskimgtxt) {
    var fsmetadata = JSON.parse(Buffer.from(InternalInstructions.ReadSector(dskimgtxt, 0).replace(/0/g, ' ').trimEnd().replace(/ /g, '0'), 'hex').toString());
    return fsmetadata
};
InternalInstructions.WriteFSMetadata = function (dskimgtxt, fsmetadata) {
    var initialSectorContent = Buffer.from(JSON.stringify(fsmetadata)).toString('hex').padEnd(fsmetadata.sector * 2, '0');
    var newdskimgtxt = InternalInstructions.WriteSector(dskimgtxt, 0, initialSectorContent);
    return newdskimgtxt;
};
InternalInstructions.GetFileInfo = function (FilesTable, FilePath) {
    var query1 = Object.keys(FilesTable).map(x => FilesTable[x]).filter(x => x.Path === FilePath);
    if (query1.length > 0) {
        return {
            err: 0,
            fileInfo: query1[0]
        };
    } else {
        return {
            err: 1,
            errMsg: 'File does not exist.'
        };
    };
};

module.exports = InternalInstructions;
