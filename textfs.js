const fs = require('fs');
const child_process = require('child_process');
const HelperFunctions = require('./HelperFunctions.js');
const InternalInstructions = require('./InternalInstructions.js');

const VERB = process.argv[2];
const ARGS = process.argv.slice(3);

if (VERB === 'ExecInternalInstruction') {
    var ii = ARGS[0];
    console.log(ii);
    var iiargs = ARGS.slice(1);
    InternalInstructions[ii].apply(null, iiargs);
};

if (VERB === 'InitFS') {
    var SIZE = parseInt(ARGS[0]);
    var SECTOR = parseInt(ARGS[1]);
    console.log(ARGS);
    var dskimgtxt = InternalInstructions.InitFS({
        disksize: SIZE,
        sector: SECTOR
    });
    HelperFunctions.SaveDiskImage(dskimgtxt);
};

if (VERB === 'AddFile') {
    // Generate UUID
    child_process.exec('uuidgen -t', function (err, stdin, stderr) {
        if (err) {
            return 1;
        };
        var uuid = stdin.trim();
        // Load disk
        var dskimgtxt = HelperFunctions.LoadDiskImage();
        var FILEPATH_INPUT = ARGS[0];
        var FILEPATH_DEST = ARGS[1];
        var fsmetadata = InternalInstructions.ReadFSMetadata(dskimgtxt);
        console.log(fsmetadata);
        // Load tables
        var FilesTable = HelperFunctions.LoadFilesTable();
        var LocationsTable = HelperFunctions.LoadLocationsTable();
        // Get the file
        var theFile = fs.readFileSync(FILEPATH_INPUT).toString('hex');
        console.log('INFO: File Content: ' + theFile.toUpperCase() + ` (${theFile.length/2} bytes)`);
        if (theFile.length > fsmetadata.sector * 1.9) {
            console.log('ERROR: Too large.');
            return 1;
        };
        var heapPointer = fsmetadata.heapPointer;
        // Update tables
        LocationsTable[fsmetadata.heapPointer] = {
            Location: fsmetadata.heapPointer,
            Length: 1,
            Next: null
        };
        FilesTable[uuid] = {
            Uuid: uuid,
            FilePath: FILEPATH_DEST,
            Size: theFile.length/2,
            Location: fsmetadata.heapPointer,
            CreatedAt: Date.now()
        };
        fsmetadata.heapPointer += 1;
        // Write sectors
        var bufferText = theFile.padEnd(fsmetadata.sector * 2, '0');
        dskimgtxt = InternalInstructions.WriteSector(dskimgtxt, heapPointer, bufferText);
        // Save tables
        HelperFunctions.SaveFilesTable(FilesTable);
        HelperFunctions.SaveLocationsTable(LocationsTable);
        // Save disk
        fs.writeFileSync('./fsmetadata.json', JSON.stringify(fsmetadata, '\t', 4));
        dskimgtxt = InternalInstructions.WriteFSMetadata(dskimgtxt, fsmetadata);
        HelperFunctions.SaveDiskImage(dskimgtxt);
    });
};

if (VERB === 'GetFile') {
    var FILEPATH_DEST = ARGS[0];
    var dskimgtxt = HelperFunctions.LoadDiskImage();
    var fsmetadata = JSON.parse(Buffer.from(InternalInstructions.ReadSector(dskimgtxt, 0).replace(/0/g, ' ').trimEnd().replace(/ /g, '0'), 'hex').toString());
    // console.log(fsmetadata);
    // Load tables
    var FilesTable = HelperFunctions.LoadFilesTable();
    var LocationsTable = HelperFunctions.LoadLocationsTable();
    // Get file info
    var query0 = InternalInstructions.GetFileInfo(FilesTable);
    if (query0.err !== 0) {
        console.log(`ERROR: Files does not exist.`);
        process.exit(1);
    };
    var fileInfo = query0.fileInfo;
    var locationStart = fileInfo.Location;
    var locationLength = LocationsTable[locationStart].Span;
    var sectorstxt = dskimgtxt.split('\n').slice(locationStart).slice(0, locationLength).join('\n');
    var actualdata = Buffer.from(sectorstxt.slice(0, fileInfo.Size * 2), 'hex');
    process.stdout.write(actualdata);
};
