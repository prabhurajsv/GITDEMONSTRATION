const vowels = "aeiouy";
const consonants = "bcdfghjklmnpqrstvwxyz";
const punctuation = ".,!?;:";


function highlightTextarea(char) {
    const wordbox = document.getElementById("wordbox");
    const text = wordbox.innerText;
    
   
    let highlightedText = "";
    for (let i = 0; i < text.length; i++) {
        const currentChar = text[i];
        if (currentChar.toLowerCase() === char.toLowerCase()) {
            highlightedText += `<span class="highlight">${currentChar}</span>`;
        } else {
            highlightedText += currentChar;
        }
    }

    
    wordbox.innerHTML = highlightedText;
}

function removeHighlightTextarea() {
    const wordbox = document.getElementById("wordbox");
    wordbox.innerText = wordbox.innerText; 
}


function highlightCorrespondingNodes(char) {
   
    d3.selectAll("#treemap_svg rect")
        .filter(function(d) { return d.data.name === char; })
        .style("stroke", "red")
        .style("stroke-width", 3);


    d3.selectAll("#sankey_svg rect")
        .filter(function(d) { return d.name === char; })
        .style("stroke", "red")
        .style("stroke-width", 3);
}

function removeHighlightNodes() {
 
    d3.selectAll("#treemap_svg rect")
        .style("stroke", "black")
        .style("stroke-width", 1);

    d3.selectAll("#sankey_svg rect")
        .style("stroke", "black")
        .style("stroke-width", 1);
}