import io
import os, tempfile
import uuid
import hashlib

from fastapi import FastAPI, Response
from pydantic import BaseModel

import json

import spacy
from spacy import displacy

from my_starlette.staticfiles import StaticFiles

nlp = spacy.load("pl_core_news_sm")
#nlp = spacy.load("pl_core_news_lg")
nlp("Szybki start")

app = FastAPI()

class Item(BaseModel):
    text: str

@app.post("/api/spacy")
async def post(item: Item):
    text = item.text
    md5 = hashlib.md5(text.encode('utf-8'))
    guid = str(uuid.UUID(md5.hexdigest()))
    with open(createTempFileName(guid, "txt"), '+tw') as f:
        f.write(text) 
        f.close()
    doc = nlp(text)
    sents = []
    for s in doc.sents:
        sents.append({
            "sent": s.text,
            "start": s.start,
            "start_char": s.start_char,
            "end": s.end,
            "end_char": s.end_char
            })
    json_dict = { "text": text, "sents": sents }
    # Nie działa dla PL
    # noun_chunks = []
    # for c in doc.noun_chunks:
    #     noun_chunks.append({
    #         "text": c.text,
    #         "root_text": c.root.text,
    #         "root_dep": c.root.dep_,
    #         "root_head_text": c.root.head.text
    #     })
    # json_dict = { "text": text, "sents": sents, "noun_chunks": noun_chunks }
    with open(createTempFileName(guid, "json"), 'tw') as outfile:
        json.dump(json_dict, outfile)
    return { "guid": guid, "sentsSize": len(sents) }

@app.get("/api/spacy/explain")
async def explain(label: str):
    ret = spacy.explain(label)
    return { "label" : label, "explain" : ret }

@app.get("/api/spacy/{guid}")
async def get_spacy(guid: str):
    data = readContent(guid)
    doc = nlp(data["text"])
    return doc2json(doc)

@app.get("/api/spacy/{guid}/ents")
async def get_spacy(guid: str):
    text = readContent(guid)["text"]
    doc = nlp(text)
    retList = []
    for w in doc.ents:
        ret = {
            "text": w.text,
            "start": w.start_char,
            "end": w.end_char,
            "label": w.label_
            }
        retList.append(ret)
    return retList

@app.get("/api/spacy/{guid}/sents/{index}/display")
async def display(guid: str, index: int):
    data = readContent(guid)
    doc = nlp(data["sents"][index]["sent"])
    svg = displacy.render(doc, style="dep")
    return Response(svg, media_type="image/svg+xml")

def doc2json(doc):
    if doc == None:
        doc = nlp("text")
    ret = []
    for w in doc:
        ret.append({
            "text": w.text,
            "lema": w.lemma_,
            "pos": w.pos_,
            "tag": w.tag_,
            "dep": w.dep_,
            "shape": w.shape_,
            "morph": w.morph.to_dict(),
            "end_iob": w.ent_iob_,
            "ent_type_": w.ent_type_,
            "is_alpha": w.is_alpha,
            "is_stop": w.is_stop,
            "head_text": w.head.text,
            "head_lema": w.head.lemma_,
            "head_pos": w.head.pos_,
            "children": [child.lemma_ for child in w.children] 
            })
    return ret

def createTempFileName(guid: str, fileExtension: str):
    tmpDir = tempfile.gettempdir()
    fname = os.path.join(tmpDir, "spacyexplorer-" + guid + "." + fileExtension)
    return fname

def readContent(guid: str): 
    with open(createTempFileName(guid, "json"), 'tr') as json_file:
        data = json.load(json_file)
    return data

app.mount("/", StaticFiles(directory="static", html = True), name="static")
