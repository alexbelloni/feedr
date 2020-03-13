const _SearchToolUI = () => {
    const _all = "Everything";
    function getHtml(feednames) {
        if (!feednames || feednames.length === 0) return "<div></div>";
        return `
        <div>
        <ul>
            <li><a href="#">News Source: <span id="selected">${_all}</span></a>
                <ul>
                ${feednames.concat([_all]).map(a => {
                    return `<li><a href="#" class="source">${a}</a></li>`
                }).sort().join("")}
                </ul>
            </li>
        </ul>
        <section id="search">
            <input type="text" name="name" value="">
            <a href="#"><img src="images/search.png" alt="" /></a>
        </section>
        </div>            
        `
    }
    function initialize(searchClick) {
        document.querySelectorAll(".source").forEach(s => s.addEventListener("click", () => setSelected(s.text)));     
        document.querySelector("#search").addEventListener("click", () => {searchClick(document.querySelector("#selected").innerText)});     
    }
    function setSelected(sourcename) {
        document.querySelector("#selected").innerText = sourcename;      
    }
    return {
        getHtml,
        initialize,
        setSelected,
        ALL: _all
    }
}

const SearchToolUI = _SearchToolUI();

export { SearchToolUI };

