for (const table of document.querySelectorAll("table")) {
  const wrapper = document.createElement("div");
  wrapper.className = "tableScroller";
  table.replaceWith(wrapper);
  wrapper.append(table);
}

const referenceIdMatch = {};

for (const heading of document.querySelectorAll("h2[id], h3[id], h3[id]")) {
  const id = heading.getAttribute("id");
  heading.innerHTML += `<a href="#${id}">#</a>`;
  const decoratorMatch = /^@[a-zA-Z]+/.exec(heading.innerText);
  if (decoratorMatch) {
    const referencedAs = decoratorMatch[0] + "()";
    referenceIdMatch[referencedAs] = id;
  }
}

for (const code of document.querySelectorAll("code:not([class])")) {
  if (code.closest("h2, h3, h4")) {
    continue;
  }
  if (referenceIdMatch[code.innerText]) {
    code.innerHTML = `<a class="ref" title="Jump to documentation for ${
      code.innerText
    }" href="#${referenceIdMatch[code.innerText]}">${code.innerText}</a>`;
  }
}
