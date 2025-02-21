<div align=center>
  <img width="1000" alt="헤더 (1)" src="https://github.com/user-attachments/assets/03d61582-d3ad-477a-8301-bce895306d8a">
</div>

<br>

<div align=center>

<p align=center>
  <a href="https://github.com/boostcampwm-2024/refactor-web42-stop-troublepainter/wiki">위키</a>
  &nbsp; | &nbsp; 
  <a href="https://re-troublepainter.kro.kr/">배포 링크</a>
</p>

<div align=center>
  <a href="https://hits.seeyoufarm.com">
    <img src="https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fgithub.com%2Fboostcampwm-2024%2Frefactor-web42-stop-troublepainter&count_bg=%231264A3&title_bg=%23323845&icon=&icon_color=%23E7E7E7&title=hits&edge_flat=false"/>
  </a>
</div>
</div>

## 🎮 게임 소개
**실시간 드로잉 퀴즈 게임에서 펼쳐지는 창의력과 혼란의 한판 승부!** <br>
> **방해꾼은 못말려**는 하나의 캔버스에서 펼쳐지는 실시간 드로잉 퀴즈 게임입니다.
> 
> 친구들과 함께 그림 그리고, 방해하고, 제시어를 맞추는 경험을 즐겨보세요!🎵

![392224147-861ffb2f-ddb6-45fe-9290-08bbc93489ae](https://github.com/user-attachments/assets/fa21318e-3f3d-490d-acf1-0b4bcf3186c1)

#### 플레이어 역할
```
🎨 그림꾼: 제시어를 그림으로 표현하며 창의력을 발휘하세요

🕵️ 방해꾼: 그림꾼을 방해하며 혼란을 선사하세요

🤔 구경꾼: 그림을 추리하고 정답을 맞춰 승리하세요
```

<br>

## 🤖 인공지능 기능 소개

기존 프로젝트의 피드백 중 그림꾼이 캔버스에 제시어를 작성해버리면 방해꾼이 질 수밖에 없는 상황이 발생한다는 내용이 있었습니다.

이를 해결하기 위해 Clova OCR과 Clova Studio를 활용해 패널티 시스템을 도입했습니다.

### 🔎 Clova OCR 글자 인식 및 삭제

그리기 시간이 종료되면 **Clova OCR**이 캔버스에 작성된 **글자를 인식**합니다.

- node-canvas 라이브러리로 서버에서 이미지를 생성
- 플레이어별 이미지 생성으로 글자 작성자 추적 가능
- point-in-polygon 알고리즘으로 인식된 글자 영역의 선 삭제

![녹화_2025_02_20_20_28_15_530](https://github.com/user-attachments/assets/d0dd5028-6f51-4c62-8c32-74ab36368ace)

### ➖ Clova Studio 패널티 시스템

**Clova Studio**가 인식된 글자와 제시어 간 **연관 관계를 파악**합니다.

- 인식된 글자와 제시어 간 연관성 분석
- 연관 단어 작성 시, 작성자에게 패널티 부여

![녹화_2025_02_20_20_28_52_303](https://github.com/user-attachments/assets/80f9d60e-c80b-4bc0-98b2-6b10d1482b34)


## 📺 시연 연상

https://github.com/user-attachments/assets/06dbf5a5-6cc7-47da-854e-c2f675799352



## 🖌️ FE 기술적 도전
### 캔버스 최적화

#### 캔버스 축소

- OCR 인식률이 떨어지지 않도록 축소 필요
- 0.75배, 0.5배, 0.25배에 대해 각각 테스트 진행 후 0.5배 축소로 결정
    - 0.5배까지는 OCR 인식률이 일정하면서도 생성 속도가 개선되었지만, 0.25배 축소 시 OCR 인식률이 떨어지는 것으로 확인
- 최적 축소율(0.5배) 적용으로 이미지 생성 속도 **23% 개선** (326 ms → 251ms)
![image](https://github.com/user-attachments/assets/da274fde-763e-4b3e-bac8-a69821253537)


#### 이미지 스프라이트 기법 적용

- 플레이어 별로 생성했던 이미지를 하나의 캔버스에 스프라이트로 그림
- OCR 요청 비용 **75% 절감** (12원 → 3원)
- 캔버스 크기 확대로 큰 비율의 **글자 인식률 상승**
  

### Playwright 테스트
#### Playwright를 활용한 OCR 테스트 자동화

- 그림을 그리는 마우스 이벤트 기록
- 실제 사용자 시나리오 기반 테스트 환경 구축 ([문서 바로가기](https://www.notion.so/b16625716b284cb298eff22e84ba5e7a?pvs=21))
![image](https://github.com/user-attachments/assets/cf478b16-8649-4458-aa58-ff2d68c963cf)



## 🦉 BE 기술적 도전
### 실시간 데이터 공유

#### Redis pub/sub을 활용한 데이터 공유

- 서로 다른 소켓 간 데이터 공유를 위해 Redis pub/sub 사용
- 게임 소켓과 드로잉 소켓 간 통신
    - 서버 내 가상 캔버스를 생성해 그림 그리기
    - Clova OCR로 인식된 글자 영역의 선을 삭제한 이미지를 클라이언트에 공유

### 도커 이미지 최적화

#### 멀티 빌드 기법 적용

- 이미지 크기 **47.2% 축소** (2.58GB → 1.22GB)
- 불필요한 의존성을 설치하지 않도록 수정


## 기술 스택

(구조 이미지)

<table align=center>
    <thead>
        <tr>
            <th>Category</th>
            <th>Stack</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                <p align=center>Common</p>
            </td>
            <td>
                <img src="https://img.shields.io/badge/Socket.io-010101?logo=Socket.io">
                <img src="https://img.shields.io/badge/Prettier-F7B93E?logo=prettier&logoColor=ffffff">
                <img src="https://img.shields.io/badge/ESLint-4B32C3?logo=Eslint">
                <img src="https://img.shields.io/badge/pnpm-F69220?logo=pnpm&logoColor=ffffff">
                <img src="https://img.shields.io/badge/.ENV-ECD53F?logo=.ENV&logoColor=ffffff">
            </td>
        </tr>
        <tr>
            <td>
                  <p align=center>Frontend</p>
            </td>
            <td>
                <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=ffffff">
                <img src="https://img.shields.io/badge/Vite-646CFF?logo=Vite&logoColor=ffffff">
                <img src="https://img.shields.io/badge/React-61DAFB?logo=React&logoColor=ffffff">
                <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=ffffff">
                <img src="https://img.shields.io/badge/Zustand-443E38?logo=react&logoColor=ffffff">
            </td>
        </tr>
        <tr>
            <td>
                <p align=center>Backend</p>
            </td>
            <td>
                <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=ffffff">
                <img src="https://img.shields.io/badge/Node.js-114411?logo=node.js">
                <img src="https://img.shields.io/badge/NestJS-E0234E?logo=nestjs&logoColor=ffffff">
                <img src="https://img.shields.io/badge/Redis-DC382D?logo=redis&logoColor=ffffff">
            </td>
        </tr>
        <tr>
            <td>
                <p align=center>Deployment</p>
            </td>
            <td>
                <img src="https://img.shields.io/badge/nginx-014532?logo=Nginx&logoColor=009639&">
                <img src="https://img.shields.io/badge/Naver Cloud Platform-03C75A?logo=naver&logoColor=ffffff">  
                <img src="https://img.shields.io/badge/GitHub Actions-2088FF?logo=GitHub Actions&logoColor=ffffff">
            </td>
        </tr>
        <tr>
            <td>
                <p align=center>Collaboration</p>
            </td>
            <td>
                <img src="https://img.shields.io/badge/Notion-000000?logo=Notion">
                <img src="https://img.shields.io/badge/Figma-F24E1E?logo=Figma&logoColor=ffffff">
                <img src="https://img.shields.io/badge/Slack-4A154B?logo=Slack&logoColor=ffffff">
            </td>
        </tr>
    </tbody>
</table>

<br>

## Web42 팀 소개

<table align="center">
  <tr>
    <th><a href="https://github.com/kwaksj329">김성환</a></th>
    <th><a href="https://github.com/rhino-ty">김준기</a></th>
    <th><a href="https://github.com/sweetyr928">김진</a></th>
    <th><a href="https://github.com/aeujoung">서산</a></th>
  </tr>
  <tr>
    <td><img src="https://avatars.githubusercontent.com/u/52474291?v=4" width="150" height="150"></td>
    <td><img src="https://avatars.githubusercontent.com/u/54887575?v=4" width="150" height="150"></td>
    <td><img src="https://avatars.githubusercontent.com/u/80706216?v=4" width="150" height="150"></td>
    <td><img src="https://avatars.githubusercontent.com/u/48199716?v=4" width="150" height="150"></td>
  </tr>
  <tr align="center">
    <td>BE</td>
    <td>FE</td>
    <td>BE</td>
    <td>FE</td>
  </tr>
</table>
