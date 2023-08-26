const desencriptar = (data) => {
  const lineas = data.trim().split("\n");

  const instruccion1 = {
    texto: lineas[1],
    incluido: false,
    posicion: 0,
  };

  const instruccion2 = {
    texto: lineas[2],
    incluido: false,
    posicion: 0,
  };

  const mensaje = lineas[3];

  const checkPos = (caracter, inst) => {
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
    if (inst.texto.length === inst.posicion) {
      //si esta completo, marcamos la flag de instruccion incluida
      inst.incluido = true;
    }
  };

  for (let contMensaje = 0; contMensaje < mensaje.length; contMensaje++) {
    //reviso si alfuno de los mensajes ya fue validado, si ya fue no hay necesidad de validar mas characteres pues solo hay una instruccion por mensaje
    if (!instruccion1.incluido && !instruccion2.incluido) {
      checkPos(mensaje[contMensaje], instruccion1);
      checkPos(mensaje[contMensaje], instruccion2);
    } else {
      contMensaje = mensaje.length;
    }
  }

  console.log(instruccion1.incluido ? "SI" : "NO");

  console.log(instruccion2.incluido ? "SI" : "NO");
};

const textoPrueba1 = `11 15 38
CeseAlFuego
CorranACubierto
XXcooomokkCCessseAAllFueeegooDLLKmmNN`;

desencriptar(textoPrueba1);
