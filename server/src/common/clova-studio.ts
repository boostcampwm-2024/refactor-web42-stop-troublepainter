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
        'Content-Type': 'application/json',
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
          
          [응답 방식]
          - 답변은 부연 설명 없이 0에서 1 사이의 숫자값으로만 응답해주세요.
          - 0은 전혀 연관 없음, 1은 제시어와 완전히 동일함 입니다.
          
          [주의사항]
          - 정형화된 폰트가 아닌, 마우스로 그린 글자를 OCR이 인식하기 때문에 간혹 인식에 실패하는 경우가 있습니다. 여러 가지 오타가 발생하는 경우가 존재하므로 오타를 정확하게 교정한 후 제시어와의 연관 정도를 판단해야 합니다.
          * 예시) 제시어가 토끼일 때 [담근], [당농] 등 인식에 실패한 단어가 들어왔을 경우에도 제시어의 연관 단어 중 당근이 있다는 것을 고려해야 합니다. 당근의 오타와 유사한 형태이므로 위의 단어를 당근으로 교정해 연관 정도를 판단해야 합니다.
          
          또, 오타가 아닌 이미 존재하는 단어여도 제시어와 한글의 초성, 중성, 종성 또는 영어의 알파벳 한 글자 등만 다를 경우에도 OCR이 인식에 실패했을 가능성이 크므로 이 경우에도 제시어와 연관되어 있다고 판단해야 합니다.
          * 예시) 제시어가 토끼일 때 [도끼]와 같이 초성, 중성, 종성 중 한 글자만 다른 경우에도 토끼로 판단해야 합니다.
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
      temperature: 0.5,
      repeatPenalty: 5.0,
      stopBefore: [],
      includeAiFilters: true,
      seed: 0,
    };

    try {
      const response = await this.client.post('', request);
      const rate = +response.data.result.message.content.trim();
      return rate >= 0.5;
    } catch (error) {
      throw new Error(`CLOVA API request failed: ${error.message}`);
    }
  }
}
