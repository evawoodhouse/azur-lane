const menuBtn = document.querySelector(".burger__menu-btn");
const menuImg = document.querySelector(".burger__menu-img");
const menuOverlay = document.querySelector(".menu__overlay");
let opened = false;

let path = "./img/other/";
const loc = window.location.pathname;
if(loc.includes("/news/")) {
    path = "../../../img/other/";
}

menuBtn.addEventListener('click', ()=> {
    if (opened) {
        menuImg.src = path + "menu_open.png";
        menuOverlay.classList.add('hide');
        opened = !opened;
    } else {
        menuImg.src = path+"menu_close.png";
        menuOverlay.classList.remove('hide');
        opened = !opened;
    }
});

menuOverlay.addEventListener('click', e=>{
    if(e.target.dataset.close) {
        menuImg.src = path+"menu_open.png";
        menuOverlay.classList.add('hide');
        opened = false;
    }
})
