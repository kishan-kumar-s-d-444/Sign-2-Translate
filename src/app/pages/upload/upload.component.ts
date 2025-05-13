import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ContentProcessorService } from '../../services/content-processor.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UploadComponent implements OnInit {
  uploadForm: FormGroup;
  selectedFile: File | null = null;
  youtubeUrl: string = '';
  extractedText: string = '';
  isProcessing: boolean = false;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private contentProcessor: ContentProcessorService
  ) {
    this.uploadForm = this.fb.group({
      fileType: ['pdf', Validators.required],
      youtubeUrl: ['', [Validators.pattern('^(https?\\:\\/\\/)?(www\\.)?(youtube\\.com|youtu\\.?be)\\/.+$')]],
      pdfFile: [null]
    });
  }

  ngOnInit(): void {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      if (this.selectedFile.type !== 'application/pdf') {
        this.errorMessage = 'Please select a PDF file';
        this.selectedFile = null;
        return;
      }
      this.errorMessage = '';
    }
  }

  async processFile(): Promise<void> {
    this.isProcessing = true;
    this.errorMessage = '';

    try {
      if (this.uploadForm.get('fileType')?.value === 'pdf' && this.selectedFile) {
        this.extractedText = await this.contentProcessor.extractTextFromPDF(this.selectedFile);
      } else if (this.uploadForm.get('fileType')?.value === 'youtube' && this.youtubeUrl) {
        this.extractedText = await this.contentProcessor.getYouTubeTranscript(this.youtubeUrl);
      }
    } catch (error) {
      this.errorMessage = 'Error processing file: ' + (error as Error).message;
    } finally {
      this.isProcessing = false;
    }
  }

  generateSignLanguage(): void {
    if (!this.extractedText) {
      this.errorMessage = 'No text available to generate sign language';
      return;
    }
    // TODO: Implement sign language generation using the existing sign language generation service
  }
} 