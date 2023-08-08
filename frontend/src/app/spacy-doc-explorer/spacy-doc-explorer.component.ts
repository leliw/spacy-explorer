import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Token } from '../spacy-token/spacy-token.component';
import { MatTabsModule } from '@angular/material/tabs';


@Component({
    selector: 'app-spacy-doc-explorer',
    templateUrl: './spacy-doc-explorer.component.html',
    styleUrls: ['./spacy-doc-explorer.component.css']
})
export class SpacyDocExplorerComponent {
    private fb = inject(FormBuilder);
    form = this.fb.group({
        sentence: ['', Validators.required],
    });
    guid!: string;
    sentsSize!: number;
    tokens!: Token[];
    SERVER_URL = "/api/spacy";

    constructor(private http: HttpClient) {
        this.form.controls['sentence'].setValue(
            'Do tragicznego zdarzenia doszło w sobotę wieczorem na alei Hallera w Gdańsku. 52-letni motocyklista najpierw potrącił stojącą przed przejściem 15-latkę, a później uderzył w drzewo. Mimo reanimacji nie udało się go uratować. Dziewczyna z urazem kończyn trafiła do szpitala.'
        );
    }

    onSubmit(): void {
        this.http.post<{ guid: string, sentsSize: number }>(this.SERVER_URL, { "text": this.form.controls['sentence'].value })
            .subscribe(g => {
                this.guid = g.guid;
                this.sentsSize = g.sentsSize;
                this.http.get<Token[]>(this.SERVER_URL + "/" + this.guid)
                    .subscribe(s => this.tokens = s)
            });
    }

    getSentsDisplayUrl(sentence: number): string {
        return `${this.SERVER_URL}/${this.guid}/sents/${sentence}/display`;
    }

}
