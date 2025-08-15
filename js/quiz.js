// Quiz functionality
const quizQuestions = [
    {
        question: "Qual é a principal função do HTML em desenvolvimento web?",
        options: [
            "Estilizar a página",
            "Estruturar o conteúdo",
            "Adicionar interatividade",
            "Gerenciar o banco de dados"
        ],
        correct: 1,
        explanation: "HTML (HyperText Markup Language) é responsável por estruturar o conteúdo de uma página web, definindo elementos como cabeçalhos, parágrafos, listas e links."
    },
    {
        question: "O que significa CSS?",
        options: [
            "Computer Style Sheets",
            "Creative Style System",
            "Cascading Style Sheets",
            "Content Styling System"
        ],
        correct: 2,
        explanation: "CSS (Cascading Style Sheets) é uma linguagem de estilo usada para descrever a apresentação de um documento HTML."
    },
    {
        question: "Qual é a melhor prática para tornar um site acessível?",
        options: [
            "Usar apenas imagens",
            "Ignorar estrutura semântica",
            "Usar cores contrastantes e texto alternativo para imagens",
            "Remover toda a navegação por teclado"
        ],
        correct: 2,
        explanation: "A acessibilidade web inclui o uso de cores com contraste adequado e textos alternativos para imagens, permitindo que todos os usuários acessem o conteúdo."
    }
];

export function initQuiz() {
    const startButton = document.getElementById('start-quiz');
    if (!startButton) return; // Not on quiz page

    const quizContainer = document.getElementById('quiz-container');
    const resultsContainer = document.getElementById('results-container');
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const prevButton = document.getElementById('prev-question');
    const nextButton = document.getElementById('next-question');
    const submitButton = document.getElementById('submit-quiz');
    const restartButton = document.getElementById('restart-quiz');
    const progressFill = document.querySelector('.quiz-progress .progress-fill');
    const currentQuestionSpan = document.getElementById('current-question');
    const totalQuestionsSpan = document.getElementById('total-questions');

    let currentQuestion = 0;
    let userAnswers = new Array(quizQuestions.length).fill(null);

    // Start quiz
    startButton.addEventListener('click', () => {
        document.querySelector('.quiz-intro').style.display = 'none';
        quizContainer.style.display = 'block';
        totalQuestionsSpan.textContent = quizQuestions.length;
        showQuestion(0);
    });

    // Show question
    function showQuestion(index) {
        const question = quizQuestions[index];
        questionText.textContent = question.question;
        currentQuestionSpan.textContent = index + 1;
        
        // Update progress
        const progress = ((index + 1) / quizQuestions.length) * 100;
        progressFill.style.width = `${progress}%`;

        // Create options
        optionsContainer.innerHTML = '';
        question.options.forEach((option, i) => {
            const button = document.createElement('button');
            button.className = 'option-btn';
            button.textContent = option;
            
            if (userAnswers[index] === i) {
                button.classList.add('selected');
            }
            
            button.addEventListener('click', () => selectOption(i));
            optionsContainer.appendChild(button);
        });

        // Update navigation buttons
        prevButton.disabled = index === 0;
        nextButton.disabled = userAnswers[index] === null;
        nextButton.style.display = index === quizQuestions.length - 1 ? 'none' : 'block';
        submitButton.style.display = index === quizQuestions.length - 1 ? 'block' : 'none';
    }

    // Select option
    function selectOption(optionIndex) {
        userAnswers[currentQuestion] = optionIndex;
        const options = optionsContainer.querySelectorAll('.option-btn');
        
        options.forEach((btn, i) => {
            btn.classList.toggle('selected', i === optionIndex);
        });

        nextButton.disabled = false;
        submitButton.disabled = false;
    }

    // Navigation
    prevButton.addEventListener('click', () => {
        if (currentQuestion > 0) {
            currentQuestion--;
            showQuestion(currentQuestion);
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentQuestion < quizQuestions.length - 1) {
            currentQuestion++;
            showQuestion(currentQuestion);
        }
    });

    // Submit quiz
    submitButton.addEventListener('click', showResults);

    function showResults() {
        quizContainer.style.display = 'none';
        resultsContainer.style.display = 'block';

        // Calculate score
        const correct = userAnswers.reduce((acc, answer, index) => {
            return acc + (answer === quizQuestions[index].correct ? 1 : 0);
        }, 0);

        const percentage = Math.round((correct / quizQuestions.length) * 100);
        document.getElementById('final-score').textContent = percentage;

        // Show review
        const reviewContainer = document.getElementById('answers-review');
        reviewContainer.innerHTML = '';

        quizQuestions.forEach((question, index) => {
            const reviewItem = document.createElement('div');
            reviewItem.className = 'review-item';
            const isCorrect = userAnswers[index] === question.correct;

            reviewItem.innerHTML = `
                <h4>${index + 1}. ${question.question}</h4>
                <p class="answer ${isCorrect ? 'correct' : 'incorrect'}">
                    Sua resposta: ${question.options[userAnswers[index]]}
                </p>
                <p class="correct-answer">
                    Resposta correta: ${question.options[question.correct]}
                </p>
                <p class="explanation">${question.explanation}</p>
            `;

            reviewContainer.appendChild(reviewItem);
        });
    }

    // Restart quiz
    restartButton.addEventListener('click', () => {
        currentQuestion = 0;
        userAnswers = new Array(quizQuestions.length).fill(null);
        resultsContainer.style.display = 'none';
        quizContainer.style.display = 'block';
        showQuestion(0);
    });
}
