document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('select');
    var instances = M.FormSelect.init(elems, '');
    
    loadNews();
    
});

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

    const apiKey = '193ebcc8ff02463597614d4b421a0bae';
    const url = 'https://news-api-v2.herokuapp.com';

    return {
        topHeadlines(country = 'belarus', cb) {
            objHttpMethods().get(`${url}/top-headlines?country=${country}&apiKey=${apiKey}`, cb)
        },
        everythings() {},
    } 
})();


// Новости при загрузке страницы
function loadNews () {
    newsService.topHeadlines('ru', renderResponse);
}


// обработка response 
function renderResponse (err, res){
    let articles = res.articles;
    let fragment = "";
    
    articles.forEach(itemRes => {
        fragment += processResponse(itemRes);
    });

    document.querySelector('.container_newsCard').insertAdjacentHTML('afterbegin', fragment);
    console.log(articles);
    // console.log(fragment);
}

// функция отрисовки response
    function processResponse ({author, description, publishedAt, title, url, urlToImage}) {
        return `
            <div class="row">
                <div class="col s12 m7">
                    <div class="card">
                        <div class="card-image">
                            <img src=${urlToImage}>
                            <span class="card-title">${title}</span>
                        </div>
                        <div class="card-content">
                            <p> ${description} </p>
                        </div>
                        <div class="card-action">
                            <a href="#">This is a link</a>
                        </div>
                    </div>
                </div>
            </div>
        `
    }
