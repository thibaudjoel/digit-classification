from flask import Flask, render_template, request, jsonify
import numpy as np
import tensorflow as tf

from utils import set_up_dirs, standardize_img
import io
import os
import uuid
import json


app = Flask(__name__)

model = tf.keras.models.load_model("model.keras")

set_up_dirs()

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        img = standardize_img(request.json["image"])
        np_array = np.array(img) / 255.0 # in model
        np_array = np_array.reshape(1, 28, 28, 1)

        prediction = np.argmax(model.predict(np_array)[0])
        return jsonify({"prediction": float(prediction)})
    return render_template("index.html")


@app.route("/labeling", methods=["GET", "POST"])
def labeling():
    if request.method == "POST":
        print("OK")
        img = standardize_img(request.json["image"])
        digit = int(request.json["digit"])
        
        # Save it to a file
        filename = f"{uuid.uuid4()}.png"
        img.save(f"labeled_data/imgs/{filename}")

        # Load from JSON
        with open("labeled_data/file_to_digit.json", "r") as f:
            file_to_digit = json.load(f)

        file_to_digit[filename] = digit

        # Save to JSON
        with open("labeled_data/file_to_digit.json", "w") as f:
            json.dump(file_to_digit, f)

    return render_template("labeling.html")


if __name__ == "__main__":
    debug = True #os.environ.get("FLASK_DEBUG", "true").lower() == "true"
    app.run(debug=debug, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
