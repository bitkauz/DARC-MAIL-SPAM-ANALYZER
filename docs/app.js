"use strict";

const search = document.querySelector("#search");
const category = document.querySelector("#category");
const list = document.querySelector("#cases");
const status = document.querySelector("#result-status");
const dayFormat = new Intl.DateTimeFormat("de-DE", {
  dateStyle: "medium", timeZone: "Europe/Berlin"
});
const timeFormat = new Intl.DateTimeFormat("de-DE", {
  timeZone: "Europe/Berlin", hour: "2-digit", minute: "2-digit",
  second: "2-digit", timeZoneName: "short"
});

function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text) node.textContent = text;
  if (className) node.className = className;
  return node;
}

function caseCard(entry) {
  const card = element("details", "", "case");
  const title = element("summary");
  const sent = new Date(entry.sent);
  title.append(
    element("strong", entry.subject, "subject"),
    element("span", [entry.id, dayFormat.format(sent), entry.category].join(" · "), "meta")
  );

  const content = element("div", "", "case-content");
  const metadata = element("dl");
  const fields = [
    ["Versanddatum laut Mail", dayFormat.format(sent) + " · " + timeFormat.format(sent)],
    ["Sichtbarer Absender", entry.sender + " · " + entry.domain],
    ["Tatsächliches Postfach", entry.mailbox],
    ["Sichtbares An-Feld", entry.visibleTo]
  ];
  for (const [label, value] of fields) {
    const field = element("div");
    field.append(element("dt", label), element("dd", value));
    metadata.append(field);
  }

  const findings = element("ul");
  for (const finding of entry.findings) findings.append(element("li", finding));

  content.append(
    element("p", entry.summary),
    metadata,
    element("h3", "Textauszug"),
    element("blockquote", entry.excerpt),
    element("h3", "Einordnung"),
    findings
  );
  card.append(title, content);
  return card;
}

function searchableText(entry) {
  return Object.values(entry).flat().join(" ")
    .toLocaleLowerCase("de-DE").replaceAll("[.]", ".");
}

function render(entries) {
  const terms = search.value.toLocaleLowerCase("de-DE").replaceAll("[.]", ".").trim().split(/\s+/);
  const matches = entries.filter(entry =>
    (!category.value || entry.category === category.value) &&
    terms.every(term => searchableText(entry).includes(term))
  );
  list.replaceChildren(...matches.map(caseCard));
  status.textContent = matches.length === 0 ? "Keine passenden Fälle gefunden." :
    matches.length === 1 ? "1 Fall" : matches.length + " Fälle";
}

async function loadArchive() {
  try {
    const response = await fetch("./cases.json");
    if (!response.ok) throw new Error("Archiv konnte nicht geladen werden");
    const entries = await response.json();
    entries.sort((first, second) => new Date(second.sent) - new Date(first.sent));
    const categories = [...new Set(entries.map(entry => entry.category))];
    categories.sort((first, second) => first.localeCompare(second, "de-DE"));
    for (const name of categories) category.add(new Option(name, name));
    render(entries);
    document.querySelector("#total").textContent = entries.length;
    if (entries.length) {
      document.querySelector("#latest").textContent = dayFormat.format(new Date(entries[0].sent));
    }
    search.disabled = false;
    category.disabled = false;
    search.addEventListener("input", () => render(entries));
    category.addEventListener("change", () => render(entries));
  } catch {
    status.textContent = "Das Archiv konnte nicht geladen werden. Bitte lade die Seite erneut.";
  }
}

loadArchive();
