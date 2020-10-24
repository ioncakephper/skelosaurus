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

1. Create a documentation project folder `sample`and a documentation outline file `sample.md` which contains documention outline as Markdown.

```bash
mkdir sample
cd sample
type sample.md
```

In `sample.md` copy the following:

```markdown
!import[/sample.md]
```

2. Generate skeleton documentation with `skelo`:

```bash
skelo sample
```

Inside `sample` documentation folder, the `docs` folder contains `.md` files -- the source files for your documentation. The `sidebars.js` contains the navigation description.

```txt
!import[/sample/tree.txt]
```

The `sidebars.js` exports the sidebar navigation design.

```javascript
!import[/sample/sidebars.js]
```

The `docs/introduction.md` has the front-matter Docusaurus expects, and is already filled with a lorem ipsum text.

```markdown
!import[/sample/docs/introduction.md]
```

!import[/index-js-jsdoc.md]
!export[/README.md]
