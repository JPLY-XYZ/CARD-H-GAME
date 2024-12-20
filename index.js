import { listaCartas, listaMemes, cartaReversa, memeReversa } from './listadoCartas.js';


let main;

let cantidadCartasVolteadas = 0;
let clicksTotales = 0;

let cantidadCartas = 2;
let listadoCartasGeneradas = new Set(); //cartas que hemos extraido del listado
let listadoCartasEnPantalla; //listado de las cartas que tenemos en la pantalla junto a su estado {id:1,url://img1.jpg , visible:false, encontrado:false} visible:false=oculto visible:true=visible  encontrado:false=no encontrado  encontrado:true=encontrado
let carta1Seleccionada = null;
let carta2Seleccionada = null;
let temporizador;
let modal;
let tiempoModal;
let clicksTotalesModal;
let barraProgresoCartas;
let buttonTutorial;
let modalTutorial;
let botonTutoModal;
let tutoBody;

let timmer = { ms: 0, s: 0, m: 0 }
let timer;

let listaCartasSeleccionada;
let cartaReversaSeleccionada;

document.addEventListener('DOMContentLoaded', () => {

    main = document.getElementById('main');
    temporizador = document.getElementById('tiempo');
    modal = document.getElementById('myModal');
    tiempoModal = document.getElementById('tiempoModal');
    clicksTotalesModal = document.getElementById('clicksTotalesModal');
    barraProgresoCartas = document.getElementById('progress');
    buttonTutorial = document.getElementById('tuto');
    modalTutorial = document.getElementById('tutoModal');
    botonTutoModal = document.getElementById('botonModal');
    tutoBody = document.getElementById('tutoBody');
    cargarJuego();


    buttonTutorial.addEventListener('click', () => { tutorial(1) });

    botonTutoModal.addEventListener('click', () => { tutorial(2) });
});



function tutorial(fase) {
    modalTutorial.style.display = 'block';
    if (fase == 1) {
        tutoBody.innerHTML = `
          <p>Para empezar a jugar solo debes seleccionar cual de los 2 modos quieres jugar pulsar jugar</p>
          <br>
          <img style="width:  100%;" src="IMAGES/Tuto.png" alt="">
       `;

    } else {
        botonTutoModal.innerHTML = '<a class="close" href="index.html">CERRAR</a>';
        tutoBody.innerHTML = `<p>Selecciona la cantidad de parejas que quieres mostrar</p>
          <br>
          <img style="width:  100%;" src="IMAGES/Tuto2.png" alt="">`
    }
}


function cargarJuego() {
    main.className = 'mainStart';
    main.innerHTML = `
    <div>
        <h1>JUEGO BUSCA CARTAS</h1>
        <p>El juego busca cartas es un juego de cartas en el que se buscan pares de cartas para ganar.</p>
        <img src="/IMAGES/CARTASGAME.png" alt="">
        <button id="juegoCartas">JUGAR</button>
    </div>
    <div>
        <h1>JUEGO BUSCA MEMES</h1>
        <p>Es una variante del juego busca cartas con cartas personalizadas con memes.</p>
        <img src="IMAGES/MEMESGAME.png" alt="">
        <button id="juegoMemes">JUGAR</button>
    </div>`


    const juegoCartas = document.getElementById('juegoCartas');

    juegoCartas.addEventListener('click', () => {

        seleccionCantidad();
        listaCartasSeleccionada = listaCartas;
        cartaReversaSeleccionada = cartaReversa;

    });

    const juegoMemes = document.getElementById('juegoMemes');

    juegoMemes.addEventListener('click', () => {

        seleccionCantidad();
        listaCartasSeleccionada = listaMemes;
        cartaReversaSeleccionada = memeReversa;

    });
}





function seleccionCantidad() {
    main.className = 'mainStart';
    main.innerHTML = `
    <div>
        <h1>SELECCIONA LA CANTIDAD DE PAREJAS A MOSTRAR</h1>
        <select name="cartas" id="selector">
        <option style="background-color: blue;" value="2">2</option>
        <option style="background-color: blue;" value="3">3</option>
        <option style="background-color: green;" value="4">4</option>
        <option style="background-color: green;" value="5">5</option>
        <option style="background-color: green;" value="6">6</option>
        <option style="background-color: green;" value="7">7</option>
        <option style="background-color: yellow;" value="8">8</option>
        <option style="background-color: yellow;" value="9">9</option>
        <option style="background-color: yellow;" value="10">10</option>
        <option style="background-color: orange;" value="11">11</option>
        <option style="background-color: orange;" value="12">12</option>
        <option style="background-color: orange;" value="13">13</option>
        <option style="background-color: red;" value="14">14</option>
        <option style="background-color: red;" value="15">15</option>
        <option style="background-color: red;" value="16">16</option>
        <option style="background-color: red;" value="18">18</option>
        <option style="background-color: red;" value="20">20</option>
        </select>
        <p id ="numCartas">4</p>
        <button id="empezarJuegoCartas">EMPEZAR A JUGAR</button>
    </div>`

    const selector = document.getElementById('selector');
    let numCartas = document.getElementById('numCartas');
    selector.addEventListener('change', () => {
        cantidadCartas = selector.value;
        numCartas.innerHTML = `${cantidadCartas * 2}`;
    });

    const empezarJuegoCartas = document.getElementById('empezarJuegoCartas');

    empezarJuegoCartas.addEventListener('click', () => {
        iniciarJuego();
    });
}

function iniciarJuego() {
    main.innerHTML = ``;
    cargarCartas(cantidadCartas);
    barraCartas(cantidadCartas / 2)


};

function cargarCartas(cantidad = 2) {

    main.className = 'mainJuego';
    main.style.gridTemplateColumns = `repeat( ${(cantidad * 2) >= 27 ? (cantidad * 2) / 4 : (cantidad * 2) / 2}, 1fr)`; //Esto no acepta numero que no se puedan dividir entre 4, con lo cual no acepta ni el 17 ni el 19

    do {
        const nuevaCarta = listaCartasSeleccionada[Math.floor(Math.random() * listaCartasSeleccionada.length)];
        listadoCartasGeneradas.add(nuevaCarta);
    } while (listadoCartasGeneradas.size < cantidad);

    listadoCartasEnPantalla = mezclarCartas([...listadoCartasGeneradas, ...listadoCartasGeneradas]);



    cargarCartasEnPantalla(listadoCartasEnPantalla, true);
    buttonTutorial.innerHTML = '<p>MEMORIZA LAS CARTAS</p>';
    setTimeout(iniciarTemporizador, 3000);
    setTimeout(cargarCartasEnPantalla, 3000, listadoCartasEnPantalla, false); //esperando 3 segundos para monstrar reverso cartas



}

function mezclarCartas(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }

    let finalArray = [];
    let counter = 0;
    array.forEach((carta) => {
        counter++;
        finalArray.push({ id: counter, url: carta, visible: false, encontrado: false });
    });

    return finalArray;

}




function cargarCartasEnPantalla(arrayCartas, visible = false) {
    main.innerHTML = ``;
    let cantidad = arrayCartas.length;

    if (visible) {
        arrayCartas.forEach((carta) => {
            let cartaActual = document.createElement('img');
            cartaActual.style.pointerEvents = 'none';
            cartaActual.style.height = cantidad >= 24 ? "160px" : "260px";
            cartaActual.src = carta.url;
            main.appendChild(cartaActual);
        });
    } else {
        arrayCartas.forEach((carta) => {

            let cartaActual = document.createElement('img');
            cartaActual.className = "carta";
            cartaActual.style.height = cantidad >= 26 ? "160px" : "260px";


            if (carta.visible) {
                cartaActual.src = carta.url;
                cartaActual.style.pointerEvents = 'none';
            } else {
                cartaActual.src = cartaReversaSeleccionada;
            }

            main.appendChild(cartaActual);


            cartaActual.addEventListener('click', () => {

                if (!carta.visible) {
                    voltearCarta(carta);
                    cartaActual.src = carta.url;
                    clicksTotales = +clicksTotales + 1;
                }

            });
        });

    }


}


function compararCartas(carta1, carta2) {
    if (carta1.url == carta2.url) {
        cantidadCartasVolteadas = +cantidadCartasVolteadas + 1;

        cargarCartasEnPantalla(listadoCartasEnPantalla);
        listadoCartasEnPantalla.forEach((cartaIndex) => {
            if (cartaIndex.id == carta1Seleccionada.id) {
                cartaIndex.visible = true;
                cartaIndex.encontrado = true;
            }
            if (cartaIndex.id == carta2Seleccionada.id) {
                cartaIndex.visible = true;
                cartaIndex.encontrado = true;
            }
        });
        carta1Seleccionada = null;
        carta2Seleccionada = null;



        if (cantidadCartasVolteadas == cantidadCartas - 1) {

            cargarCartasEnPantalla(listadoCartasEnPantalla, true);
            setTimeout(() => { //delay para que se muestren las cartas al final
                clearInterval(timer);
                modal.style.display = 'block';
                tiempoModal.textContent = `Tiempo de juego -> ${timmer.m.toLocaleString('es-ES', { minimumIntegerDigits: 2 })}:${timmer.s.toLocaleString('es-ES', { minimumIntegerDigits: 2 })}:${timmer.ms.toLocaleString('es-ES', { minimumIntegerDigits: 2 })}`
                clicksTotalesModal.textContent = `Clicks totales -> ${clicksTotales}`
            }, 10);
        }

        barraCartas(cantidadCartas / 2)



    } else {

        resetearCartas(1);
    }
}

function barraCartas(cantidad) {

    barraProgresoCartas.innerHTML = '';
    barraProgresoCartas.style.visibility = 'visible';

    console.log(cantidadCartasVolteadas)
    console.log(cantidad * 2)


    for (let i = 0; i < cantidad * 2 - cantidadCartasVolteadas; i++) {
        let div = document.createElement('div')
        div.classList.add('bar', 'blue')
        barraProgresoCartas.appendChild(div);
    }

    for (let i = 0; i < cantidadCartasVolteadas; i++) {
        let div = document.createElement('div')
        div.classList.add('bar', 'purple')
        barraProgresoCartas.appendChild(div);
    }


    barraProgresoCartas.childNodes[0].classList.add('red');
}

function voltearCarta(carta) {
    listadoCartasEnPantalla.forEach((cartaIndex) => {
        if (cartaIndex.id == carta.id) {
            cartaIndex.visible = true;
            if (carta1Seleccionada == null) {
                carta1Seleccionada = cartaIndex;
            } else if (carta2Seleccionada == null) {
                carta2Seleccionada = cartaIndex;
                compararCartas(carta1Seleccionada, carta2Seleccionada)
            }

        }
    });
}


function resetearCartas(delay) {

    main.style.pointerEvents = 'none';

    setTimeout(() => {
        listadoCartasEnPantalla.forEach((cartaIndex) => {
            if (cartaIndex.id == carta1Seleccionada.id) {
                cartaIndex.visible = false;
            }
            if (cartaIndex.id == carta2Seleccionada.id) {
                cartaIndex.visible = false;
            }
        });
        carta1Seleccionada = null;
        carta2Seleccionada = null;

        cargarCartasEnPantalla(listadoCartasEnPantalla);
        setTimeout(() => {
            main.style.pointerEvents = 'auto';
        }, 200)

    }, delay * 1000);
}


function iniciarTemporizador() {
    temporizador.style.display = 'block';

    timer = setInterval(() => {
        timmer.ms++
        if (timmer.ms == 60) {
            timmer.s++
            timmer.ms = 0;
            if (timmer.s == 60) {
                timmer.m++
                timmer.s = 0;
            }
        }

        temporizador.innerHTML = `${timmer.m.toLocaleString('es-ES', { minimumIntegerDigits: 2 })}:${timmer.s.toLocaleString('es-ES', { minimumIntegerDigits: 2 })} y ${clicksTotales} clicks`;
    }, 10);
}

