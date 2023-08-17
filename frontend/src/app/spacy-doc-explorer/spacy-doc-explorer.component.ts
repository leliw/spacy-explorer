import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, Validators } from '@angular/forms';
import { Token } from '../spacy-token/spacy-token.component';
import { ActivatedRoute } from '@angular/router';


@Component({
    selector: 'app-spacy-doc-explorer',
    templateUrl: './spacy-doc-explorer.component.html',
    styleUrls: ['./spacy-doc-explorer.component.css']
})
export class SpacyDocExplorerComponent implements OnInit, OnDestroy {
    private fb = inject(FormBuilder);
    form = this.fb.group({
        sentence: ['', Validators.required],
    });
    guid!: string;
    sentsSize!: number;
    tokens!: Token[];
    SERVER_URL = "/api/spacy";
    private sub: any;

    constructor(private route: ActivatedRoute, private http: HttpClient, private _location: Location) {
        this.form.controls['sentence'].setValue(
            'Do tragicznego zdarzenia doszło w sobotę wieczorem na alei Hallera w Gdańsku. 52-letni motocyklista najpierw potrącił stojącą przed przejściem 15-latkę, a później uderzył w drzewo. Mimo reanimacji nie udało się go uratować. Dziewczyna z urazem kończyn trafiła do szpitala.'
        );
    }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.guid = params['guid'];
            this.http.get<Token[]>(this.SERVER_URL + "/" + this.guid)
                .subscribe(s => this.tokens = s)
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    getSentsDisplayUrl(sentence: number): string {
        return `${this.SERVER_URL}/${this.guid}/sents/${sentence}/display`;
    }

    backClicked() {
        this._location.back();
    }
}
