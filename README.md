# Feedr, a feed reader

[![Netlify Status](https://api.netlify.com/api/v1/badges/3523925d-f136-4cdf-b7ce-4fdc41117747/deploy-status)](https://app.netlify.com/sites/feedreader/deploys)  

Feedr is a feed reader, which shows headlines of articles from news sources on a ordered list.  
JavaScript and JQuery  

[Site](https://feedreader.netlify.com)

Project description: build a simple, single-page application that consumes data from an open, third-party API  
-> SPA consuming feeds and a news API

## Project's Technical Requirements

### Feed requirements
✔ Each article must provide an image source for the circular thumbnail at the
  left of the article.  
✔ Must provide either a category, tag, or custom taxonomy to display below the
  title (of course title of article is also required).  
✔ Must provide a point, ranking, or some type of total impressions for the
  respective article.  
✔ Must provide either a full version or a summary of the article for the pop up
  screen.  

### Feed rules

✔  When the application first loads display the loading container (see below on
  instructions to toggle this). When you successfully retrieve information from
  the default API hide the loader and replace the content of the `#main`
  container with that of the API. The DOM structure of each article must adhere
  to the `.article` structure.  
✔  When the user selects an article's title show the `#popUp` overlay. The
  content of the article must be inserted in the `.container` class inside
  `#popUp`. Make sure you remove the `.loader` class when toggling the article
  information in the pop-up.  
✔  Change the link of the "Read more from source" button to that of the
  respective article.  
✔  When the user selects a source from the dropdown menu on the header, replace
  the content of the page with articles from the newly selected source. Display
  the loading pop up when the user first selects the new source, and hide it on
  success.  
✔  Add an error message (either alert or a notification on the page) if the app
  cannot load from the selected feed.

### Additional UI interaction rules

✔  When the app is first loading and when the user selects to load a new feed
  from the dropdown, display the `#popUp` container with the `.loader` class.
  You can toggle the `.hidden` class from the container to display/hide the
  overlay container.  
✔  Add functionality to hide the pop-up when user selects the "X" button on the
  pop-up.  
✔  Clicking/tapping the "Feedr" logo will display the main/default feed.  
✔  Merge all feeds into one main feed in chronological order for the initial
   view. When the user clicks/taps the "Feedr" logo at the top, they should be
   return to this feed. This will be the new "home view."


## Technical hurdles and new knowledge
### Hurdles
It's hard finding news feeds in Json format  
Some news sources blocked me because of CORS issue 
### New things 
Review how to use JavaScript modules
Added a rss-to-json online converter to receive some feeds


## References

NewsAPI: http://newsapi.org  
Feeds: nasa.gov laravel-news.com reddit.com  
Netlify: https://netlify.com  
Alex's website: https://alexandrebelloni.com  

