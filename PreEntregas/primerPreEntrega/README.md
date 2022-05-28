# Primera PreEntrega de proyecto final
## Puntos a completar

### Ecommerce backend

* Nodejs
* Express
* Routers --- /carrito /productos

### /api/productos

GET /:id? // listar todos los productos diponibles o un producto por su id (disponible para usuarios y administradores)
POST / // incorpora productos al listado (solo para administradores)
PUT /:id // actualiza un producto por su id (solo para administradores)
DELETE /:id // Borra un producto por su id (solo para administradores)

### /api/carrito

POST / // Crea un carrito y devuleve su id - createCarrito()
DELETE /:id // Vacia un carrito y lo elimina - deleteCarritoById()
GET /:id/productos // lista todos los productos guardados en el carrito - getProductsCarritoById()
POST /:id/productos // incorpora productos al carrito por su id del producto
-  pushProduct()
DELETE /:id/productos/:id_prod // Elimina un producto del carrito por su id de carrito y de producto - deleteProductById()

// id == id del carrito // id_prod == id del producto //

### Administrador

Usar una variable booleana
En el caso de hacer un request no permitido, devolver un objeto
ejemplo {error: xxx, descripcion: ruta x metodo y no autotizada}

### Productos

Campos de productos
id, timestamp, nombre, descripcion, codigo, url, precio, stock

### Carrito 

Tendra la siguiente estructura
id, timestamp(carrito), productos: {id, timestamp, nombre, descripcion, codigo, url, precio, stock}

/// el timestamp se puede implementar con Date.now()