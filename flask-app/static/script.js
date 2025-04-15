console.log("Script.js loaded");
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
ctx.lineWidth = 15;
ctx.strokeStyle = "white"; // Sets the stroke color to blue

let isDrawing = false;
let hasDrawn = false;
let x = 0;
let y = 0;

// Helper: Get coordinates from mouse or touch event
function getXY(e) {
  if (e.touches) {
    return {
      x: e.touches[0].clientX - canvas.getBoundingClientRect().left,
      y: e.touches[0].clientY - canvas.getBoundingClientRect().top
    };
  }
  return {
    x: e.offsetX,
    y: e.offsetY
  };
}

// MOUSE EVENTS
canvas.addEventListener("mousedown", (e) => {
  isDrawing = true;
  const pos = getXY(e);
  x = pos.x;
  y = pos.y;
});

canvas.addEventListener("mousemove", (e) => {
  if (!isDrawing) return;
  hasDrawn = true;
  const pos = getXY(e);
  ctx.beginPath();
  ctx.lineCap = 'round';
  ctx.moveTo(x, y);
  ctx.lineTo(pos.x, pos.y);
  ctx.stroke();
  x = pos.x;
  y = pos.y;
});

canvas.addEventListener("mouseup", () => {
  isDrawing = false;
});

// TOUCH EVENTS
canvas.addEventListener("touchstart", (e) => {
  e.preventDefault(); // Prevent scrolling
  isDrawing = true;
  const pos = getXY(e);
  x = pos.x;
  y = pos.y;
});

canvas.addEventListener("touchmove", (e) => {
  if (!isDrawing) return;
  hasDrawn = true;
  const pos = getXY(e);
  ctx.beginPath();
  ctx.lineCap = 'round';
  ctx.moveTo(x, y);
  ctx.lineTo(pos.x, pos.y);
  ctx.stroke();
  x = pos.x;
  y = pos.y;
});

canvas.addEventListener("touchend", () => {
  isDrawing = false;
});

// Save the canvas as an image
document.getElementById("resetBtn").addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  hasDrawn = false;
});

const predictBtn = document.getElementById("predictBtn");
if (predictBtn) predictBtn.addEventListener("click", async () => {
  if (!hasDrawn) {
    return;
  }
  // Convert the canvas to a base64-encoded PNG image
  const base64Image = canvas.toDataURL("image/png");

  // Send the base64 image to the server
  const response = await fetch('/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ image: base64Image })
  });

  // Parse the response from the server
  const res_json = await response.json();
  const predictMessage = document.getElementById("predictMessage");
  predictMessage.innerHTML = "Prediction: " + res_json.prediction;
  predictMessage.style.display = "block";
  predictMessage.style.opacity = 1;
  predictMessage.classList.add("fadeIn");

  // Display the message for a short time (e.g., 3 seconds) then fade out
  setTimeout(function() {
      predictMessage.style.opacity = 0;  // Start fade-out
  }, 3000); // Message will stay for 3 seconds

  // After the fade-out duration, hide the message again
  setTimeout(function() {
      predictMessage.style.display = "none";  // Hide after fade-out is complete
  }, 5000); // Hide after 5 seconds (2 seconds fade-out)
  // alert(`Prediction: ${res_json.prediction}`);
} 
);

const digitForm = document.getElementById('digitForm');
if (digitForm) {
  digitForm.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!hasDrawn) {
      alert('Please draw something before submitting.');
      return;
    }
    // Get digit input
    const digit = document.getElementById('digit').value;

    // Convert canvas drawing to base64 image
    const imageData = canvas.toDataURL('image/png'); // base64-encoded PNG

    // Send to backend
    fetch('/labeling', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ drawing: imageData, digit: digit })
    })
    digitForm.reset(); // Clears the digit input
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clears the canvas
    hasDrawn = false;

    // Show success message with flash effect
    const successMessage = document.getElementById("successMessage");
    successMessage.style.display = "block"; // Make the message visible

    // Flash the message by adding the animation class
    successMessage.classList.add("flash");

    // Hide the success message after the flash effect (0.5s)
    setTimeout(() => {
      successMessage.style.display = "none"; // Hide the message completely
      successMessage.classList.remove("flash"); // Reset animation class
    }, 1000);
    
    // .then(res => res.ok ? alert('Submitted!') : alert('Error submitting form.'))
    // .catch(err => console.error('Submission failed:', err));
  })
};
