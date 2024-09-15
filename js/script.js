let form = document.querySelector('#quizOptions');
let categoryMenu = document.querySelector('#categoryMenu');
let difficultyOptions = document.querySelector('#level');
let questionsNumber = document.querySelector('#numOfQu');
let btn = document.querySelector('#startQuiz');
let myQuiz;
let questions;
let questionBody = document.querySelector('#questionBody');
form.addEventListener('submit', function (e) {
    e.preventDefault();

})

btn.addEventListener('click', async function () {
    let category = categoryMenu.value;
    let difficulty = difficultyOptions.value;
    let number = questionsNumber.value;
    if(number == ''){
        alert('Please Enter a number of qustions then Start')
    }else{
        myQuiz = new Quiz(category, difficulty, number);
        questions = await myQuiz.getAllQuestions();
        console.log(questions);
        let myQuestion = new Question(0);
        console.log(myQuestion);
        form.classList.add('d-none');
        myQuestion.display();
    }
    

})

class Quiz {
    constructor(category, difficulty, number) {
        this.category = category;
        this.difficulty = difficulty;
        this.number = number;
        this.score = 0;
    }
    getApi() {
        return `https://opentdb.com/api.php?amount=${this.number}&category=${this.category}&difficulty=${this.difficulty}`;
    }
    async getAllQuestions() {
        let result = await fetch(this.getApi());
        let data = await result.json();
        return data.results;
    }
    endResult() {
        return `<div class="bg-white p-4 rounded rounded-2 d-flex flex-column justify-content-center align-align-items-center mx-auto text-center animate__animated animate__bounceIn">
                        
                        <div class="score fw-semibold fs-5">${this.score==questions.length?`Congratulation 🎉`: `Your Score:${this.score} of ${questions.length}` }</div>
                        <button class="again btn btn-primary w-100">play again</button>
                    </div>
            `;
    }
}
////////////////////////////
class Question {
    constructor(index) {
        this.index = index;
        this.question = questions[index].question;
        this.difficulty = questions[index].difficulty;
        this.category = questions[index].category;
        this.correctAnswer = questions[index].correct_answer;
        this.incorrectAnswers = questions[index].incorrect_answers;
        this.myAllAnswers = this.getAllAnswers();
        this.isAnswerd = false;

    }
    getAllAnswers() {
        let allAnswers = [...this.incorrectAnswers, this.correctAnswer];
        allAnswers.sort();
        return allAnswers;
    }
    display() {
        const qustionMarkup = `
            <div class="bg-white p-4 rounded rounded-2  mx-auto text-center animate__animated animate__bounceIn">
                        <div class="d-flex justify-content-between">
                            <span>${this.category}</span>
                            <span>${this.index + 1} of ${questions.length}</span>
                        </div>
                        <h4 class="my-3">${this.question}</h4>
                        <ul class="choices list-unstyled d-flex flex-wrap gap-2">
                            ${this.myAllAnswers
                .map((answer) => `<li class="w-49 border border-2 p-3 border-black rounded rounded-pill fw-semibold ">${answer}</li>`).toString().replaceAll(',', '')}
                        </ul>
                        <div class="score fw-semibold fs-5">Score: ${myQuiz.score}</div>
                    </div>
            `;

        questionBody.innerHTML = qustionMarkup;

        let allChoicese = document.querySelectorAll('.choices li');
        for (let choice of allChoicese) {
            choice.addEventListener('click', () => {
                this.checkAnswer(choice);
                this.nextQuestion();
            });
        }
        //    allChoicese.forEach((li) => {
        //     li.addEventListener('click', ()=> {
        //         this.checkAnswer(li);
        //     });
        //    });

    }
    checkAnswer(choice) {
        if (!this.isAnswerd) {
            this.isAnswerd = true;
            if (choice.innerHTML == this.correctAnswer) {
                myQuiz.score++;
                choice.classList.add('correct', 'animate__animated', 'animate__pulse');

            } else {
                choice.classList.add('wrong', 'animate__animated', 'animate__shakeX');
            }

        }

    }
    nextQuestion() {
        this.index++;
        setTimeout(() => {
            if (this.index < questions.length) {
                let myNewQuestion = new Question(this.index);
                myNewQuestion.display();
            } else {
                let end=myQuiz.endResult();
                questionBody.innerHTML = end;
                document.querySelector('.again').addEventListener('click',function () {
                    window.location.reload();
                });

            }

        }, 2000)
    }

}
