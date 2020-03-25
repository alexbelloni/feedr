function getResponse(url, loadEvent) {
    const obj = new XMLHttpRequest();
    obj.addEventListener('load', loadEvent)
    obj.addEventListener('error', loadEvent)
    obj.open("GET", url);
    obj.send();
}

function createFeedArray(feedname, url, withCors, onlineConverter, getChildrenStructure, itemToArticleJson, callback) {
    function getDomain(url) {
        let _url = url
        const doubleDashIndex = url.indexOf("//")
        if (doubleDashIndex >= 0) {
            _url = url.substring(doubleDashIndex + 2);
        }
        const simpleDashIndex = _url.indexOf("/")
        if (simpleDashIndex >= 0) {
            _url = _url.substring(0, simpleDashIndex);
        }
        return _url;
    }
    function toJson(response) {
        const r = getChildrenStructure(JSON.parse(response)).map(a => {
            const article = itemToArticleJson(a);
            return { ...article, icon: `http://s2.googleusercontent.com/s2/favicons?domain=${getDomain(article.icon || article.url)}`, }
        })
        return r;
    }
    function createErrorMessage(feedname, status, error){
        return { feedname, status, error: error || "unknowned" }
    }
    const _url = onlineConverter ? `https://api.rss2json.com/v1/api.json?rss_url=${url}` : url;
    getResponse(withCors ? `https://cors-anywhere.herokuapp.com/${_url}` : _url, event => {
        const success = event && event.target.status === 200;
        const jsonObj = success ? toJson(event.target.response) : [];
        callback(feedname, jsonObj, !success && createErrorMessage(feedname, event.target.status, event.target.statusText));
    });
}

const IMAGE_DEFAULT = "https://ya-webdesign.com/transparent600_/dodgeball-vector-dodge-ball-14.png";

function createRedditFeedArray(callback) {
    function getThumbnail(url) {
        return ["default", "self"].indexOf(url) >= 0 ? "" : url;
    }
    const feedname = "Reddit";
    createFeedArray(feedname, "https://www.reddit.com/top.json", false, false, response => response.data.children, a => {
        return {
            feedname,
            title: a.data.title,
            impressions: a.data.total_awards_received,
            image: getThumbnail(a.data.thumbnail) || IMAGE_DEFAULT,
            url: a.data.url,
            category: a.data.subreddit || (a.data.is_video && "video") || "uncategorized",
            date: new Date(parseInt(a.data.created_utc) * 1000),
            text: a.data.link_flair_text,
            icon: a.data.url.indexOf("redd.it") >= 0 ? "reddit.com" : a.data.url
        }
    }, callback);
}

function createLaravelNewsFeedArray(callback) {
    const feedname = "Laravel News";
    createFeedArray(feedname, "https://laravel-news.com/feed/json", true, false, response => response.items, a => {
        return {
            feedname,
            title: a.title,
            impressions: 0,
            image: a.image,
            url: a.url,
            category: a.tags && a.tags.length > 0 ? a.tags[0] : "topnews",
            date: new Date(a.date_published),
            text: a.content_html
        }
    }, callback);
}

function createNasaFeedArray(callback) {
    const feedname = "NASA";
    createFeedArray(feedname, "https://www.nasa.gov/rss/dyn/breaking_news.rss", false, true, response => response.items, a => {
        return {
            feedname,
            title: a.title,
            impressions: 0,
            image: (a.enclosure && a.enclosure.link) || IMAGE_DEFAULT,
            url: a.link,
            category: "breaking news",
            date: new Date(a.pubDate),
            text: a.content
        }
    }, callback);
}

function createGeneralFeedArray(callback) {
    const feedname = "General";
    createFeedArray(feedname, "http://newsapi.org/v2/top-headlines?country=us&apiKey=555047ed3389431f827521b5df180ac1",
        false, false, response => response.articles, a => {
            return {
                feedname,
                title: a.title,
                impressions: 0,
                image: (a.urlToImage) || IMAGE_DEFAULT,
                url: a.url,
                category: a.source.name,
                date: new Date(a.publishedAt),
                text: a.description
            }
        }, callback);
}

function getJson(callback) {
    // import("./articles_test.js").then(module => {
    //     const feeds = module.default();
    //     callback(feeds, ["source1", "source2", "source3"], []);
    // })

    // callback([], ["test"], [{feedname: "Reddit",
    // status: 0,
    // error: "unknowned"}]);

    // createRedditFeedArray((f1, e1, error1) => {
    //     const feeds = e1;
    //     feeds.sort((a, b) => (a.date < b.date) ? 1 : -1);
    //     callback(feeds, [f1], [error1]);
    // })

    createLaravelNewsFeedArray((f1, e1, error1) => {
        createRedditFeedArray((f2, e2, error2) => {
            createNasaFeedArray((f3, e3, error3) => {
                createGeneralFeedArray((f4, e4, error4) => {
                    const feeds = e1.concat(e2, e3, e4);
                    feeds.sort((a, b) => (a.date < b.date) ? 1 : -1);
                    callback(feeds, [f1, f2, f3, f4], [error1, error2, error3, error4]);
                })
            })
        })
    })
}

export { getResponse, getJson }