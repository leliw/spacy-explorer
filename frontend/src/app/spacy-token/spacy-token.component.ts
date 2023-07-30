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
    head_text: string
    head_lema: string
    head_pos: string
    children: string[]
}

@Component({
  selector: 'app-spacy-token',
  templateUrl: './spacy-token.component.html',
  styleUrls: ['./spacy-token.component.css']
})
export class SpacyTokenComponent {
    @Input() tokens!: Token[];

    getTooltipText(token: Token) {
        return `Tag:${token.tag}; Dep:${token.dep}`;
    }
}
