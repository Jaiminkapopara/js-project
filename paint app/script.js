const toolBtns = document.querySelectorAll('.tool'),
canvas = document.querySelector('canvas'),
fillColor = document.querySelector('#fill-color'),
sizeSlider = document.querySelector('#size-slider'),
colorBtns = document.querySelectorAll('.colors .option'),
colorPicker = document.querySelector('#color-picker'),
clearCanvas = document.querySelector('.clear-canvas'),
saveImg = document.querySelector('.save-img'),
ctx = canvas.getContext('2d')

let isDrawing = false,
brushWidth = 5,
selectedTool = 'brush',
selectedColor = '#000',
prevMouseX, prevMouseY, snapshot

const setCanvasBackground = () => {
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = selectedColor; // setting fillstyle back to the selectedColor, it'll be the brush color

}

window.addEventListener('load', () => {
    // setting canvas width/height...   offsetwidth/height returns viewable width/height of an element
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    setCanvasBackground()
})

const drawRect = (e) => {
    // if fillcolor isn't checked draw a rect with border else draw rect with background 
    if(!fillColor.checked){
        //creating circle according to the mouse pointer
        return ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY)
    }
    ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY)
}

const drawCircle = (e) => {
    ctx.beginPath() // creating new path to draw circle  && jo aa no lakhvi to repeat thaya kare
    // getting radius for circle according to the mouse pointer
    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY),2))
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI)
    fillColor.checked ? ctx.fill() : ctx.stroke()
}

const drawTriangle = (e) => {
    ctx.beginPath()
    ctx.moveTo(prevMouseX, prevMouseY) // moveTo used to moves the path to the specified pointer && moving triangle to the mouse pointer
    ctx.lineTo(e.offsetX, e.offsetY) // creating first line according to the mouse pointer
    ctx.lineTo(prevMouseX * 2 - e.offsetX , e.offsetY) //creating bottom line of triangle
    ctx.closePath()
    fillColor.checked ? ctx.fill() : ctx.stroke()
}

const startDraw = (e) => {
    isDrawing = true
    prevMouseX = e.offsetX // passing current mouseX position as prevMouseX value
    prevMouseY = e.offsetY // passing current mouseY position as prevMouseY value

    ctx.beginPath() // creating new path to draw
    ctx.lineWidth = brushWidth
    ctx.strokeStyle = selectedColor
    ctx.fillStyle = selectedColor
    // copying canvas data & passing as snapshot value... this avoids dragging the image
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height)
}

const drawing = (e) => {
    if(!isDrawing) return //if isdrawing is false return from here
    ctx.putImageData(snapshot, 0, 0) // adding copied canvas data on to  this canvas

    if(selectedTool === 'brush' || selectedTool === 'eraser'){
        ctx.strokeStyle = selectedTool === 'eraser' ? '#fff' : selectedColor
        ctx.lineTo(e.offsetX, e.offsetY) // creating line according to the mouse pointer
        ctx.stroke() // drawing/filling line with color
    } else if(selectedTool === 'rectangle'){
        drawRect(e)
    } else if(selectedTool === 'circle'){
        drawCircle(e)
    } else{
        drawTriangle(e)
    }
}

toolBtns.forEach(btn => {
    btn.addEventListener('click', () => { // adding click event to all tool option

        //removing active class from the previous option and adding on current clicked option
        document.querySelector('.options .active').classList.remove('active')
        btn.classList.add('active')
        selectedTool = btn.id
        console.log(selectedTool);
    })
})

sizeSlider.addEventListener('change', () => brushWidth = sizeSlider.value)

colorBtns.forEach(btn => {
    btn.addEventListener("click", () => { // adding click event to all color button
        // removing selected class from the previous option and adding on current clicked option
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected");
        // passing selected btn background color as selectedColor value
        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
    });
});

colorPicker.addEventListener("change", () => {
    colorPicker.parentElement.style.background = colorPicker.value
    colorPicker.parentElement.click()
})

clearCanvas.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width,  canvas.height)
    setCanvasBackground()
})

saveImg.addEventListener('click', () => {
    const link = document.createElement("a"); // creating <a> element
    link.download = `${Date.now()}.jpg`; // passing current date as link download value
    link.href = canvas.toDataURL(); // passing canvasData as link href value
    link.click(); // clicking link to download image

})

canvas.addEventListener('mousemove', drawing)
canvas.addEventListener('mousedown', startDraw)
canvas.addEventListener('mouseup', () => isDrawing = false)


