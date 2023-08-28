import java.util.Scanner;

public class Desencriptar {
    public static void main(String[] args) {
        //String data = "11 15 38\n" +
        //        "CeseAlFuego\n" +
        //        "CorranACubierto\n" +
        //        "XXcooomokkCCessseAAllFueeegooDLLKmmNN";
        
        //se modifico para que la data venga de el archivo de texto y no de un texto hardcodeado
        String data ="";

        Scanner scanner = new Scanner(System.in);
        StringBuilder holder = new StringBuilder();

        while (scanner.hasNextLine()) {
            String line = scanner.nextLine();
            if (line.isEmpty()) {
                break; // Stop reading at an empty line
            }
            holder.append(line).append("\n");
        }
        data = holder.toString();

        scanner.close();

        //System.out.print(data);

        String[] lineas = data.trim().split("\n");

        //Instancio las "Instrucciones" y seteo el texto de la instruccion,
        //el constructor espera el texto y las otras dos propiedades estan seteadas por default
        Instruction instruction1 = new Instruction(lineas[1]);
        Instruction instruction2 = new Instruction(lineas[2]);

        String mensaje = lineas[3];

        //itero por cada char en el mensaje, revisando el char con la posicion de cada inst
        //una vez completada la instruccion salgo del for pues solo hay una instruccion por mensaje
        for (int contMensaje = 0; contMensaje < mensaje.length(); contMensaje++) {
            if (!instruction1.getIncluido() && !instruction2.getIncluido()) {
                checkPos(mensaje.charAt(contMensaje), instruction1);
                checkPos(mensaje.charAt(contMensaje), instruction2);
            } else {
                contMensaje = mensaje.length();
            }
        }

        System.out.println(instruction1.getIncluido() ? "SI" : "NO");
        System.out.println(instruction2.getIncluido() ? "SI" : "NO");
    }

    //creo mi funcion para comparar character actual con posicion actual en mensaje/instruccion
    private static void checkPos(char character, Instruction inst) {

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
}

class Instruction {
    //declaro el objeto que uso para el registro de las instrucciones y si se incluyen o no
    //texto contiene la instruccions
    //incluido es la bandera que me se marca como "true" una vez verificado el mensaje
    //Posicion me dice que tantas posicione de la instruccion han ocurrido sin interrupcion
    private final String texto;
    private boolean incluido;
    private int posicion;

    public Instruction(String text) {
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