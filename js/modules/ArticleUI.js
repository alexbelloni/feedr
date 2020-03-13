export function toHtml(article, index) {
  function formattedNumber(number){
    return number.toString().padStart(2,"0");
  }
  return `
    <article class="article" index="${index}">
      <section class="featuredImage">
        <img src="${article.image || "images/article_placeholder_1.jpg"}" alt="" />
      </section>
      <section class="articleContent">
        <a href="#">
          <h3>${article.title || "title"}</h3>
        </a>
        <h6>${article.feedname} | ${article.category || "category"} | ${`${formattedNumber(article.date.getDate())}-${formattedNumber(article.date.getMonth()+1)}-${article.date.getFullYear()}`}</h6>
      </section>
      <section class="impressions">
      ${article.impressions || "0"}
      </section>
      <div class="clearfix"></div>
    </article>
`;
}