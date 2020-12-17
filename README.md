![npm](https://img.shields.io/npm/v/skelosaurusv2) ![npm bundle size (version)](https://img.shields.io/bundlephobia/min/skelosaurusv2/2.0.10) ![npm](https://img.shields.io/npm/dw/skelosaurusv2) ![GitHub last commit](https://img.shields.io/github/last-commit/ioncakephper/skelosaurusv2) ![GitHub](https://img.shields.io/github/license/ioncakephper/skelosaurusv2) ![Built with Docusaurus v2](https://img.shields.io/badge/Built%20with-Docusaurus%20v2-blueviolet)

![Outlined with Skelosaurus v2](https://img.shields.io/badge/Outlined%20with-Skelosaurus%20v2-red)


<!-- omit in toc -->
# skelosaurus
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
npm i skelosaurus -g
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
            "introduction",
            "building",
            {
                "type": "category",
                "label": "Generating",
                "items": [
                    "allowing-new-features",
                    "delegating-responsabilities"
                ]
            },
            "controversies"
        ],
        "Guides": [
            "how-to-create-new-features"
        ],
        "API": [
            "cli-commands",
            "sidebars-js"
        ]
    },
    "tutorials": {
        "Tutorial": [
            "creating-simple-files",
            "adding-content-and-subtopics",
            "create-folders-from-titles"
        ]
    }
}
```

The `sample\sample-doc\docs\introduction.md` has the front-matter Docusaurus expects, and is already filled with a lorem ipsum text.

```markdown
---
title: Introduction
id: introduction
sidebar_label: Introduction
---

<!-- @part src="../../sample-doc-parts/introduction/h1-introduction-description.md" -->

Irure est eiusmod pariatur mollit exercitation sunt occaecat consectetur. Id nisi minim eu elit sint esse magna eiusmod commodo consequat ea sunt id amet. Et consectetur ea eiusmod aute sunt mollit est cillum sunt reprehenderit officia non qui commodo. Ad adipisicing adipisicing non cillum exercitation eiusmod est voluptate dolor pariatur nulla cupidatat fugiat. Et non anim nostrud culpa.
<!-- @/part -->

<!-- @part src="../../sample-doc-parts/introduction/h1-introduction-body.md" -->
<!-- Your content goes here, replacing this comment -->
<!-- @/part -->


```

### Step 3: Use skeleton documentation in Docusaurus

Open the `sample\sample-doc\docusaurus.config.js`, and edit the `themeConfig`:

```javascript
  themeConfig: {
    navbar: {
      title: 'My Site',
      logo: {
        alt: 'My Site Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          // to: 'docs/',
          to: 'docs/introduction',
          activeBasePath: 'docs',
          label: 'Docs',
          position: 'left',
        },
        ...
```

Now, start Docusaurus local server.

```bash
cd sample-doc
npm run start
```

Docusaurus does its magic and finally opens up the local documentation site it created. Click `Docs` item in the top navigation menu to see the navigation bar and basic content for each topic.

![Screenshot](./images/Screenshot%202020-10-24%20235147.png)

## Creating documentation folders

### Creating folders automatically

To create folders automatically, use the `-f` or `--autofolders` switch.

```bash
skelo sample -f -w ./sample-folders-doc -d ./sample-folders-doc/docs
```

> Because **`build`** is the default command, you can skip providing the command name explicityly, like in the example above. In the example above, `sample` is the outline filename. If the extension of the outline file is `.md`, you can skip writing it.

This will generate the documentation `.md` files and `sidebars.js` file as before, but it also creates a subfolder for each topic with items. Here is the folder structure in `sample/sample-folders-doc`:

```txt
sample-folders-docs
├── docs
│   ├── adding-content-and-subtopics.md
│   ├── allowing-new-features.md
│   ├── building.md
│   ├── cli-commands.md
│   ├── controversies.md
│   ├── create-folders-from-titles.md
│   ├── creating-simple-files.md
│   ├── delegating-responsabilities.md
│   ├── how-to-create-new-features.md
│   ├── introduction.md
│   ├── overview-07669.md
│   ├── overview-46414.md
│   ├── overview-71580.md
│   ├── overview-96116.md
│   ├── overview.md
│   └── sidebars-js.md
├── sidebars.js
└── tree.txt

```

The `sample\sample-folders-doc\sidebars.js` is also changed to include the file paths.

```javascript
module.exports = {
    "docs": {
        "Getting started": [
            "overview",
            "introduction",
            "building",
            {
                "type": "category",
                "label": "Generating",
                "items": [
                    "overview",
                    "allowing-new-features",
                    "delegating-responsabilities"
                ]
            },
            "controversies"
        ],
        "Guides": [
            "overview",
            "how-to-create-new-features"
        ],
        "API": [
            "overview",
            "cli-commands",
            "sidebars-js"
        ]
    },
    "tutorials": {
        "Tutorial": [
            "overview",
            "creating-simple-files",
            "adding-content-and-subtopics",
            "create-folders-from-titles"
        ]
    }
}
```

### Creating folders selectively

When you want to indicate a topic as a folder in which subtopics will go:

1. use the `@f` marker in your outline file
2. do NOT include the `-f` (`--autofolders`) switch in command line.

## Creating `Overview` pages automatically

Automatically insert an `Overview` documentation page as the first item in a navigation section or list of subtopics. This will save you time and make your documentation have a consistent look.

To create the `Overview` pages automatically, use the `-i` or `--intro` switch. By default, the title of the overview pages is set to `Overview`. You can specify a different title for the overview page with the `--introTitle` option.

```bash
skelo sample -i -f sample -w ./sample-folders-doc -d ./sample-folders-doc
```

## API

### Functions

<dl>
<dt><a href="#buildCategoryTopics">buildCategoryTopics(bulletList, [options])</a> ⇒ <code>Array.Object</code></dt>
<dd><p>Build list of topics and subcategories in a category.</p>
</dd>
<dt><a href="#buildHeaders">buildHeaders(bulletlist, [level])</a> ⇒ <code>Array</code></dt>
<dd><p>Build headers as template variables</p>
</dd>
<dt><a href="#buildSectionCategories">buildSectionCategories(bulletList, [options])</a> ⇒ <code>object</code></dt>
<dd><p>Build items of navigation section.</p>
</dd>
<dt><a href="#buildTopicPage">buildTopicPage(title, [options])</a> ⇒ <code>string</code></dt>
<dd><p>Create topic documentation topic in Markdown.</p>
</dd>
<dt><a href="#getDocumentParts">getDocumentParts(sourceFile)</a></dt>
<dd><p>Get document parts in specified file</p>
</dd>
<dt><a href="#saveDocumentParts">saveDocumentParts(sourceFile, program)</a></dt>
<dd><p>Create parts files for a specified topic document</p>
</dd>
<dt><a href="#getSidebars">getSidebars(sourceFilename)</a> ⇒ <code>object</code></dt>
<dd><p>Extract sidebar title and sidebar outline from a Markdown file.</p>
</dd>
<dt><a href="#getTopicHeaders">getTopicHeaders(bulletlist, Command)</a> ⇒ <code>Array</code></dt>
<dd><p>Build topic top headers</p>
</dd>
<dt><a href="#getUniqueName">getUniqueName(name)</a> ⇒ <code>string</code></dt>
<dd><p>Return a variant string</p>
</dd>
<dt><a href="#hasHeaders">hasHeaders(topicItem)</a> ⇒ <code>boolean</code></dt>
<dd><p>Checks whether the topic has headers</p>
</dd>
<dt><a href="#isSingleTopic">isSingleTopic(topicItem)</a> ⇒ <code>boolean</code></dt>
<dd><p>Checks whether a topic has children topics</p>
</dd>
<dt><a href="#makeid">makeid(length)</a> ⇒ <code>string</code></dt>
<dd><p>Return a random string with digital characters of specified length</p>
</dd>
<dt><a href="#parseTitle">parseTitle(topicTitle)</a> ⇒ <code>object</code></dt>
<dd><p>Extract topic title to extract relevant information</p>
</dd>
<dt><a href="#saveDocument">saveDocument(fileName, content)</a></dt>
<dd><p>Create a text file in utf-8 format from specified name and content</p>
</dd>
<dt><a href="#slug">slug(source)</a> ⇒ <code>string</code></dt>
<dd><p>Convert specified string into a slug.</p>
<p>Converts spaces, tabs, and visible special characters into dashes (-) -- except backslash ().
Compresses sequence of dashes or special characters into a single dash. Removes heading or trailing
dashes or special characters from the specified string.</p>
</dd>
</dl>

<a name="buildCategoryTopics"></a>

### buildCategoryTopics(bulletList, [options]) ⇒ <code>Array.Object</code>
Build list of topics and subcategories in a category.

**Kind**: global function  
**Returns**: <code>Array.Object</code> - List of topics and categories.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| bulletList | <code>Array</code> |  | The bullet list internal representation. |
| [options] | <code>object</code> | <code>{ &#x27;parent&#x27;: &#x27;./&#x27;, &#x27;prefix&#x27;: &#x27;&#x27; }</code> | Options for building topic slug and folders |

<a name="buildHeaders"></a>

### buildHeaders(bulletlist, [level]) ⇒ <code>Array</code>
Build headers as template variables

**Kind**: global function  
**Returns**: <code>Array</code> - Array of objects where each object is a set of template variables  
**Opts**: <code>object</code> Command line options passed as properties  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| bulletlist | <code>Array</code> |  | Representation of list in Markdown abstract tree |
| [level] | <code>number</code> | <code>2</code> | Heading level for Markdown notation |

<a name="buildSectionCategories"></a>

### buildSectionCategories(bulletList, [options]) ⇒ <code>object</code>
Build items of navigation section.

**Kind**: global function  
**Returns**: <code>object</code> - Key-value where key is category title and value is a list of items or subcategories.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| bulletList | <code>Array</code> |  | The bullet list internal representation. |
| [options] | <code>object</code> | <code>{ &#x27;parent&#x27;: &#x27;./&#x27; }</code> | Options for building section slug |

<a name="buildTopicPage"></a>

### buildTopicPage(title, [options]) ⇒ <code>string</code>
Create topic documentation topic in Markdown.

**Kind**: global function  
**Returns**: <code>string</code> - Topic unique slug  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| title | <code>string</code> |  | Topic title |
| [options] | <code>object</code> | <code>{ &#x27;headers&#x27;: [], &#x27;parent&#x27;: &#x27;./&#x27;, &#x27;prefix&#x27;: &#x27;&#x27; }</code> | Options for creating topic file. |

<a name="getDocumentParts"></a>

### getDocumentParts(sourceFile)
Get document parts in specified file

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| sourceFile | <code>string</code> | Path to documentation file  @ @returns {Array.{targetPath: string, content: string}} Array of part object, each part has targetPath and content properties |

<a name="saveDocumentParts"></a>

### saveDocumentParts(sourceFile, program)
Create parts files for a specified topic document

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| sourceFile | <code>string</code> | Path to topic document |
| program | <code>object</code> | Options passed on command |

<a name="getSidebars"></a>

### getSidebars(sourceFilename) ⇒ <code>object</code>
Extract sidebar title and sidebar outline from a Markdown file.

**Kind**: global function  
**Returns**: <code>object</code> - Key-value where key is the sidebar title and value is bullet list tree.  

| Param | Type | Description |
| --- | --- | --- |
| sourceFilename | <code>string</code> | Filename of a Markdown file with outline |

<a name="getTopicHeaders"></a>

### getTopicHeaders(bulletlist, Command) ⇒ <code>Array</code>
Build topic top headers

**Kind**: global function  
**Returns**: <code>Array</code> - Headers in markdown notation  

| Param | Type | Description |
| --- | --- | --- |
| bulletlist | <code>Array</code> | Header list represented in Markdown abstrat tree |
| Command | <code>object</code> | line options passed as properties |

<a name="getUniqueName"></a>

### getUniqueName(name) ⇒ <code>string</code>
Return a variant string

**Kind**: global function  
**Returns**: <code>string</code> - Original string with suffixed text  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name to check for uniqueness |

<a name="hasHeaders"></a>

### hasHeaders(topicItem) ⇒ <code>boolean</code>
Checks whether the topic has headers

**Kind**: global function  
**Returns**: <code>boolean</code> - true if topic has headers, false otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| topicItem | <code>object</code> | Topic to test whether it has headers |

<a name="isSingleTopic"></a>

### isSingleTopic(topicItem) ⇒ <code>boolean</code>
Checks whether a topic has children topics

**Kind**: global function  
**Returns**: <code>boolean</code> - true if single topic, false otherwise  

| Param | Type | Description |
| --- | --- | --- |
| topicItem | <code>object</code> | Topic to test whether it is single topic |

<a name="makeid"></a>

### makeid(length) ⇒ <code>string</code>
Return a random string with digital characters of specified length

**Kind**: global function  
**Returns**: <code>string</code> - Randomly chosen characters of specified length  

| Param | Type | Description |
| --- | --- | --- |
| length | <code>number</code> | The length of string to return. |

<a name="parseTitle"></a>

### parseTitle(topicTitle) ⇒ <code>object</code>
Extract topic title to extract relevant information

**Kind**: global function  
**Returns**: <code>object</code> - Properties extracted from title  

| Param | Type | Description |
| --- | --- | --- |
| topicTitle | <code>object</code> | Topic title to parse. |

<a name="saveDocument"></a>

### saveDocument(fileName, content)
Create a text file in utf-8 format from specified name and content

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| fileName | <code>string</code> | Name of the file to create. |
| content | <code>string</code> | String to place in the file. |

<a name="slug"></a>

### slug(source) ⇒ <code>string</code>
Convert specified string into a slug.Converts spaces, tabs, and visible special characters into dashes (-) -- except backslash (\).Compresses sequence of dashes or special characters into a single dash. Removes heading or trailingdashes or special characters from the specified string.

**Kind**: global function  
**Returns**: <code>string</code> - Trimmed, lowercase string with dashes(-)  

| Param | Type | Description |
| --- | --- | --- |
| source | <code>string</code> | String to covert to slug. |



## License

MIT License

Copyright (c) 2020 Ion Gireada

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.




