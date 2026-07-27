// Centralized mock data for the PlacePrep AI frontend.
// No backend — everything is static, believable, and reusable.

export const brand = {
  name: "PlacePrep",
  tagline: "AI Placement Readiness",
};

export const mockStudent = {
  name: "Aarav Sharma",
  regNo: "21BCE1042",
  rollNo: "CSE-B-27",
  email: "aarav.sharma2021@vitstudent.ac.in",
  phone: "+91 98123 45678",
  department: "Computer Science & Engineering",
  course: "B.Tech",
  semester: "7",
  tenth: "94.2",
  twelfth: "91.6",
  cgpa: "8.74",
  gradYear: "2026",
  backlogs: "0",
  avatar: "AS",
  role: "Full Stack Engineer",
};

export const readiness = {
  overall: 78,
  quiz: 82,
  interview: 74,
  aptitude: 71,
  communication: 80,
};

export const skillList = [
  "Python","Java","C++","JavaScript","TypeScript","React","Next.js","Node.js",
  "Express","Docker","Kubernetes","Linux","AWS","GCP","Azure","Git","GitHub Actions",
  "SQL","PostgreSQL","MongoDB","Redis","GraphQL","REST APIs","Machine Learning",
  "Deep Learning","NLP","Computer Vision","Cybersecurity","System Design","DSA",
  "Tailwind CSS","Figma","Rust","Go","Kafka",
];

export const preferredRoles = [
  "Software Engineer","Frontend Engineer","Backend Engineer","Full Stack Engineer",
  "AI/ML Engineer","Data Scientist","Data Engineer","DevOps Engineer",
  "Cloud Engineer","Cybersecurity Analyst","SDET / QA Engineer","Mobile Engineer",
];

export const mockCompanies = [
  { id: "c1", name: "Nimbus Cloud", logo: "NC", industry: "Cloud Infrastructure", roles: ["SDE-1","Cloud Engineer"], cgpa: 7.5, skills: ["AWS","Kubernetes","Go"], status: "Hiring", openings: 24 },
  { id: "c2", name: "Vector Labs", logo: "VL", industry: "Artificial Intelligence", roles: ["ML Engineer","Applied Scientist"], cgpa: 8.0, skills: ["Python","PyTorch","NLP"], status: "Hiring", openings: 12 },
  { id: "c3", name: "Meridian Fintech", logo: "MF", industry: "Financial Technology", roles: ["Backend Engineer","SDET"], cgpa: 7.0, skills: ["Java","Spring","SQL"], status: "Upcoming", openings: 18 },
  { id: "c4", name: "Northwind Systems", logo: "NS", industry: "Enterprise SaaS", roles: ["Full Stack Engineer"], cgpa: 7.2, skills: ["React","Node.js","PostgreSQL"], status: "Hiring", openings: 30 },
  { id: "c5", name: "Helios Robotics", logo: "HR", industry: "Robotics", roles: ["Embedded Engineer","CV Engineer"], cgpa: 8.2, skills: ["C++","ROS","Computer Vision"], status: "Closed", openings: 0 },
  { id: "c6", name: "Aether Security", logo: "AS", industry: "Cybersecurity", roles: ["Security Analyst","Red Team"], cgpa: 7.8, skills: ["Linux","Networking","Python"], status: "Hiring", openings: 9 },
];

export const quizQuestions = Array.from({ length: 20 }).map((_, i) => ({
  id: i + 1,
  topic: ["Data Structures","System Design","Databases","Operating Systems","Networking","Web Fundamentals"][i % 6],
  prompt: [
    "Explain how a hash map handles collisions and analyze the amortized complexity of insertion in an open-addressed implementation.",
    "Design a URL shortener that must serve 50k requests per second. Discuss data model, caching strategy, and failure modes.",
    "Compare optimistic and pessimistic concurrency control. Give an example workload where each performs better and why.",
    "Describe how paging and segmentation differ, and outline the address translation for a two-level page table.",
    "Walk through what happens after typing a URL in a browser, from DNS resolution to the first painted pixel.",
    "Explain the JavaScript event loop, including microtasks, macrotasks, and how async/await interacts with them.",
  ][i % 6],
  estMinutes: 2,
}));

export const interviewTranscript = [
  { who: "ai", text: "Welcome, Aarav. To start, could you walk me through a project you're most proud of and the technical trade-offs you made?" },
  { who: "user", text: "Sure. I built a real-time collaborative code editor using CRDTs. The main trade-off was between eventual consistency and perceived latency..." },
  { who: "ai", text: "Interesting. When you say CRDTs — did you use a state-based or operation-based variant, and why?" },
  { who: "user", text: "Operation-based, since bandwidth was a concern and we already had a reliable message layer over WebSockets." },
  { who: "ai", text: "Great. Let's switch gears — how would you design a rate limiter that works across a horizontally scaled service?" },
];

export const strengths = [
  "Strong grasp of core data structures and algorithmic reasoning.",
  "Clear, structured communication under time pressure.",
  "Consistent hands-on project work backed by public repositories.",
];

export const weaknesses = [
  "Distributed systems fundamentals — CAP, consensus, quorum reads.",
  "Behavioral answers occasionally lack quantified impact.",
  "Depth on advanced SQL (window functions, query planning).",
];

export const incorrect = [
  {
    q: "In a leader-based replication system, what guarantees does a majority quorum read provide under network partitions?",
    given: "It guarantees the latest committed value at all times.",
    correct: "It guarantees reading the latest majority-acknowledged value, but only if the read quorum overlaps with the write quorum (R + W > N). Under partitions, availability of the minority side is lost by design.",
  },
  {
    q: "What is the worst-case time complexity of insertion into a red-black tree?",
    given: "O(1) amortized due to lazy rebalancing.",
    correct: "O(log n). Rebalancing performs at most a constant number of rotations, but the traversal is logarithmic in the number of nodes.",
  },
];

export const performanceBreakdown = [
  { name: "DSA", value: 86 },
  { name: "System Design", value: 62 },
  { name: "Databases", value: 74 },
  { name: "OS & Networks", value: 70 },
  { name: "Communication", value: 82 },
];

export const readinessTrend = [
  { week: "W1", score: 52 },
  { week: "W2", score: 58 },
  { week: "W3", score: 63 },
  { week: "W4", score: 66 },
  { week: "W5", score: 71 },
  { week: "W6", score: 74 },
  { week: "W7", score: 78 },
];

export const roadmap = {
  resume: [
    "Quantify impact on your top 3 projects (users, latency, uptime).",
    "Move the CRDT editor project to the top — it aligns with target roles.",
    "Trim the skills list to items you can defend in a 3-minute deep-dive.",
  ],
  technical: [
    "Complete a focused 3-week sprint on distributed systems fundamentals.",
    "Ship two small backends: one CRUD + auth, one event-driven.",
    "Solve 60 medium DSA problems, tagged by pattern not topic.",
  ],
  soft: [
    "Record and review three STAR-format behavioral answers per week.",
    "Practice thinking aloud for 20 minutes daily during system-design drills.",
  ],
  projects: [
    "Extend the collaborative editor with presence + comments.",
    "Build a small internal analytics dashboard using your own event pipeline.",
  ],
  certifications: [
    "AWS Certified Cloud Practitioner (foundation, ~4 weeks).",
    "Google Data Analytics or Meta Frontend Developer (optional).",
  ],
  practice: [
    "2 mock interviews per week, alternating technical and behavioral.",
    "1 timed quiz per week under proctored conditions.",
  ],
  interviewPrep: [
    "Anchor system-design answers around: requirements → API → data → scaling.",
    "For behavioral, always close with measurable outcome and reflection.",
  ],
  timeline: [
    { when: "Weeks 1–2", focus: "Resume rewrite + DSA warm-up" },
    { when: "Weeks 3–5", focus: "System design deep-dive + 1 project" },
    { when: "Weeks 6–7", focus: "Mock interviews + behavioral polish" },
    { when: "Week 8", focus: "Final review, target company shortlist" },
  ],
  courses: [
    "Designing Data-Intensive Applications — book, 4 chapters/week.",
    "MIT 6.824 Distributed Systems — lectures 1–6.",
    "Grokking the System Design Interview.",
  ],
};

export const activity = [
  { when: "Today · 10:24", text: "Completed AI mock interview — Full Stack track" },
  { when: "Yesterday", text: "Finished assessment quiz (20/20 submitted)" },
  { when: "3 days ago", text: "Updated professional links & skills" },
  { when: "Last week", text: "Roadmap generated for Full Stack Engineer role" },
];

export const students = Array.from({ length: 28 }).map((_, i) => {
  const first = ["Aarav","Isha","Rohan","Meera","Kabir","Ananya","Vihaan","Diya","Arjun","Sara","Neel","Priya","Yash","Zara","Rahul","Aisha","Dev","Kiara","Ayaan","Riya","Karan","Tara","Manav","Nikita","Om","Simran","Vivek","Anika"][i];
  const last = ["Sharma","Patel","Verma","Iyer","Khan","Rao","Kapoor","Nair","Singh","Bose","Menon","Reddy","Gupta","Joshi","Chopra","Das","Malik","Shah","Pillai","Ahuja"][i % 20];
  const score = 42 + ((i * 13) % 56);
  return {
    id: `s${i + 1}`,
    name: `${first} ${last}`,
    regNo: `21BCE${1000 + i}`,
    dept: ["CSE","IT","ECE","EEE","MECH"][i % 5],
    cgpa: (6.8 + ((i * 7) % 30) / 10).toFixed(2),
    role: preferredRoles[i % preferredRoles.length],
    readiness: score,
    status: score > 75 ? "Ready" : score > 55 ? "On Track" : "Needs Focus",
  };
});

export const roleDistribution = [
  { name: "Full Stack", value: 34 },
  { name: "Backend", value: 22 },
  { name: "Data / ML", value: 18 },
  { name: "Cloud / DevOps", value: 14 },
  { name: "Security", value: 8 },
  { name: "Mobile", value: 4 },
];

export const skillGap = [
  { skill: "System Design", have: 42, need: 78 },
  { skill: "Distributed Systems", have: 30, need: 70 },
  { skill: "Advanced SQL", have: 55, need: 75 },
  { skill: "Cloud (AWS/GCP)", have: 48, need: 72 },
  { skill: "Communication", have: 70, need: 82 },
];

export const placementTrend = [
  { month: "Jan", offers: 18 }, { month: "Feb", offers: 24 },
  { month: "Mar", offers: 32 }, { month: "Apr", offers: 41 },
  { month: "May", offers: 52 }, { month: "Jun", offers: 63 },
  { month: "Jul", offers: 74 }, { month: "Aug", offers: 88 },
];
