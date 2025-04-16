from PIL import Image
import base64
import io
import uuid
from google.cloud import storage


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
    upload_blob("label-data-bucket", img_byte_arr, f"labeled_data/imgs/{filename}")


def upload_blob(bucket_name, img_byte_arr, destination_blob_name):
    """Uploads a file to the bucket."""

    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(destination_blob_name)

    client = storage.Client()
    bucket = client.bucket(bucket_name)
    blob = bucket.blob(destination_blob_name)
    blob.upload_from_file(img_byte_arr, content_type="image/png")
