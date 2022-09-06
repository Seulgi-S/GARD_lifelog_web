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
    if(!emailPattern.test(email)){
        $('#email_x').css('display', 'inline-block');
        if(email==''){
            $('#email_x').css('display', 'none');
        }
    }else{
        $('#email_x').css('display', 'none');
        email_check_result = true;
        return email_check_result
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
// 회원가입 이동

function go_join() {
    document.getElementById("login_box_id").innerHTML =
        "<div id='login_logo_img'><img src='public/img/logo.png' alt='로고'></div>" +
        "<div id='login_input'>" + "<div id = 'input_name'><input type='text' placeholder='이름' name='name' id='name'></div>" +
        "<div id='input_id'><input type='text' placeholder='이메일' name='email' id='email' class='chk' title='이메일' autofocus onkeyup='emailCheck($(this))'><i id='email_x' class='fa-solid fa-circle-xmark fa-flip'style='--fa-animation-duration: 3s;'></i><br></div><div id='input_pw'><input type='text' placeholder='비밀번호' name='pw' id='pw' onkeypress='if(event.keyCode == 13) save_join()' class='chk' title='비밀번호'></div></div>" +
        "<div id='login_btns'><a id='login_btn' onclick='go_back()'>이전</a> <a id='join_btn' onclick='save_join()'>회원가입</a></div>"
}
function go_back() {
    document.getElementById("login_box_id").innerHTML =
        "<div id='login_logo_img'><img src='public/img/logo.png' alt='로고'></div>" +
        "<div id='login_input'><div id='input_id'><input type='text' placeholder='이메일' name='email' id='email' class='chk' title='이메일' autofocus onkeyup='emailCheck($(this))'><i id='email_x' class='fa-solid fa-circle-xmark fa-flip'style='--fa-animation-duration: 3s;'></i><br></div><div id='input_pw'><input type='password' placeholder='비밀번호' name='pw' id='pw' onkeypress='if(event.keyCode == 13) go_login()' class='chk' title='비밀번호'></div></div>" +
        "<div id='login_btns'><a id='login_btn' onclick='go_login()'>로그인</a> <a id='join_btn' onclick='go_join()'>회원가입</a></div>"
}
function save_join() {
    var name = $('#name').val();
    var email = $('#email').val();
    var pw = $('#pw').val();
    if (emptyCheck()) {
        if (emailCheck(email)) {
            $.ajax({
                url: '/join_ajax',
                type: 'POST',
                data: {
                    'name': name,
                    'email': email,
                    'pw': pw
                }
            }).done(function (result) {//회원가입 성공
                alert('회원가입 성공');
            }).fail(function (xhr, status, errorThrown) {//회원가입 실패
                alert("회원가입 실패");
            })
        } else {
            alert("이메일형식을 확인해주세요")
            $('#email').focus();
        }
    }
}