    document.addEventListener("DOMContentLoaded", function () {
        setTimeout(function () {
            // Masque la page de chargement
            document.getElementById("loading-container").style.display = "none";
            // Affiche le contenu de la page
            document.getElementById("content").style.display = "block";
            // Affiche le popup
            document.getElementById("popup-container").style.display = "flex";
        }, 2000);
    });

    function closePopup() {
        document.getElementById("popup-container").style.display = "none";
    }

    function openLegalPopup() {
        document.getElementById("legal-popup-container").style.display = "flex";
    }

    function closeLegalPopup() {
        document.getElementById("legal-popup-container").style.display = "none";
    }