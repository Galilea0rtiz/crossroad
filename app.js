// Crossroads app wiring

document.addEventListener("DOMContentLoaded", () => {
  loadLocalStories();
  initializeGraph();
  initializeSearch();
  initializeAboutModal();
  initializeSubmitForm();
  initializeSidePanel();
});

function loadLocalStories() {
  const savedStories = JSON.parse(localStorage.getItem("crossroadsStories") || "[]");

  savedStories.forEach((story) => {
    const alreadyExists = nodes.some((node) => node.id === story.id);
    if (alreadyExists) return;

    nodes.push(story);
    edges.push(createEdgeForStory(story));
  });
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
    console.error("Submit form elements are missing.");
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

  submitForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const newNode = {
      id: "custom-" + Date.now(),
      title: document.getElementById("storyTitle").value.trim(),
      category: document.getElementById("storyCategory").value,
      stories: 1,
      avgAge: Number(document.getElementById("storyAge").value),
      happinessAfter: Number(document.getElementById("storyHappiness").value),
      description: document.getElementById("storyDescription").value.trim()
    };

    const savedStories = JSON.parse(localStorage.getItem("crossroadsStories") || "[]");
    savedStories.push(newNode);
    localStorage.setItem("crossroadsStories", JSON.stringify(savedStories));

    nodes.push(newNode);
    edges.push(createEdgeForStory(newNode));

    submitModal.classList.add("hidden");
    submitForm.reset();

    redrawGraph();
    openPanel(newNode);

    setTimeout(() => {
      focusNode(newNode.id);
    }, 500);
  });
}

function createEdgeForStory(story) {
  return {
    source: story.category.toLowerCase(),
    target: story.id,
    strength: 0.7
  };
}

function initializeSidePanel() {
  const closePanel = document.getElementById("closePanel");

  if (closePanel) {
    closePanel.addEventListener("click", () => {
      document.getElementById("sidePanel").classList.remove("open");
    });
  }
}

function openPanel(node) {
  const sidePanel = document.getElementById("sidePanel");
  const panelCategory = document.getElementById("panelCategory");
  const panelTitle = document.getElementById("panelTitle");
  const panelStories = document.getElementById("panelStories");
  const panelAge = document.getElementById("panelAge");
  const panelHappiness = document.getElementById("panelHappiness");
  const panelDescription = document.getElementById("panelDescription");
  const relatedList = document.getElementById("relatedList");

  if (!sidePanel) return;

  sidePanel.classList.add("open");

  panelCategory.textContent = node.category || "Experience";
  panelTitle.textContent = node.title || "Untitled";
  panelStories.textContent = node.stories || 1;
  panelAge.textContent = node.avgAge || "-";
  panelHappiness.textContent = (node.happinessAfter || "-") + "/10";
  panelDescription.textContent = node.description || "No description yet.";

  relatedList.innerHTML = "";

  const relatedEdges = edges.filter((edge) => {
    const source = typeof edge.source === "object" ? edge.source.id : edge.source;
    const target = typeof edge.target === "object" ? edge.target.id : edge.target;

    return source === node.id || target === node.id;
  });

  relatedEdges.forEach((edge) => {
    const source = typeof edge.source === "object" ? edge.source.id : edge.source;
    const target = typeof edge.target === "object" ? edge.target.id : edge.target;

    const relatedId = source === node.id ? target : source;
    const relatedNode = nodes.find((item) => item.id === relatedId);

    if (!relatedNode) return;

    const li = document.createElement("li");
    li.textContent = relatedNode.title;

    li.addEventListener("click", () => {
      openPanel(relatedNode);
      focusNode(relatedNode.id);
    });

    relatedList.appendChild(li);
  });
}
