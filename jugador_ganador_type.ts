const obtenerGanador = () => {
  const fs = require("fs");
  let data = "";
  try {
    data = fs.readFileSync("jugador_ganador_data.txt", "utf8");
    //console.log("File content:", data);
  } catch (err) {
    console.error("Ocurrio un Error al leer el archivo con la data:", err);
  }

  const lineas = data.trim().split("\n");

  const rondas = parseInt(lineas[0].trim());

  //declaracion de objetos jugador, tiene la puntacion total, registro de la ventaja mas grande de cada jugador y bandera de si es el ganador "so far"
  let Jug1 = {
    puntuacion: 0,
    ventajaMayor: 0,
    ganando: false,
  };

  let Jug2 = {
    puntuacion: 0,
    ventajaMayor: 0,
    ganando: false,
  };

  const verificarVentajaMayor = (ganador, perdedor) => {
    if (ganador.ventajaMayor < ganador.puntuacion - perdedor.puntuacion) {
      //si la ventaja al terminar esta ronda es major a la guardada se actualiza registro de la mayor ventaja
      ganador.ventajaMayor = ganador.puntuacion - perdedor.puntuacion;
      //y se verifica quien es el ganador(el que lleva la mayor ventaja "so far")
      if (ganador.ventajaMayor > perdedor.ventajaMayor) {
        ganador.ganando = true;
        perdedor.ganando = false;
      }
    }
  };

  for (let rondaCont = 1; rondaCont <= rondas; rondaCont++) {
    //iteramos por cada ronda
    const resRond = lineas[rondaCont].trim().split(" ");

    //se agrega el resultado de la ronda al total de cada jugador
    Jug1.puntuacion = Jug1.puntuacion + parseInt(resRond[0]);
    Jug2.puntuacion = Jug2.puntuacion + parseInt(resRond[1]);

    //se comparan totales para ver quien va ganando despues de esta ultima ronda
    if (Jug1.puntuacion > Jug2.puntuacion) {
      //una vez obtenido el jugador se revisa si la ventaja obtenida es la mayor
      verificarVentajaMayor(Jug1, Jug2);
    } else {
      //una vez obtenido el jugador se revisa si la ventaja obtenida es la mayor
      verificarVentajaMayor(Jug2, Jug1);
    }
  }

  if (Jug1.ganando) {
    console.log("1 " + Jug1.ventajaMayor);
  } else {
    console.log("2 " + Jug2.ventajaMayor);
  }
};

const texto = `5
  140 82
  89 134
  90 110
  112 106
  88 90`;

obtenerGanador();

export { obtenerGanador };
