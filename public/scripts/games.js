//CREATING GAME POST REQUESTS AND THE LIKE GO HERE
function generateCode() {
  return Math.round((Math.pow(36, 4 + 1) - Math.random() * Math.pow(36, 4))).toString(36).slice(1);
}

$(function() {

  $('#create-game').click(function(event) {
    var name = $('#game-name').val();
    var code = generateCode();
    var gameObj = {};
    gameObj['name'] = name;
    gameObj['code'] = code;

    $.ajax({
      type: 'POST',
      url: '/',
      data: gameObj,
      dataType: 'JSON',
      fail: function() {
        alert(error.message);
      },
      success: function(game) {
        window.location.href = '/' + game.code;
      }
    });
  });

  $('#join-game').click(function(event) {
    var code = $('#game-code').val();

    window.location.href = '/start/' + code;
  });

});
