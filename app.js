// Crossroads app wiring
// This file makes the UI work even if the backend is not ready yet.

document.addEventListener("DOMContentLoaded", async () => {
  initializeGraph();
  initializeSearch();
  initializeAboutModal();
  initializeSubmitForm();

  // Load database stories after the page is already usable.
  await loadSavedStories();
});

async function loadSavedStories() {
  try {
    const response = await fetch("/api/stories");

    if (!response.ok) {
      console.warn("Stories API is not ready yet:", response.status);
      return;
    }

    const savedStories = await response.json();

    savedStories.forEach((story) => {
      const alreadyExists = nodes.some((node) => node.id === story.id);
      if (alreadyExists) return;

      nodes.push(story);
      edges.push(createEdgeForStory(story));
    });

    redrawGraph();
  } catch (error) {
    console.warn("Could not load saved stories. Form will still work locally.", error);
  }
}

function initializeSearch() {
  const searchInput = document.getElementById("searchInput");
  if (!searchInput) return;

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

function initializeAboutModal() {
  const aboutBtn = document.getElementById("aboutBtn");
  const aboutModal = document.getElementById("aboutModal");
  const closeAbout = document.getElementById("closeAbout");

  if (!aboutBtn || !aboutModal || !closeAbout) return;

  aboutBtn.addEventListener("click", () => {
    aboutModal.classList.remove("hidden");
  });

  closeAbout.addEventListener("click", () => {
    aboutModal.classList.add("hidden");
  });

  aboutModal.addEventListener("click", (event) => {
    if (event.target === aboutModal) {
      aboutModal.classList.add("hidden");
    }
  });
}

function initializeSubmitForm() {
  const submitBtn = document.getElementById("submitBtn");
  const submitModal = document.getElementById("submitModal");
  const closeSubmit = document.getElementById("closeSubmit");
  const submitForm = document.getElementById("submitForm");

  if (!submitBtn || !submitModal || !closeSubmit || !submitForm) {
    console.error("Submit form elements are missing from index.html");
    return;
  }

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

  submitForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const category = document.getElementById("storyCategory").value;

    const newNode = {
      id: "custom-" + Date.now(),
      title: document.getElementById("storyTitle").value.trim(),
      category: category,
      stories: 1,
      avgAge: Number(document.getElementById("storyAge").value),
      happinessAfter: Number(document.getElementById("storyHappiness").value),
      description: document.getElementById("storyDescription").value.trim()
    };

    let savedNode = newNode;

    try {
      const response = await fetch("/api/stories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newNode)
      });

      if (response.ok) {
        savedNode = await response.json();
      } else {
        console.warn("Story was added locally, but not saved to database:", response.status);
      }
    } catch (error) {
      console.warn("Story was added locally, but database is not connected yet.", error);
    }

    nodes.push(savedNode);
    edges.push(createEdgeForStory(savedNode));

    submitModal.classList.add("hidden");
    submitForm.reset();

    redrawGraph();
    openPanel(savedNode);
    setTimeout(() => focusNode(savedNode.id), 500);
  });
}

function createEdgeForStory(story) {
  return {
    source: story.category.toLowerCase(),
    target: story.id,
    strength: 0.7
  };
}
