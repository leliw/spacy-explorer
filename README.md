# SpaCy Explorer

Szybka analiza zdań za pomocą biblioteki SpaCy.

## Utworzenie środowiska

```bash
python.exe -m pip install --upgrade pip
python -m venv .env
.env\Scripts\activate
pip install "fastapi[all]"
pip uninstall pydantic-extra-types
pip uninstall pydantic-settings
pip install -U pip setuptools wheel
pip install -U spacy
python -m spacy download pl_core_news_sm
pip freeze > requirements.txt
```

## Uruchomienie śrdowiska deweloperskiego

Serwer backend Python:

```bash
..\scrapy-env\Scripts\activate
uvicorn main:app --reload
```

w drugim terminalu należy odpalić frontend:

```bash
cd frontend
ng serve
```

Uruchomiony program jest dostępny pod adresem <http://localhost:4200/>.

## Kompilacja wersj produkcyjnej

W pliku `angular.json` ustawiona jest kompilacja plików produkcyjnych do
katalogu `../static`, a aplikacja napisana w Python serwuje pliki z tego
katalogu jako pliki statyczne w katalogu głównym aplikacji. Budowa aplikacji
w Angular odbywa się polceniem:

```bash
cd frontend
ng build
```

Skompliowany program jest serwowany przez moduł Python i dostępny pod
adresem <http://localhost:8000>.
