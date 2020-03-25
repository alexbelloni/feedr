var _feedsJson = [], _feednames = [];

function updatePopUp(loader, hidden) {
    document.querySelector("#popUp").setAttribute("class", `${loader ? "loader" : ""} ${hidden ? "hidden" : ""}`);
    document.querySelector(".closePopUp").text = loader ? "" : "X";
}

document.querySelector(".closePopUp").addEventListener("click", () => updatePopUp(true, true));

function updateMessenger(message) {
    document.querySelector("#messenger-banner").innerText = message;
    document.querySelector(".messenger").setAttribute("class", !message ? "messenger close" : "messenger");
    document.querySelector(".main").setAttribute("class", !message ? "main container headerless" : "main container");
}

document.querySelector("#messenger-x").addEventListener("click", () => {
    updateMessenger();
});

function drawArticles(ArticleUI, feedsJson) {
    document.querySelector(".main").innerHTML = feedsJson.map((a, i) => ArticleUI.toHtml(a, i)).join("");
    document.querySelectorAll(".article").forEach(a => a.addEventListener("click", () => {
        const index = parseInt(a.getAttribute("index"));
        const feedJson = feedsJson[index];
        document.querySelector("#popUp h1").innerText = feedJson.title;
        document.querySelector("#popUp p").innerText = feedJson.text || feedJson.url;
        document.querySelector(".popUpAction").setAttribute("href", feedJson.url);
        document.querySelector(".closePopUp").setAttribute("href",`#art${parseInt(index)-1}`);
        updatePopUp(false, false);
    }));
}

function getFriendlyFeeds(feedsJson) {
    return feedsJson.filter(a => a.title.toLowerCase().indexOf("ck you") === -1);
}

window.addEventListener('load', () => {
    updatePopUp(true, false);
    import('./modules/articles.js').then((articles) => {        
        articles.getJson((feedsJson, feednames, errors) => {
            const message = errors.filter(e => e).map(e => `${e.feedname}: ${e.error} (${e.status})`).join(" | ");
            updateMessenger(message);
            _feedsJson = getFriendlyFeeds(feedsJson);
            _feednames = feednames;
            import('./modules/ArticleUI.js').then((ArticleUI) => {
                _ModuleArticleUI = ArticleUI;
                drawArticles(ArticleUI, _feedsJson);
                loadSearchTool(ArticleUI);
            })
        })
    })

    var _ModuleSearchTool = null;
    var _ModuleArticleUI = null;

    function search(sourcename) {
        updatePopUp(true, false);
        const filteredJson = _ModuleSearchTool.ALL === sourcename ? _feedsJson : _feedsJson.filter(f => f.feedname === sourcename);
        drawArticles(_ModuleArticleUI, filteredJson);
        updatePopUp(true, true);
    }

    function loadSearchTool(ArticleUI) {
        import('./modules/SearchToolUI.js').then((ModuleSearchToolUI) => {
            _ModuleSearchTool = ModuleSearchToolUI.SearchToolUI;
            document.querySelector("#newSource").innerHTML = _ModuleSearchTool.getHtml(_feednames);
            _ModuleSearchTool.initialize(search);
            updatePopUp(true, true);
            document.querySelector("#logo").addEventListener("click", () => { search(_ModuleSearchTool.ALL) })
        })
    }
})