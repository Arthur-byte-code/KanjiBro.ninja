/**
 * KanjiVG Viewer
 */
KanjiViewer = {
  initialize: function(divName, strokeWidth, fontSize, zoomFactor, displayOrders, colorGroups, kanji) {
    this.divName = divName;
    this.strokeWidth = strokeWidth;
    this.fontSize = fontSize;
    this.displayOrders = displayOrders;
    this.colorGroups = colorGroups;
    this.kanji = kanji;
    this.fetchNeeded = true;
    this.setZoom(zoomFactor);
    this.refreshKanji();
  },

  setZoom: function(factor) {
    this.zoomFactor = factor || 1.0;
  },

  refreshKanji: function() {
    if (this.fetchNeeded && this.kanji) {
      var parent = this;

      var unicode = ("00000" + this.kanji.charCodeAt(0).toString(16)).slice(-5);
      $.ajax({
        url: "https://cdn.jsdelivr.net/gh/KanjiVG/kanjivg@master/kanji/" + unicode + ".svg",
        dataType: "xml",
        success: function(results) {
          parent.xml = results;
          parent.drawKanji();
        },
        error: function() {
          $("#" + parent.divName).html(
            '<div class="text-center p-3 text-muted">' +
              'Kanji "' + parent.kanji + '" not available<br>' +
              '<small>(Not in KanjiVG database)</small>' +
            '</div>'
          );
        }
      });
    }
  },

  drawKanji: function() {
    if (!this.xml) return;

    // Clona o elemento SVG e define tamanho e viewBox
    const svgElement = this.xml.documentElement.cloneNode(true);
    svgElement.setAttribute("width", "100%");
    svgElement.setAttribute("height", "100%");
    svgElement.setAttribute("viewBox", "0 0 109 109");

    // Se displayOrders for false, remove os números da ordem dos traços
    if (!this.displayOrders) {
      const texts = svgElement.querySelectorAll("text");
      texts.forEach(text => text.remove());
    }

    // Insere o SVG no container
    const container = document.getElementById(this.divName);
    container.innerHTML = "";
    container.appendChild(svgElement);
  }
};
