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
import { MatTooltipModule } from '@angular/material/tooltip';

import { SpacyDocExplorerComponent } from './spacy-doc-explorer/spacy-doc-explorer.component';
import { SpacyTokenComponent } from './spacy-token/spacy-token.component';
import { EntsComponent } from './spacy/ents/ents.component';
import { MatTabsModule } from '@angular/material/tabs';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';

import { InputComponent } from './input/input.component';


@NgModule({
    declarations: [
        AppComponent,
        TextFormComponent,
        SpacyDocExplorerComponent,
        SpacyTokenComponent,
        EntsComponent,
        InputComponent
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
        MatTooltipModule,
        MatTabsModule,
        OverlayModule,
        MatListModule,
        MatSidenavModule,
        MatToolbarModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
