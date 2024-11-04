const vowels = "aeiouy";
const consonants = "bcdfghjklmnpqrstvwxyz";
const punctuation = ".,!?;:";


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
