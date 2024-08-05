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

const authorInsert = `<aside>
<h2>About the author</h2>
<img src="./peter.jpg" alt="">
<div>
  <p>
    Hi, I'm Peter! I made Ornament and do workshops, code reviews and consulting on core web technologies as a freelancer. <strong><mark>Hire me</mark></strong> to level up your colleagues, review your TypeScript, or to solve your web component issues!
  </p>
  <p>
    <a href="mailto:peter@peterkroener.de">Contact me via email</a>,
    follow me <a href="https://mastodon.social/@sir_pepe">on Mastodon</a> or
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
    to chew on raw vanilla beans 24/7.</string> It's a spectrum!
  </p>
</aside>`;

// Animation: https://code.movie/play.html?t=7VhRT9swEP4v3muG3ISUlrc2NIBgFHVFGprQ5CZuatW1O8dhK6j_feckpV0p4IixMUrykjjn-86fz77PuUXXVKVMCrSPHfOsWUR4i7MEWpCWU-SgKYljJhK0_xU7-X3lICLYhOi83y0aZiIqnhElKYUucabKrz7GcwdxMgMYY8uZoGfZZFC-UkEGnMZof0h4Sh2kZ1OZKDIdzczXSHKpzMOYCbBBQfe02wP314RnFN4_BPmFAOEHZclIQ5uQakI4GKV6xumyAWxGUrEbKTThn4hKmMhH5F7BFy3HVOQBVQzAzS-rAJyFk_7lefew1zo_uoS2IcQTkgnjgIcmUsh0SiJDoSHqqPTp7viF5Wd2Q0MSaRNUDUDz-PK4U63yObKIeVDHEY5sSRP5ZFk5xriB68TW8ZjOfkgVW3o212-eB5LHG_0SrqkSkH7X9KQKxJ479Jt2EJrYMY3x7sB3K4fdt3Vf92o-tXSvIUEGmaZWnmvY93zrmVwJvVURxqP12BYmphEn6m7XeTrPY-zXa3b0cAZDgEcbv83YrcdN26jLbjbT6XmN2hOkM9i8WL525RQC1tJuZTabGFtuU2DDxLWM7HnG2Pcj6_0ENlhbOur-XsPWbSQnEyq0lecGNrct0SvZHTwPZC37lhBTU0Aze8Z3sbntqJkXK0cWCyevFUmmdbmlj2BBReVLiXbQCbq9Vv-4e_bt8KLf7xhkORymVBcK4Go-L6qT6TMCeF6EsMnB6fFZB7rDuk0BecXalDNFEyUzERc6ID6lQzOQNKLC1D9o6ZVjWzQNSDSOFWiSJVa7FZwc9LrnaGWhPV5ETBkxIzDO_i5-GIZuOzDoAE-Vkg-wvkZaYbmdhDXaDa8kTI6t2AKzbaQq6IRhu1FSFWWplpOaFV8L220kbRX_jja3Am3uO20L2rwKtHnvtBkhRH9qixLa73zpW5XQPxeeg8AlVYsaX_a4ODvo9Mr5LPTAZf7TYP0IvxAgeXenytkujYjpWQNZw2I9MkfcezP1_BocvroxPi4H1hJgsxz4J5P_EZv_EnfcaJWtUJN-z1iS8JkNPUGwRg_eqflLhvALpIFRFp73-hLhIZmzlgUbZM77-q-ik17TGJ-SbGtz_5Bke0-A_3eUT8nPjSlwX36-TXK2LAUekNIbU-C-lH6b5GxJCryI3g3D4sjxCw%3D%3D&p=7VhtT9swEP4rJ_NhrQgrL2MvAapKaNMmDQltbF8IH9zkmhhcO7KdAory33dO-jrKNqYhDRRVqIn93OPn7p6TK0o2QWOFVizcC1ghWFgym0vhvgu8ZuH-dsBygxN6OeUKpd_WORLamQIDFhfGoHIfDB8jC3d2Kg_Xlxi7n-AjLi3hU1RouPxKgPrMZTaKdRmO8c5mHVvRts24wbU6MjdeT0pBIkGpecJCxojj0mp1zwlz7fcrcIXTRnC5Lrul7ROd8Hrb4kLIKlRylRY8xQX0Wrg4Eyo90yxUhZTVQpDfd8JJqjH7puqnhC04aNXd5mhjI3K3dWlvaG_kW2JZeF4ykfjWkDq8ISbW68EXTAvJDVzjEGI9zrWiJkIsubWRqr_gWIr46lgXyqEBCkSVWPh4dvL5vaQeEbqMVEUFndLvPgI9AHGdFkOCAo9jtFYbGNEf2QSEEo4qDRMuC_TYOaJegSPYPojUlOSTP0YR2jrucM4xdS8pIzGklNSsMG3US0TlMmFf1rwHK1nvzbMWlKUh1ZDgSCiECkZGjyFiAytMjjn2NAnwmUWs1tWUSViff62lLgunT1xYR6G-GOB4GqlBw9mJWC10K27KFrHu86rmq_uqGQB3zgRA05AHoIrxkNL8vysca0LSshcuhsVSme6UeuAxnSarTgljoULYhqrb_bMm3D3hnkYMfPl-fc5vW7T_L1s0p6DrI_WrAWQBkPRkOZauHx63PX28nr5ue_o8ejo98Xh2476ws8JLnYo4gKEW0gH9zshg2gGK2GgwnS6U1Yov3rS-aH1R-8K_wjSmc9g_7PWD-oTugd9Zdc3b1jWta-66pnkBOOzPnuiZ9DutQKu6zkclRR31GxWNps3Nqr-5c9hrgPNQb8DZs0dPX9bZ8V1rx9aOj2xHgDPtuAyJoV8uwStC_oVnd7cf4tnAd1lh7DBp7fvc7DuY95a8SOGmUDBGl-kErjNUjdLFP1gasH1ixo_Uwvo7D7N-XSgxwXYI2iFYMwSDmT_WB84TthBnXKX4xAZnMTa77di0Y_MIY1PCFd7aEM4j1kiL2AUpXkc3ld4M0lO7glh1UVU_AA%3D%3D

const tutorialInsert = `<h2 id="tutorial">Tutorial: click counter with Preact</h2>
<p>
  Step through this tutorial to see how a component built with
  <a href="https://preactjs.com/">Preact</a> comes together, but note that you
  don't have to use Preact with Ornament! You can use tagged template literals,
  vanilla DOM manipulation, state could live in Signals&nbsp;&hellip; it's up to
  you!
</p>
<div class="tutorial">
<code-movie-runtime keyframes="0 1 2 3 4 5 6 7 8 9 10 11"><include src="static/animation.html"></include></code-movie-runtime>
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

// Apply a criminal hack directly to the markdown rather than extend marked's
// renderer or something
function hack(string, re, ...contentToInsert) {
  const { index } = re.exec(string);
  const before = string.slice(0, index);
  const after = string.slice(index);
  return before + "\n\n" + contentToInsert.join("\n\n") + "\n\n" + after;
}

// Insert author aside
const withAuthor = hack(readme, /## Guide/, authorInsert, tutorialInsert);

// Insert vanilla aside
const withVanilla = hack(withAuthor, /### Installation/, vanillaInsert);

rimrafSync(destination);
writeFileSync(destination, template(marked.parse(withVanilla)));
