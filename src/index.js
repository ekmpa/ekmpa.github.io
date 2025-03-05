const nodes = [
    { id: "LinkedIn", url: "https://www.linkedin.com/in/emmakondrup/", image: "./media/linkedin.png" },
    { id: "GitHub", url: "https://github.com/ekmpa", image: "./media/github.png" },
    { id: "Email", url: "mailto:emmakndp@gmail.com", image: "./media/email.png" }
];

const links = [
    { source: "LinkedIn", target: "GitHub" },
    { source: "GitHub", target: "Email" },
    { source: "LinkedIn", target: "Email" }
];

const width = 150, height = 150;
const svg = d3.select("svg");

const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.id).distance(80))
    .force("charge", d3.forceManyBody().strength(-200))
    .force("center", d3.forceCenter(width / 2, height / 2));

const link = svg.selectAll("line")
    .data(links)
    .enter()
    .append("line")
    .attr("stroke", "black")
    .attr("stroke-width", 2);

const node = svg.selectAll("image")
    .data(nodes)
    .enter()
    .append("image")
    
    .attr("xlink:href", d => d.image)
    .attr("width", 32)
    .attr("height", 32)
    .attr("cursor", "pointer")
    .call(d3.drag()
        .on("start", dragStarted)
        .on("drag", dragged)
        .on("end", dragEnded))
    .on("click", (event, d) => {
        window.open(d.url, "_blank");
    });

node.on("mouseover", function(event, d) {
    d3.select(this)
        .transition()
        .duration(200)
        .attr("width", 40)
        .attr("height", 40);
    
    const affectedNodes = new Set([d.id]);
    links.forEach(link => {
        if (link.source.id === d.id) affectedNodes.add(link.target.id);
        if (link.target.id === d.id) affectedNodes.add(link.source.id);
    });
    
    simulation.force("charge", d3.forceManyBody().strength(node => affectedNodes.has(node.id) ? -500 : -200));
    simulation.alpha(0.5).restart();
})
.on("mouseout", function(event, d) {
    d3.select(this)
        .transition()
        .duration(200)
        .attr("width", 32)
        .attr("height", 32);
    
    simulation.force("charge", d3.forceManyBody().strength(-200));
    simulation.alpha(0.3).restart();
});

simulation.on("tick", () => {
    link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

    node
        .attr("x", d => d.x - 16)
        .attr("y", d => d.y - 16);
});

function dragStarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
}

function dragEnded(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}
