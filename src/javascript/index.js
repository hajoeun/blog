$(function() {
  var $nextBtn = $('.next.btn'), 
      $prevBtn = $('.prev.btn'),
      $section = $('section'), 
      $body = $('body');

  var length = $section.length - 1;
  
  var currentPage = 0;
  $body.stop().animate({scrollTop: 0});
  
  $body.on({
    'mousewheel': function(e) {
//      if ($nextBtn.attr('id') == $section.length - 1) return;
      e.preventDefault();
      e.stopPropagation();
    }
  })
  
  
  $nextBtn.on('click', function(e) {
    var nextPage = currentPage + 1;
    
    if (nextPage > length) return;
    
    $body.stop().animate({
      scrollTop: $section.eq(nextPage).offset().top
    }, 1000, function() {
      currentPage = nextPage;
      
      if (currentPage > 0) { 
        $prevBtn.show(); 
      }
      if (currentPage === length) {
        $nextBtn.text("NEXT");
      }
    })

    
  })

  $prevBtn.on('click', function(e) {
    var prevPage = currentPage - 1;

    $body.stop().animate({
      scrollTop: $section.eq(prevPage).offset().top
    }, 1000, function() {
      currentPage = prevPage;
      if (currentPage <= 0) { 
        return $prevBtn.hide();
      }
    })
    
  })
})
