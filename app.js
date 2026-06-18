// ==============================
// APP STARTUP
// ==============================

document.addEventListener("DOMContentLoaded", () => {
  loadSavedStories();
  initializeGraph();
  initializeSearch();
  initializeSubmitForm();
});

// ==============================
// LOCAL STORAGE
// This keeps new submissions saved in the visitor's browser.
// ==============================

const STORAGE_KEY = "crossroads-user-stories-v1";

function loadSavedStories() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return;

  try {
    const parsed = JSON.parse(saved);

    if (!Array.isArray(parsed.nodes) || !Array.isArray(parsed.edges)) return;

    parsed.nodes.forEach((savedNode) => {
      const alreadyExists = nodes.some((node) => node.id === savedNode.id);
      if (!alreadyExists) nodes.push(savedNode);
    });

    parsed.edges.forEach((savedEdge) => {
      const alreadyExists = edges.some((edge) =>
        edge.source === savedEdge.source &&
        edge.target === savedEdge.target
      );

      if (!alreadyExists) edges.push(savedEdge);
    });
  } catch (error) {
    console.error("Could not load saved Crossroads stories:", error);
  }
}

function saveUserStory(node, edge) {
  const saved = localStorage.getItem(STORAGE_KEY);

  let parsed = { nodes: [], edges: [] };

  if (saved) {
    try {
      parsed = JSON.parse(saved);
    } catch (error) {
      parsed = { nodes: [], edges: [] };
    }
  }

  parsed.nodes.push(node);
  parsed.edges.push(edge);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
}

// ==============================
// SEARCH
// ==============================

function initializeSearch() {
  const searchInput = document.getElementById("searchInput");

  searchInput.addEventListener("input", (event) => {
    const searchTerm = event.target.value.toLowerCase().trim();

    if (searchTerm === "") {
      resetGraphHighlight();
      return;
    }

    const matchedNode = nodes.find((node) =>
      node.title.toLowerCase().includes(searchTerm) ||
      node.category.toLowerCase().includes(searchTerm)
    );

    if (matchedNode) {
      focusNode(matchedNode.id);
      openPanel(matchedNode);
    }
  });
}

// ==============================
// SUBMIT STORY
// ==============================

function initializeSubmitForm() {
  const submitBtn = document.getElementById("submitBtn");
  const submitModal = document.getElementById("submitModal");
  const closeSubmit = document.getElementById("closeSubmit");
  const submitForm = document.getElementById("submitForm");

  submitBtn.addEventListener("click", () => {
    submitModal.classList.remove("hidden");
  });

  closeSubmit.addEventListener("click", () => {
    submitModal.classList.add("hidden");
  });

  submitModal.addEventListener("click", (event) => {
    if (event.target === submitModal) {
      submitModal.classList.add("hidden");
    }
  });

  submitForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const title = document.getElementById("storyTitle").value.trim();
    const category = document.getElementById("storyCategory").value;
    const age = Number(document.getElementById("storyAge").value);
    const happiness = Number(document.getElementById("storyHappiness").value);
    const description = document.getElementById("storyDescription").value.trim();

    if (!title || !category || !age || !happiness || !description) {
      alert("Please fill out every field before adding your experience.");
      return;
    }

    const newNode = {
      id: "custom-" + Date.now(),
      title,
      category,
      stories: 1,
      avgAge: age,
      happinessAfter: happiness,
      description
    };

    const newEdge = {
      source: category.toLowerCase(),
      target: newNode.id,
      strength: 0.7
    };

    nodes.push(newNode);
    edges.push(newEdge);
    saveUserStory(newNode, newEdge);

    submitModal.classList.add("hidden");
    submitForm.reset();

    redrawGraph();

    setTimeout(() => {
      openPanel(newNode);
      focusNode(newNode.id);
    }, 650);
  });
}
