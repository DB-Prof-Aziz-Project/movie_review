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
        <link href="https://fonts.googleapis.com/css2?family=Black+Han+Sans&display=swap" rel="stylesheet">
        <!-- 합쳐지고 최소화된 최신 자바스크립트 -->
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
        <script src='https://kit.fontawesome.com/a076d05399.js'></script>
       
        <style>
        @import url(http://fonts.googleapis.com/earlyaccess/jejugothic.css);
        @import url('https://fonts.googleapis.com/css?family=Raleway');
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
          footer .p{
            text-align:center;
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
            
          #cont_title{
            display:inline-block;
          }

          h2{ 
            align:center;
            margin-top:20px;
            font-family: 'Do Hyeon', sans-serif;
            font-size:60px;}
          
          h4{
            align:center;
            font-family: 'Jeju Gothic', serif;
            font-size:18px;
          }

          h6{
            font-family: 'Jeju Gothic', serif;
          }

          h7{
            font-size:20px;
            font-family: 'Do Hyeon', sans-serif;
            font-weight:bolder;
          }

          .my_if img{
            box-shadow:none;
          }

          .my_if h3{
            font-weight: bolder;
            text-size:60px;
            text-shadow: 2px 2px 6px rgba(255, 255, 255, .75);;
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
        
          li a:hover{
            color: rgb(95, 95, 95);
            text-decoration: none;
            font-weight: bold;
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

          li{
            font-family: 'Jeju Gothic', serif;
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
            display: inline-block;
            vertical-align: top;
            background: #ccc;
            text-align: center;
            box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
            padding: 30px;
            width: 230px;
            height: 240px;
            margin: 10px;
            font-family: 'Jeju Gothic', serif;
          }
          p{
            font-family: 'Jeju Gothic', serif;
          }
          
          .control__indicator {
            position: absolute;
            top: 2px;
            left: 0;
            height: 20px;
            width: 20px;
            background: #e6e6e6;
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

          .control--radio .control__indicator {
            border-radius: 50%;
          }

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

          .btn:hover:before {
            right: 0;
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

          #log_a{
            text-decoration: none;
            color: black;
            font-size: 20px;
          }
        
          #log_a:hover{
            color: rgb(95, 95, 95);
            text-decoration: none;
            font-weight: bold;
          }

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

          .discription p{
            font-family: 'Jeju Gothic', serif;
            text-align:left;
            font-size:20px;
          }

          input[type=password] {
            font-family: arial;
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
          <li><a href="/my_record" target="_self" id="menu_my">My Review</a></li>
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
                        <img src=${movies[i].M_Poster} height=300 width=210 style="display: block;" />
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
      list = list + '<li style="display: inline-block; width: 100px;"><a href="/movie#genre_head" target="_self"><strong>전체</strong></a></li>'
    }
    else{
      list = list + '<li style="display: inline-block; width: 100px;"><a href="/movie#genre_head" target="_self">전체</a></li>'
    }

    while(i < genres.length){
      if(cate == genres[i].G_ID){
        list = list + `
                      <li style="display: inline-block; width: 100px;">
                        <a href="/movie?category=${genres[i].G_ID}#genre_head"><strong>${sanitizeHtml(genres[i].G_Category)}</strong></a>
                      </li>
                      `;
      }
      else{
        list = list + `
                      <li style="display: inline-block; width: 100px;">
                        <a href="/movie?category=${genres[i].G_ID}#genre_head">${sanitizeHtml(genres[i].G_Category)}</a>
                      </li>
                      `;
      }
      if(i == 5){
        list = list + '<br><br>';
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
                        <img src=${records[i].M_Poster} height=300 width=210 style="display: block;" />
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
                  <th width=50>평점</th>              
                  <th>한줄평</th>
                  <th width=110>작성자</th>`;
    var i = 0;

    while(i < records.length){
      list = list + `<tr>
                      <td>${records[i].R_Grade.toFixed(1)}</td>
                      <td>${sanitizeHtml(records[i].R_One_Eval)}</td>
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
                  <div class="containe rowr">
                    <h2>${movie[0].M_Name}</h2>
                    <br>
                    <div style="display: inline-block;">
                      <img src=${movie[0].M_Poster} height=400/>
                    </div>
                    <div class="discription" style="display: inline-block; margin-left: 30px;">
                      <p>감독  | ${movie[0].M_Director}</p>
                      <p>개봉년도 | ${movie[0].M_RelYear}</p>
                      <p>관람등급 | ${movie[0].M_Rank}</p>
                      <p>상영시간 | ${movie[0].M_RunningTime}</p>
                      <p>평점 | ${movie[0].M_AvgGrade.toFixed(2)}</p>
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
                  <p><br></p>
                  <div style="font-family: 'Jeju Gothic', serif;">
                    <p>작성일   |  ${date}</p>
                    <p>평점     |  ${record[0].R_Grade}</p>
                    <p>한줄평   |  ${record[0].R_One_Eval}</p>
                    <p>감상문   |  ${record[0].R_Eval}</p>
                  </div>
                  <br>
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
      list = list + `<label class="control control--checkbox"><input type="checkbox" name="genre" value="${genres[i].G_ID}">${genres[i].G_Category}</label>`;
      if(i == 5){
        list = list + '<br>';
      }
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
        if(i == 5){
          list = list + '<br><br>';
        }
        i = i + 1;
      }
      else{
        list = list + `<label><input type="checkbox" name="genre" value="${genres[i].G_ID}">${genres[i].G_Category}</label>`;
        if(i == 5){
          list = list + '<br><br>';
        }
        i = i + 1;
      }
      
    }

    return list;
  }
}
