import{j as e}from"./jsx-runtime-CkxqCPlQ.js";import{c as k}from"./index-Bb4qSo10.js";import{c as n}from"./cn-BM_CldAA.js";import"./index-DJO9vBfz.js";var r=(t=>(t.PAINTER="PAINTER",t.DEVIL="DEVIL",t.GUESSER="GUESSER",t))(r||{});const E=""+new URL("profile-placeholder-BaGnGob3.png",import.meta.url).href,u=""+new URL("crown-first-DfpgbdN8.png",import.meta.url).href;function Y(t){return{0:u,1:u,2:u}[t]}const R=k("flex duration-200 gap-2 lg:transition-colors",{variants:{status:{NOT_PLAYING:"bg-transparent lg:bg-eastbay-400 text-white",PLAYING:"bg-transparent lg:bg-eastbay-400 text-white"},isHost:{true:"bg-transparent lg:bg-violet-500 text-white",false:""}},defaultVariants:{status:"NOT_PLAYING",isHost:!1}}),T=({nickname:t,rank:s,score:d,role:p=null,status:m="NOT_PLAYING",isHost:a=!1,profileImage:G,className:A})=>{const g=s!==void 0&&s<=3?Y(s):null;return e.jsxs("div",{className:n(R({status:m,isHost:a}),"h-20 w-20 items-center","lg:aspect-[3/1] lg:w-full lg:items-center lg:justify-between lg:rounded-lg lg:border-2 lg:border-violet-950 lg:p-1 xl:p-3",A),children:[e.jsxs("div",{className:"flex flex-col items-center justify-center lg:flex-row lg:gap-2 xl:gap-3",children:[e.jsx("div",{className:"relative mb-1 lg:m-0",children:e.jsxs("div",{className:"flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-2 border-violet-950 bg-white/20 lg:h-14 lg:w-14 lg:rounded-xl",children:[e.jsx("img",{src:G||E,alt:"사용자 프로필"}),m!=="PLAYING"?e.jsx("div",{className:n("absolute inset-0 flex items-center justify-center rounded-full transition-all duration-300 lg:hidden",a&&"bg-violet-500/60 opacity-100"),children:a&&e.jsx("span",{className:"text-xs text-stroke-sm",children:"방장"})}):e.jsx("div",{className:"absolute inset-0 flex items-center justify-center rounded-full bg-black/50 lg:hidden",children:e.jsx("span",{className:"text-xl font-bold text-white text-stroke-sm",children:d})}),g&&e.jsx("img",{src:g,alt:`${s}등 사용자`,className:"absolute -right-1 -top-3 h-7 w-auto rotate-[30deg] lg:-right-5 lg:-top-7 lg:h-12"})]})}),e.jsxs("div",{className:"relative flex -translate-y-1 flex-col text-center lg:translate-y-0 lg:items-start",children:[e.jsx("div",{className:"relative h-3 text-stroke-sm lg:h-auto",children:e.jsx("div",{title:t,className:n("w-20 truncate text-xs text-chartreuseyellow-400","lg:w-full lg:max-w-28 lg:text-base","xl:max-w-[9.5rem] xl:text-lg","2xl:max-w-52 2xl:text-xl"),children:t})}),e.jsx("div",{className:"h-3 text-stroke-sm lg:h-auto",children:e.jsx("div",{title:p||"???",className:n("w-20 truncate text-[0.625rem] text-gray-50","lg:w-full lg:max-w-28 lg:text-sm","xl:max-w-[9.5rem] xl:text-base","2xl:max-w-52"),children:p||"???"})})]})]}),e.jsxs("div",{className:"hidden items-center gap-2 lg:flex",children:[d!==void 0&&e.jsx("div",{className:"flex aspect-square h-8 items-center justify-center rounded-lg border-2 border-violet-950 bg-halfbaked-200 xl:h-10",children:e.jsx("div",{className:"translate-x-[0.05rem] leading-5 text-eastbay-950 lg:text-lg xl:text-2xl",children:d})}),m!=="PLAYING"&&a&&e.jsx("div",{className:"rounded-md bg-violet-400 px-3 py-1 text-sm font-medium text-white",children:"방장"})]})]})};T.__docgenInfo={description:`사용자 정보를 표시하는 카드 컴포넌트입니다.

@component
@example
// 대기 상태의 사용자
<PlayerCard
  nickname="Player1"
  status="notReady"
/>

// 게임 중인 1등 사용자
<PlayerCard
  nickname="Player1"
  role="그림꾼"
  score={100}
  rank={1}
  status="gaming"
/>`,methods:[],displayName:"PlayerCard",props:{nickname:{required:!0,tsType:{name:"string"},description:""},rank:{required:!1,tsType:{name:"union",raw:"0 | 1 | 2",elements:[{name:"literal",value:"0"},{name:"literal",value:"1"},{name:"literal",value:"2"}]},description:""},score:{required:!1,tsType:{name:"number"},description:""},role:{required:!1,tsType:{name:"union",raw:"PlayerRole | null",elements:[{name:"PlayerRole"},{name:"null"}]},description:"",defaultValue:{value:"null",computed:!1}},isHost:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},className:{required:!1,tsType:{name:"string"},description:""},profileImage:{required:!1,tsType:{name:"string"},description:""},status:{defaultValue:{value:"'NOT_PLAYING'",computed:!1},required:!1}},composes:["VariantProps"]};const q={title:"components/game/PlayerCard",component:T,argTypes:{status:{control:"select",options:["NOT_PLAYING","PLAYING"],description:"사용자의 현재 상태"},nickname:{control:"text",description:"사용자 이름"},rank:{control:"number",description:"사용자의 순위 (1-3등일 경우 왕관 표시)"},score:{control:"number",description:"게임 중 획득한 점수"},role:{control:"select",options:[r.PAINTER,r.DEVIL,r.GUESSER],description:"게임에서의 역할"},isHost:{control:"boolean",description:"방장 여부"},className:{control:"text",description:"추가 스타일링"},profileImage:{control:"text",description:"사용자의 프로필 이미지"}},parameters:{layout:"centered",docs:{description:{component:"게임 참여자의 정보를 표시하는 카드 컴포넌트입니다. 상태에 따라 게임 진행 중/대기 중 모드로 표시되며, 방장일 경우 별도의 스타일이 적용됩니다."}}},tags:["autodocs"]},l={args:{nickname:"Player1",status:"NOT_PLAYING"},parameters:{docs:{description:{story:"기본적인 플레이어 카드 상태입니다."}}}},o={args:{nickname:"Player1",status:"NOT_PLAYING",isHost:!0},parameters:{docs:{description:{story:'방장인 플레이어의 카드 상태입니다. 보라색 배경과 "방장" 태그가 표시됩니다.'}}}},i={args:{nickname:"Player1",status:"PLAYING",role:r.PAINTER,score:100,rank:1},parameters:{docs:{description:{story:"게임 진행 중인 플레이어의 카드입니다. 역할과 점수가 표시되며, 상위 랭크의 경우 왕관이 표시됩니다."}}}},c={args:{nickname:"VeryLongPlayerNameThatShouldBeTruncated",status:"PLAYING",role:r.DEVIL,score:75},parameters:{docs:{description:{story:"긴 닉네임이 주어졌을 때의 처리를 보여줍니다. 닉네임이 길 경우 말줄임표로 표시됩니다."}}}};var x,f,N;l.parameters={...l.parameters,docs:{...(x=l.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    nickname: 'Player1',
    status: 'NOT_PLAYING'
  },
  parameters: {
    docs: {
      description: {
        story: '기본적인 플레이어 카드 상태입니다.'
      }
    }
  }
}`,...(N=(f=l.parameters)==null?void 0:f.docs)==null?void 0:N.source}}};var y,h,P;o.parameters={...o.parameters,docs:{...(y=o.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    nickname: 'Player1',
    status: 'NOT_PLAYING',
    isHost: true
  },
  parameters: {
    docs: {
      description: {
        story: '방장인 플레이어의 카드 상태입니다. 보라색 배경과 "방장" 태그가 표시됩니다.'
      }
    }
  }
}`,...(P=(h=o.parameters)==null?void 0:h.docs)==null?void 0:P.source}}};var w,b,v;i.parameters={...i.parameters,docs:{...(w=i.parameters)==null?void 0:w.docs,source:{originalSource:`{
  args: {
    nickname: 'Player1',
    status: 'PLAYING',
    role: PlayerRole.PAINTER,
    score: 100,
    rank: 1
  },
  parameters: {
    docs: {
      description: {
        story: '게임 진행 중인 플레이어의 카드입니다. 역할과 점수가 표시되며, 상위 랭크의 경우 왕관이 표시됩니다.'
      }
    }
  }
}`,...(v=(b=i.parameters)==null?void 0:b.docs)==null?void 0:v.source}}};var I,L,j;c.parameters={...c.parameters,docs:{...(I=c.parameters)==null?void 0:I.docs,source:{originalSource:`{
  args: {
    nickname: 'VeryLongPlayerNameThatShouldBeTruncated',
    status: 'PLAYING',
    role: PlayerRole.DEVIL,
    score: 75
  },
  parameters: {
    docs: {
      description: {
        story: '긴 닉네임이 주어졌을 때의 처리를 보여줍니다. 닉네임이 길 경우 말줄임표로 표시됩니다.'
      }
    }
  }
}`,...(j=(L=c.parameters)==null?void 0:L.docs)==null?void 0:j.source}}};const D=["Default","Host","Gaming","LongNickname"];export{l as Default,i as Gaming,o as Host,c as LongNickname,D as __namedExportsOrder,q as default};
