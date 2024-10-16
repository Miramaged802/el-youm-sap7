function setTime() {
    let date = new Date();
    let dayIndex = date.getDay();
    let days = ['الأحد', 'الأثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    document.getElementById('day').innerText = days[dayIndex];
    let day = date.getDate().toString();
    if (day.length == 1)
        day = '0' + day;
    document.getElementById('dayNum').innerText = day;
    let monthIndex = date.getMonth();
    let months = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"]
    document.getElementById('month').innerText = months[monthIndex];
    let year = date.getFullYear();
    document.getElementById('year').innerText = year;
    let miunte = date.getMinutes();
    if (miunte < 10)
        miunte = '0' + miunte;
    document.getElementById('minute').innerText = miunte;
    let hour = date.getHours();
    let val;
    if (hour >= 12) {
        val = 'م';
        if (hour != 12) {
            hour -= 12;
            if (hour < 10)
                hour = '0' + hour;
        }
    }
    else
        val = 'ص';
    document.getElementById('hour').innerText = hour;
    document.getElementById('p/a').innerText = val;
}

setTime();
setInterval(setTime, 1000);

function disableAllNews() {
    for (let i = 1; i <= 4; i++) {
        document.getElementsByClassName(`News${i}`)[0].style.backgroundColor = '#444444';
    }
}

function showNews(ind) {
    disableAllNews();
    currentNews = ind;
    document.getElementsByClassName(`News${ind}`)[0].style.backgroundColor = '#DE2323';
    fetch('news.json')
    .then((response) => response.json())
    .then((data) => {
        let newsText = [""];
        let newsPhotos = [""];
        let id;
        data.map((news) => {
            if (news.topNewsSlider) {
                document.querySelector(`.News${newsText.length} P`).innerText = news.title;
                if (ind == newsText.length)
                    id = news.ID;
                newsText.push(news.overview);
                newsPhotos.push(news.photo);
            }
        })
        document.getElementById('newsPhoto').src = `images/${newsPhotos[ind]}`;
        document.getElementById('newsText').innerText = newsText[ind];
        document.querySelector('.newsArea').onclick = newsModel(id);
    })
}

let currentNews = 0;

function autoSwitchNews() {
    currentNews++;
    if (currentNews == 5)
        currentNews = 1;
    showNews(currentNews);
}

autoSwitchNews();
// let topNewsInterval = setInterval(autoSwitchNews, 5000);

function disableAllImageBtn() {
    for (let i = 1; i <= 13; ++i) {
        document.getElementById(`imageBtn${i}`).style.backgroundColor = '#383838';
    }
    document.getElementsByClassName('rightFlex')[0].innerHTML = '';
    document.getElementsByClassName('leftFlex')[0].innerHTML = '';
}

function showImage(ind) {
    disableAllImageBtn();

    fetch('news.json')
    .then((response) => response.json())
    .then((data) => {
        let imageText = [""];
        let imageSrc = [""];
        let id;
        data.map((news) => {
            if (news.imageSlider) {
                if (imageText.length == ind)
                    id = news.ID;
                imageText.push(news.title);
                imageSrc.push(news.photo);
            }
        })
        currentImage = ind;
        document.getElementById(`imageBtn${ind}`).style.backgroundColor = '#C31E1E';
        document.getElementsByClassName('currentImage')[0].innerHTML =
        `
            <div class="topImageContainer" data-bs-toggle="modal" data-bs-target="#newsModal" onclick="newsModel(${id})">
                <img src="images/${imageSrc[ind]}" class="rounded">
                <div class="imageNum">
                    <p>${ind}</p>
                </div>
            </div>
        `;
        document.getElementById('imageTitle').innerText = imageText[ind];
        let up = true;
        if (ind > 7) {
            ind -= 6;
            up = false;
        }
        for (let i = 1; i < ind; ++i) {
            document.getElementsByClassName('rightFlex')[0].innerHTML +=
            `
                <div class="imageContainer">
                    <img src="images/${imageSrc[i]}" class="rounded" onclick='showImage(${i})'>
                    <div class="imageNum">
                        <p>${i}</p>
                    </div>
                </div>
            `;
            document.getElementsByClassName('rightFlex')[0].innerHTML +=
            `
                <div class="imageContainer">
                    <img src="images/${imageSrc[i + ((up) ? 7 : 6)]}" class="rounded" onclick='showImage(${i + ((up) ? 7 : 6)})'>
                    <div class="imageNum">
                        <p>${i + ((up) ? 7 : 6)}</p>
                    </div>
                </div>
            `;
        }
        for (let i = ((up) ? ind + 1 : ind); i <= ((up) ? 7 : 6); ++i) {

            document.getElementsByClassName('leftFlex')[0].innerHTML +=
            `
                <div class="imageContainer">
                    <img src="images/${imageSrc[i]}" class="rounded" onclick='showImage(${i})'>
                    <div class="imageNum">
                        <p>${i}</p>
                    </div>
                </div>
            `;

            document.getElementsByClassName('leftFlex')[0].innerHTML +=
            `
                <div class="imageContainer">
                    <img src="images/${imageSrc[i + ((up) ? 6 : 7)]}" class="rounded" onclick='showImage(${i + ((up) ? 6 : 7)})'>
                    <div class="imageNum">
                        <p>${i + ((up) ? 6 : 7)}</p>
                    </div>
                </div>
            `;
        }
    })
}

let currentImage = 0;

function autoSwitchImages() {
    currentImage++;
    if (currentImage == 14)
        currentImage = 1;
    showImage(currentImage);
}

autoSwitchImages();
// let imagesInterval = setInterval(autoSwitchImages, 5000);

function initialNews() {
    fetch('news.json')
    .then((response) => response.json())
    .then((data) => {
        data.map((news) => {
            let paragraphClass = (news.highlighted) ? "highlighted" : "normal";
            let card = `
                <div class="cardContainer" data-bs-toggle="modal" data-bs-target="#newsModal" onclick="newsModel(${news.ID})">
                    <img src="images/${news.photo}">
                    <p class="${paragraphClass}">${news.title}</p>
                </div>
            `;
            document.getElementById(`${news.category}Section`).innerHTML += card;
            if (news.ticker) {
                let listItem = `
                    <li class="news" data-bs-toggle="modal" data-bs-target="#newsModal" onclick="newsModel(${news.ID})">
                        <p class="news__title">${news.title}</p>
                    </li>
                `;
                document.querySelector('.ticker .news-list').innerHTML += listItem;
            }
        })
    })
}
initialNews();

document.getElementById('searchBtn').addEventListener('click', () => {
    let val = document.getElementById('searchBar').value;
    if (val == "") {
        location.reload();
    }
    else {
        document.getElementById('mainContent').innerHTML = "";
        let div = document.createElement('div');
        div.className = "searchResults";
        fetch('news.json')
        .then((response) => response.json())
        .then((data) => {
            data.map((news) => {
                if (checkMatch(news, val)) {
                    let result = `
                        <div class="searchResult">
                            <img src="images/${news.photo}">
                            <div class="searchResultInfo">
                                <p class="resultCategory">${news.categoryArabic}</p>
                                <p class="resultTitle" data-bs-toggle="modal" data-bs-target="#newsModal" onclick="newsModel(${news.ID})">${news.title}</p>
                                <p class="resultOverview">${news.overview}</p>
                            </div>
                        </div>
                    `;
                    div.innerHTML += result;
                }
            })
        })
        document.getElementById('mainContent').appendChild(div);
    }
})

function checkMatch(data, text) {
    if (data.title.includes(text))
        return true;
    if (data.overview.includes(text))
        return true;
    for (let i = 0; i < data.details.length; ++i) {
        if (data.details[i].includes(text))
            return true;
    }
    return false;
}

function newsModel(id) {
    fetch('news.json')
    .then((response) => response.json())
    .then((data) => {
        data.map((news) => {
            if (news.ID == id) {
                document.querySelector('.modal-title').innerText = news.title;
                let body = document.querySelector('.modal-body');
                body.innerHTML = "";
                let img = document.createElement('img');
                img.src = `images/${news.photo}`;
                body.appendChild(img);
                let details = document.createElement('div');
                details.className = "detailsContent";
                for (let i = 0; i < news.details.length; ++i) {
                    let p = `
                        <p>${news.details[i]}</p>
                    `;
                    details.innerHTML += p;
                }
                body.appendChild(details);
            }
        })
    })
}