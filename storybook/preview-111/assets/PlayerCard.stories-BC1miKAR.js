import{j as s}from"./jsx-runtime-CmIOflP4.js";import{c as q}from"./index-BV9HlZSv.js";import{a}from"./cn-Dj5kSLHa.js";import"./index-KqYmeiyw.js";var V=(e=>(e.SYNC="sync",e.UPDATE="update",e))(V||{}),H=(e=>(e.NOT_PLAYING="NOT_PLAYING",e.PLAYING="PLAYING",e))(H||{}),l=(e=>(e.PAINTER="PAINTER",e.DEVIL="DEVIL",e.GUESSER="GUESSER",e))(l||{}),F=(e=>(e.WAITING="WAITING",e.DRAWING="DRAWING",e.GUESSING="GUESSING",e.OCR="OCR",e))(F||{}),W=(e=>(e.DRAWING="DRAWING",e.GUESSING="GUESSING",e.ENDING="ENDING",e.OCR="OCR",e))(W||{}),B=(e=>(e.SUCCESS="SUCCESS",e.PLAYER_DISCONNECT="PLAYER_DISCONNECT",e))(B||{}),Q=(e=>(e[e.BAD_REQUEST=4e3]="BAD_REQUEST",e[e.UNAUTHORIZED=4001]="UNAUTHORIZED",e[e.FORBIDDEN=4003]="FORBIDDEN",e[e.NOT_FOUND=4004]="NOT_FOUND",e[e.VALIDATION_ERROR=4400]="VALIDATION_ERROR",e[e.RATE_LIMIT=4429]="RATE_LIMIT",e[e.INTERNAL_ERROR=5e3]="INTERNAL_ERROR",e[e.NOT_IMPLEMENTED=5001]="NOT_IMPLEMENTED",e[e.SERVICE_UNAVAILABLE=5003]="SERVICE_UNAVAILABLE",e[e.GAME_NOT_STARTED=6001]="GAME_NOT_STARTED",e[e.GAME_ALREADY_STARTED=6002]="GAME_ALREADY_STARTED",e[e.INVALID_TURN=6003]="INVALID_TURN",e[e.ROOM_FULL=6004]="ROOM_FULL",e[e.ROOM_NOT_FOUND=6005]="ROOM_NOT_FOUND",e[e.PLAYER_NOT_FOUND=6006]="PLAYER_NOT_FOUND",e[e.INSUFFICIENT_PLAYERS=6007]="INSUFFICIENT_PLAYERS",e[e.CONNECTION_ERROR=7e3]="CONNECTION_ERROR",e[e.CONNECTION_TIMEOUT=7001]="CONNECTION_TIMEOUT",e[e.CONNECTION_CLOSED=7002]="CONNECTION_CLOSED",e))(Q||{});const T={[l.DEVIL]:"방해꾼",[l.GUESSER]:"구경꾼",[l.PAINTER]:"그림꾼"},Y=({nickname:e,role:r,className:t})=>s.jsxs("div",{className:a("relative flex -translate-y-1 flex-col text-center lg:translate-y-0 lg:items-start",t),children:[s.jsx("div",{className:"relative h-3 text-stroke-sm lg:h-auto",children:s.jsx("div",{title:e,className:a("w-20 truncate pl-0.5 text-xs text-chartreuseyellow-400","lg:w-full lg:max-w-28 lg:text-base","xl:max-w-[9.5rem] xl:text-lg","2xl:max-w-52 2xl:text-xl"),children:`${e}`})}),s.jsx("div",{className:"h-3 text-stroke-sm lg:h-auto",children:s.jsx("div",{title:r?T[r]:"???",className:a("w-20 truncate pl-0.5 text-[0.625rem] text-gray-50","lg:w-full lg:max-w-28 lg:text-sm","xl:max-w-[9.5rem] xl:text-base","2xl:max-w-52"),children:r?T[r]:"???"})})]});Y.__docgenInfo={description:"",methods:[],displayName:"PlayerCardInfo",props:{nickname:{required:!0,tsType:{name:"string"},description:""},role:{required:!1,tsType:{name:"union",raw:"PlayerRole | null",elements:[{name:"PlayerRole"},{name:"null"}]},description:""},className:{required:!1,tsType:{name:"string"},description:""}}};const Z=""+new URL("crown-first-DfpgbdN8.png",import.meta.url).href,$=""+new URL("profile-placeholder-BaGnGob3.png",import.meta.url).href,j=({nickname:e,profileImage:r,isWinner:t,score:i,isHost:n,isMe:o,showScore:c=!1,className:f})=>{const I=t!==void 0;return s.jsx("div",{className:a("relative mb-1 lg:m-0",f),children:s.jsxs("div",{className:a("relative flex h-12 w-12 items-center justify-center overflow-hidden lg:h-14 lg:w-14","rounded-full border-2 bg-white/20 lg:rounded-xl",o?n?"border-halfbaked-900":"border-violet-900":"border-halfbaked-900"),children:[s.jsx("img",{src:r||$,alt:`${e}의 프로필`,className:"h-full w-full object-cover"}),c?s.jsx("div",{className:a("absolute inset-0 flex items-center justify-center rounded-full lg:hidden",o?"bg-violet-500/50":"bg-black/50"),children:s.jsx("span",{className:"text-xl font-bold text-white text-stroke-sm",children:i})}):s.jsx(s.Fragment,{children:(n&&!o||o)&&s.jsx("div",{className:a("absolute inset-0 flex items-center justify-center rounded-full lg:hidden",n?"bg-halfbaked-500/50":"bg-violet-500/50"),children:s.jsx("span",{className:"text-xs text-stroke-sm",children:o?"나!":"방장"})})}),I&&s.jsx("img",{src:Z,alt:"1등 왕관 아이콘",className:"absolute -right-1 -top-3 h-7 w-auto rotate-[30deg] lg:-right-5 lg:-top-7 lg:h-12"})]})})};j.__docgenInfo={description:"",methods:[],displayName:"PlayerCardProfile",props:{nickname:{required:!0,tsType:{name:"string"},description:""},profileImage:{required:!1,tsType:{name:"string"},description:""},isWinner:{required:!1,tsType:{name:"boolean"},description:""},score:{required:!1,tsType:{name:"number"},description:""},isHost:{required:!0,tsType:{name:"boolean"},description:""},isMe:{required:!0,tsType:{name:"union",raw:"boolean | null",elements:[{name:"boolean"},{name:"null"}]},description:""},showScore:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},className:{required:!1,tsType:{name:"string"},description:""}}};const k=({score:e,isHost:r,isPlaying:t,isMe:i,className:n})=>s.jsxs("div",{className:a("hidden items-center gap-2 lg:flex",n),children:[e!==void 0&&t&&s.jsx("div",{className:"flex aspect-square h-8 items-center justify-center rounded-lg border-2 border-violet-950 bg-halfbaked-200 xl:h-10",children:s.jsx("div",{className:"translate-x-[0.05rem] leading-5 text-eastbay-950 lg:text-lg xl:text-2xl",children:e})}),!t&&r&&s.jsx("div",{className:a("cursor-default rounded-md px-2 py-1 text-xs font-medium text-white shadow-lg hover:animate-spin xl:text-sm",i?"bg-violet-200 text-violet-900":"bg-halfbaked-200 text-halfbaked-900"),children:"방장"})]});k.__docgenInfo={description:"",methods:[],displayName:"PlayerCardStatus",props:{score:{required:!1,tsType:{name:"number"},description:""},isHost:{required:!0,tsType:{name:"union",raw:"boolean | null",elements:[{name:"boolean"},{name:"null"}]},description:""},isPlaying:{required:!0,tsType:{name:"boolean"},description:""},isMe:{required:!0,tsType:{name:"union",raw:"boolean | null",elements:[{name:"boolean"},{name:"null"}]},description:""},className:{required:!1,tsType:{name:"string"},description:""}}};const X=q("flex h-20 w-20 items-center gap-2 duration-200 lg:aspect-[3/1] lg:w-full lg:items-center lg:justify-between lg:rounded-lg lg:border-2 lg:p-1 lg:transition-colors xl:p-3",{variants:{status:{NOT_PLAYING:"bg-transparent lg:bg-eastbay-400",PLAYING:"bg-transparent lg:bg-eastbay-400"},isMe:{true:"bg-transparent lg:bg-violet-500 lg:border-violet-800",false:"lg:border-halfbaked-800"}},defaultVariants:{status:"NOT_PLAYING",isMe:!1}}),M=({nickname:e,isWinner:r,score:t,role:i=null,status:n="NOT_PLAYING",isHost:o=!1,isMe:c=!1,profileImage:f,className:I})=>s.jsxs("div",{className:a(X({status:n,isMe:c}),I),children:[s.jsxs("div",{className:"flex flex-col items-center justify-center lg:flex-row lg:gap-1 xl:gap-1.5",children:[s.jsx(j,{nickname:e,profileImage:f,isWinner:r,score:t,isHost:o||!1,isMe:c,showScore:n==="PLAYING"}),s.jsx(Y,{nickname:e,role:i})]}),s.jsx(k,{score:t,isHost:o,isPlaying:n==="PLAYING",isMe:c})]});M.__docgenInfo={description:`사용자 정보를 표시하는 카드 컴포넌트입니다.

@component
@example
// 대기 상태의 사용자
<PlayerCard
  nickname="Player1"
  status="PLAYING"
/>

// 게임 중인 1등 사용자
<PlayerCard
  nickname="Player1"
  role="그림꾼"
  score={100}
  isWinner={true}
  status="NOT_PLAYING"
/>`,methods:[],displayName:"PlayerCard",props:{nickname:{required:!0,tsType:{name:"string"},description:""},isWinner:{required:!1,tsType:{name:"boolean"},description:""},score:{required:!1,tsType:{name:"number"},description:""},role:{required:!1,tsType:{name:"union",raw:"PlayerRole | null",elements:[{name:"PlayerRole"},{name:"null"}]},description:"",defaultValue:{value:"null",computed:!1}},isHost:{required:!1,tsType:{name:"union",raw:"boolean | null",elements:[{name:"boolean"},{name:"null"}]},description:"",defaultValue:{value:"false",computed:!1}},className:{required:!1,tsType:{name:"string"},description:""},profileImage:{required:!1,tsType:{name:"string"},description:""},status:{defaultValue:{value:"'NOT_PLAYING'",computed:!1},required:!1},isMe:{defaultValue:{value:"false",computed:!1},required:!1}},composes:["VariantProps"]};const se={title:"components/ui/player-card/PlayerCard",component:M,argTypes:{status:{control:"select",options:["NOT_PLAYING","PLAYING"],description:"사용자의 현재 상태"},nickname:{control:"text",description:"사용자 이름"},isWinner:{control:"boolean",description:"1등 여부 (왕관 표시)"},score:{control:"number",description:"게임 중 획득한 점수"},role:{control:"select",options:[l.PAINTER,l.DEVIL,l.GUESSER],description:"게임에서의 역할"},isHost:{control:"boolean",description:"방장 여부"},isMe:{control:"boolean",description:"현재 사용자 여부"},className:{control:"text",description:"추가 스타일링"},profileImage:{control:"text",description:"사용자의 프로필 이미지"}},parameters:{layout:"centered",docs:{description:{component:"게임 참여자의 정보를 표시하는 카드 컴포넌트입니다. 상태(게임 진행/대기)와 역할(본인/방장)에 따라 다른 스타일이 적용됩니다."}}},tags:["autodocs"]},d={args:{nickname:"Player1",status:"NOT_PLAYING",isHost:null,isMe:!1},parameters:{docs:{description:{story:"기본적인 플레이어 카드 상태입니다."}}}},m={args:{nickname:"Player1",status:"NOT_PLAYING",isHost:null,isMe:!0},parameters:{docs:{description:{story:"현재 사용자의 카드 상태입니다. 보라색 테두리와 배경으로 구분됩니다."}}}},u={args:{nickname:"Player1",status:"NOT_PLAYING",isHost:!0,isMe:!1},parameters:{docs:{description:{story:'방장인 플레이어의 카드 상태입니다. "방장" 태그가 표시됩니다.'}}}},p={args:{nickname:"Player1",status:"NOT_PLAYING",isHost:!0,isMe:!0},parameters:{docs:{description:{story:"방장이면서 현재 사용자인 카드 상태입니다. 보라색 테마와 방장 태그가 모두 적용됩니다."}}}},N={args:{nickname:"Player1",status:"PLAYING",role:l.PAINTER,score:100,isWinner:!0,isHost:null,isMe:!1},parameters:{docs:{description:{story:"게임 진행 중인 플레이어의 카드입니다. 역할과 점수가 표시되며, 1등인 경우 왕관이 표시됩니다."}}}},g={args:{nickname:"VeryLongPlayerNameThatShouldBeTruncated",status:"PLAYING",role:l.DEVIL,score:75,isHost:null,isMe:!1},parameters:{docs:{description:{story:"긴 닉네임이 주어졌을 때의 처리를 보여줍니다. 닉네임이 길 경우 말줄임표로 표시됩니다."}}}};var x,y,E;d.parameters={...d.parameters,docs:{...(x=d.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    nickname: 'Player1',
    status: 'NOT_PLAYING',
    isHost: null,
    isMe: false
  },
  parameters: {
    docs: {
      description: {
        story: '기본적인 플레이어 카드 상태입니다.'
      }
    }
  }
}`,...(E=(y=d.parameters)==null?void 0:y.docs)==null?void 0:E.source}}};var A,P,O;m.parameters={...m.parameters,docs:{...(A=m.parameters)==null?void 0:A.docs,source:{originalSource:`{
  args: {
    nickname: 'Player1',
    status: 'NOT_PLAYING',
    isHost: null,
    isMe: true
  },
  parameters: {
    docs: {
      description: {
        story: '현재 사용자의 카드 상태입니다. 보라색 테두리와 배경으로 구분됩니다.'
      }
    }
  }
}`,...(O=(P=m.parameters)==null?void 0:P.docs)==null?void 0:O.source}}};var R,_,L;u.parameters={...u.parameters,docs:{...(R=u.parameters)==null?void 0:R.docs,source:{originalSource:`{
  args: {
    nickname: 'Player1',
    status: 'NOT_PLAYING',
    isHost: true,
    isMe: false
  },
  parameters: {
    docs: {
      description: {
        story: '방장인 플레이어의 카드 상태입니다. "방장" 태그가 표시됩니다.'
      }
    }
  }
}`,...(L=(_=u.parameters)==null?void 0:_.docs)==null?void 0:L.source}}};var b,h,G;p.parameters={...p.parameters,docs:{...(b=p.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    nickname: 'Player1',
    status: 'NOT_PLAYING',
    isHost: true,
    isMe: true
  },
  parameters: {
    docs: {
      description: {
        story: '방장이면서 현재 사용자인 카드 상태입니다. 보라색 테마와 방장 태그가 모두 적용됩니다.'
      }
    }
  }
}`,...(G=(h=p.parameters)==null?void 0:h.docs)==null?void 0:G.source}}};var S,C,D;N.parameters={...N.parameters,docs:{...(S=N.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    nickname: 'Player1',
    status: 'PLAYING',
    role: PlayerRole.PAINTER,
    score: 100,
    isWinner: true,
    isHost: null,
    isMe: false
  },
  parameters: {
    docs: {
      description: {
        story: '게임 진행 중인 플레이어의 카드입니다. 역할과 점수가 표시되며, 1등인 경우 왕관이 표시됩니다.'
      }
    }
  }
}`,...(D=(C=N.parameters)==null?void 0:C.docs)==null?void 0:D.source}}};var v,w,U;g.parameters={...g.parameters,docs:{...(v=g.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {
    nickname: 'VeryLongPlayerNameThatShouldBeTruncated',
    status: 'PLAYING',
    role: PlayerRole.DEVIL,
    score: 75,
    isHost: null,
    isMe: false
  },
  parameters: {
    docs: {
      description: {
        story: '긴 닉네임이 주어졌을 때의 처리를 보여줍니다. 닉네임이 길 경우 말줄임표로 표시됩니다.'
      }
    }
  }
}`,...(U=(w=g.parameters)==null?void 0:w.docs)==null?void 0:U.source}}};const re=["Default","CurrentUser","Host","HostAndCurrentUser","Gaming","LongNickname"];export{m as CurrentUser,d as Default,N as Gaming,u as Host,p as HostAndCurrentUser,g as LongNickname,re as __namedExportsOrder,se as default};
