import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import * as crypto from 'crypto';

@Injectable()
export class ClovaOcr {
  private readonly client: AxiosInstance;

  constructor(private configService: ConfigService) {
    const secretKey = this.configService.get<string>('CLOVA_OCR_SECRET_KEY');
    const invokeUrl = this.configService.get<string>('CLOVA_OCR_INVOKE_URL');

    this.client = axios.create({
      baseURL: invokeUrl,
      headers: {
        'Content-Type': 'application/json',
        'X-OCR-SECRET': secretKey,
      },
    });
  }

  async doOCR(base64Data: string): Promise<string[]> {
    let data = base64Data;

    // data:<image/png>;base64,
    // data:imgae/jpeg;base64, 와 같은 prefix가 존재한다면 제거
    if (base64Data.startsWith('data:')) {
      data = base64Data.split(',')[1];
    }

    const requestData = {
      images: [
        {
          format: 'jpeg',
          name: crypto.randomUUID(),
          data,
        },
      ],
      requestId: crypto.randomUUID(),
      version: 'V2',
      timestamp: Date.now(),
    };

    const response = await this.client.post('', requestData);
    return response.data;
  }
}
