import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TextFormComponent } from './text-form/text-form.component';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { TooltipPosition, MatTooltipModule } from '@angular/material/tooltip';

import { SpacyDocExplorerComponent } from './spacy-doc-explorer/spacy-doc-explorer.component';
import { SpacyTokenComponent } from './spacy-token/spacy-token.component';
import { EntsComponent } from './spacy/ents/ents.component';

@NgModule({
    declarations: [
        AppComponent,
        TextFormComponent,
        SpacyDocExplorerComponent,
        SpacyTokenComponent,
        EntsComponent
    ],
    imports: [
        BrowserModule,
        MatInputModule,
        MatFormFieldModule,
        FormsModule,
        ReactiveFormsModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        MatButtonModule,
        MatBadgeModule,
        MatDividerModule,
        MatSelectModule,
        MatRadioModule,
        MatCardModule,
        MatTooltipModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
