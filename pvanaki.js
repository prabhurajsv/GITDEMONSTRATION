const vowels = "aeiouy";
const consonants = "bcdfghjklmnpqrstvwxyz";
const punctuation = ".,!?;:";


function drawSankey(char, text) {
    document.getElementById("flow_label").innerText = `Character flow for '${char}'`;

    const sankeyData = generateSankeyData(char, text);
    if (!sankeyData || !sankeyData.nodes.length) {
        console.log("Error: Sankey data is empty or invalid.");
        return;
    }

    const width = 500;
    const height = 350;
    const tooltip = createTooltip(); 

    const sankeySvg = d3.select("#sankey_svg").attr("width", width).attr("height", height);
    sankeySvg.selectAll("*").remove();

    const sankey = d3.sankey()
        .nodeWidth(10)
        .nodePadding(12)
        .extent([[50, 1], [width - 50, height - 1]]); 

    const {nodes, links} = sankey({
        nodes: sankeyData.nodes.map(d => Object.assign({}, d)),
        links: sankeyData.links.map(d => Object.assign({}, d))
    });

    const color = d3.scaleOrdinal().domain(["Vowels", "Consonants", "Punctuation"])
        .range(["#6b486b", "#ff8c00", "#d0743c"]);

    sankeySvg.append("g")
        .selectAll("rect")
        .data(nodes)
        .enter()
        .append("rect")
        .attr("x", d => d.x0)
        .attr("y", d => d.y0)
        .attr("height", d => d.y1 - d.y0)
        .attr("width", d => d.x1 - d.x0)
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("fill", d => {
            if (vowels.includes(d.name)) return "#6b486b";
            if (consonants.includes(d.name)) return "#ff8c00";
            return "#d0743c"; 
        })
        .attr("stroke", "black")
        .on("mouseover", function(event, d) {
            const content = d.index === 0
                ? `Character '${d.name}' appears ${d.value} times.`
                : (d.x0 < sankey.extent()[1][0] / 2
                    ? `Character '${d.name}' flows into '${char}' ${d.value} times.`
                    : `Character '${char}' flows into '${d.name}' ${d.value} times.`);

            showTooltip(tooltip, content, event);
            highlightTextarea(d.name); 
            highlightCorrespondingNodes(d.name); 
        })
        .on("mousemove", function(event) {
            moveTooltip(tooltip, event);
        })
        .on("mouseout", function() {
            hideTooltip(tooltip);
            removeHighlightTextarea(); 
            removeHighlightNodes(); 
        });

    
    sankeySvg.append("g")
        .selectAll("text")
        .data(nodes)
        .enter()
        .append("text")
        .attr("x", d => d.x0 < width / 2 ? d.x0 - 6 : d.x1 + 6)
        .attr("y", d => (d.y0 + d.y1) / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", d => d.x0 < width / 2 ? "end" : "start")
        .text(d => d.name)
        .style("fill", "#000");


    sankeySvg.append("g")
        .selectAll("path")
        .data(links)
        .enter()
        .append("path")
        .attr("d", d3.sankeyLinkHorizontal())
        .attr("stroke", "#d0743c")
        .attr("stroke-width", d => Math.max(1, d) )
        .attr("stroke-width", d => Math.max(1, d.width))
        .attr("fill", "none")
        .attr("opacity", 0.5)  
        .on("mouseover", function(event, d) {
            const content = `Character '${d.source.name}' flows into '${d.target.name}' ${d.value} times.`;
            showTooltip(tooltip, content, event);
            highlightCorrespondingNodes(d.source.name); 
            highlightTextarea(d.source.name); 
        })
        .on("mousemove", function(event) {
            moveTooltip(tooltip, event);
        })
        .on("mouseout", function() {
            hideTooltip(tooltip);
            removeHighlightNodes(); 
            removeHighlightTextarea(); 
        });
}


function generateSankeyData(char, text) {
    const validCharacters = "abcdefghijklmnopqrstuvwxyz.,!?"; 
    const nodes = [{ name: char }];
    const links = [];

    const beforeChars = {};
    const afterChars = {};

   
    for (let i = 0; i < text.length; i++) {
        if (text[i] === char) {
            if (i > 0) {
                const prevChar = text[i - 1];
                if (validCharacters.includes(prevChar)) { 
                    beforeChars[prevChar] = (beforeChars[prevChar] || 0) + 1;
                }
            }
            if (i < text.length - 1) {
                const nextChar = text[i + 1];
                if (validCharacters.includes(nextChar)) { 
                    afterChars[nextChar] = (afterChars[nextChar] || 0) + 1;
                }
            }
        }
    }

    let index = 1; 
    const beforeNodeMap = {};
    Object.keys(beforeChars).forEach(prev => {
        beforeNodeMap[prev] = index;
        nodes.push({ name: prev });
        links.push({ source: index, target: 0, value: beforeChars[prev] });
        index++;
    });
    Object.keys(afterChars).forEach(next => {
        nodes.push({ name: next });
        links.push({ source: 0, target: index, value: afterChars[next] });
        index++;
    });

    return { nodes, links };
}