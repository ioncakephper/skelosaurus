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