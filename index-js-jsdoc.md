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
| sourceFilename | <code>string</code> | Filename of a Markdown file with outline |

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

