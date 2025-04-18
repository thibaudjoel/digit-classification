import base64
import io
import pytest
from unittest.mock import patch, MagicMock
from PIL import Image
from src.flask_app.utils import upload_data, standardize_img, upload_blob


@pytest.fixture
def mock_image():
    img = Image.new("L", (28, 28))  # Mock Grayscale image
    return img


@patch("src.flask_app.utils.upload_blob")
def test_upload_data(mock_upload_blob, mock_image):
    digit = 5
    mock_upload_blob.return_value = None  # Mock upload_blob to do nothing

    upload_data(mock_image, digit)

    assert mock_upload_blob.called, "upload_blob was not called"
    args = mock_upload_blob.call_args[0]
    assert args[0] == "label-data-bucket", "Bucket name is incorrect"
    assert args[2].startswith(
        f"labeled_data/imgs/{digit}-"
    ), "Filename format is incorrect"
    assert args[2].endswith(".png"), "Filename extension is incorrect"
    assert isinstance(
        args[1], io.BytesIO
    ), "Image data is not a BytesIO object"


@pytest.fixture
def mock_base64_image():
    img = Image.new("RGB", (100, 100))  # Mock RGB image
    img_byte_arr = io.BytesIO()
    img.save(img_byte_arr, format="PNG")
    img_byte_arr.seek(0)
    encoded_img = base64.b64encode(img_byte_arr.getvalue()).decode("utf-8")
    return f"data:image/png;base64,{encoded_img}"


def test_standardize_img(mock_base64_image):
    standardized_img = standardize_img(mock_base64_image)

    assert isinstance(
        standardized_img, Image.Image
    ), "Standardized image is not an Image object"
    assert standardized_img.mode == "L", "Image is not in grayscale mode"
    assert standardized_img.size == (28, 28), "Image size is not 28x28"


@patch("src.flask_app.utils.storage.Client")
def test_upload_blob(mock_storage_client):
    mock_client_instance = MagicMock()
    mock_bucket = MagicMock()
    mock_blob = MagicMock()
    mock_storage_client.return_value = mock_client_instance
    mock_client_instance.bucket.return_value = mock_bucket
    mock_bucket.blob.return_value = mock_blob

    bucket_name = "test-bucket"
    img_byte_arr = io.BytesIO(b"test image data")
    destination_blob_name = "test/path/image.png"

    upload_blob(bucket_name, img_byte_arr, destination_blob_name)

    mock_storage_client.assert_called_once()
    mock_client_instance.bucket.assert_called_once_with(bucket_name)
    mock_bucket.blob.assert_called_once_with(destination_blob_name)
    mock_blob.upload_from_file.assert_called_once_with(
        img_byte_arr, content_type="image/png"
    )

    mock_blob.upload_from_file.side_effect = Exception("Upload failed")
    with pytest.raises(Exception):
        upload_blob(bucket_name, img_byte_arr, destination_blob_name)
