import { Component, Input, ViewChild, ViewContainerRef } from '@angular/core';

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
    morph: any,
    ent_type_: string
}

@Component({
    selector: 'app-spacy-token',
    templateUrl: './spacy-token.component.html',
    styleUrls: ['./spacy-token.component.css']
})
export class SpacyTokenComponent {

    @Input() tokens!: Token[];

    isOverlayOpen = false;
    isHover = false;
    currentElement!: HTMLElement;
    currentToken!: Token;

    onMouseEnter(event: MouseEvent, token: Token) {
        if (!this.isOverlayOpen) {
            this.openOverlay(event, token);
            this.isHover = true;
        }
    }

    openOverlay(event: MouseEvent, token: Token) {
        this.isHover = false;
        if (!this.isOverlayOpen) {
            this.isOverlayOpen = true;
            this.currentElement = event.target as HTMLElement;
            this.currentToken = token;
        }

    }
    onMouseLeave() {
        if (this.isHover) {
            this.isHover = false;
            this.closeOverlay();
        }
    }

    closeOverlay() {
        this.isOverlayOpen = false;
    }
}
