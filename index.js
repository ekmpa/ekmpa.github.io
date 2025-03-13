const nodes = [
    { id: "LinkedIn", url: "https://www.linkedin.com/in/emmakondrup/", image: "./media/linkedin.png" },
    { id: "GitHub", url: "https://github.com/ekmpa", image: "./media/github.png" },
    { id: "Email", url: "mailto:emmakndp@gmail.com", image: "./media/email.png" },
    { id: "CV", url: "./media/cv.png", image: "./media/cv.png" },
    { id: "Scholar", url: "https://scholar.google.com/citations?user=Ov-LMukAAAAJ&hl=fr&oi=ao", image: "./media/scholar.png" }
];

// Function to generate random links ensuring no node has zero neighbors
function generateRandomLinks(nodes, maxLinks) {
    let randomLinks = [];
    let nodeIds = nodes.map(node => node.id);
    let connectedNodes = new Set(); // Track nodes that have at least one connection

    // Step 1: Ensure every node gets at least one connection
    for (let node of nodeIds) {
        let potentialTargets = nodeIds.filter(target => target !== node);
        let target = potentialTargets[Math.floor(Math.random() * potentialTargets.length)];

        randomLinks.push({ source: node, target: target });
        connectedNodes.add(node);
        connectedNodes.add(target);
    }

    // Step 2: Add additional random links up to maxLinks
    while (randomLinks.length < maxLinks) {
        let source = nodeIds[Math.floor(Math.random() * nodeIds.length)];
        let target = nodeIds[Math.floor(Math.random() * nodeIds.length)];

        // Ensure valid link (no self-links, no duplicates)
        if (source !== target && !randomLinks.some(link => 
            (link.source === source && link.target === target) ||
            (link.source === target && link.target === source))) {

            randomLinks.push({ source, target });
            connectedNodes.add(source);
            connectedNodes.add(target);
        }
    }

    return randomLinks;
}

// Generate a random number of links (between 5 and 8 to ensure enough connections)
const randomLinkCount = Math.floor(Math.random() * 4) + 5;
const links = generateRandomLinks(nodes, randomLinkCount);

const width = 300, height = 200;

const svg = d3.select("svg")
    .attr("width", width)
    .attr("height", height);

const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.id).distance(100))
    .force("charge", d3.forceManyBody().strength(-200))
    .force("center", d3.forceCenter(width / 2, height / 1.8))
    .force("bounding", d3.forceCollide().radius(45)) // avoid overlap
    .on("tick", () => {
        link
            .attr("x1", d => Math.max(16, Math.min(width - 16, d.source.x)))
            .attr("y1", d => Math.max(16, Math.min(height - 16, d.source.y)))
            .attr("x2", d => Math.max(16, Math.min(width - 16, d.target.x)))
            .attr("y2", d => Math.max(16, Math.min(height - 16, d.target.y)));
    
        node
            .attr("x", d => d.x = Math.max(25, Math.min(width - 25, d.x)) - 25)  // width boundaries
            .attr("y", d => d.y = Math.max(25, Math.min(height - 25, d.y)) - 25); // height boundaries
    });

const handleDownload = () => {
    const a = document.createElement("a");
    a.href = "./media/CV.pdf";
    a.download = "Emma-Kondrup-CV.pdf";
    a.click();
};

const link = svg.selectAll("line")
    .data(links)
    .enter()
    .append("line")
    .attr("stroke", "#ccc")
    .attr("stroke-width", 2);


const node = svg.selectAll("image")
    .data(nodes)
    .enter()
    .append("image")
    .attr("xlink:href", d => d.image)
    .attr("width", 45)
    .attr("height", 45)
    .attr("cursor", "pointer")
    .call(d3.drag()
        .on("start", dragStarted)
        .on("drag", dragged)
        .on("end", dragEnded))
    .on("click", (event, d) => {
        if (d.id === "CV") {
            handleDownload();
        } else {
            window.open(d.url, "_blank");
        }
    });

node.on("mouseover", function(event, d) {
    d3.select(this)
        .transition()
        .duration(200)
        .attr("width", 55)
        .attr("height", 55);
    
    const affectedNodes = new Set([d.id]);
    links.forEach(link => {
        if (link.source.id === d.id) affectedNodes.add(link.target.id);
        if (link.target.id === d.id) affectedNodes.add(link.source.id);
    });
    
    simulation.force("charge", d3.forceManyBody().strength(node => affectedNodes.has(node.id) ? -300 : -200));
    simulation.alpha(0.5).restart();
})
.on("mouseout", function(event, d) {
    d3.select(this)
        .transition()
        .duration(300)
        .attr("width", 45)
        .attr("height", 45);
    
    simulation.force("charge", d3.forceManyBody().strength(-10));
    simulation.alpha(0.3).restart();
});

function dragStarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragged(event, d) {
    d.fx = Math.max(25, Math.min(width - 25, event.x));
    d.fy = Math.max(25, Math.min(height - 25, event.y));
}

function dragEnded(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}

