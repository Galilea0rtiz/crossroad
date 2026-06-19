document.addEventListener("DOMContentLoaded", async () => {
  await loadSavedStories();
  initializeGraph();
  initializeSearch();
  initializeSubmitForm();
});

async function loadSavedStories() {
  const response = await fetch("/api/stories");
  const savedStories = await response.json();

  savedStories.forEach((story) => {
    nodes.push(story);

    edges.push({
      source: story.category.toLowerCase(),
      target: story.id,
      strength: 0.7
    });
  });
}

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

  submitForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const category = document.getElementById("storyCategory").value;

    const newNode = {
      id: "custom-" + Date.now(),
      title: document.getElementById("storyTitle").value,
      category: category,
      stories: 1,
      avgAge: Number(document.getElementById("storyAge").value),
      happinessAfter: Number(document.getElementById("storyHappiness").value),
      description: document.getElementById("storyDescription").value
    };

    const response = await fetch("/api/stories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newNode)
    });

    if (!response.ok) {
      alert("Story could not be saved.");
      return;
    }

    const savedNode = await response.json();

    nodes.push(savedNode);

    edges.push({
      source: savedNode.category.toLowerCase(),
      target: savedNode.id,
      strength: 0.7
    });

    submitModal.classList.add("hidden");
    submitForm.reset();

    redrawGraph();
    openPanel(savedNode);
    setTimeout(() => focusNode(savedNode.id), 500);
  });
}
