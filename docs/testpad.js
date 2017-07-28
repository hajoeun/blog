_.go(10,
  function(a) {
    return new Promise(function(resolve) {
      setTimeout(function() {
        resolve(a + 10);
      }, 1000);
    });
  },
  function(a) { // 1초 뒤 실행
    console.log(a);
    // 20
  });


// _.go(10,
//   _.callback(function(a, next) {
//     setTimeout(function() {
//       next(a + 10);
//     }, 100)
//   }),
//   function(a) { // next를 통해 받은 결과 a
//     console.log(a);
//     // 20
//   });


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


// _.go([1, 2, 3],
//   _.map(syncDate),
//   _.map(d => d.toString()),
//   console.log);

_.go([1, 2, 3],
  _.map(promiseDate),
  _.map(d => d.toString()),
  console.log);




var promiseCount = 0;

  function testPromise() {
    var thisPromiseCount = ++promiseCount;

    var log = document.getElementById('log');
    log.insertAdjacentHTML('beforeend', thisPromiseCount +
      ') Started (<small>Sync code started</small>)<br/>');

    // 새 약속을 (생성)합니다: 이 프로미스의 숫자 셈을 약속합니다, 1부터 시작하는(3s 기다린 뒤)
    var p1 = new Promise(
      // resolver(결정자) 함수는 프로미스 (이행을) 결정 또는 거부하는
      // 능력과 함께 호출됩니다
      function(resolve, reject) {
        log.insertAdjacentHTML('beforeend', thisPromiseCount +
          ') Promise started (<small>Async code started</small>)<br/>');
        // 이는 비동기를 만드는 예에 불과합니다
        window.setTimeout(
          function() {
            // 프로미스 이행 !
            resolve(thisPromiseCount);
          }, 3000);
      }
    );

    var p2 = new Promise(
      // resolver(결정자) 함수는 프로미스 (이행을) 결정 또는 거부하는
      // 능력과 함께 호출됩니다
      function(resolve, reject) {
        log.insertAdjacentHTML('beforeend', thisPromiseCount +
          ') Promise started (<small>Async code started</small>)<br/>');
        // 이는 비동기를 만드는 예에 불과합니다
        window.setTimeout(
          function() {
            // 프로미스 이행 !
            resolve(thisPromiseCount);
          }, 3000);
      }
    );

    // 프로미스가 then() 호출로 결정된/이행된 경우 무엇을 할 지를 정의하고,
    // catch() 메서드는 프로미스가 거부된 경우 무엇을 할 지를 정의합니다.
    p1.then(
        function(val) {
          log.insertAdjacentHTML('beforeend', val + ') Promise fulfilled (<small>Async code terminated</small>)<br/>');
          return p2;
        })
      .then(
        function(reason) {
          console.log('Handle rejected promise ('+reason+') here.');
        });

    log.insertAdjacentHTML('beforeend', thisPromiseCount +
      ') Promise made (<small>Sync code terminated</small>)<br/>');
  }

  D.on(D('button#btn'), 'click', testPromise)