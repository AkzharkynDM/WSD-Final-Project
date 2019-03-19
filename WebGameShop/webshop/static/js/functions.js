



$(document).ready(function()
{  
    //TODO: sanitize input??
    'use strict';
    
    // game messaging system


    var frame = document.getElementById('game_iframe');
    

    // ERROR: Sent from the service to the game
    // Must contain info attribute, which contains textual information to be relayed to the user on what went wrong
    function error(text) {
      var message =  {
        messageType: "ERROR",
        info: text
      };
      //send message to iframe
      frame.contentWindow.postMessage(message, "*");
    }

    
    $(window).on('message', function(evt) {
      //Note that messages from all origins are accepted
      //Get data from sent message
      var data = evt.originalEvent.data;

      if (data.messageType == 'SCORE') {

        // player score
        var score = data.score;
        // gets game title
        var title = $('#gameTitle').html();
        $.ajax({
          method: 'POST',
          url: 'score/',
          data: {csrfmiddlewaretoken: '{{ csrf_token }}',
          Score: score,
          Title: title
        },
        success: function (data) {
             //this gets called when server returns an OK response

             // reload only highscore div to update highscore
             $(".highscore").load(location.href + " .highscore");
             
           },
           error: function (data) {
             error("Something went wrong with submitting highscores :( ");
           }
         });
       

       
    
       
    
    

      }

      if (data.messageType == 'SAVE') {
        //implement SAVE

        var gamestate = JSON.stringify(data.gameState);
        var gametitle = $('#gameTitle').html();

        // save data to database
        $.ajax({
          method: 'POST',
          url: 'save/',
          data: {csrfmiddlewaretoken: '{{ csrf_token }}',
          save_State: gamestate,
          Title: gametitle
        },

        success: function (data) {

             alert("game saved!");
             
           },
           error: function (data) {

             error("Something went wrong with saving the game :( ");
           }
         });

      }

      if (data.messageType == 'LOAD_REQUEST') {

        var Title = $('#gameTitle').html();

        $.ajax({
          method: 'POST',
          url: 'load/',
          data: { csrfmiddlewaretoken: '{{ csrf_token }}',
          Title: Title
        },

        success: function (data) {

             var message = {
                       messageType: "LOAD",
                       gameState: data
                     };

              // send loaded state to the game
              frame.contentWindow.postMessage(message, "*");
             
           },
           error: function (data) {

             error("Something went wrong with loading the game :( ");
           }
         });
        



        

      }

      if (data.messageType == 'SETTING') {

        var width = data.options.width;
        
        var height = data.options.height;
        
        $('iframe').width(width)
        .height(height);

      }
      
      
    });
    


  });