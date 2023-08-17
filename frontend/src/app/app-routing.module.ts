import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InputComponent } from './input/input.component';
import { SpacyDocExplorerComponent } from './spacy-doc-explorer/spacy-doc-explorer.component';

const routes: Routes = [
    { path: 'input', component: InputComponent },
    { path: 'explore/:guid', component: SpacyDocExplorerComponent },
    { path: '', redirectTo: '/input', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
