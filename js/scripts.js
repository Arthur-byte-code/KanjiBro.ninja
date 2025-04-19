$(document).ready(function() {
  console.log("KanjiBro iniciado!");

  const options = {
      strokeWidth: 3,
      fontSize: 16,
      zoomFactor: 100,
      displayOrders: true,
      colorGroups: false
  };

  // Animação dos traços
  function animateKanji(kanjiElement) {
      const paths = $(kanjiElement).find('path');
      let delay = 0;
      
      paths.each(function() {
          const path = $(this);
          const length = path[0].getTotalLength();
          
          path.css({
              'stroke-dasharray': length,
              'stroke-dashoffset': length,
              'transition': 'none'
          });
          
          setTimeout(() => {
              path.css({
                  'transition': 'stroke-dashoffset 0.8s ease-in-out',
                  'stroke-dashoffset': '0'
              });
          }, delay);
          
          delay += 800; // 0.8s entre traços
      });
  }

  // Carrega um kanji
  function loadKanji(character, index) {
      return new Promise((resolve) => {
          const card = $(`
              <div class="col-md-3 col-6 mb-4">
                  <div class="kanji-card h-100">
                      <div class="kanji-viewer-container" id="kanji-${index}">
                          <div class="loading-kanji"></div>
                      </div>
                      <div class="kanji-char">${character}</div>
                  </div>
              </div>
          `);
          
          $('#kanjisViewer').append(card);
          
          KanjiViewer.initialize(
              `kanji-${index}`,
              options.strokeWidth,
              options.fontSize,
              options.zoomFactor,
              options.displayOrders,
              options.colorGroups,
              character
          );
          
          // Anima após um pequeno delay
          setTimeout(() => {
              animateKanji($(`#kanji-${index}`));
              resolve();
          }, 300);
      });
  }

  // Carrega todos os kanjis
  async function drawKanji(text) {
      if (!text || text.trim() === '') {
          $('#kanjisViewer').html('<div class="col-12 text-center py-4"><p>Please enter some Japanese text</p></div>');
          return;
      }

      $('#kanjisViewer').empty();
      
      for (let i = 0; i < text.length; i++) {
          await loadKanji(text[i], i);
      }
  }

  // Event handlers
  $('#submitBtn').click(function() {
      const inputText = $('#kanji').val().trim();
      drawKanji(inputText);
  });

  // Exemplo inicial
  drawKanji("日本語");
});