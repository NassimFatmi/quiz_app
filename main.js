let countSpan = document.querySelector('.quiz-info .count span');
let bulletsSpanContainer = document.querySelector('.bullets .spans');
let quizArea = document.querySelector('.quiz-area');
let answersArea = document.querySelector('.answers-area');
let submitBtn = document.querySelector('.submit-button');
let bullets = document.querySelector('.bullets');
let counter = document.querySelector('.countdown');
// Set Options
let currentIndex = 0;
let rightAnswers = 0;
let globalDuration = 15;
let countDown;

getQuestions();

function getQuestions() {

    let myRequest = new XMLHttpRequest();

    myRequest.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            let questionsObject = JSON.parse(this.responseText);
            let questionsCount = questionsObject.length;

            createBullets(questionsCount);

            addQuestioData(questionsObject[currentIndex], questionsCount);

            countDownTimer(globalDuration, questionsCount);

            submitBtn.onclick = () => {
                let answer;
                if (currentIndex < questionsCount) {
                    answer = questionsObject[currentIndex]['right_answer'];
                    currentIndex++;
                }
                checkAnswer(answer, questionsCount);


                // remove answers
                quizArea.innerHTML = '';
                answersArea.innerHTML = '';

                addQuestioData(questionsObject[currentIndex], questionsCount);
                handleBullets();

                clearInterval(countDown);
                countDownTimer(globalDuration, questionsCount);

                showResults(questionsCount);
            };
        }
    };

    myRequest.open('GET', 'questions.json', true);
    myRequest.send();

}

function createBullets(num) {
    countSpan.innerHTML = num;
    // create spans
    for (let i = 0; i < num; i++) {
        let theBullet = document.createElement('span');

        if (i === 0)
            theBullet.className = 'on';

        bulletsSpanContainer.appendChild(theBullet);
    }
}

function shuffle(array) {
    let count = array.length;
    let random, temp;
    for (let i = 0; i < count; i++) {
        random = Math.floor(Math.random() * count);
        temp = array[i];
        array[i] = array[random];
        array[random] = temp;
    }
    return array;
}

function addQuestioData(obj, count) {
    if (currentIndex < count) {
        // create question
        let questionTitle = document.createElement('h2');
        let questionText = document.createTextNode(obj.title);

        questionTitle.appendChild(questionText);

        quizArea.appendChild(questionTitle);

        // Create the answers
        for (let i = 0; i < 4; i++) {
            let mainDiv = document.createElement('div');
            mainDiv.className = 'answers';

            let radio = document.createElement('input');
            radio.name = 'question';
            radio.type = 'radio';
            radio.id = 'answer_' + (i + 1);
            radio.dataset.answer = obj[`answer_${(i + 1)}`];
            if (i === 0) {
                radio.checked = true;
            }

            let label = document.createElement('label');
            label.htmlFor = 'answer_' + (i + 1);
            let labelText = document.createTextNode(obj[`answer_${(i + 1)}`]);
            label.appendChild(labelText);

            mainDiv.appendChild(radio);
            mainDiv.appendChild(label);

            answersArea.appendChild(mainDiv);
        }
    }
}

function checkAnswer(rightAnswer, count) {
    let answers = document.getElementsByName('question');
    let theChoosenAnswer;
    for (let i in answers) {
        if (answers[i].checked) {
            theChoosenAnswer = answers[i].dataset.answer;
        }
    }
    if (rightAnswer === theChoosenAnswer) {
        rightAnswers++;
    }
}

function handleBullets() {
    let bulletsSpan = document.querySelectorAll('.bullets .spans span');
    let bullets = Array.from(bulletsSpan);

    bullets.forEach((bullet, index) => {
        if (currentIndex === index) {
            bullet.className = 'on';
        }
    });
}

function showResults(count) {
    let theResults;
    if (currentIndex === count) {
        quizArea.remove();
        answersArea.remove();
        submitBtn.remove();
        bullets.remove();

        if (rightAnswers > (count / 2) && rightAnswers < count) {
            theResults = `<span class="good">Good</span> ${rightAnswers} of ${count}`;
        } else if (rightAnswers === count) {

            theResults = `<span class="perfect">Perfect</span> ${rightAnswers} of ${count}`;
        } else {
            theResults = `<span class="bad">Bad</span> ${rightAnswers} of ${count}`;
        }
        document.querySelector('.results').innerHTML = theResults;

    }
}

function countDownTimer(time, count) {
    if (currentIndex < count) {
        let minutes, seconds, duration = time;
        countDown = setInterval(function() {

            minutes = parseInt(duration / 60);
            seconds = duration % 60;

            if (minutes < 10) {
                minutes = '0' + minutes;
            }

            if (seconds < 10) {
                seconds = '0' + seconds;
            }
            counter.innerHTML = minutes + ' : ' + seconds;

            if (--duration < 0) {
                clearInterval(countDown);
                submitBtn.click();
            }

        }, 1000);
    }
}