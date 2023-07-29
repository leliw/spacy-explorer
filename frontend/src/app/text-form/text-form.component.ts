import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';


export interface Token {
    text: string
    lema: string
    pos: string
    tag: string
    dep: string
    shape: string
    is_alpha: boolean
    is_stop: boolean
}

@Component({
    selector: 'app-text-form',
    templateUrl: './text-form.component.html',
    styleUrls: ['./text-form.component.css']
})

export class TextFormComponent implements OnInit {

    name = new FormControl('');
    tokens: Token[] | undefined;
    SERVER_URL = "/api/spacy";
    public uploadForm: FormGroup;

    constructor(private formBuilder: FormBuilder, private http: HttpClient) {
        this.uploadForm = this.formBuilder.group({
            profile: ['']
        });
    }

    ngOnInit() {

    }

    onSubmit() {
        this.http.post<Token[]>(this.SERVER_URL, { "text": this.name.value }).subscribe(s => {
            this.tokens = s;
            console.log(this.tokens);
        });

    }
}
