import tensorflow as tf
import os
import matplotlib.pyplot as plt
from tensorflow.keras.callbacks import Callback
from IPython.display import clear_output


def decode_img(img: tf.Tensor) -> tf.Tensor:
    """Decodes the image and resizes it to 28x28 pixels."""
    img = tf.io.decode_png(img, channels=1)
    return tf.image.resize(img, [28, 28])


def process_path(file_path: str) -> tuple[tf.Tensor, int]:
    label = int(tf.strings.split(file_path, os.sep)[-2])
    return decode_img(tf.io.read_file(file_path)), label


class LivePlot(Callback):
    def on_train_begin(self, logs=None):
        self.acc = []
        self.val_acc = []
        self.loss = []
        self.val_loss = []

    def on_epoch_end(self, epoch, logs=None):
        self.acc.append(logs.get('accuracy'))
        self.val_acc.append(logs.get('val_accuracy'))
        self.loss.append(logs.get('loss'))
        self.val_loss.append(logs.get('val_loss'))

        clear_output(wait=True)
        plt.figure(figsize=(12, 4))

        # Accuracy
        plt.subplot(1, 2, 1)
        plt.plot(self.acc, label='Train Acc')
        plt.plot(self.val_acc, label='Val Acc')
        plt.title('Accuracy')
        plt.xlabel('Epoch')
        plt.ylabel('Accuracy')
        plt.legend()
        plt.grid(True)

        # Loss
        plt.subplot(1, 2, 2)
        plt.plot(self.loss, label='Train Loss')
        plt.plot(self.val_loss, label='Val Loss')
        plt.title('Loss')
        plt.xlabel('Epoch')
        plt.ylabel('Loss')
        plt.legend()
        plt.grid(True)

        plt.tight_layout()
        plt.show()
