const vowels = "aeiouy";
const consonants = "bcdfghjklmnpqrstvwxyz";
const punctuation = ".,!?;:";

function processText() {
    const text = document.getElementById("wordbox").innerText.toLowerCase();
    const data = {
        name: "root",
        children: [
            { name: "Vowels", children: [] },
            { name: "Consonants", children: [] },
            { name: "Punctuation", children: [] }
        ]
    };

    const counts = {};
    for (let char of text) {
        if (vowels.includes(char) || consonants.includes(char) || punctuation.includes(char)) {
            counts[char] = (counts[char] || 0) + 1;
        }
    }

    for (let [char, count] of Object.entries(counts)) {
        if (vowels.includes(char)) {
            data.children[0].children.push({ name: char, value: count });
        } else if (consonants.includes(char)) {
            data.children[1].children.push({ name: char, value: count });
        } else if (punctuation.includes(char)) {
            data.children[2].children.push({ name: char, value: count });
        }
    }

    drawTreemap(data, text);
}

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



function createTooltip() {
    return d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("background", "#fff")
        .style("border", "1px solid #000")
        .style("padding", "5px")
        .style("border-radius", "3px")
        .style("pointer-events", "none")
        .style("opacity", 1); // Tooltip stays visible
}

function showTooltip(tooltip, htmlContent, event) {
    tooltip.html(htmlContent)
        .style("left", `${event.pageX + 10}px`)
        .style("top", `${event.pageY - 20}px`)
        .style("opacity", 1); // Ensure it remains visible
}

function moveTooltip(tooltip, event) {
    tooltip.style("left", `${event.pageX + 10}px`)
        .style("top", `${event.pageY - 20}px`);
}

function hideTooltip(tooltip) {
    tooltip.style("opacity", 0) // Tooltip remains but hidden
        .style("left", "-9999px"); // Move out of view
}
