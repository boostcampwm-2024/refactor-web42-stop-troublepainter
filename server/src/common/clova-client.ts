import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { Difficulty } from './enums/game.status.enum';

@Injectable()
export class ClovaClient {
  private readonly client: AxiosInstance;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('CLOVA_STUDIO_API_KEY');
    const requestId = this.configService.get<string>('CLOVA_CLIENT_REQUEST_ID');

    this.client = axios.create({
      baseURL: 'https://clovastudio.stream.ntruss.com/testapp/v1/chat-completions/HCX-003',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'X-NCP-CLOVASTUDIO-REQUEST-ID': requestId,
        'Content-Type': 'application/json',
      },
    });
  }
  async getDrawingWords(difficulty: Difficulty, count: number) {
    const categories = ['영화', '음식', '일상용품', '스포츠', '동물', '교통수단', '캐릭터', '악기', '직업', 'IT'];

    const selectedCategories = categories.sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * 2) + 2);

    const request = {
      messages: [
        {
          role: 'system',
          content: '당신은 창의적인 드로잉 게임의 출제자입니다. 매번 새롭고 다양한 단어들을 제시해주세요.',
        },
        {
          role: 'user',
          content: `${difficulty} 난이도의 명사 ${count}개를 제시해주세요.
            - 주로 ${selectedCategories.join(', ')} 관련 단어들 위주로 선택
            - 30초 안에 그릴 수 있는 단어만 선택
            - 단어만 나열 (1. 2. 3. 형식)
            - 설명이나 부연설명 없이 단어만 작성
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
      return response.data.result.message.content
        .split('\n')
        .map((line: string) => line.trim())
        .filter((line: string) => line)
        .map((line: string) => line.replace(/^\d+\.\s*/, ''));
    } catch (error) {
      throw new Error(`CLOVA API request failed: ${error.message}`);
    }
  }
}
