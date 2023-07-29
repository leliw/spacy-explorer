import { Component, Input } from '@angular/core';

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
  selector: 'app-spacy-token',
  templateUrl: './spacy-token.component.html',
  styleUrls: ['./spacy-token.component.css']
})
export class SpacyTokenComponent {
    @Input() tokens!: Token[];
}
