import { createRequire } from "node:module";
import { resolve } from "node:path";

const runtimeModules =
  "C:/Users/91966/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules";
const require = createRequire(`${runtimeModules}/.pnpm/playwright@1.60.0/node_modules/playwright/`);
const { chromium } = require("playwright");

const fileUrl = `file:///${resolve("index.html").replace(/\\/g, "/")}`;
const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
page.on("console", (message) => {
  if (message.type() === "error") errors.push(message.text());
});

await page.goto(fileUrl, { waitUntil: "load" });

const initial = await page.evaluate(() => ({
  title: document.title,
  heroLoaded: document.querySelector(".hero-image")?.complete === true,
  heroWidth: document.querySelector(".hero-image")?.naturalWidth || 0,
  resultCards: document.querySelectorAll(".result-card").length,
  profileCards: document.querySelectorAll(".profile-card").length,
  theoryCards: document.querySelectorAll(".theory-card").length,
  reportCards: document.querySelectorAll(".report-card").length,
  horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
}));

await page.getByPlaceholder("Search a profile, list, or category").fill("Ada");
await page.getByRole("button", { name: "Search" }).click();

const afterSearch = await page.evaluate(() => ({
  resultCards: document.querySelectorAll(".result-card").length,
  firstResult: document.querySelector(".result-card h3")?.textContent || "",
}));

await page.getByText("Athena", { exact: true }).click();
const afterProfileClick = await page.evaluate(() => ({
  profileTitle: document.querySelector("#profile-detail h2")?.textContent || "",
}));

await page.getByRole("button", { name: "New" }).click();
const afterTab = await page.evaluate(() => ({
  commentText: document.querySelector(".analysis-card")?.textContent || "",
}));

await page.locator('.report-card[data-squadron="PSC Police"]').click();
const reportOpen = await page.evaluate(() => document.querySelector("#reportDialog")?.open === true);
await page.keyboard.press("Escape");

await page.getByText("Enter debate chamber", { exact: true }).click();
const debateOpen = await page.evaluate(() => document.querySelector("#debateDialog")?.open === true);
await page.keyboard.press("Escape");

await page.getByRole("button", { name: "Sign up" }).click();
await page.getByPlaceholder("Display name").fill("Test Analyst");
await page.getByPlaceholder("Email address").fill("test@example.com");
await page.getByPlaceholder("Password").fill("temporary-password");
await page.getByRole("button", { name: "Continue" }).click();
const authStored = await page.evaluate(() => JSON.parse(localStorage.getItem("psc_session") || "null")?.name);

await page.getByLabel("Add category, list, or profile").click();
await page.locator("#addName").fill("Test Profile Request");
await page.getByPlaceholder("Linked category or list").fill("Science");
await page.getByPlaceholder("Short reason and evidence for this addition").fill("A verification-only request.");
await page.getByRole("button", { name: "Submit for PSC Analyst review" }).click();
const addRequestVisible = await page.evaluate(() =>
  [...document.querySelectorAll(".result-card h3")].some((node) => node.textContent === "Test Profile Request"),
);

const corpusLinks = await page.evaluate(() => document.querySelectorAll('.theory-card a[href^="assets/corpora/"]').length);

const sampleAnalysis = Array.from({ length: 155 }, (_, index) => `word${index}`).join(" ");
await page.locator("#analysisText").fill(sampleAnalysis);
await page.getByRole("button", { name: "Audit with Anthropic" }).click();
const auditQueued = await page.evaluate(() => document.querySelector("#auditStatus")?.textContent || "");

await browser.close();

const failures = [];
if (initial.title !== "Paper Street Corps") failures.push("Unexpected document title.");
if (!initial.heroLoaded || initial.heroWidth < 100) failures.push("Hero image did not load.");
if (initial.resultCards < 5) failures.push("Initial search results are missing.");
if (initial.profileCards < 3) failures.push("Popular profile rail is missing cards.");
if (initial.theoryCards !== 7) failures.push("Theory cards should cover seven systems.");
if (initial.reportCards !== 5) failures.push("Report cards should cover five officer squadrons.");
if (initial.horizontalOverflow) failures.push("Page has unintended horizontal overflow at desktop width.");
if (afterSearch.resultCards !== 1 || afterSearch.firstResult !== "Ada Lovelace") {
  failures.push("Search did not filter to Ada Lovelace.");
}
if (afterProfileClick.profileTitle !== "Athena") failures.push("Profile card click did not update detail view.");
if (!afterTab.commentText.includes("Recent child discussion")) failures.push("New comment tab did not update.");
if (!reportOpen) failures.push("Report dialog did not open.");
if (!debateOpen) failures.push("Debate dialog did not open.");
if (authStored !== "Test Analyst") failures.push("Prototype auth session was not stored.");
if (!addRequestVisible) failures.push("Add request did not appear in search results.");
if (corpusLinks !== 6) failures.push("Expected six attached corpus source links.");
if (!auditQueued.includes("Queued for server-side Anthropic audit")) {
  failures.push("Analysis comment audit handoff did not trigger.");
}
if (errors.length) failures.push(`Browser errors: ${errors.join(" | ")}`);

console.log(
  JSON.stringify(
    {
      initial,
      afterSearch,
      afterProfileClick,
      afterTabContainsRecent: afterTab.commentText.includes("Recent child discussion"),
      reportOpen,
      debateOpen,
      authStored,
      addRequestVisible,
      corpusLinks,
      auditQueued,
      failures,
    },
    null,
    2,
  ),
);

if (failures.length) process.exit(1);
