const wrapper = document.querySelector(".nav__modal");

wrapper.addEventListener("click", (e)=>{
    e.preventDefault();
    let target = e.target;
    if (target.getAttribute('class') === "modal__nav__cell") {
        window.location = target.children[0].getAttribute('href');
    }
    if (target.getAttribute('class') === "nav__link") {
        window.location = target.getAttribute('href');
    }
})