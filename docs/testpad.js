window.$ = jQuery;
_.each($('body.home'), function(el) {
  
  var img_urls = [];
  _.each(_.range(6), function(i) {
    var img = new Image();
    img.onload = function() { img_urls.push(img.src) }
    return img.src = 'http://sainteast.co.kr/w/wp-content/uploads/2017/04/main_bg_0' + (i+1) +'.jpg';
  })
  
  // _.each($('.swiper-slide'), function(slide, i) {
  //   $(slide).css({'backgroundImage': 'url('+ img_urls[i] +')', 'backgroundSize': '100% 100%'});
  // })

  var html = _.t$(`
    .swiper-wrapper {{_.sum($, `, _.t$(`
      .swiper-slide[style='background-image: url({{$}}); background-size: 100% 100%;']
    `) ,`, )}}
    .swiper-pagination
    .swiper-button-next
    .swiper-button-prev
  `)(img_urls)

  $(el).addClass('swiper-container').append(html);

  var swiper = new Swiper('.swiper-container', {
    pagination: '.swiper-pagination',
    nextButton: '.swiper-button-next',
    prevButton: '.swiper-button-prev',
    paginationClickable: true,
    spaceBetween: 30,
    centeredSlides: true,
    autoplay: 3000,
    autoplayDisableOnInteraction: false,
    // loop: true
  });
})

_.each($('.page-about'), function() {
  var $img = $this.siblings('img');
  if ($img.length) {
    $('.about-infographic').css({'backgroundImage': 'url('+$img.attr('src')+')', 'backgroundSize': '100% 100%'});
    $img.remove();
  }
})