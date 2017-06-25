const $button = $('button');

$button.click((event) => {
  event.preventDefault();
  fetchData();
});

function fetchData() {
  $(document).ready(() => {
  }
}

// Init function which will fire when the page loads.
(function init() {
  fetchData();
}());
