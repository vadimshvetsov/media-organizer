![npm version](https://img.shields.io/npm/v/media-organizer.svg?style=flat) [![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

# media-organizer

CLI program for organizing your media files by dates and custom rules of diffing them with metadata. EXIF metadata from files takes by cli utility [exiftool](http://owl.phy.queensu.ca/~phil/exiftool/). Here is a [full list of supported filetypes](http://www.sno.phy.queensu.ca/~phil/exiftool/#supported).

![Demo](https://user-images.githubusercontent.com/16336572/51447009-7e852e00-1d2a-11e9-85f9-ae881d6d419f.gif)

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

For other systems or for information on how to compile exiftool from source refer to the [official documentation for exiftool](http://www.sno.phy.queensu.ca/~phil/exiftool/install.html).

```bash
npm i -g media-organizer
```

# Usage

Create JSON config file with rules and pathes:

```json
{
  "rules": [
    {
      "path": ["iPhone 7"],
      "metadata": {
        "model": "iPhone 7"
      }
    },
    {
      "path": ["iPad Pro"],
      "metadata": {
        "model": "iPad Pro"
      }
    },
    {
      "path": ["GoPro HERO7 Black"],
      "metadata": {
        "cameraModelName": "HERO7 Black"
      }
    },
    {
      "path": ["Canon EOS 70D"],
      "metadata": {
        "model": "Canon EOS 70D"
      }
    }
  ]
}
```

Then launch `media-organizer`:

```bash
media-organizer -c config.json location destination
```

And you will get folders structure:

```bash
tree destination
destination
├── 2016-06-08
│   └── iPad\ Pro
│       └── IMG_0005.MOV
├── 2016-12-19
│   └── iPhone\ 7
│       └── IMG_0003.MOV
├── 2018-12-25
│   └── Canon\ EOS\ 70D
│       └── MVI_8850.MOV
└── 2019-01-02
    └── GoPro\ HERO7\ Black
            └── GH010108.MP4
```
