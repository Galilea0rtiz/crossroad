const edges = [
  { source: "love", target: "first-love", strength: 0.9 },
  { source: "love", target: "breakup", strength: 0.95 },
  { source: "love", target: "situationship", strength: 0.8 },
  { source: "love", target: "long-distance", strength: 0.75 },
  { source: "love", target: "dating-again", strength: 0.7 },

  { source: "breakup", target: "therapy", strength: 0.85 },
  { source: "breakup", target: "self-worth", strength: 0.9 },
  { source: "breakup", target: "dating-again", strength: 0.75 },
  { source: "breakup", target: "confidence", strength: 0.7 },
  { source: "situationship", target: "self-worth", strength: 0.7 },
  { source: "long-distance", target: "loneliness", strength: 0.65 },

  { source: "goals", target: "changed-major", strength: 0.9 },
  { source: "goals", target: "started-business", strength: 0.75 },
  { source: "goals", target: "dream-job", strength: 0.8 },
  { source: "goals", target: "confidence", strength: 0.85 },

  { source: "changed-major", target: "identity", strength: 0.75 },
  { source: "changed-major", target: "career-change", strength: 0.7 },
  { source: "dream-job", target: "confidence", strength: 0.7 },
  { source: "started-business", target: "burnout", strength: 0.65 },

  { source: "challenges", target: "burnout", strength: 0.9 },
  { source: "challenges", target: "loneliness", strength: 0.85 },
  { source: "challenges", target: "therapy", strength: 0.8 },
  { source: "challenges", target: "failure", strength: 0.8 },

  { source: "burnout", target: "therapy", strength: 0.85 },
  { source: "burnout", target: "career-change", strength: 0.7 },
  { source: "failure", target: "reinvention", strength: 0.8 },
  { source: "loneliness", target: "new-city", strength: 0.65 },
  { source: "therapy", target: "self-worth", strength: 0.8 },

  { source: "career", target: "first-job", strength: 0.85 },
  { source: "career", target: "internship", strength: 0.8 },
  { source: "career", target: "lost-job", strength: 0.7 },
  { source: "career", target: "career-change", strength: 0.85 },

  { source: "internship", target: "dream-job", strength: 0.7 },
  { source: "lost-job", target: "failure", strength: 0.75 },
  { source: "lost-job", target: "reinvention", strength: 0.7 },
  { source: "career-change", target: "identity", strength: 0.75 },

  { source: "moving", target: "living-alone", strength: 0.85 },
  { source: "moving", target: "new-city", strength: 0.9 },
  { source: "moving", target: "study-abroad", strength: 0.75 },

  { source: "living-alone", target: "confidence", strength: 0.75 },
  { source: "living-alone", target: "loneliness", strength: 0.7 },
  { source: "new-city", target: "reinvention", strength: 0.8 },
  { source: "study-abroad", target: "identity", strength: 0.75 },

  { source: "identity", target: "self-worth", strength: 0.9 },
  { source: "identity", target: "reinvention", strength: 0.85 },
  { source: "reinvention", target: "confidence", strength: 0.8 }
];
