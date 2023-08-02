import io
import os, tempfile
import uuid
import hashlib

from fastapi import FastAPI, Response
from pydantic import BaseModel

import spacy
from spacy import displacy

nlp = spacy.load("pl_core_news_sm")

app = FastAPI()

class Item(BaseModel):
    text: str

@app.post("/api/spacy")
async def post(item: Item):
    text = item.text
    md5 = hashlib.md5(text.encode('utf-8'))
    tmpDir = tempfile.gettempdir()
    guid = str(uuid.UUID(md5.hexdigest()))
    fname = os.path.join(tmpDir, guid + ".txt")
    with open(fname, '+tw') as f:
        f.write(text) 
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
            "is_stop": w.is_stop,
            "head_text": w.head.text,
            "head_lema": w.head.lemma_,
            "head_pos": w.head.pos_,
            "children" : [child.lemma_ for child in w.children] 
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
