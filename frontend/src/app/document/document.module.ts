import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

// PrimeNG Modules
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { TabViewModule } from 'primeng/tabview';
import { CardModule } from 'primeng/card';
import { TimelineModule } from 'primeng/timeline';
import { TooltipModule } from 'primeng/tooltip';
import { PaginatorModule } from 'primeng/paginator';

// Components
import { DocumentListComponent } from './components/document-list/document-list.component';
import { DocumentUploadComponent } from './components/document-upload/document-upload.component';
import { DocumentDetailsComponent } from './components/document-details/document-details.component';
import { DocumentVersionHistoryComponent } from './components/document-version-history/document-version-history.component';

// Pipes
import { FileSizePipe } from './pipes/file-size.pipe';

const routes: Routes = [
  { path: '', component: DocumentListComponent },
  { path: 'upload', component: DocumentUploadComponent },
  { path: 'details/:id', component: DocumentDetailsComponent },
  { path: 'versions/:id', component: DocumentVersionHistoryComponent }
];

@NgModule({
  declarations: [
    DocumentListComponent,
    DocumentUploadComponent,
    DocumentDetailsComponent,
    DocumentVersionHistoryComponent,
    FileSizePipe
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    InputTextareaModule,
    FileUploadModule,
    ToastModule,
    TabViewModule,
    CardModule,
    TimelineModule,
    TooltipModule,
    PaginatorModule
  ]
})
export class DocumentModule { } 