class user {
    constructor(nombre, apellido, libros, mascotas) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.libros = [libros];
        this.mascotas = [mascotas];
    }

    getFullName = () => {
        return `Su nombre completo es: ${this.nombre} ${this.apellido}`;
    }

    addMascota = (nombreMas) => {
        this.mascotas.push(nombreMas);
    }

    countMasctotas = () => {
        return this.mascotas.length;
    }

    addBook = (l, a) => {
        this.libros.push({
            nombre: l,
            autor: a
        });
    }

    gerBookName = () => {
        let arrayLibros = [];
        this.libros.map((i)=>{
            arrayLibros.push(` ${i.nombre}`)
        })
        return `Nombres de los libros:${arrayLibros}`;
    }
}


const juan = new user('juan', 'perez', {nombre: "libro1", autor: "Martin"}, 'perro');
console.log(juan.getFullName());
juan.addMascota('gato');
console.log(juan.countMasctotas());
juan.addBook('libro2', 'Marcela');
juan.addBook('libro4', 'Martin');

console.log(juan.gerBookName());