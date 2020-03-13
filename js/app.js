var _feedsJson = [], _feednames = [];

function updatePopUp(loader, hidden) {
  document.querySelector("#popUp").setAttribute("class", `${loader ? "loader" : ""} ${hidden ? "hidden" : ""}`);
  document.querySelector(".closePopUp").text = loader ? "" : "X";
}

document.querySelector(".closePopUp").addEventListener("click", () => updatePopUp(true, true));

function drawArticles(ArticleUI, feedsJson) {
  document.querySelector("#main").innerHTML = feedsJson.map((a, i) => ArticleUI.toHtml(a, i)).join("");
  document.querySelectorAll(".article").forEach(a => a.addEventListener("click", () => {
    const index = parseInt(a.getAttribute("index"));
    document.querySelector("#popUp h1").innerText = feedsJson[index].title;
    document.querySelector("#popUp p").innerText = feedsJson[index].text || feedsJson[index].url;
    document.querySelector(".popUpAction").setAttribute("href", feedsJson[index].url);
    updatePopUp(false, false);
  }));
}

window.addEventListener('load', () => {
  updatePopUp(true, false);
  import('./modules/articles.js').then((articles) => {
    articles.getJson((feedsJson, feednames, errors) => {
      document.querySelector("#error").innerText = errors.filter(e => e).map(e => `${e.feedname}: ${e.error} (${e.status})`);
      _feedsJson = feedsJson;
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