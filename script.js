//Variables y datos necesarios

//botones en un array
let arrButtons = [];
const red = document.querySelector(".red");
arrButtons.push(red);
const blue = document.querySelector(".blue");
arrButtons.push(blue);
const yellow = document.querySelector(".yellow");
arrButtons.push(yellow);
const green = document.querySelector(".green");
arrButtons.push(green);
//Array despues de añadirle los elementos
console.log("Array despues de añadirle los elementos:");
console.log(arrButtons);

//titulo del juego
const levelTitle = $('#level-title');
//elemento de instrucciones
const gameInstructions = $('#game-instructions');
//botones con jQuery
let jqButtons = [];
const redjq = $("#red");
jqButtons.push(redjq);
const bluejq = $("#blue");
jqButtons.push(bluejq);
const yellowjq = $("#yellow");
jqButtons.push(yellowjq);
const greenjq = $("#green");
jqButtons.push(greenjq);

//Array despues de añadirle los elementos
console.log("jQueryButtons:");
console.log(jqButtons);

//Sonidos
const redSound = new Audio("sounds/red.mp3");
const blueSound = new Audio("sounds/blue.mp3");
const yellowSound = new Audio("sounds/yellow.mp3");
const greenSound = new Audio("sounds/green.mp3");
//sonido de error
const wrongSound = new Audio("sounds/wrong.mp3");

//funcion para generar un numero aleatorio
const buttonNumbers = [0, 1, 2, 3];
const randomNumber = (numero) => {
  let acceptNumbers = buttonNumbers.filter((num) => num !== numero);
  console.log("numeros aceptados:");
  console.log(acceptNumbers);
  let resultLength = Math.floor(Math.random() * acceptNumbers.length);
  let result = acceptNumbers[resultLength];
  numeroRepetido = result;
  return result;
};
var numeroRepetido;

//Estos datos para la generacion de todos no se puede meter en una funcion porque a pesar de estar más arriba ya las siguientes no tienen acceso y eso no cambia con var
let niveles = [];
let sound;
let readNumber = 0;

//funcion que añadirá eventos diferentes según el número ganador
const addEvents = (winNumber) => {
  //boton correcto
  console.log("boton correcto:");
  console.log(arrButtons[niveles[readNumber]]);
  for (let i = 0; i < arrButtons.length; i++) {
    if (i == winNumber) {
      jqButtons[i].bind("click", (e) => {
        reproducirAudio(e.target.id);
      });
      arrButtons[i].addEventListener("click", correct);
      continue;
    }
    arrButtons[i].addEventListener("click", incorrect);
  }
};

//funcion que se nombra para poder quitarse después
//Permite seleccionar el evento para poder eliminarlo
const correct = async () => {
  console.log("Se ejecutó esta función");
  // await animation(niveles[readNumber]);
  setTimeout(() => {
    removeEventos();
    arrButtons[niveles[readNumber]].removeEventListener('click', incorrect);
    for(let i = 0; i < arrButtons.length; i++){
      arrButtons[i].removeEventListener("click", incorrect);
    }
    readNumber++;
    console.log(`Cuantos niveles a leido readNumber: ${readNumber}`);
    console.log(`Cuantos niveles hay en niveles: ${niveles.length}`);
    if (readNumber == niveles.length) {
      console.log("ya se leyeron todos los niveles");
      readNumber = 0;
      console.log(`Valor reseteado de "readNumber": ${readNumber}`);
      setTimeout(() => {
        generarNivel();
      }, 400);
    } else {
      console.log("Se volverán a añadir eventos para leer el siguiente nivel");
      addEvents(niveles[readNumber]);
    }
  }, 300);
};

//funcion en caso de que haya presionado un boton incorrecto
//Permite seleccionar el evento para poder eliminarlo
const incorrect = () => {
  removeEventos();
  gameOver();
};
//Resetear el juego
const reset = ()=>{
    console.log('se volvio a añadir')
    for(let i = 0; i < arrButtons.length; i++){
      arrButtons[i].removeEventListener("click", incorrect);
    }
    arrButtons[niveles[readNumber]].removeEventListener('click', incorrect)
    readNumber = 0;
    niveles = [];
    numeroRepetido = '';
    removeEventListener('keypress', reset);
    // Mostrar las instrucciones nuevamente
    gameInstructions.show();
    levelTitle.text("Presiona una tecla para empezar");
    levelTitle.css('text-transform', 'uppercase');
    startGame();
  }
const gameOver = ()=>{
  $('body').addClass('game-over');
  wrongSound.play();
  setTimeout(()=>{
    $('body').removeClass('game-over');
  }, 200);
  levelTitle.text("Has perdido, presiona una tecla para volver a empezar");
  levelTitle.css('text-transform', 'capitalize');
  // Mostrar las instrucciones cuando el juego termine
  gameInstructions.show();
  addEventListener('keypress', reset)
}

//funcion que le quitará todos los eventos para el siguiente nivel
const removeEventos = () => {
  for (let i = 0; i < arrButtons.length; i++) {
    let winNumber = niveles[readNumber];
    if (i == winNumber) {
      arrButtons[i].removeEventListener("click", correct);
      jqButtons[i].unbind("click");
      arrButtons[i].addEventListener("click", incorrect);
      console.log("Se quitó el evento");
      continue;
    }
  }
};

const startGame = () => {
  removeEventListener("keypress", startGame);
  // Ocultar las instrucciones cuando el juego comience
  gameInstructions.hide();
  generarNivel();
};
const generarNivel = () => {
  console.log("se esta ejecutando la funcion generar nivel");
  let newLevel = randomNumber(numeroRepetido);
  console.log("numero aleatorio: " + newLevel);
  niveles.push(newLevel);
  levelTitle.text(`Nivel ` + niveles.length);
  console.log(niveles);
  switch (newLevel) {
    case 0:
      sound = redSound;
      break;
    case 1:
      sound = blueSound;
      break;
    case 2:
      sound = yellowSound;
      break;
    case 3:
      sound = greenSound;
      break;
  }
  animation(newLevel);
  addEvents(niveles[readNumber]);
};
const animation = (numero) => {
  jqButtons[numero].fadeOut(200);
  jqButtons[numero].fadeIn(200);
  console.log(sound);
  sound.play();
};
const reproducirAudio = (botonID) => {
  const audio = new Audio(`sounds/${botonID}.mp3`);
  $(`.${botonID}`).addClass('pressed');
  audio.play();
  setTimeout(() => {
    $(`.${botonID}`).removeClass('pressed');
  }, 120);
  // $(`.${botonID}`).animate({});
};
addEventListener("keypress", startGame);

/*necesito dos funciones una para que despues de hayar el número correcto siga con el siguiente numero dentro de niveles y otra que cuando haya leido todos los niveles genere uno nuevo y 
resetee el valor de elementos leidos

1.leer todos los numeros en niveles:

Para la primera función necesito hacer una prueba para estar seguro de que funcione y no complicarme con las dos funciones al mismo tiempo por lo que definire los numero aleatorios que le voy a pasar, 
y desactivare temporalmente la generacion aleatoria para agregarle elementos al array y que no se me crucen los dos tipos de datos luego haré un if en el que comprobaré si numeros leidos es 
del tamaño de niveles.length, y por mi prueba no lo será, asi que como ya se le sumó los valores leidos, podría volver a ejecutar la funcion addevents para comprobar con el valor de numeros leidos
y asi tener que volver a encontrar un elemento diferente, luego haré la otra función y ya implementaré todo con números aleatorios.

2.Generar nuevo nivel cuando se hayan leido todos los números

Efectivamente logre crear la primera función correctamente, lee todos los niveles, ahora cuando ya lee todos, debo resetear en 0 el valor de numeros leidos y cambiar la ubicación de la generacion del numero aleatorio
para que le añade un elemento nuevo cuando se ejecute la funcion generar nivel, debo comprobar si no hay problemas al declararla dentro de la funcion, luego con eso deberia leer cada vez mas numeros segun se vayan
presionando.
*/

/*
Bien, logré crear exitosamente el algoritmo se generan los niveles segun presione todos los botones correctos, y se parará todo cuando presione los botones incorrectos, ahora debo crear las siguientes funciones:
1. Game over:
Necesito que cuando se presione un botón incorrecto se eliminen todos los elementos de los niveles, se resetee el valor de readNumber y que cuando se ejecute el evento keypress se vuelva a ejecutar la funcion
startGame, debo quitar el evento keypress luego de que se ejecute esa funcion para que no me de ningun error mientras ejecuto el código o que se pueda ejecutar esa función y arruine todo.
2. animate new level:
debo crear un objeto que detecte elemento se está presionando que obtenga la clase y que use una función diferente para hacerlo según el que se requiera
*/
