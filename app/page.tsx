"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  baseSearchableItems,
  profiles,
  ranks,
  squadrons,
  theories,
  type Profile,
  type SearchableItem,
  typeSystems,
} from "@/lib/data";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";

type AuthMode = "login" | "signup";
type CommentTab = "best" | "new";
type ModalName = "auth" | "add" | "report" | "debate" | null;

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

function colorDots(types: SearchableItem["types"]) {
  return typeSystems.map((system) => {
    const value = types[system.key];
    return (
      <span
        key={system.key}
        className={value ? "dot" : "blank-dot"}
        style={value ? { background: system.color } : undefined}
        title={`${system.name}: ${value || "undecided"}`}
      />
    );
  });
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<SearchableItem[]>(baseSearchableItems);
  const [selectedProfile, setSelectedProfile] = useState<Profile>(profiles[0]);
  const [commentTab, setCommentTab] = useState<CommentTab>("best");
  const [modal, setModal] = useState<ModalName>(null);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [userName, setUserName] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [reportSquadron, setReportSquadron] = useState("PSC Police");
  const [auditStatus, setAuditStatus] = useState("Waiting for analysis.");

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return items;
    return items.filter((item) =>
      [item.name, item.kind, item.list, item.category, item.description]
        .join(" ")
        .toLowerCase()
        .includes(normalized),
    );
  }, [items, query]);

  function openAuth(mode: AuthMode) {
    setAuthMode(mode);
    setAuthMessage("");
    setModal("auth");
  }

  async function submitAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");
    const displayName = String(formData.get("displayName") || email.split("@")[0]);
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setUserName(displayName);
      setAuthMessage("Supabase is not configured yet. Using a local demo session.");
      setModal(null);
      return;
    }

    const result =
      authMode === "signup"
        ? await supabase.auth.signUp({
            email,
            password,
            options: { data: { display_name: displayName } },
          })
        : await supabase.auth.signInWithPassword({ email, password });

    if (result.error) {
      setAuthMessage(result.error.message);
      return;
    }

    setUserName(displayName);
    setModal(null);
  }

  async function submitAddRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const file = formData.get("photo");
    const photo =
      file instanceof File && file.size > 0 ? await readFileAsDataUrl(file) : undefined;
    const kind = String(formData.get("kind")) as SearchableItem["kind"];
    const item: SearchableItem = {
      id: `request-${Date.now()}`,
      kind,
      name: String(formData.get("name") || "Untitled request"),
      list: String(formData.get("linked") || "Pending linkage"),
      category: "Pending Analyst Review",
      description: String(formData.get("description") || "Submitted for PSC Analyst review."),
      photo,
      types: {},
    };

    setItems((current) => [...current, item]);
    setQuery("");
    form.reset();
    setModal(null);
  }

  function submitAnalysis(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const text = String(formData.get("analysisText") || "").trim();
    const words = text.split(/\s+/).filter(Boolean).length;

    if (words < 150 || words > 600) {
      setAuditStatus(`Needs 150-600 words. Current count: ${words}.`);
      return;
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      setAuditStatus("Queued locally. Configure Supabase and Anthropic API for live audit.");
      return;
    }

    setAuditStatus("Queued for server-side Anthropic audit.");
  }

  return (
    <>
      <header className="site-header">
        <a className="brand" href="#home" aria-label="Paper Street Corps home">
          <span className="brand-mark">PSC</span>
          <span>{userName ? `Paper Street Corps - ${userName}` : "Paper Street Corps"}</span>
        </a>
        <nav className="top-nav" aria-label="Primary navigation">
          <a href="#theories">Theories</a>
          <a href="#rules">Rules</a>
          <a href="#guide">Guide</a>
          <a href="#report">Report</a>
          <a href="#user-profile">Profile</a>
        </nav>
        <div className="auth-actions">
          <button className="ghost-button" type="button" onClick={() => openAuth("login")}>
            Login
          </button>
          <button className="solid-button" type="button" onClick={() => openAuth("signup")}>
            Sign up
          </button>
        </div>
      </header>

      <main>
        <section className="hero" id="home" aria-labelledby="hero-title">
          <img className="hero-image" src="/assets/psc-hero.png" alt="" />
          <div className="hero-overlay" />
          <div className="hero-content">
            <p className="eyebrow">Evidence-first typology platform</p>
            <h1 id="hero-title">Paper Street Corps</h1>
            <p className="hero-copy">
              Structured profile typing, long-form analysis, AI-assisted vetting,
              rank-based responsibility, and serious debate without popularity farming.
            </p>

            <form
              className="search-panel"
              role="search"
              onSubmit={(event) => {
                event.preventDefault();
                document.querySelector("#results")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <label className="sr-only" htmlFor="searchInput">
                Search profiles, lists, and categories
              </label>
              <input
                id="searchInput"
                type="search"
                placeholder="Search a profile, list, or category"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              <button className="solid-button" type="submit">
                Search
              </button>
            </form>

            <div className="hero-actions">
              <button className="danger-button" type="button" onClick={() => setModal("debate")}>
                Enter debate chamber
              </button>
              <a className="text-link" href="#rules">
                Review voting rules
              </a>
            </div>
          </div>
        </section>

        <section className="section" id="results" aria-labelledby="results-title">
          <div className="section-heading">
            <p className="eyebrow">Search Result</p>
            <h2 id="results-title">Profiles, lists, and categories</h2>
          </div>
          <button
            className="add-button"
            type="button"
            onClick={() => setModal("add")}
            aria-label="Add category, list, or profile"
          >
            +
          </button>
          <div className="result-grid">
            {results.map((item) => (
              <article
                className="result-card"
                key={item.id}
                onClick={() => {
                  if (item.kind === "Profile") {
                    const profile = profiles.find((candidate) => candidate.id === item.id);
                    if (!profile) return;
                    setSelectedProfile(profile);
                    setCommentTab("best");
                    document
                      .querySelector("#profile-detail")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                {item.photo ? <img className="result-photo" src={item.photo} alt={item.name} /> : null}
                <div className="meta">
                  <span>{item.kind}</span>
                  <span>{item.category}</span>
                </div>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <div className="type-row" aria-label="Typology color codes">
                  {colorDots(item.types)}
                </div>
                <p className="meta">Linked to {item.list}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section band" aria-labelledby="popular-title">
          <div className="section-heading">
            <p className="eyebrow">Popularly voted profile list</p>
            <h2 id="popular-title">Fictional strategists</h2>
          </div>
          <div className="horizontal-rail" aria-label="Scrollable profile cards">
            {profiles.map((profile) => (
              <article
                className="profile-card"
                key={profile.id}
                onClick={() => {
                  setSelectedProfile(profile);
                  setCommentTab("best");
                  document.querySelector("#profile-detail")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <div className="profile-thumb">{profile.initials}</div>
                <p className="eyebrow">{profile.category}</p>
                <h3>{profile.name}</h3>
                <p>{profile.description}</p>
                <div className="type-row">{colorDots(profile.types)}</div>
              </article>
            ))}
          </div>
        </section>

        <section className="profile-detail" id="profile-detail" aria-live="polite">
          <div className="profile-sheet">
            <div className="profile-art">{selectedProfile.initials}</div>
            <div>
              <p className="eyebrow">
                {selectedProfile.category} / {selectedProfile.list}
              </p>
              <h2>{selectedProfile.name}</h2>
              <p>{selectedProfile.description}</p>
              <div className="type-list">
                {typeSystems.map((system) => (
                  <div className="type-pill" key={system.key}>
                    <span style={{ color: system.color }}>{system.name}</span>
                    <strong>{selectedProfile.types[system.key] || "Undecided"}</strong>
                  </div>
                ))}
              </div>
              <div className="comment-tabs">
                <button
                  className="ghost-button"
                  type="button"
                  aria-pressed={commentTab === "best"}
                  onClick={() => setCommentTab("best")}
                >
                  Best
                </button>
                <button
                  className="ghost-button"
                  type="button"
                  aria-pressed={commentTab === "new"}
                  onClick={() => setCommentTab("new")}
                >
                  New
                </button>
              </div>
              <div className="analysis-list">
                {comments[commentTab].map((comment) => (
                  <article className="analysis-card" key={comment.title}>
                    <div className="meta">
                      <strong>{comment.title}</strong>
                      <span>{comment.score}</span>
                    </div>
                    <p>{comment.text}</p>
                  </article>
                ))}
              </div>

              <form className="comment-form" onSubmit={submitAnalysis}>
                <h3>Submit analysis comment</h3>
                <select name="analysisSystem">
                  {typeSystems.map((system) => (
                    <option key={system.key}>{system.name}</option>
                  ))}
                </select>
                <textarea
                  name="analysisText"
                  minLength={150}
                  maxLength={6000}
                  placeholder="Write 150-600 words. Keep this comment limited to the selected typology system."
                />
                <div className="status-row">
                  <button className="solid-button" type="submit">
                    Audit with Anthropic
                  </button>
                  <span className="audit-status">{auditStatus}</span>
                </div>
                <p className="notice">
                  Real Anthropic auditing will run from a server route once the API key is configured.
                </p>
              </form>
            </div>
          </div>
        </section>

        <section className="section" id="theories" aria-labelledby="theories-title">
          <div className="section-heading">
            <p className="eyebrow">Theories</p>
            <h2 id="theories-title">Typology systems</h2>
          </div>
          <div className="theory-grid">
            {theories.map((theory, index) => (
              <article className="theory-card" key={theory.name}>
                <div className="type-row">
                  <span className="dot" style={{ background: typeSystems[index].color }} />
                  <p className="eyebrow">{typeSystems[index].key}</p>
                </div>
                <h3>{theory.name}</h3>
                <p>{theory.copy}</p>
                <details>
                  <summary>Corpus notes</summary>
                  <ul>
                    {theory.details.map((detail) => (
                      <li key={detail}>{detail}</li>
                    ))}
                  </ul>
                  {theory.source ? (
                    <a className="text-link" href={theory.source} target="_blank" rel="noreferrer">
                      Open source corpus
                    </a>
                  ) : (
                    <span className="meta">Awaiting corpus file</span>
                  )}
                </details>
              </article>
            ))}
          </div>
        </section>

        <section className="section band" id="rules" aria-labelledby="rules-title">
          <div className="section-heading">
            <p className="eyebrow">Rules</p>
            <h2 id="rules-title">How the Corps stays analytical</h2>
          </div>
          <div className="rule-layout">
            <article>
              <h3>Voting and analysis</h3>
              <p>
                Each typology vote requires exactly one separate long-form analysis comment
                for that system. AI vetting checks theory accuracy, profile fit, bridge quality,
                stack explanation, and tone before it can influence a public type.
              </p>
            </article>
            <article>
              <h3>Profiles and lists</h3>
              <p>
                Users may request categories, lists, and profiles. PSC Analysts review
                additions, clarifications, removals, and contested analyst actions through a
                queued officer process.
              </p>
            </article>
            <article>
              <h3>Moderation and appeals</h3>
              <p>
                Child comments are checked for harassment, spam, sexual content, threats,
                ideological preaching, and manipulation. Users can appeal AI or moderator
                decisions through the relevant squadron.
              </p>
            </article>
          </div>
        </section>

        <section className="section" id="guide" aria-labelledby="guide-title">
          <div className="section-heading">
            <p className="eyebrow">Platform Guide</p>
            <h2 id="guide-title">Ranks, squadrons, and markers</h2>
          </div>
          <div className="guide-grid">
            <div className="rank-panel">
              <h3>Rank ladder</h3>
              <div className="rank-list">
                {ranks.map(([abbr, rank, range]) => (
                  <div className="rank-row" key={rank}>
                    <strong>
                      {abbr} {rank}
                    </strong>
                    <span className="meta">{range} markers</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="squadron-panel">
              <h3>Squadron responsibilities</h3>
              <div className="squadron-list">
                {squadrons.map(([name, detail, color]) => (
                  <div className="squadron-row" key={name}>
                    <span className="meta">
                      <span className="beret" style={{ background: color }} />
                      <strong>PSC {name}</strong>
                    </span>
                    <span>{detail}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section band" id="report" aria-labelledby="report-title">
          <div className="section-heading">
            <p className="eyebrow">Report</p>
            <h2 id="report-title">Route concerns to the correct squadron</h2>
          </div>
          <div className="report-grid">
            {squadrons
              .filter(([name]) => name !== "Commoner")
              .map(([name, detail, color, icon]) => (
                <article
                  className="report-card"
                  key={name}
                  onClick={() => {
                    setReportSquadron(`PSC ${name}`);
                    setModal("report");
                  }}
                >
                  <div className="report-icon" style={{ color, borderColor: color }}>
                    {icon}
                  </div>
                  <h3>PSC {name}</h3>
                  <p>{detail}</p>
                </article>
              ))}
          </div>
        </section>

        <section className="section" id="user-profile" aria-labelledby="user-title">
          <div className="user-shell">
            <div className="user-banner">
              <div>
                <p className="eyebrow">PSC Commoner</p>
                <h2 id="user-title">
                  <span className="rank-abbr">Cpl.</span> {userName || "Aditi Rao"}
                </h2>
                <p>
                  Evidence notes, clean arguments, and patient theory comparison. Profile
                  descriptions support a 200 word limit with expansion.
                </p>
              </div>
              <div className="avatar" aria-label="User profile image">
                {initials(userName || "Aditi Rao")}
              </div>
            </div>
            <div className="marker-row">
              <span>
                <strong>8</strong> PSC Markers
              </span>
              <span>
                <span className="mini-icon">o</span>
                <strong>10</strong> Global Markers
              </span>
              <span>
                <span className="mini-icon">w</span>
                <strong>2</strong> Debate wins
              </span>
            </div>
            <div className="profile-actions">
              <button className="solid-button" type="button">
                Connect
              </button>
              <button className="icon-button" type="button" title="Notifications" aria-label="Notifications">
                !
              </button>
              <button className="icon-button" type="button" title="Report status" aria-label="Report status">
                ?
              </button>
            </div>
          </div>
        </section>
      </main>

      {modal === "auth" ? (
        <Modal onClose={() => setModal(null)}>
          <form onSubmit={submitAuth}>
            <button className="icon-button close-button" type="button" onClick={() => setModal(null)} aria-label="Close authentication form">
              x
            </button>
            <p className="eyebrow">{authMode === "signup" ? "Sign up" : "Login"}</p>
            <h2>{authMode === "signup" ? "Create your account" : "Welcome back"}</h2>
            {authMode === "signup" ? (
              <input name="displayName" type="text" placeholder="Display name" autoComplete="name" />
            ) : null}
            <input name="email" type="email" placeholder="Email address" autoComplete="email" required />
            <input name="password" type="password" placeholder="Password" autoComplete="current-password" required />
            <p className="notice">
              {isSupabaseConfigured()
                ? "Supabase Auth is configured. Email verification settings are controlled in Supabase."
                : "Supabase is not configured yet. Add keys to .env.local to enable real accounts."}
            </p>
            {authMessage ? <p className="notice">{authMessage}</p> : null}
            <menu>
              <button className="ghost-button" type="button" onClick={() => setModal(null)}>
                Cancel
              </button>
              <button className="solid-button" type="submit">
                Continue
              </button>
            </menu>
          </form>
        </Modal>
      ) : null}

      {modal === "add" ? (
        <Modal onClose={() => setModal(null)}>
          <form onSubmit={submitAddRequest}>
            <button className="icon-button close-button" type="button" onClick={() => setModal(null)} aria-label="Close add request form">
              x
            </button>
            <p className="eyebrow">Add request</p>
            <h2>Request category, list, or profile</h2>
            <select name="kind">
              <option>Profile</option>
              <option>Profile List</option>
              <option>Profile List Category</option>
            </select>
            <input name="name" type="text" placeholder="Name" required />
            <input name="linked" type="text" placeholder="Linked category or list" />
            <textarea name="description" placeholder="Short reason and evidence for this addition" />
            <label className="file-field">
              <span>Optional photograph</span>
              <input name="photo" type="file" accept="image/png,image/jpeg,image/webp" />
            </label>
            <p className="notice">
              Legal disclaimer: upload only photographs you own, have permission to use, or can
              lawfully submit for commentary/fair-use analysis. Do not upload pirated, defamatory,
              invasive, or unsafe media.
            </p>
            <menu>
              <button className="ghost-button" type="button" onClick={() => setModal(null)}>
                Cancel
              </button>
              <button className="solid-button" type="submit">
                Submit for PSC Analyst review
              </button>
            </menu>
          </form>
        </Modal>
      ) : null}

      {modal === "report" ? (
        <Modal onClose={() => setModal(null)}>
          <form>
            <button className="icon-button close-button" type="button" onClick={() => setModal(null)} aria-label="Close report form">
              x
            </button>
            <p className="eyebrow">{reportSquadron}</p>
            <h2>Submit concern</h2>
            <textarea placeholder="Write the concern with evidence and context." />
            <menu>
              <button className="ghost-button" type="button" onClick={() => setModal(null)}>
                Cancel
              </button>
              <button className="solid-button" type="button" onClick={() => setModal(null)}>
                Submit report
              </button>
            </menu>
          </form>
        </Modal>
      ) : null}

      {modal === "debate" ? (
        <Modal onClose={() => setModal(null)}>
          <form>
            <button className="icon-button close-button" type="button" onClick={() => setModal(null)} aria-label="Close debate chamber">
              x
            </button>
            <p className="eyebrow">Debate Chamber</p>
            <h2>Challenge setup</h2>
            <div className="form-grid">
              <input type="text" placeholder="Opponent username" />
              <select>
                <option>Classic Jung</option>
                <option>Enneagram with Subtype</option>
                <option>Socionics</option>
                <option>TRC</option>
              </select>
              <textarea placeholder="State the claim you want to defend." />
            </div>
            <menu>
              <button className="ghost-button" type="button" onClick={() => setModal(null)}>
                Cancel
              </button>
              <button className="danger-button" type="button" onClick={() => setModal(null)}>
                Create challenge
              </button>
            </menu>
          </form>
        </Modal>
      ) : null}
    </>
  );
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <div className="modal modal-open" role="dialog" aria-modal="true" onMouseDown={(event) => event.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
