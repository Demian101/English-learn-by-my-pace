from text2voice import text_to_voice
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from starlette.responses import FileResponse
from pathlib import Path
from fastapi.middleware.cors import CORSMiddleware

def removeChar(text: str) -> str:
    res = text.replace(' ',' ').replace(' ',' ')
    return res

app = FastAPI()

# CORS 跨域问题要从后端解决。。。
origins = [
    "http://localhost:8080",
    "http://localhost:3000",
]

# handle CORS 跨域问题
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/text2voice/") # ,status_code=200
def convert_text_to_voice(text: str):
    text_ = removeChar(text)
    filename = text_to_voice(text_)
    return {"filename": filename}

# @app.get("/download/{filename}")
# def download_file(filename:str):
#     file_path = Path('voices') / Path(filename)
#     return FileResponse(file_path.as_posix(), filename=filename)