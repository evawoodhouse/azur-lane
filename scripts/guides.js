const holder = document.querySelector(".fetched__list__block");
const filters = document.querySelectorAll('select');

class CardsTable {
    constructor(parent, dataLink, manager, filters) {
        CardsTable.bind(this);
        this.parent = parent;
        this.modal = manager;
        this.data = undefined;
        this.filtersEl = filters;
        this.filters = {
            type: "characters"
        };

        fetch(dataLink)
        .then((response)=>{
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Данные о гайдах не получены "+ response.status);
            }
        })
        .then((data)=> {
            this.data = data;
            this.init();
        })
        .catch(err => {
            console.warn(err)
        })
    }

    addFiltersListener() {
        this.filtersEl.forEach((item)=>{
            item.addEventListener("change", (e)=>{

                this.updateFilters(e.target.value);
                let cards = this.getCards();
                this.renderCards(cards);
            })
        })
    }

    getCards() {
        const collection = [];
        for(let i=0; i<this.data.length; i++) {
            let valid = true;
            console.log(this.data[i].type, this.filters.type);
            if (!((this.data[i].type === this.filters.type) || (this.filters.type == "all"))) {
                valid = false;
            }
            console.log(valid);
            if (valid) {
                collection.push(this.data[i]);
            }
        }

        return collection;
    }

    updateFilters(value) {
        this.filters["type"] = value;
    }

    renderCards(cards) {
        this.parent.innerHTML = "";
        
        for (let i=0; i<cards.length; i++) {
            let card = new Card(cards[i], this.modal);
            this.parent.appendChild(card.getCard());
        }
    }


    init () {
        this.addFiltersListener();
        this.renderCards(this.data);

    }
}




class Card {
    constructor(data, modal) {
        this.modal = modal;
        this.data = data;
        this.card = undefined;
        this.init();
    }

    createCard() {
        this.card = document.createElement('div');
        this.card.classList.add("fetched__list__cell-container");

        const content = `
        <div class="fetched__list__cell">
            <div class="fetched__list__cell__img__holder" style="background: rgba(0,0,0,0)">
                <img src="./img/guides/${this.data.imgSrc+'.jpg'}" alt="" class="fethced__list__cell__img">
            </div>
            <p class="cell__name">${this.data.title}</p>
        </div>
        `

        this.card.innerHTML = content;
    }

    addListener(type) {
        this.card.addEventListener(type, (e) => {
            this.modal.display(this.data.title, this.data.imgSrc, this.data.content);
        })
    }

    getCard() {
        return this.card;
    }

    init() {
        this.createCard();
        this.addListener("click");
    }

    
}




class ModalManager {
    constructor() {
        this.overlay = document.querySelector(".info__modal__overlay");
        this.closeEl = {
            cross: document.querySelector(".red__cross"),
            over: this.overlay
        }
        this.overlay.style.display = "none";
        this.contWrap = document.createElement('div');
        this.contWrap.classList.add("info__modal__wrapper");
        this.elements = {
            title: document.querySelector(".info__modal__headers"),
            img: document.querySelector(".info__modal__header-img"),
            content: this.contWrap,
            contentHolder: document.querySelector(".info__modal__container")
        };
        this.elements.title.style.textDecorationLine = "none";
        this.elements.title.style.cursor = "text";
        this.elements.contentHolder.appendChild(this.contWrap);
        this.addListeners();
    }

    getContent(structure) {
        const struct = structure;
        const imageCollection = [];
        let content = '';

        for(let i=0; i<struct.images.length; i++) {
            imageCollection.push("../img/guides/"+struct.images[i]);
            console.log('object');
        }

        const add = {
            p: function (text) {
                return `<p>${text}</p>`;
            },
            h: function (text) {
                return `<h2 class="headers">${text}</h2>`
            },
            i: function (src) {
                let imgContent = `<div class="info__modal__img__holder">`;
                let indicesRaw = src.split(",");
                let indices = [];
                console.log(indicesRaw, src);
                for (let i=0; i<indicesRaw.length; i++) {
                    indices.push(Number(indicesRaw[i])-1);
                }
                console.log(indices);

                for (let i=0; i<indices.length; i++) {
                    imgContent+= `<img src="${imageCollection[indices[i]]}" class="info__modal__added__images">`
                }

                imgContent+= `</div>`;
                console.log(imgContent);
                return imgContent;
            }
        };

        for (let i=0; i<struct.struct.length; i++) {
            let sign = struct.struct[i][0];
            let current = struct.struct[i];
            content += add[sign](current.slice(3));
        }

        return content;
    }

    addListeners() {
        this.overlay.addEventListener("click", (e)=>{
            if (e.target.dataset.close) {
                this.hide();
            }
        })
    }

    display(title, src, structure) {
        const imgSrc = './img/guides/'+src+".jpg";
        this.elements.title.innerHTML = title;
        this.elements.img.setAttribute("src", imgSrc);
        this.elements.content.innerHTML = this.getContent(structure);
        this.overlay.style.display = "block";
    }

    hide() {
        this.overlay.style.display = "none";
    }
}


const modalManager = new ModalManager();
const cardsTable = new CardsTable(holder, "../data/guides/guides.json", modalManager, filters);
