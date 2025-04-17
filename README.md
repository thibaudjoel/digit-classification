# Digit Classification Web App

This is a web application for digit classification using a Convolutional Neural Network (CNN) model. The app allows users to draw digits on a canvas, and it predicts the digit using the trained model.

---

## ✨ Features

- 🖌️ Draw digits on an interactive canvas  
- 🤖 Predict the drawn digit using a trained CNN model  
- 🧼 Clear the canvas with one click  
- 🏷️ Submit labeled data to further improve training  

---

## 🛠️ Technologies Used
- **TensorFlow** – Used to build and train the CNN model  
- **Flask** – A lightweight Python web framework for serving the app  
- **HTML5 + JavaScript** – For drawing interface on the frontend
- **Jupyter Notebook** – For training the model interactively
- **Docker** – For containerization (optional)
- **GCP** – For deploying the app (optional)

---

## Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/thibaudjoel/digit-classification.git
cd digit-classification
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Train the model (optional)

You can either train your own model or use a pre-trained one:

#### Option A: Train your own model

Open the Jupyter notebook:

```bash
jupyter notebook model_training.ipynb
```

Run all the cells up before the section "Finetuning" to train the model on the MNIST data. This will save the model as `best_model.keras`. You can use the code in section "Finetuning" to finetune the model on your own dataset.
This will save the model as `best_model_fine_tuning.keras`.

#### Option B: Use a pre-trained model

If you've already trained the model (or downloaded one), place the model named as in the same directory as `app.py`.

> ⚠️ Change the model path in **line 8** of `app.py` to the name of your model file.

---

## 🚀 Usage

Start the Flask server:

```bash
python3 app.py
```

Then open your browser and go to:

```
http://localhost:8080
```

You should see the digit drawing interface.

---

## 📁 Project Structure
```
digit-classification/
│
├── flask_app/                     # Flask app directory  
│   ├── app.py                     # Flask server entry point  
│   ├── model.keras                # Trained CNN model  
│   ├── static/                    # Static frontend files  
│   │   ├── script.js              # JavaScript for user interaction  
│   │   └── style.css              # CSS styles  
│   ├── templates/                 # HTML templates  
│   │   ├── index.html             # Home page (digit input interface)  
│   │   └── labeling.html          # Labeling page (for custom labeling)  
│   └── requirements.txt           # Python dependencies (for Docker setup)  
│
├── Dockerfile                     # Dockerfile for containerization  
├── .gitignore                     # Git ignored files and directories  
├── README.md                      # Project documentation  
├── model_training.ipynb           # Jupyter notebook for training the model  
├── exploration.ipynb              # Data exploration and EDA  
├── custom_data_preparation.ipynb  # Preprocessing and handling custom data  
├── requirements.txt               # Project-wide Python dependencies  
└── utils.py                       # Utility functions (e.g., preprocessing, prediction)
```

---
