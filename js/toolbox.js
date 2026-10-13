let allData = [];
let selectedKeywords = new Set();


// =========================
// Load Excel file
// =========================

// Check if a specific toolbox element exists on the current page before trying to fetch
const toolboxTableContainer = document.getElementById("resultsTable"); 

if (toolboxTableContainer) {
    fetch("../data/fichier_compl_toolbox.xlsx")
        .then(response => {
            if (!response.ok) {
                throw new Error("Impossible de charger le fichier Excel.");
            }

            return response.arrayBuffer();
        })
        .then(data => {

            const workbook = XLSX.read(data, {
                type: "array"
            });

            const sheetName = workbook.SheetNames[0];

            const worksheet = workbook.Sheets[sheetName];

            const jsonData = XLSX.utils.sheet_to_json(
                worksheet,
                { defval: "" }
            );

            allData = jsonData;

            generateKeywordTags();
            updateTable();
        })
        .catch(error => {
            console.error(
                "Erreur lors du chargement du fichier Excel :",
                error
            );
        });
}

// =========================
// Generate keyword tags
// =========================

function generateKeywordTags() {

    const keywordSet = new Set();

    allData.forEach(row => {

        (row.Etiquettes || "")
            .split(",")
            .map(k => k.trim())
            .forEach(k => {

                if (k) {
                    keywordSet.add(k);
                }

            });
    });


    const container = document.getElementById("keywordTags");

    container.innerHTML = "";


    Array.from(keywordSet)
        .sort()
        .forEach(keyword => {

            const tag = document.createElement("span");

            tag.className = "tag";

            tag.textContent = keyword;

            tag.onclick = () =>
                toggleKeyword(keyword, tag);

            container.appendChild(tag);
        });
}


// =========================
// Toggle keyword
// =========================

function toggleKeyword(keyword, tagElement) {

    if (selectedKeywords.has(keyword)) {

        selectedKeywords.delete(keyword);

        tagElement.classList.remove("selected");

    } else {

        selectedKeywords.add(keyword);

        tagElement.classList.add("selected");
    }


    updateSelectedTags();
    updateTable();
}


// =========================
// Display selected filters
// =========================

function updateSelectedTags() {

    const container =
        document.getElementById("selectedTags");

    container.innerHTML =
        Array.from(selectedKeywords).join(", ") || "None";
}


// =========================
// Update results table
// =========================

function updateTable() {

    const tbody =
        document.querySelector("#resultsTable tbody");

    tbody.innerHTML = "";


    const limit =
        parseInt(
            document.getElementById("resultLimit").value,
            10
        );


    let filteredData = allData.map(row => {

        const keywords =
            (row.Etiquettes || "")
                .split(",")
                .map(k => k.trim());


        const matchCount =
            Array.from(selectedKeywords)
                .filter(k => keywords.includes(k))
                .length;


        return {
            ...row,
            matchCount
        };
    });


    // Apply keyword filters

    if (selectedKeywords.size > 0) {

        filteredData = filteredData
            .filter(row => row.matchCount > 0)
            .sort(
                (a, b) =>
                    b.matchCount - a.matchCount
            );
    }


    // Apply result limit

    if (limit > 0) {

        filteredData =
            filteredData.slice(0, limit);
    }

    // Display results

    filteredData.forEach(row => {

        const tr = document.createElement("tr");

        const toolPath = row.Outil
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "-");

        if (row.Fini === "Oui") {
            tr.classList.add("fini-oui");
        } else if (row.Fini === "Non") {
            tr.classList.add("fini-non");
        }

        tr.innerHTML = `
            <td><b>${row.Outil}</b></td>
            <td>${row.Description}</td>
            <td><b><i>${row.Etiquettes}</i></b></td>
        `;

        tr.style.cursor = "pointer";

        tr.addEventListener("click", () => {
            window.location.href = `../tools/${toolPath}/`;
        });

        tbody.appendChild(tr);
    });

}


// =========================
// Result limit listener (Safe version)
// =========================

const resultLimitElement = document.getElementById("resultLimit");

if (resultLimitElement) {
    resultLimitElement.addEventListener("change", updateTable);
}

// =========================
// Toggle menu
// =========================

function toggleMenu() {

    const menu = document.getElementById("navMenu");

    menu.classList.toggle("show");
}

// =========================
// Carousel
// =========================

document.addEventListener("DOMContentLoaded", () => {
    const track = document.querySelector('.carousel_carouselItemWrapper__EPKIt');
    if (!track) return; // Exit safely if carousel isn't on this page

    const slides = Array.from(track.children);
    const nextButton = document.querySelector('.caret-right');
    const prevButton = document.querySelector('.caret-left');
    const bubbles = document.querySelectorAll('.carousel_bubble__h_edT');
    const progressText = document.querySelector('.carousel_lineWrapper__RP4Yk p');
    const progressBar = document.querySelector('.carousel_progress__F5zal div');

    let currentIndex = 0;
    const totalSlides = slides.length;

    function updateCarousel() {
        // Move the track precisely by 100% per slide
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Update text counter (e.g., "1 sur 6")
        if (progressText) {
            progressText.textContent = `${currentIndex + 1} sur ${totalSlides}`;
        }

        // Update progress bar width percentage
        if (progressBar) {
            const percentage = ((currentIndex + 1) / totalSlides) * 100;
            progressBar.style.width = `${percentage}%`;
        }

        // Update active bubble state
        bubbles.forEach((bubble, index) => {
            if (index === currentIndex) {
                bubble.classList.add('carousel_currentBubble__r81YZ');
            } else {
                bubble.classList.remove('carousel_currentBubble__r81YZ');
            }
        });
    }

    // Next button click
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % totalSlides;
            updateCarousel();
        });
    }

    // Previous button click
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            updateCarousel();
        });
    }

    // Clickable bubbles for direct navigation
    bubbles.forEach((bubble, index) => {
        bubble.addEventListener('click', () => {
            currentIndex = index;
            updateCarousel();
        });
    });

    // Initialize layout on load
    updateCarousel();
});