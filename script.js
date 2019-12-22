$(document).ready(function() {

    /*************************************************************************************/
    //Global Variables

    /*
    * total quiz length in seconds; default is 100, test value is lower, so as not to wait 100 seconds :)
    */
    var seconds = 100;

    /*
    * stores current question as string
    */
    var question = "";

    /*
    * stores all current answer choices as string[]
    */
    var answers = ["", "", "", ""];

    /*
    * stores current correct answer
    */
    var correctAnswer = "";

    /*
    * global variable which stores question number, starts at question 0, as in, index 0 on questions.
    */
    var questionNumber = 0;

    /*
    * 
    */
    var intervalFunction = null;


    /*************************************************************************************/
    //Listeners

    /*
    * When clear high score button is clicked
    */
    $(document).on("click", ".clear-btn", function(e){
        localStorage.clear();
        buildHighScore();
    });

    /*
    * when submit button on quiz end page clicked
    */
    $(document).on("click", ".initials-btn", function(e){
        var initials = $("#initials-input").val();
        localStorage.setItem('initials', initials);
        localStorage.setItem('score', seconds);

        buildHighScore();
    });

    /* 
    * When start quiz button is clicked, initialize quiz
    */
    $(".start-button").on("click", function(){ 
        //imports the questions to head of this file
        importQuestions();
        //gets first question value, stores in global variables
        getQuestion();
 
        var intro = $("#introduction");
 
        $(".start-button").remove();
         
        var answerGroup = $(".answer-group");
 
        var answerBtnType = "button",
            answerBtnClasses = "btn btn-primary answer-choices";
 
        //builds new button template, to be added 3 times
        var newButton = $("<button>");
        newButton.attr("type", answerBtnType);
        newButton.attr("class", answerBtnClasses);
 
        //empty, then change attribute values to make more sense with question/answer format
        intro.empty();
        intro.attr("id", "question");
        intro.html(question);
 
        //adds the new buttons
        for(i = 0; i < 4; i++){
            newButton.html(answers[i]);
            newButton.attr("id", i);
            newButton.clone().appendTo(answerGroup);
        }
         
        //build timer last so as not to penalize quiz-taker for javascript loading time if non-negligable
        buildTimer();
    });

    /* 
    * when user clicks on an answer choice
    * validate & respond accordingly.
    */
    $(document).on("click", ".answer-choices", function(e){
        var getValue = e.target.textContent;

        //correct answer
        if(getValue == correctAnswer){
            isValid(true);
        } 
        //wrong answer
        else if (getValue != correctAnswer){
            isValid(false);
        }
    });


    /*************************************************************************************/
    //Functions

    /*
    * imports questions.js
    * runs at start
    */
    function importQuestions(){
        var imported = document.createElement('questions');
        imported.src = 'questions.js';
        document.head.appendChild(imported);
        return imported;
    }

    /*
    * accessor, gets current question, (title, answers, and correct answer) and stores in global variables
    */
    function getQuestion(){
        //get question, set to global
        question = questions[questionNumber].title;

        //get answers, set to global
        for(i = 0; i < questions[questionNumber].choices.length; i++){
            answers[i] = questions[questionNumber].choices[i];
        }
        
        //get correct answer, set to global
        correctAnswer = questions[questionNumber].answer;
    }

    /*
    * responds based on validity of answer, mainly to keep ".answer-button" listener a little cleaner looking
    * @arg: validity type boolean = true if answer is correct, false if not
    */
    function isValid(validity){
        //correct answer
        if(validity == true){
            if(questionNumber == questions.length - 1){
                quizEnd();
                return;
            }
            changeTime(+5);

            //append a small message, remove after 1 second
            $(".center").append("<div class=\"message\"><hr><p><i>Correct!");
            setTimeout(function() {
                $(".message").remove();
            }, 1000);

            //increment questionNumber, get the next question and set html for next question
            questionNumber += 1
            getQuestion();
            setQA();
        }

        //incorrect answer
        else if(validity == false){
            changeTime(-15);
            
            //append a small message, remove after 1 second
            $(".center").append("<div class=\"message\"><hr><p><i>Wrong!");
            setTimeout(function() {
                $(".message").remove();
            }, 1000); 
        }
    }

    /*
    * runs when quiz ends. 
    */
    function quizEnd(){
        //end timer
        clearInterval(intervalFunction);
        //build score page
        buildEndPage();
    }

    /*
    * function called to build high score after 'submit' clicked
    */
    function buildHighScore(){
        //makes adding buttons easier
        var buttonAttr = "type=\"button\" class=\"btn btn-primary";
        //makes adding tab easier
        var tab = "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp";

        //for when clear is clicked, not elegant, but works to alleviate dupe html.
        $(".center").remove();
        $(".row").append("<div class=\"col-md-7 center\">");

        //out with the old, in with the new
        $(".game-end").remove();
        $(".center").append("<div class=highscore>");
        $(".highscore").append("<div id=highscore-text><strong>Highscores");
        
        //how many items? update html appropriately.
        for (i = 0; i < localStorage.length; i++)   {
            let initTmp = localStorage.getItem("initials");
            let scoreTmp = localStorage.getItem("score");
            $(".highscore").append("<div class=scores>" + initTmp + tab + scoreTmp);
        }
        
        $(".highscore").append("<button " + buttonAttr + " back-btn\" onclick=\"window.location=\'index.html\';\">Back");
        $(".highscore").append("<button " + buttonAttr + " clear-btn\">Clear Highscores");
    }

    /*
    * function which builds the ending page, called at completion of quiz
    */
    function buildEndPage(){
        $(".answer-choices").remove();
        $("#question").remove();
        $(".answer-group").remove();
        $(".center").append("<div class=\"game-end\">");
        $(".game-end").append("<div id=\"end-message\"><strong>All Done!");
        $(".game-end").append("<div id=\"score\"> Your score is: " + seconds);
        $(".game-end").append("<div class=\"initials\">Enter initials: <input id=\"initials-input\"><button type=\"button\" class=\"btn btn-primary initials-btn\">Submit")
    }

    /*
    * changes timer value.  
    * @arg time == int delta in seconds
    * delta being change
    */
    function changeTime(delta){
        seconds = seconds + delta;
        if(seconds <= 0){
            //game over, time has run out.
            quizEnd();
            return;
        }
        $(".timer").html("Time: " + seconds);
    }

    /*
    * builds the initial state of the timer
    */
    function buildTimer(){
        //timer will always count every second
        intervalFunction = window.setInterval(start, 1000);

        /*
        * starts & runs timer. 
        */
        function start() {
            if(seconds > 0){ //if time is not yet 0
                changeTime(-1);
                //decrement
            } else { //else
                //time has hit 0, this should never run due to handling in changeTime(), it is merely here just in case.
                quizEnd();
                return;
            }
        }
    }

    /*
    * mutator: sets question & answer in html
    * generally, to be called upon correct answer
    * for this functionality to work properly (as intended), run getQuestions() first, to update current question
    */
    function setQA(){
        //edit question html
        $("#question").html(question);

        //edit button html
        for(i = 0; i < 4; i ++){
            $("#" + i).html(answers[i])
        }
    }
});