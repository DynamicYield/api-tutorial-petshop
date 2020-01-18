/* eslint-disable */
(function() {

  var overlayElements = document.querySelectorAll('.ps-overlay, .ps-backdrop');
  var backdropElement = document.querySelector('.ps-backdrop');
  var closeButtonElement = document.querySelector('.ps-overlay .js-close-overlay');

  backdropElement && backdropElement.addEventListener('click', hideOverlay);
  closeButtonElement && closeButtonElement.addEventListener('click', hideOverlay);

  function hideOverlay() {
    overlayElements.forEach(function(el) {
      el.classList.add('ps-hidden')
    });
  }
})();