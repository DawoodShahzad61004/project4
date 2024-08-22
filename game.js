const buttonColors = ["red", "blue", "green", "yellow"];
const gamePattern = [];
const userClickedPattern = [];
let started = false;
let level = 0;
let patternComplete = false;
let shapes = [
  '<polygon class="star" points="21,0,28.053423027509677,11.29179606750063,40.97218684219823,14.510643118126104,32.412678195541844,24.70820393249937,33.34349029814194,37.989356881873896,21,33,8.656509701858067,37.989356881873896,9.587321804458158,24.70820393249937,1.0278131578017735,14.510643118126108,13.94657697249032,11.291796067500632"></polygon>',
  '<path class="circle" d="m 20 1 a 1 1 0 0 0 0 25 a 1 1 0 0 0 0 -25"></path>',
  '<polygon class="other-star" points="18,0,22.242640687119284,13.757359312880714,36,18,22.242640687119284,22.242640687119284,18.000000000000004,36,13.757359312880716,22.242640687119284,0,18.000000000000004,13.757359312880714,13.757359312880716"></polygon>',
  '<polygon class="diamond" points="18,0,27.192388155425117,8.80761184457488,36,18,27.19238815542512,27.192388155425117,18.000000000000004,36,8.807611844574883,27.19238815542512,0,18.000000000000004,8.80761184457488,8.807611844574884"></polygon>',
];

$("*").on("keypress", function () {
  if (!started) {
    started = true;
    level = 0;
    setTimeout(() => {
      nextSequence();
    }, 1000);
  }
});

$(".btn").on("click", function (event) {
  let userChosenColor = $(this).attr("id");
  userClickedPattern.push(userChosenColor);
  playSound(userChosenColor);
  animatePress(userChosenColor);
  buttonPressed($(this), event, buttonColors.indexOf(userChosenColor));
  if (started) {
    if (patternCheck()) {
      if (patternComplete) {
        userClickedPattern.splice(0, userClickedPattern.length);
        setTimeout(() => nextSequence(), 1000);
        patternComplete = false;
      }
    } else {
      $("h1").text("Game Over, Press Any Key to Restart");
      started = false;
      userClickedPattern.splice(0, userClickedPattern.length);
      gamePattern.splice(0, gamePattern.length);
      let wrongAudio = new Audio("./sounds/wrong.mp3");
      wrongAudio.play();
      $("body").addClass("game-over");
      setTimeout(() => {
        $("body").removeClass("game-over");
      }, 200);
    }
  }
});

function patternCheck() {
  userChoiceLength = userClickedPattern.length;
  gamePatternLength = gamePattern.length;

  for (let i = 0; i < userChoiceLength; i++)
    if (gamePattern[i] !== userClickedPattern[i]) return false;
  if (userChoiceLength === gamePatternLength) patternComplete = true;
  return true;
}

function nextSequence() {
  let randomChosenNumber = Math.floor(Math.random() * 4);
  let randomChosenColor = buttonColors[randomChosenNumber];

  level++;
  $("h1").text("Level " + level);

  gamePattern.push(randomChosenColor);
  $("#" + randomChosenColor)
    .fadeIn(150)
    .fadeOut(150)
    .fadeIn(200);
  playSound(randomChosenColor);
}

function playSound(name) {
  let audio = new Audio("./sounds/" + name + ".mp3");
  audio.play();
}

function animatePress(currentColour) {
  $("#" + currentColour).addClass("pressed");
  setTimeout(function () {
    $("#" + currentColour).removeClass("pressed");
  }, 100);
}

function buttonPressed(btn, e, index) {
  let group = [];
  let num = Math.floor(Math.random() * 50) + 30;
  let shapeColors = ["#F5F5DC", "#FFE5B4", "#FF7F50", "#20B2AA"];

  for (i = 0; i < num; i++) {
    let randNum = Math.floor(Math.random() * 4);
    let scale = Math.floor(Math.random() * 5) + 4;

    let x = Math.floor(Math.random() * 250) - 100;
    let y = Math.floor(Math.random() * 250) - 100;

    let sec = Math.floor(Math.random() * 1000);

    let shape = $('<svg class="shape">' + shapes[randNum] + "</svg>");

    shape.css({
      top: e.pageY - btn.offset().top,
      left: e.pageX - btn.offset().left,
      transform: "scale(0." + scale + ")",
      transition: sec + "ms",
      fill: shapeColors[randNum],
    });

    btn.children(".btn-particles").append(shape);

    group.push({ shape: shape, x: x, y: y });
  }

  for (let a = 0; a < group.length; a++) {
    let shape = group[a].shape;
    let x = group[a].x,
      y = group[a].y;
    shape.css({
      left: x + 50,
      top: y + 15,
      transform: "scale(0)",
    });
  }

  setTimeout(function () {
    for (let b = 0; b < group.length; b++) {
      let shape = group[b].shape;
      shape.remove();
    }
    group = [];
  }, 1000);
}
