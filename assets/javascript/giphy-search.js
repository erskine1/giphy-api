
var topics = ["cats", "world of warcraft", "morrowind", "elder scrolls"];

// FUNCTIONS 

function makeQuery() {
  var queryURL = "https://api.giphy.com/v1/gifs/search?";
  var queryObj = { 'api_key': 'a3QowM2E88r1FVgLspmDLfXOa4GlRWXV' };
  queryObj.q = $('#search-term').val().trim();
  queryObj.limit = 10;

  $('#search-term').val('');
  console.log("---------------\nURL: " + queryURL + "\n---------------")
  console.log(queryURL + $.param(queryObj));
  return queryURL + $.param(queryObj); 
}

function makeButtons() {
  $('#search-buttons').empty();
  for (var i = 0; i < topics.length; i++) {
    var a = $('<button>');
    a.attr('class', 'gif-btn btn btn-secondary');
    tempID = topics[i].split(' ').slice(-1);
    a.attr('id', `${tempID}-id`);
    a.text(topics[i]);
    $('#search-buttons').append(a);
  }
}

function makeGifs(giphyData) {
  console.log(giphyData);
  console.log(giphyData.data.length);
  for (var i = 0; i < giphyData.data.length; i++) {
    var image = $('<img>');
    var animate = giphyData.data[i].images.fixed_height.url;
    var still = giphyData.data[i].images.fixed_height_still.url;
    image.attr('data-animate', animate);
    image.attr('data-still', still);
    image.attr('src', still);
    image.attr('data-state', 'still');
    image.attr('class', 'gif img-fluid');

    var gifInfo = $('<div>');
    gifInfo.attr('class', 'gifInfo')
    var rating = giphyData.data[i].rating;
    gifInfo.text(`rating: ${rating}`);
    image.append(gifInfo);
    $('#gifs-box').append(image);



  }
}

function clearImages() {
  $('#gifs-box').empty();
}

// EVENT HANDLERS

$('#gifs-box').on('click', '.gif', function() {
  var state = $(this).attr('data-state');

  if (state === 'still') {
    var animate = $(this).attr(`data-animate`);
    $(this).attr('src', animate);
    $(this).attr('data-state', 'animate');
  }
  else if (state === 'animate') {
    var still = $(this).attr('data-still');
    $(this).attr('src', still);
    $(this).attr('data-state', 'still');
  }
});


$('#search').on('click', function(event) {
  event.preventDefault();
  var search = $('#search-term').val().trim(); 
  // stop if search is empty
  if (search === '') {
    return false;
  }
  // if search is already in array, delete old
  var searchIndex = topics.indexOf(search); 
  if (searchIndex >= 0) {
    topics.splice(searchIndex, 1);
  }
  // add search to array
  topics.push(search);

  makeButtons();
  $('#search-term').val('');
  $(`#${tempID}-id`).click();
});

$(document).on('click', '.gif-btn', function(event) {
  var selected = $(`#${this.id}`).text()
  clearImages(); 

  $('#search-term').val(selected);
  var queryURL = makeQuery();

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(makeGifs);
});

makeButtons(); 

