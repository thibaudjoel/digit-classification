from flask import Flask, render_template, request, jsonify
import numpy as np
import tensorflow as tf
from PIL import Image
import io
import base64
import os


app = Flask(__name__)

model = tf.keras.models.load_model("model.keras")


@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        data = request.json["image"]
        header, encoded = data.split(",", 1)
        binary_data = base64.b64decode(encoded)
        image = Image.open(io.BytesIO(binary_data)).convert("L")  # Grayscale
        
        # maybe inside model
        image = image.resize((28, 28))
        np_array = np.array(image) / 255.0
        np_array = np_array.reshape(1, 28, 28, 1)
        
        prediction = np.argmax(model.predict(np_array)[0])
        return jsonify({"prediction": float(prediction)})
    return render_template("index.html")


if __name__ == "__main__":
    debug=os.environ.get("FLASK_DEBUG", "false").lower() == "true"
    app.run(debug, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
