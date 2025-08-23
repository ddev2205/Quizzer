const setupScreen=document.getElementById("setup-screen");
const quizScreen= document.getElementById("quiz-screen");
const resultScreen= document.getElementById("result-screen");

const quizForm= document.getElementById("quiz-setup-form");
const questionText= document.getElementById("question-text");
const answerButtons =document.getElementById("answer-buttons");
const currentScoreDisplay =document.getElementById("current-score");
const finalScoreDisplay =document.getElementById("final-score");
const restartBtn= document.getElementById("restart-btn");

let questions = [];
let currentQuestionIndex= 0;
let score= 0;

quizForm.addEventListener("submit", async (e) =>{
    e.preventDefault();

    const category =document.getElementById("category").value;
    const difficulty= document.getElementById("difficulty").value;
    const type= document.getElementById("question-type").value;

    let apiUrl =`https://opentdb.com/api.php?amount=10`;
    if(category !== "any") apiUrl +=`&category=${category}`;
    if(difficulty !== "any") apiUrl += `&difficulty=${difficulty}`;
    if(type !== "any") apiUrl +=`&type=${type}`;

    const res =await fetch(apiUrl);
    const data = await res.json();
    questions =data.results;

    currentQuestionIndex= 0;
    score =0;
    currentScoreDisplay.textContent= score;

    setupScreen.classList.add("hidden");
    resultScreen.classList.add("hidden");
    quizScreen.classList.remove("hidden");

    loadQuestion();
});

function loadQuestion(){
    resetAnswers();
    let currentQuestionData= questions[currentQuestionIndex];

    questionText.innerHTML =decodeHTML(currentQuestionData.question);

    document.getElementById('question-counter').textContent =`Question ${currentQuestionIndex + 1}/${questions.length}`;

    let answers= [...currentQuestionData.incorrect_answers];
    answers.push(currentQuestionData.correct_answer);

    shuffleArray(answers);

    answers.forEach((answer) =>{
        const button = document.createElement("button");
        button.innerHTML = decodeHTML(answer);
        button.classList.add("btn");
        button.addEventListener("click", () =>selectAnswer(button, currentQuestionData.correct_answer));
        answerButtons.appendChild(button);
    });
}

function selectAnswer(button, correctAnswer){
    const isCorrect =decodeHTML(button.innerHTML) === decodeHTML(correctAnswer);

    if(isCorrect){
        button.classList.add("correct");
        score++;
        currentScoreDisplay.textContent= score;
    }
    else{
        button.classList.add("incorrect");
    }

    Array.from(answerButtons.children).forEach((btn) =>{
        btn.disabled =true;
        if(btn.innerHTML === decodeHTML(correctAnswer)){
            btn.classList.add("correct");
        }
    });

    setTimeout(()=> {
        currentQuestionIndex++;
        if(currentQuestionIndex < questions.length){
            loadQuestion();
        } 
        else{
            showResults();
        }
    }, 1000);
}

function resetAnswers(){
    answerButtons.innerHTML= "";
}

function shuffleArray(array){
    for (let i =array.length - 1; i > 0; i--){
        const j =Math.floor(Math.random()*(i + 1));
        [array[i], array[j]] =[array[j], array[i]];
    }
}

function showResults(){
    quizScreen.classList.add("hidden");
    resultScreen.classList.remove("hidden");
    finalScoreDisplay.textContent= `You scored ${score}/${questions.length}`;
}

restartBtn.addEventListener("click", () =>{
    resultScreen.classList.add("hidden");
    setupScreen.classList.remove("hidden");
});

function decodeHTML(html){
    let txt =document.createElement("textarea");
    txt.innerHTML =html;
    return txt.value;
}

window.addEventListener('DOMContentLoaded',()=>{
    const categorySelect = document.getElementById("category");
    fetch('https://opentdb.com/api_category.php')
        .then(res =>res.json())
        .then(data =>{
            data.trivia_categories.forEach(cat => {
                const option =document.createElement('option');
                option.value =cat.id;
                option.textContent= cat.name;
                categorySelect.appendChild(option);
            });
        });
});

