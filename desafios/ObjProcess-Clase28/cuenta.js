function randomNumber(min, max) {
    return Math.floor((Math.random() * (max - min + 1)) + min);
}

function generateRandoms(nums) {
    console.log(nums + " cantidad de numero que pido")
    data = []
    for (let i = 0; i < nums; i++) {
        const num = randomNumber(1, 1000)
        let contador = 0
        for (let o = 0; o < data.length; o++) {
            if (data[o].num == num) {
                contador++
            }
        }
        data.push({num, contador}) 
    }
    return data
}

process.on('exit', () => {
    console.log(`worker #${process.pid} cerrado`)
})

process.on('message', cant => {
    console.log(`worker #${process.pid} iniciando su tarea`)
    const resultado = generateRandoms(cant)
    // const resultado = 'hola vengo de otro hilo'
    process.send(resultado)
    console.log(`worker #${process.pid} finalizó su trabajo`)
    process.exit()
})

process.send('listo')