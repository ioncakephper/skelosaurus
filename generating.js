const jsonschema = require('jsonschema');
const yamljs = require('yamljs');
const fs = require('fs');


// const outlineSchema = 

// {
//     "$schema": "https://json-schema.org/draft/2020-12/schema",
//     "$id": "https://example.com/schemas/sidebar-configuration.json",
//     "title": "Sidebar Configuration Schema",
//     "type": "object",
//     "allOf": [
//         { "$ref": "#/definitions/commonObject" }
//     ],
//     "properties": {
//         "sidebars": {
//             "type": "array",
//             "contains": {
//                 "oneOf": [
//                     { "type": "string" },
//                     { "$ref": "#/definitions/basicObject" },
//                     { "$ref": '#/definitions/categoryObject' }
//                 ]
//             }
//         },
//         "type": { "type": "string", "const": "sidebar" }
//     },
//     "required": ["sidebars"],
//     "additionalProperties": true,
//     "todo": "add examples, add descriptions",
//     "definitions": {
//         "labelString": {
//             "type": "string",
//             'minLength': 1
//         },
//         "pathString": {
//             "type": "string",
//             "pattern": "^([a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*)$"
//         },
//         "slugString": {
//             "type": "string",
//             "pattern": "^([a-z0-9]([-_][a-z0-9]+)*)?[a-z0-9]$"
//         },
//         "commonObject": {
//             "type": "object",
//             "properties": {
//                 "id": { "$ref": "#/definitions/slugString" },
//                 "slug": { "$ref": "#/definitions/slugString" },
//                 "title": { "type": "string" },
//                 "brief": { "type": "string" },
//                 "description": { "type": "string" },
//                 "path": { "$ref": "#/definitions/pathString" },
//                 "tags": { "type": "array", "items": { "type": "string" } }
//             },
//             "additionalProperties": true
//         },
//         "basicObject": {
//             "type": "object",
//             "allOf": [
//                 { "$ref": "#/definitions/commonObject" }
//             ],
//             "properties": {
//                 "label": { "$ref": "#/definitions/labelString" }
//             },
//             "required": ["label"],
//             "additionalProperties": true
//         },
//         "categoryObject": {
//             "type": "object",
//             "allOf": [
//                 { "$ref": "#/definitions/basicObject" }
//             ],
//             "properties": {
//                 "type": { "type": "string", "const": "category" },
//                 "items": {
//                     "type": "array",
//                     "contains": {
//                         "oneOf": [
//                             { "type": "string" },
//                             { "$ref": "#/definitions/basicObject" },
//                             { "$ref": '#/definitions/categoryObject' },
//                             { "$ref": '#/definitions/topicObject' },
//                             { "$ref": '#/definitions/linkObject' }
//                         ]
//                     }
//                 }
//             },
//             "required": ["items"],
//             "additionalProperties": true
//         },
//         "topicObject": {
//             "type": "object",
//             "allOf": [
//                 { "$ref": "#/definitions/basicObject" }
//             ],
//             "properties": {
//                 "type": { "type": "string", "const": "topic" },
//                 "headings": {
//                     "type": "array",
//                     "contains": {
//                         "oneOf": [
//                             { "type": "string" },
//                             { "$ref": '#/definitions/headingObject' }
//                         ]
//                     }
//                 }
//             },
//             "required": ["headings"],
//             "additionalProperties": true
//         },
//         "headingObject": {
//             "type": "object",
//             "allOf": [
//                 { "$ref": "#/definitions/basicObject" }
//             ],
//             "properties": {
//                 "type": { "type": "string", "const": "heading" },
//                 "items": {
//                     "type": "array",
//                     "contains": {
//                         "oneOf": [
//                             { "type": "string" },
//                             { "$ref": '#/definitions/headingObject' }
//                         ]
//                     }
//                 }
//             },
//             "additionalProperties": true
//         },
//         "linkObject": {
//             "type": "object",
//             "allOf": [
//                 { "$ref": "#/definitions/basicObject" }
//             ],
//             "properties": {
//                 "type": { "type": "string", "const": "link" },
//                 "href": { "type": "string" },
//             },
//             "required": ["href"],
//             "additionalProperties": false
//         }
//     }
// }

// const outlineSchema = yamljs.parse(fs.readFileSync('outline.schema.yaml', 'utf8'));

// fs.writeFileSync('outline.schema.json', JSON.stringify(outlineSchema, null, 2));
// fs.writeFileSync('outline.schema.yaml', yamljs.stringify(outlineSchema, 10, 4));

let outlineSchema = JSON.parse(fs.readFileSync('outline.schema.json', 'utf8'));
let onlineSchema = JSON.parse(JSON.stringify(outlineSchema));
onlineSchema.schema = onlineSchema.$schema;
delete onlineSchema.$schema;
onlineSchema.id = onlineSchema.$id;
delete onlineSchema.$id;
function rewriteRefs(schema) {
    if (Array.isArray(schema)) {
        schema.forEach(rewriteRefs);
    } else if (schema !== null && typeof schema === 'object') {
        if (schema.ref) {
            schema.ref = schema.$ref;
            delete schema.$ref;
        }
        Object.keys(schema).forEach(key => rewriteRefs(schema[key]));
    }
}
rewriteRefs(onlineSchema);
console.log(JSON.stringify(onlineSchema, null, 2));
onlineSchema.id = onlineSchema.id.replace(/\.json$/, '.yaml');

fs.writeFileSync('outline.schema.yaml', yamljs.stringify(outlineSchema, 10, 4));

const validateOutline = (outline) => {
    const result = jsonschema.validate(outline, outlineSchema);
    if (!result.valid) {
        console.error('Error validating outline content:', result.errors);
        process.exit(1);
    }
    return outline;
};
// let outline = yamljs.parse(`
// path: "some-path"
// sidebars:
//     - Simple string
//     - label: Simple string
//     - label: "Category"
//       items:
//         - label: "Sub-item"
//         - label: "Sub-item 2"
//         - label: "External link"
//           href: "https://www.google.com"
//         - label: "Sub-item 3"
//           headings:
//             - label: "Heading 1"
//             - label: "Heading 2"
//               items:
//                 - label: "Sub-heading 1"
//                 - label: "Sub-heading 2"
//     - label: "Category 2"
// `);
let outline = yamljs.parse(fs.readFileSync('sample.outline.yaml', 'utf8'));
let validatedOutline = validateOutline(outline);
console.log(JSON.stringify(validatedOutline, null, 2));
