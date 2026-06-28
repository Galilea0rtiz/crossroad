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

  if (!searchInput) return;

  searchInput.addEventListener("input", (event) => {
    const searchTerm = event.target.value.toLowerCase().trim();

    if (searchTerm === "") {
      if (typeof resetGraphHighlight === "function") {
        resetGraphHighlight();
      }
      return;
    }

    const matchedNode = nodes.find((node) =>
      node.title.toLowerCase().includes(searchTerm) ||
      node.category.toLowerCase().includes(searchTerm)
    );

    if (matchedNode) {
      if (typeof focusNode === "function") {
        focusNode(matchedNode.id);
      }

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

  if (!submitBtn || !submitModal || !closeSubmit || !submitForm) return;

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

    const newNode = {
      id: "custom-" + Date.now(),
      title: title,
      category: category,
      stories: 1,
      avgAge: age,
      happinessAfter: happiness,
      description: description
    };

    console.log("New story submitted:", newNode);

    nodes.push(newNode);

    edges.push({
      source: category.toLowerCase(),
      target: newNode.id,
      strength: 0.7
    });

    submitModal.classList.add("hidden");
    submitForm.reset();

    if (typeof redrawGraph === "function") {
  redrawGraph();
} else {
  console.error("redrawGraph function does not exist.");
}

    openPanel(newNode);

    if (typeof focusNode === "function") {
      focusNode(newNode.id);
    }
  });
}

function initializeSidePanel() {
  const closePanel = document.getElementById("closePanel");
  const sidePanel = document.getElementById("sidePanel");

  if (!closePanel || !sidePanel) return;

  closePanel.addEventListener("click", () => {
    sidePanel.classList.remove("open");
  });
}

function openPanel(node) {
  const sidePanel = document.getElementById("sidePanel");
  const relatedList = document.getElementById("relatedList");

  if (!sidePanel) return;

  sidePanel.classList.add("open");

  document.getElementById("panelCategory").textContent = node.category || "";
  document.getElementById("panelTitle").textContent = node.title || "";
  document.getElementById("panelStories").textContent = node.stories || 0;
  document.getElementById("panelAge").textContent = node.avgAge || 0;
  document.getElementById("panelHappiness").textContent = (node.happinessAfter || 0) + "/10";
  document.getElementById("panelDescription").textContent = node.description || "";

  if (relatedList) {
    relatedList.innerHTML = "";
  }
}
