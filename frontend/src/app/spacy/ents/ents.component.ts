import { HttpClient } from '@angular/common/http';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Token } from 'src/app/spacy-token/spacy-token.component';

interface Ent {
    text: string;
    label: string;
}

@Component({
  selector: 'app-ents',
  templateUrl: './ents.component.html',
  styleUrls: ['./ents.component.css']
})
export class EntsComponent implements OnChanges {

    @Input() tokens!: Token[];
    @Input() guid!: string;
    
    ents!: Ent[];

    constructor(private http: HttpClient) {}

    ngOnChanges(changes: SimpleChanges) {
        let url = `/api/spacy/${this.guid}/ents`;
        this.http.get<Ent[]>(url)
        .subscribe(g => {
            this.ents = g;
        });
    }

}
