function scroll_move(n){
    $('html, body').stop().animate({
        scrollTop : $('.section_top').eq(n).offset().top
    }, 400);
    scroll_location($('.section_top').eq(n).offset().top, 'down')
}
