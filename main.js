var http = require('http');
var url = require('url');
var qs = require('querystring');
var sanitizeHtml = require('sanitize-html');
var numeral = require('numeral');
var db = require('./lib/db');
var template = require('./lib/template.js');
var dateUtils = require('date-utils');
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG, DH_CHECK_P_NOT_PRIME } = require('constants');

var userStatus = '';

var app = http.createServer(function(request,response){
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;

  if(pathname === '/'){   //메인페이지
    if(userStatus == ''){     //랜덤 추출 select cid from restaurant order by rand() limit 10
      db.query(`SELECT * FROM MOVIE ORDER BY RAND() LIMIT 6`, function(error, movies){
        db.query(`SELECT * FROM MOVIE ORDER BY M_AvgGrade DESC LIMIT 6`, function(error3, movies2){
          var title = '오늘의 추천영화';
          var description = '오늘의 영화를 추천해드립니다';
          var title2 = '영화 순위 TOP 6';
          var description2 = '오늘의 영화 TOP 6 를 알려드립니다';
          var list = template.movie_list(movies);
          var list2 = template.movie_list(movies2);
          var html = template.HTML(title, '',
            `
            <h2>${title}</h2><h4>${description}</h4><br>
            <p>${list}</p>
            <br>
            <h2>${title2}</h2><h4>${description2}</h4><br>
            ${list2}
            <br>
      
            <style>
          
            h2{
              
              margin-top:20px;
              font-family: 'Do Hyeon', sans-serif;
              font-size:60px;}
         
          
            </style>
            `,
            ``,
            userStatus,
            '#menu_main'
          );
          response.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
          response.end(html);
        });
      });
    }
    else{     //관심장르중에 랜덤 추출
      db.query(`SELECT G_ID FROM INTEREST WHERE U_ID = ? ORDER BY G_ID`, [userStatus], function(error2, interest){
        if(interest == ''){
          db.query(`SELECT * FROM MOVIE ORDER BY RAND() LIMIT 6`, function(error, movies){
            db.query(`SELECT * FROM MOVIE ORDER BY M_AvgGrade DESC LIMIT 6`, function(error3, movies2){
              var title = '나만의 추천영화';
              var description = '회원 가입시 입력한 관심 장르를 기반으로 추천해 드립니다';
              var title2 = '오늘의 추천영화';
              var description2 = '오늘 당신에게 보여주고 싶은 영화를 추천해드립니다';
              var list = template.movie_list(movies);
              var list2 = template.movie_list(movies2);
              var html = template.HTML(title, '',
                `       
                <div id="cont_title">
                <h2>${title}</h2><h4>${description}</h4><br>
                ${list}
                <h2>${title2}</h2><h4>${description2}</h4><br>
                ${list2}
                </div>
                `,
                ``,
                userStatus,
                '#menu_main'
              );
              response.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
              response.end(html);
            });
          });
        }
        else{
          var q = `WHERE `;
          var i = 0;
          q = q + `G_ID = '${interest[i].G_ID}'`;
          i = i + 1;
          while(i < interest.length){
            q = q + ` OR G_ID = '${interest[i].G_ID}'`;
            i = i + 1;
          }
          db.query(`
                SELECT * FROM MOVIE INNER JOIN BELONG ON MOVIE.M_ID = BELONG.M_ID ${q} ORDER BY RAND() LIMIT 6
                `, 
                function(error, movies){
                  db.query(`SELECT * FROM MOVIE ORDER BY M_AvgGrade DESC LIMIT 6`, function(error3, movies2){
                    var title = '나만의 추천영화';
                    var description = userStatus + ' 님의 관심 장르를 기반으로 추천해 드립니다';
                    var title2 = '오늘의 추천영화';
                    var description2 = '오늘 영화 TOP 6 를 알려드립니다';
                    var list = template.movie_list(movies);
                    var list2 = template.movie_list(movies2);
                    var html = template.HTML(title, '',
                      `
                      <h2>${title}</h2><h4>${description}</h4><br>
                      ${list}
                      <h2>${title2}</h2><h4>${description2}</h4><br>
                      ${list2}
                      `,
                      ``,
                      userStatus,
                      '#menu_main'
                    );
                    response.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
                    response.end(html);
                  });
                }
          );
        }
      });
    }
  } 
  else if(pathname === '/search'){    //검색 페이지
    var title = '검색';
    var list = '<br>';
    var html = template.HTML(title, list,
      `
      <form action="/search_process" method="post">
        <h1 class="h1_search">Search</h1>
        <h6>관심있는 영화를 검색해보세요!</h6> <h6>영화 정보 뿐만 아니라 다른 사용자가 남긴 감상평과 평균별점을 볼 수 있습니다.</h6><br>
        <p><input type="text" id='s' name="search" placeholder="검색어를 입력하세요"></p>
        <p>
          <input type="submit" style="visibility: hidden;">
        </p>
      </form>
      `,
      `<br>`,
      userStatus,
      '#menu_search'
    );
    response.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
    response.end(html);
  }
  else if(pathname === '/search_process'){
    var body = '';
    request.on('data', function(data){
      body = body + data;
    });
    request.on('end', function(){
      var post = qs.parse(body);
      db.query(`SELECT * FROM MOVIE WHERE M_Name LIKE ? OR M_Director LIKE ? ORDER BY M_Name`, ['%'+post.search+'%', '%'+post.search+'%'], function(error, movies){
          if(error){
            throw error;
          }
          if(movies == ''){
            var title = '검색결과';
            var description = post.search + '에 대한 검색결과입니다.';
            var list = '검색결과가 없습니다.';
            var html = template.HTML(title, list,
              `
              <form action="/search_process" method="post">
                <h1 class="h1_search">Search</h1>
                <h6>관심있는 영화를 검색해보세요!</h6> <h6>영화 정보 뿐만 아니라 다른 사용자가 남긴 감상평과 평균별점을 볼 수 있습니다.</h6><br>
                <p><input type="text" id='s' name="search" placeholder="검색어를 입력하세요"></p>
                <p>
                  <input type="submit" style="visibility: hidden;">
                </p>
              </form>
              <br>
              <cont_title><h2>${title}</h2><h4>${description}</h4></cont_title>
              <br><br>
              `,
              ``,
              userStatus,
              '#menu_search'
            );
            response.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
            response.end(html);
          }
          else{
            var title = '검색결과';
            var description = post.search + '에 대한 검색결과입니다.';
            var list = template.movie_list(movies);
            var html = template.HTML(title, list,
              `
              <form action="/search_process" method="post">
                <h1 class="h1_search">Search</h1>
                <h6>관심있는 영화를 검색해보세요!</h6> <h6>영화 정보 뿐만 아니라 다른 사용자가 남긴 감상평과 평균별점을 볼 수 있습니다.</h6><br>
                <p><input type="text" id='s' name="search" placeholder="검색어를 입력하세요"></p>
                <p>
                  <input type="submit" style="visibility: hidden;">
                </p>
              </form>
              <br>
              <cont_title><h2>${title}</h2><h4>${description}</h4></cont_title>
              `,
              ``,
              userStatus,
              '#menu_search'
            );
            response.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
            response.end(html);
          }
      });
    });
  }
  else if(pathname === '/movie'){     //장르별 모아보기 페이지 (여기까지 order by 완료)
    if(queryData.id === undefined){
      if(queryData.category === undefined){
        db.query(`SELECT * FROM MOVIE ORDER BY M_Name`, function(error, movies){
          db.query(`SELECT * FROM GENRE ORDER BY G_ID`, function(error2, genres){
            var title = '장르별 모아보기';
            var description = '';
            var list_m = template.movie_list(movies);
            var list_g = template.genre_list(genres);
            var html = template.HTML(title, list_m,
              `
              <h2>${title}</h2><h4>${description}</h4><br>
              ${list_g}
              `,
              ``,
              userStatus,
              '#menu_genre'
            );
            response.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
            response.end(html);
          });
        });
      }
      else{
        db.query(`SELECT * FROM MOVIE INNER JOIN BELONG ON MOVIE.M_ID = BELONG.M_ID WHERE BELONG.G_ID = ? ORDER BY M_Name`, [queryData.category], function(error,movies){
          db.query(`SELECT * FROM GENRE ORDER BY G_ID`, function(error2, genres){
            var title = '장르별 모아보기';
            var description = '';
            var list_m = template.movie_list(movies);
            var list_g = template.genre_list(genres, queryData.category);
            var html = template.HTML(title, list_m,
              `
              <h2>${title}</h2>${description}<br>
              ${list_g}
              `,
              ``,
              userStatus,
              '#menu_genre'
            );
            response.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
            response.end(html);
          });
        });
      }
    }
    else {
      db.query(`SELECT * FROM MOVIE WHERE M_ID = ? ORDER BY M_Name`, [queryData.id], function(error,movie){
        var title = movie[0].M_Name;
        var description = '';
        
        db.query(`SELECT * FROM RECORD WHERE M_ID = ? ORDER BY R_Date DESC`, [queryData.id], function(error2, records){
          var list = template.one_eval_list(records);
          var movie_detail = template.movie_detail(movie);
          var html = template.HTML(title, '', 
          `
          <div class="container-fluid">
            ${movie_detail}
            <p></p>
            <br>
            
            ${list}
            <br>
            <br>
          </div>
          `,
            ``,
            userStatus
          );
          response.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
          response.end(html);
        });
      });
    }
  }
  else if(pathname === '/record'){      //감상문 자세히 보기
    if(queryData.uid === undefined || queryData.mid === undefined){
      response.writeHead(404);
      response.end('Not found');
    }
    else {
        db.query(`SELECT * FROM RECORD INNER JOIN MOVIE ON RECORD.M_ID = MOVIE.M_ID WHERE RECORD.U_ID = ? AND RECORD.M_ID = ?`, [queryData.uid, queryData.mid], function(error, record){
          if(error){
            throw error;
          }
          var title = record[0].M_Name;
          var description = record[0].R_Eval;
          var list = '';
          var record_detail = template.record_detail(record);
          var html = template.HTML(title, list, record_detail,
            ` 
            <button type="submit" class="btn"><a href="/update_record?uid=${queryData.uid}&mid=${queryData.mid}">감상평 수정</a></button><p></p>
            <form action="delete_record_process" method="post">
              <input type="hidden" name="uid" value="${queryData.uid}">
              <input type="hidden" name="mid" value="${queryData.mid}">
              <button type="submit" class="btn">감상평 삭제</button>
            </form>
            <style>
            a{
              text-decoration: none;
              color: black;
            }
            a:hover{
              text-decoration: none;
              color: white;
           }
            .btn {
              background-color: #5c5c5c;
              border: solid 3px #5c5c5c;
              color: black;
              padding: 10px 70px;
              font-size: 15px;
              font-family: 'Jeju Gothic', serif;
              position: relative;
              transition: all 300ms ease-in;
            }
            
            .btn:hover {
              color: white;
              cursor: pointer;
            }
            
            .btn:before {
              content: "";
              position: absolute;
              background-color: #e7e5e4;
              bottom: -1px;
              left: -2px;
              right: 100%;
              top: 0;
              z-index: -1;
              transition: right 300ms ease-in;
            }
          
            </style>
              
            `,
            userStatus,
            '#menu_my'
          );
          response.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
          response.end(html);
            
        })
    }
  }
  else if(pathname === '/create_record'){      //감상평 남기기 페이지
    db.query(`SELECT * FROM MOVIE ORDER BY M_Name`, function(error, movies){
      var title = '감상평 남기기';
      var list = '<br>';
      var movie_select_list = template.movie_select_list(movies);
      var html = template.HTML(title, list,
          `
          <h2>${title}</h2>
          <h4>영화의 감상평과 평점을 남기고 공유해보세요!</h4>
          <form action="/create_record_process" method="post">
         
            <input type="hidden" name="id" value="${userStatus}"/>
           <p1> 영화 목록 </p1>
            <p>
            
            <div class="select">
              <select name="movie">
                <option value="">영화선택</option>
                ${movie_select_list}
              </select>
              <div class="select__arrow"></div>
              </div>
           
            </p>
           <p1> 평점</p1> <p> </p> 
            <p><input oninput='ShowSliderValue(this.value)' type="range" name="grade" min="0" max="5" step="0.5">
            <font size=4 id = "slider_value_view">2.5</font></p>
            <p1>한줄평 </p1><p> </p> 
            <p>
              <textarea class="one_line" name="One_Eval" placeholder="한줄평"  style="border: 1px solid #BBB; color:#444" rows="1" cols="80"></textarea>
            </p>
            <p1>감상문 </p1><p> </p> 
            <p>
              <textarea class="s_line" name="Eval" placeholder="감상문" style="border: 1px solid #BBB; color:#444" rows="6" cols="80"></textarea>
            </p>
            <p>
            <button type="submit" class="btn">저장하기</button>
            </p>
          </form>

          <style>
          @import url(http://fonts.googleapis.com/earlyaccess/jejugothic.css);
          @import url('https://fonts.googleapis.com/css?family=Raleway');
          .one_line{
            background:#ccc; 
            padding:1em; 
            width:50%;
            height:5em;
            font-size:1em;
            line-height:1.5em;
            vertical-align:middle; 
            border: none;
          }
         .s_line{
            background:#ccc; 
            padding:1em; 
            width:50%;
            height:20em;
            font-size:1em;
            line-height:1.5em;
            vertical-align:middle; 
            border: none;
          }
          p1{                        
            font-family: 'Jeju Gothic', serif;
            font-size:15px;
          }

          .select {
            position: relative;
            display: inline-block;
            margin-bottom: 15px;
            width: 50%;
          }
          .select select {
            display: inline-block;
            width: 100%;
            cursor: pointer;
            padding: 10px 15px;
            outline: 0;
            border: 0;
            border-radius: 0;
            background: #ccc;
            color: 939393;
            appearance: none;
            -webkit-appearance: none;
            -moz-appearance: none;
          }
          .select select::-ms-expand {
            display: none;
          }
          .select select:hover,
          .select select:focus {
            color: #000;
            background: #e6e6e6;
          }
          .select__arrow {
            position: absolute;
            top: 16px;
            right: 15px;
            width: 0;
            height: 0;
            pointer-events: none;
            border-style: solid;
            border-width: 8px 5px 0 5px;
            border-color: #7b7b7b transparent transparent transparent;
          }
          .select select:hover ~ .select__arrow,
          .select select:focus ~ .select__arrow {
            border-top-color: #000;
          }

         
          .btn {
            background-color: #5c5c5c;
            border: solid 3px #5c5c5c;
            color: black;
            padding: 10px 70px;
            font-size: 15px;
            font-family: 'Jeju Gothic', serif;
            position: relative;
            transition: all 300ms ease-in;
          }
          
          .btn:hover {
            color: white;
            cursor: pointer;
          }
          
          .btn:before {
            content: "";
            position: absolute;
            background-color: #e7e5e4;
            bottom: -1px;
            left: -2px;
            right: 100%;
            top: 0;
            z-index: -1;
            transition: right 300ms ease-in;
          }
          
          .btn:hover:before {
            right: 0;
          }
          
          </style>
          `,
          `<br>`,
          userStatus,
          '#menu_review'
      );
      response.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
      response.end(html);
    });
  }
  else if(pathname === '/create_record_process'){
    var body = '';
    var newDate = new Date();
    var date = newDate.toFormat("YYYY-MM-DD");
    request.on('data', function(data){
      body = body + data;
    });
    request.on('end', function(){
      var post = qs.parse(body);

      if(post.id != '' && post.movie != ''){
        db.query(`SELECT * FROM RECORD WHERE U_ID = ? AND M_ID = ?`, [post.id, post.movie], function(err, exist_record){
          if(exist_record == ''){
            db.query(
              `
              INSERT INTO RECORD (U_ID, M_ID, R_Date, R_One_Eval, R_Eval, R_Grade) 
              VALUES(?, ?, ?, ?, ?, ?)
              `,
              [post.id, post.movie, date, post.One_Eval, post.Eval, post.grade], 
              function(error, result){
                  if(error){
                      throw error;
                  }
              }
            );
  
            db.query(`SELECT AVG(R_Grade) AS AVG FROM RECORD WHERE M_ID = ?`, [post.movie], function(error2, result2){
              if(error2){
                throw error2;
              }
              db.query(`UPDATE MOVIE SET M_AvgGrade = ? WHERE M_ID = ?`, [result2[0].AVG, post.movie], function(error3, result3){
                if(error3){
                  throw error3;
                }
              });
            });
  
            db.query(`SELECT SUM(M_RunningTime) AS SUM FROM RECORD INNER JOIN MOVIE ON RECORD.M_ID = MOVIE.M_ID WHERE U_ID = ?`, [post.id], function(error2, result2){
              if(error2){
                throw error2;
              }
              db.query(`UPDATE USER SET U_Time = ? WHERE U_ID = ?`, [result2[0].SUM, post.id], function(error3, result3){
                if(error3){
                  throw error3;
                }
              });
            });
    
            response.writeHead(302, {Location: `/my_record`, 'Content-Type':'text/html; charset=utf-8'});
            response.end();
          }
          else{
            var title = '등록 실패';
            var description = '이미 존재하는 감상문입니다.';
            var list = '';
            var html = template.HTML(title, list,
              `<h2>${title}</h2>${description}`,
              `<a href="/create_record">감상문쓰기</a>
              <br>
              <style>
              a{
                text-decoration: none;
                color: black;
                font-size: 20px;
              }
              a:hover{
                color: rgb(95, 95, 95);
                text-decoration: none;
                font-weight: bold;
              }
              </style>
              `,
              userStatus,
              '#menu_review'
            );
            response.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
            response.end(html);
          }
        })
      }
      else{
        var title = '등록 실패';
        var description = '영화를 선택하지 않았습니다.';
        var list = '';
        var html = template.HTML(title, list,
          `<h2>${title}</h2>${description}`,
          `<br>
          <a href="/create_record">감상문쓰기</a>
          
          <style>
          a{
            text-decoration: none;
            color: black;
            font-size: 20px;
          }
          a:hover{
            color: rgb(95, 95, 95);
            text-decoration: none;
            font-weight: bold;
          }
          </style>`,
          userStatus,
          '#menu_review'
        );
        response.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
        response.end(html);
      }
    });
  }
  else if(pathname === '/update_record'){     //감상평 수정하기
    db.query(`SELECT * FROM RECORD WHERE U_ID = ? AND M_ID = ?`, [queryData.uid, queryData.mid], function(error, record){
      var title = '감상평 남기기';
      var list = '<br>';
      var html = template.HTML(title, list,
          `
          <form action="/update_record_process" method="post">
            <input type="hidden" name="id" value="${queryData.uid}"/>
            <input type="hidden" name="movie" value="${queryData.mid}"/>
            <p1> 평점</p1> <p> </p> 
            <p><input oninput='ShowSliderValue(this.value)' type="range" name="grade" min="0" max="5" step="0.5">
            <font size=4 id = "slider_value_view">2.5</font></p>
            <p1>한줄평 </p1><p> </p> 
            <p>
              <textarea class="one_line" name="One_Eval" placeholder="한줄평" style="border: 1px solid #BBB; color:#444" rows="1" cols="80"></textarea>
            </p>
            <p1>감상문 </p1><p> </p> 
            <p>
              <textarea class="s_line" name="Eval" placeholder="감상문"  style="border: 1px solid #BBB; color:#444" rows="6" cols="80"></textarea>
            </p>
            <p>
               <button type="submit" class="btn">감상평 수정</button>
            </p>
          </form>
          <style>
          .one_line{
            background:#ccc; 
            padding:1em; 
            width:50%;
            height:5em;
            font-size:1em;
            line-height:1.5em;
            vertical-align:middle; 
            border: none;
          }
         .s_line{
            background:#ccc; 
            padding:1em; 
            width:50%;
            height:20em;
            font-size:1em;
            line-height:1.5em;
            vertical-align:middle; 
            border: none;
          }
          .btn {
            background-color: #5c5c5c;
            border: solid 3px #5c5c5c;
            color: black;
            padding: 10px 70px;
            font-size: 15px;
            font-family: 'Jeju Gothic', serif;
            position: relative;
            transition: all 300ms ease-in;
          }
          
          .btn:hover {
            color: white;
            cursor: pointer;
          }
          
          .btn:before {
            content: "";
            position: absolute;
            background-color: #e7e5e4;
            bottom: -1px;
            left: -2px;
            right: 100%;
            top: 0;
            z-index: -1;
            transition: right 300ms ease-in;
          }
          </style>
          `,
          `<br>`,
          userStatus,
          '#menu_my'
      );
      response.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
      response.end(html);
    });

    db.query(`SELECT * FROM MOVIE ORDER BY M_Name`, function(error, movies){
      
    });
  } 
  else if(pathname === '/update_record_process'){
    var body = '';
    request.on('data', function(data){
      body = body + data;
    });
    request.on('end', function(){
      var post = qs.parse(body);

      if(post.id != '' && post.movie != ''){
        db.query(
            `
            UPDATE RECORD SET R_One_Eval = ?, R_Eval = ?, R_Grade = ? WHERE U_ID = ? AND M_ID = ?
            `,
            [post.One_Eval, post.Eval, post.grade, post.id, post.movie], 
            function(error, result){
                if(error){
                    throw error;
                }
            }
        );

        db.query(`SELECT AVG(R_Grade) AS AVG FROM RECORD WHERE M_ID = ?`, [post.movie], function(error2, result2){
          if(error2){
            throw error2;
          }
          db.query(`UPDATE MOVIE SET M_AvgGrade = ? WHERE M_ID = ?`, [result2[0].AVG, post.movie], function(error3, result3){
            if(error3){
              throw error3;
            }
          });
        });

        db.query(`SELECT SUM(M_RunningTime) AS SUM FROM RECORD INNER JOIN MOVIE ON RECORD.M_ID = MOVIE.M_ID WHERE U_ID = ?`, [post.id], function(error2, result2){
          if(error2){
            throw error2;
          }
          db.query(`UPDATE USER SET U_Time = ? WHERE U_ID = ?`, [result2[0].SUM, post.id], function(error3, result3){
            if(error3){
              throw error3;
            }
          });
        });

        response.writeHead(302, {Location: `/my_record`, 'Content-Type':'text/html; charset=utf-8'});
        response.end();
      }
      else{
        var title = '등록 실패';
        var description = '영화를 선택하지 않았습니다.';
        var list = '';
        var html = template.HTML(title, list,
          `<h2>${title}</h2>${description}`,
          `<p></p><a href="/create_record">감상문쓰기</a>
          <style>
          a{
            text-decoration: none;
            color: black;
            font-size: 20px;
          }
        
          a:hover{
            color: rgb(95, 95, 95);
            text-decoration: none;
            font-weight: bold;
          }
          </style>`,
          userStatus,
          '#menu_my'
        );
        response.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
        response.end(html);
      }
    });
  } 
  else if(pathname === '/delete_record_process'){     //감상평 삭제
    var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);
          db.query('DELETE FROM RECORD WHERE U_ID = ? AND M_ID = ?', [post.uid, post.mid], function(error, result){
            if(error){
              throw error;
            }
          });

          db.query(`SELECT AVG(R_Grade) AS AVG FROM RECORD WHERE M_ID = ?`, [post.mid], function(error2, result2){
            if(error2){
              throw error2;
            }
            db.query(`UPDATE MOVIE SET M_AvgGrade = ? WHERE M_ID = ?`, [result2[0].AVG, post.mid], function(error3, result3){
              if(error3){
                throw error3;
              }
            });
          });
  
          db.query(`SELECT SUM(M_RunningTime) AS SUM FROM RECORD INNER JOIN MOVIE ON RECORD.M_ID = MOVIE.M_ID WHERE U_ID = ?`, [post.uid], function(error2, result2){
            if(error2){
              throw error2;
            }
            db.query(`UPDATE USER SET U_Time = ? WHERE U_ID = ?`, [result2[0].SUM, post.uid], function(error3, result3){
              if(error3){
                throw error3;
              }
            });
          });

          response.writeHead(302, {Location: `/my_record`, 'Content-Type':'text/html; charset=utf-8'});
          response.end();
      });
  } 
  else if(pathname === '/my_record'){     //나의 감상평 페이지
    if(userStatus === ''){
      response.writeHead(302, {Location: `/login`, 'Content-Type':'text/html; charset=utf-8'});
      response.end();
    }
    else {
      db.query(`SELECT * FROM RECORD INNER JOIN MOVIE ON RECORD.M_ID = MOVIE.M_ID WHERE RECORD.U_ID = ? ORDER BY MOVIE.M_Name`, [userStatus], function(error, records){
        if(error){
          throw error;
        }
        db.query(`SELECT * FROM USER WHERE U_ID = ?`, [userStatus], function(error2, user){
          var title = '나의 감상평';
          var description = `${user[0].U_Time}`;
          var list = template.my_record_list(records);
          var html = template.HTML(title, list,
            `
            <h2>내가 영화 본 시간</h2>
            <h4>총 <a style="color:#5c5c5c"><strong>${description}</strong></a> 분</h4>
            <div class="container-fluid">
              <div class="my_if" style="display: inline-block;">
                <p>라면을 먹었다면</p>
                <img src="https://www.flaticon.com/svg/static/icons/svg/723/723712.svg "height="100" width="100">
                <p></p>
                <h3>${(description/4).toFixed(0)}  개</h3>
                <p></p>
              </div>
              <div class="my_if" style="display: inline-block;">
              <p>잠을 잤다면</p>
              <img src="https://www.flaticon.com/svg/static/icons/svg/865/865813.svg"height="100" width="100">
                <p></p>
                <h3>${(description/480).toFixed(1)}  일</h3>
                <p></p>
              </div>
              <div class="my_if" style="display: inline-block;">
              <p>알바를 했다면</p>
              <img src="https://www.flaticon.com/svg/static/icons/svg/3595/3595942.svg "height="100" width="100">
                <p></p>
                <h3> ${numeral(((description/60)*8590).toFixed(0)).format('0,0')}  원</h3>
                <p></p>
              </div>
            </div>
            <style>
            img{
              box-shadow:none;
            }
            h4{
        
            font-size:50px;
            text-shadow: 2px 2px 6px gray;
            }
        
            h3{
              font-weight: bolder;
              text-size:60px;
              text-shadow: 2px 2px 6px rgba(255, 255, 255, .75);;
            }
        
            
            </style>

            `,
            ``,
            userStatus,
            '#menu_my'
          );
          response.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
          response.end(html);
        });
      })
    }
  }
  else if(pathname === '/register'){      //회원가입 페이지
    db.query(`SELECT * FROM GENRE ORDER BY G_ID`, function(error2, genres){
      var title = '회원가입';
      var list = '<br>';
      var list_g = template.genre_select_list(genres);
      var html = template.HTML(title, list,
        `
        <h2>${title}</h2>
        <br>
        <form action="/register_process" method="post">
          <h7>아이디 <br></h7>  
          <p><input type="text" id="id" name="id" placeholder="아이디" style=background:#ccc;></p>
          <h7>비밀번호 <br></h7> 
          <p><input type="password" id="pwd" name="pwd" placeholder="비밀번호"style=background:#ccc;></p>
          <h7>이름  <br></h7>
          <p><input type="text" id="name" name="name" placeholder="이름"style=background:#ccc;></p>
          <h7>성별  <br></h7>
          <input type="radio" id="male" name="sex" value="1">
          <label class="control control--radio" for="male">남
          <div class="control__indicator"></div>
          </label><br>
          <input type="radio" id="female" name="sex" value="0">
          <label class="control control--radio" for="female">여
          <div class="control__indicator"></div>
          </label><br>
          <h7>생년월일 <br></h7>
          <p><input type="date" id="birth" name="birth" placeholder="생년월일"style=background:#ccc;></p>
          <h7> 이메일  <br></h7>
          <p><input type="email" id="email" name="email" placeholder="이메일"style=background:#ccc;></p>
          <h7>관심장르 <br></h7>
          <p>
          
            ${list_g}
          </p>
          <p>
          <button type="submit" class="btn">회원가입</button>
          </p>
        </form>
        <style>
        h2{        
          margin-top:20px;
          font-family: 'Do Hyeon', sans-serif;
          font-size:60px;}

        .control__indicator {
          position: absolute;
          top: 2px;
          left: 0;
          height: 20px;
          width: 20px;
          background: #e6e6e6;
        }
        .control--radio .control__indicator {
          border-radius: 50%;
        }
        .control:hover input ~ .control__indicator,
        .control input:focus ~ .control__indicator {
          background: #a3a3a3;
        }
        .control input:checked ~ .control__indicator {
          background: #a3a3a3;
        }
        .control__indicator:after {
          content: '';
          position: absolute;
          display: none;
        }
        .control input:checked ~ .control__indicator:after {
          display: block;
        }
        .control--checkbox .control__indicator:after {
          left: 8px;
          top: 4px;
          width: 3px;
          height: 8px;
          border: solid #fff;
          border-width: 0 2px 2px 0;
          transform: rotate(45deg);
        }
        h7{
          font-size:20px;
          font-family: 'Do Hyeon', sans-serif;
          font-weight:bolder;
        }
        .btn {
          background-color: #5c5c5c;
          border: solid 3px #5c5c5c;
          color: black;
          padding: 10px 70px;
          font-size: 15px;
          font-family: 'Jeju Gothic', serif;
          position: relative;
          transition: all 300ms ease-in;
        }
        
        .btn:hover {
          color: white;
          cursor: pointer;
        }
        
        .btn:before {
          content: "";
          position: absolute;
          background-color: #e7e5e4;
          bottom: -1px;
          left: -2px;
          right: 100%;
          top: 0;
          z-index: -1;
          transition: right 300ms ease-in;
        }
      
        </style>

        `,
        `<br>`
      );
      response.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
      response.end(html);
    });
  }
  else if(pathname === '/register_process'){
    var body = '';
    request.on('data', function(data){
      body = body + data;
    });
    request.on('end', function(){
      var post = qs.parse(body);
      db.query(`SELECT * FROM USER WHERE U_ID = ?`, [post.id], function(error, result){
          if(error){
              throw error;
          }
          if(result == ''){
            db.query(
              `
              INSERT INTO USER (U_ID, U_Password, U_Name, U_Sex, U_Birth, U_Email, U_Time) 
              VALUES(?, ?, ?, ?, ?, ?, 0)
              `,
              [post.id, post.pwd, post.name, post.sex, post.birth, post.email], 
              function(error2, result2){
                if(error2){
                  throw error2;
                }
              }
            );
            var i = 1;
            while(i < post.genre.length){
              db.query(`INSERT INTO INTEREST (U_ID, G_ID) VALUES(?, ?)`, [post.id, post.genre[i]], function(error2, result2){
                if(error2){
                  throw error2;
                }
              });
              i = i + 1;
            }
            response.writeHead(302, {Location: `/login`, 'Content-Type':'text/html; charset=utf-8'});
            response.end();
          }
          else{
              var title = '회원가입 실패';
              var description = '중복된 아이디로 회원가입 실패했습니다.';
              var list = '';
              var html = template.HTML(title, list,
                `<h2>${title}</h2>${description}`,
                `<p></p>
                <a href="/register">회원가입</a>
                <style>
                a{
                  text-decoration: none;
                  color: black;
                  font-size: 20px;
                }
              
                a:hover{
                  color: rgb(95, 95, 95);
                  text-decoration: none;
                  font-weight: bold;
                }
                </style>`
              );
              response.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
              response.end(html);
          }
      });
    });
  }
  else if(pathname === '/login'){     //로그인 페이지
    var title = '로그인';
    var list = '<br>';
    var html = template.HTML(title, list,
        `
        <br><br><br>
        <div class="log-form container">
        <h2>Login to your account</h2>
          <form action="/login_process" method="post">
            <input type="text" name="id" placeholder="username" />
            <input type="password" name="pwd" placeholder="password" />
            <button type="submit" class="btn">Login</button>
          </form>
        </div><!--end log form -->
   <style>
   @font-face {
    font-family: 'Open Sans';
    font-style: normal;
    font-weight: 300;
    src: url(https://fonts.gstatic.com/s/opensans/v18/mem5YaGs126MiZpBA-UN_r8OUuhs.ttf) format('truetype');
  }
  @font-face {
    font-family: 'Open Sans';
    font-style: normal;
    font-weight: 400;
    src: url(https://fonts.gstatic.com/s/opensans/v18/mem8YaGs126MiZpBA-UFVZ0e.ttf) format('truetype');
  }
  @font-face {
    font-family: 'Open Sans';
    font-style: normal;
    font-weight: 600;
    src: url(https://fonts.gstatic.com/s/opensans/v18/mem5YaGs126MiZpBA-UNirkOUuhs.ttf) format('truetype');
  }
  @font-face {
    font-family: 'Open Sans Condensed';
    font-style: normal;
    font-weight: 300;
    src: url(https://fonts.gstatic.com/s/opensanscondensed/v15/z7NFdQDnbTkabZAIOl9il_O6KJj73e7Ff1GhDuXMQg.ttf) format('truetype');
  }
  @font-face {
    font-family: 'Open Sans Condensed';
    font-style: normal;
    font-weight: 700;
    src: url(https://fonts.gstatic.com/s/opensanscondensed/v15/z7NFdQDnbTkabZAIOl9il_O6KJj73e7Ff0GmDuXMQg.ttf) format('truetype');
  }
  * {
    box-sizing: border-box;
  }
  .log-form {
    padding: 0 !important;
    width: 40%;
    min-width: 320px;
    max-width: 475px;
    background: #fff;
    -webkit-transform: translate(-10%, -10%);
    -moz-transform: translate(-10%, -10%);
    -o-transform: translate(-10%, -10%);
    -ms-transform: translate(-10%, -10%);
    transform: translate(-10%, -10%);
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.25);
  }
  @media (max-width: 40em) {
    .log-form {
      width: 95%;
      position: relative;
      margin: 2.5% auto 0 auto;
      left: 0%;
      -webkit-transform: translate(0%, 0%);
      -moz-transform: translate(0%, 0%);
      -o-transform: translate(0%, 0%);
      -ms-transform: translate(0%, 0%);
      transform: translate(0%, 0%);
    }
  }
  .log-form form {
    display: block;
    width: 100%;
    padding: 2em;
  }
  .log-form h2 {
    color: #5d5d5d;
    font-family: 'open sans condensed';
    font-size: 1.35em;
    display: block;
    background: #2a2a2a;
    width: 100%;
    text-transform: uppercase;
    padding: 0.75em 1em 0.75em 1.5em;
    box-shadow: inset 0px 1px 1px rgba(255, 255, 255, 0.05);
    border: 1px solid #1d1d1d;
    margin: 0;
    font-weight: 200;
  }
  .log-form input {
    display: block;
    margin: auto auto;
    width: 100%;
    margin-bottom: 2em;
    padding: 0.5em 0;
    border: none;
    border-bottom: 1px solid #eaeaea;
    padding-bottom: 1.25em;
    color: #757575;
  }
  .log-form input:focus {
    outline: none;
  }
  .log-form .btn {
    display: inline-block;
    background: #404040;
    padding: 0.5em 2em;
    color: white;
    margin-right: 0.5em;
    box-shadow: inset 0px 1px 0px rgba(255, 255, 255, 0.2);
  }
  .log-form .btn:hover {
    background: #505050;
  }
  .log-form .btn:active {
    background: #505050;
    box-shadow: inset 0px 1px 1px rgba(0, 0, 0, 0.1);
  }
  .log-form .btn:focus {
    outline: none;
  }

   </style>

        `,
        `<br>`
    );
    response.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
    response.end(html);
  }
  else if(pathname === '/login_process'){
    var body = '';
    request.on('data', function(data){
      body = body + data;
    });
    request.on('end', function(){
      var post = qs.parse(body);
      db.query(`SELECT * FROM USER WHERE U_ID = ?`, [post.id], function(error, result){
          if(error){
            throw error;
          }
          if(result == ''){
            var title = '로그인 실패';
            var description = '존재하지 않는 아이디입니다.';
            var list = '';
            var html = template.HTML(title, list,
              `<h2>${title}</h2>${description}`,
              `<p></p><a href="/login">로그인</a>
              <style>
              a{
                text-decoration: none;
                color: black;
                font-size: 20px;
              }
            
              a:hover{
                color: rgb(95, 95, 95);
                text-decoration: none;
                font-weight: bold;
              }
              </style>`
            );
            response.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
            response.end(html);
          }
          else if(result[0].U_Password === post.pwd){
            userStatus = post.id;
            response.writeHead(302, {Location: `/`, 'Content-Type':'text/html; charset=utf-8'});
            response.end();
          }
          else{
            var title = '로그인 실패';
            var description = '비밀번호가 일치하지 않습니다.';
            var list = '';
            var html = template.HTML(title, list,
              `<h2>${title}</h2>${description}`,
              `<p></p><a href="/login">로그인</a>
              <style>
              a{
                text-decoration: none;
                color: black;
                font-size: 20px;
              }
            
              a:hover{
                color: rgb(95, 95, 95);
                text-decoration: none;
                font-weight: bold;
              }
              </style>`
            );
            response.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
            response.end(html);
          }
      });
    });
  }
  else if(pathname === '/logout'){      //로그아웃
    userStatus = '';
    response.writeHead(302, {Location: `/`, 'Content-Type':'text/html; charset=utf-8'});
    response.end();
  }
  else if(pathname === '/mypage'){       //마이페이지 관심장르 수정
    db.query(`SELECT * FROM GENRE ORDER BY G_ID`, function(error, genres){
      db.query(`SELECT * FROM INTEREST WHERE U_ID = ? ORDER BY G_ID`, [userStatus], function(error2, interest){
        var title = '내 관심장르 수정하기';
        var list = '<br>';
        var list_i = template.interest_list(genres, interest);
        var html = template.HTML(title, list,
          `
          <form action="/update_interest_process" method="post">
            <p>${userStatus}님의 관심장르</p>
            관심장르 : <br>
            <p>
              ${list_i}
            </p>
            <p>
            <button type="submit" class="btn">수정하기</button>
            </p>
          </form>
          <style>
          .btn {
            background-color: #5c5c5c;
            border: solid 3px #5c5c5c;
            color: black;
            padding: 10px 70px;
            font-size: 15px;
            font-family: 'Jeju Gothic', serif;
            position: relative;
            transition: all 300ms ease-in;
          }
          
          .btn:hover {
            color: white;
            cursor: pointer;
          }
          
          .btn:before {
            content: "";
            position: absolute;
            background-color: #e7e5e4;
            bottom: -1px;
            left: -2px;
            right: 100%;
            top: 0;
            z-index: -1;
            transition: right 300ms ease-in;
          }
        
          </style>
          `,
          `<br>`,
          userStatus
        );
        response.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
        response.end(html);
      });
    });
  }
  else if(pathname === '/update_interest_process'){
    var body = '';
    request.on('data', function(data){
      body = body + data;
    });
    request.on('end', function(){
      var post = qs.parse(body);
      db.query(`DELETE FROM INTEREST WHERE U_ID = ?`, [userStatus], function(error2, result2){
        if(error2){
          throw error2;
        }
      });
      if(post.genre == 'temp'){
        response.writeHead(302, {Location: `/`, 'Content-Type':'text/html; charset=utf-8'});
        response.end();
      }
      else{
        var i = 1;
        while(i < (post.genre.length)){
          db.query(
            `
            INSERT INTO INTEREST (U_ID, G_ID) 
            VALUES(?, ?)
            `,
            [userStatus, post.genre[i]], 
            function(error2, result2){
              if(error2){
                throw error2;
              }
            }
          );
          i = i + 1;
        }
        response.writeHead(302, {Location: `/`, 'Content-Type':'text/html; charset=utf-8'});
        response.end();
      }
    });
  }
  else {
    response.writeHead(404);
    response.end('Not found');
  }
});
app.listen(3000);