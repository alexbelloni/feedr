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
    function createErrorMessage(feedname, status, error) {
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

function createTestFeedArray(callback) {
    import("./articles_test.js").then(module => {
        const feeds = module.default();
        callback("test", feeds, null);
    })
}

function getJson(callback) {
    const feedPromises = [];

    //Array of functions to get feeds from news sources
    const functionArray = [
        createLaravelNewsFeedArray, createRedditFeedArray, createNasaFeedArray, createGeneralFeedArray,
        //createTestFeedArray
    ];

    //Configure all functions as promises
    functionArray.forEach(promiseFnc => {
        feedPromises.push(new Promise((resolve, reject) => {
            promiseFnc((feedname, feeds, error) => {
                resolve({ feedname, feeds, error });
            })
        }));
    })

    //Execute all promises
    Promise.all(feedPromises).then(allPromises => {
        //Add new group of feeds to an accumulate array
        function addNew(accumulate, newFeeds) {
            const acc = accumulate || { feeds: [], feednames: [], errors: [] };
            acc.feeds = acc.feeds.concat(newFeeds.feeds);
            acc.feednames.push(newFeeds.feedname);
            acc.errors.push(newFeeds.error);
            return acc;
        }

        let all = null;
        allPromises.forEach(p => {
            all = addNew(all, p);
        })

        //Sort the final feeds array by date
        all.feeds.sort((a, b) => (a.date < b.date) ? 1 : -1);

        //Return json object to origin
        callback(all.feeds, all.feednames, all.errors);
    })
}

export { getResponse, getJson }