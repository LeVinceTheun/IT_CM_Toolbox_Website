let allData = [];
let selectedKeywords = new Set();


// =========================
// Load Excel file
// =========================

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

        if (row.fini === "Oui") {
            tr.classList.add("fini-oui");
        } else if (row.fini === "Non") {
            tr.classList.add("fini-non");
        }

        tr.innerHTML = `
            <td>${row.Outil}</td>
            <td>${row.Description}</td>
            <td>${row.Etiquettes}</td>
        `;

        tr.style.cursor = "pointer";

        tr.addEventListener("click", () => {
            window.location.href = `../tools/${toolPath}/`;
        });

        tbody.appendChild(tr);
    });


// =========================
// Result limit listener
// =========================

document
    .getElementById("resultLimit")
    .addEventListener("change", updateTable);