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