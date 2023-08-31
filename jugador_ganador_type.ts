//Se agregaron validaciones,

const obtenerGanador = (
  inputFilename: string,
  outputFilename: string = "jugador_ganador_type_results.txt"
): void => {
  const fs = require("fs");
  let lineas = new Array<string>();
  let resultado = "";
  let errores: string[] = [];
  //regex para validar que las lineas solo contengan numeros y espacios vacios
  const regex = /^[0-9\s]+$/;

  try {
    lineas = fs.readFileSync(inputFilename, "utf-8").trim().split("\n");
    const rondas = parseInt(lineas[0].trim());

    //validacion de que primera contenga solo numeros
    if (!regex.test(lineas[0].trim())) {
      errores.push("la primera linea tiene characteres no permitidos");
    }

    //
    if (lineas.length - 1 === rondas) {
      // Process the lines as needed

      interface Jugador {
        puntuacion: number;
        ventajaMayor: number;
        ganando: boolean;
      }

      //declaracion de objetos jugador, tiene la puntacion total, registro de la ventaja mas grande de cada jugador y bandera de si es el ganador "so far"
      let Jug1: Jugador = {
        puntuacion: 0,
        ventajaMayor: 0,
        ganando: false,
      };

      let Jug2: Jugador = {
        puntuacion: 0,
        ventajaMayor: 0,
        ganando: false,
      };

      const verificarVentajaMayor = (ganador: Jugador, perdedor: Jugador) => {
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
        //verificacion de errores, si hay errores salir del for
        if (errores.length === 0) {
          //iteramos por cada ronda

          //verificacion de que la linea para la ronda actual tenga caracteres permitidos
          if (!regex.test(lineas[rondaCont].trim())) {
            errores.push(
              "la linea para los resultados de la ronda " +
                rondaCont +
                " tiene characteres no permitidos"
            );
          }
          const resRond = lineas[rondaCont].trim().split(" ");

          //se agrega el resultado de la ronda al total de cada jugador
          Jug1.puntuacion = Jug1.puntuacion + parseInt(resRond[0]);
          Jug2.puntuacion = Jug2.puntuacion + parseInt(resRond[1]);

          //se comparan totales para ver quien va ganando despues de esta ultima ronda
          //el texto dice que se puede asumir que un jugador siempre gana pero de igual manera agregare validacion por si empatan jugadores
          if (Jug1.puntuacion === Jug2.puntuacion) {
            errores.push(
              "Error: Jugadores empataron al final de la ronda, no se permiten empates"
            );
          } else {
            if (Jug1.puntuacion > Jug2.puntuacion) {
              //una vez obtenido el jugador se revisa si la ventaja obtenida es la mayor
              verificarVentajaMayor(Jug1, Jug2);
            } else {
              //una vez obtenido el jugador se revisa si la ventaja obtenida es la mayor
              verificarVentajaMayor(Jug2, Jug1);
            }
          }
        } else {
          //si ya hubo errores se sale del for
          break;
        }
      }

      if (Jug1.ganando) {
        resultado = "1 " + Jug1.ventajaMayor;
        //console.log("1 " + Jug1.ventajaMayor);
      } else {
        resultado = "2 " + Jug2.ventajaMayor;
        //console.log("2 " + Jug2.ventajaMayor);
      }
    } else {
      //console.log("Numero de lineas incorrecto");
      errores.push("Numero de lineas incorrecto");
    }
  } catch (error) {
    if (error instanceof Error) {
      // ✅ TypeScript knows err is Error
      errores.push(error.message);
      console.log("Error:", error.message);
    } else {
      console.log("Unexpected error", error);
    }
  }

  //si hubo errores se imprimen los errores, si no, se imprime el resultado
  if (errores.length === 0) {
    fs.writeFileSync(outputFilename, resultado);
  } else {
    fs.writeFileSync(outputFilename, errores.join("\n"));
  }
};

const texto = `5
  140 82
  89 134
  90 110
  112 106
  88 90`;

//obtenerGanador();

if (require.main === module) {
  const inputFilename = process.argv[2];
  const outputFilename = process.argv[3];
  if (inputFilename) {
    if (outputFilename) {
      obtenerGanador(inputFilename, outputFilename);
    } else {
      obtenerGanador(inputFilename);
    }
  } else {
    //Mensaje Error Correcto
    console.log(
      "Uso: node jugador_ganador_type.js <input_filename> <output_filename> - (opcional)"
    );
  }
}

export { obtenerGanador };
