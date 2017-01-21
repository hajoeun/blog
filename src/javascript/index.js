$(function() {
  var $nextBtn = $('.next.btn'), 
      $prevBtn = $('.prev.btn'),
      $section = $('section'), 
      $body = $('body');

  var length = $section.length - 1;
  var pages = {
    current: 0,
    next: 1,
    prev: -1
  };

  $body.stop().animate({scrollTop: 0});
  
  $body.on({
    'mousewheel': function(e) {
      if (e.originalEvent.deltaY > 0) {
        scrollNext();
      } else {
        scrollPrev();
      }
      e.preventDefault();
      e.stopPropagation();
    }
  })
  
  
  $nextBtn.on('click', scrollNext)
  $prevBtn.on('click', scrollPrev)

  function scrollNext() {
    pages.next = pages.current + 1;
    
    if (pages.next > length) return;
    
    $body.stop().animate({
      scrollTop: $section.eq(pages.next).offset().top
    }, 1000, function() {
      pages.current = pages.next;
      
      if (pages.current > 0) { 
        $prevBtn.show(); 
      }
      if (pages.current === length) {
        $nextBtn.text("NEXT");
      }
    })
  }

  function scrollPrev(e) {
    pages.prev = pages.current - 1;

    $body.stop().animate({
      scrollTop: $section.eq(pages.prev).offset().top
    }, 1000, function() {
      pages.current = pages.prev;
      if (pages.current <= 0) { 
        return $prevBtn.hide();
      }
    })
  }

})
