"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.desencriptar = void 0;
function desencriptar(inputFilename, outputFilename) {
  if (outputFilename === void 0) {
    outputFilename = "instrucciones_encriptadas_type_results.txt";
  }
  var fs = require("fs");
  var lineas = new Array();
  var resultado = [];
  var errores = [];
  var checkPos = function (caracter, inst) {
    if (caracter === inst.texto[inst.posicion]) {
      //revisar si este character es el que sigue en la instruccion
      inst.posicion++;
    } else {
      //si no fue el siguiente character, revisar que no sea el character pasado repetido
      //si es el character pasado repetido, no pasa nada
      //agregando validacion para la reviscion en el primer character, si no es no se debe revisar un char antes pues no existe
      if (inst.posicion != 0) {
        if (caracter !== inst.texto[inst.posicion - 1]) {
          //si no fue el pasado ni el siguiente, reiniciar posicion a 0 pues el mensaje no esta completo
          inst.posicion = 0;
        }
      }
    }
    // aqui tambien tenia un error, esta validacion estaba dentro de el "else"pasado cuando se debe hacer siempre al final del chequeo
    // y al final revisamos si la instruccion se completo
    if (inst.texto.length === inst.posicion) {
      //si esta completo, marcamos la flag de instruccion incluida
      inst.incluido = true;
    }
  };
  try {
    lineas = fs.readFileSync(inputFilename, "utf-8").split("\n");
    var lengths = lineas[0].split(" ");
    var regex = /^[a-zA-Z0-9]+$/;
    if (lineas.length === 4) {
      // Process the lines as needed
      var instruccion1 = {
        texto: lineas[1].trim(),
        incluido: false,
        posicion: 0,
      };
      //validacion de que length de la primera instruccion sea segun la indicada
      if (instruccion1.texto.length !== parseInt(lengths[0])) {
        errores.push("La primera instruccion no tiene la longitud indicada");
      }
      //Validacion que el length sea permitido - entre 2 y 50
      if (instruccion1.texto.length < 2 || instruccion1.texto.length > 50) {
        errores.push("La primera instruccion tiene una longitud no permitida");
      }
      var instruccion2 = {
        texto: lineas[2].trim(),
        incluido: false,
        posicion: 0,
      };
      //validacion de que length de la segunda instruccion sea segun la indicada
      if (instruccion2.texto.length !== parseInt(lengths[1])) {
        errores.push("La segunda instruccion no tiene la longitud indicada");
      }
      //Validacion que el length sea permitido - entre 2 y 50
      if (instruccion2.texto.length < 2 || instruccion2.texto.length > 50) {
        errores.push("La segunda instruccion tiene una longitud no permitida");
      }
      var mensaje = lineas[3];
      //validacion de longitud del mensaje
      if (mensaje.length !== parseInt(lengths[2])) {
        errores.push("el mensaje no tiene la longitud indicada");
      }
      //Validacion que el length del mensaje sea permitido - entre 3 y 5000
      if (mensaje.length < 3 || mensaje.length > 5000) {
        errores.push("El mensaje tiene una longitud no permitida");
      }
      //validacion para revisar el que mensaje solo tenga los characteres permitidos
      if (!regex.test(mensaje)) {
        errores.push("El mensaje contiene caracteres no permitidos");
      }
      //si hubo errores se imprimen los errores, si no, se imprime el resultado
      if (errores.length === 0) {
        for (var contMensaje = 0; contMensaje < mensaje.length; contMensaje++) {
          //reviso si alfuno de los mensajes ya fue validado, si ya fue no hay necesidad de validar mas characteres pues solo hay una instruccion por mensaje
          if (!instruccion1.incluido && !instruccion2.incluido) {
            checkPos(mensaje[contMensaje], instruccion1);
            checkPos(mensaje[contMensaje], instruccion2);
          } else {
            break;
          }
        }
        //se guarda resultado
        resultado.push(instruccion1.incluido ? "SI" : "NO");
        resultado.push(instruccion2.incluido ? "SI" : "NO");
      }
    } else {
      errores.push("Input Incorrecto, debe tener solo 4 lineas");
    }
  } catch (error) {
    console.log("Error:", error.message);
  }
  //si hubo errores se imprimen los errores, si no, se imprime el resultado
  if (errores.length === 0) {
    fs.writeFileSync(outputFilename, resultado.join("\n"));
  } else {
    fs.writeFileSync(outputFilename, errores.join("\n"));
  }
}
exports.desencriptar = desencriptar;
if (require.main === module) {
  var inputFilename = process.argv[2];
  var outputFilename = process.argv[3];
  if (inputFilename) {
    if (outputFilename) {
      desencriptar(inputFilename, outputFilename);
    } else {
      desencriptar(inputFilename);
    }
  } else {
    //Mensaje Error Correcto
    console.log(
      "Uso: node instrucciones_encriptadas_type.js <input_filename> <output_filename> - (opcional)"
    );
  }
}
var textoPrueba1 =
  "11 15 38\n  CeseAlFuego\n  CorranACubierto\n  XXcooomokkCCessseAAllFueeegooDLLKmmNN";
