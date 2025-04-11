document.addEventListener('DOMContentLoaded', function() {
    // Game elements
    const startButton = document.getElementById('start-button');
    const playAgainButton = document.getElementById('play-again-button');
    const targetText = document.getElementById('target-text');
    const userInput = document.getElementById('user-input');
    const scoreResult = document.getElementById('score-result');
    const levelResult = document.getElementById('level-result');
    const timerDisplay = document.getElementById('timer-display');
    const targetWordResult = document.getElementById('target-word-result');
    const userTypedResult = document.getElementById('user-typed-result');
    
    // Game states
    const preGame = document.getElementById('pre-game');
    const activeGame = document.getElementById('active-game');
    const results = document.getElementById('results');
    
    // Game variables
    let currentWord = '';
    let score = 0;
    let level = 1;
    let wordTimer;
    let countdownInterval;
    let timeLeft;
    
    // Bouncing letters variables
    const letters = document.querySelectorAll('.letter');
    const letterObjects = [];
    let animationSpeed = 1; // Base animation speed
    let animationFrame;
    let gameActive = false;
    
    // Initialize bouncing letters
    initBouncingLetters();
    
    // Word lists by length (1-10 letters)
    const wordsByLength = {
        1: ['a'],
        2: ['to', 'of', 'in', 'it', 'is', 'be', 'as', 'at', 'so', 'we', 'he', 'by', 'or', 'on', 'do', 'if', 'me', 'my', 'up', 'an', 'go', 'no', 'us', 'am'],
        3: ['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'any', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'man', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'its', 'let', 'put', 'say', 'she', 'too', 'use'],
        4: ['that', 'with', 'have', 'this', 'will', 'your', 'from', 'they', 'know', 'want', 'been', 'good', 'much', 'some', 'time', 'very', 'when', 'come', 'here', 'just', 'like', 'long', 'make', 'many', 'more', 'only', 'over', 'such', 'take', 'than', 'them', 'well', 'were'],
        5: ['about', 'could', 'their', 'other', 'there', 'first', 'would', 'these', 'thing', 'think', 'water', 'which', 'where', 'after', 'little', 'never', 'every', 'right', 'world', 'house', 'again', 'large', 'since', 'three', 'place', 'sound', 'great', 'still', 'small', 'found'],
        6: ['people', 'through', 'should', 'before', 'because', 'around', 'number', 'school', 'always', 'family', 'important', 'country', 'mother', 'father', 'friend', 'enough', 'second', 'listen', 'happen', 'system', 'during', 'answer'],
        7: ['between', 'example', 'however', 'nothing', 'thought', 'welcome', 'without', 'morning', 'company', 'problem', 'service', 'against', 'program', 'picture', 'whether', 'someone', 'tonight', 'society', 'history', 'student'],
        8: ['question', 'business', 'remember', 'together', 'children', 'national', 'continue', 'American', 'computer', 'decision', 'different', 'economic', 'possible', 'position', 'practice', 'language', 'personal', 'hospital', 'movement', 'material'],
        9: ['important', 'something', 'education', 'following', 'available', 'political', 'community', 'certainly', 'president', 'beautiful', 'necessary', 'situation', 'structure', 'character', 'sometimes', 'direction', 'condition', 'agreement', 'challenge', 'yesterday'],
        10: ['government', 'experience', 'technology', 'understand', 'particular', 'university', 'everything', 'themselves', 'management', 'individual', 'television', 'throughout', 'difference', 'population', 'especially', 'conference', 'production', 'collection', 'performance', 'appreciate']
    };
    
    // Event listeners
    startButton.addEventListener('click', startGame);
    playAgainButton.addEventListener('click', resetGame);
    
    // Functions for bouncing letters
    function initBouncingLetters() {
        letters.forEach((letter, index) => {
            // Set random initial positions
            const x = Math.random() * (window.innerWidth - 100);
            const y = Math.random() * (window.innerHeight - 100);
            
            // Set random velocities (slow for pre-game)
            const vx = (Math.random() - 0.5) * 2;
            const vy = (Math.random() - 0.5) * 2;
            
            // Set random rotation
            const rotation = 0;
            const rotationSpeed = (Math.random() - 0.5) * 2;
            
            // Store letter properties
            letterObjects.push({
                element: letter,
                x: x,
                y: y,
                vx: vx,
                vy: vy,
                rotation: rotation,
                rotationSpeed: rotationSpeed
            });
            
            // Set initial position
            updateLetterPosition(letterObjects[index]);
        });
        
        // Start animation
        animateLetters();
    }
    
    function updateLetterPosition(letterObj) {
        letterObj.element.style.left = letterObj.x + 'px';
        letterObj.element.style.top = letterObj.y + 'px';
        letterObj.element.style.transform = `rotate(${letterObj.rotation}deg)`;
    }
    
    function animateLetters() {
        // Update each letter's position and rotation
        letterObjects.forEach(letterObj => {
            // Update position based on velocity and animation speed
            letterObj.x += letterObj.vx * animationSpeed;
            letterObj.y += letterObj.vy * animationSpeed;
            
            // Update rotation
            letterObj.rotation += letterObj.rotationSpeed * animationSpeed;
            
            // Bounce off edges
            const letterWidth = letterObj.element.offsetWidth;
            const letterHeight = letterObj.element.offsetHeight;
            
            if (letterObj.x <= 0 || letterObj.x >= window.innerWidth - letterWidth) {
                letterObj.vx = -letterObj.vx;
                letterObj.x = Math.max(0, Math.min(letterObj.x, window.innerWidth - letterWidth));
            }
            
            if (letterObj.y <= 0 || letterObj.y >= window.innerHeight - letterHeight) {
                letterObj.vy = -letterObj.vy;
                letterObj.y = Math.max(0, Math.min(letterObj.y, window.innerHeight - letterHeight));
            }
            
            // Update position
            updateLetterPosition(letterObj);
        });
        
        // Continue animation
        animationFrame = requestAnimationFrame(animateLetters);
    }
    
    function updateAnimationSpeed() {
        // Base speed is 1, increase by 0.2 for each level
        animationSpeed = 1 + (level * 0.2);
    }
    
    // Game functions
    function startGame() {
        // Reset game variables
        score = 0;
        level = 1;
        gameActive = true;
        
        // Update animation speed
        updateAnimationSpeed();
        
        // Switch to active game state
        switchGameState('active-game');
        
        // Start with the first word
        showNextWord();
        
        // Focus on input field
        userInput.focus();
    }
    
    function showNextWord() {
        // Clear any existing timers
        clearTimeout(wordTimer);
        clearInterval(countdownInterval);
        
        // Determine word length based on current level
        let wordLength;
        
        if (level === 1) {
            wordLength = 1; // Level 1: 1-letter words
        } else if (level >= 2 && level <= 6) {
            wordLength = 2; // Levels 2-6: 2-letter words
        } else {
            // Level 7+: Increase length every 3 levels
            wordLength = Math.min(10, 2 + Math.ceil((level - 6) / 3));
        }
        
        // Get a random word of appropriate length
        const words = wordsByLength[wordLength];
        const randomIndex = Math.floor(Math.random() * words.length);
        currentWord = words[randomIndex];
        
        // Display the word
        targetText.textContent = currentWord;
        
        // Clear input field
        userInput.value = '';
        
        // Set timer for 2 seconds
        timeLeft = 2;
        updateTimerDisplay();
        
        // Start countdown display
        countdownInterval = setInterval(function() {
            timeLeft -= 0.1;
            updateTimerDisplay();
        }, 100);
        
        // Set timeout to check word after 2 seconds
        wordTimer = setTimeout(function() {
            checkWord();
        }, 2000);
        
        // Focus on input field
        userInput.focus();
    }
    
    function updateTimerDisplay() {
        timerDisplay.textContent = timeLeft.toFixed(1) + 's';
        
        // Update color based on time left
        if (timeLeft <= 0.5) {
            timerDisplay.style.color = 'red';
        } else if (timeLeft <= 1) {
            timerDisplay.style.color = 'orange';
        } else {
            timerDisplay.style.color = 'green';
        }
    }
    
    function checkWord() {
        const userTyped = userInput.value.trim().toLowerCase();
        
        // Check if the word is correct
        if (userTyped === currentWord) {
            // Increase score and level
            score++;
            level++;
            
            // Update animation speed based on new level
            updateAnimationSpeed();
            
            // Show next word
            showNextWord();
        } else {
            // End game on incorrect word
            endGame(userTyped);
        }
    }
    
    function endGame(userTyped = '') {
        // If userTyped wasn't passed (timer ran out), get it from the input field
        if (!userTyped) {
            userTyped = userInput.value.trim().toLowerCase();
        }
        
        // Clear timers
        clearTimeout(wordTimer);
        clearInterval(countdownInterval);
        
        // Display results
        scoreResult.textContent = score;
        levelResult.textContent = level;
        
        // Display the target word and what the user typed
        targetWordResult.textContent = currentWord;
        userTypedResult.textContent = userTyped || '(nothing)';
        
        // Reset game state
        gameActive = false;
        animationSpeed = 1;
        
        // Switch to results state
        switchGameState('results');
    }
    
    function resetGame() {
        // Switch back to pre-game state
        switchGameState('pre-game');
    }
    
    function switchGameState(stateId) {
        // Hide all states
        preGame.classList.remove('active');
        activeGame.classList.remove('active');
        results.classList.remove('active');
        
        // Show the requested state
        document.getElementById(stateId).classList.add('active');
    }
});
