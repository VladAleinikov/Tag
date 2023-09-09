
$('body').prepend(`
      <div class="head">
            <div class="time">Time <span id='minutes'></span><span id='seconds'></span></div>
            
            <div class="pause"><p id='pause'><i class="fas fa-pause"></i><i class="fas fa-play"></i></p></div>
            <div class="moves">Moves <span id='moves'>0</span></div>
      </div>
      <div class="container">
            <div class="tags">
            </div>
            <div class="error">This plate can not be moved</div>
            <div class="overlay">
                  <ul id='menu'>
                        <li><div id='new--game'>New Game</div></li>
                        <li><div id='save--game'>Save Game</div></li>
                        <li><div id='load--game'>Load Game</div></li>
                        <li><div id='scores'>Best Scores</div></li>
                        <li><div id='rules'>Rules</div></li>
                        <li><div id='settings'>Settings</div></li>
                  </ul>

                  <div class='load'>
                        <h2>Choose game</h2>
                        <div class="game--info">
                        
                        </div>
                        <div class='arrows'><i class="fas fa-arrow-circle-left" id='left'></i><i class="fas fa-arrow-circle-right" id='right'></i></div>
                        <div class='load--btn' id='load'>Load</div>
                        <div class='back--btn' id='back--from--load'><i class="fas fa-chevron-circle-left"></i></div>
                  </div>
                  <div class='scores'>
                        <h2>Best scores</h2>
                        <div class='scores--container'>
                              
                        </div>
                        <div class='back--btn' id='back--from--scores'><i class="fas fa-chevron-circle-left"></i></div>
                  </div>
                  <div class='rules'>The object of the puzzle is to place the tiles in order by making sliding moves that use the empty space.
                        You can save your game and load it later. Or you can just use pause button. Also you can choose game field size of color in Settings
                        <div class='back--btn' id='back--from--rules'><i class="fas fa-chevron-circle-left"></i></div>
                  </div>
                  <div class='settings'>
                        <h2>SETTINGS</h2>
                        <div>File size</div>
                        <div class='sizes'>
                              <div class='whith--focused' id='3x3'>3X3</div>
                              <div class='focused' id='4x4'>4X4</div>
                              <div class='whith--focused' id='5x5'>5X5</div>
                              <div id='6x6'>6X6</div>
                              <div id='7x7'>7X7</div>
                              <div id='8x8'>8X8</div>
                        </div>
                        <div><input type='checkbox' id='picture' ><label for='picture'>Pictiures</label></div>
                        <div id='save--settings'>SAVE</div>
                        <div class='back--btn' id='back--from--settings'><i class="fas fa-chevron-circle-left"></i></div>
                  </div>
                  <div id='auto-play'>auto<br>play</div>
                  <div id='volume'><i class="fas fa-volume-up"></i><i class="fas fa-volume-mute"></i></div>
            </div>
      </div>
`);




//Переменная для обозначения координаты квадратика: значение - позиция на поле; индекс - номер квадрата
var tags = [];

var moves;
var position;
let pictures = false;
let focusedGame = 0;
var S = '00',
      M = '00',
      H = '00';
const mins = $('#minutes');
const secs = $('#seconds');
var time = true;
volume = true;
let audio = new Audio();
var plateLen = 0;


SetLoadedGames();  //записывает все сохраненные игры, доступные для загрузки
function SetLoadedGames() {
      $(".game--info").children().remove();

      if (!localStorage.getItem('bestScores'))
            localStorage.setItem('bestScores', JSON.stringify([]));
      for (let i = 0; i < localStorage.length - 1; i++) {
            let game = JSON.parse(localStorage.getItem('savedGame' + i));

            $(".game--info").append(`
            <div id='savedGame`+ i + `' class='load--container ` + focused(i) + `'>
                  <div>Board size: `+ Math.sqrt(game.size) + `x` + Math.sqrt(game.size) + `</div>
                  <div>Time: `+ game.hour + `:` + game.min + `:` + game.sec + `</div>
                  <div>Moves: `+ game.moves + `</div>
            </div>
      `)
      }
}
function focused(i) { if (i == 0) return ("focused--load"); return ''; }

SetBestScores(); // записывает все лучшие игры
function SetBestScores() {
      $(".scores--container").children().remove();
      $(".scores--container").append(`<section><div class='date'>Date</div><div class='moves--score'>Moves</div><div classs='size'>Size</div><div class='time--score'>Time</div></section>`);
      let scores = JSON.parse(localStorage.getItem("bestScores"));

      for (let i = 0; i < scores.length; i++){
            $(".scores--container").append(`<section><div class='date'>` + scores[i].date + `</div><div class='moves--score'>` + scores[i].moves + `</div><div classs='size'>` + Math.sqrt(scores[i].size) + `x` + Math.sqrt(scores[i].size) + `</div><div class='time--score'>` + scores[i].time +`</div></section>`)
      }
}


NewField(16);// создает игровое поле 4х4

function NewField(len) { 
      $(".tags").children().remove();  //удаляет все "пятнашки"
      for (let i = 0; i < len; i++){
            let div = document.createElement('div');
            //$(div).attr("class", "draggable").draggable();
            div.id = i+1;
            div.innerHTML = i+1;
            $(".tags").get(0).append(div);
            if(pictures && len == 16)
                  $(".tags>#"+i).append(`<img src='img/` + (i) + `.png'>`);
      }
      moves = 0;
      S = '00',
            M = '00',
            H = '00';
      $(".tags").removeClass("size3x3 size4x4 size5x5 size6x6 size7x7 size8x8")  

      // создает массив позиций на которых будут располшожены "пятнашки"
      if (len == 9) {
             position = [[0, 0], [133, 0], [266, 0],
                  [0, 133], [133, 133], [266, 133],
                   [0, 266], [133, 266], [266, 266]];
            plateLen = 133;
            
            $(".tags").addClass("size3x3");
      }
      else if (len == 16) {
             position = [[0, 0], [100, 0], [200, 0], [300, 0],
                  [0, 100], [100, 100], [200, 100], [300, 100],
                  [0, 200], [100, 200], [200, 200], [300, 200],
                   [0, 300], [100, 300], [200, 300], [300, 300]];
            plateLen = 100;
            $(".tags").addClass("size4x4");
      }
      else if (len == 25) {
             position = [[0, 0], [80, 0], [160, 0], [240, 0], [320, 0],
                  [0, 80], [80, 80], [160, 80], [240, 80], [320, 80],
                  [0, 160], [80, 160], [160, 160], [240, 160], [320, 160],
                  [0, 240], [80, 240], [160, 240], [240, 240], [320, 240],
                   [0, 320], [80, 320], [160, 320], [240, 320], [320, 320]];
            plateLen = 80;
            $(".tags").addClass("size5x5");
      }
      else if (len == 36) {
             position = [[0, 0], [66, 0], [132, 0], [198, 0], [264, 0], [330, 0],
                  [0, 66], [66, 66], [132, 66], [198, 66], [264, 66], [330, 66],
                  [0, 132], [66, 132], [132, 132], [198, 132], [264, 132], [330, 132],
                  [0, 198], [66, 198], [132, 198], [198, 198], [264, 198], [330, 198],
                  [0, 264], [66, 264], [132, 264], [198, 264], [264, 264], [330, 264],
                   [0, 330], [66, 330], [132, 330], [198, 330], [264, 330], [330, 330]];
            plateLen = 66;
            $(".tags").addClass("size6x6");
      }
      else if (len == 49) {
             position = [[0, 0], [57, 0], [114, 0], [171, 0], [228, 0], [285, 0], [342, 0],
                  [0, 57], [57, 57], [114, 57], [171, 57], [228, 57], [285, 57], [342, 57],
                  [0, 114], [57, 114], [114, 114], [171, 114], [228, 114], [285, 114], [342, 114],
                  [0, 171], [57, 171], [114, 171], [171, 171], [228, 171], [285, 171], [342, 171],
                  [0, 228], [57, 228], [114, 228], [171, 228], [228, 228], [285, 228], [342, 228],
                  [0, 285], [57, 285], [114, 285], [171, 285], [228, 285], [285, 285], [342, 285],
                   [0, 342], [57, 342], [114, 342], [171, 342], [228, 342], [285, 342], [342, 342]];
            plateLen = 57;
            $(".tags").addClass("size7x7");
      }
      else if (len == 64) {
             position = [[0, 0], [50, 0], [100, 0], [150, 0], [200, 0], [250, 0], [300, 0], [350, 0],
                  [0, 50], [50, 50], [100, 50], [150, 50], [200, 50], [250, 50], [300, 50], [350, 50],
                  [0, 100], [50, 100], [100, 100], [150, 100], [200, 100], [250, 100], [300, 100], [350, 100],
                  [0, 150], [50, 150], [100, 150], [150, 150], [200, 150], [250, 150], [300, 150], [350, 150],
                  [0, 200], [50, 200], [100, 200], [150, 200], [200, 200], [250, 200], [300, 200], [350, 200],
                  [0, 250], [50, 250], [100, 250], [150, 250], [200, 250], [250, 250], [300, 250], [350, 250],
                  [0, 300], [50, 300], [100, 300], [150, 300], [200, 300], [250, 300], [300, 300], [350, 300],
                   [0, 350], [50, 350], [100, 350], [150, 350], [200, 350], [250, 350], [300, 350], [350, 350]];
            plateLen = 50;
            $(".tags").addClass("size8x8");
      }
      
      RandomArray(len); // рандомное заполение игрового поля пятнашками



      //проверка, будет ли иметь решени данное сгенерированое поле
      let n = 0;
      for (let i = 0; i < tags.length; i++)
            n += n_i(i);
      n += Math.ceil(tags[tags.length - 1] / tags.length);

      if (!(n % 2 == 0))
            NewField(len);
            
}
function n_i(n) {
      let j = 0;
      for (let i = 0; i < tags.length; i++)
            if (i < n && tags[i] > tags[n])
                  j++
      
      return j;
                  
}




function RandomArray(len) {
      tags = [];
      S = '00';
      M = '00';
      H = '00';
      moves = 0;
      $(secs).text(S);
      $(mins).text(`${M} :`);
      $($("#moves")).text(moves);
      let mass = [];
      for (let i = 0; i < len; i++) { mass.push(i); }
      while (mass.length) {
            let pos = Math.random() * mass.length;
            let element = mass.splice(pos, 1)[0];
            tags.push(element);

      }
      for (let i = 0; i < len; i++){
            SetPosition($(".tags").get(0).children[i], position[tags[i]][0], position[tags[i]][1]);
      }
}

// ставит "пятнашки " на заданные позиции
function SetPosition(element, x, y) {
      element.style.top = y + "px";
      element.style.left = x + "px";
}



// функция при клике на "пятнашки"
$(".tags").on("click", "div", function () { 
      //проверка можно ли переставлять нажатую пятнашку
      if ((this.style.top == (position[tags[tags.length - 1]][1] + plateLen) + "px" && this.style.left == position[tags[tags.length - 1]][0] + "px") ||
            (this.style.top == (position[tags[tags.length - 1]][1] - plateLen) + "px" && this.style.left == position[tags[tags.length - 1]][0] + "px") ||
            (this.style.top == (position[tags[tags.length - 1]][1]) + "px" && this.style.left == position[tags[tags.length - 1]][0] + plateLen + "px") ||
            (this.style.top == (position[tags[tags.length - 1]][1]) + "px" && this.style.left == position[tags[tags.length - 1]][0] - plateLen + "px")) {
            // меняет нажатую "пятнашку" с пустым полем
            Swap(this, $(".tags").get(0).children[tags.length - 1])
            moves++;
            $($("#moves")).text(moves);
            if(volume)
                  sound("sounds/playtes.mp3") // звук передвижения пятнашек
            checkGame(); // проверка, закончена ли игра(стоят ли все пятнашки на своих местах)
      }
      else { // если "пятнашку" нельзя передвигать 
            $(".error").get(0).style.bottom = -50 + "px"; // вывод поля с ошибкой
            setTimeout(() => { $(".error").get(0).style.bottom = 0 + "px"; }, 4000);
      }
      

      
}) 


// функция, перетаскивания пятнашек
var draggable = false;
$(".tags>div").draggable({
      start: function () {
            if ((this.style.top == (position[tags[tags.length - 1]][1] + plateLen) + "px" && this.style.left == position[tags[tags.length - 1]][0] + "px") ||
                  (this.style.top == (position[tags[tags.length - 1]][1] - plateLen) + "px" && this.style.left == position[tags[tags.length - 1]][0] + "px") ||
                  (this.style.top == (position[tags[tags.length - 1]][1]) + "px" && this.style.left == position[tags[tags.length - 1]][0] + plateLen + "px") ||
                  (this.style.top == (position[tags[tags.length - 1]][1]) + "px" && this.style.left == position[tags[tags.length - 1]][0] - plateLen + "px")) {
                  
                   draggable = true;
                  $(this).css("zIndex", 10);
            }
            else
                  draggable = false;
      },
      stop: function () {
            console.log("aaaa");
            if ((this.style.left > position[tags[tags.length - 1]][0] - 100 + "px") && (this.style.left < position[tags[tags.length - 1]][0] + 100 + plateLen + "px") && (this.style.top > position[tags[15]][1] - 100 + "px") && (this.style.top < position[tags[15]][1] + 100 + plateLen + "px") && draggable ) {
                  Swap(this, $(".tags").get(0).children[tags.length - 1])
                  moves++;
                  $($("#moves")).text(moves);
                  if (volume)
                        sound("sounds/playtes.mp3")
                  checkGame();
            }
            else {
                  SetPosition(this, position[tags[$(this).attr('id') - 1]][0], position[tags[$(this).attr('id') - 1]][1]);
                  
            }
            $(this).css("zIndex", 1)
      }
      
});



function checkGame() {
      let n = true;
      for (let i = 0; i < tags.length; i++) {
            if (i != tags[i]) {
                  n = false;
                  break;
            }

      }

      if (n) {
            if(volume)
                  sound("sounds/tuturu.mp3")
            time = false;
            setTimeout(() => { alert(`Ты победил! Твое время прохождения-${M}:${S}. Ты сделал-${moves} ходов`); }, 500);
            

            checkBest(); // проверка, можно ли записать данную игру в список лучших
            
      }
}

function checkBest() {
      let scores = JSON.parse(localStorage.getItem('bestScores')); // массив лучших игр
      let max = -1;
      for (let i = 0; i < scores.length; i++) 
            if (scores[i].moves > max)
                  max = scores[i].moves;
            
      if (moves < max || max == -1 || scores.length < 9) {
            let date = new Date();
            if(scores.length < 9)
                  scores[scores.length] = {
                        "date": date.getDate() + '.' + date.getMonth() + '.' + date.getFullYear(),
                        "moves": moves,
                        "size": tags.length,
                        "time": H + ':' + M + ':' + S
                  }
            else
                  scores[scores.length - 1] = {
                        "date": date.getDate() + '.' + date.getMonth() + '.' + date.getFullYear(),
                        "moves": moves,
                        "size": tags.length,
                        "time": H + ':' + M + ':' + S
                  }
            
            for (let i = 0; i < scores.length; i++){  //сортировка лучших результатов
                  for (let j = i+1; j < scores.length; j++){
                        if (scores[i].moves > scores[j].moves) {
                              let score = scores[i];
                              scores[i] = scores[j];
                              scores[j] = score;
                        }
                  }
            }
            localStorage.setItem("bestScores", JSON.stringify(scores)); 
            SetBestScores() // запись лучших результатов
      }
}

audio.volume = 1;
function sound(url) {  // метод воспроизводящий звуки
      audio = new Audio(); // Создаём новый элемент Audio 
      audio.src = url; // 
      
      audio.autoplay = true; // Автоматически запускаем 
      audio.volume = 0.5;
}

function Swap(el1, el2) { // метод, который меняет местами 2 "пятнашки"
      let x = position[tags[$(el1).attr("id") - 1]][0];
      let y = position[tags[$(el1).attr("id") - 1]][1];
      let tag = tags[$(el1).attr("id") - 1];
      el1.style.left = el2.style.left;
      el1.style.top = el2.style.top;

      tags[$(el1).attr("id") - 1] = tags[tags.length-1];
      tags[tags.length-1] = tag;
      el2.style.left = x + "px";
      el2.style.top = y + "px";
}

//таймер
setInterval(function () {
      if (time) {
            S = +S + 1;
            if (S < 10) { S = '0' + S; }
            if (S == 60) {
                  S = '00';
                  M = +M + 1;
                  if (M < 10) { M = '0' + M; }
                  if (M == 60) {
                        M = '00';
                        H = +H + 1;
                        if (H < 10) { H = '0' + H; }
                  }
            }
            $(secs).text(S);
            $(mins).text(`${M} :`);
      }
      
}, 1000);



// кнопка паузы которая открываает меню паузы
$("#pause").on("click", function () { 
      $(".overlay").get(0).classList.toggle("active");
      this.classList.toggle("active");
      if (time)
            time = false;
      else
            time = true;
}); 


// кнопка включающая-выключающая звук
$("#volume").on("click", function () { 
      this.classList.toggle("active");
      if (volume)
            volume = false;
      else
            volume = true;
});

// кнопка авто-игры
$("#auto-play").on("click", function () { 
      $(".overlay").get(0).classList.toggle("active");
      $("#pause").get(0).classList.toggle("active");
      time = true;

      setTimeout( () => {
            for (let i = 0; i < tags.length; i++) {
                  tags[i] = i;
                  SetPosition($(".tags").get(0).children[i], position[i][0], position[i][1]);
                  
                  

            }
            setTimeout(() => {
                  checkGame();
            }, 500);
      }, 500);
});

// кномпка генерации новой игры
$("#new--game").on("click", () => {
      $(".overlay").get(0).classList.toggle("active");
      $("#pause").get(0).classList.toggle("active");
      time = true;
      setTimeout(() => {
            NewField(tags.length);
      }, 500);
      
})


// сохраняет игру в локальное хранилище
$("#save--game").on("click", function () {
      
      let savedGame = {
            'tags': tags,
            'moves': moves,
            'size': tags.length,
            'sec': S,
            'min': M,
            'hour': H
      };
      localStorage.setItem('savedGame' + (localStorage.length-1), JSON.stringify(savedGame));
      SetLoadedGames();
      
            

})


// создает поле с выбранной сохраненной игрой
$("#load").on("click", () => {
      let game = JSON.parse(localStorage.getItem($($(".focused--load").get(0)).attr("id")));
      NewField(game.size);
      tags = game.tags;

      for (let i = 0; i < tags.length; i++) {

            SetPosition($(".tags").get(0).children[i], position[tags[i]][0], position[tags[i]][1]);
      }

      moves = game.moves;
      S = game.sec;
      M = game.min;
      H = game.hour;


})


$("#left").on("click", () => {

      if (focusedGame > 0) {
            $("#savedGame" + focusedGame).removeClass("focused--load");
            focusedGame--;
            $("#savedGame" + focusedGame).addClass("focused--load");

      }
})
$("#right").on("click", () => {
      if (focusedGame < localStorage.length - 2) {
            $("#savedGame" + focusedGame).removeClass("focused--load");
            focusedGame++;
            $("#savedGame" + focusedGame).addClass("focused--load");

      }
})


// открывает окно с сохраненными играми
$("#load--game").on("click", () => {
      $(".overlay").get(0).classList.toggle("load--active");

})
//возвращает в мею паузы
$("#back--from--load").on("click", () => {
      $(".overlay").get(0).classList.toggle("load--active");
})
// открывает окно с лучшими результатами
$("#scores").on("click", () => {
      $(".overlay").get(0).classList.toggle("scores--active");

})
//возвращает в мею паузы
$("#back--from--scores").on("click", () => {
      $(".overlay").get(0).classList.toggle("scores--active");
})

// открывает окно с правилами
$("#rules").on("click", () => {
      $(".overlay").get(0).classList.toggle("rules--active");

})
//возвращает в мею паузы
$("#back--from--rules").on("click", () => {
      $(".overlay").get(0).classList.toggle("rules--active");
})

// открывает меню настроек
$("#settings").on("click", () => {
      $(".overlay").get(0).classList.toggle("settings--active");

})
//возвращает в мею паузы
$("#back--from--settings").on("click", () => {
      $(".overlay").get(0).classList.toggle("settings--active");
})

// сохраняет выбранные пользователем настройки и создает новое игровое поле
$("#save--settings").on("click", () => {
      if ($("#picture").prop('checked'))
            pictures = true;
      else
            pictures = false

      if ($($(".focused").get(0)).attr("id") == "3x3")
            NewField(9);
      else if ($($(".focused").get(0)).attr("id") == "4x4")
            NewField(16);

      else if ($($(".focused").get(0)).attr("id") == "5x5")
            NewField(25);
      else if ($($(".focused").get(0)).attr("id") == "6x6")
            NewField(36);
      else if ($($(".focused").get(0)).attr("id") == "7x7")
            NewField(49);
      else if ($($(".focused").get(0)).attr("id") == "8x8")
            NewField(64);
})

$($(".sizes").children()).on("click", function () { 
      for (var i = 0; i < $(".sizes").children().length; i++) {
            $(".sizes").children()[i].classList.remove("focused"); 
            $(".sizes").children()[i].classList.remove("whith--focused"); 
      }

      this.classList.add("focused");
      
      if ($(this).attr("id") == "3x3") {
            $("#4x4").addClass("whith--focused");
            $(".sizes").get(0).style.left = 150 + "px";
      }
      else if ($(this).attr("id") == "4x4") {
            
            $("#3x3").addClass("whith--focused");
            $("#5x5").addClass("whith--focused");
            $(".sizes").get(0).style.left = 90 + "px";
      }
      else if ($(this).attr("id") == "5x5") {
            $("#4x4").addClass("whith--focused");
            $("#6x6").addClass("whith--focused");
            $(".sizes").get(0).style.left = 23 + "px";
      }
      else if ($(this).attr("id") == "6x6") {
            $("#5x5").addClass("whith--focused");
            $("#7x7").addClass("whith--focused");
            $(".sizes").get(0).style.left = -37 + "px";
      }
      else if ($(this).attr("id") == "7x7") {
            $("#6x6").addClass("whith--focused");
            $("#8x8").addClass("whith--focused");
            $(".sizes").get(0).style.left = -95 + "px";
      }
      else if ($(this).attr("id") == "8x8") {
            $("#7x7").addClass("whith--focused");
            $(".sizes").get(0).style.left = -151 + "px";
      }
})