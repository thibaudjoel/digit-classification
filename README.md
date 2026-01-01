**Note: As of 01/2026 the website is no longer maintained**

---

# Digit Classification Web App

This is a [web application](https://digit-classification-456715.web.app) for digit classification using a Convolutional Neural Network (CNN) model. The app allows users to draw digits on a canvas, and it predicts the digit using the trained model.

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
### 2. Set up a virtual environment (optional but recommended)

For Python 3.x, you can create a virtual environment using `venv`. This helps to isolate the dependencies for this project.

- On macOS/Linux:

```bash
python3 -m venv .venv
```

- On Windows:

```bash
python -m venv .venv
```

### 3. Activate the virtual environment

- On macOS/Linux:

```bash
source .venv/bin/activate
```

- On Windows:

```bash
.\.venv\Scripts\activate
```

Once activated, your terminal should indicate that the virtual environment is active.

### 4. Install dependencies

```bash
pip install -r requirements.txt
```

### 5. Train the model (optional)

You can either train your own model or use a pre-trained one:

#### Option A: Train your own model

Open the Jupyter notebook `notebooks/model_training.ipynb`.

Run all the cells up before the section "Finetuning" to train the model on the MNIST data. This will save the model as `best_model.keras`. You can use the code in section "Finetuning" to finetune the model on your own dataset. This will save the model as `best_model_fine_tuning.keras`. Place the model named as in the same directory as `app.py`.
> ⚠️ Change the model path in **line 8** of `app.py` to the name of your model file.

#### Option B: Use a pre-trained model

If you've already trained the model (or downloaded one), place the model named as in the same directory as `app.py`.

> ⚠️ Change the model path in **line 8** of `app.py` to the name of your model file.

---

## 🚀 Usage

Start the Flask server by running the following command from your terminal (assuming you are in the `src/flask_app` directory):

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
├── src/                           # Source code and app-related files  
│   ├── flask_app/                 # Flask app directory  
│   │   ├── app.py                 # Flask server entry point  
│   │   ├── model.keras            # Trained CNN model  
│   │   ├── static/                # Static frontend files  
│   │   │   ├── script.js          # JavaScript for user interaction  
│   │   │   └── style.css          # CSS styles  
│   │   ├── templates/             # HTML templates  
│   │   │   ├── index.html         # Home page (digit input interface)  
│   │   │   └── labeling.html      # Labeling page (for custom labeling)  
│   │   ├── requirements.txt       # Python dependencies (for Docker setup) 
│   │   └── dockerfile             # Dockerfile for containerization   
│   └── utils.py                   # Utility functions  
│
├── notebooks/                     # Jupyter notebooks directory  
│   ├── model_training.ipynb       # Jupyter notebook for training the model  
│   ├── exploration.ipynb          # Data exploration
│   ├── custom_data_preparation.ipynb  # Preprocessing and handling custom data  
│   └── utils.py                   # Utility functions  
│
├── tests/                         # Unit tests directory
├── .gitignore                     # Git ignored files and directories  
├── README.md                      # Project documentation  
└── requirements.txt               # Project-wide Python dependencies  

```

---
