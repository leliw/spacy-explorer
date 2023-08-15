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
}

@Component({
    selector: 'app-spacy-token',
    templateUrl: './spacy-token.component.html',
    styleUrls: ['./spacy-token.component.css']
})
export class SpacyTokenComponent {
    @Input() tokens!: Token[];
    @ViewChild('tooltipContainer', { read: ViewContainerRef }) tooltipContainer!: ViewContainerRef;

    isOverlayOpen = false;
    currentElement!: HTMLElement;
    currentToken!: Token;

    onMouseEnter(event: MouseEvent, token: Token) {
        if (!this.isOverlayOpen) {
            this.isOverlayOpen = true;
            this.currentElement = event.target as HTMLElement;
            this.currentToken = token;
        }
    }

    closeOverlay() {
        this.isOverlayOpen = false;
    }
}
