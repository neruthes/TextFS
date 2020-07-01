const fs = require('fs');
const HelperFunctions = require('./HelperFunctions.js');
const InternalInstructions = require('./InternalInstructions.js');

console.log('InternalInstructions');
console.log(InternalInstructions.InitFS);

const VERB = process.argv[2];
const ARGS = process.argv.slice(3);

console.log('VERB', VERB);
console.log('ARGS', ARGS);

if (VERB === 'ExecInternalInstruction') {
    var ii = ARGS[0];
    console.log(ii);
    var iiargs = ARGS.slice(1);
    InternalInstructions[ii].apply(null, iiargs);
};

if (VERB === 'InitFS') {
    var SIZE = ARGS[0];
    var SECTOR = ARGS[1];
    var dskimgtxt = InternalInstructions.InitFS({
        size: SIZE,
        sector: SECTOR
    });
    HelperFunctions.SaveDiskImage(dskimgtxt);
};

if (VERB === 'AddFile') {
    // Load disk
    var dskimgtxt = HelperFunctions.LoadDiskImage();
    var FILEPATH = ARGS[0];
    var dskimgtxt = InternalInstructions.InitFS({
        size: size,
        sector: sector
    });
    // Load tables
    var FilesTable = HelperFunctions.LoadFilesTable();
    var LocationsTable = HelperFunctions.LoadLocationsTable();
    // Get the file
    // Update tables

    
    // Save tables
    HelperFunctions.SaveFilesTable(FilesTable);
    HelperFunctions.SaveLocationsTable(LocationsTable);
    // Save disk
    HelperFunctions.SaveDiskImage(dskimgtxt);
};
