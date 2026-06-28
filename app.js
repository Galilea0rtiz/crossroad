document.addEventListener("DOMContentLoaded", () => {
  initializeAboutModal();
  initializeSubmitForm();
  initializeSidePanel();
  initializeSearch();

  try {
    initializeGraph();
  } catch (error) {
    console.error("Graph failed to load:", error);
  }
});

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

function initializeAboutModal() {
  const aboutBtn = document.getElementById("aboutBtn");
  const aboutModal = document.getElementById("aboutModal");
  const closeAbout = document.getElementById("closeAbout");

  aboutBtn.addEventListener("click", () => {
    aboutModal.classList.remove("hidden");
  });

  closeAbout.addEventListener("click", () => {
    aboutModal.classList.add("hidden");
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

  submitForm.addEventListener("submit", (event) => {
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

    nodes.push(newNode);

    edges.push({
      source: category.toLowerCase(),
      target: newNode.id,
      strength: 0.7
    });

    submitModal.classList.add("hidden");
    submitForm.reset();

    redrawGraph();
    openPanel(newNode);
    focusNode(newNode.id);
  });
}

function initializeSidePanel() {
  const closePanel = document.getElementById("closePanel");

  closePanel.addEventListener("click", () => {
    document.getElementById("sidePanel").classList.remove("open");
  });
}

function openPanel(node) {
  document.getElementById("sidePanel").classList.add("open");

  document.getElementById("panelCategory").textContent = node.category;
  document.getElementById("panelTitle").textContent = node.title;
  document.getElementById("panelStories").textContent = node.stories;
  document.getElementById("panelAge").textContent = node.avgAge;
  document.getElementById("panelHappiness").textContent = node.happinessAfter + "/10";
  document.getElementById("panelDescription").textContent = node.description;

  const relatedList = document.getElementById("relatedList");
  relatedList.innerHTML = "";
}
