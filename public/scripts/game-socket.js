$(function () {
  $(document).ready(function(){
    //Question One
    questionNumber = "One"
    optionOneText = getData("One");
    $("#optionOne").append("<a href='#'>" + "<p>" + "$$x = " + optionOneText + ".$$" + "</p>" + "</a></br>").click(function(){
      //Grab socket id and option text and emit
      var id = socket.io.engine.id
      socket.emit('answered', optionOneText, function(data){
        console.log(data);
      });
    });
  });
  // // Option click logic
  // $("#optionOne").click(function(){
  //     //Grab socket id and option text and emit
  //     var optionText = document.getElementById("optionOne").textContent;
  //     console.log(optionText);
  //     var id = socket.io.engine.id
  //     console.log(id)
  // });

  $("#optionTwo").click(function(){
      //Grab socket id and option text and emit
      var optionText = document.getElementById("optionTwo").textContent;
      // console.log(optionText);
      var id = socket.io.engine.id;
      // console.log(id)
  });

  $("#optionThree").click(function(){
      //Grab socket id and option text and emit
      var optionText = document.getElementById("optionThree").textContent;
      // console.log(optionText);
      var id = socket.io.engine.id;
      // console.log(id)
  });

  // Create a Game
  $('#createGame').submit(function(e){
      e.preventDefault();
      var game = $(this).serialize();
      $.ajax({
         url: '/games',
         data: game,
         fail: function() {
            alert(error.message);
         },
         dataType: 'json',
         success: function(data) {
           var gameName = data.gameName
           window.location.href = "/games/" + gameName;
           console.log('Redirected to game, socket will now be created for this game...');
          //    tell server to make nsp socket for this game
           socket.emit(gameName, data);
         },
         type: 'POST'
      });
  });
});
