function syncDate() {
  return new Date();
}
function promiseDate() {
  return new Promise(function(resolve) {
    setTimeout(function() {
      resolve(new Date());
    }, 1000);
  });
}