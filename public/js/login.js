let email_check_result = false;
//공백 체크
function emptyCheck(){
    let ok = true;
    $('.chk').each(function(){
        let data = $(this).val().replace(/ /gi, ""); //대소문자 무시하고(i) /사이/의 내용과 완전히 일치할 때(g),
        if(data == ""){
            alert($(this).attr('title')+'을(를) 공백없이 입력해주세요.')
            $(this).val('');
            $(this).focus();
            ok = false;
            return ok;
        }
    });
    return ok;
}

//이메일 유효성 검사
//참고 https://blckchainetc.tistory.com/231    https://imthekingofcoding.tistory.com/30
function emailCheck(email){
    let emailPattern = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
    //                 숫자, 알파벳, -, _ 가능         @필수   숫자, 알파벳, -, _ 가능   .필수   알파벳 2~3글자  
    if(!emailPattern.test(email.val())){
        $('#email_x').css('display', 'inline-block');
        if(email.val()==''){
            $('#email_x').css('display', 'none');
        }
    }else{
        $('#email_x').css('display', 'none');
        email_check_result = true;
    }    
}

//로그인하기
function go_login(){
    let email = $('#email').val();
    let pw = $('#pw').val();
    if(emptyCheck()){
        if(email_check_result){
            //alert("로그인 성공");
            $.ajax({
                url : '/login_ajax',
                type : 'POST',
                data : { 
                        'email' : email,
                        'pw' : pw
                        }
            }).done(function(result){//로그인 성공
                if(JSON.parse(result)){
                    alert('로그인 성공');
                    $.ajax({
                        url : '/session_save',
                        type : 'POST',
                        data : { 'email' : email }
                    }).done(function(result){
                        location.href = '/main';
                    }).fail(function(xhr, status, errorThrown){
                        alert("세션 저장 실패");
                    })
                }else{
                    alert("아이디 또는 비밀번호가 잘못 되었습니다.")
                }   
            }).fail(function(xhr, status, errorThrown){//로그인 실패
                alert("로그인 실패");
            })
        }else{
            $('#email').focus();
        }               
    }
}