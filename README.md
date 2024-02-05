![npm version](https://img.shields.io/npm/v/media-organizer.svg?style=flat) [![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

# media-organizer

CLI program for organizing your media files by dates from metadata when applicable or by created file date.

# Installation

To make use of exiftool you will need to download and install the appropriate exiftool package for your system. Also you must have node and npm installed.

**Mac OS X:**

```bash
sudo brew update
sudo brew install exiftool
```

**Ubuntu:**

```bash
sudo apt-get update
sudo apt-get install libimage-exiftool-perl
```

For other systems or for information on how to compile exiftool
from source refer to the [official documentation for exiftool](http://www.sno.phy.queensu.ca/~phil/exiftool/install.html).

You also can use this app without exiftool if file creation date works for you.

```bash
npm i -g media-organizer
```

# Usage

```bash
media-organizer location destination
```

And you will get folders structure:

```bash
tree destination
destination
├── 2016-06-08
│   └── IMG_0005.MOV
├── 2016-12-19
│   └── IMG_0003.MOV
├── 2018-12-25
│   └── MVI_8850.MOV
└── 2019-01-02
    └── GH010108.MP4
```
