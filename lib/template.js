var sanitizeHtml = require('sanitize-html');

module.exports = {
  USER:function(userStatus){
    if(userStatus == ''){
      return '<a href="/login">로그인</a><a href="/register">회원가입</a>';
    }
    else{
      return `<a href="/mypage">${userStatus}</a><a href="/logout">로그아웃</a>`;
    }
  },

  HTML:function(title, list, body, control, userStatus='', state=''){
    userStatus = this.USER(userStatus);
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="uft-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>마이무비-${title}</title>

        <!-- 합쳐지고 최소화된 최신 CSS -->
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">

        <!-- 글씨체 -->
        <link rel="preconnect" href="https://fonts.gstatic.com">
        <link href="https://fonts.googleapis.com/css2?family=Do+Hyeon&display=swap" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css2?family=Abril+Fatface&display=swap" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300&display=swap" rel="stylesheet">
        <link rel="preconnect" href="https://fonts.gstatic.com">
        <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@500;700&display=swap" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@500&display=swap" rel="stylesheet">

        <!-- 합쳐지고 최소화된 최신 자바스크립트 -->
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
        <script src='https://kit.fontawesome.com/a076d05399.js'></script>
       
        <style>
        
          .jumbotron{
            background-color: black !important;
            color: black !important;
            padding-left: 0% !important;
            padding-right: 0% !important;
            padding-bottom: 0% !important;
            padding-top: 0% !important;
          }
          
          .jumbotron h1{
            font-family: "Avant Garde", Avantgarde, "Century Gothic", CenturyGothic, "AppleGothic", sans-serif; 
            font-size: 92px;
            padding: 40px 50px;
            text-align: center;
            background-color: #e7e5e4;
            text-rendering: optimizeLegibility;
          }
          .jumbotron h3{
            font-family: 'Dancing Script', cursive;
          }
      
          h1.retroshadow {
          color: #131313;
          letter-spacing: 0.15em;
          text-shadow: 1px -1px 0 #767676, -1px 2px 1px #737272, -2px 4px 1px #767474, -3px 6px 1px #787777, -4px 8px 1px #7b7a7a, -5px 10px 1px #7f7d7d, -6px 12px 1px #828181, -7px 14px 1px #868585, -8px 16px 1px #8b8a89, -9px 18px 1px #8f8e8d, -10px 20px 1px #949392, -11px 22px 1px #999897, -12px 24px 1px #9e9c9c, -13px 26px 1px #a3a1a1, -14px 28px 1px #a8a6a6, -15px 30px 1px #adabab, -16px 32px 1px #b2b1b0, -17px 34px 1px #b7b6b5, -18px 36px 1px #bcbbba, -19px 38px 1px #c1bfbf, -20px 40px 1px #c6c4c4, -21px 42px 1px #cbc9c8, -22px 44px 1px #cfcdcd, -23px 46px 1px #d4d2d1, -24px 48px 1px #d8d6d5, -25px 50px 1px #dbdad9, -26px 52px 1px #dfdddc, -27px 54px 1px #e2e0df, -28px 56px 1px #e4e3e2;
          }

          .jumbotron-image{
              padding: 30px;
              background-image: url('https://postfiles.pstatic.net/MjAyMDEyMDZfMjAw/MDAxNjA3MTgxNTg4MDc2.JQ-mrl-4wBkrmMMOms2bhC15YUQrwMZp37-P1NVPwbog.wqdQdrZFt-hxaN66bUX58kryTwH72fZzczZaMvZn6l0g.PNG.tkddms4199/movie_title.png?type=w773');
              background-position: center center;
              background-repeat: repeat-x;
              background-size: auto 100%;
          }
          
          .jumbotron a{
              color: black;
          }
          
          .jumbotron a:hover{
              color: rgb(95, 95, 95);
              text-decoration: none;
              border-radius: 30px 30px 0px 0px;
          }
          
          .wrapper {
            margin: 0px auto;
            width: 80%;
            font-family: sans-serif;
            color: #555;
            font-size: 30px;
            line-height: 60px;
          }
          .tabs li {
            float: left;
            width: 20%;
            list-style:none;
          }
          .tabs a {
            display: block;
            text-align: center;
            text-decoration: none;
            text-transform: uppercase;
            color: #888;
            padding: 10px 0;
            background: black;
          }
          .tabs a:hover,
          .tabs a.active {
            background: #e7e5e4;
          }
          .tabgroup div {
            padding: 30px;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);
          }
          .clearfix:after {
            content: "";
            display: table;
            clear: both;
          }
          
          #top_menu a{
              padding-top: 5px;
              padding-bottom: 5px;
              padding-left: 10px;
              padding-right: 10px;
              margin-left: 10px;
              background-color: black;
              color: whitesmoke;
              border-radius: 10px;
          }
    
          body{
            background-color: #e7e5e4;
          }
          footer{
              background-color: black;
              color: whitesmoke;
              padding: 10px;
          }
          
          #footer_menu, #footer_info{
              display: inline-table;
              padding: 20px;
              margin: 20px;
              border: solid 1px whitesmoke;
          }
          
          #footer_menu a{
              display: table-row;
              height: 30px;
              color: whitesmoke;
          }
          
          .main_content{
              height: auto;
              text-align: center;
          }
            
          cont_title{
            display:inline-block;
          }

          h2{ 
            align:center;
            margin-top:20px;
            font-family: 'Do Hyeon', sans-serif;
            font-size:60px;}
          
          h4{
            align:center;
            font-family: 'Noto Sans KR', sans-serif;
          }

          h6{
            font-family: 'Noto Sans KR', sans-serif;
          }

          form{
            text-align:center;
          }

          .h1_search{
            padding-top:50px;
            font-family: 'Abril Fatface', cursive;
            font-size: 4em;
            margin-bottom: .5em;
          }

          li a{
            text-decoration: none;
            color: black;
            font-size: 20px;
          }
                    
          .movie_image{
          display:inline-block;
          text-align:center;
          padding-left:40px;
          padding-right:40px;
            }

          img {
            box-shadow: 0 19px 38px rgba(0, 0, 0, 0.3), 0 15px 12px rgba(0, 0, 0, 0.2);
          }

          ul{
            list-style:none;
            padding-inline-start: 0px !important;
          }

          * { -webkit-box-sizing: border-box; -moz-box-sizing: border-box; box-sizing: border-box; }
          *:before, *:after { -webkit-box-sizing: border-box; -moz-box-sizing: border-box; box-sizing: border-box; }

          /* Search styles */

          #s { background: rgba(0,0,0,.375) url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAAUCAYAAABvVQZ0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAQBJREFUeNqslI0RgyAMhdENWIEVWMEVXIGO0BW6Ah2hHcGOoCPYEewINFzBe9IA9id37w4kfEZesHHOCSYUqSPJML+RJlELDwN1pMHxMZNMkr8RTgyz2YPH5LmtwXpIHkOFmKhIlxowDmYAycKnHAHYcTCsSpXOJCie6YWDnXKLGeHLN2stGaqDsXXrX3GFcYcLrfhjtKEhffQ792gYT2nT6pJDjCw4z7ZGdGipOIqNbXIwFUARmCbKpMfYxsWJBmCEDoW7+gYUTAU2s3HJrK3AJvMLkqGHFLgWXTckm+SfSQexs+tLRqwVfgvjgMsvMAT689S5M/sk/I14kO5PAQYAuk6L1q+EdHMAAAAASUVORK5CYII=) no-repeat 14px 14px;
            text-indent: 1em; display: inline-block; border: 0 none; width: 0; height: 3em; border-radius: 3em; -webkit-transition: .3s; transition: .3s; outline: none; padding: 1em 1.5em; cursor: pointer; -webkit-appearance: none; font-weight: inherit; font-size: inherit; font-family: inherit; color: #999; vertical-align: baseline; }
          input[type=search]::-webkit-search-cancel-button { -webkit-appearance: none; }

          #s:hover, #s:focus { background: #fff url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAAUCAYAAABvVQZ0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAT5JREFUeNqsVLtOw0AQtIMlRJHCEhUVMg398QEUSZnSfILzCXxDPsFu6XAJHWnTcS1lWsprKdmLxtKwvjVBYaTV7cm+udnX5fPb+yyBSmwhVmK/FfPZLyjUPhI8YtXYi23EOovs7PzyevAbsWeoGg5HNUHsCipX8F9TZDOstVgLPxIsxW6w3sHv6dJ2StkLbh6IPtR/AWRfSIET20H9D2U1hfaAgxY2KMagcBSmg9/rmwx0lBqTzGfHoVfVHxXgXzCjHNRHnnHke4vMGc2q0RBR0GSeCLlpLaJGFWKUszVuib32nih7iTFrjXAPyGnQ48c3Gu5AOVlMtMk6NZuf+FiC+AIhV0T+pBQ5ntXceIJKqKko2duJ2TwoLAz5QTVnagJaXWEO8y/wSMuKH9RTJoCTHyNZFidOUEfNu/8WYAAOXUT04MOtlwAAAABJRU5ErkJggg==) 14px 14px no-repeat; }

          #s:focus { width: 50%; cursor: text; }

          .container, .container-fluid{
            max-width: 1200px !important;
            padding: 10px !important;
          }

          ${state}{
            color: rgb(95, 95, 95);
            text-decoration: none;
            background: #e7e5e4;
            border-radius: 30px 30px 0px 0px;
          }

          .my_if{
            padding: 30px;
            margin: 10px;
            font-size: 25px;
            background-color: black;
            color: white;
            width: 220px;
          }

        </style>

        <script language = "javascript">
          function ShowSliderValue(sVal)
          {
            var obValueView = document.getElementById("slider_value_view");
            obValueView.innerHTML = sVal
          }
        </script>
    </head>
    <body bgcolor='yellow'>
   
    <!-- 타이틀 -->
    <div class="jumbotron text-center">

        <div class="jumbotron-image">
            <br>
            <!-- 최상단 메뉴 -->
            <div id="top_menu" class="container-fluid text-right">
                ${userStatus}
            </div>
            <!-- end 최상단 메뉴 -->

            <!-- 메인 타이틀 -->
            <h1 class='retroshadow'><a href="/" target="_self">MY MOVIE STORAGE</a></h1>
            <h3>Store &amp; Share Your Movie Reviews</h3><br>
            <!-- end 메인 타이틀-->
            <br>
        </div>

        <!-- 메인 메뉴 -->
        <div class="wrapper">

        <ul class="tabs clearfix" data-tabgroup="first-tab-group">
          <li><a href="/" target="_self" id="menu_main">Main</a></li>
          <li><a href="/search" target="_self" id="menu_search">Search</a></li>
          <li><a href="/movie" target="_self" id="menu_genre">Movie by Genre</a></li>
          <li><a href="/create_record" target="_self" id="menu_review">Leave Review</a></li>
          <li><a href="/my_record" target="_self" id="menu_my">My Leave</a></li>
        </ul>
        
        </div>
        <!-- end 메인 메뉴-->

      </div>
      <!-- end 타이틀 -->

      <div class="container-fluid">
        <div class="container text-center">
          ${body}

          ${control}

          ${list}
        </div>
      </div>

      <footer class="text-center">
        <div id="footer_content">
          <!-- footer 메뉴 -->
          <div id="footer_menu" class="text-left">
            <p><strong>All Menu</strong></p>
            <a href="/search" target="_self">
                <span>검색</span>
            </a>
            <a href="/movie" target="_self">
                <span>장르별 모아보기</span>
            </a>
            <a href="/create_record" target="_self">
                <span>감상평 남기기</span>
            </a>
            <a href="/my_record" target="_self">
                <span>나의 감상평</span>
            </a>
          </div>
          <!-- end footer 메뉴-->

          <div id="footer_info" class="text-left">
            <p>DataBaseSystem Project</p>
            <p>Team Name : 벤토리</p>
            <p>
            Team Member : <br>
            소프트웨어학과 2014041012 오병현<br>
            소프트웨어학과 2018038021 윤상은<br>
            소프트웨어학과 2018038023 권주현
            </p>
          </div>
        </div>

        <br>
        <p>Copyright 2020. 벤토리 all rights reserved.</p>
      </footer>
    </body>
    </html>
    `;
  },
  
  movie_list:function(movies){
    var list = '<ul class="container-fluid text-center">';
    var i = 0;

    while(i < movies.length){
      list = list + `
                    <div class="movie_image">
                        <li class="text-center" style="display: inline-block; width: 211px; height: 370px;">
                        <a href="/movie?id=${movies[i].M_ID}" style="block: inline;">${sanitizeHtml(movies[i].M_Name)}
                        <img src=${movies[i].M_Poster} height=300 style="display: block;" />
                       </a>
                       </li>
                    </div>
                    `;
      i = i + 1;
    }
    list = list+'</ul>';
    return list;
  },

  genre_list:function(genres, cate = ''){
    var list = '<ul>';
    var i = 0;

    if(cate == ''){
      list = list + '<li style="display: inline-block; width: 90px;"><a href="/movie" target="_self"><strong>전체</strong></a></li>'
    }
    else{
      list = list + '<li style="display: inline-block; width: 90px;"><a href="/movie" target="_self">전체</a></li>'
    }

    while(i < genres.length){
      if(cate == genres[i].G_ID){
        list = list + `
                      <li style="display: inline-block; width: 90px;">
                        <a href="/movie?category=${genres[i].G_ID}"><strong>${sanitizeHtml(genres[i].G_Category)}</strong></a>
                      </li>
                      `;
      }
      else{
        list = list + `
                      <li style="display: inline-block; width: 90px;">
                        <a href="/movie?category=${genres[i].G_ID}">${sanitizeHtml(genres[i].G_Category)}</a>
                      </li>
                      `;
      }
      i = i + 1;
    }
    list = list+'</ul><br><br>';
    return list;
  },

  record_list:function(records){
    var list = '<ul>';
    var i = 0;

    while(i < records.length){
      list = list + `<li><a href="/record?uid=${records[i].U_ID}&mid=${records[i].M_ID}">${sanitizeHtml(records[i].M_Name)}</a></li>`;
      i = i + 1;
    }
    list = list+'</ul>';
    return list;
  },

  my_record_list:function(records){
    var list = `<h2>나의 감상평</h2>
                <ul>`;
    var i = 0;

    while(i < records.length){
      list = list + `
                    <div class="movie_image">
                      <li class="text-center" style="display: inline-block; width: 211px; height: 370px;">
                        <a href="/record?uid=${records[i].U_ID}&mid=${records[i].M_ID}">${sanitizeHtml(records[i].M_Name)}
                        <img src=${records[i].M_Poster} height=300 style="display: block;" />
                       </a>
                       </li>
                    </div>
                    `;
      i = i + 1;
    }
    list = list+'</ul>';
    return list;
  },

  one_eval_list:function(records){
    var list = `<table border="1" class="container text-center" style="background-color: black; color: white; width: 600px;">
                  <th>한줄평</th>
                  <th>평점</th>
                  <th>작성자</th>`;
    var i = 0;

    while(i < records.length){
      list = list + `<tr>
                      <td>${sanitizeHtml(records[i].R_One_Eval)}</td>
                      <td>${records[i].R_Grade.toFixed(1)}</td>
                      <td>${records[i].U_ID}</td>
                    </tr>`;
      i = i + 1;
    }
    list = list+'</table>';
    return list;
  },

  movie_detail:function(movie){
    var body = '';

    body = body + `
                  <div class="container">
                    <h2>${movie[0].M_Name}</h2>
                    <div style="display: inline-block;">
                      <img src=${movie[0].M_Poster} height=500/>
                    </div>
                    <div style="display: inline-block;">
                      <p>감독 : ${movie[0].M_Director}</p>
                      <p>개봉년도 : ${movie[0].M_RelYear}</p>
                      <p>관람등급 : ${movie[0].M_Rank}</p>
                      <p>상영시간 : ${movie[0].M_RunningTime}</p>
                      <p>평점 : ${movie[0].M_AvgGrade.toFixed(2)}</p>
                    </div>
                  </div>
                  `;

    return body;
  },

  record_detail:function(record){
    var body = '';
    var date = record[0].R_Date.toFormat("YYYY년 MM월 DD일")

    body = body + `
                  <h2>${record[0].M_Name}</h2>
                  <img src=${record[0].M_Poster} height=500/>
                  <p>작성일 : ${date}</p>
                  <p>평점 : ${record[0].R_Grade}</p>
                  <p>한줄평 : ${record[0].R_One_Eval}</p>
                  <p>감상문 : ${record[0].R_Eval}</p>
                  `;

    return body;
  },

  movie_select_list:function(movies){
    var list = '';
    var i = 0;

    while(i < movies.length){
      list = list + `<option value="${movies[i].M_ID}">${movies[i].M_Name}-${movies[i].M_Director}</option>`;
      i = i + 1;
    }

    return list;
  },

  genre_select_list:function(genres){
    var list = '<input type="hidden" name="genre" value="temp" checked>';
    var i = 0;

    while(i < genres.length){
      list = list + `<label><input type="checkbox" name="genre" value="${genres[i].G_ID}">${genres[i].G_Category}</label>`;
      i = i + 1;
    }

    return list;
  },

  interest_list:function(genres, interest){
    var list = '<input type="hidden" name="genre" value="temp" checked>';
    var i = 0;
    var j = 0;

    while(i < genres.length){
      if(j < interest.length){
        if(interest[j].G_ID == genres[i].G_ID){
          list = list + `<label><input type="checkbox" name="genre" value="${genres[i].G_ID}" checked>${genres[i].G_Category}</label>`;
          j = j + 1;
        }
        else{
          list = list + `<label><input type="checkbox" name="genre" value="${genres[i].G_ID}">${genres[i].G_Category}</label>`;
        }
        i = i + 1;
      }
      else{
        list = list + `<label><input type="checkbox" name="genre" value="${genres[i].G_ID}">${genres[i].G_Category}</label>`;
        i = i + 1;
      }
      
    }

    return list;
  }
}
