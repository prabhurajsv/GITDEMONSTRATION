const vowels = "aeiouy";
const consonants = "bcdfghjklmnpqrstvwxyz";
const punctuation = ".,!?;:";


function drawTreemap(data, text) {
    const tooltip = createTooltip(); // Create tooltip once for the treemap

    const width = 580;
    const height = 400;
    const color = d3.scaleOrdinal().domain(["Vowels", "Consonants", "Punctuation"])
        .range(["#6b486b", "#ff8c00", "#d0743c"]);

    const svg = d3.select("#treemap_svg").attr("width", width).attr("height", height);
    svg.selectAll("*").remove(); 

    const root = d3.hierarchy(data).sum(d => d.value);
    d3.treemap().size([width, height]).padding(1)(root);

    const nodes = svg.selectAll("rect")
        .data(root.leaves())
        .enter()
        .append("rect")
        .attr("x", d => d.x0)
        .attr("y", d => d.y0)
        .attr("width", d => d.x1 - d.x0)
        .attr("height", d => d.y1 - d.y0)
        .style("fill", d => color(d.parent.data.name))
        .style("stroke", "black")
        .style("stroke-width", 1)
        .on("click", function (event, d) {
            if (d && d.data && d.data.name) {
                drawSankey(d.data.name, text);  
            }
        })
        .on("mouseover", function(event, d) {
            showTooltip(tooltip, `Character: ${d.data.name}<br>Count: ${d.data.value}`, event);
            highlightTextarea(d.data.name); 
            highlightCorrespondingNodes(d.data.name); 
        })
        .on("mousemove", function(event) {
            moveTooltip(tooltip, event);
        })
        .on("mouseout", function() {
            hideTooltip(tooltip);
            removeHighlightTextarea(); 
            removeHighlightNodes(); 
        });
}