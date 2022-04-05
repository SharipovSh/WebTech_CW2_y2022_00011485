let torch = document.getElementById("torch")

window.addEventListener("mousemove", (event)=> {
    try{
        torch.setAttribute('style', `Top: ${event.pageY}px`)
        torch.style.left = event.pageX +"px"
    }catch{
        return
    }
})