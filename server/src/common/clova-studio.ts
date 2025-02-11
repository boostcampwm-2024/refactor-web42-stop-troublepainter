import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class ClovaStudio {
  private readonly client: AxiosInstance;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('CLOVA_STUDIO_API_KEY');
    const requestId = this.configService.get<string>('CLOVA_STUDIO_REQUEST_ID');

    this.client = axios.create({
      baseURL: 'https://clovastudio.stream.ntruss.com/testapp/v1/chat-completions/HCX-003',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'X-NCP-CLOVASTUDIO-REQUEST-ID': requestId,
        'Content-Type': 'application/json; charset=utf-8',
        Accept: 'text/event-stream',
      },
    });
  }
  async isRelatedWord(suggestedWord: string, inferText: string) {
    const request = {
      messages: [
        {
          role: 'system',
          content: `
          당신은 창의적인 드로잉 게임의 관리자입니다.
          OCR API를 통해 만들어진 글자를 확인하고, 제시어를 연상할 수 있는지 여부를 판단해주세요.
          답변은 부연 설명 없이 true 또는 false로만 응답해주세요.
          `,
        },
        {
          role: 'user',
          content: `
          다음 단어가 제시어 '${suggestedWord}'와 연관이 되어있는지 답변해주세요.
          [${inferText}]
          `,
        },
      ],
      topP: 0.8,
      topK: 0,
      maxTokens: 256,
      temperature: 0.8,
      repeatPenalty: 5.0,
      stopBefore: [],
      includeAiFilters: true,
      seed: 0,
    };

    try {
      const response = await this.client.post('', request);
      return response.data === 'true';
    } catch (error) {
      throw new Error(`CLOVA API request failed: ${error.message}`);
    }
  }
}
