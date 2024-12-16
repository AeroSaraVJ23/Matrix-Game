document.addEventListener('DOMContentLoaded', () => {
    const output = document.getElementById('output');
    const userInput = document.getElementById('user-input');
    let stage = 1;
    let fragments = [];
    let userNumber = "";
    matrixEffect();

    const stages = {
        1: stage1Choice,
        2: stage2Challenges,
        3: stage3Final
    };

    // Function to print to terminal with typewriter effect
    function typewriterEffect(text, callback) {
        let index = 0;
        const interval = setInterval(() => {
            output.textContent += text.charAt(index);
            index++;
            if (index === text.length) {
                clearInterval(interval);
                if (callback) callback();
            }
        }, 50); // Adjust the speed of the typewriter effect here
    }

    // Function to print to terminal and keep scrolling down
    function printToTerminal(text) {
        typewriterEffect(text, () => {
            output.scrollTop = output.scrollHeight;
        });
    }

    // Function to set the terminal prompt format (user_number@matrix$:)
    function setTerminalPrompt() {
        const promptText = `${userNumber}@matrix$: `;
        userInput.placeholder = promptText;
    }

    // Function to ask for user registration number
    function askForRegistrationNumber() {
        printToTerminal("Please enter your registration number: ");
    }

    function stage1Choice(input) {
        if (input === "1") {
            printToTerminal("Morpheus: Welcome to the real world. The truth awaits.\n");
            stage = 2;
            stage2Challenges();
        } else if (input === "2") {
            printToTerminal("Morpheus: You chose comfort over truth. The game ends here.\n");
            resetGame();
        } else {
            printToTerminal("Invalid choice. Enter 1 or 2.");
        }
    }

    function stage2Challenges(input) {
        if (!input) {
            printToTerminal(`Agent Smith: Solve three puzzles to unlock the truth.\n\nPuzzle 1: Decode this ASCII sequence:\n87 51 49 67 48 77 51\nEnter your answer:\n`);
        } else if (input === "W31C0ME" && fragments.length === 0) {
            printToTerminal("Correct! Fragment collected: W31C0ME\n");
            fragments.push("W31C0ME");
            printToTerminal(`\nPuzzle 2: Solve the ASCII-based equation:\n(B + E - L) * (M - A) = ?\n`);
        } else if (input === "2" && fragments.length === 1) {
            printToTerminal("Correct! Fragment collected: 2\n");
            fragments.push("2");
            printToTerminal(`\nPuzzle 3: Decode the binary:\n10100000 01100110 10100100 01101000 10000110 01100000 10011010\n`);
        } else if (input === "P3R4 C0M" && fragments.length === 2) {
            printToTerminal("Correct! Fragment collected: P3R4 C0M\n");
            fragments.push("P3R4 C0M");
            stage = 3;
            stage3Final();
        } else {
            printToTerminal("Incorrect. Try again.");
        }
    }

    function stage3Final(input) {
        if (!input) {
            printToTerminal(`\nMorpheus: Combine all fragments to reveal the final password:\nEnter the password:\n`);
        } else if (input === fragments.join(" ")) {
            printToTerminal("Morpheus: You’ve unlocked the final truth. Your group number is 42.");
            resetGame();
        } else {
            printToTerminal("Incorrect. Combine the fragments in the correct order.");
        }
    }

    function resetGame() {
        printToTerminal("\nRestarting the game...");
        stage = 1;
        fragments = [];
        setTimeout(() => stages[stage](), 1000);
    }

    // Handle user input
    userInput.addEventListener('keydown', (event) => {
        if (event.key === "Enter") {
            const input = userInput.value.trim();
            userInput.value = "";
            if (userNumber === "") {
                // Register the user number
                userNumber = input;
                setTerminalPrompt(); // Change the terminal prompt format
                printToTerminal(`Welcome ${userNumber}! Now the game begins...\n`);
                stages[stage](); // Start the first stage
            } else if (stages[stage]) {
                stages[stage](input); // Handle game input
            }
        }
    });

    // Ask for the registration number initially
    askForRegistrationNumber();
});

function matrixEffect() {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Set canvas style for background effect
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.zIndex = "-1"; // Send canvas behind other elements
    canvas.style.pointerEvents = "none"; // Allow clicks through the canvas

    document.body.appendChild(canvas);

    // Set initial canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Update canvas size on window resize
    window.addEventListener("resize", () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const charArray = characters.split("");
    const fontSize = 16;
    const columns = Math.floor(canvas.width / fontSize);

    const drops = Array(columns).fill(1);

    function draw() {
        ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#0F0"; // Matrix green color
        ctx.font = `${fontSize}px monospace`;

        drops.forEach((y, index) => {
            const text = charArray[Math.floor(Math.random() * charArray.length)];
            const x = index * fontSize;
            ctx.fillText(text, x, y * fontSize);

            if (y * fontSize > canvas.height && Math.random() > 0.975) {
                drops[index] = 0;
            }

            drops[index]++;
        });
    }

    setInterval(draw, 50);
}
