
// GETTING MODAL ELEMENTS


const closeBtn = document.querySelector(".red__cross");
const overlay = document.querySelector('.info__modal__overlay');
const list = document.querySelector('.fetched__list__block');
const modalImg = document.querySelector('.info__modal__header-img');
const modalHeader = document.querySelector('.info__modal__headers');
const modalStory = document.querySelector('h2.headers');
const modalEqBlock = document.querySelector(".info__modal__equipment__block");
const skillsContent = document.querySelector(".skills");

overlay.style.display = "none";

modalHeader.addEventListener('click', (e)=>{
    if (e.target.dataset.link) {
        window.open(e.target.dataset.link);
    }
})

overlay.addEventListener("click", event=>{
    if (event.target.dataset.close) {
        overlay.style.display = "none";
    }
})
closeBtn.addEventListener('click', (event)=>{
    if (event.target.dataset.close) {
        overlay.style.display = "none";
    }
});


// list.addEventListener('click', (e)=>{
//     openModal(e);
// })

// function openModal(e) {
//     let target = e.target.closest(".fetched__list__cell");

// }

const parent = document.querySelector('.fetched__list__block');
const filtersElem = document.querySelectorAll("select");
const filtersData = {
    "sort": "rariry",
    "index": "All",
    "faction": "All",
    "rarity": "All"
};
let dataCharacters;
let dataItems;

filtersElem.forEach((elem)=>{
    elem.addEventListener('change', sortCards)
})



function sortCards() {


    function changeOrder() {
        let sort = filtersData.sort

        if (sort === rarity) {
            currentCharactersList.sort(function(a, b) {
                return b.rarity - a.rarity;
            });

        } else if (sort === 'construction') {

            currentCharactersList.sort(function(a, b) {
                if (a.construction < b.construction) return 1
                if (a.construction > b.construction) return -1
                return 0
            })
        } else {
            currentCharactersList.sort(function(a, b) {
                return b.stats[sort] - a.stats[sort]
            })
        }
        
    }


    filtersData[this.name] = this.value;
    let currentCharactersList = [];
    for (let i=0; i<dataCharacters.length; i++) {
        let valid = true;
        if (!(dataCharacters[i].faction === filtersData.faction || filtersData.faction === 'All')) {
            valid = false;

        }
        if (!(dataCharacters[i].type === filtersData.index || filtersData.index === 'All' ||
         (filtersData.index === "Vanguard" && (dataCharacters[i].type === "CL" ||
         dataCharacters[i].type === "CA" || dataCharacters[i].type === "DD")) ||
         (filtersData.index === "Main" && (dataCharacters[i].type === "BB"
        || dataCharacters[i].type === "CV")))) {
            valid = false;
        }
        if (filtersData.sort === 'construction' && dataCharacters[i].construction === 'Research') {
            valid = false;
        }

        
        if (!(String(dataCharacters[i].rarity) === filtersData.rarity || filtersData.rarity === 'All')) {
            valid = false;
        }
        if (valid) {
            currentCharactersList.push(dataCharacters[i])

        }
    }
    
    changeOrder();

    //console.log("currentItemsList: ", currentItemsList);
    //console.log('currentCharactersList: ', currentCharactersList);
    //console.log('filtersData: ',filtersData);
    parent.innerHTML = "";
    const cards = renderCards(currentCharactersList);
    //console.log("cards: ", cards);
}

function renderCards(data) {
    
    let cards = [];
    for (let i = 0; i < data.length; i++) {
        let name = data[i].name;
        let src = String(data[i].id) + ".png";
        const card = new Card(parent, name, src, data[i])
        cards.push(card);
    }    
    return cards
}


function getData() {
    const wrapper = document.querySelector('.fetched__list__block');
    fetch('../data/characters/characters.json')
        .then((response)=>{
            if (response.ok) {
                return response.json();
            } else {
                throw new Error ('данные не получены ' + response.status);
            }
        })
        .then(data => {
            dataCharacters = data;
            
            
            fetch('../data/items/items.json')
            .then((response)=>{
                if (response.ok) {
                    return response.json()
                } else {
                    throw new Error ('Данные снаряжения не получены ' + response.status);
                }})
                .then(data => {
                    dataItems = data;
                    renderCards(dataCharacters, dataItems);
                })
                .catch(err=>{
                    console.warn(err);
                    list.innerHTML = `<div style="color:red"Бляздец ну короче все сайт сломался мы закрываемся, но чтобы починить нажми альт+ф4<hr>${err}</div>`;
                })


        }) 
        .catch(err => {
            console.warn(err);
            wrapper.innerHTML = `<div style="color:red"Бляздец ну короче все сайт сломался мы закрываемся, но чтобы починить нажми альт+ф4<hr>${err}</div>`
        });
    
        
}



getData();



class Card {
    constructor(parent, name, src, data) {
        Card.bind(this);
        this.parent = parent || undefined;
        this.name = name || undefined;
        this.src = String(src) || undefined;
        this.data = data || undefined;
        this.eq = data.eq || undefined;
        this.element = undefined;
        this.link = data.link || undefined;
        this.defSrc = './img/characters/';
        this.skills = data.skills || undefined;
        this.createCard();
    }


    createCard() {
        let color = "";
        if(this.data.rarity != 6) {
            color = "background: "+setColor(this.data.rarity);
        }
        
        let cardWrapper = document.createElement('div');
        cardWrapper.classList.add('fetched__list__cell-container')
        cardWrapper.setAttribute("data-id", this.id);
        let card = `
        <div class="fetched__list__cell">
                    <div style="${color}" class="fetched__list__cell__img__holder" data-type="">
                    <img src="${this.defSrc + this.src}" alt="" class="fethced__list__cell__img">
                    </div>
                    <p class="cell__name">${this.name}</p>
        </div>`
        cardWrapper.innerHTML = card;
        this.element = cardWrapper;
        this.element.addEventListener('click', ()=>{
            this.openModal()
        });
        this.parent.appendChild(cardWrapper);

    }

    createEl(type, cssClass) {
        const el = document.createElement(type);
        el.classList.add(cssClass);
        return el;
    }

    openModal() {
        const skills = this.skills;
        modalEqBlock.innerHTML = '';
        function createEl(type, cssClass) {
            const el = document.createElement(type);
            el.classList.add(cssClass);
            return el;
        }
        overlay.style.display = 'block';
        modalImg.src = this.defSrc + this.src;
        modalHeader.innerHTML = this.name;
        modalHeader.dataset.link = this.link;


        const eq = this.data.eq;

        for (let i=0; i<eq.length; i++) {
            let col = eq[i];
            let items = [];
            let category = col.category;
            for(let k=0; k<col.list.length; k++) {
                if (dataItems[category] != undefined) {
                    items.push(dataItems[category][col.list[k]])
                } else {
                    console.log("Тот самый ундефайнд", k);
                }
                
            }

            // Попробовать добавить отлов ошибок
            addEq(col, category, items)
        }

        if (skills != undefined) {
            skillsContent.innerHTML = "";
            let skCont = ``;
            for(let i=0; i<skills.length; i++) {
                skCont += getSkill(skills[i]);
            }
            skillsContent.innerHTML = skCont;
        } else {
            skillsContent.innerHTML = "Информация о умениях этого персонажа не найдена";
        }





        function getSkill(skillData) {
            return  `
                <div class="skill">
                    <div class="skill__head">
                        <img src="./img/skills/${skillData.src+".png"}" alt="" class="skill-img">
                        <div class="skill__text">
                            <p class="skill__index">${skillData.index}</p>
                            <p class="skill__title">${skillData.title}</p>
                            <div class="skill__buff">${skillData.buff}</div>
                        </div>
                    </div>
                    <div class="skill__description">
                    ${skillData.skill}
                    </div>
                </div>
            
            `;

        }


        function addEq(eqData, itemsCategory, itemsData) {

            
            const colHolder = createEl('div', 'info__modal__equipment__col');
            colHolder.addEventListener("click", (e)=>{
                if(e.target.dataset.link) {

                    window.open(e.target.dataset.link);
                }

            })

            let eqColumn = '';

            const f=itemsCategory.indexOf('_');
            let category = '';
            if (f>0) {
                 category =  itemsCategory.slice(0, f)+' '+itemsCategory.slice(f+1)
            } else { category = itemsCategory;}
            
            const eff = eqData.eff;
            eqColumn = `
            <h4 class="eq__header">${category}</h4>
            <hr>
            <div class="info__modal__equipment__head">${eff} eff</div>
            `

            for (let i = 0; i < itemsData.length; i++) {
                let color =  setColor(itemsData[i].rarity)
                eqColumn += `<img data-link="${itemsData[i].link}" style="background:${color}" src="${'./img/items/' + itemsCategory + '/' + itemsData[i].src + '.png'}" 
                class="info__modal__equipment-cell">`
            }
            colHolder.innerHTML = eqColumn;
            modalEqBlock.appendChild(colHolder);


        }


    }
}

function setColor(rarity) {

    switch (Number(rarity)) {
        case 5:
            return "#EEEE99";

        case 4:
            return "#C4ADFF";

        case 3:
            return "#9FE8FF";

    }
}
