# 文件名 text2voice.py 
from gtts import gTTS
# import pyttsx3
from pathlib import Path
import hashlib



def text_to_voice(text: str, is_man: bool = False) -> str:
    assert text and text.replace(' ',''), "文本不能为空"
    filename = hashlib.md5(text.encode()).hexdigest() + ".mp3"
    filepath = Path('voices') / Path(filename)
    if filepath.exists():
        return filename

    tts = gTTS(text)
    tts.save(filepath)

    # engine = pyttsx3.init()  # object creation
    # engine.save_to_file(text, filepath.as_posix())
    # engine.runAndWait()
    # engine.stop()
    return filename

if __name__ == '__main__':
    path = text_to_voice("Give a voice to your website in a matter of minutes. Talkify library provides you with high quality text to speech (TTS) voices in many languages.")
    print(path)
