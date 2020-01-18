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

  document.querySelectorAll('[data-dy-decision-id]')
    .forEach(function(variationNode) {
      variationNode.addEventListener('mousedown', function() {
        reportClick({
          type: 'CLICK', 
          decisionId: variationNode.getAttribute('data-dy-decision-id'),
        });
      });
    });

  document.querySelectorAll('[data-dy-slot-id]')
    .forEach(function(productNode) {
      productNode.addEventListener('mousedown', function() {
        reportClick({
          type: 'SLOT_CLICK', 
          slotId: productNode.getAttribute('data-dy-slot-id')
        });
      });
    });
  
  function reportClick(engagement) {
    var xhr = new XMLHttpRequest();
    var url = '/reportClick';
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.send(JSON.stringify(engagement));
  }
})();