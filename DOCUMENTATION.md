# TextFS Documentation

## Intro

## Verbs

### Overview

List of verbs:

- ExecInternalInstruction
- AddFile
- GetFile
- WriteFile
- DeleteFile
- MoveFile
- CopyFile
- MemCpy
- Defragment
- GrowSize
- ShrinkSize
-

### Verb:

## Internal Instructions

List of internal instructions:

- InitFS
- ReadSector
- WriteSector
- GetFileInfo
- SetFileInfo
- GetFileLocations
- GetLocationInfo
- SetLocationInfo
- RmFile
- GetHeapPointer
- SetHeapPointer


## Helper Functions

List of helper functions:

- LoadDiskImage
- SaveDiskImage
- LoadFilesTable
- SaveFilesTable
- LoadLocationsTable
- SaveLocationsTable

## Block Device Structure

### Overview

Components:

- PartitionMetadata
- FilesTable
- LocationsTable
- ActualSectors

### Component: PartitionMetadata

This is un simple JSON file. It take the initial sector of 4 KB.

Example:

```json
{
    "fs": "TextFS",
    "ver": "0.1.0",
    "sector": 4096,
    "encoding": "hex",
    "heapPointer": 8
}
```

## Data Tables

### Files

PropertyName    | Type          | Description
--------------- | ------------- | ----------
UUID            | Blob          | UUID v4
Path            | String(256B)  |
Size            | UInt64        | How many bytes
CreatedAt       | UInt64        | Description
ModifiedAt      | UInt64        | Description
AccessedAt      | UInt64        | Description
Owner           | String(64B)   | Description
Group           | String(64B)   | Description
Access          | UInt16        | Description

Each record consist of 458 bytes and 1 byte for LF.

### Locations

PropertyName    | Type          | Description
--------------- | ------------- | ----------
Location        | UInt64        | Description
Length          | UInt64        | Description
Next            | UInt64        |
