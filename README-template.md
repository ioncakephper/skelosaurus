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
!import[/index-js-help.txt]
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
!import[/sample.md]
```

Install Docusaurus in your project folder.

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
!import[/sample/tree.txt]
```

The `sidebars.js` exports the sidebar navigation design.

```javascript
!import[/sample/sample-doc/sidebars.js]
```

The `docs/introduction.md` has the front-matter Docusaurus expects, and is already filled with a lorem ipsum text.

```markdown
!import[/sample/sample-doc/docs/introduction.md]
```


### Step 3: Use it with Docusaurus

Open the `sample/sample-doc/docusaurus.config.js`, and edit the `themeConfig`:

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

After going through the files, Docusaurus has a local server ready to show you the documentation.


!import[/index-js-jsdoc.md]


!export[/README.md]
