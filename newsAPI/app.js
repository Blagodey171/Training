const apiKey = '193ebcc8ff02463597614d4b421a0bae';
const url = 'https://news-api-v2.herokuapp.com';
const form = document.forms['searchNews'];
const selectCountry = form.elements['selectOfCountry'];
const selectCategory = form.elements['selectOfCategory'];
const inputValue = document.getElementById('search');
const containerNews = document.getElementById('container_newsCard');

document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('select');
    var instances = M.FormSelect.init(elems, '');
    
    loadNews(selectCountry.value, inputValue.value, selectCategory.value);
    

});

form.addEventListener('submit', (e) => {
    e.preventDefault();

    clearNewsContainer(containerNews);

    loadNews(selectCountry.value, inputValue.value, selectCategory.value);
})

// методы для новостей Top Headlines and Everythings
const newsService = (function () {
    function objHttpMethods() {
        return {
            get(url, cb) {
                try {
                    const xhr = new XMLHttpRequest();
                    xhr.open('get', url);
    
                    xhr.addEventListener('load', () => {
                        if (Math.floor(xhr.status / 100 !== 2)) {
                            cb(`Error. status code: ${xhr.status}`, xhr)
                            return;
                        }
                        const response = JSON.parse(xhr.responseText);
                        cb(null, response);
                    })
    
                    xhr.addEventListener('error', () => {
                        console.log('error')
                    })
    
                    xhr.send();
                } catch (error) {
                    console.log(error)
                    cb(error);
                }
            },
            post(url, body, headers, cb) {
                try {
                    const xhr = new XMLHttpRequest();
                    xhr.open('post', url);
    
                    xhr.addEventListener('load', () => {
                        if (Math.floor(xhr.status / 100 !== 2)) {
                            cb(`Error. status code: ${xhr.status}`, xhr)
                            return;
                        }
                        const response = JSON.parse(xhr.responseText);
                        cb(null, response);
                    })
    
                    if (headers) {
                        Object.entries(headers).forEach(([key, value]) => {
                            xhr.setRequestHeader(key, value);
                        });
    
                    }
    
                    xhr.addEventListener('error', () => {
                        console.log('error')
                    })
    
                    xhr.send(JSON.stringify(body));
                } catch (error) {
                    cb(error);
                }
    
            },
        }
    };
    
    return {
        topHeadlines(country = 'us', category, cb) {
            objHttpMethods().get(`${url}/top-headlines?country=${country}&category=${category}&apiKey=${apiKey}`, cb)
        },
        everythings(searchParam, cb) {
            // debugger
            if (searchParam) {
                objHttpMethods().get(`${url}/everything?q=${searchParam}&apiKey=${apiKey}`, cb)
            } else objHttpMethods().get(`${url}/everything?q=random&apiKey=${apiKey}`, cb)
            
        },
    } 
})();

// очищение контейнера при поиске/выборе другой страны
function clearNewsContainer (container) {
    container.innerHTML = '';
};
// Новости при загрузке страницы
function loadNews (country, searchParam, category) {
    // debugger;
    if (searchParam) {
        newsService.everythings(searchParam, renderResponse);
    } else {
        newsService.topHeadlines(country, category, renderResponse);
    }
};

// перебор/обработка response 
function renderResponse (err, res){
    let articles = res.articles;
    let fragment = "";

    if (err) {
        // Toasts
        M.toast({html: err, displayLength: '5000'})
        // console.log(err, res);
        return;
    }

    if (!articles.length) {
        // если неправильный запрос
        M.toast({html: 'Некорректная строка поиска', displayLength: '5000'});
        
    }
    
    articles.forEach(itemRes => {
        fragment += processResponse(itemRes);
    });

    document.querySelector('.container_newsCard').insertAdjacentHTML('afterbegin', fragment);
    console.log(articles);
};

// функция отрисовки response
function processResponse ({author, description, publishedAt, title, url, urlToImage}) {
    if (urlToImage === null) {
        return `
         <div class="row"  id="row">
            <div class="col s12 m7" style="margin:0 auto;padding: 0">
                 <div class="card">
                    <div class="card-image">
                        <img src="News.jpg">
                        <span class="card-title">${title}</span>
                    </div>
                    <div class="card-content">
                         <p> ${description} </p>
                    </div>
                    <div class="card-action">
                        <a href="${url}">This is a link</a>
                    </div>
                </div>
            </div>
        </div>
     `
    }
    return `
         <div class="row"  id="row">
            <div class="col s12 m7" style="margin:0 auto;padding: 0">
                 <div class="card">
                    <div class="card-image">
                        <img src=${urlToImage}>
                        <span class="card-title">${title}</span>
                    </div>
                    <div class="card-content">
                         <p> ${description} </p>
                    </div>
                    <div class="card-action">
                        <a href="${url}">This is a link</a>
                    </div>
                </div>
            </div>
        </div>
     `
};
