const holder = document.querySelector(".fetched__list__block");
const filters = document.querySelectorAll('select');

// CardTable
// ОТВЕТСТВЕННОСТЬ:
//                 ПОЛУЧИТЬ ДАННЫЕ
//                 ТРАНСФОРМИРОВАТЬ ДАННЫЕ
//                 СЛЕДИТЬ ЗА ОБНОВЛЕНИЯМИ ФИЛЬТРОВ
//                 ДОБАВЛЯТЬ КАРТЫ
//                 МАНИПУЛИРОВАТЬ СТРУКТУРОЙ СТРАНИЦЫ
//                 НЕ СООТВЕТСТВОВАТЬ БЛЯТь ПРИНЦИПУ ЕДИНОЙ ОТВЕТСТВЕННОСТИ
//                 ЯВЛЯТЬСЯ ГОВНОКОДОМ
class CardsTable {
    constructor(parent, dataLink, modal, filtersEl) {
        CardsTable.bind(this);
        this.parent = parent;
        this.dataLink = dataLink;

        this.modal = modal;
        this.filtersEl = filtersEl;
        this.filters = {
            type: "All"
        }
        this.params = {
            addedCount: 30,
            currentCount: 0,
            isNew: true,
            cards: []
        }

        this.data = undefined;
        this.showMoreBtn = undefined;

        fetch(dataLink)
        .then((response)=> {
            if(response.ok) {
                return response.json();
            } else {
                throw new Error("Данные о предметах не получены: "+ response.status);
            }
        })
        .then((data)=>{
            this.data = data;
            this.init();
        })
    }


    // добавляет слежку за обновлениями фильтров
    // запускает рендер по обновлению
    addFiltersListeners() {
        this.filtersEl.forEach(element => {
            element.addEventListener("change", (e)=>{
                this.changeAndRender(e.target.value);
            })
        });

    }

    // менят значение фильтра внутри класса и запускает рендер
    changeAndRender(val) {
        this.params.isNew = true;
        this.filters.type = val;
        let cards = this.getCards(val);
        cards = this.sortCards(cards);
        this.params.cards = cards;
        this.renderCards(cards);
    }

    // возвращает все карты для отображения
    getAllCards() {
        const collection = [];
        for(let i in this.data) {
            for(let j in this.data[i]) {
                collection.push(this.data[i][j]);
            }
        }

        return collection;
    }


    //получает карты нужной категории, отправляет на сортировку
    // отдает сортированные карты нужной категории, чтобы потом пихать в рендер
    getCards(cat) {
        let collection = [];

        if (this.filters.type === "All") {
            collection = this.getAllCards();
        } else {

            for(let i in this.data[cat]) {
                collection.push(this.data[cat][i]);
            }
        }

        return collection;
    }

    //сортирует карты по редкости
    sortCards(cards) {
        let sortedCards = cards;
        sortedCards.sort(function (a, b){
            return b.rarity - a.rarity;
        });

        return sortedCards;
    }


    // отвечает за отображения карт
    // инициирует класс Cards
    renderCards() {
        if (this.params.isNew) {
            this.params.isNew = false;
            this.parent.innerHTML = "";
            this.params.currentCount = 0;
        }

        let added = this.params.addedCount;
        let count = this.params.currentCount;

        if(count+added>this.params.cards.length) {
            added = this.params.cards.length - count;
        }


        for(let i = count; i<count+added; i++) {
            this.params.currentCount = i;
            let card = new Card(this.params.cards[i], this.modal);
            this.parent.appendChild(card.getCard());
        }
        this.params.currentCount+=1;
        if (this.params.currentCount >= this.params.cards.length) {
            this.showMoreBtn.style.display = "none";
        } else {
            this.showMoreBtn.style.display = "flex";
        }
    }

    createAndListenMoreBtn() {
        this.showMoreBtn = document.createElement("div");
        this.showMoreBtn.classList.add("usual__btn");
        let content = `
        <span class="usual__btn-text">
            Показать ещё
        </span>
        `;
        this.showMoreBtn.innerHTML = content;
        this.parent.parentNode.appendChild(this.showMoreBtn);

        this.showMoreBtn.addEventListener("click", ()=>{
            this.renderCards();
        })
    }

    // запускает первичный рендер всех карточек и настраивает класс
    //для дальнейшей работы с обновлениями фильтров
    init() {
        this.createAndListenMoreBtn();
        this.addFiltersListeners();
        let cards = this.getAllCards()
        cards = this.sortCards(cards);
        this.params.cards = cards;
        this.renderCards(cards);
    }


}


class Card {
    constructor(data, modal) {
        this.data = data;
        this.modal = modal;
        this.type = undefined;
        this.card = undefined;
        this.init();
    }

    createCard() {
        this.card = document.createElement('div');
        this.card.classList.add("fetched__list__cell-container");
        let type = this.data.type;
        if (type != "Auxiliary") {
            if(type === "Torpedo") {
                type+="es";
            } else {
                type+="_Guns";
            }

        }

        this.type = type;

        let color = this.getRarityColor(this.data.rarity);
        let content = `
        <div class="fetched__list__cell">
            <div class="fetched__list__cell__img__holder" style="background:${color}">
                <img src="./img/items/${type +"/"+ this.data.src+'.png'}" alt="" class="fethced__list__cell__img">
            </div>
            <p class="cell__name">${this.data.name}</p>
        </div>
        `;

        this.card.innerHTML = content;
    }


    getRarityColor(rarity) {
        switch (Number(rarity)) {
            case 5:
                return "#EEEE99";
    
            case 4:
                return "#C4ADFF";
    
            case 3:
                return "#9FE8FF";
    
        }
    }

    getCard() {
        return this.card;
    }

    addListener() {
        this.card.addEventListener("click", ()=>{
            this.modal.display(this.data.name, this.type+"/"+this.data.src, ["p: "+this.data.description, "p:"+this.data.footer], this.data.link);
        })
    }

    init() {
        this.createCard();
        this.addListener();
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
        
        this.link = undefined;
        this.elements.title.addEventListener("click", ()=>{
            window.open(this.link);
        })
        this.elements.contentHolder.appendChild(this.contWrap);
        this.addListeners();
    }

    getContent(structure) {
        const struct = structure;
        let content = '';


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

        for (let i=0; i<struct.length; i++) {
            let sign = struct[i][0];
            let current = struct[i];
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

    display(title, src, structure, link) {
        const imgSrc = './img/items/'+src+".png";
        this.elements.title.innerHTML = title;
        this.elements.img.setAttribute("src", imgSrc);
        this.elements.content.innerHTML = this.getContent(structure);
        this.overlay.style.display = "block";
        this.link = link;

    }

    hide() {
        this.overlay.style.display = "none";
    }
}
//  RUN
const modalManager = new ModalManager();
const cardsTable = new CardsTable(holder, "../data/items/items.json", modalManager, filters);