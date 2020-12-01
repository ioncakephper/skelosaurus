![npm](https://img.shields.io/npm/v/skelosaurusv2) ![npm bundle size (version)](https://img.shields.io/bundlephobia/min/skelosaurusv2/2.0.7) ![npm](https://img.shields.io/npm/dw/skelosaurusv2) ![GitHub last commit](https://img.shields.io/github/last-commit/ioncakephper/skelosaurusv2) ![GitHub](https://img.shields.io/github/license/ioncakephper/skelosaurusv2) ![Built with Docusaurus v2](https://img.shields.io/badge/Built%20with-Docusaurus%20v2-blueviolet)

![Outlined with Skelosaurus v2](https://img.shields.io/badge/Outlined%20with-Skelosaurus%20v2-red)


<!-- omit in toc -->
# skelosaurusv2
Skeleton documentation generator for Docusaurus v2 and v1

- [Installation](#installation)
- [Usage](#usage)
  - [`skelo -h`](#skelo--h)
  - [`skelo help build`](#skelo-help-build)
  - [`skelo help load`](#skelo-help-load)
  - [`skelo help save`](#skelo-help-save)
- [Quick example](#quick-example)
  - [Step 1: Create documentation project](#step-1-create-documentation-project)
  - [Step 2: Generate skeleton](#step-2-generate-skeleton)
  - [Step 3: Use skeleton documentation in Docusaurus](#step-3-use-skeleton-documentation-in-docusaurus)
- [Creating documentation folders](#creating-documentation-folders)
  - [Creating folders automatically](#creating-folders-automatically)
  - [Creating folders selectively](#creating-folders-selectively)
- [Creating `Overview` pages automatically](#creating-overview-pages-automatically)
- [API](#api)
- [License](#license)

## Installation

Install the package globally:

```bash
npm i skelosaurusv2 -g
```

The `skelo` command now available at the command prompt.

## Usage

### `skelo -h`

See commands and general options.

```txt
Usage: skelo [options] outlineFiles...

Skeleton documentation generator for Docusaurus (v2 and v2)

Options:
  -V, --version                 output the version number
  -h, --help                    display help for command

Commands:
  build [options] <sources...>  build doc files and sidebars file
  load [options]                load documentation parts into respective
                                files
  save [options]                save documentation parts into respective
                                files
  help [command]                display help for command

```

> **`build`** is the default command, so you can provide its  arguments and options without including the `build` command.


### `skelo help build`

See arguments and options for `build` command.

```txt
Usage: skelo build [options] <sources...>

build doc files and sidebars file

Options:
  -c, --clear           start with a clear docs path
  -d, --docs <path>     path where markdown files are generated into (default:
                        "./docs")
  -f, --autofolder      create subfolder for categories and subtopics (default:
                        false)
  -i, --intro           create in Intro page in each subcategory
  --introTitle [title]  title to use in intro pages (default: "Overview")
  --no-v2               generate for Docusaurus v1
  -o, --out <filename>  filename to contains sidebars (default: "sidebars")
  -p, --parts [path]    path where parts will be stored (default: "./")
  -w, --website <path>  path to store sidebars content file (default: "./")
  -h, --help            display help for command

```

### `skelo help load`

See arguments and options for `load` command.

```txt
Usage: skelo load [options]

load documentation parts into respective files

Options:
  -d, --docs <path>     path where markdown files are generated into (default:
                        "./docs")
  -w, --website <path>  path to store sidebars content file (default: "./")
  -h, --help            display help for command

```

### `skelo help save`

See arguments and options for `save` command.

```txt
Usage: skelo save [options]

save documentation parts into respective files

Options:
  -d, --docs <path>     path where markdown files are generated into (default:
                        "./docs")
  -w, --website <path>  path to store sidebars content file (default: "./")
  -h, --help            display help for command

```

## Quick example

### Step 1: Create documentation project

Create a working folder `sample` and a documentation outline file `sample.md` which contains documention outline as Markdown.

```bash
mkdir sample
cd sample
echo Documentation outline for Docusaurus > sample.md
```

In `sample.md` copy the following:

```markdown
An example of using Markdown to design documentation structure for Docusaurus v1 and v2.

## docs

- Getting started
    - Introduction
    - Building
    - Generating
        - Allowing new features
        - Delegating responsabilities
    - Controversies
- Guides
    - How to create new features
- API
    - CLI commands
    - sidebars.js

## tutorials

- Tutorial
    - Creating simple files
    - Adding content and subtopics
    - Create folders from titles

```

Install Docusaurus in your working folder.

```bash
npx @docusaurus/init@next init sample-doc classic
```

This will create the `sample-doc` documentation project as inside your working folder.

### Step 2: Generate skeleton

Generate skeleton documentation with `skelo`:

```bash
skelo build sample -w ./sample-doc -d ./sample-doc/docs
```

The `sample\sample-doc\docs` folder contains `.md` topic source files for your documentation. The `sample\sample-doc\sidebars.js` contains the navigation description.

```txt
sample-doc
├── docs
│   ├── installation.md
│   └── other-topic.md
└── sidebars.js

```

The `sample\sample-doc\sidebars.js` exports the sidebar navigation design.

```javascript
/**
* Sidebar definitions for Docusaurus v2
*/

module.exports = {
    "docs": {
        "Getting started": [
            "getting-started/overview",
            {
                "type": "category",
                "label": "Another page",
                "items": [
                    "getting-started/another-page/overview",
                    "getting-started/another-page/bring-another-page",
                    "getting-started/another-page/second-page-goes-here"
                ]
            },
            "getting-started/installation",
            "getting-started/other-topic"
        ]
    }
}
```

The `sample\sample-doc\docs\introduction.md` has the front-matter Docusaurus expects, and is already filled with a lorem ipsum text.

```markdown
