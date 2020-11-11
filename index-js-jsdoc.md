<a name="module_skelosaurusv2"></a>

### skelosaurusv2
**Author**: Ion Gireada  

* [skelosaurusv2](#module_skelosaurusv2)
    * [~buildCategoryTopics(bulletList, [options])](#module_skelosaurusv2..buildCategoryTopics) ⇒ <code>Array.Object</code>
    * [~buildHeaders(bulletlist, [level])](#module_skelosaurusv2..buildHeaders) ⇒ <code>Array</code>
    * [~buildSectionCategories(bulletList, [options])](#module_skelosaurusv2..buildSectionCategories) ⇒ <code>object</code>
    * [~buildTopicPage(title, [options])](#module_skelosaurusv2..buildTopicPage) ⇒ <code>string</code>
    * [~getDocumentParts(sourceFile)](#module_skelosaurusv2..getDocumentParts)
    * [~saveDocumentParts(sourceFile, program)](#module_skelosaurusv2..saveDocumentParts)
    * [~getSidebars(sourceFilename)](#module_skelosaurusv2..getSidebars) ⇒ <code>object</code>
    * [~getTopicHeaders(bulletlist)](#module_skelosaurusv2..getTopicHeaders) ⇒ <code>Array</code>
    * [~getUniqueName(name)](#module_skelosaurusv2..getUniqueName) ⇒ <code>string</code>
    * [~hasHeaders(topicItem)](#module_skelosaurusv2..hasHeaders) ⇒ <code>boolean</code>
    * [~isSingleTopic(topicItem)](#module_skelosaurusv2..isSingleTopic) ⇒ <code>boolean</code>
    * [~makeid(length)](#module_skelosaurusv2..makeid) ⇒ <code>string</code>
    * [~parseTitle(topicTitle)](#module_skelosaurusv2..parseTitle) ⇒ <code>object</code>
    * [~saveDocument(fileName, content)](#module_skelosaurusv2..saveDocument)
    * [~slug(source)](#module_skelosaurusv2..slug) ⇒ <code>string</code>

<a name="module_skelosaurusv2..buildCategoryTopics"></a>

#### skelosaurusv2~buildCategoryTopics(bulletList, [options]) ⇒ <code>Array.Object</code>
Build list of topics and subcategories in a category.

**Kind**: inner method of [<code>skelosaurusv2</code>](#module_skelosaurusv2)  
**Returns**: <code>Array.Object</code> - List of topics and categories.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| bulletList | <code>Array</code> |  | The bullet list internal representation. |
| [options] | <code>object</code> | <code>{ &#x27;parent&#x27;: &#x27;./&#x27;, &#x27;prefix&#x27;: &#x27;&#x27; }</code> | Options for building topic slug and folders |

<a name="module_skelosaurusv2..buildHeaders"></a>

#### skelosaurusv2~buildHeaders(bulletlist, [level]) ⇒ <code>Array</code>
Build headers as template variables

**Kind**: inner method of [<code>skelosaurusv2</code>](#module_skelosaurusv2)  
**Returns**: <code>Array</code> - Array of objects where each object is a set of template variables  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| bulletlist | <code>Array</code> |  | Representation of list in Markdown abstract tree |
| [level] | <code>number</code> | <code>2</code> | Heading level for Markdown notation |

<a name="module_skelosaurusv2..buildSectionCategories"></a>

#### skelosaurusv2~buildSectionCategories(bulletList, [options]) ⇒ <code>object</code>
Build items of navigation section.

**Kind**: inner method of [<code>skelosaurusv2</code>](#module_skelosaurusv2)  
**Returns**: <code>object</code> - Key-value where key is category title and value is a list of items or subcategories.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| bulletList | <code>Array</code> |  | The bullet list internal representation. |
| [options] | <code>object</code> | <code>{ &#x27;parent&#x27;: &#x27;./&#x27; }</code> | Options for building section slug |

<a name="module_skelosaurusv2..buildTopicPage"></a>

#### skelosaurusv2~buildTopicPage(title, [options]) ⇒ <code>string</code>
Create topic documentation topic in Markdown.

**Kind**: inner method of [<code>skelosaurusv2</code>](#module_skelosaurusv2)  
**Returns**: <code>string</code> - Topic unique slug  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| title | <code>string</code> |  | Topic title |
| [options] | <code>object</code> | <code>{ &#x27;headers&#x27;: [], &#x27;parent&#x27;: &#x27;./&#x27;, &#x27;prefix&#x27;: &#x27;&#x27; }</code> | Options for creating topic file. |

<a name="module_skelosaurusv2..getDocumentParts"></a>

#### skelosaurusv2~getDocumentParts(sourceFile)
Get document parts in specified file

**Kind**: inner method of [<code>skelosaurusv2</code>](#module_skelosaurusv2)  

| Param | Type | Description |
| --- | --- | --- |
| sourceFile | <code>string</code> | Path to documentation file  @ @returns {Array.{targetPath: string, content: string}} Array of part object, each part has targetPath and content properties |

<a name="module_skelosaurusv2..saveDocumentParts"></a>

#### skelosaurusv2~saveDocumentParts(sourceFile, program)
Create parts files for a specified topic document

**Kind**: inner method of [<code>skelosaurusv2</code>](#module_skelosaurusv2)  

| Param | Type | Description |
| --- | --- | --- |
| sourceFile | <code>string</code> | Path to topic document |
| program | <code>object</code> | Options passed on command |

<a name="module_skelosaurusv2..getSidebars"></a>

#### skelosaurusv2~getSidebars(sourceFilename) ⇒ <code>object</code>
Extract sidebar title and sidebar outline from a Markdown file.

**Kind**: inner method of [<code>skelosaurusv2</code>](#module_skelosaurusv2)  
**Returns**: <code>object</code> - Key-value where key is the sidebar title and value is bullet list tree.  

| Param | Type | Description |
| --- | --- | --- |
| sourceFilename | <code>string</code> | Filename of a Markdown file with outline |

<a name="module_skelosaurusv2..getTopicHeaders"></a>

#### skelosaurusv2~getTopicHeaders(bulletlist) ⇒ <code>Array</code>
Build topic top headers

**Kind**: inner method of [<code>skelosaurusv2</code>](#module_skelosaurusv2)  
**Returns**: <code>Array</code> - Headers in markdown notation  

| Param | Type | Description |
| --- | --- | --- |
| bulletlist | <code>Array</code> | Header list represented in Markdown abstrat tree |

<a name="module_skelosaurusv2..getUniqueName"></a>

#### skelosaurusv2~getUniqueName(name) ⇒ <code>string</code>
Return a variant string

**Kind**: inner method of [<code>skelosaurusv2</code>](#module_skelosaurusv2)  
**Returns**: <code>string</code> - Original string with suffixed text  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name to check for uniqueness |

<a name="module_skelosaurusv2..hasHeaders"></a>

#### skelosaurusv2~hasHeaders(topicItem) ⇒ <code>boolean</code>
Checks whether the topic has headers

**Kind**: inner method of [<code>skelosaurusv2</code>](#module_skelosaurusv2)  
**Returns**: <code>boolean</code> - true if topic has headers, false otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| topicItem | <code>object</code> | Topic to test whether it has headers |

<a name="module_skelosaurusv2..isSingleTopic"></a>

#### skelosaurusv2~isSingleTopic(topicItem) ⇒ <code>boolean</code>
Checks whether a topic has children topics

**Kind**: inner method of [<code>skelosaurusv2</code>](#module_skelosaurusv2)  
**Returns**: <code>boolean</code> - true if single topic, false otherwise  

| Param | Type | Description |
| --- | --- | --- |
| topicItem | <code>object</code> | Topic to test whether it is single topic |

<a name="module_skelosaurusv2..makeid"></a>

#### skelosaurusv2~makeid(length) ⇒ <code>string</code>
Return a random string with digital characters of specified length

**Kind**: inner method of [<code>skelosaurusv2</code>](#module_skelosaurusv2)  
**Returns**: <code>string</code> - Randomly chosen characters of specified length  

| Param | Type | Description |
| --- | --- | --- |
| length | <code>number</code> | The length of string to return. |

<a name="module_skelosaurusv2..parseTitle"></a>

#### skelosaurusv2~parseTitle(topicTitle) ⇒ <code>object</code>
Extract topic title to extract relevant information

**Kind**: inner method of [<code>skelosaurusv2</code>](#module_skelosaurusv2)  
**Returns**: <code>object</code> - Properties extracted from title  

| Param | Type | Description |
| --- | --- | --- |
| topicTitle | <code>object</code> | Topic title to parse. |

<a name="module_skelosaurusv2..saveDocument"></a>

#### skelosaurusv2~saveDocument(fileName, content)
Create a text file in utf-8 format from specified name and content

**Kind**: inner method of [<code>skelosaurusv2</code>](#module_skelosaurusv2)  

| Param | Type | Description |
| --- | --- | --- |
| fileName | <code>string</code> | Name of the file to create. |
| content | <code>string</code> | String to place in the file. |

<a name="module_skelosaurusv2..slug"></a>

#### skelosaurusv2~slug(source) ⇒ <code>string</code>
Convert specified string into a slug.Converts spaces, tabs, and visible special characters into dashes (-) -- except backslash (\).Compresses sequence of dashes or special characters into a single dash. Removes heading or trailingdashes or special characters from the specified string.

**Kind**: inner method of [<code>skelosaurusv2</code>](#module_skelosaurusv2)  
**Returns**: <code>string</code> - Trimmed, lowercase string with dashes(-)  

| Param | Type | Description |
| --- | --- | --- |
| source | <code>string</code> | String to covert to slug. |

