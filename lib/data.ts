export type TypeSystemKey =
  | "jung"
  | "enneagram"
  | "socionics"
  | "temperaments"
  | "alignment"
  | "sloan"
  | "trc";

export type TypeSystem = {
  key: TypeSystemKey;
  name: string;
  color: string;
};

export type Profile = {
  id: string;
  kind: "Profile";
  name: string;
  list: string;
  category: string;
  initials: string;
  description: string;
  types: Partial<Record<TypeSystemKey, string>>;
  photo?: string;
};

export type SearchableItem = {
  id: string;
  kind: "Profile" | "Profile List" | "Profile List Category";
  name: string;
  list: string;
  category: string;
  description: string;
  types: Partial<Record<TypeSystemKey, string>>;
  initials?: string;
  photo?: string;
};

export const typeSystems: TypeSystem[] = [
  { key: "jung", name: "Classic Jung", color: "#61c4d8" },
  { key: "enneagram", name: "Enneagram with Subtype", color: "#d5b36b" },
  { key: "socionics", name: "Socionics", color: "#9c7cf0" },
  { key: "temperaments", name: "Temperaments", color: "#5fcf92" },
  { key: "alignment", name: "Moral Alignment", color: "#c93b3b" },
  { key: "sloan", name: "Big 5 SLOAN", color: "#d6c25e" },
  { key: "trc", name: "Temporal Reference Cognition", color: "#8fc4ff" },
];

export const profiles: Profile[] = [
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

export const baseSearchableItems: SearchableItem[] = [
  ...profiles,
  {
    id: "fictional-strategists",
    kind: "Profile List",
    name: "Fictional Strategists",
    list: "Literature, cinema, and series",
    category: "Mixed Fiction",
    description:
      "Characters whose actions are regularly evaluated through planning, leverage, and long-range reasoning.",
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
];

export const theories = [
  {
    name: "Classic Jung",
    source: "/assets/corpora/classic_jung.txt",
    copy:
      "Corpus defines subject, object, ego, rational/irrational functions, function direction, eight cognitive functions, and dom/aux/tert/inf positioning.",
    details: [
      "Sensing and intuition are irrational perception functions.",
      "Thinking and feeling are rational judging functions.",
      "The stack table maps sixteen types to four-function order.",
    ],
  },
  {
    name: "Enneagram with Subtype",
    source: "/assets/corpora/enneagram.json",
    copy:
      "Corpus covers triads, fixation, passion, trap, holy idea, and subtype distinctions for SP, SO, and SX variants.",
    details: [
      "Gut, Heart, and Head triads are separated by center of intelligence.",
      "Each type has fixation, passion, trap, and holy idea fields.",
      "Subtype text supports SP/SO/SX comments such as SO5 or SX1.",
    ],
  },
  {
    name: "Socionics",
    source: "/assets/corpora/socionics.json",
    copy:
      "Corpus uses Model A with function positions, information elements, blocks, and quadra values.",
    details: [
      "Base and Creative compose Ego block.",
      "Suggestive and Mobilizing sit in SuperId.",
      "Quadra values are Alpha, Beta, Gamma, and Delta.",
    ],
  },
  {
    name: "Temperaments",
    source: "/assets/corpora/temp.pdf",
    copy:
      "Corpus defines temperament scoring with cortisol, dopamine, oxytocin, serotonin, and androgenicity values.",
    details: [
      "Choleric, Melancholic, Phlegmatic, and Sanguine have default biochemical score profiles.",
      "Blends average involved temperaments.",
      "Lowest population variance selects the closest temperament.",
    ],
  },
  {
    name: "Moral Alignment",
    source: "/assets/corpora/moral.pdf",
    copy:
      "Corpus defines impulse and structure axes for Lawful, Neutral, Chaotic, Good, Neutral, and Evil combinations.",
    details: [
      "Impulse describes personal tendency toward a category of act.",
      "Structure describes response to that tendency.",
      "The grid creates nine alignments from axis combinations.",
    ],
  },
  {
    name: "Big 5 SLOAN",
    source: "",
    copy:
      "Placeholder theory slot for SLOAN notation such as RCOEI, SLUAN, and RLUAI. Corpus file still needed.",
    details: [
      "This section is ready for an attached SLOAN corpus.",
      "Current UI keeps it separate from other typology comments.",
      "Voting rules still require one comment for this system.",
    ],
  },
  {
    name: "TRC",
    source: "/assets/corpora/temporal_reference_cognition.json",
    copy:
      "Corpus defines Temporal Reference Cognition with lens, tool, spark, drain, workspace energy loops, and type notations.",
    details: [
      "R/A maps resting/active mode of reference.",
      "S/N are dynamic time-traversal domains while T/F are static value-evaluation domains.",
      "Sixteen notations map to lens/tool/spark/drain stacks.",
    ],
  },
];

export const ranks = [
  ["Tr.", "Trainee", "0"],
  ["Pvt.", "Private", "1-5"],
  ["Cpl.", "Corporal", "6-10"],
  ["Sgt.", "Sergeant", "11-20"],
  ["WO", "Warrant Officer", "31-50"],
  ["Lt.", "Lieutenant", "76-100"],
  ["Col.", "Colonel", "301-400"],
  ["Gen.", "General", "851-1000"],
  ["FM", "Field Marshal", "1000+"],
] as const;

export const squadrons = [
  ["Commoner", "General users without official responsibility.", "#9c7cf0", "CM"],
  ["Analysts", "Review requested categories, lists, profiles, and removals.", "#f5f7fb", "AN"],
  ["Trainers", "Guide newcomers and clarify typology doubts.", "#61c4d8", "TR"],
  ["Lawyers", "Review AI benchmarking and automated-system complaints.", "#d6c25e", "LW"],
  ["Police", "Investigate harassment, alt accounts, manipulation, and misconduct.", "#c93b3b", "PL"],
  ["Strategists", "Support platform research, metrics, and feature strategy.", "#5fcf92", "ST"],
] as const;
