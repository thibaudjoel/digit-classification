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
});

document.getElementById("predictBtn").addEventListener("click", async () => {
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
  alert(`Prediction: ${res_json.prediction}`);
} 
);

// Prevent form submission if canvas is empty
document.getElementById('digitForm').addEventListener('submit', function(e) {
  if (!hasDrawn) {
    alert('Please draw something before submitting.');
    e.preventDefault();
  }
  // Get digit input
  const digit = document.getElementById('digit').value;

  // Convert canvas drawing to base64 image
  const imageData = canvas.toDataURL('image/png'); // base64-encoded PNG

  // Prepare form data
  const formData = new FormData();
  formData.append('digit', digit);
  formData.append('drawing', imageData);

  // Send to backend
  fetch('/labeling', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: formData
  })
  .then(res => res.ok ? alert('Submitted!') : alert('Error submitting form.'))
  .catch(err => console.error('Submission failed:', err));
});
