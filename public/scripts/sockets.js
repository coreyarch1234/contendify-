// MARK: Script for SHOW page of game.

var socket = io(); // Create socket instance
var gameCode = ""; // Global game code set when a user connects
var numQuestions = 2; // Total # of questions (unused atm)
var maxPlayers = 3 // Unused atm as well
var participants = 0;

$(function() {

    $('.question').first().show().addClass('current-question');
    $('#game-summary').hide(); //Hide summary until game has ended
    gameCode = window.location.href.split('/')[4];
    $('#beginning').hide();
    socket.emit('publish:join', gameCode);

    // // MARK: New (for waiting room)
    // // Initial setup
    //
    // // update waiting screen with joined players, then start game
    // $('.last-user').next().addClass('conected last-user')
    // $('.last-user').first().removeClass('last-user').removeClass('waiting');
    // gameCode = window.location.href.split('/')[3];
    // socket.emit('publish:join', gameCode, function() {
    //   participants += 1;
    //   if (participants == maxPlayers) {
    //     // hide watiing screen html
    //     // segue to show question
    //     $('.question').first().show().addClass('current-question');
    //   }
    // });
    // // MARK: End




    // MARK: Game event and socket logic

    // Answer selected
    $('body').on('click', '.answer', function(e) {
        e.preventDefault();

        var questionId = $('.current-question').data('id');
        var answerChosen = $(this).val();
        var data = {
          questionId: questionId,
          answerChosen: answerChosen,
          gameCode: gameCode
        }
        //To prevent people from clicking answers multiple times for point gain
        $('#answers').hide();

        // Publishing a user having selected an answer
        socket.emit('publish:answer', data, function(result) {
          console.log("You chose: " + result);
        });
  });

  // Fake Answer submitted
  $('#submit-lie').click(function(event) {
    var fakeAnswer = $('#fake-answer').val();
    var socketId = socket.id;
    var questionId = $('.current-question').data('id');
    var data = {
        answer: {
          body: fakeAnswer,
          socketId: socketId,
          question: questionId
        },
        code: gameCode
    }

    // MARK: Publishing Fake Answer
    socket.emit('publish:fake_answer', data, function(result) {
      console.log('Waiting for the rest of the players to answer');
      // FEATURE: Update all clients with who has just created an answer
    });
  });

  // MARK: Updates users' DOM to show collection of answers
  socket.on('subscribe:answers', function(answers) {
    setTimeout(function() {
        $('#answer-input').hide(); // hide input
        $('#fake-answer').val(""); // clear input


        var answer = $('.answer').first()

        console.log("Displaying answer selection for all users...");
        console.log("All Answers: ");
        console.log(answers);
        for (var i = 0; i < answers.length; i++) {
          answer.val(answers[i]);
          answer = answer.next();
        }

        $('#answers').show(); // display answers
    }, 1000);
  });

  socket.on('subscribe:is_correct?', function(data, cb) {
    //   console.log("Hit correct")
    $('#score-display').show();
    if (data.isCorrect) {
        console.log("Hit correct")
        console.log(data.answer)
        $('#score-display').html("<span class='correct-incorrect' style='color: #39b54a;font-size:1.2em;'>Correct!</span><br><span class='correct-answer'></span><span style='font-size:0.7em;color: #aaa;padding-top:5px;'>YOUR SCORE:</span>  <br><span style='font-size: 3em; color: #39b54a;padding-bottom:5px;'>" + data.score + "</span>")
        // $('#correct-answer-alert').html("<span style='color: #39b54a;font-size:1.2em;'>Correct!</span><br> <span style='font-size:0.7em;color: #aaa;padding-top:5px;'>YOUR SCORE:</span>  <br><span style='font-size: 3em; color: #39b54a;padding-bottom:5px;'>" + data.score + "</span>")
    } else {
        console.log("Hit incorrect")
        console.log(data.answer)
        $('#score-display').text(data.score);
        $('#score-display').html("<span class='correct-incorrect' style='color: #ff4c4c;font-size:1.2em;'>Incorrect.</span><br> <span class='correct-answer'>The correct answer is <u>" + data.answer + ".</u><br></span> <span style='font-size:0.7em;color: #aaa;padding-top:5px;'>YOUR SCORE:</span> <br><span style='font-size: 3em; color: #39b54a;padding-bottom:5px;'>" + data.score + "</span>")
        // $('#correct-answer-alert').html("<span style='color: #ff4c4c;font-size:1.2em;'>Incorrect.</span><br> The correct answer is <u>" + data.answer + ".</u><br> <span style='font-size:0.7em;color: #aaa;padding-top:5px;'>YOUR SCORE:</span> <br><span style='font-size: 3em; color: #39b54a;padding-bottom:5px;'>" + data.score + "</span>")
    }
    cb();
  });

  socket.on('subscribe:answered', function(data) {
    // Show updated score
    // for (var i = 0; i < data.users.length; i++){
    //     if (data.users[i].sockId === socket.id) {
    //     //   return data.users[i];
    //       $('#correct-answer-alert').text(data.users[i].score);
    //     }
    // }
    // $('#correct-answer-alert').text(data.score);
    // console.log(data.score)
    // update dom to reflect # of people who have answered the question



    socket.emit('publish:next_question?', data);
  });

  $('#home-button').click(function(event) {
     window.location.href = '/';
  });

  socket.on('subscribe:next_question?', function(data) {
    $('.answer-alert-display').show();
    // $('#score-display').removeClass('extra-margin');
    setTimeout(function() {
        var nextQuestionsSize = $('.current-question').next().length;
        if (nextQuestionsSize == 0) {
          //remove all questions
          let removeElements = elms => Array.from(elms).forEach(el => el.remove());
          // Use like:
          removeElements(document.querySelectorAll("#questions"));
          //See summary of game and hide all else
          $('#score-display').hide();
          $('#questions').hide();
          $('#answer-input').hide();
          $('#answer-alert-container').hide();

          //Game Summary
          $('#game-summary').show().html("<div class='ending-message'> Good Job. You completed the game. </div>");
        //   console.log("THE SCORES ARE: " + data[0].score);
        //   console.log("THE SCORES ARE: " + data[1].score);
          var opponentScores = [];
          for (var i = 0; i < data.length; i++){
              if (data[i].sockId === socket.id) {
                console.log("YOUR SCORE IS: " + data[i].score);
                $('#game-summary').append("<div class='points-players'><span class='points-player'>Your score:</span>&nbsp;&nbsp;&nbsp;<span class='points-score'>" + data[i].score + "</span> points" + "</div>");
            }else{
                opponentScores.push(data[i].score);
            }
          }
          console.log("the opponent scores are: " + opponentScores);
          for(var x=0; x<opponentScores.length; x++){
              // "<span class='points-players'> Player " + x+1 + ": " + opponentScores[x] + " points" + "</span>"
            $('#game-summary').append(`<div class=points-players><span class=points-player>Opponent ${x+1}:</span>&nbsp;&nbsp;&nbsp;<span class=points-score>${opponentScores[x]}</span> points</div>`);
          }

          //Option Button to start a new game
          $('#beginning').show();
          // end game
        } else {
          // $('#score-display').hide();
          $('.correct-incorrect').hide();
          $('.correct-answer').hide();
          $('#correct-answer-alert').text('');

          $('.current-question').hide()
          $('.current-question').next().show().addClass('current-question');
          $('.current-question').first().removeClass('current-question');

          $('#answer-input').show(); // unhide input
          $('#answers').hide();


        }
    }, 3000);
  })
});
