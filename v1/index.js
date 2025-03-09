function toggleSection(header) {
    
    var section = header.closest('section'); // Find the parent section
        var children = section.children; // Get all children of the section
        var toggle = false; // Flag to indicate if we should toggle

        for (var i = 0; i < children.length; i++) {
            if (children[i] === header) {
                toggle = true; // Start toggling after the header
                continue; // Skip the header itself
            }
            
            if (toggle) {
                
                
                if (children[i].style.display === "none" || children[i].style.display === "") {
                    children[i].style.display = "block"; // Show content
                } else {
                    children[i].style.display = "none"; // Hide content
                }
            }
        }
}
