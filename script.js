import { encodedStudents } from "./encodedStudents.js";

// Function to decode the Base64 encoded string
function decodeStudents(encodedData) {
  const decodedString = atob(encodedData); // Decode Base64 string
  return JSON.parse(decodedString); // Convert to JSON
}

// Decode the students object
const students = decodeStudents(encodedStudents);
console.log(students); // Verify the decoded content

document.addEventListener("DOMContentLoaded", () => {
  const output = document.getElementById("output");
  const userInput = document.getElementById("user-input");
  const hintButton = document.getElementById("hint-button-terminal");

  hintButton.addEventListener("click", () => {
    console.log("Hint button clicked. Current hint stage:", currentHint);

    if (currentHint === 1) {
      addMorpheusCharacter(
        "Hint: Binary world relies on ASCII",
        "bottom",
        "20px"
      );
    } else if (currentHint === 2) {
      addMorpheusCharacter(
        "Hint: Letters can also be numbers.",
        "bottom",
        "50px"
      );
    } else if (currentHint === 3) {
      addMorpheusCharacter(
        "Hint: Right shift the binary numbers once to reveal the secrets from the world of ASCII",
        "top",
        "80px"
      );
    } else if (currentHint === 4) {
      addMorpheusCharacter("Hint: Tipical join with spaces", "top", "80px");
    } else {
      addMorpheusCharacter(
        "Welcome, I'm Morpheus. I'm here to help you",
        "top",
        "80px"
      );
    }
  });

  let currentHint = 0; // Track which hint to show for current stage

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
    3: stage3Final,
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
        }, 30); // The speed of the typewriter effect
      });
    });
  }

  // Function to print to terminal and keep scrolling down
  function printToTerminal(text) {
    typewriterEffect(text, () => {
      output.scrollTop = output.scrollHeight;
    });
  }
  function printToTerminalIcon(text) {
    // Assuming 'output' is the container element where content is printed
    const output = document.getElementById("output");

    // Append the text as HTML content (innerHTML)
    typewriterEffect(text, () => {
      output.innerHTML += `<i class="fa-solid fa-bullhorn">${text}</i>`; // Adds the <i> tag around text
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
    printToTerminal(
      "Enter your registration code to decrypt your identity within the Matrix (E/XX/XXX): "
    );
  }

  function validateRegistrationNumber(regNum) {
    let student =
      students.boys.find((student) => student.E_Num === regNum) ||
      students.girls.find((student) => student.E_Num === regNum);
    return student || null;
  }

  function stage1Choice(input) {
    if (input === "1") {
      printToTerminal(
        "Morpheus: Welcome to the real world. The truth awaits....\n\n"
      );
      stage = 2;
      stage2Challenges();
    } else if (input === "2") {
      printToTerminal(
        "Morpheus: You chose comfort over truth. The game ends here.\n"
      );
      resetGame();
    } else {
      printToTerminal(
        "Morpheus: You’ve spent your life believing what you’ve been told.\nNow, you stand at the edge of reality. \n\nChoose:\n1. Red Pill - Face the truth and step into the real world.\n2. Blue Pill - Return to your illusion.\nEnter your choice (1/2):\n"
      );
    }
  }

  function stage2Challenges(input) {
    if (!input) {
      printToTerminal(
        "Agent Smith: The truth is hidden in the fabric of your machine. Decode this sequence:\n87 51 49 67 48 77 51\n(Click the hint button for a hint!)\nEnter the decoded text:\n"
      );
      currentHint = 1; // Set hint stage to 1
      console.log("Hint set to:", currentHint);
    } else if (input === "W31C0M3" && fragments.length === 0) {
      printToTerminal("Correct! Fragment collected: W31C0M3\n\n");
      fragments.push("W31C0M3");
      printToTerminal(
        "Agent Smith: Your next task is :\n((S - A) + (H / 12)) / (M - A) = ?\n"
      );
      currentHint = 2; // Set hint stage to 2
      console.log("Hint set to:", currentHint);
    } else if (input === "2" && fragments.length === 1) {
      printToTerminal("Correct! Fragment collected: 2\n\n");
      fragments.push("2");
      printToTerminal(
        "Agent Smith: The truth has been scrambled. Correct the binary and decode this:\n10100000 01100110 10100100 01101000 10000110 01100000 10011010\n\n(Click the hint button for a hint!)"
      );
      currentHint = 3; // Set hint stage to 3
      console.log("Hint set to:", currentHint);
    } else if (input === "P3R4C0M" && fragments.length === 2) {
      printToTerminal("Correct! Fragment collected: P3R4C0M\n\n");
      fragments.push("P3R4C0M");
      stage = 3;
      console.log("Hint set to:", currentHint);
      stage3Final();
    } else {
      printToTerminal("Incorrect. Try again.\n");
    }
  }

  function stage3Final(input) {
    if (!input) {
      printToTerminal(
        "Agent Smith: You’ve uncovered fragments of the truth.\nCombine the answers from the challenges into one phrase to reveal the final password:\nEnter the password:\n"
      );
      currentHint = 4;
    } else if (input === fragments.join(" ")) {
      printToTerminal(
        `Agent Smith: Welcome to the realm of Computer Engineering. You've cracked the code and unlocked your destiny. Your group number is ${userGroup}. Welcome to the Matrix—where the real world is written in code.`
      );
      // resetGame();
    } else {
      printToTerminal(
        "Agent Smith: Combine the fragments in order, exactly as revealed.\nEnter the password:\n"
      );
    }
  }

  function resetGame() {
    printToTerminal("\nRestarting the game...\n");
    stage = 1;
    fragments = [];
    setTimeout(() => stages[stage](), 1000);
  }

  // Handle user input
  userInput.addEventListener("keydown", (event) => {
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
          printToTerminal(
            "Code rejected. You are not yet worthy to break through the Matrix. Try again.\n"
          );
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

function addNeoCharacter() {
  // Create the container for Neo and the instruction bubble
  const neoContainer = document.createElement("div");
  neoContainer.id = "neo-container";
  document.body.appendChild(neoContainer);

  // Create the Neo image
  const neoImage = document.createElement("img");
  neoImage.src = "./img/Neo.png";
  neoImage.id = "neo-image";
  neoContainer.appendChild(neoImage);

  // Create the instruction bubble above the head
  const instructionBubble = document.createElement("div");
  instructionBubble.id = "instruction-bubble";
  instructionBubble.textContent = "Press 'Enter' to interact with Neo.";
  neoContainer.appendChild(instructionBubble);

  // Apply sliding animation and positioning
  neoContainer.style.position = "absolute";
  neoContainer.style.bottom = "20px";
  neoContainer.style.left = "-300px"; // Start off-screen to the left
  neoContainer.style.transition = "left 1s ease-out";

  // Position the bubble above Neo's head
  instructionBubble.style.position = "absolute";
  instructionBubble.style.bottom = "100%";
  instructionBubble.style.left = "50%";
  instructionBubble.style.transform = "translateX(-50%)";
  instructionBubble.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
  instructionBubble.style.color = "white";
  instructionBubble.style.padding = "10px";
  instructionBubble.style.borderRadius = "5px";
  instructionBubble.style.fontSize = "16px";

  // Show Neo by moving it into view
  setTimeout(() => {
    neoContainer.style.left = "20px"; // Slide Neo into view from the left
  }, 100); // Slight delay to trigger the animation

  // Animation for the bubble fade-in
  setTimeout(() => {
    instructionBubble.style.opacity = "1";
  }, 500);
}

function addMorpheusCharacter(
  hintText = "I am Morpheus",
  position = "bottom",
  offset = "20px"
) {
  // Remove any existing Morpheus container
  const existingContainer = document.getElementById("neo-container");
  if (existingContainer) existingContainer.remove();

  // Create the container for Morpheus and the hint bubble
  const morpheusContainer = document.createElement("div");
  morpheusContainer.id = "neo-container";
  morpheusContainer.style.zIndex = "1000";
  morpheusContainer.style.position = "fixed";
  morpheusContainer.style.top = "20px";
  morpheusContainer.style.right = "-350px";
  morpheusContainer.style.transition = "right 1s ease-out";
  document.body.appendChild(morpheusContainer);

  // Create the Morpheus image
  const morpheusImage = document.createElement("img");
  morpheusImage.src = "./img/Morpheus.png";
  morpheusImage.style.width = "100px";
  morpheusImage.style.height = "auto";
  morpheusContainer.appendChild(morpheusImage);

  // Create the hint bubble below Morpheus
  const hintBubble = document.createElement("div");
  hintBubble.textContent = hintText;
  hintBubble.style.position = "absolute";
  hintBubble.style.top = "85%";
  hintBubble.style.left = "100%"; // Center the bubble within the container
  hintBubble.style.transform = "translateX(-100%)"; // Center-align the bubble
  hintBubble.style.maxWidth = "50px"; // Ensure bubble width does not exceed limits
  hintBubble.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
  hintBubble.style.color = "#00ff00";
  hintBubble.style.padding = "20px 30px"; // Increased padding
  hintBubble.style.borderRadius = "10px";
  hintBubble.style.fontSize = "18px";
  hintBubble.style.lineHeight = "1.6";
  hintBubble.style.textAlign = "center";
  hintBubble.style.width = "300px";
  hintBubble.style.maxWidth = "350px"; // Restrict max width
  hintBubble.style.opacity = "0";
  hintBubble.style.transition = "opacity 0.5s ease-in-out";
  hintBubble.style.boxShadow = "0 0 10px rgba(0, 255, 0, 0.7)"; // Green glow
  morpheusContainer.appendChild(hintBubble);

  // Slide Morpheus into view
  setTimeout(() => {
    morpheusContainer.style.right = "20px";
  }, 100);

  // Fade in the bubble
  setTimeout(() => {
    hintBubble.style.opacity = "1";
  }, 500);

  // Remove Morpheus after 5 seconds
  setTimeout(() => {
    hintBubble.style.opacity = "0";
    setTimeout(() => {
      morpheusContainer.remove();
    }, 500);
  }, 5000);
}
