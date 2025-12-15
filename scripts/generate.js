import { fileURLToPath } from "node:url";
import { rmSync, readFileSync, writeFileSync } from "node:fs";
import { Marked } from "marked";
import { gfmHeadingId } from "marked-gfm-heading-id";
import { animateHTML, toHTML } from "@codemovie/code-movie";
import ecmascript from "@codemovie/code-movie/languages/ecmascript";
import animationJSON from "./animation.json" with { type: "json" };
const js = ecmascript({ jsx: true });

const template = (html) => {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Ornament | Build your own frontend framework</title>
    <meta name="viewport" content="width=device-width" />
    <meta name="description" content="A framework for web component frameworks" />
    <meta name="fediverse:creator" content="@sirpepe@mastodon.social" />
    <link rel="icon" href="./favicon.svg" type="image/svg+xml" />
    <link rel="stylesheet" href="./index.css">
  </head>
  <body>
    <div class="wrapper">
      <header>
        <h1><span>ORNAMENT</span><br>A framework for <mark>web component frameworks</mark></h1>
        <p><code>npm i <a href="https://www.npmjs.com/package/@sirpepe/ornament">@sirpepe/ornament</a></code></p>
      </header>
      <main>${html}</main>
      <footer>
        <p>Made with markdown, <a href="https://vite.dev">Vite</a> and <a href="https://code.movie/">Code.Movie</a></p>
      </footer>
    </div>
    <script type="module" src="./index.js"></script>
  </body>
</html>`;
};

const authorInsert = `<aside>
<h2>About the author</h2>
<img src="./peter.jpg" alt="">
<div>
  <p>
    Hi, I'm Peter! I made Ornament and do workshops, code reviews and consulting on core web technologies as a freelancer. <strong><mark>Hire me</mark></strong> to level up your colleagues, review your TypeScript, or to solve your web component issues!
  </p>
  <p>
    <a href="mailto:peter@peterkroener.de">Contact me via email</a>,
    follow me <a rel="me" href="https://mastodon.social/@sir_pepe">on Mastodon</a> or
    <a href="https://github.com/SirPepe/">on GitHub</a>, and check out
    <a href="https://code.movie/">Code.Movie</a> for something <em>entirely</em> different!
  </p>
</div>
</aside>`;

const vanillaInsert = `<aside class="sidebar">
  <h3>How is any of this different from anything else?</h3>
  <p>
    Ornament is not a framework, but something that you can either build a
    framework on top of or a tool for building straight web components.
    Remember: <strong>"Vanilla JavaScript" does not mean that you <em>have</em>
    to chew on raw vanilla beans 24/7.</strong> It's a spectrum!
  </p>
</aside>`;

const tutorialAnimation = toHTML(animationJSON, { tabSize: 2, language: js });

const tutorialInsert = `<h2 id="tutorial">Tutorial: click counter with Preact</h2>
<p>
  Step through this tutorial to see how a component built with
  <a href="https://preactjs.com/">Preact</a> comes together, but note that you
  don't have to use Preact with Ornament! You can use tagged template literals,
  vanilla DOM manipulation, state could live in Signals&nbsp;&hellip; it's up to
  you!
</p>
<div class="tutorial">
<code-movie-runtime keyframes="0 1 2 3 4 5 6 7 8 9 10 11">${tutorialAnimation}</code-movie-runtime>
<p class="tutorial-controls">
<button class="prev">Previous step</button>
<button class="next">Next step</button>
</p>
<ol class="tutorial-steps">
<li>Start with a regular, vanilla web component class.</li>
<li>Model the component's state using class accessors. Alternatively, you could store state in signals or on objects that implement <code>EventTarget</code>.</li>
<li>Import the decorator <code>@define()</code> to register your custom element class.</li>
<li>Use decorators <code>@attr()</code> and <code>@prop()</code> to define content and IDL attributes respectively. The <code>number()</code>-transformer plugs type-checking into the attributes.</li>
<li>Import Preact's functionality. Note that miuch of this can be abstracted away if you choose to write your own base class or micro-framework.</li>
<li>Write a method to handle rendering. Can be public, can be private, it's up to you.</li>
<li>Time to write some JSX. Don't like JSX? Then just use something else for rendering!</li>
<li>Listen for events. You could alternatively leverage event delegation in the component class, if that's more up your alley.</li>
<li>Show the current click count. Note that this could just as well be rendered into Shadow DOM if you need more encapsulation.</li>
<li>Use the decorator <code>@connected()</code> to run the render method when the component connects to the DOM.</li>
<li>Use the decorator <code>@reactive()</code> to run the render method when any attributes change. But since we only really care about <code>#count</code>&nbsp;&hellip;</li>
<li>&hellip; we make sure to only render-when something relevant to the method changes. <code>@reactive()</code> has multiple filtering options.</li>
</ol>
</div>`;

const marked = new Marked();

marked.use(gfmHeadingId(), {
  walkTokens(token) {
    // Use the headline from the template instead of what the readme provides
    if (token.type === "html" && token.raw.startsWith("<h1>")) {
      token.text = token.raw = "";
    }
    // Link to GH
    if (token.type === "link") {
      if (token.href === "./changelog.md") {
        token.href =
          "https://github.com/SirPepe/ornament/blob/main/changelog.md";
      }
    }
    // Highlighting
    if (token.type === "code" && token.lang !== "") {
      Object.assign(token, {
        type: "html",
        pre: true,
        text: toHTML({ code: token.text }, { tabSize: 2, language: js }),
        block: true,
      });
    }
  },
});

const source = fileURLToPath(import.meta.resolve("@sirpepe/ornament/readme"));
const destination = fileURLToPath(import.meta.resolve("../src/index.html"));

const readme = readFileSync(source, { encoding: "utf-8" });

// Apply a criminal hack directly to Markdown or HTML rather than extend
// marked's renderer or something
function hack(string, re, ...contentToInsert) {
  const { index } = re.exec(string);
  const before = string.slice(0, index);
  const after = string.slice(index);
  return before + "\n\n" + contentToInsert.join("\n\n") + "\n\n" + after;
}

// Insert author aside and placeholder for the tutorial insert. The tutorial
// insert needs to be added after the text has run through Marked; otherwise
// empty lines will get turned into <p>
const withAuthor = hack(readme, /## Guide/, authorInsert, "PLACEHOLDER_FOR_TUTORIAL");

// Insert vanilla aside
const withVanilla = hack(withAuthor, /### Installation/, vanillaInsert);

const html = template(marked.parse(withVanilla));

const htmlWithTutorial = html.replace("<p>PLACEHOLDER_FOR_TUTORIAL</p>", tutorialInsert);

rmSync(destination, { force: true, recursive: true });
writeFileSync(destination, htmlWithTutorial);

