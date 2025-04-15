import os
import json
from PIL import Image
import base64
import io
import uuid


def set_up_dirs():
    # Folder and file path
    folder_name = "labeled_data"
    json_filename = "file_to_digit.json"
    full_path = os.path.join(folder_name, json_filename)

    # Create folder if it doesn't exist
    os.makedirs(folder_name, exist_ok=True)
    os.makedirs(f"{folder_name}/imgs", exist_ok=True)

    # Load or initialize the JSON file
    if os.path.exists(full_path):
        with open(full_path, "r") as f:
            file_to_digit = json.load(f)
    else:
        file_to_digit = {}
        with open(full_path, "w") as f:
            json.dump(file_to_digit, f)


def standardize_img(img):
    encoded = img.split(",", 1)[1]
    binary_data = base64.b64decode(encoded)
    image = Image.open(io.BytesIO(binary_data)).convert("L")  # Grayscale

    return image.resize((28, 28))


def save_data(img, digit):
    filename = f"{uuid.uuid4()}.png"
    img.save(f"labeled_data/imgs/{filename}")

    with open("labeled_data/file_to_digit.json", "r") as f:
        file_to_digit = json.load(f)

    file_to_digit[filename] = digit

    with open("labeled_data/file_to_digit.json", "w") as f:
        json.dump(file_to_digit, f)
