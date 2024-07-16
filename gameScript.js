var imgs = ["Image1.jpeg", "Image2.jpg", "Image3.jpg", "Image4.jpg", "Image5.jpeg", "Image6.png",]
var narrations = ["narration01", "narration02", "narration03", "narration04", "narration05", "narration06"]
//Shuffling above array
var tmp, tmpAudio, c, p = imgs.length;
if (p) while (--p) {
  c = Math.floor(Math.random() * (p + 1));
  tmp = imgs[c];
  tmpAudio = narrations[c];
  imgs[c] = imgs[p];
  narrations[c] = narrations[p];
  imgs[p] = tmp;
  narrations[p] = tmpAudio;
}

//Variables
var pre = "", pID, ppID = 0, turn = 0, t = "transform", flip = "rotateY(180deg)", flipBack = "rotateY(0deg)", time, mode;

//Resizing Screen
window.onresize = init;
function init() {
  W = innerWidth;
  H = innerHeight;
  $('body').height(H + "px");
  $('#ol').height(H + "px");
}

//Showing instructions
window.onload = function () {
  document.getElementById("pianobg").volume = 0.1;
  $("#ol").html(`<center>
    <div id="inst"><h3>Welcome !</h3>Instructions For Game
    <br/>
    <br/>
    <li>Make pairs of similiar blocks by flipping them, face up.</li>
    <li>To flip a block, click or tap on it.</li>
    <li>If they don't match, both blocks will flip back, face down.</li>
    <p style="font-size:18px;">Click one of the following modes to start a game.</p>
    </div>
    <button onclick="start(3, 4)">Easy<br/>(3 x 4)</button>
    <!--button onclick="start(4, 4)" style="w">4 x 4</button-->
    <button onclick="start(4, 5)">Medium<br/>(4 x 5)</button>
    <!--button onclick="start(5, 6)">5 x 6</button-->
    <button onclick="start(6, 6)">Hard<br/>(6 x 6)</button></center>`);
}

//Starting the game
function start(r, l) {
  document.getElementById("pianobg").play();


  //Timer and moves
  min = 0, sec = 0, moves = 0;
  $("#time").html("Time: 00:00");
  $("#moves").html("Moves: 0");
  time = setInterval(function () {
    sec++;
    if (sec == 60) {
      min++; sec = 0;
    }
    if (sec < 10)
      $("#time").html("Time: 0" + min + ":0" + sec);
    else
      $("#time").html("Time: 0" + min + ":" + sec);
  }, 1000);
  rem = r * l / 2, noItems = rem;
  mode = r + "x" + l;

  //Generating item array and shuffling it
  var items = [];
  var itemsAudio = [];
  for (var i = 0; i < noItems; i++) {
    items.push(imgs[i]);
    itemsAudio.push(narrations[i]);
  }
  for (var i = 0; i < noItems; i++) {
    items.push(imgs[i]);
    itemsAudio.push(narrations[i]);
  }
  var tmp, tmpAudio, c, p = items.length;
  if (p) while (--p) {
    c = Math.floor(Math.random() * (p + 1));
    tmp = items[c];
    tmpAudio = itemsAudio[c];
    items[c] = items[p];
    itemsAudio[c] = itemsAudio[p];
    items[p] = tmp;
    itemsAudio[p] = tmpAudio;
  }

  //Creating table
  $("table").html("");
  var n = 1;
  for (var i = 1; i <= r; i++) {
    $("table").append("<tr>");
    for (var j = 1; j <= l; j++) {
      $("table").append(`<td id='${n}' onclick="change(${n})"><div class='inner'><div class='front'></div><div class='back'>
    <img src="./Images/Tile Img/${items[n - 1]}" id="${items[n - 1]}" style="width:100%;height:100%"/>
    <audio id="${itemsAudio[n - 1]}">
        <source src="./Sounds/Narrations/${itemsAudio[n - 1]}.mp3" type="audio/mp3">
    </audio>
    </div></div></td>`);
      n++;
    }
    $("table").append("</tr>");
  }

  //Hiding instructions screen
  $("#ol").fadeOut(500);
}

//Function for flipping blocks
function change(x) {
  //Variables
  let i = "#" + x + " .inner";
  let f = "#" + x + " .inner .front";
  let b = "#" + x + " .inner .back img";
  let sfx = "#" + x + " .inner .back audio";

  //Dont flip for these conditions
  if (turn == 2 || $(i).attr("flip") == "block" || ppID == x) { }

  //Flip
  else {
    $(i).css(t, flip);
    if (turn == 1) {
      //This value will prevent spam clicking
      turn = 2;

      //If both flipped blocks are not same
      if (pre != $(b).attr("id")) {
        setTimeout(function () {
          $(pID).css(t, flipBack);
          $(i).css(t, flipBack);
          ppID = 0;
        }, 1000);
        document.getElementById("wrongsfx").play();
      }

      //If blocks flipped are same
      else {
        rem--;
        $(i).attr("flip", "block");
        $(pID).attr("flip", "block");
        document.getElementById("matchsfx").play();
        document.getElementById($(sfx).attr("id")).play();
      }

      setTimeout(function () {
        turn = 0;
        //Increase moves
        moves++;
        $("#moves").html("Moves: " + moves);
      }, 1150);

    }
    else {
      pre = $(b).attr("id");
      ppID = x;
      pID = "#" + x + " .inner";
      turn = 1;
    }

    //If all pairs are matched
    if (rem == 0) {
      clearInterval(time);
      if (min == 0) {
        time = `${sec} seconds`;
      }
      else {
        time = `${min} minute(s) and ${sec} second(s)`;
      }
      setTimeout(function () {
        $("#ol").html(`<center><div id="iol"><h2>Great job!</h2>
                <p style="font-size:23px;padding:10px;">You completed the ${mode} mode in ${moves} moves. It took you ${time}.</p>
                <p style="font-size:18px">Let's keep your memory sharp.<br/>Play Again ?</p>
                <button onclick="start(3, 4)">Easy<br/>(3 x 4)</button>
                <!--button onclick="start(4, 4)" style="w">4 x 4</button-->
                <button onclick="start(4, 5)">Medium<br/>(4 x 5)</button>
                <!--button onclick="start(5, 6)">5 x 6</button-->
                <button onclick="start(6, 6)">Hard<br/>(6 x 6)</button>
                </div></center>`);
        $("#ol").fadeIn(750);
      }, 1500);
    }
  }
}
