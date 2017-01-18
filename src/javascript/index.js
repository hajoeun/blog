$(function() {
  var $nextBtn = $('.next.btn'), $section = $('section'), $body = $('body');
  $body.stop().animate({scrollTop: 0})
  
  $body.on({
    'mousewheel': function(e) {
//      if ($nextBtn.attr('id') == $section.length - 1) return;
      e.preventDefault();
      e.stopPropagation();
    }
  })
  
  
  $nextBtn.on('click', function(e) {
    var nextId = parseInt(e.currentTarget.id) + 1
        length = $section.length - 1;
    
    if (nextId > length) return;
    
    $nextBtn.attr('id', nextId);

    
    $body.stop().animate({
      scrollTop: $section.eq(nextId).offset().top
    }, 1500)
    

    if (nextId === length) {
      $nextBtn.text("NEXT");
    }
  })
})
