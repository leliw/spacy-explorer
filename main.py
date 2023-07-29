import io
import os, tempfile
import uuid

from fastapi import FastAPI, Response
from fastapi.responses import HTMLResponse, StreamingResponse
from pydantic import BaseModel

import spacy
from spacy import displacy

nlp = spacy.load("pl_core_news_sm")

# logger = logging.getLogger(__name__)

app = FastAPI()

class Item(BaseModel):
    text: str

@app.get("/api/test")
def test():
    doc = nlp("Poszła Karolinka za stodołę srać, a Karliczek za nią, jak za Młodą Panią, dupę podcierać.")
    return doc2json(doc)

@app.post("/api/spacy")
async def post(item: Item):
    tmpDir = tempfile.gettempdir()
    guid = str(uuid.uuid4())
    fname = os.path.join(tmpDir, guid + ".txt")
    print(fname)
    with open(fname, '+tw') as f:
        f.write(item.text) 
        f.close()
    return { "guid": guid }

@app.get("/api/spacy/explain")
async def explain(label: str):
    ret = spacy.explain(label)
    return { "label" : label, "explain" : ret }

@app.get("/api/spacy/{guid}")
async def get_spacy(guid: str):
    text = readContent(guid)
    doc = nlp(text)
    return doc2json(doc)



@app.get("/api/spacy/{guid}/display")
async def display(guid: str):
    text = readContent(guid)
    doc = nlp(text)
    svg = displacy.render(doc, style="dep")
    return Response(svg, media_type="image/svg+xml")

def doc2json(doc):
    ret = []
    for w in doc:
        ret.append({
            "text": w.text,
             "lema": w.lemma_,
             "pos": w.pos_,
             "tag": w.tag_,
             "dep": w.dep_,
            "shape": w.shape_,
            "is_alpha": w.is_alpha,
            "is_stop": w.is_stop
            })
    return ret

def readContent(guid: str): 
    tmpDir = tempfile.gettempdir()
    fname = os.path.join(tmpDir, guid + ".txt")
    print(fname)
    with open(fname, 'tr') as f:
        text = f.read() 
        f.close()
    return text

# app.mount("/", StaticFiles(directory="static", html = True), name="static")
