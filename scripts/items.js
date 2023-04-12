const holder = document.querySelector(".fetched__list__block");
const filters = document.querySelectorAll('select');

class CardsTable {
    constructor(parent, dataLink, manager, filtersEl) {
        CardsTable.bind(this);
        this.displayParams = {
            currentDisplayCount: 0,
            displayCount: 20,
            isNew: true,
            cards: []
        }
        this.parent = parent;
        this.cards = undefined;
        this.modal = manager;
        this.data = undefined;
        this.filtersEl = filters;
        this.filters = {
            type: "All"
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
            console.log(this.data);
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
                this.displayParams.isNew = true;
                this.cards = cards;
                this.renderCards(this.cards);
            })
        });
        
        for (let i in this.data) {
            console.log(this.data[i]);
            for(let j=0; j<this.data[i].length; j++) {
                this.displayParams.cards.push(this.data[i][j]);
                console.log('object');
            }
        }


    }

    getCards() {
        const collection = [];


            if (this.filters.type === "All") {
                for (let i in this.data) {
                    collection.push(this.data[i]);
                }
            } else {
                collection.push(this.data[this.filters.type]);
            }

            console.log(collection);
        return collection;
    }

    updateFilters(value) {
        this.filters["type"] = value;
    }

    renderCards(rawCards) {
        if (this.displayParams.isNew) {
            this.parent.innerHTML = "";
            this.displayParams.isNew = false;
            this.displayParams.currentDisplayCount = 0;
        }


        for (let i=this.displayParams.currentDisplayCount; i+this.displayParams.displayCount<cards.length; i++) {
            this.displayParams.currentDisplayCount = i;
            let card = new Card(cards[i], this.modal);
            this.parent.appendChild(card.getCard());
        }

        
    }


    init () {
        this.addFiltersListener();
        console.log(this.displayParams.cards);
        this.renderCards();

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
        let type = this.data.type;

        
        

        const content = `
        <div class="fetched__list__cell">
            <div class="fetched__list__cell__img__holder">
                <img src="./img/items/${this.data.src+'.png'}" alt="" class="fethced__list__cell__img">
            </div>
            <p class="cell__name">${this.data.name}</p>
        </div>
        `

        this.card.innerHTML = content;
    }

    addListener(type) {
        this.card.addEventListener(type, (e) => {
            this.modal.display(this.data);
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
                return `<img src="${imageCollection[src-1]}">`
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
const cardsTable = new CardsTable(holder, "../data/items/items.json", modalManager, filters);
