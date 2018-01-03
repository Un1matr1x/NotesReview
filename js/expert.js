const x2js = new X2JS();

$(document).ready(function() {
  $('.modal').modal();

  $('#search').click(function() {
    query();
  });

  $('#map-view').click(function() {
    window.open("https://ent8r.github.io/NotesReview/?query=" + $('#query').val() + "&limit=" + $('#limit').val());
  });

  $(document).keypress(function(e) {
    if (e.which == 13) {
      query();
    }
  });
});

init();

function init() {
  const url = new URL(window.location.href);
  const query = url.searchParams.get('query');
  const limit = url.searchParams.get('limit');
  if (query) $('#query').val(query);
  if (limit) $('#limit').val(limit);
  if (query || limit) {
    const uri = window.location.toString();
    if (uri.indexOf('?') > 0) {
      window.history.replaceState({}, document.title, uri.substring(0, uri.indexOf('?')));
    }
  }
}

function query() {
  const query = $('#query').val();
  const limit = $('#limit').val();
  const searchClosed = $('#search-closed').is(':checked');

  let closed = '0';
  if (searchClosed) closed = '-1';

  if (!query) return Materialize.toast('Please specify a query!', 6000);

  $('.progress').show();

  const url = 'https://api.openstreetmap.org/api/0.6/notes/search?q=' + query + '&limit=' + limit + '&closed=' + closed;

  const http = new XMLHttpRequest();
  http.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      $('#notes').empty();

      const result = x2js.xml_str2json(this.responseText);

      if (!result.osm.note) {
        $('.progress').hide();
        return Materialize.toast('Nothing found!', 6000);
      }

      $('#found-notes').html('Found notes: ' + result.osm.note.length);

      for (let i = 0; i < result.osm.note.length; i++) {
        let note = result.osm.note[i];
        let comment = note.comments.comment;
        if (!comment.html) {
          comment = note.comments.comment[0];
        }

        $('#notes').append(
          '<div class="col s12 m6 l4">' +
          '<div class="card blue-grey darken-1">' +
          '<div class="card-content white-text">' +
          '<span class="card-title">' + note.id + ' (' + comment.user + ')</span>' +
          '<p>' + comment.html + '</p>' +
          '</div>' +
          '<div class="card-action">' +
          '<a href="https://www.openstreetmap.org/note/' + note.id + '" target="_blank">View Note ' + note.id + ' on OSM</a>' +
          '</div>' +
          '</div>' +
          '</div>');
      }

      $('.progress').hide();
    }
  };

  http.open('GET', url, true);
  http.send();
}
