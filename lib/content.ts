// All site copy lives here. Every figure is sourced from Hugo's resume,
// LinkedIn profile notes, or the project READMEs. Edit freely.

export const site = {
  name: "Hugo Simonet",
  role: "Data analyst & AI builder",
  location: "Los Angeles, CA",
  email: "hsimonet1311@gmail.com",
  linkedin: "https://www.linkedin.com/in/hsimonet",
  github: "https://github.com/HugoSimonet",
  resume: "/resume/Hugo-Simonet-Resume.pdf",
  status: "Open to Data Analyst, BI Analyst and AI Engineer roles",
  description:
    "Hugo Simonet is a data analyst and AI builder in Los Angeles with a B.S. in Statistics & Data Science from UCSB. Power BI dashboards, data audits, and machine learning, including a reinforcement-learning agent that beats the best Catan strategies.",
};

export const nav = [
  { id: "work", label: "Work", alias: "experiments" },
  { id: "experience", label: "Experience", alias: "deployments" },
  { id: "education", label: "Education", alias: "training data" },
  { id: "toolkit", label: "Toolkit", alias: "feature map" },
  { id: "contact", label: "Contact", alias: "endpoint" },
] as const;

export const heroStats = [
  { value: 2_000_000, display: "2M", label: "games simulated to rank Catan strategies" },
  { value: 180_519, display: "180,519", label: "order lines modeled in Power BI" },
  { value: 3_937, display: "3,937", label: "SKUs in a production-planning prototype" },
  { value: 800, display: "800+", suffix: "+", label: "courses ingested by my ETL pipelines" },
];

/* ───────────────────────── Catan Bot Lab ───────────────────────── */

export const catan = {
  live: "https://catan-bot-lab.vercel.app",
  code: "https://github.com/HugoSimonet/catan-bot-lab",
  question: "Can a self-taught AI beat the best Settlers of Catan strategies?",
  specs: [
    { k: "Engine", v: "Rust · ~43,000 games/s" },
    { k: "Policy", v: "PPO + graph network" },
    { k: "Compute", v: "1× GTX 1660 Ti" },
    { k: "Eval", v: "Wilson 95% CIs" },
  ],
  steps: [
    {
      tag: "Engine",
      title: "A simulator fast enough to ask big questions.",
      body: "I wrote the full four-player base game in Rust: bank and harbor trades, the robber, dev cards, Longest Road. Every random stream is seeded, so any game replays exactly. 25 tests cover the tricky rules and re-check invariants after every action of 420 full games.",
    },
    {
      tag: "Tournament",
      title: "Two million games to settle an argument.",
      body: "I turned the community's best-known strategies into one parameterized bot, tuned each with coordinate ascent over about 8 million games, then ran a 2,000,000-game tournament with seats rotated and common random numbers. Balanced wins. Port Master, the specialist, finishes last.",
    },
    {
      tag: "Learning",
      title: "A network that was never shown a strategy.",
      body: "PPO with action masking and a graph network over the board, which learned about 3× faster than a flat MLP. A curriculum (random play, then weaker bots, then the tuned strategies), then a self-play league: 262 million decisions over 2.6 million games in 16 hours.",
    },
    {
      tag: "Focus",
      title: "Practice against what beats you.",
      body: "In the first league, half the opponent seats went to copies of the agent, which it already beat. Phase 2 gave 75% of seats to the strategy bots, picked by prioritized fictitious self-play: another 197 million decisions in 8 hours.",
    },
    {
      tag: "Look-ahead",
      title: "Then it learned to think a turn ahead.",
      body: "Before an uncertain move, each candidate is played to the agent's next turn in 16 imagined futures (hidden cards re-dealt, so it never peeks) and scored by its own value network. The final agent wins 36.1% against the three strongest bots. The best hand-written strategy, in the same seat, wins 28.9%.",
    },
  ],
  learned: [
    {
      label: "Opening production in ore + wheat",
      agent: 49,
      base: 40,
      max: 60,
      unit: "%",
      note: "It opens heavier on the city-building resources than Balanced does.",
    },
    {
      label: "Dev cards bought per game",
      agent: 7.6,
      base: 1.7,
      max: 8,
      unit: "",
      note: "Close to Dev-Card Rush (7.8). It holds Largest Army in 58% of its games.",
    },
    {
      label: "Turn of first city",
      agent: 32,
      base: 42,
      max: 50,
      unit: "",
      note: "Its first city comes about ten turns before Balanced's.",
      lowerIsBetter: true,
    },
    {
      label: "Games ending with Longest Road",
      agent: 7,
      base: 29,
      max: 35,
      unit: "%",
      note: "It almost ignores Longest Road. Nobody told it to.",
    },
  ],
};

/* ───────────────────────── DataCo dashboard ───────────────────────── */

export const dataco = {
  pages: [
    {
      id: "overview",
      label: "Executive Overview",
      src: "/img/dataco-overview.png",
      alt: "Power BI Executive Overview page: net sales $31M, profit $4M, 12% margin, 61K orders, 57.3% late delivery, monthly trend, sales by market, top products and states.",
      hotspots: [
        {
          x: 19.6,
          y: 17.6,
          title: "KPIs that agree with each other",
          body: "Canceled and suspected-fraud lines are excluded inside the base measures, so every dependent KPI inherits the same filter. Cancel and fraud rates deliberately use all lines.",
        },
        {
          x: 24,
          y: 31.6,
          title: "Time intelligence as a calculation group",
          body: "YTD, prior year, YoY, YoY % and MoM as six calculation items, instead of thirty copy-pasted measures.",
        },
        {
          x: 79.5,
          y: 2.8,
          title: "2018 is partial in the source",
          body: "The source stops in early 2018, so the header states the default period (2015–2017) and makes the partial year opt-in.",
        },
        {
          x: 96.6,
          y: 61.5,
          title: "Risk, measured on the full set",
          body: "Cancel rate 2.0% and fraud rate 2.3% of all lines: 3,692 + 4,062 = 7,754, which matches the 'shipping canceled' count exactly.",
        },
      ],
    },
    {
      id: "delivery",
      label: "Delivery Operations",
      src: "/img/dataco-delivery.png",
      alt: "Power BI Delivery Operations page: 42.7% on time, 57.3% late, late delivery by shipping mode, a map of late deliveries by country, and late deliveries by region.",
      hotspots: [
        {
          x: 76.4,
          y: 37.5,
          title: "First Class is late 100% of the time",
          body: "Every First Class order misses its scheduled ship date, by exactly one day on average. That's a promise the operation never keeps.",
        },
        {
          x: 33.6,
          y: 20.6,
          title: "One number that matters",
          body: "57.3% of orders ship late, flagged in red so it reads first.",
        },
        {
          x: 28,
          y: 60.8,
          title: "Where the lateness lives",
          body: "Late deliveries by destination country, with bubble size showing volume, next to a ranked bar of regions you can drill into.",
        },
        {
          x: 70.6,
          y: 3.1,
          title: "Drill-through + custom tooltips",
          body: "Five drill-through pages (product, category, market, region, segment) and custom tooltip pages across the report.",
        },
      ],
    },
  ],
  funnel: { total: 53, dead: 6, pii: 4, redundant: 6 },
  schema: {
    fact: { name: "Fact_Orders", rows: "180,519", note: "Grain: one order line. Order Item Id is unique, zero duplicates." },
    dims: [
      {
        name: "Dim_Customer",
        rows: "20,652",
        note: "Deduplicated on Customer Id. I caught an earlier version keyed on the wrong column, which had collapsed 20,652 customers into 563. Now checked three ways.",
      },
      { name: "Dim_Product", rows: "118", note: "Name, category, department and price, keyed on Product Card Id." },
      { name: "Dim_Date", rows: "1,461", note: "Generated calendar, 2015–2018, marked as the date table. Year ▸ Quarter ▸ Month ▸ Date." },
    ],
  },
  facts: [
    { k: "48", v: "DAX measures" },
    { k: "5", v: "report pages" },
    { k: "5", v: "drill-throughs" },
    { k: "RFM", v: "customer segments" },
  ],
};

/* ───────────────────────── ML lab ───────────────────────── */

export const mlLab = {
  repo: "https://github.com/HugoSimonet/ML-Projects",
  projects: [
    {
      id: "anomaly",
      title: "Manufacturing defect detector",
      stack: ["PyTorch", "Autoencoders", "Anomaly detection"],
      metric: "0.99",
      metricLabel: "F1 on manufacturing defects",
      summary: "An autoencoder that learns what normal parts look like and flags anything it can't reconstruct.",
      detail: "Reconstruction error is the anomaly score. Benchmarked on four datasets (fraud, network intrusion, manufacturing and IoT); the same framework also implements Isolation Forest, One-Class SVM and LOF.",
      href: "https://github.com/HugoSimonet/ML-Projects/tree/main/anomaly_detection_system",
    },
    {
      id: "recsys",
      title: "Hybrid recommender",
      stack: ["scikit-learn", "Matrix factorization", "Collaborative filtering"],
      metric: "95%",
      metricLabel: "cross-validated accuracy",
      summary: "Collaborative and content-based filtering blended into one ranking, over 100K+ interactions.",
      detail: "User- and item-based collaborative filtering, TF-IDF content features and matrix factorization, blended with weighted rank fusion and evaluated with cross-validation.",
      href: "https://github.com/HugoSimonet/ML-Projects/tree/main/Recommendation-System",
    },
    {
      id: "sentiment",
      title: "Reddit sentiment classifier",
      stack: ["scikit-learn", "NLP", "Text classification"],
      metric: "14K+",
      metricLabel: "Reddit comments labeled",
      summary: "A text classifier trained on more than 14,000 Reddit comments.",
      detail: "Trained and evaluated with scikit-learn on more than 14,000 Reddit comments: informal, messy text rather than a tidy benchmark.",
      href: "https://github.com/HugoSimonet/ML-Projects",
    },
    {
      id: "mnist",
      title: "Neural net from scratch",
      stack: ["NumPy", "Backpropagation", "MNIST"],
      metric: "0",
      metricLabel: "ML libraries used",
      summary: "Handwritten-digit recognition with nothing but NumPy matrix math.",
      detail: "Parameter initialization, forward propagation, backpropagation and gradient descent written by hand, to understand what the frameworks do for you.",
      href: "https://github.com/HugoSimonet/ML-Projects/tree/main/MNIST-NN",
    },
  ],
};

/* ───────────────────────── Experience ───────────────────────── */

export const experience = [
  {
    role: "Data Analyst / AI Solution Specialist",
    org: "Hair & Compounds / Vitabae",
    where: "Los Angeles, CA",
    when: "Mar 2026 – Oct 2026",
    summary:
      "Dashboards, data audits and AI systems for two consumer brands, working directly with US and India teams.",
    metrics: [
      { k: "3,937", v: "SKU planning prototype" },
      { k: "8%", v: "inventory loss measured" },
      { k: "$61/mo", v: "vs $475 for one post" },
      { k: "140+", v: "applicants screened" },
    ],
    bullets: [
      "Built the company sales dashboard in Power BI on BigQuery (SQL, Python, DAX) and a master social-media dashboard in Looker Studio for the social lead.",
      "Prototyped an MRP-style production-planning system with Claude Code (scheduler, routings, 3,937-SKU master) that flags bottlenecks and late-risk orders. The dev team restructured the company's PPS to match its design.",
      "Audited factory source data: documented 26 gaps and turned the 10 that blocked features into a data request to operations.",
      "Audited the inventory master before building its data-entry app: reconciled bulk stock at 1,267 kg and measured theft at ~100 kg, 8% of bulk issued. Built, shipped and revised the app within four days.",
      "Analyzed support-chat performance (60 conversations, 40% reply rate, 70% AI deflection). Leadership adopted my recommendation to cancel the underused paid tool.",
      "Automated a 10-document export customs bundle with a GPT workflow, validated to the cent against past shipments.",
      "Designed two AI content engines that write fully cited briefs from a 214-record library, with health-claim guardrails, human review and 700+ automated tests. The H&C engine runs for ~$61/month; one hand-made post had cost $475 in wages.",
      "Hiring manager for the India team's AI specialist: screened 140+ applicants through a redesigned 4-round process. Wrote the company's approved AI-usage SOPs.",
    ],
    stack: ["SQL", "BigQuery", "Power BI", "DAX", "Looker Studio", "Python", "n8n", "Apify", "Claude Code"],
  },
  {
    role: "Lead Software Engineer",
    org: "Compass AI Academic Advising · UCSB",
    where: "Santa Barbara, CA",
    when: "Dec 2025 – Present",
    summary:
      "Co-founder of an academic planning platform that gives UCSB students a roadmap from their first class to their first career.",
    metrics: [
      { k: "4", v: "engineers led" },
      { k: "800+", v: "courses ingested" },
      { k: "329", v: "programs modeled" },
      { k: "10", v: "transfer colleges" },
    ],
    bullets: [
      "Lead 4 engineers on a React 19 / Express / Supabase advising platform.",
      "Own the ETL pipelines that ingest 800+ courses and 329 programs, plus transcript PDF parsing and prerequisite-graph logic.",
      "A degree auditor plus a community-college transfer mode, with articulation data for 10 colleges across 12 majors.",
      "Competed at the UCSB New Venture Fair.",
    ],
    stack: ["React", "TypeScript", "Express", "Supabase", "PostgreSQL", "ETL"],
  },
];

/* ───────────────────────── Education ───────────────────────── */

export const education = [
  {
    school: "University of California, Santa Barbara",
    short: "UCSB",
    degree: "B.S. Statistics & Data Science",
    when: "Sep 2023 – Jun 2025",
    from: 2023.7,
    to: 2025.45,
    where: "Santa Barbara, CA",
    coursework: [
      "Time series",
      "Bayesian analysis",
      "Statistical machine learning",
      "Probability & mathematical statistics",
      "R · ggplot2",
    ],
    projects: [
      {
        title: "Predicting heart disease",
        body: "Logistic regression, random forest, SVM and a neural network on the UCI heart-disease data, with a classmate.",
      },
      {
        title: "Forecasting Delhi's climate",
        body: "Decomposition, stationarity checks and SARIMA models on daily Delhi climate data, 2013–2017.",
      },
    ],
  },
  {
    school: "Santa Monica College",
    short: "SMC",
    degree: "A.S. Computer Science",
    when: "Aug 2021 – Jun 2023",
    from: 2021.6,
    to: 2023.45,
    where: "Santa Monica, CA",
    coursework: ["Programming", "Computer science foundations"],
    projects: [
      {
        title: "Transfer to UCSB",
        body: "Computer science foundations at Santa Monica College, then a transfer into UC Santa Barbara's statistics and data science program.",
      },
    ],
  },
];

export const timeline = [
  { t: 2021.6, label: "SMC", kind: "edu" },
  { t: 2023.7, label: "UCSB", kind: "edu" },
  { t: 2025.45, label: "B.S.", kind: "edu" },
  { t: 2025.92, label: "Compass", kind: "work" },
  { t: 2026.2, label: "H&C / Vitabae", kind: "work" },
] as const;

/* ───────────────────────── Toolkit matrix ───────────────────────── */

export const toolkitCols = [
  { id: "hc", short: "H&C", full: "Hair & Compounds / Vitabae" },
  { id: "compass", short: "Compass", full: "Compass AI Academic Advising" },
  { id: "catan", short: "Catan", full: "Catan Bot Lab" },
  { id: "dataco", short: "DataCo", full: "DataCo Power BI dashboard" },
  { id: "ml", short: "ML Lab", full: "ML-Projects repo" },
  { id: "ucsb", short: "UCSB", full: "UC Santa Barbara coursework" },
  { id: "homelab", short: "Homelab", full: "Home server (Ubuntu Server + Docker)" },
] as const;

type ColId = (typeof toolkitCols)[number]["id"];

export const toolkit: { tool: string; group: string; uses: Partial<Record<ColId, string>> }[] = [
  {
    tool: "SQL",
    group: "Data",
    uses: {
      hc: "BigQuery joins and aggregations behind the sales and social dashboards.",
      compass: "Postgres (Supabase) for the course and program data.",
    },
  },
  {
    tool: "Python",
    group: "Data",
    uses: {
      hc: "Data cleaning and ETL with a 7-person offshore data team.",
      compass: "ETL scripts that ingest 800+ courses and 329 programs.",
      catan: "PPO training, the self-play league, sweeps and the analysis pipeline.",
      dataco: "Profiled 53 columns and verified every redundant pair row by row.",
      ml: "Autoencoders, recommenders and classifiers.",
    },
  },
  { tool: "R", group: "Data", uses: { ucsb: "Time series, Bayesian analysis and ML coursework, plotted in ggplot2." } },
  {
    tool: "Power BI · DAX",
    group: "BI",
    uses: {
      hc: "The company sales dashboard, on BigQuery.",
      dataco: "Star schema, 48 measures, a calculation group and RFM segments.",
    },
  },
  { tool: "BigQuery", group: "BI", uses: { hc: "Warehouse for dashboards, ETL pipelines and reports." } },
  { tool: "Looker Studio", group: "BI", uses: { hc: "Master social-media dashboard for the social lead." } },
  {
    tool: "Statistics",
    group: "Data",
    uses: {
      catan: "Seat rotation, common random numbers and Wilson confidence intervals.",
      dataco: "RFM segmentation from rank quintiles.",
      ucsb: "B.S. Statistics & Data Science.",
    },
  },
  {
    tool: "PyTorch",
    group: "ML",
    uses: {
      catan: "Graph-network policy and value heads trained with PPO.",
      ml: "Autoencoder anomaly detector.",
    },
  },
  { tool: "scikit-learn", group: "ML", uses: { ml: "Hybrid recommender and sentiment classifier." } },
  { tool: "Rust", group: "Engineering", uses: { catan: "Game engine, bots, vectorized RL environment and PyO3 bindings." } },
  {
    tool: "TypeScript · React",
    group: "Engineering",
    uses: {
      compass: "React 19 / Express front end and API.",
      catan: "Next.js results site with an interactive replay viewer.",
    },
  },
  { tool: "Supabase", group: "Engineering", uses: { compass: "Database and backend for the advising platform." } },
  {
    tool: "Docker",
    group: "Infra",
    uses: {
      homelab: "Every service runs as a container (Jellyfin, Nextcloud, Pi-hole, Home Assistant), managed in Portainer.",
      ml: "Dockerfile and docker-compose for the recommender's API.",
    },
  },
  {
    tool: "Linux",
    group: "Infra",
    uses: {
      homelab: "Headless Ubuntu Server on a repurposed laptop, run entirely over SSH. It also hosts my modded Minecraft server.",
    },
  },
  { tool: "Tailscale", group: "Infra", uses: { homelab: "Private remote access to every service from anywhere over my own tailnet." } },
  { tool: "n8n · Apify", group: "AI", uses: { hc: "Workflows that discover and score creators." } },
  {
    tool: "Claude Code · LLMs",
    group: "AI",
    uses: {
      hc: "Planning prototype, content engines and a customs-document workflow.",
      dataco: "Built with Claude Code and Microsoft's Power BI authoring tools.",
    },
  },
];
