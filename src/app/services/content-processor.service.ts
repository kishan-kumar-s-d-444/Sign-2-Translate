import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ContentProcessorService {
  private readonly YOUTUBE_API_KEY = 'AIzaSyD6j9654K39ddAYmUc0Bv3yW09791YrAmk'; // Replace with your YouTube API key

  constructor(private http: HttpClient) {}

  async extractTextFromPDF(file: File): Promise<string> {
    try {
      const pdfjsLib = await import('pdfjs-dist');
      const pdf = await pdfjsLib.getDocument(await this.fileToArrayBuffer(file)).promise;
      let fullText = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + '\n';
      }

      return fullText.trim();
    } catch (error) {
      throw new Error('Error extracting text from PDF: ' + (error as Error).message);
    }
  }

  async getYouTubeTranscript(videoUrl: string): Promise<string> {
    try {
      const videoId = this.extractVideoId(videoUrl);
      if (!videoId) {
        throw new Error('Invalid YouTube URL');
      }

      // First, get the video details to check if captions are available
      const videoDetails = await this.getVideoDetails(videoId);
      if (!videoDetails.captions) {
        throw new Error('No captions available for this video');
      }

      // Get the transcript
      const transcript = await this.fetchTranscript(videoId);
      return transcript;
    } catch (error) {
      throw new Error('Error getting YouTube transcript: ' + (error as Error).message);
    }
  }

  private async fileToArrayBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  }

  private extractVideoId(url: string): string | null {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }

  private async getVideoDetails(videoId: string): Promise<any> {
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${this.YOUTUBE_API_KEY}`;
    return this.http.get(url).toPromise();
  }

  private async fetchTranscript(videoId: string): Promise<string> {
    // This is a simplified version. In a real implementation, you would need to:
    // 1. Get the caption track ID
    // 2. Fetch the actual transcript data
    // 3. Parse and format the transcript
    const url = `https://www.googleapis.com/youtube/v3/captions?videoId=${videoId}&key=${this.YOUTUBE_API_KEY}`;
    const response = await this.http.get(url).toPromise();
    // Process the response and return the transcript
    return 'Transcript text'; // Placeholder
  }
} 