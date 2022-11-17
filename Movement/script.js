// Llamamos al Canvas del DOM y proveemos contexto
/**  @type {HTMLCanvasElement} */
const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')

const pauseBtn = document.getElementById('pause')
let isPaused = false

// Cambia el texto del botón de pausa cambia el estado de pausa
function pauseHandler(){
    if(!isPaused){
        this.textContent = "Resume"
    }else{
        this.textContent= "Pause"
    }
    isPaused=!isPaused
    requestAnimationFrame(update)
}

pauseBtn.addEventListener('click', pauseHandler)

// Array dónde guardaremos todas las entidades creadas
const entities = []

// Lista donde guardaremos las coordenadas del mouse para invocar entidades
const mouse = {
    x: undefined,
    y: undefined
}

// Nuestra Clase entidad
class entity {
    // Propiedades
    x
    y
    r
    color
    isGoingLeft = true
    isGoingUp = true

    // Constructor
    constructor({ r = 20 }) {
        this.x = mouse.x
        this.y = mouse.y
        this.r = this.randomBetween() // Asigna un radio entre 25-10
        this.color = this.setColor() // Asigna un calor hexadecimal
        if (this.assignDirection()) {
            this.isGoingLeft = false // Asigna la dirección aleatoriamente
        }
        if (this.assignDirection()) {
            this.isGoingUp = false
        }
    }

    // Retorna un número entre 25 y 10
    randomBetween() {
        return Math.floor((Math.random() * (25 - 10 + 1)) + 10);
    }

    // Genera un colorHexadecimal aleatorio
    setColor() {
        let simbolos, color;
        simbolos = "0123456789ABCDEF";
        color = "#";

        for (let i = 0; i < 6; i++) {
            color = color + simbolos[Math.floor(Math.random() * 16)];
        }

        return color
    }

    // Retorna true o false de forma aleatoria
    assignDirection() {
        return (Math.floor(Math.random() * 2)) == 1;
    }

    // Calcula posición y direccion de la entidad
    calculatePosition() {

        // Validad la dirección horizontal
        if (this.x >= canvas.width - this.r && this.isGoingLeft == false) {
            this.isGoingLeft = true
        }

        if (this.x <= this.r && this.isGoingLeft == true) {
            this.isGoingLeft = false
        }

        // Validad la dirección vertical
        if (this.y <= this.r && this.isGoingUp == true) {
            this.isGoingUp = false
        }

        if (this.y >= canvas.height - this.r && this.isGoingUp == false) {
            this.isGoingUp = true
        }

        // Incrementa las coordenadas en x
        if (this.isGoingLeft == false) {
            this.x += 2
        } else {
            this.x -= 2
        }

        // Incrementa las coordanas en y
        if (this.isGoingUp == false) {
            this.y += 2
        } else {
            this.y -= 2
        }
    }

    // Dibuja la entidad en pantalla
    draw() {
        this.calculatePosition()
        context.beginPath()
        context.fillStyle = this.color
        context.arc(this.x, this.y, this.r, 0, Math.PI * 2)
        context.fill()
        context.closePath()
    }
}

// Crea una nueva entidad en la dirección que estamos clickeando
canvas.addEventListener('click', (e) => {
    mouse.x = e.offsetX
    mouse.y = e.offsetY
    entities.push(new entity({}))
})

// Ejecuta todas las funciones draw de todas las entidades en la lista entities
function updateEntities() {
    for (let i = 0; i < entities.length; i++) {
        entities[i].draw();
    }
}

// Limpia y actualiza las entidades
function update() {
    context.clearRect(0, 0, canvas.width, canvas.height)
    updateEntities()
    if (!isPaused) {
        // Recursividad para ejecutarlo cada frame
        requestAnimationFrame(update)
    }
}

// Llama al método anterior en el primer frame
requestAnimationFrame(update)