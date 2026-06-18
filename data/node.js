const nodes = [
  {
    id: "love",
    title: "Love",
    category: "Core",
    stories: 1240,
    avgAge: 24,
    happinessAfter: 7.2,
    description: "Experiences centered around dating, relationships, heartbreak, and connection."
  },
  {
    id: "first-love",
    title: "First Love",
    category: "Love",
    stories: 412,
    avgAge: 18,
    happinessAfter: 8.1,
    description: "The first romantic connection that changed how people understood love."
  },
  {
    id: "breakup",
    title: "Breakup",
    category: "Love",
    stories: 690,
    avgAge: 22,
    happinessAfter: 6.8,
    description: "Stories about endings, healing, independence, and starting over."
  },
  {
    id: "situationship",
    title: "Situationship",
    category: "Love",
    stories: 350,
    avgAge: 21,
    happinessAfter: 5.4,
    description: "Unclear romantic connections that left people wanting answers."
  },
  {
    id: "long-distance",
    title: "Long Distance",
    category: "Love",
    stories: 280,
    avgAge: 23,
    happinessAfter: 6.2,
    description: "Relationships tested by distance, timing, trust, and communication."
  },
  {
    id: "dating-again",
    title: "Dating Again",
    category: "Love",
    stories: 230,
    avgAge: 24,
    happinessAfter: 7.5,
    description: "The experience of opening yourself back up after heartbreak."
  },

  {
    id: "goals",
    title: "Goals",
    category: "Core",
    stories: 980,
    avgAge: 25,
    happinessAfter: 8.0,
    description: "Experiences around ambition, discipline, identity, and future plans."
  },
  {
    id: "changed-major",
    title: "Changed Major",
    category: "Goals",
    stories: 505,
    avgAge: 20,
    happinessAfter: 8.7,
    description: "People who changed academic direction and rebuilt their plan."
  },
  {
    id: "started-business",
    title: "Started Business",
    category: "Goals",
    stories: 190,
    avgAge: 27,
    happinessAfter: 8.4,
    description: "The risk, pressure, and freedom of starting something alone."
  },
  {
    id: "dream-job",
    title: "Dream Job",
    category: "Goals",
    stories: 260,
    avgAge: 26,
    happinessAfter: 8.9,
    description: "Stories about finally reaching a role or career people once imagined."
  },
  {
    id: "confidence",
    title: "Confidence",
    category: "Goals",
    stories: 740,
    avgAge: 23,
    happinessAfter: 8.6,
    description: "Moments where people became more secure in who they are."
  },

  {
    id: "challenges",
    title: "Challenges",
    category: "Core",
    stories: 1340,
    avgAge: 25,
    happinessAfter: 6.9,
    description: "Hard seasons that shaped people’s resilience and perspective."
  },
  {
    id: "burnout",
    title: "Burnout",
    category: "Challenges",
    stories: 620,
    avgAge: 27,
    happinessAfter: 6.4,
    description: "When pressure, work, school, or expectations became too much."
  },
  {
    id: "loneliness",
    title: "Loneliness",
    category: "Challenges",
    stories: 580,
    avgAge: 22,
    happinessAfter: 6.1,
    description: "Feeling disconnected, isolated, or unseen during a life transition."
  },
  {
    id: "therapy",
    title: "Therapy",
    category: "Challenges",
    stories: 430,
    avgAge: 24,
    happinessAfter: 8.2,
    description: "The decision to ask for help and understand yourself more deeply."
  },
  {
    id: "failure",
    title: "Failure",
    category: "Challenges",
    stories: 510,
    avgAge: 23,
    happinessAfter: 7.3,
    description: "Experiences where something went wrong but eventually taught something important."
  },

  {
    id: "career",
    title: "Career",
    category: "Core",
    stories: 1120,
    avgAge: 27,
    happinessAfter: 7.6,
    description: "Jobs, internships, promotions, setbacks, and career identity."
  },
  {
    id: "first-job",
    title: "First Job",
    category: "Career",
    stories: 390,
    avgAge: 21,
    happinessAfter: 7.1,
    description: "The first step into professional life and learning workplace culture."
  },
  {
    id: "internship",
    title: "Internship",
    category: "Career",
    stories: 460,
    avgAge: 20,
    happinessAfter: 8.0,
    description: "Temporary roles that helped people test industries and skills."
  },
  {
    id: "lost-job",
    title: "Lost Job",
    category: "Career",
    stories: 260,
    avgAge: 29,
    happinessAfter: 6.5,
    description: "Stories of being laid off, fired, or unexpectedly leaving work."
  },
  {
    id: "career-change",
    title: "Career Change",
    category: "Career",
    stories: 410,
    avgAge: 31,
    happinessAfter: 8.3,
    description: "People who left one path behind to pursue something more aligned."
  },

  {
    id: "moving",
    title: "Moving",
    category: "Core",
    stories: 870,
    avgAge: 24,
    happinessAfter: 7.8,
    description: "Leaving one place for another and rebuilding home somewhere new."
  },
  {
    id: "living-alone",
    title: "Living Alone",
    category: "Moving",
    stories: 380,
    avgAge: 22,
    happinessAfter: 8.4,
    description: "Independence, silence, freedom, fear, and learning your own routines."
  },
  {
    id: "new-city",
    title: "New City",
    category: "Moving",
    stories: 440,
    avgAge: 24,
    happinessAfter: 7.9,
    description: "Starting fresh somewhere unfamiliar."
  },
  {
    id: "study-abroad",
    title: "Study Abroad",
    category: "Moving",
    stories: 310,
    avgAge: 21,
    happinessAfter: 8.8,
    description: "Travel, culture shock, independence, and personal growth."
  },

  {
    id: "identity",
    title: "Identity",
    category: "Core",
    stories: 930,
    avgAge: 23,
    happinessAfter: 8.1,
    description: "Moments where people understood themselves differently."
  },
  {
    id: "self-worth",
    title: "Self Worth",
    category: "Identity",
    stories: 520,
    avgAge: 22,
    happinessAfter: 8.5,
    description: "Learning that your value does not depend on someone else choosing you."
  },
  {
    id: "reinvention",
    title: "Reinvention",
    category: "Identity",
    stories: 460,
    avgAge: 25,
    happinessAfter: 8.6,
    description: "Becoming a new version of yourself after change."
  }
];
