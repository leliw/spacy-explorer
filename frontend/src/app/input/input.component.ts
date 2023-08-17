import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Token } from '../spacy-token/spacy-token.component';
import { Router } from '@angular/router';

@Component({
    selector: 'app-input',
    templateUrl: './input.component.html',
    styleUrls: ['./input.component.css']
})
export class InputComponent implements OnInit {

    form = this.fb.group({
        sentence: ['', Validators.required],
    });
    examples!: string[];
    guid!: string;
    sentsSize!: number;
    tokens!: Token[];
    SERVER_URL = "/api/spacy";
        
    constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) { }

    ngOnInit() {
        let url = `/api/example`;
        this.http.get<string[]>(url)
            .subscribe(g => {
                this.examples = g;
            });
    }

    loadExample(examleName: string) {
        let url = `/api/example/` + encodeURIComponent(examleName);
        this.http.get<{ "text": string}>(url)
            .subscribe(r => {
                this.form.controls['sentence'].setValue(r.text);
            });
    }

    onSubmit(): void {
        this.http.post<{ guid: string, sentsSize: number }>(this.SERVER_URL, { "text": this.form.controls['sentence'].value })
            .subscribe(g => {
                this.guid = g.guid;
                this.router.navigate(['/explore', g.guid]);
            });
    }
}
