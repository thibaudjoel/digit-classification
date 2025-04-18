const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
ctx.lineWidth = 15;
ctx.strokeStyle = "white";

let isDrawing = false;
let hasDrawn = false;
let x = 0;
let y = 0;

// Helper: Get coordinates from mouse or touch event
function getXY(e) {
  if (e.touches) {
    const rect = canvas.getBoundingClientRect();
    clientX = e.touches[0].clientX;
    clientY = e.touches[0].clientY;

    // Adjust for canvas scaling
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
  
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
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

document.addEventListener("mouseup", () => {
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
  if (digitForm) {
    digitForm.reset();
  }
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
  predictMessage.style.opacity = 1;

  // Display the message then fade out
  setTimeout(function () {
    predictMessage.style.opacity = 0;
  }, 2000
  );
});

  const digitForm = document.getElementById('digitForm');
  if (digitForm) {
    digitForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!hasDrawn) {
        alert('Please draw something before submitting.');
        return;
      }
      const digit = document.getElementById('digit').value;

      // Convert canvas drawing to base64 image
      const imageData = canvas.toDataURL('image/png');
      // Send to backend
      fetch('/labeling', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ drawing: imageData, digit: digit })
      })
        .then(res => {
          if (res.ok) {
            digitForm.reset();
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
            hasDrawn = false;

            // Show success message with flash effect
            const successMessage = document.getElementById("successMessage");
            successMessage.classList.add("flash");
            // Hide the success message after the flash effect 
            setTimeout(() => {
              successMessage.classList.remove("flash");
            }, 2000);
          }
          else {
            alert('Error submitting data.');
          }
        })
        .catch(err => {
          console.error('Submission failed:', err);
          alert('Network or server error.');
        });
    })
  };
