/* eslint-disable */
(function() {
  var overlayElements = document.querySelectorAll('.ps-add-to-cart-overlay, .ps-backdrop');
  var backdropEl = document.querySelector('.ps-backdrop');
  var continueShoppingEl = document.querySelector('.js-continue-shopping');
  var closeButtonEl = document.querySelector('.js-close-overlay');
  var addToCartEl = document.querySelector('.js-add-to-cart');

  backdropEl.addEventListener('click', hideOverlay);
  continueShoppingEl.addEventListener('click', hideOverlay);
  closeButtonEl.addEventListener('click', hideOverlay);

  addToCartEl.addEventListener('click', function() {
    var sku = document.querySelector('[data-ps-sku]').getAttribute('data-ps-sku');
    var price = document.querySelector('[data-ps-price]').getAttribute('data-ps-price');
    addToCart(sku, price);
  })

  function showOverlay() {
    overlayElements.forEach(el => el.classList.remove('ps-hidden'));
  }

  function hideOverlay() {
    overlayElements.forEach(el => el.classList.add('ps-hidden'));
  }

  function addToCart(sku, price) {
    var xhr = new XMLHttpRequest();
    var url = '/product/add';
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

    xhr.addEventListener('load', () => {
      var response = JSON.parse(xhr.responseText);

      if (!response.success) {
        return;
      }

      showOverlay();
    });
    xhr.send(JSON.stringify({ sku, price, qty: 1 }));
  }
})();