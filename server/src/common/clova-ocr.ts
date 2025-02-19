import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import * as crypto from 'crypto';
import * as FormData from 'form-data';

@Injectable()
export class ClovaOcr {
  private readonly client: AxiosInstance;

  constructor(private configService: ConfigService) {
    const secretKey = this.configService.get<string>('CLOVA_OCR_SECRET_KEY');
    const invokeUrl = this.configService.get<string>('CLOVA_OCR_INVOKE_URL');

    this.client = axios.create({
      baseURL: invokeUrl,
      headers: {
        'X-OCR-SECRET': secretKey,
      },
    });
  }

  async doOCR(buffer: Buffer) {
    const formData = new FormData();
    const requestId = crypto.randomUUID();

    // Add message part
    const message = {
      images: [
        {
          format: 'jpg',
          name: 'image',
        },
      ],
      requestId,
      version: 'V2',
      timestamp: Date.now(),
    };

    formData.append('message', JSON.stringify(message));

    // Add image buffer
    formData.append('file', buffer, {
      filename: `image-${requestId}.jpg`,
      contentType: 'image/jpeg',
    });

    const response = await this.client.post('', formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    return response.data;
  }
}
