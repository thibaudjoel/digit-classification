from flask import Flask, render_template, request, jsonify
import numpy as np
import tensorflow as tf
from utils import set_up_dirs, standardize_img, upload_data
import os

app = Flask(__name__)
model = tf.keras.models.load_model("model.keras")
set_up_dirs()


@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        img = standardize_img(request.json["image"])
        np_array = np.array(img).reshape(1, 28, 28, 1)
        prediction = np.argmax(model.predict(np_array))
        return jsonify({"prediction": float(prediction)})
    return render_template("index.html")


@app.route("/labeling", methods=["GET", "POST"])
def labeling():
    if request.method == "POST":
        digit = request.json.get("digit")
        drawing = request.json.get("drawing")
        img = standardize_img(drawing)
        digit = int(digit)
        upload_data(img, digit)

    return render_template("labeling.html")


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
