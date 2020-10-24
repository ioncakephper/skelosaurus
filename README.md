# skelosaurusv2
Skeleton documentation generator for Docusaurus v2 and v2

## Installation

Install the package globally:

```bash
npm i skelosaurusv2 -g
```

The `skelo` command now available at the command prompt.

## Usage

```txt
Usage: skelo [options] outlineFiles...

Skeleton documentation generator for Docusaurus (v2 and v2)

Options:
  -V, --version         output the version number
  -o, --out <filename>  filename to contains sidebars (default: "sidebars")
  -w, --website <path>  path to store sidebars content file (default: "./")
  -d, --docs <path>     path where markdown files are generated into (default:
                        "./docs")
  --no-v2               generate for Docusaurus v1
  -h, --help            display help for command

```

## Quick example

### Step 1: Create documentation project

Create a working folder `sample`and a documentation outline file `sample.md` which contains documention outline as Markdown.

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
skelo sample -w ./sample-doc -d ./sample-doc/docs
```

The `sample\sample-doc\docs` folder contains `.md` topic source files for your documentation. The `sample\sample-doc\sidebars.js` contains the navigation description.

```txt
Folder PATH listing for volume WINDOWS
Volume serial number is EE03-B6C0
C:.
|   sidebars.js
|   tree.txt
|   
\---docs
        adding-content-and-subtopics.md
        allowing-new-features.md
        building.md
        cli-commands.md
        controversies.md
        create-folders-from-titles.md
        creating-simple-files.md
        delegating-responsabilities.md
        how-to-create-new-features.md
        introduction.md
        sidebars-js.md
        

```

The `sample\sample-doc\sidebars.js` exports the sidebar navigation design.

```javascript
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

Ipsum culpa voluptate consectetur elit tempor esse laboris elit magna. Eiusmod eiusmod aliqua adipisicing mollit non cupidatat commodo enim ea adipisicing. Ipsum magna culpa in cillum in ut proident minim. Id eiusmod quis tempor incididunt laboris esse excepteur dolor. Ea eu fugiat nisi dolor incididunt fugiat consectetur labore veniam.


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


## Functions

<dl>
<dt><a href="#buildCategoryTopics">buildCategoryTopics(bulletList, [options])</a> ⇒ <code>Array.Object</code></dt>
<dd><p>Build list of topics and subcategories in a category.</p>
</dd>
<dt><a href="#buildSectionCategories">buildSectionCategories(bulletList, [options])</a> ⇒ <code>object</code></dt>
<dd><p>Build items of navigation section.</p>
</dd>
<dt><a href="#buildTopicPage">buildTopicPage(title, [options])</a></dt>
<dd><p>Create topic documentation topic in Markdown.</p>
</dd>
<dt><a href="#getSidebars">getSidebars(sourceFilename)</a> ⇒ <code>object</code></dt>
<dd><p>Extract sidebar title and sidebar outline from a Markdown file.</p>
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

## buildCategoryTopics(bulletList, [options]) ⇒ <code>Array.Object</code>
Build list of topics and subcategories in a category.

**Kind**: global function  
**Returns**: <code>Array.Object</code> - List of topics and categories.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| bulletList | <code>Array</code> |  | The bullet list internal representation. |
| [options] | <code>object</code> | <code>{ &#x27;parent&#x27;: &#x27;./&#x27;, &#x27;prefix&#x27;: &#x27;&#x27; }</code> | Options for building topic slug and folders |

<a name="buildSectionCategories"></a>

## buildSectionCategories(bulletList, [options]) ⇒ <code>object</code>
Build items of navigation section.

**Kind**: global function  
**Returns**: <code>object</code> - Key-value where key is category title and value is a list of items or subcategories.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| bulletList | <code>Array</code> |  | The bullet list internal representation. |
| [options] | <code>object</code> | <code>{ &#x27;parent&#x27;: &#x27;./&#x27; }</code> | Options for building section slug |

<a name="buildTopicPage"></a>

## buildTopicPage(title, [options])
Create topic documentation topic in Markdown.

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| title | <code>string</code> |  | Topic title |
| [options] | <code>object</code> | <code>{ &#x27;headers&#x27;: [], &#x27;parent&#x27;: &#x27;./&#x27;, &#x27;prefix&#x27;: &#x27;&#x27; }</code> | Options for creating topic file. |

<a name="getSidebars"></a>

## getSidebars(sourceFilename) ⇒ <code>object</code>
Extract sidebar title and sidebar outline from a Markdown file.

**Kind**: global function  
**Returns**: <code>object</code> - Key-value where key is the sidebar title and value is bullet list tree.  

| Param | Type | Description |
| --- | --- | --- |
| sourceFilename | <code>\*</code> | Filename of a Markdown file with outline |

<a name="saveDocument"></a>

## saveDocument(fileName, content)
Create a text file in utf-8 format from specified name and content

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| fileName | <code>string</code> | Name of the file to create. |
| content | <code>string</code> | String to place in the file. |

<a name="slug"></a>

## slug(source) ⇒ <code>string</code>
Convert specified string into a slug.Converts spaces, tabs, and visible special characters into dashes (-) -- except backslash (\).Compresses sequence of dashes or special characters into a single dash. Removes heading or trailingdashes or special characters from the specified string.

**Kind**: global function  
**Returns**: <code>string</code> - Trimmed, lowercase string with dashes(-)  

| Param | Type | Description |
| --- | --- | --- |
| source | <code>string</code> | String to covert to slug. |





