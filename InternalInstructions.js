const fs = require('fs');

const InternalInstructions = {};

InternalInstructions.InitFS = function (options) {
    var optionsDefault = {
        sector: 4096,
        encoding: 'hex'
    };
    if (options !== undefined && options !== null && options instanceof Object) {
        if (options.sector !== undefined && typeof(options.sector) === 'number' && options.sector <= 4096 && options.sector >= 512) {
            optionsDefault = options.sector;
        };
    };
    var fsmetadata = {
        "fs": "TextFS",
        "ver": "0.1.0",
        "sector": 4096,
        "encoding": "hex",
        "heapPointer": 4
    };
    Object.keys(optionsDefault).map(function (x) {
        fsmetadata[x] = optionsDefault[x];
    });
    var bufferText = Buffer.from(JSON.stringify(fsmetadata), 'utf8').toString('hex').padEnd(fsmetadata.sector * 2, '0') + '\n';
    bufferText += (new Array(8)).fill((new Array(fsmetadata.sector*2)).fill('0').join('')).join('\n');
    console.log(bufferText);
    console.log(bufferText.length);
    return bufferText;
};

InternalInstructions.ReadSector = function (dskimgtxt, sectorindex) {
    var dskimgarr = dskimgtxt.trim().split('\n');
    return dskimgarr[sectorindex];
};
InternalInstructions.WriteSector = function () {};
InternalInstructions.ParseFSMetadata = function (initSector) {};

module.exports = InternalInstructions;
