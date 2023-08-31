import java.io.*;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;
import java.util.regex.Matcher;

public class Desencriptar {
    public static void main(String[] args) {
        List<String> lineas = new ArrayList<>();
        List<String> resultado = new ArrayList<>();
        List<String> errores = new ArrayList<>();
        Pattern regex = Pattern.compile("^[a-zA-Z0-9]+$");


        if (args.length >= 1) {
            String inputFilename = args[0];
            System.out.println(args[0]);
            //harcoded output file path, used on debug
            //String outputFilename = args.length >= 2 ? args[1] : "C:\\Users\\ingen\\IdeaProjects\\AZAlgo\\src\\instrucciones_encriptadas_java_results.txt";

            //Dinamic output file path
            String outputFilename = args.length >= 2 ? args[1] : "instrucciones_encriptadas_java_results.txt";


            try {
                BufferedReader reader = new BufferedReader(new FileReader(inputFilename));
                String line;
                while ((line = reader.readLine()) != null) {
                    lineas.add(line);
                }
                reader.close();

                if (lineas.size() == 4) {
                    String[] lengths = lineas.get(0).split(" ");

                    //Instancio las "Instrucciones" y seteo el texto de la instruccion,
                    //el constructor espera el texto y las otras dos propiedades estan seteadas por default
                    String instruccion1Texto = lineas.get(1).trim();
                    Instruccion instruccion1 = new Instruccion(instruccion1Texto);

                    String mensaje = lineas.get(3);


                    //validacion de que length de la primera instruccion sea segun la indicada
                    if (instruccion1Texto.length() != Integer.parseInt(lengths[0])) {
                        errores.add("La primera instruccion no tiene la longitud indicada");
                    }
                    //Validacion que el length sea permitido - entre 2 y 50
                    if (instruccion1Texto.length() < 2 || instruccion1Texto.length() > 50) {
                        errores.add("La primera instruccion tiene una longitud no permitida");
                    }

                    String instruccion2Texto = lineas.get(2).trim();
                    Instruccion instruccion2 = new Instruccion(instruccion2Texto);

                    if (instruccion2Texto.length() != Integer.parseInt(lengths[1])) {
                        errores.add("La segunda instruccion no tiene la longitud indicada");
                    }
                    if (instruccion2Texto.length() < 2 || instruccion2Texto.length() > 50) {
                        errores.add("La segunda instruccion tiene una longitud no permitida");
                    }


                    if (mensaje.length() != Integer.parseInt(lengths[2])) {
                        errores.add("El mensaje no tiene la longitud indicada");
                    }
                    if (mensaje.length() < 3 || mensaje.length() > 5000) {
                        errores.add("El mensaje tiene una longitud no permitida");
                    }

                    Matcher matcher = regex.matcher(mensaje);
                    if (!matcher.matches()) {
                        errores.add("El mensaje contiene caracteres no permitidos");
                    }

                    if (errores.isEmpty()) {
                        for (int contMensaje = 0; contMensaje < mensaje.length(); contMensaje++) {
                            if (!instruccion1.getIncluido() && !instruccion2.getIncluido()) {
                                checkPos(mensaje.charAt(contMensaje), instruccion1);
                                checkPos(mensaje.charAt(contMensaje), instruccion2);
                            } else {
                                break;
                            }
                        }

                        resultado.add(instruccion1.getIncluido() ? "SI" : "NO");
                        resultado.add(instruccion2.getIncluido() ? "SI" : "NO");
                    }
                } else {
                    errores.add("Input Incorrecto, debe tener solo 4 lineas");
                }
            } catch (IOException e) {
                System.out.println("Error: " + e.getMessage());
            }

            try {
                BufferedWriter writer = new BufferedWriter(new FileWriter(outputFilename));
                if (errores.isEmpty()) {
                    for (String res : resultado) {
                        writer.write(res + "\n");
                    }
                } else {
                    for (String err : errores) {
                        writer.write(err + "\n");
                    }
                }
                writer.close();
            } catch (IOException e) {
                System.out.println("Error: " + e.getMessage());
            }



        } else {
            System.out.println("Uso: java Desencriptar.java <input_filename> <output_filename> - (opcional)");
        }

    }

    //creo mi funcion para comparar character actual con posicion actual en mensaje/instruccion
    public static void checkPos(char character, Instruccion inst) {

        if (character == inst.getTexto().charAt(inst.getPosicion()) ) {
            //reviso si este character es el que sigue en la instruccion
            //si si es se incrementa la posicion
            inst.setPosicion(inst.getPosicion() + 1);
        } else {
            //si no es el character que sigue en la instruccion reviso si es igual al pasado
            // es igual -> no se incrementa ni se resetea la posicion
            // no es igual al pasado -> se resetea posicion

            //!!Aqui tenia un error en el Algoritmo de JS, en la primera verificada si el char no es parte de la instruccion
            //no se puede revisar una posicion anterior, agregando if para esa primera corrida
            if(inst.getPosicion() != 0){
                if (character != inst.getTexto().charAt(inst.getPosicion() - 1)) {
                    inst.setPosicion(0);
                }
            }

        }

        //esto estaba dentro del else pasado en JS Algo, arreglado en ahi tambien
        if (inst.getTexto().length() == inst.getPosicion()) {
            inst.setIncluido(true);
        }

    }

    static class Instruccion {
        //declaro el objeto que uso para el registro de las instrucciones y si se incluyen o no
        //texto contiene la instruccions
        //incluido es la bandera que me se marca como "true" una vez verificado el mensaje
        //Posicion me dice que tantas posicione de la instruccion han ocurrido sin interrupcion
        private String texto;
        private boolean incluido;
        private int posicion;

        public Instruccion(String text) {
            this.texto = text;
            this.incluido= false;
            this.posicion = 0;
        }

        //declaro getters y setters para las propiedades de la "Instruccion"
        public String getTexto() {
            return texto;
        }

        public boolean getIncluido() {
            return incluido;
        }

        public void setIncluido(boolean incluidoParam) {
            this.incluido = incluidoParam;
        }

        public int getPosicion() {
            return posicion;
        }

        public void setPosicion(int posicionParam) {
            this.posicion = posicionParam;
        }
    }
}

