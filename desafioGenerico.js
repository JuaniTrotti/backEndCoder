class herramientaContador {
    constructor(nombre) {
        this.nombre = nombre;
        this.cantidad = 0;
    }

    static getCant = 0
    
    getNombre = () => {
        return this.nombre;
    }

    getCantidadLocal = () => {
        return this.cantidad;
    }

    aumentarCantidad = () => {
        this.cantidad++;
        herramientaContador.getCant++;
    }
}


const juan = new herramientaContador('juan');

juan.aumentarCantidad();
juan.getCantidadLocal()

const heran = new herramientaContador('heran');
heran.aumentarCantidad();
heran.aumentarCantidad();
heran.aumentarCantidad();
heran.getCantidadLocal();


console.log("cantidad de" + heran.getNombre() + ":" +  heran.getCantidadLocal());
console.log("cantidad de" + juan.getNombre() + ":" +  juan.getCantidadLocal());
console.log(herramientaContador.getCant)