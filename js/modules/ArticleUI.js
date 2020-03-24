export function toHtml(article, index) {
  function formattedNumber(number){
    return number.toString().padStart(2,"0");
  } 
  if(typeof article.date === "string"){
    article.date = new Date(article.date);
  }
  return `
  <a href="#">
    <article id="art${index}" class="article" index="${index}">
      <section class="featuredImage">
        <img src="${article.image || "images/article_placeholder_1.jpg"}" alt="" />
      </section>
      <section class="articleContent">
        <span class="title">${article.title || "title"}</span>
        <div><span class="name">${article.feedname}</span> <img src="${article.icon}"/> <span class="category">${article.category || "category"}</span></div>
        <span class="date">${`${formattedNumber(article.date.getDate())}-${formattedNumber(article.date.getMonth()+1)}-${article.date.getFullYear()}`}</span>
      </section>
      <div class="clearfix"></div>
    </article>
    </a>
`;
}