"use strict";
//Se agregaron validaciones,
Object.defineProperty(exports, "__esModule", { value: true });
exports.obtenerGanador = void 0;
var obtenerGanador = function (inputFilename, outputFilename) {
  if (outputFilename === void 0) {
    outputFilename = "jugador_ganador_type_results.txt";
  }
  var fs = require("fs");
  var lineas = new Array();
  var resultado = "";
  var errores = [];
  //regex para validar que las lineas solo contengan numeros y espacios vacios
  var regex = /^[0-9\s]+$/;
  try {
    lineas = fs.readFileSync(inputFilename, "utf-8").trim().split("\n");
    var rondas = parseInt(lineas[0].trim());
    //validacion de que primera contenga solo numeros
    if (!regex.test(lineas[0].trim())) {
      errores.push("la primera linea tiene characteres no permitidos");
    }
    //
    if (lineas.length - 1 === rondas) {
      //declaracion de objetos jugador, tiene la puntacion total, registro de la ventaja mas grande de cada jugador y bandera de si es el ganador "so far"
      var Jug1 = {
        puntuacion: 0,
        ventajaMayor: 0,
        ganando: false,
      };
      var Jug2 = {
        puntuacion: 0,
        ventajaMayor: 0,
        ganando: false,
      };
      var verificarVentajaMayor = function (ganador, perdedor) {
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
      for (var rondaCont = 1; rondaCont <= rondas; rondaCont++) {
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
          var resRond = lineas[rondaCont].trim().split(" ");
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
    errores.push(error.message);
    console.log("Error:", error.message);
  }
  //si hubo errores se imprimen los errores, si no, se imprime el resultado
  if (errores.length === 0) {
    fs.writeFileSync(outputFilename, resultado);
  } else {
    fs.writeFileSync(outputFilename, errores.join("\n"));
  }
};
exports.obtenerGanador = obtenerGanador;
var texto = "5\n  140 82\n  89 134\n  90 110\n  112 106\n  88 90";
//obtenerGanador();
if (require.main === module) {
  var inputFilename = process.argv[2];
  var outputFilename = process.argv[3];
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
