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
<dt><a href="#generateTopicParts">generateTopicParts(sourceFile)</a></dt>
<dd><p>Create parts files for a specified topic document</p>
</dd>
<dt><a href="#getSidebars">getSidebars(sourceFilename)</a> ⇒ <code>object</code></dt>
<dd><p>Extract sidebar title and sidebar outline from a Markdown file.</p>
</dd>
<dt><a href="#getTopicHeaders">getTopicHeaders(bulletlist)</a> ⇒ <code>Array</code></dt>
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

<a name="generateTopicParts"></a>

### generateTopicParts(sourceFile)
Create parts files for a specified topic document

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| sourceFile | <code>string</code> | Path to topic document |

<a name="getSidebars"></a>

### getSidebars(sourceFilename) ⇒ <code>object</code>
Extract sidebar title and sidebar outline from a Markdown file.

**Kind**: global function  
**Returns**: <code>object</code> - Key-value where key is the sidebar title and value is bullet list tree.  

| Param | Type | Description |
| --- | --- | --- |
| sourceFilename | <code>string</code> | Filename of a Markdown file with outline |

<a name="getTopicHeaders"></a>

### getTopicHeaders(bulletlist) ⇒ <code>Array</code>
Build topic top headers

**Kind**: global function  
**Returns**: <code>Array</code> - Headers in markdown notation  

| Param | Type | Description |
| --- | --- | --- |
| bulletlist | <code>Array</code> | Header list represented in Markdown abstrat tree |

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

