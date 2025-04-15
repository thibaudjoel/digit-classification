const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
ctx.lineWidth = 15;
ctx.strokeStyle = "white"; // Sets the stroke color to blue

let isDrawing = false;
let x = 0;
let y = 0;

// Start drawing when mouse is pressed
canvas.addEventListener("mousedown", (e) => {
  isDrawing = true;
  x = e.offsetX;
  y = e.offsetY;
});

// Draw when the mouse moves
canvas.addEventListener("mousemove", (e) => {
  if (!isDrawing) return;
  ctx.beginPath();
  ctx.lineCap = 'round';
  ctx.moveTo(x, y);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
  
  x = e.offsetX;
  y = e.offsetY;
});

// Stop drawing when mouse is released
canvas.addEventListener("mouseup", () => {
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
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ image: base64Image })
  });

  // Parse the response from the server
  const res_json = await response.json();
  alert(`Prediction: ${res_json.prediction}`);
} 
);
