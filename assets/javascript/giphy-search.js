
var gifList = ["cats", "world of warcraft", "morrowind", "elder scrolls"];

// FUNCTIONS 

function makeQuery() {
  // build the query URL with url, api key, + search
  var queryURL = "https://api.giphy.com/v1/gifs/search?";
  // a3QowM2E88r1FVgLspmDLfXOa4GlRWXV
  var queryObj = { 'api_key': 'a3QowM2E88r1FVgLspmDLfXOa4GlRWXV' };
  queryObj.q = $('#search-term').val().trim();
  queryObj.limit = 50;
  // &q=&limit=25&offset=0&rating=G&lang=en
  $('#search-term').val('');
  console.log("---------------\nURL: " + queryURL + "\n---------------")
  console.log(queryURL + $.param(queryObj));
  return queryURL + $.param(queryObj); 
}

function makeButtons() {
  $('#search-buttons').empty();
  // loop through array of search terms to update the buttons
  for (var i = 0; i < gifList.length; i++) {
    var a = $('<button>');
    // add class for button when user clicks
    // a.addClass('gif')
    a.attr('class', 'gif btn btn-secondary');
    // add ID for search button to click on search
    // so it doesn't click all buttons
    tempID = gifList[i].split(' ').slice(-1);
    a.attr('id', `${tempID}-id`);
    // data 
    // a.attr('data-name', gifList[i]);
    a.text(gifList[i]);
    $('#search-buttons').append(a);
  }
}

function makeGifs(giphyData) {
  console.log(giphyData);
  console.log(giphyData.data.length);
  for (var i = 0; i < giphyData.data.length; i++) {
    var image = $('<img>');
    image.attr('src', giphyData.data[i].images.fixed_height.url);
    image.attr('class', 'img-fluid');
    $('#gifs-box').append(image);
  }
}

function clearImages() {
  $('#gifs-box').empty();
}

// EVENT HANDLERS

// do search  > ajax request
// add button 

$('#search').on('click', function(event) {
  event.preventDefault();
  // get input from search text
  var search = $('#search-term').val().trim(); 
  // stop if search is empty
  if (search === '') {
    return false;
  }
  // add it to array
  var searchIndex = gifList.indexOf(search); 
  if (searchIndex >= 0) {
    gifList.splice(searchIndex, 1);
  }
  // should check if it is already in the array
  // if it is, remove it from the array and continue

  gifList.push(search);
  // call function for rendering the array of buttons
  makeButtons();
  // empty the text field
  $('#search-term').val('');
  // click the button (ONLY THE ONE BUTTON)
  $(`#${tempID}-id`).click();
  // function to clear the ID of the button just loaded
  // to prevent duplicate ID's from existing 
  // and since we only need to use it once
});

$(document).on('click', '.gif', function(event) {
  console.log(this.id + ' Clicked!');
  var selected = $(`#${this.id}`).text()
  // console.log($(`#${this.id}`).text()); 
  // $(this).removeAttr('id'); 
  clearImages(); 

  $('#search-term').val(selected);
  var queryURL = makeQuery();

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(makeGifs);
});

makeButtons(); 

