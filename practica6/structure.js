let tablero = ['', '', '', '', '', '', '', '', ''];
let jugadorActual = 'X';
let juegoActivo = true;
let tiempoInicio;
let intervaloCronometro;

const casillas = document.querySelectorAll('.casilla');
const estadoJuego = document.getElementById('estado');
const mostrarTiempo = document.getElementById('tiempo');
const botonReiniciar = document.getElementById('reiniciar');
const tablaMejoresTiempos = document.getElementById('mejores-tiempos');

function iniciarCronometro() {
    tiempoInicio = Date.now();
    intervaloCronometro = setInterval(() => {
        const transcurrido = (Date.now() - tiempoInicio) / 1000;
        mostrarTiempo.textContent = transcurrido.toFixed(1);
    }, 100);
}

function detenerCronometro() {
    clearInterval(intervaloCronometro);
}

function verificarGanador() {
    const combinacionesGanadoras = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], 
        [0, 3, 6], [1, 4, 7], [2, 5, 8], 
        [0, 4, 8], [2, 4, 6]
    ];

    for (let combinacion of combinacionesGanadoras) {
        const [a, b, c] = combinacion;
        if (tablero[a] && tablero[a] === tablero[b] && tablero[a] === tablero[c]) {
            return tablero[a];
        }
    }

    return tablero.includes('') ? null : 'Empate';
}

function movimientoComputadora() {
    let casillasVacias = tablero.map((val, idx) => val === '' ? idx : null).filter(val => val !== null);
    let indiceAleatorio = casillasVacias[Math.floor(Math.random() * casillasVacias.length)];
    tablero[indiceAleatorio] = 'O';
    casillas[indiceAleatorio].textContent = 'O';
    casillas[indiceAleatorio].classList.add('desactivada');
}

function manejarClickCasilla(evento) {
    const indice = evento.target.getAttribute('data-index');

    if (tablero[indice] !== '' || !juegoActivo) return;

    tablero[indice] = jugadorActual;
    evento.target.textContent = jugadorActual;
    evento.target.classList.add('desactivada');

    if (!tiempoInicio) iniciarCronometro();

    const ganador = verificarGanador();

    if (ganador) {
        juegoActivo = false;
        detenerCronometro();
        if (ganador === 'X') {
            const tiempoTranscurrido = (Date.now() - tiempoInicio) / 1000;
            setTimeout(() => registrarGanador(tiempoTranscurrido), 100);
            estadoJuego.textContent = '¡Ganaste!';
        } else {
            estadoJuego.textContent = 'Ganó la maquina';
        }
        return;
    }

    movimientoComputadora();

    if (verificarGanador()) {
        juegoActivo = false;
        detenerCronometro();
        estadoJuego.textContent = 'Ganó la maquina';
    }
}

function enviarScore(score, player, game) {
    const data = new URLSearchParams({
        score: score,
        player: player,
        game: game
    });

    fetch('proxy.php', { // Cambiar URL al proxy
        method: 'POST',
        body: data,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('¡Score guardado con éxito!');
        } else {
            //alert('Error al guardar el score: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error en la solicitud:', error);
        alert('No se pudo conectar con el servidor.');
    });
}



function registrarGanador(tiempo) {
    const nombreJugador = prompt('¡Felicidades! ¿Cuál es tu nombre?');
    if (!nombreJugador) return;

    const nuevoRecord = {
        nombre: nombreJugador,
        tiempo: tiempo,
        fecha: new Date().toLocaleString()
    };

    let datosTabla = JSON.parse(localStorage.getItem('tablaMejoresTiempos')) || [];
    datosTabla.push(nuevoRecord);
    datosTabla.sort((a, b) => a.tiempo - b.tiempo);
    datosTabla = datosTabla.slice(0, 10);

    localStorage.setItem('tablaMejoresTiempos', JSON.stringify(datosTabla));
    mostrarTablaMejoresTiempos();

    const tiempoEnMilisegundos = Math.round(tiempo * 1000); 
    console.log(tiempoEnMilisegundos);
    enviarScore(tiempoEnMilisegundos, nombreJugador, 'Tic-tac-toe-Hetoor');
}


function mostrarTablaMejoresTiempos() {
    const datosTabla = JSON.parse(localStorage.getItem('tablaMejoresTiempos')) || [];
    tablaMejoresTiempos.innerHTML = datosTabla.map(record => `
        <li>${record.nombre} - ${record.tiempo} segundos</li>
    `).join('');
}

function reiniciarJuego() {
    tablero = ['', '', '', '', '', '', '', '', ''];
    juegoActivo = true;
    jugadorActual = 'X';
    tiempoInicio = null;
    mostrarTiempo.textContent = '0.0';
    estadoJuego.textContent = 'Tu turno';
    detenerCronometro();
    casillas.forEach(casilla => {
        casilla.textContent = '';
        casilla.classList.remove('desactivada');
    });
}

casillas.forEach(casilla => casilla.addEventListener('click', manejarClickCasilla));
botonReiniciar.addEventListener('click', reiniciarJuego);

mostrarTablaMejoresTiempos();
