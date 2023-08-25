function desencriptar(data: string) {
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

  const mensaje: string = lineas[3];

  const checkPos = (caracter: string, inst) => {
    if (caracter === inst.texto[inst.posicion]) {
      //revisar si este character es el que sigue en la instruccion
      inst.posicion++;
    } else {
      //si no fue el siguiente character, revisar que no sea el character pasado repetido
      //si es el character pasado repetido, no pasa nada

      if (caracter !== inst.texto[inst.posicion - 1]) {
        //si no fue el pasado ni el siguiente, reiniciar posicion a 0 pues el mensaje no esta completo
        inst.posicion = 0;
      }

      // y al final revisamos si la instruccion se completo
      if (inst.texto.length === inst.posicion) {
        //si esta completo, marcamos la flag de instruccion incluida

        inst.incluido = true;
      }
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

  //imprimir resultado
  console.log(instruccion1.incluido ? "SI" : "NO");
  console.log(instruccion2.incluido ? "SI" : "NO");
}

const textoPrueba1 = `11 15 38
  CeseAlFuego
  CorranACubierto
  XXcooomokkCCessseAAllFueeegooDLLKmmNN`;

desencriptar(textoPrueba1);

export { desencriptar };
