function desencriptar(
  inputFilename: string,
  outputFilename: string = "instrucciones_encriptadas_type_results.txt"
): void {
  const fs = require("fs");
  let lineas = new Array<string>();
  let resultado: string[] = [];
  let errores: string[] = [];
  interface Instruccion {
    texto: string;
    incluido: boolean;
    posicion: number;
  }

  const checkPos = (caracter: string, inst: Instruccion) => {
    if (caracter === inst.texto[inst.posicion]) {
      //revisar si este character es el que sigue en la instruccion
      inst.posicion++;

      //en cuanto se avansa en posicion en instruccion, reviso si la nueva letra de la instruccion es igual a la pasada
      //si es igual se registra error por que en las instrucciones dice que "Ninguna instruccion en el libro de instrucciones contiene dos letras seguidas"
      if (inst.texto[inst.posicion] === inst.texto[inst.posicion - 1]) {
        errores.push("La instruccion contiene letras repetidas");
      }
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
    const lengths = lineas[0].split(" ");
    const regex = /^[a-zA-Z0-9]+$/;
    if (lineas.length === 4) {
      // Process the lines as needed

      const instruccion1: Instruccion = {
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

      const instruccion2: Instruccion = {
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

      const mensaje: string = lineas[3];
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
        for (let contMensaje = 0; contMensaje < mensaje.length; contMensaje++) {
          //reviso si alfuno de los mensajes ya fue validado, si ya fue no hay necesidad de validar mas characteres pues solo hay una instruccion por mensaje

          //como hay una prueba que al parecer revisa si hay dos instrucciones en el mensaje voy a modificar la logica
          //si un mensaje ya se encontro solo no voy a seguir "checandoPos" en ese mensaje, y solo buscare el otro
          if (!instruccion1.incluido) {
            checkPos(mensaje[contMensaje], instruccion1);
          }
          if (!instruccion2.incluido) {
            checkPos(mensaje[contMensaje], instruccion2);
          }

          if (
            (instruccion1.incluido && instruccion2.incluido) ||
            errores.length !== 0
          ) {
            //ahora si, si las dos intrucciones ya occurieron no hay necesidad de hacer mas checks
            //tambien, si en checkPos se detecto una instruccion con characteres repetidos, se agrega el error
            //si se detecto error se corta for y se imprimen errores
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
    fs.writeFileSync(outputFilename, resultado.join("\n"));
  } else {
    fs.writeFileSync(outputFilename, errores.join("\n"));
  }
}

if (require.main === module) {
  const inputFilename = process.argv[2];
  const outputFilename = process.argv[3];
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

const textoPrueba1 = `11 15 38
  CeseAlFuego
  CorranACubierto
  XXcooomokkCCessseAAllFueeegooDLLKmmNNN`;

//desencriptar();

export { desencriptar };
