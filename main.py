from pathlib import Path
import urllib.request
from bs4 import BeautifulSoup, Tag
from os import listdir
from os.path import isfile
import os, tempfile
import uuid
import hashlib
import re

from fastapi import FastAPI, Response
from pydantic import BaseModel

import json

import spacy
from spacy import displacy
from spacy.matcher import Matcher


from my_starlette.staticfiles import StaticFiles

nlp = spacy.load("pl_core_news_sm")
# nlp = spacy.load("pl_core_news_lg")
nlp("Szybki start")


example_dir = Path.cwd() / "data" / "example_text"

def load_json_data(file: str):
    with open(file, 'tr', encoding="UTF-8") as json_file:
        data = json.load(json_file)
    return data

def clean_text(text: str) -> str:
    text = text.replace(" \n", "\n")
    text = re.sub(r"([a-ząćęłńóśźż,.])\n([^\n])",r"\1 \2", text)
    #text = ' '.join(text.split())
    return text

def space_between_tokens(prev: str, next: str) -> bool:
    if prev == None:
        return False
    if prev[-1] in [',,', '(', '[', '{', '\n'] or next in ['.', ',', ';', ':', '!', '?', ')', ']', '}']:
        return False
    else:
        return True

app = FastAPI()

class Item(BaseModel):
    text: str

@app.get("/api/example")
async def list_of_examples():
    """ Zwraca listę przykładowych plików z tekstami do analizy. """
    onlyfiles = [f[:-5] for f in listdir(example_dir) if isfile(example_dir / f) and f[-5:] == ".json"]
    return onlyfiles

@app.get("/api/example/{file}")
async def example_text(file: str | None):
    """ Zwraca treść przykładowego pliku. """
    example = load_json_data(example_dir / f"{file}.json")
    text = example.get("text")
    if text.count("\n\n") > 3:
        text = clean_text(text)
    return { "text" : text }

@app.post("/api/spacy")
async def document(item: Item):
    """ Odbiera dokument do analizy"""
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
async def get_spacy_entities(guid: str):
    """ Zwraca NER (nazwane encje) znalezione w tekście. """
    text = readContent(guid)["text"]
    doc = nlp(text)
    ents = []
    for ent in doc.ents:
        ret = {
            "text": ent.text,
            "start": ent.start_char,
            "end": ent.end_char,
            "label": ent.label_
            }
        ents.append(ret)
    ent_tokens = []
    entity = None
    prev_token_text = None
    for token in doc:
        space_before = space_between_tokens(prev_token_text, token.text)
        prev_token_text = token.text
        if token.ent_iob_ == "B":
            # Początek encji - zapamiętuję aby dołączyć do kolejnego tokenu
            entity = { "text": token.text, "ent_type_": token.ent_type_, "space_before": space_before }
        elif token.ent_iob_ == "I":
            # Środek encji - dodaję do tego co zapamiętałem
            entity.update({ "text": entity.get("text") +  (" " if space_before else "") + token.text})
        else:
            # Już poza encją
            if entity != None:
                ent_tokens.append(entity)
                entity = None
            ent_tokens.append({ "text": token.text, "space_before": space_before })
    if entity != None:
        ent_tokens.append(entity)
    return { "ents": ents, "ent_tokens": ent_tokens }

@app.get("/api/spacy/{guid}/verbs")
async def get_spacy(guid: str):
    matcher = Matcher(nlp.vocab)
    text = readContent(guid)["text"]
    doc = nlp(text)
    patterns = [
        [{"POS": "PROPN"}, {"POS": "ADV"}, {"POS": "VERB"}],
        [{"POS": "NOUN"}, {"POS": "ADV"}, {"POS": "VERB"}],
        [{"POS": "PROPN"}, {"POS": "VERB"}],
        [{"POS": "NOUN"}, {"POS": "VERB"}],
        [{"POS": "ADV"}, {"POS": "VERB"}],
        [{"POS": "VERB"}],
    ]
    matcher.add("verbs", patterns)
    verb_phrases = matcher(doc)
    retList = []
    last_end = -1
    for match_id, start, end in verb_phrases:
        string_id = nlp.vocab.strings[match_id] # Get string representation
        span = doc[start:end]  # The matched span
        if last_end != end:
            # if end token is the same as previous, it is shorten version od the same verb context
            # print(match_id, string_id, start, end, span.text)
            retList.append(span.text)
        last_end = end
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
    prev_token_text = None
    for token in doc:
        space_before = space_between_tokens(prev_token_text, token.text)
        prev_token_text = token.text
        ret.append({
            "text": token.text,
            "lema": token.lemma_,
            "pos": token.pos_,
            "tag": token.tag_,
            "dep": token.dep_,
            "shape": token.shape_,
            "morph": token.morph.to_dict(),
            "end_iob": token.ent_iob_,
            "ent_type_": token.ent_type_,
            "is_alpha": token.is_alpha,
            "is_stop": token.is_stop,
            "head_text": token.head.text,
            "head_lema": token.head.lemma_,
            "head_pos": token.head.pos_,
            "children": [child.lemma_ for child in token.children],
            "space_before": space_before
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

# Pliki statyczne Angular
app.mount("/", StaticFiles(directory="static", html = True), name="static")
