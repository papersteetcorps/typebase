const typeSystems = [
  { key: "jung", name: "Classic Jung", color: "#61c4d8" },
  { key: "enneagram", name: "Enneagram with Subtype", color: "#d5b36b" },
  { key: "socionics", name: "Socionics", color: "#9c7cf0" },
  { key: "temperaments", name: "Temperaments", color: "#5fcf92" },
  { key: "alignment", name: "Moral Alignment", color: "#c93b3b" },
  { key: "sloan", name: "Big 5 SLOAN", color: "#d6c25e" },
  { key: "trc", name: "Temporal Reference Cognition", color: "#8fc4ff" },
];

const storedItems = JSON.parse(localStorage.getItem("psc_add_requests") || "[]");
const storedSession = JSON.parse(localStorage.getItem("psc_session") || "null");

const profiles = [
  {
    id: "moriarty",
    kind: "Profile",
    name: "Professor Moriarty",
    list: "Fictional Strategists",
    category: "Literature",
    initials: "PM",
    description:
      "A high-control criminal strategist used here as a sample profile for evidence-backed typology debate.",
    types: {
      jung: "IT(N)",
      enneagram: "SO5",
      socionics: "LII",
      temperaments: "Melancholic",
      alignment: "Lawful Evil",
      sloan: "RCOEI",
      trc: "RTN",
    },
  },
  {
    id: "athena",
    kind: "Profile",
    name: "Athena",
    list: "Mythic Figures",
    category: "Mythology",
    initials: "AT",
    description:
      "A strategic and justice-oriented figure used for testing multi-system profile presentation.",
    types: {
      jung: "ET(N)",
      enneagram: "SP1",
      socionics: "LSE",
      temperaments: "Choleric",
      alignment: "Lawful Good",
      sloan: "SCOEI",
    },
  },
  {
    id: "ada",
    kind: "Profile",
    name: "Ada Lovelace",
    list: "Computing Pioneers",
    category: "Science",
    initials: "AL",
    description:
      "A real-person profile sample with careful non-diagnostic wording and source-first analysis expectations.",
    types: {
      jung: "IN(T)",
      enneagram: "SX5",
      socionics: "ILI",
      temperaments: "Melancholic",
      alignment: "Neutral Good",
      trc: "RST",
    },
  },
];

let searchableItems = [
  ...profiles,
  {
    id: "fictional-strategists",
    kind: "Profile List",
    name: "Fictional Strategists",
    list: "Literature, cinema, and series",
    category: "Mixed Fiction",
    description: "Characters whose actions are regularly evaluated through planning, leverage, and long-range reasoning.",
    types: {},
  },
  {
    id: "science",
    kind: "Profile List Category",
    name: "Science",
    list: "Profile list category",
    category: "Root",
    description: "Real scientists, engineers, mathematicians, and research figures.",
    types: {},
  },
  ...storedItems,
];

const theories = [
  {
    name: "Classic Jung",
    source: "assets/corpora/classic_jung.txt",
    copy:
      "Corpus defines subject, object, ego, rational/irrational functions, function direction, eight cognitive functions, and dom/aux/tert/inf positioning.",
    details: ["Sensing and intuition are irrational perception functions.", "Thinking and feeling are rational judging functions.", "The stack table maps sixteen types to four-function order."],
  },
  {
    name: "Enneagram with Subtype",
    source: "assets/corpora/enneagram.json",
    copy:
      "Corpus covers triads, fixation, passion, trap, holy idea, and subtype distinctions for SP, SO, and SX variants.",
    details: ["Gut, Heart, and Head triads are separated by center of intelligence.", "Each type has fixation, passion, trap, and holy idea fields.", "Subtype text supports SP/SO/SX comments such as SO5 or SX1."],
  },
  {
    name: "Socionics",
    source: "assets/corpora/socionics.json",
    copy:
      "Corpus uses Model A with function positions, information elements, blocks, and quadra values.",
    details: ["Base and Creative compose Ego block.", "Suggestive and Mobilizing sit in SuperId.", "Quadra values are Alpha, Beta, Gamma, and Delta."],
  },
  {
    name: "Temperaments",
    source: "assets/corpora/temp.pdf",
    copy:
      "Corpus defines temperament scoring with cortisol, dopamine, oxytocin, serotonin, and androgenicity values.",
    details: ["Choleric, Melancholic, Phlegmatic, and Sanguine have default biochemical score profiles.", "Blends average involved temperaments.", "Lowest population variance selects the closest temperament."],
  },
  {
    name: "Moral Alignment",
    source: "assets/corpora/moral.pdf",
    copy:
      "Corpus defines impulse and structure axes for Lawful, Neutral, Chaotic, Good, Neutral, and Evil combinations.",
    details: ["Impulse describes personal tendency toward a category of act.", "Structure describes response to that tendency.", "The grid creates nine alignments from axis combinations."],
  },
  {
    name: "Big 5 SLOAN",
    source: "",
    copy:
      "Placeholder theory slot for SLOAN notation such as RCOEI, SLUAN, and RLUAI. Corpus file still needed.",
    details: ["This section is ready for an attached SLOAN corpus.", "Current UI keeps it separate from other typology comments.", "Voting rules still require one comment for this system."],
  },
  {
    name: "TRC",
    source: "assets/corpora/temporal_reference_cognition.json",
    copy:
      "Corpus defines Temporal Reference Cognition with lens, tool, spark, drain, workspace energy loops, and type notations.",
    details: ["R/A maps resting/active mode of reference.", "S/N are dynamic time-traversal domains while T/F are static value-evaluation domains.", "Sixteen notations map to lens/tool/spark/drain stacks."],
  },
];

const ranks = [
  ["Tr.", "Trainee", "0"],
  ["Pvt.", "Private", "1-5"],
  ["Cpl.", "Corporal", "6-10"],
  ["Sgt.", "Sergeant", "11-20"],
  ["WO", "Warrant Officer", "31-50"],
  ["Lt.", "Lieutenant", "76-100"],
  ["Col.", "Colonel", "301-400"],
  ["Gen.", "General", "851-1000"],
  ["FM", "Field Marshal", "1000+"],
];

const squadrons = [
  ["Commoner", "General users without official responsibility.", "#9c7cf0", "CM"],
  ["Analysts", "Review requested categories, lists, profiles, and removals.", "#f5f7fb", "AN"],
  ["Trainers", "Guide newcomers and clarify typology doubts.", "#61c4d8", "TR"],
  ["Lawyers", "Review AI benchmarking and automated-system complaints.", "#d6c25e", "LW"],
  ["Police", "Investigate harassment, alt accounts, manipulation, and misconduct.", "#c93b3b", "PL"],
  ["Strategists", "Support platform research, metrics, and feature strategy.", "#5fcf92", "ST"],
];

const comments = {
  best: [
    {
      title: "Highest vetted analysis",
      score: "91 AI vetting score",
      text:
        "The argument connects theory to observed behavior, avoids cross-system mixing, and explains the stack with profile-specific evidence. Individual score factors remain hidden by design.",
    },
  ],
  new: [
    {
      title: "Recent child discussion",
      score: "Relevant",
      text:
        "This reply extends the parent analysis without changing the official vote. Child comments are monitored for moderation and classified as relevant, neutral, or irrelevant.",
    },
  ],
};

const resultGrid = document.querySelector("#resultGrid");
const popularRail = document.querySelector("#popularRail");
const profileDetail = document.querySelector("#profile-detail");
const theoryGrid = document.querySelector("#theoryGrid");
const rankList = document.querySelector("#rankList");
const squadronList = document.querySelector("#squadronList");
const reportGrid = document.querySelector("#reportGrid");
const searchForm = document.querySelector("#searchForm");
const searchInput = document.querySelector("#searchInput");
const reportDialog = document.querySelector("#reportDialog");
const debateDialog = document.querySelector("#debateDialog");
const authDialog = document.querySelector("#authDialog");
const addDialog = document.querySelector("#addDialog");
const authForm = document.querySelector("#authForm");
const addForm = document.querySelector("#addForm");
const authModeLabel = document.querySelector("#authModeLabel");
const authTitle = document.querySelector("#authTitle");
const authName = document.querySelector("#authName");

function colorDots(types) {
  return typeSystems
    .map((system) => {
      const value = types[system.key];
      const cls = value ? "dot" : "blank-dot";
      const style = value ? `style="background:${system.color}"` : "";
      return `<span class="${cls}" ${style} title="${system.name}${value ? `: ${value}` : ": undecided"}"></span>`;
    })
    .join("");
}

function renderResults(items) {
  resultGrid.innerHTML = items
    .map(
      (item) => `
        <article class="result-card" ${item.kind === "Profile" ? `data-profile="${item.id}"` : ""}>
          ${item.photo ? `<img class="result-photo" src="${item.photo}" alt="${item.name}" />` : ""}
          <div class="meta"><span>${item.kind}</span><span>${item.category}</span></div>
          <h3>${item.name}</h3>
          <p>${item.description}</p>
          <div class="type-row" aria-label="Typology color codes">${colorDots(item.types)}</div>
          <p class="meta">Linked to ${item.list}</p>
        </article>
      `,
    )
    .join("");
}

function renderPopular() {
  popularRail.innerHTML = profiles
    .map(
      (profile) => `
        <article class="profile-card" data-profile="${profile.id}">
          <div class="profile-thumb">${profile.initials}</div>
          <p class="eyebrow">${profile.category}</p>
          <h3>${profile.name}</h3>
          <p>${profile.description}</p>
          <div class="type-row">${colorDots(profile.types)}</div>
        </article>
      `,
    )
    .join("");
}

function renderProfile(profile, tab = "best") {
  const typeRows = typeSystems
    .map((system) => {
      const value = profile.types[system.key] || "Undecided";
      return `
        <div class="type-pill">
          <span style="color:${system.color}">${system.name}</span>
          <strong>${value}</strong>
        </div>
      `;
    })
    .join("");

  profileDetail.innerHTML = `
    <div class="profile-sheet">
      <div class="profile-art">${profile.initials}</div>
      <div>
        <p class="eyebrow">${profile.category} / ${profile.list}</p>
        <h2>${profile.name}</h2>
        <p>${profile.description}</p>
        <div class="type-list">${typeRows}</div>
        <div class="comment-tabs">
          <button class="ghost-button" type="button" data-comment-tab="best" aria-pressed="${tab === "best"}">Best</button>
          <button class="ghost-button" type="button" data-comment-tab="new" aria-pressed="${tab === "new"}">New</button>
        </div>
        <div class="analysis-list">
          ${comments[tab]
            .map(
              (comment) => `
                <article class="analysis-card">
                  <div class="meta"><strong>${comment.title}</strong><span>${comment.score}</span></div>
                  <p>${comment.text}</p>
                </article>
              `,
            )
            .join("")}
        </div>
        <form class="comment-form" id="analysisForm">
          <h3>Submit analysis comment</h3>
          <select id="analysisSystem">
            ${typeSystems.map((system) => `<option>${system.name}</option>`).join("")}
          </select>
          <textarea id="analysisText" minlength="150" maxlength="6000" placeholder="Write 150-600 words. Keep this comment limited to the selected typology system."></textarea>
          <div class="status-row">
            <button class="solid-button" type="submit">Audit with Anthropic</button>
            <span class="audit-status" id="auditStatus">Waiting for analysis.</span>
          </div>
          <p class="notice">
            Real Anthropic auditing must run from a server route so the API key is never exposed in browser code.
            This prototype validates word count and queues the comment as backend-ready.
          </p>
        </form>
      </div>
    </div>
  `;
}

function renderTheories() {
  theoryGrid.innerHTML = theories
    .map(
      (theory, index) => `
        <article class="theory-card">
          <div class="type-row"><span class="dot" style="background:${typeSystems[index].color}"></span><p class="eyebrow">${typeSystems[index].key}</p></div>
          <h3>${theory.name}</h3>
          <p>${theory.copy}</p>
          <details>
            <summary>Corpus notes</summary>
            <ul>
              ${theory.details.map((detail) => `<li>${detail}</li>`).join("")}
            </ul>
            ${theory.source ? `<a class="text-link" href="${theory.source}" target="_blank" rel="noreferrer">Open source corpus</a>` : `<span class="meta">Awaiting corpus file</span>`}
          </details>
        </article>
      `,
    )
    .join("");
}

function renderGuide() {
  rankList.innerHTML = ranks
    .map(
      ([abbr, rank, range]) => `
        <div class="rank-row">
          <strong>${abbr} ${rank}</strong>
          <span class="meta">${range} markers</span>
        </div>
      `,
    )
    .join("");

  squadronList.innerHTML = squadrons
    .map(
      ([name, detail, color]) => `
        <div class="squadron-row">
          <span class="meta"><span class="beret" style="background:${color}"></span><strong>PSC ${name}</strong></span>
          <span>${detail}</span>
        </div>
      `,
    )
    .join("");
}

function renderReports() {
  reportGrid.innerHTML = squadrons
    .filter(([name]) => name !== "Commoner")
    .map(
      ([name, detail, color, icon]) => `
        <article class="report-card" data-squadron="PSC ${name}">
          <div class="report-icon" style="color:${color}; border-color:${color}">${icon}</div>
          <h3>PSC ${name}</h3>
          <p>${detail}</p>
        </article>
      `,
    )
    .join("");
}

function filterResults(query) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return searchableItems;
  return searchableItems.filter((item) =>
    [item.name, item.kind, item.list, item.category, item.description]
      .join(" ")
      .toLowerCase()
      .includes(normalized),
  );
}

document.addEventListener("click", (event) => {
  const profileCard = event.target.closest("[data-profile]");
  if (profileCard) {
    const profile = profiles.find((item) => item.id === profileCard.dataset.profile);
    renderProfile(profile);
    profileDetail.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const tab = event.target.closest("[data-comment-tab]");
  if (tab) {
    const currentName = profileDetail.querySelector("h2")?.textContent;
    const profile = profiles.find((item) => item.name === currentName);
    if (profile) renderProfile(profile, tab.dataset.commentTab);
  }

  const reportCard = event.target.closest("[data-squadron]");
  if (reportCard) {
    document.querySelector("#reportSquadron").textContent = reportCard.dataset.squadron;
    reportDialog.showModal();
  }

  if (event.target.matches("[data-open-debate]")) {
    debateDialog.showModal();
  }

  const authMode = event.target.closest("[data-open-auth]")?.dataset.openAuth;
  if (authMode) {
    authModeLabel.textContent = authMode === "signup" ? "Sign up" : "Login";
    authTitle.textContent = authMode === "signup" ? "Create your account" : "Welcome back";
    authName.style.display = authMode === "signup" ? "block" : "none";
    authDialog.showModal();
  }

  if (event.target.matches("[data-open-add]")) {
    addDialog.showModal();
  }
});

document.addEventListener("submit", async (event) => {
  if (event.target.id === "analysisForm") {
    event.preventDefault();
    const text = document.querySelector("#analysisText").value.trim();
    const words = text.split(/\s+/).filter(Boolean).length;
    const auditStatus = document.querySelector("#auditStatus");
    if (words < 150 || words > 600) {
      auditStatus.textContent = `Needs 150-600 words. Current count: ${words}.`;
      auditStatus.style.color = "#d6c25e";
      return;
    }
    auditStatus.textContent = "Queued for server-side Anthropic audit.";
    auditStatus.style.color = "#5fcf92";
  }
});

authForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const email = document.querySelector("#authEmail").value.trim();
  const name = authName.value.trim() || email.split("@")[0];
  localStorage.setItem("psc_session", JSON.stringify({ name, email, signedInAt: new Date().toISOString() }));
  document.querySelector(".brand span:last-child").textContent = `Paper Street Corps - ${name}`;
  authDialog.close();
});

addForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const file = document.querySelector("#addPhoto").files[0];
  const photo = file ? await readFileAsDataUrl(file) : "";
  const item = {
    id: `request-${Date.now()}`,
    kind: document.querySelector("#addKind").value,
    name: document.querySelector("#addName").value.trim(),
    list: document.querySelector("#addLinked").value.trim() || "Pending linkage",
    category: "Pending Analyst Review",
    description: document.querySelector("#addDescription").value.trim() || "Submitted for PSC Analyst review.",
    photo,
    types: {},
  };
  const updated = [...JSON.parse(localStorage.getItem("psc_add_requests") || "[]"), item];
  localStorage.setItem("psc_add_requests", JSON.stringify(updated));
  searchableItems = [...searchableItems, item];
  renderResults(searchableItems);
  addForm.reset();
  addDialog.close();
});

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  renderResults(filterResults(searchInput.value));
  document.querySelector("#results").scrollIntoView({ behavior: "smooth", block: "start" });
});

searchInput.addEventListener("input", () => {
  renderResults(filterResults(searchInput.value));
});

renderResults(searchableItems);
renderPopular();
renderProfile(profiles[0]);
renderTheories();
renderGuide();
renderReports();

if (storedSession) {
  document.querySelector(".brand span:last-child").textContent = `Paper Street Corps - ${storedSession.name}`;
}
