import java.util.Scanner;

public class JugadorGanador {
    public static void main(String[] args) {
        //String data = "5\n" +
        //        "140 82\n" +
        //        "89 134\n" +
        //        "90 110\n" +
        //        "112 106\n" +
        //        "88 90"; // Replace with your actual input data

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

        int rondas = Integer.parseInt(lineas[0]);

        //declaro jugadores, cada jugador tendra:
        // su acumulado de puntuacion registro de la ventaja mas grande que han tenido al final de una ronda
        // y bandera que indica si son ganadores "so far"
        Jugador jug1 = new Jugador();
        Jugador jug2 = new Jugador();

        for (int rondaCont = 1; rondaCont <= rondas; rondaCont++) {
            String[] resRond = lineas[rondaCont].trim().split(" ");

            jug1.addPuntuacion(Integer.parseInt(resRond[0]));
            jug2.addPuntuacion(Integer.parseInt(resRond[1]));

            if (jug1.getPuntuacion() > jug2.getPuntuacion()) {
                verificarVentajaMayor(jug1, jug2);
            } else {
                verificarVentajaMayor(jug2, jug1);
            }
        }

        if (jug1.isGanando()) {
            System.out.println("1 " + jug1.getVentajaMayor());
        } else {
            System.out.println("2 " + jug2.getVentajaMayor());
        }
    }

    private static void verificarVentajaMayor(Jugador ganador, Jugador perdedor) {
        //Funcion que actualiza la ventaja major de el ganador, si es necesario
        int ventajaActual = ganador.getPuntuacion() - perdedor.getPuntuacion();
        if ( ganador.getVentajaMayor() < ventajaActual) {
            ganador.setVentajaMayor(ventajaActual);
            if (ventajaActual > perdedor.getVentajaMayor()) {
                ganador.setGanando(true);
                perdedor.setGanando(false);
            }
        }
    }
}

class Jugador {
    //Defino el objeto jugador que usare para registro de puntuacion y ganador
    private int puntuacion;
    private int ventajaMayor;
    private boolean ganando;

    public Jugador() {
        this.puntuacion = 0;
        this.ventajaMayor = 0;
        this.ganando = false;
    }


    //creacion de getter y setters para accesar a los parametros de Jugador
    public int getPuntuacion() {
        return puntuacion;
    }

    public void addPuntuacion(int puntuacionParam) {
        puntuacion += puntuacionParam;
    }

    public int getVentajaMayor() {
        return ventajaMayor;
    }

    public void setVentajaMayor(int ventajaMayorParam) {
        this.ventajaMayor = ventajaMayorParam;
    }

    public boolean isGanando() {
        return ganando;
    }

    public void setGanando(boolean ganandoParam) {
        this.ganando = ganandoParam;
    }
}