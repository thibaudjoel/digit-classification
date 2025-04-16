import os
import json
from PIL import Image
import base64
import io
import uuid
from google.cloud import storage


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


def upload_data(img, digit):
    filename = f"{digit}-{uuid.uuid4()}.png"
    # Convert image to bytes in memory
    img_byte_arr = io.BytesIO()
    img.save(img_byte_arr, format="PNG")
    img_byte_arr.seek(0)
    # img.save(f"labeled_data/imgs/{filename}")
    upload_blob("label-data-bucket", img_byte_arr, f"labeled_data/imgs/{filename}")


def upload_blob(bucket_name, img_byte_arr, destination_blob_name):
    """Uploads a file to the bucket."""
    # The ID of your GCS bucket
    # bucket_name = "your-bucket-name"
    # The path to your file to upload
    # source_file_name = "local/path/to/file"
    # The ID of your GCS object
    # destination_blob_name = "storage-object-name"

    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(destination_blob_name)

    # Upload to Google Cloud Storage
    client = storage.Client()
    bucket = client.bucket(bucket_name)
    blob = bucket.blob(destination_blob_name)
    blob.upload_from_file(img_byte_arr, content_type="image/png")
