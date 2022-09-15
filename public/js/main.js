//section1 사진 넘어가는 기능
$('#section1 > div:gt(0)').hide();
setInterval(function(){
    $('#section1 > div:first').fadeOut(3000).next().fadeIn(3000).end().appendTo('#section1');
}, 4000);

//section2 css 제어용
function sec2_css_control(){
    var ani_time = 600;
    $('#s2_text1').animate({ opacity : '1' }, ani_time, function(){
        $('#s2_text2').animate({ opacity : '1' }, ani_time, function(){
            $('#s2_text3').animate({ opacity : '1' }, ani_time, function(){
                $('#s2_text4').animate({ opacity : '1' }, ani_time, function(){
                    $('#s2_text5').animate({ opacity : '1' }, ani_time, function(){
                        $('#s2_text6').animate({ opacity : '1' }, ani_time);
                    });
                });
            });
        });
    }); 
}

//section3 css 제어용
function sec3_css_control(){
    var ani_time = 600;
    $('#s3_l_top li:nth-child(1) img').animate({ opacity : '1' }, ani_time, function(){
        $('#s3_l_top li:nth-child(2) img').animate({ opacity : '1' }, ani_time, function(){
            $('#s3_l_top li:nth-child(3) img').animate({ opacity : '1' }, ani_time, function(){
                $('#s3_l_top li:nth-child(4) img').animate({ opacity : '1' }, ani_time, function(){
                    $('#s3_l_bot').animate({ opacity : '1' }, ani_time);
                });
            });
        });
    }); 
}

//section4 css 제어용
function sec4_css_control(){
    var ani_time = 600;
    $('#s4_r_top li:nth-child(1) img').animate({ opacity : '1' }, ani_time, function(){
        $('#s4_r_top li:nth-child(2) img').animate({ opacity : '1' }, ani_time, function(){
            $('#s4_r_top li:nth-child(3) img').animate({ opacity : '1' }, ani_time, function(){
                $('#s4_r_top li:nth-child(4) img').animate({ opacity : '1' }, ani_time, function(){
                    $('#s4_r_mid').animate({ opacity : '1' }, ani_time, function(){
                        $('#s4_r_bot ul').animate({ opacity : '1' }, ani_time, function(){
                            $('#s4_r_bot > p').animate({ opacity : '1' }, ani_time);
                        });
                    });
                });
            });
        });
    });
}

//section5 css 제어용
function sec5_css_control(){
    var ani_time = 600;
    $('#sec5_inner_content').animate({ opacity : '1' }, ani_time, function(){
        $('#sec5_imgs_1').animate({ opacity : '1' }, ani_time, function(){
            $('#sec5_imgs_2').animate({ opacity : '1' }, ani_time, function(){
                $('#sec5_imgs_3').animate({ opacity : '1' }, ani_time, function(){
                    $('#sec5_imgs_4').animate({ opacity : '1' }, ani_time, function(){
                        $('#sec5_imgs_5').animate({ opacity : '1' }, ani_time);
                    });
                });
            });
        });
    });
}

//애니메이션 작동할 영역 파악하기
function current_section(cl, state){
    //영역별 맨 윗 부분 위치
    var sec2_t = $('#section2').eq(0).offset().top;
    var sec3_t = $('#section3').eq(0).offset().top;
    var sec4_t = $('#section4').eq(0).offset().top;
    var sec5_t = $('#section5').eq(0).offset().top;
    //영역별 맨 아랫 부분 위치
    var sec2_b = $('#section2').offset().top + $('#section2').outerHeight();
    var sec3_b = $('#section3').offset().top + $('#section3').outerHeight();
    var sec4_b = $('#section4').offset().top + $('#section4').outerHeight();
    var sec5_b = $('#section5').offset().top + $('#section5').outerHeight();

    //현재 위치가 어느 영역과 가까운지 판단하기
    var cur_sec = {section: 'section', location: '0'}
    if(cl >= (sec2_t-80) && cl <= (sec2_b+10)){
        cur_sec.section = 'section2'
        cur_sec.location = sec2_t
        if(state === 'up') cur_sec.location = sec2_b
    }
    if(cl >= (sec3_t-100) && cl <= (sec3_b+40)){
        cur_sec.section = 'section3'
        cur_sec.location = sec3_t
        if(state === 'up') cur_sec.location = sec3_b
    }
    if(cl >= (sec4_t-40) && cl <= (sec4_b+40)){
        cur_sec.section = 'section4'
        cur_sec.location = sec4_t
        if(state === 'up') cur_sec.location = sec4_b
    }
    if(cl >= (sec5_t-40) && cl <= (sec5_b+40)){
        cur_sec.section = 'section5'
        cur_sec.location = sec5_t
        if(state === 'up') cur_sec.location = sec5_b
    } 
    return cur_sec //방향, 현재 위치에 따라 애니메이션이 작동할 영역의 위치(위 or 아래) 리턴
}

//영역별 css 제어하기
function section_css_control(section){
    if(section === 'section2') sec2_css_control()
    else if(section === 'section3') sec3_css_control()
    else if(section === 'section4') sec4_css_control()
    else if(section === 'section5') sec5_css_control()
}

//section2~5 영역 스크롤 감지용
function scroll_location(cl, state){ //cl==현재 위치, state==스크롤 방향
    re_cur_sec = current_section(cl, state)
    console.log('리턴된 섹션 : ' + re_cur_sec.section + ' / 리턴된 위치 : ' + re_cur_sec.location )

    var distanse = 0
    if (state === 'down'){ //스크롤 내릴 때
        distanse = re_cur_sec.location - cl
        if(distanse < 200 && distanse > -200){
            section_css_control(re_cur_sec.section)
        }
    }else{  //스크롤 올릴 때
        distanse = cl - re_cur_sec.location
        if(distanse < -500 && distanse > -($('#section2').height())){
            section_css_control(re_cur_sec.section)
        }
    }
    console.log(state + ' / ' + '현재 위치 : ' + cl + ' / ' + '영역 높이값 : ' + re_cur_sec.location)
}

//스크롤 움직일 때마다 위, 아래 방향 + 현재 위치값 알아내는 용도
$('body').on('mousewheel', function(e){
    var wheel = e.originalEvent.wheelDelta;
    var cur_location = $(document).scrollTop();
    var up_down = 'down'
    if(wheel > 0) up_down = 'up'
    scroll_location(cur_location, up_down)
})