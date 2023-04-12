//parent
const parent1 = document.querySelector('.news__block');

class NewsTable {
    constructor(parent, dataLink) {
        NewsTable.bind(this);
        this.parent = parent;
        this.dataLinc = dataLink;
        this.newsData = undefined;
        this.table = undefined;

        fetch(dataLink)
        .then((response)=>{
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Данные о новостях не получены: " + response.status);
            }
        })
        .then((data)=> {
            this.newsData = data;
            console.log(this.newsData);
            this.init();
        })
        .catch((err)=> {
            console.warn(err);
        })
    }

    renderNews() {
        let newsCount = 1;
        const newsCollection = [];
        // if (this.newsData.length > newsCount) {
        //     newsCount = this.newsData.length;
        // }

        for(let i = 0; i<newsCount; i++) {
            const news = new News(this.newsData[i])
            newsCollection.push(news);
            this.table.appendChild(news.getNews());
        }
    }

    init() {
        this.table = document.createElement('div');
        this.table.classList.add("news__table");
        this.parent.appendChild(this.table);
        this.renderNews();
    }
}

class News {
    constructor(data) {
        this.title = data.title;
        this.date = data.date;
        this.message = data.message;
        this.label = data.label;
        this.src = data.src;
        this.name = data.name;
        this.init();
        console.log('new');
    }

    addListener() {
        this.news.addEventListener("click", (event)=>{
            window.location = window.location.origin+"/news/"+this.date.year+"/"+this.date.month+"/"+this.name+'.html';
        })
    }

    createNews() {
        let month = dateList[this.date.month+1];
        let color = "#BE4D4D";
        if (this.label == "update") color = "#4D95BE";

        let content = `
        <div class="news__date">${month + " " + this.date.day}</div>
                <div style="background-image: url(${
                    '../img/news/'+this.src+'.png'
                })" class="news__content">
                    
                    <div class="news__content__wrapper">
                        <h5 class="news__title">${this.title}</h5>
                        <p class="news__message">${this.message}</p>
                    </div>
                    
                    <div style="background-color: ${color}" class="news__label">EVENT</div>

                    <div class="news__overlay">
                        <div class="news__btn">Подробнее</div>
                    </div>
                </div>
        `;
        this.news.innerHTML = content;

    }

    getNews() {
        return(this.news);
    }

    init() {
        this.news = document.createElement('div');
        this.news.classList.add("news");
        this.createNews();
        this.addListener();
    }
}

const dateList = [
    "Jan", "Feb", "Mar", "Apr","May", "June", "July", "Aug","Sep", "Oct", "Nov", "Dec"
];


const nowDate = new Date().getUTCFullYear();
const newsTable = new NewsTable(parent1, '../data/news/'+nowDate+'/news.json')