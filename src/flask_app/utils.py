from PIL import Image
import base64
import io
import uuid
from google.cloud import storage


def standardize_img(img: str) -> Image.Image:
    """Standardizes the image by converting it to grayscale
        and resizing it to 28x28 pixels."""
    encoded = img.split(",", 1)[1]
    binary_data = base64.b64decode(encoded)
    image = Image.open(io.BytesIO(binary_data)).convert("L")  # Grayscale

    return image.resize((28, 28))


def upload_data(img: Image.Image, digit: int) -> None:
    """Uploads the image to Google Cloud Storage with a unique
        filename based on the digit."""
    filename = f"{digit}-{uuid.uuid4()}.png"
    img_byte_arr = io.BytesIO()
    img.save(img_byte_arr, format="PNG")
    img_byte_arr.seek(0)
    upload_blob(
        "label-data-bucket",
        img_byte_arr,
        f"labeled_data/imgs/{filename}"
        )


def upload_blob(
        bucket_name: str,
        img_byte_arr: io.BytesIO,
        destination_blob_name: str
        ) -> None:
    """Uploads a file to the bucket."""

    client = storage.Client()
    bucket = client.bucket(bucket_name)
    blob = bucket.blob(destination_blob_name)
    try:
        blob.upload_from_file(img_byte_arr, content_type="image/png")
    except Exception as e:
        raise Exception(
            f"Failed to upload {destination_blob_name} to {bucket_name}: {e}"
        )
