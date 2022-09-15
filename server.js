//Express 서버 연결 + body-parser 사용
const express = require('express');
    //↓ 터미널에서 npm install body-parser 먼저 하기
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
const port = 3000;

//세션 사용
    //↓ 터미널에서 npm install express-session 먼저 하기
    // passport session 도 있다.
const session = require('express-session');
    //세션 환경 세팅
app.use(session({
    secret : '!@#$%^&*',  //암호 키 저장 옵션
    resave : false,  //재저장 반복 옵션
    saveUninitialized : false,  //초기화되지 않은 상태로 미리 저장할 수 있는 옵션
    //store : 세션 데이터의 저장소 설정 옵션
    cookie :{maxAge: 1000*60*60} //세션 만료 시간 == 현재 1시간 => 1분으로 해도 작동 잘 된다
}))
    //라우터를 사용하여 특정 경로로 들어올 경우 함수 실행
// var router = express.Router();


//서버 연결시 호출됨
app.listen(port, function(){
    console.log(`Server is listening at localhost:${port}`);
})

//DB 접속 정보 가져오기
const mysql = require('mysql');
const dbConfig = require('./config/db.config.js');

//DB Connection 객체 생성하기
const conn = mysql.createConnection({
    host : dbConfig.host,
    user : dbConfig.user,
    password : dbConfig.password,
    database : dbConfig.databasse
})

//DB Connection 실행하기
conn.connect(function(err){
    if(err) console.log(err);
    else console.log("DB 연결 완료")
})

//참고 사이트 : https://m.blog.naver.com/PostView.naver?isHttpsRedirect=true&blogId=cosmosjs&logNo=221397813256
    // https://berkbach.com/node-js-4-ab697cb1303c
    // https://medium.com/wasd/node-js-7-5106dac66b5d
    // https://edu.goorm.io/learn/lecture/332/todo-%EC%95%B1%EC%9D%84-%EC%A7%81%EC%A0%91-%EB%A7%8C%EB%93%A4%EB%A9%B4%EC%84%9C-%EB%B0%B0%EC%9A%B0%EB%8A%94-node-js-express-bootstrap-jquery/lesson/10137/%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8-%EC%8B%9C%EC%9E%91%ED%95%98%EA%B8%B0

//html 페이지 연결하기
// app.get('/main_html', function(req, res){
//     res.sendFile(__dirname+"/views/main.html");
// })

//ejs 페이지 연결하기
    //터미널에서 npm install ejs 먼저 하기


//각종 설정---------------------------------------------------------------------------------------------

    //↓ view engine을 ejs로 쓰겠다.
app.set("view engine", "ejs");

    //↓ ejs 파일을 저장할 때 views 폴더에 저장하면 따로 설정을 하지 않아도 app.js에서 views 폴더 안의 ejs 파일을 알아서 사용하도록 하는 설정
app.set("views", './views');

    //↓ 정적 파일 경로 지정하기(css, img, js)
const path = require('path');
const { response } = require('express');
const exp = require('constants');
app.use(express.static(path.join(__dirname)));



//페이지 연결-------------------------------------------------------------------------------------------

//login 페이지 연결
app.get('/login', function(req, res){
    if(!req.session.email){
        console.log('login/ 세션 없음');
        res.render('login'); //main.ejs 중 .ejs를 생략해도 되는 이유는 위의 view engine에서 설정했기 때문이다.
    }else {
        console.log('login/ 세션 있음');
        res.redirect('/main');
    }    
})

//login 요청을 했을 때
app.post('/login_ajax', function(req, res){
    let email = req.body.email;
    let pw = req.body.pw;
    //DB에서 ID, PW 일치여부 조회하기
    let exist_result = false;
    let sql = 'SELECT COUNT(*) AS exist FROM member_info WHERE email = ? AND pw = ?'
    conn.query(sql, [email, pw], function(err, result){
        if(err) console.log(err);
        else {
            if(result[0].exist == 1) exist_result = true;
        }    
        res.json(exist_result);
    })
})

//세션에 로그인 정보 저장하기
app.post('/session_save', function(req, res){
    let email = req.body.email;
    //DB에서 조회하기
    let sql = 'SELECT * FROM member_info WHERE email = ?';
    conn.query(sql, email, function(err, result){
        if(err) console.log(err);
        else{
            req.session.email = result[0].email;
            req.session.pw = result[0].pw;
            req.session.nickname = result[0].nickname;
            req.session.name = result[0].name;
            req.session.save(); 
            res.json('true');     //결과를 return 시키지만 login.ejs에서는 따로 사용하지 않음 
        } 
    })
})

//로그인 성공 후 메인 페이지로 이동하기 => 만약 세션에 정보가 없다면 login 페이지로 이동시킨다.
app.get('/main', function(req, res){
    if(!req.session.email){
        console.log('main/ 세션 없음');
        res.redirect('/login'); //라우터를 거쳐서 페이지로 감 => url 바뀜
    }else{
        console.log('main/ 세션 있음');
        res.render('main'); //바로 페이지 이동 => url 안 바뀜
    }
})

//로그아웃 처리
app.get('/logout', function(req, res){
    if(req.session.email){
        req.session.destroy(function(err){
            if(err) console.log(err)
            else res.redirect('/login');
        })
    }
    console.log('logout/ 세션 삭제 후 로그인 페이지로');
})

//마이페이지 이동 처리 => DB에 있는 정보를 다시 가져와 세션에 담는다(수정했을 경우를 대비해서)
app.get('/mypage', function(req, res){
    if(!req.session.email){
        console.log('mypage/ 세션 없음');
        res.redirect('/login');
    }else {
        console.log('mypage/ 세션 있음');

        let sql = 'SELECT * FROM member_info WHERE email = ?'
        conn.query(sql, req.session.email, function(err, result){
            if(err) console.log(err);
            else{
                req.session.email = result[0].email;
                req.session.pw = result[0].pw;
                req.session.nickname = result[0].nickname;
                req.session.name = result[0].name;
                req.session.save(); 
                res.render('mypage', {
                    email : req.session.email,
                    name : req.session.name,
                    nickname : req.session.nickname
                });
            } 
        })  
    }    
})

//회원 정보 수정 페이지로 이동
app.get('/update_form', function(req, res){
    if(!req.session.email){
        console.log('update_form/ 세션 없음');
        res.redirect('/login');
    }else {
        console.log('update_form/ 세션 있음');
        res.render('update_form', {
            email : req.session.email,
            name : req.session.name,
            nickname : req.session.nickname
        });
    }
})

//회원 정보 수정 저장
app.post('/update_db', function(req, res){
    let pw = req.body.pw;
    let name = req.body.name;
    let nickname = req.body.nickname;

    let sql = 'UPDATE member_info SET pw = ?, name = ?, nickname = ? WHERE email = ?'
    conn.query(sql, [pw, name, nickname, req.session.email], function(err, result){
        if(err) console.log(err);
        else res.redirect('/mypage');   
    })
})


//회원 탈퇴 처리
app.get('/withdrawal', function(req, res){
    let sql = 'DELETE FROM member_info WHERE email = ?'
    conn.query(sql, req.session.email, function(err, result){
        if(err) console.log(err);
        else{
            console.log("회원 탈퇴 완료");
            req.session.destroy(function(err){
                if(err) console.log(err)
                else res.redirect('/login');
            })
        }
    })
})

//회원가입 요청을 했을 때
app.post('/join_ajax', function(req, res){
    var email = req.body.email;
    var pw = req.body.pw;
    var name = req.body.name;
    //DB에서 ID, PW 일치여부 조회하기
    var sql1 = 'SELECT * FROM member_info WHERE email = ?'
    var sql2 = 'INSERT INTO member_info(email, pw, name) values(?,?,?) '
    conn.query(sql1, email, function(err, result){
        if(err) console.log(err);
        else {
            if(result[0]) console.log("이미 존재하는 이메일입니다.");
            else{
                conn.query(sql2, [email, pw, name], function(err, result){
                    if(err) console.log(err)
                    if(result) {
                        console.log("회원가입 완료") 
                        res.redirect("/login")
                    };
            })
            }
        }    
    })
})