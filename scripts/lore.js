const tabs = document.querySelectorAll(".lore__tab");
const chapters = document.querySelectorAll(".table__wrapper");
let current = 1;

function change() {
    let index = this.dataset.chapter - 1;

    hideContent();
    showContent(index);

}

function hideContent() {
    chapters.forEach(item=>{
        item.style.display = "none";
    })
    tabs.forEach(item=>{
            item.classList.remove("darkblue");
    })
}

function showContent(i) {
    chapters[i].style.display = "block";
    tabs[i].classList.add("darkblue");
} 

hideContent()
showContent(0);

tabs.forEach((item)=>{
    item.addEventListener('click', change);
});