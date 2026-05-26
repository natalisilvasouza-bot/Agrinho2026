let money = 10000;
let environmentScore = 50;
let score = 0;
let gameOver = false;

const moneyDisplay = document.getElementById('money-display');
const environmentDisplay = document.getElementById('environment-display');
const scoreDisplay = document.getElementById('score-display');
const environmentBar = document.getElementById('environment-bar');
const eventTitle = document.getElementById('event-title');
const eventDescription = document.getElementById('event-description');
const feedbackModal = document.getElementById('feedback-modal');
const feedbackText = document.getElementById('feedback-text');
const actionButtons = document.querySelectorAll('.actions-container .btn');
const fallingVegetables = document.getElementById('falling-vegetables');

function updateDisplay() {
    moneyDisplay.textContent = `R$ ${money.toLocaleString('pt-BR')}`;
    environmentDisplay.textContent = `${environmentScore}%`;
    scoreDisplay.textContent = score;
    environmentBar.style.width = `${Math.max(0, Math.min(100, environmentScore))}%`;

    if (environmentScore <= 20) {
        environmentBar.style.background = '#b71c1c';
    } else if (environmentScore <= 50) {
        environmentBar.style.background = '#ff8f00';
    } else {
        environmentBar.style.background = '#43a047';
    }
}

function setEvent(title, description) {
    eventTitle.textContent = title;
    eventDescription.textContent = description;
}

function disableActions() {
    actionButtons.forEach(button => button.disabled = true);
}

function showFeedback(message) {
    feedbackText.innerHTML = message;
    feedbackModal.classList.remove('hidden');
}

function makeChoice(choice) {
    if (gameOver) return;

    switch (choice) {
        case 'agrodefensivo':
            money += 1200;
            environmentScore -= 35;
            setEvent('Uso de Defensivos Pesados', 'A colheita rende mais agora, mas a produção está degradando o solo e a água.');
            break;
        case 'bioinsumo':
            money += 300;
            environmentScore += 15;
            setEvent('Bioinsumos Naturais', 'A fazenda ganha resiliência com práticas sustentáveis e a qualidade do solo melhora.');
            break;
        case 'desmatar':
            money += 900;
            environmentScore -= 30;
            setEvent('Desmatamento para Expansão', 'A área cresceu, mas a floresta e a biodiversidade sofreram impacto significativo.');
            break;
        case 'plantiodireto':
            money += 450;
            environmentScore += 10;
            setEvent('Plantio Direto e Rotação', 'A diversidade de culturas protege o solo e mantém a produção com menor impacto ambiental.');
            break;
        default:
            return;
    }

    environmentScore = Math.max(0, Math.min(100, environmentScore));
    updateDisplay();
    checkGameStatus();
}

function checkGameStatus() {
    if (environmentScore <= 0) {
        gameOver = true;
        disableActions();
        showFeedback('<strong>Fim de jogo!</strong> O solo ficou infértil e a água foi comprometida. A fazenda não suporta mais a produção.');
        return;
    }

    if (money >= 18000 && environmentScore >= 60) {
        gameOver = true;
        disableActions();
        showFeedback('<strong>Parabéns!</strong> Você alcançou um equilíbrio sustentável entre produção e meio ambiente. Sua fazenda prospera!');
        return;
    }

    if (money >= 20000 && environmentScore < 40) {
        gameOver = true;
        disableActions();
        showFeedback('<strong>Alerta máximo!</strong> O lucro ficou alto demais às custas do ambiente. A fazenda não conseguirá continuar assim.');
        return;
    }
}

function updateScore(points) {
    score += points;
    scoreDisplay.textContent = score;
}

const veggies = ['🥬','🥕','🍅','🌽','🍆','🥦'];

function spawnVegetable() {
    if (gameOver) return;

    const veggie = document.createElement('span');
    const icon = veggies[Math.floor(Math.random() * veggies.length)];
    veggie.className = 'veggie';
    veggie.textContent = icon;
    veggie.style.left = `${Math.random() * 90 + 2}%`;
    veggie.style.fontSize = `${Math.random() * 18 + 28}px`;
    veggie.dataset.points = `${Math.floor(Math.random() * 5 + 5)}`;
    veggie.style.animationDuration = `${Math.random() * 4 + 6}s`;
    veggie.style.opacity = '0.95';

    veggie.addEventListener('click', function(event) {
        event.stopPropagation();
        if (gameOver) return;
        updateScore(parseInt(veggie.dataset.points, 10));
        const added = document.createElement('span');
        added.className = 'score-burst';
        added.textContent = `+${veggie.dataset.points}`;
        added.style.left = veggie.style.left;
        fallingVegetables.appendChild(added);
        setTimeout(() => added.remove(), 800);
        veggie.remove();
    });

    fallingVegetables.appendChild(veggie);
    setTimeout(() => veggie.remove(), parseFloat(veggie.style.animationDuration) * 1000 + 500);
}

setInterval(spawnVegetable, 900);

function resetGame() {
    money = 10000;
    environmentScore = 50;
    score = 0;
    gameOver = false;
    actionButtons.forEach(button => button.disabled = false);
    updateDisplay();
    setEvent('Início da Temporada', 'Escolha uma ação abaixo para começar a gerenciar sua fazenda com equilíbrio.');
    feedbackModal.classList.add('hidden');
    fallingVegetables.querySelectorAll('.veggie, .score-burst').forEach(el => el.remove());
}

updateDisplay();
