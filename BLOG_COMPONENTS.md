# Blog Components and Formatting Guide

This guide provides an overview of the custom components and formatting options available for writing blog posts in this project.

## MDX Components

You can import and use these components in your `.mdx` blog posts.

### Callout

Use the `Callout` component to highlight important information.

**Import:**
```javascript
import Callout from '@/components/mdx/Callout.astro';
```

**Usage:**

```mdx
<Callout variant="tip" title="An important tip">
  This is the content of the callout. You can use **Markdown** here.
</Callout>
```

**Props:**

-   `variant` (optional): The type of callout. Defaults to `note`.
-   `title` (optional): A title for the callout.
-   `defaultOpen` (optional): Whether the callout is open by default. Defaults to `true`.

**Available Variants:**

-   `note`
-   `tip`
-   `warning`
-   `danger`
-   `important`
-   `definition`
-   `theorem`
-   `lemma`
-   `proof`
-   `corollary`
-   `proposition`
-   `axiom`
-   `conjecture`
-   `notation`
-   `remark`
-   `intuition`
-   `recall`
-   `explanation`
-   `example`
-   `exercise`
-   `problem`
-   `answer`
-   `solution`
-   `summary`

### Challenge

Use the `Challenge` component to display a summary of a CTF challenge.

**Import:**
```javascript
import Challenge from '@/components/mdx/Challenge.astro';
```

**Usage:**

```mdx
<Challenge
  title="My Awesome Challenge"
  authors={['author1', 'author2']}
  solvers={[{ name: 'enscribe', href: 'https://github.com/jktrn', avatar: 'https://github.com/jktrn.png' }]}
  category="PPC"
  points={100}
  solves={50}
  files={['file1.zip', 'file2.txt']}
  remote="nc challenges.example.com 1337"
  flag="flag{this_is_a_flag}"
>
  A brief description of the challenge.
</Challenge>
```

**Props:**

-   `title`: The title of the challenge.
-   `authors`: An array of author names.
-   `solvers`: An array of solver objects (`{ name: string, href?: string, avatar?: string }`).
-   `category`: A string or an array of strings for the challenge category.
-   `points`: The number of points.
-   `solves`: The number of solves.
-   `files`: An array of file names.
-   `remote`: The remote connection string.
-   `flag`: The challenge flag.

### CountryFlag

Displays a country flag inline with text.

**Import:**
```javascript
import CountryFlag from '@/components/mdx/CountryFlag.astro';
```

**Usage:**
```mdx
I'm from the US <CountryFlag country="us" />!
```

**Props:**
-   `country`: The 2-letter country code (e.g., "us", "jp", "de").

### FirstSubpost

A component to link to the first post in a series.

**Import:**
```javascript
import FirstSubpost from '@/components/mdx/FirstSubpost.astro';
```

**Usage:**
```mdx
<FirstSubpost title="My First Subpost" href="/blog/my-first-subpost/" />
```

**Props:**
-   `title`: The title of the sub-post.
-   `href`: The URL of the sub-post.

### StaticTweet

Embed a static representation of a tweet.

**Import:**
```javascript
import StaticTweet from '@/components/mdx/StaticTweet.astro';
```

**Usage:**
```mdx
<StaticTweet
  avatar="URL_TO_AVATAR"
  username="User Name"
  handle="userhandle"
  date="Dec 21, 2025"
  src="URL_TO_TWEET"
>
  This is the content of the tweet.
</StaticTweet>
```

**Props:**
-   `avatar`: URL of the user's avatar.
-   `username`: The user's display name.
-   `handle`: The user's Twitter handle.
-   `date`: The date of the tweet.
-   `src`: The URL to the original tweet.
-   `media` (optional): Image from `astro:assets` for tweet media.
-   `video` (optional): Video from `astro:assets`.

---

## Code Blocks

This project uses [Astro Expressive Code](https://expressive-code.com/astro/) for beautiful and feature-rich code blocks.

### Basic Usage
Create a code block using triple backticks and specify the language.

````
```python
def hello():
  print("Hello, World!")
```
````

### Using the `<Code>` component

For more control, you can use the `<Code>` component, especially for loading code from files.

**Import:**

```javascript
import { Code } from 'astro-expressive-code/components';
import myCode from './path/to/code.py?raw';
```

**Usage:**

```mdx
<Code code={myCode} lang="py" title="path/to/code.py" />
```

**Features:**
-   Syntax highlighting for many languages.
-   Line numbers, titles, and more.
-   Line highlighting: `ins` for insertion, `del` for deletion.

Example with highlighting:

````
```js ins={2} del={3-4}
function greet(name) {
  console.log(`Hello, ${name}!`);
  // This line is old
  // and will be removed.
}
```
````

---

## Math and Equations (KaTeX)

You can write LaTeX math equations, which will be rendered with KaTeX.

**Import:**
KaTeX styles are automatically included.

**Usage:**
-   **Inline math:** Wrap your formula in single dollar signs: `$E = mc^2$` renders as $E = mc^2$.
-   **Block math:** Use double dollar signs or a `math` code block.

```mdx
$$
\int_a^b f(x) \, dx = F(b) - F(a)
$$
```

````
```math
\frac{\partial L}{\partial w_j} = \frac{1}{m} \sum_{i=1}^{m} (h_w(x^{(i)}) - y^{(i)}) x_j^{(i)}
```
````

---

## Standard Markdown & Other Features

-   **Headings:** `# H1`, `## H2`, `### H3`
-   **Bold:** `**bold text**`
-   **Italic:** `*italic text*`
-   **Lists:**
    -   Unordered: `- item`, `* item`
    -   Ordered: `1. item`
-   **Links:** `[link text](https://example.com)` (External links open in a new tab automatically).
-   **Images:** `![alt text](./image.png)`
-   **Blockquotes:** `> This is a blockquote.`
-   **Emoji:** Use shortcodes like `:tada:`, `:rocket:`, etc. 🎉 🚀
