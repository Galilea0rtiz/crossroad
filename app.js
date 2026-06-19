document.addEventListener("DOMContentLoaded", () => {
  initializeAboutModal();
  initializeSubmitForm();
  initializeSearch();

  loadSavedStories()
    .catch((error) => {
      console.warn("Backend stories did not load. App still works:", error);
    })
    .finally(() => {
      initializeGraph();
    });
});

async function loadSavedStories() {
  try {
    const response = await fetch("/api/stories");

    if (!response.ok) {
      throw new Error("No backend found");
    }

    const savedStories = await response.json();

    savedStories.forEach((story) => {
      addStoryToData(story);
    });
  } catch (error) {
    const localStories = JSON.parse(localStorage.getItem("crossroadsStories")) || [];

    localStories.forEach((story) => {
      addStoryToData(story);
    });
  }
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

  submitForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const newStory = {
      id: "custom-" + Date.now(),
      title: document.getElementById("storyTitle").value.trim(),
      category: document.getElementById("storyCategory").value,
      stories: 1,
      avgAge: Number(document.getElementById("storyAge").value),
      happinessAfter: Number(document.getElementById("storyHappiness").value),
      description: document.getElementById("storyDescription").value.trim()
    };

    if (!newStory.title || !newStory.category || !newStory.description) {
      alert("Please fill out the full form.");
      return;
    }

    let savedStory = newStory;

    try {
      const response = await fetch("/api/stories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newStory)
      });

      if (response.ok) {
        savedStory = await response.json();
      } else {
        throw new Error("Backend save failed");
      }
    } catch (error) {
      const localStories = JSON.parse(localStorage.getItem("crossroadsStories")) || [];
      localStories.push(newStory);
      localStorage.setItem("crossroadsStories", JSON.stringify(localStories));
    }

    addStoryToData(savedStory);

    submitForm.reset();
    submitModal.classList.add("hidden");

    if (typeof redrawGraph === "function") {
      redrawGraph();
    }

    if (typeof openPanel === "function") {
      openPanel(savedStory);
    }

    if (typeof focusNode === "function") {
      setTimeout(() => focusNode(savedStory.id), 500);
    }
  });
}

function addStoryToData(story) {
  const alreadyExists = nodes.some((node) => node.id === story.id);

  if (alreadyExists) return;

  nodes.push(story);

  edges.push({
    source: story.category.toLowerCase(),
    target: story.id,
    strength: 0.7
  });
}

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

      if (typeof openPanel === "function") {
        openPanel(matchedNode);
      }
    }
  });
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

  sidePanel.classList.add("open");

  panelCategory.textContent = node.category;
  panelTitle.textContent = node.title;
  panelStories.textContent = node.stories;
  panelAge.textContent = node.avgAge;
  panelHappiness.textContent = node.happinessAfter + "/10";
  panelDescription.textContent = node.description;

  relatedList.innerHTML = "";

  const relatedEdges = edges.filter(edge => {
    const source = typeof edge.source === "object" ? edge.source.id : edge.source;
    const target = typeof edge.target === "object" ? edge.target.id : edge.target;

    return source === node.id || target === node.id;
  });

  relatedEdges.forEach(edge => {
    const source = typeof edge.source === "object" ? edge.source.id : edge.source;
    const target = typeof edge.target === "object" ? edge.target.id : edge.target;

    const relatedId = source === node.id ? target : source;
    const relatedNode = nodes.find(item => item.id === relatedId);

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

document.getElementById("closePanel").addEventListener("click", () => {
  document.getElementById("sidePanel").classList.remove("open");
});
