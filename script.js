// import students from './students.js';
import encodedStudents from './encodedStudents.js';
// Decoding the Base64 encoded string
function decodeStudents(encodedData) {
    const decodedString = atob(encodedData); // Decode the Base64 string
    return JSON.parse(decodedString); // Parse the decoded string as JSON
}

// Get the student data by decoding
const students = decodeStudents(encodedStudents);
// console.log(students); // Now you have the decoded students data

document.addEventListener('DOMContentLoaded', () => {
    

    const output = document.getElementById('output');
    const userInput = document.getElementById('user-input');
    let stage = 1;
    let fragments = [];
    let userNumber = "";
    let userGroup = null; // Store the user's group number
    matrixEffect();
    // Fix the terminal height after some point
    // output.style.maxHeight = "600px";
    // output.style.overflowY = "auto";

    const stages = {
        1: stage1Choice,
        2: stage2Challenges,
        3: stage3Final
    };

    // Function to print to terminal with typewriter effect
    let typewriterQueue = Promise.resolve(); // Initialize a queue

    function typewriterEffect(text, callback) {
        typewriterQueue = typewriterQueue.then(() => {
            return new Promise((resolve) => {
                let index = 0;
                const interval = setInterval(() => {
                    output.textContent += text.charAt(index);
                    index++;
                    if (index === text.length) {
                        clearInterval(interval);
                        if (callback) callback();
                        resolve(); // Move to the next queued call
                    }
                }, 10); // The speed of the typewriter effect
            });
        });
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
        printToTerminal("Enter your registration code to decrypt your identity within the Matrix (E/XX/XXX): ");
    }

    function validateRegistrationNumber(regNum) {
        let student = students.boys.find(student => student.E_Num === regNum) ||
                      students.girls.find(student => student.E_Num === regNum);
        return student || null;
    }

    function stage1Choice(input) {
        if (input === "1") {
            printToTerminal("Agent Smith: Welcome to the real world. The truth awaits....\n\n");
            stage = 2;
            stage2Challenges();
        } else if (input === "2") {
            printToTerminal("Agent Smith: You chose comfort over truth. The game ends here.\n");
            resetGame();
        } else {
            printToTerminal("Agent Smith: You’ve spent your life believing what you’ve been told.\nNow, you stand at the edge of reality. Choose:\n1. Red Pill - Face the truth and step into the real world.\n2. Blue Pill - Return to your illusion.\nEnter your choice (1/2):\n");
        }
    }

    function stage2Challenges(input) {
        if (!input) {
            printToTerminal("Agent Smith: The truth is hidden in the fabric of your machine. Decode this sequence:\n87 51 49 67 48 77 51\n(Morpheus: Binary world relies on ASCII)\nEnter the decoded text:\n");
        } else if (input === "W31C0M3" && fragments.length === 0) {
            printToTerminal("Correct! Fragment collected: W31C0M3\n\n");
            fragments.push("W31C0M3");
            printToTerminal("Agent Smith: Letters can also be numbers. Solve this:\n((S - A) + (H / 12)) / (M - A) = ?\n");
        } else if (input === "2" && fragments.length === 1) {
            printToTerminal("Correct! Fragment collected: 2\n\n");
            fragments.push("2");
            printToTerminal("Agent Smith: The truth has been scrambled. Correct the binary and decode this:\n10100000 01100110 10100100 01101000 10000110 01100000 10011010\n\n(Morpheus: Right shift the binary numbers to reveal the secrets from the world of ASCII)");
        } else if (input === "P3R4C0M" && fragments.length === 2) {
            printToTerminal("Correct! Fragment collected: P3R4 C0M\n\n");
            fragments.push("P3R4C0M");
            stage = 3;
            stage3Final();
        } else {
            printToTerminal("Incorrect. Try again.\n");
        }
    }

    function stage3Final(input) {
        if (!input) {
            printToTerminal("Agent Smith: You’ve uncovered fragments of the truth.\nCombine the answers from the challenges into one phrase to reveal the final password:\nEnter the password:\n");
        } else if (input === fragments.join(" ")) {
            printToTerminal(`Agent Smith: Welcome to the realm of Computer Engineering. You've cracked the code and unlocked your destiny. Your group number is ${userGroup}. Welcome to the Matrix—where the real world is written in code.`);
            // resetGame();
        } else {
            printToTerminal("Agent Smith: Combine the fragments in order, exactly as revealed.\nEnter the password:\n");
        }
    }

    function resetGame() {
        printToTerminal("\nRestarting the game...\n");
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
                const student = validateRegistrationNumber(input);
                if (student) {
                    userNumber = input;
                    userGroup = student.group; // Store the group number
                    setTerminalPrompt(); // Change the terminal prompt format
                    printToTerminal(`Welcome ${userNumber}! Now the game begins...\n`);
                    stages[stage](); // Start the first stage
                } else {
                    printToTerminal("Code rejected. You are not yet worthy to break through the Matrix. Try again.\n");
                }
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
