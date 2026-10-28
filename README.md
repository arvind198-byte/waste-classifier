# WasteWise — AI Waste Identification and Segregation Assistant

A student prototype for BCS508 using a pretrained ResNet50-based TrashNet classifier from Hugging Face, FastAPI, and React/Vite.

## Categories
Cardboard, glass, metal, paper, plastic, trash.

## Requirements
- Python 3.13 (64-bit) and a recent pip
- Node.js LTS
- Internet access the first time the pretrained model is downloaded

## 1. Backend (Windows PowerShell)
From this folder:

```powershell
py -3.13 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
uvicorn main:app --reload
```

The first startup downloads the model from Hugging Face and may take a few minutes. Test `http://127.0.0.1:8000/health` and API docs at `http://127.0.0.1:8000/docs`.

## 2. Frontend
Open a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`). Keep the backend terminal running.

## Notes
- Model source: https://huggingface.co/Stefaron/trash-classifier (MIT license listed on the model page).
- Pretrained model classes are broad waste categories, not arbitrary object recognition.
- This project provides general disposal suggestions; actual recycling acceptance differs by locality.
- Prediction scores are not guaranteed to be calibrated probabilities.
- Validate predictions with several known images before presenting the prototype.
