document.addEventListener("DOMContentLoaded", function () {
    fetch("json/data.json")
      .then(response => response.json())
      .then(data => {
        createBarChart(data);
      });
  
    function createBarChart(data) {
      var ctx = document.getElementById("myVerticalBarChart").getContext("2d");
  
      var colors = ["#FF7B7B", "#5EFF64", "#3357FF", "#D376FF", "#6FC2FF", "#F1FF4C"];
  
      var config = {
        type: "bar",
        data: {
          labels: Object.keys(data),
          datasets: getDatasets(data, colors),
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              stacked: true,
            },
            y: {
              stacked: true,
            },
          },
          plugins: {
            
            legend: {
              display: true,
              position: "right",
              align: 'center',
              labels: {
                boxWidth: 100,
                usePointStyle: true,
                padding: 40,
                font: {
                  family: 'Arial',
                  size: 20,
                  weight: 'bold',
                },
              },
            },
            
            tooltip: {
              enabled: false,
            },
          },
          layout: {
            padding: {
              left: 50,
              right: 50,
            },
          },
          animation: {
            onComplete: function (animation) {},
          },
          onHover: function (event, elements) {
            if (elements && elements.length > 0) {
              // Obtenir l'index du premier élément survolé
              var index = elements[0].index;
  
              // Obtenir l'année correspondante
              var year = Object.keys(data)[index];
  
              // Obtenir les données du JSON pour l'année spécifique
              var yearData = data[year];
  
              // Construire le texte pour la fenêtre contextuelle
              var popupText = buildTooltipText(year, yearData);
  
              // Afficher la fenêtre contextuelle au survol
              showTooltip(event, popupText);
            } else {
              // Masquer la fenêtre contextuelle si aucun élément n'est survolé
              hideTooltip();
            }
          },
        },
      };
  
      // Création du graph
      var myChart = new Chart(ctx, config);
  
      // Fonction pour construire le texte de la fenêtre contextuelle
      function buildTooltipText(year, yearData) {
        var popupText = `<strong>Année : ${year}<br></strong><br>`;
        for (var category in yearData) {
          var laureates = yearData[category];
          popupText += `<strong>${category}</strong><br>`;
          laureates.forEach(laureate => {
            popupText += `${laureate.nom}: ${laureate.pays}<br>`;
          });
        }
        return popupText;
      }
  
      // Fonction pour afficher la fenêtre contextuelle
      function showTooltip(event, text) {
        var tooltip = document.getElementById("chart-tooltip");
        var popupContent = document.createElement("div");
        popupContent.innerHTML = text;
        tooltip.innerHTML = "";
        tooltip.appendChild(popupContent);
        tooltip.style.display = "block";
  
        // Ajuster la position de la fenêtre contextuelle
        tooltip.style.left = window.innerWidth - event.clientX > 300
          ? event.clientX + 10 + "px"
          : event.clientX - 310 + "px";
  
        tooltip.style.top = event.clientY + 10 + "px";
      }
  
      // Fonction pour masquer la fenêtre contextuelle
      function hideTooltip() {
        var tooltip = document.getElementById("chart-tooltip");
        tooltip.style.display = "none";
      }
    }
  
    function getDatasets(data, colors) {
      var datasets = [];
  
      for (var i = 0; i < colors.length; i++) {
        var category = Object.keys(data[Object.keys(data)[0]])[i];
        var dataset = {
          label: category,
          data: [],
          backgroundColor: colors[i],
        };
  
        for (var year in data) {
          var laureatesCount = data[year][category].length;
          dataset.data.push(laureatesCount);
        }
  
        datasets.push(dataset);
      }
  
      return datasets;
    }
  });
  
  // Fonction pour ouvrir la fenêtre contextuelle des mentions légales
  function openLegalPopup() {
    var legalPopup = document.getElementById("legal-popup-container");
    legalPopup.style.display = "flex";
  }
  
  // Fonction pour fermer la fenêtre contextuelle des mentions légales
  function closeLegalPopup() {
    var legalPopup = document.getElementById("legal-popup-container");
    legalPopup.style.display = "none";
  }
  
  // Fonction pour fermer la fenêtre contextuelle principale
  function closePopup() {
    var mainPopup = document.getElementById("popup-container");
    mainPopup.style.display = "none";
  }

  