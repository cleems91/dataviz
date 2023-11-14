// Utilise d3.json pour charger le fichier JSON des lauréats du prix Nobel
d3.json("json/data.json").then(function (data) {
    // Les données du JSON sont maintenant dans l'objet data

    // Sélectionne le menu déroulant
    const yearDropdown = d3.select("#year-dropdown");

    // Remplis le menu déroulant avec les années disponibles
    yearDropdown.selectAll("option")
        .data(Object.keys(data))
        .enter()
        .append("option")
        .text(year => year)
        .attr("value", year => year);

    // Ajoute un événement de changement au menu déroulant
    yearDropdown.on("change", function () {
        const selectedYear = this.value;
        // Efface le contenu précédent
        d3.select("#result-container").html("");
        // Appelle la fonction pour afficher les lauréats de l'année sélectionnée
        displayLaureates(selectedYear, data[selectedYear]);
        // Appelle la fonction pour afficher la carte
        displayMap(selectedYear, data[selectedYear]);
    });

}).catch(function (error) {
    // En cas d'erreur lors du chargement du fichier JSON des lauréats du prix Nobel
    console.error('Erreur lors du chargement du fichier JSON :', error);
});

// Fonction pour afficher les lauréats dans la div
function displayLaureates(year, laureatesByYear) {
    // Sélectionne le conteneur
    const resultContainer = d3.select("#result-container");

    // Ajoute une section pour chaque année
    const yearSection = resultContainer.append("div");

    // Ajoute le nom de l'année comme titre
    yearSection.append("h2")
        .text(`Année ${year}`);

    // Boucle à travers chaque catégorie pour cette année
    Object.keys(laureatesByYear).forEach(category => {
        // Ajoute le nom de la catégorie comme titre
        yearSection.append("h3")
            .text(category);

        // Ajoute une liste non ordonnée pour les lauréats de cette catégorie
        const laureatesList = yearSection.append("ul");

        // Ajoute chaque lauréat à la liste
        laureatesByYear[category].forEach(laureate => {
            laureatesList.append("li")
                .text(`${laureate.nom} - ${laureate.pays}`);
        });
    });
}

// Fonction pour afficher la carte
function displayMap(year, laureatesByYear) {
    // Utilise d3.json pour charger le fichier TopoJSON du monde
    d3.json("json/world-110m.json").then(function (world) {
        // Vérifie si la variable topojson est définie
        if (typeof topojson !== 'undefined') {
            // Sélectionne le conteneur de la carte
            const mapContainer = d3.select("#map-container");

            // Crée une projection cartographique
            const projection = d3.geoNaturalEarth1(); // Utilise d3.geoNaturalEarth1 à la place

            // Crée un générateur de chemins pour convertir les données TopoJSON en chemins SVG
            const pathGenerator = d3.geoPath().projection(projection);

            // Ajoute un groupe SVG pour la carte
            const svg = mapContainer.append("svg")
                .attr("width", 800)
                .attr("height", 500);

            // Ajoute les frontières du monde
            svg.append("path")
                .datum(topojson.mesh(world))
                .attr("class", "boundary")
                .attr("d", pathGenerator);

            // Crée un groupe pour chaque catégorie
            const categoryGroup = svg.append("g");

            // Boucle à travers chaque catégorie pour cette année
            Object.keys(laureatesByYear).forEach(category => {
                // Ajoute chaque lauréat à la carte
                laureatesByYear[category].forEach(laureate => {
                    // Recherche le pays du lauréat dans les données TopoJSON
                    const countryFeature = world.objects.countries
                        .geometries.find(country => country.properties.name === laureate.pays);

                    if (countryFeature) {
                        // Ajoute un chemin pour représenter le pays
                        categoryGroup.append("path")
                            .datum(countryFeature)
                            .attr("class", "country")
                            .attr("d", pathGenerator)
                            .style("fill", "blue");  // Changez la couleur selon vos besoins
                    }
                });
            });

        } else {
            console.error('La bibliothèque TopoJSON n\'est pas chargée.');
        }
    }).catch(function (error) {
        // En cas d'erreur lors du chargement du fichier TopoJSON du monde
        console.error('Erreur lors du chargement du fichier TopoJSON :', error);
    });
}
