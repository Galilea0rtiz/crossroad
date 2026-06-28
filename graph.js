// ==============================
// GRAPH VARIABLES
// ==============================

let svg;
let graphGroup;
let linkElements;
let nodeElements;
let labelElements;
let simulation;
let zoomBehavior;

// Category colors
const categoryColors = {
  Core: "#ffffff",
  Love: "#ff6b9a",
  Goals: "#f6c177",
  Challenges: "#a78bfa",
  Career: "#5eead4",
  Moving: "#60a5fa",
  Identity: "#f472b6"
};

// ==============================
// INITIALIZE GRAPH
// ==============================

function initializeGraph() {
  svg = d3.select("#graph");

  const width = window.innerWidth;
  const height = window.innerHeight;

  svg.attr("viewBox", `0 0 ${width} ${height}`);

  graphGroup = svg.append("g");

  // Glow filter
  const defs = svg.append("defs");

  const glow = defs.append("filter")
    .attr("id", "glow")
    .attr("height", "300%")
    .attr("width", "300%")
    .attr("x", "-100%")
    .attr("y", "-100%");

  glow.append("feGaussianBlur")
    .attr("stdDeviation", "4")
    .attr("result", "coloredBlur");

  const merge = glow.append("feMerge");

  merge.append("feMergeNode")
    .attr("in", "coloredBlur");

  merge.append("feMergeNode")
    .attr("in", "SourceGraphic");

  // Zoom / pan
  zoomBehavior = d3.zoom()
    .scaleExtent([0.35, 3])
    .on("zoom", (event) => {
      graphGroup.attr("transform", event.transform);
    });

  svg.call(zoomBehavior);

  // Copy data so D3 can safely mutate positions
  const graphNodes = nodes.map(node => ({ ...node }));
  const graphEdges = edges.map(edge => ({ ...edge }));

  // Physics simulation
  simulation = d3.forceSimulation(graphNodes)
    .force(
      "link",
      d3.forceLink(graphEdges)
        .id(d => d.id)
        .distance(d => 180 - d.strength * 70)
        .strength(d => d.strength)
    )
    .force("charge", d3.forceManyBody().strength(-520))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("collision", d3.forceCollide().radius(d => getNodeRadius(d) + 28));

  // Draw links
  linkElements = graphGroup
    .append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(graphEdges)
    .enter()
    .append("line")
    .attr("stroke", "#3a3a46")
    .attr("stroke-width", d => 1 + d.strength * 4)
    .attr("stroke-opacity", d => 0.25 + d.strength * 0.45);

  // Draw nodes
  nodeElements = graphGroup
    .append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(graphNodes)
    .enter()
    .append("circle")
    .attr("r", getNodeRadius)
    .attr("fill", d => categoryColors[d.category] || "#ffffff")
    .attr("stroke", "#ffffff")
    .attr("stroke-width", d => d.category === "Core" ? 1.8 : 0.8)
    .attr("opacity", 0.95)
    .attr("filter", "url(#glow)")
    .style("cursor", "pointer")
    .call(drag(simulation));

  // Draw labels
  labelElements = graphGroup
    .append("g")
    .attr("class", "labels")
    .selectAll("text")
    .data(graphNodes)
    .enter()
    .append("text")
    .text(d => d.title)
    .attr("fill", "#f5f5f7")
    .attr("font-size", d => d.category === "Core" ? "15px" : "12px")
    .attr("font-weight", d => d.category === "Core" ? "700" : "500")
    .attr("text-anchor", "middle")
    .attr("pointer-events", "none")
    .attr("opacity", 0.9);

  // Interactions
  nodeElements
    .on("mouseover", (event, d) => {
      highlightNeighborhood(d.id);
    })
    .on("mouseout", () => {
      resetGraphHighlight();
    })
    .on("click", (event, d) => {
      openPanel(d);
      focusNode(d.id);
    });

  // Update graph positions
  simulation.on("tick", () => {
    linkElements
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);

    nodeElements
      .attr("cx", d => d.x)
      .attr("cy", d => d.y);

    labelElements
      .attr("x", d => d.x)
      .attr("y", d => d.y + getNodeRadius(d) + 18);
  });

  // Resize support
  window.removeEventListener("resize", resizeGraph);
  window.addEventListener("resize", resizeGraph);
}

// ==============================
// NODE SIZE
// ==============================

function getNodeRadius(node) {
  if (node.category === "Core") {
    return 24;
  }

  return Math.max(8, Math.min(22, node.stories / 35));
}

// ==============================
// HIGHLIGHT CONNECTED NODES
// ==============================

function getConnectedNodeIds(nodeId) {
  const connected = new Set([nodeId]);

  edges.forEach(edge => {
    if (edge.source === nodeId) {
      connected.add(edge.target);
    }

    if (edge.target === nodeId) {
      connected.add(edge.source);
    }
  });

  return connected;
}

function highlightNeighborhood(nodeId) {
  const connectedIds = getConnectedNodeIds(nodeId);

  nodeElements
    .transition()
    .duration(180)
    .attr("opacity", d => connectedIds.has(d.id) ? 1 : 0.12);

  labelElements
    .transition()
    .duration(180)
    .attr("opacity", d => connectedIds.has(d.id) ? 1 : 0.08);

  linkElements
    .transition()
    .duration(180)
    .attr("stroke-opacity", d => {
      const sourceId = typeof d.source === "object" ? d.source.id : d.source;
      const targetId = typeof d.target === "object" ? d.target.id : d.target;

      return sourceId === nodeId || targetId === nodeId ? 0.9 : 0.05;
    })
    .attr("stroke", d => {
      const sourceId = typeof d.source === "object" ? d.source.id : d.source;
      const targetId = typeof d.target === "object" ? d.target.id : d.target;

      return sourceId === nodeId || targetId === nodeId ? "#ffffff" : "#3a3a46";
    });
}

// ==============================
// RESET HIGHLIGHT
// ==============================

function resetGraphHighlight() {
  if (!nodeElements || !linkElements || !labelElements) return;

  nodeElements
    .transition()
    .duration(180)
    .attr("opacity", 0.95);

  labelElements
    .transition()
    .duration(180)
    .attr("opacity", 0.9);

  linkElements
    .transition()
    .duration(180)
    .attr("stroke", "#3a3a46")
    .attr("stroke-opacity", d => 0.25 + d.strength * 0.45);
}

// ==============================
// FOCUS CAMERA ON NODE
// ==============================

function focusNode(nodeId) {
  if (!nodeElements || !zoomBehavior) return;

  const selectedNode = nodeElements
    .data()
    .find(node => node.id === nodeId);

  if (!selectedNode) return;

  const width = window.innerWidth;
  const height = window.innerHeight;

  const scale = 1.35;

  const transform = d3.zoomIdentity
    .translate(width / 2 - selectedNode.x * scale - 180, height / 2 - selectedNode.y * scale)
    .scale(scale);

  svg
    .transition()
    .duration(650)
    .ease(d3.easeCubicOut)
    .call(zoomBehavior.transform, transform);

  highlightNeighborhood(nodeId);
}

// ==============================
// DRAGGING
// ==============================

function drag(simulation) {
  function dragstarted(event, d) {
    if (!event.active) {
      simulation.alphaTarget(0.3).restart();
    }

    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }

  function dragended(event, d) {
    if (!event.active) {
      simulation.alphaTarget(0);
    }

    d.fx = null;
    d.fy = null;
  }

  return d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);
}

// ==============================
// RESIZE
// ==============================

function resizeGraph() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  svg.attr("viewBox", `0 0 ${width} ${height}`);

  simulation
    .force("center", d3.forceCenter(width / 2, height / 2))
    .alpha(0.4)
    .restart();
}
// ==============================
// REDRAW GRAPH AFTER NEW INPUT
// ==============================
function redrawGraph() {
  if (simulation) {
    simulation.stop();
  }

  d3.select("#graph").selectAll("*").remove();

  svg = null;
  graphGroup = null;
  linkElements = null;
  nodeElements = null;
  labelElements = null;
  simulation = null;

  initializeGraph();
}
