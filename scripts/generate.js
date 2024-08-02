import { fileURLToPath } from "node:url";
import { readFileSync, writeFileSync } from "node:fs";
import { rimrafSync } from "rimraf";
import { Marked } from "marked";
import { gfmHeadingId } from "marked-gfm-heading-id";
import { markedHighlight } from "marked-highlight";
import hljs from "highlight.js";

const template = (html) => {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Ornament | Build your own frontend framework</title>
    <meta name="viewport" content="width=device-width" />
    <meta name="description" content="A framework for web component frameworks" />
    <meta name="fediverse:creator" content="@sirpepe@mastodon.social" />
    <link rel="icon" href="~/src/favicon.svg" type="image/svg+xml" />
    <script type="module" src="~/src/index.js"></script>
    <link rel="stylesheet" href="~/src/index.css">
  </head>
  <body>
    <div class="wrapper">
      <header>
        <h1>A framework for <mark>web component frameworks</mark></h1>
        <p><code>npm i @sirpepe/ornament</code></p>
      </header>
      <main>${html}</main>
      <footer>
        <p>Made with markdown, <a href="https://parceljs.org/">Parcel</a> and <a href="https://highlightjs.org/">Highlight.js</a></p>
      </footer>
    </div>
  </body>
</html>`;
};

const insert = `<aside>
<h3>About the author</h3>
<img src="./peter.jpg" alt="">
<div>
  <p>
    Hi, I'm Peter! I made Ornament and do workshops, code reviews and consulting on web technologies. <strong><mark>Hire me</mark></strong> to level up your colleagues, review your TypeScript, or to solve your web component issues!
  </p>
  <p>
    <a href="mailto:peter@peterkroener.de">Contact me via email</a>,
    follow me <a href="https://mastodon.social/@sir_pepe">on Mastodon</a> or
    <a href="https://github.com/SirPepe/">on GitHub</a>, and check out
    <a href="https://code.movie/">Code.Movie</a> for something <em>entirely</em> different!
  </p>
</div>
</aside>`;

const marked = new Marked(
  markedHighlight({
    langPrefix: "hljs language-",
    highlight(code, lang, info) {
      const language = hljs.getLanguage(lang) ? lang : "plaintext";
      return hljs.highlight(code, { language }).value;
    },
  })
);

marked.use(gfmHeadingId(), {
  walkTokens(token) {
    // Use the headline from the template instead of what the readme provides
    if (token.type === "html" && token.raw.startsWith("<h1>")) {
      token.text = token.raw = "";
    }
    if (token.type === "link") {
      if (token.href === "./changelog.md") {
        token.href =
          "https://github.com/SirPepe/ornament/blob/main/changelog.md";
      }
    }
  },
});

const source = fileURLToPath(import.meta.resolve("@sirpepe/ornament/readme"));
const destination = fileURLToPath(import.meta.resolve("../src/index.html"));

const readme = readFileSync(source, { encoding: "utf-8" });

// Apply a criminal hack rather than extend marked's renderer or something
const { index } = /## Guide/.exec(readme);
const before = readme.slice(0, index);
const after = readme.slice(index);
const html = marked.parse(before + "\n\n" + insert + "\n\n" + after);

rimrafSync(destination);
writeFileSync(destination, template(html));
