import{j as e}from"./jsx-runtime-CkxqCPlQ.js";import{c as V}from"./index-Bb4qSo10.js";import{c as n}from"./cn-BM_CldAA.js";import"./index-DJO9vBfz.js";var o=(s=>(s.PAINTER="PAINTER",s.DEVIL="DEVIL",s.GUESSER="GUESSER",s))(o||{});const S=({nickname:s,role:r,className:a})=>e.jsxs("div",{className:n("relative flex -translate-y-1 flex-col text-center lg:translate-y-0 lg:items-start",a),children:[e.jsx("div",{className:"relative h-3 text-stroke-sm lg:h-auto",children:e.jsx("div",{title:s,className:n("w-20 truncate pl-0.5 text-xs text-chartreuseyellow-400","lg:w-full lg:max-w-28 lg:text-base","xl:max-w-[9.5rem] xl:text-lg","2xl:max-w-52 2xl:text-xl"),children:`${s}`})}),e.jsx("div",{className:"h-3 text-stroke-sm lg:h-auto",children:e.jsx("div",{title:r||"???",className:n("w-20 truncate pl-0.5 text-[0.625rem] text-gray-50","lg:w-full lg:max-w-28 lg:text-sm","xl:max-w-[9.5rem] xl:text-base","2xl:max-w-52"),children:r||"???"})})]});S.__docgenInfo={description:"",methods:[],displayName:"PlayerCardInfo",props:{nickname:{required:!0,tsType:{name:"string"},description:""},role:{required:!1,tsType:{name:"union",raw:"PlayerRole | null",elements:[{name:"PlayerRole"},{name:"null"}]},description:""},className:{required:!1,tsType:{name:"string"},description:""}}};const M=""+new URL("crown-first-DfpgbdN8.png",import.meta.url).href,U=""+new URL("profile-placeholder-BaGnGob3.png",import.meta.url).href,H=({nickname:s,profileImage:r,isWinner:a,score:i,isHost:t,isMe:l,showScore:c=!1,className:x})=>{const y=a!==void 0;return e.jsx("div",{className:n("relative mb-1 lg:m-0",x),children:e.jsxs("div",{className:n("relative flex h-12 w-12 items-center justify-center overflow-hidden lg:h-14 lg:w-14","rounded-full border-2 bg-white/20 lg:rounded-xl",l?t?"border-halfbaked-900":"border-violet-900":"border-halfbaked-900"),children:[e.jsx("img",{src:r||U,alt:`${s}의 프로필`,className:"h-full w-full object-cover"}),c?e.jsx("div",{className:"absolute inset-0 flex items-center justify-center rounded-full bg-black/50 lg:hidden",children:e.jsx("span",{className:"text-xl font-bold text-white text-stroke-sm",children:i})}):e.jsx(e.Fragment,{children:(t&&!l||l)&&e.jsx("div",{className:n("absolute inset-0 flex items-center justify-center rounded-full lg:hidden",t?"bg-halfbaked-500/50":"bg-violet-500/50"),children:e.jsx("span",{className:"text-xs text-stroke-sm",children:l?"나!":"방장"})})}),y&&e.jsx("img",{src:M,alt:"1등 왕관 아이콘",className:"absolute -right-1 -top-3 h-7 w-auto rotate-[30deg] lg:-right-5 lg:-top-7 lg:h-12"})]})})};H.__docgenInfo={description:"",methods:[],displayName:"PlayerCardProfile",props:{nickname:{required:!0,tsType:{name:"string"},description:""},profileImage:{required:!1,tsType:{name:"string"},description:""},isWinner:{required:!1,tsType:{name:"boolean"},description:""},score:{required:!1,tsType:{name:"number"},description:""},isHost:{required:!0,tsType:{name:"boolean"},description:""},isMe:{required:!0,tsType:{name:"union",raw:"boolean | null",elements:[{name:"boolean"},{name:"null"}]},description:""},showScore:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},className:{required:!1,tsType:{name:"string"},description:""}}};const O=({score:s,isHost:r,isPlaying:a,isMe:i,className:t})=>!s&&!r?null:e.jsxs("div",{className:n("hidden items-center gap-2 lg:flex",t),children:[s!==void 0&&a&&e.jsx("div",{className:"flex aspect-square h-8 items-center justify-center rounded-lg border-2 border-violet-950 bg-halfbaked-200 xl:h-10",children:e.jsx("div",{className:"translate-x-[0.05rem] leading-5 text-eastbay-950 lg:text-lg xl:text-2xl",children:s})}),!a&&r&&e.jsx("div",{className:n("cursor-default rounded-md px-2 py-1 text-xs font-medium text-white shadow-lg hover:animate-spin xl:text-sm",i?"bg-violet-200 text-violet-900":"bg-halfbaked-200 text-halfbaked-900"),children:"방장"})]});O.__docgenInfo={description:"",methods:[],displayName:"PlayerCardStatus",props:{score:{required:!1,tsType:{name:"number"},description:""},isHost:{required:!0,tsType:{name:"union",raw:"boolean | null",elements:[{name:"boolean"},{name:"null"}]},description:""},isPlaying:{required:!0,tsType:{name:"boolean"},description:""},isMe:{required:!0,tsType:{name:"union",raw:"boolean | null",elements:[{name:"boolean"},{name:"null"}]},description:""},className:{required:!1,tsType:{name:"string"},description:""}}};const D=V("flex h-20 w-20 items-center gap-2 duration-200 lg:aspect-[3/1] lg:w-full lg:items-center lg:justify-between lg:rounded-lg lg:border-2 lg:p-1 lg:transition-colors xl:p-3",{variants:{status:{NOT_PLAYING:"bg-transparent lg:bg-eastbay-400",PLAYING:"bg-transparent lg:bg-eastbay-400"},isMe:{true:"bg-transparent lg:bg-violet-500 lg:border-violet-800",false:"lg:border-halfbaked-800"}},defaultVariants:{status:"NOT_PLAYING",isMe:!1}}),R=({nickname:s,isWinner:r,score:a,role:i=null,status:t="NOT_PLAYING",isHost:l=!1,isMe:c=!1,profileImage:x,className:y})=>e.jsxs("div",{className:n(D({status:t,isMe:c}),y),children:[e.jsxs("div",{className:"flex flex-col items-center justify-center lg:flex-row lg:gap-1 xl:gap-1.5",children:[e.jsx(H,{nickname:s,profileImage:x,isWinner:r,score:a,isHost:l||!1,isMe:c,showScore:t==="PLAYING"}),e.jsx(S,{nickname:s,role:i})]}),e.jsx(O,{score:a,isHost:l,isPlaying:t==="PLAYING",isMe:c})]});R.__docgenInfo={description:`사용자 정보를 표시하는 카드 컴포넌트입니다.

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
/>`,methods:[],displayName:"PlayerCard",props:{nickname:{required:!0,tsType:{name:"string"},description:""},isWinner:{required:!1,tsType:{name:"boolean"},description:""},score:{required:!1,tsType:{name:"number"},description:""},role:{required:!1,tsType:{name:"union",raw:"PlayerRole | null",elements:[{name:"PlayerRole"},{name:"null"}]},description:"",defaultValue:{value:"null",computed:!1}},isHost:{required:!1,tsType:{name:"union",raw:"boolean | null",elements:[{name:"boolean"},{name:"null"}]},description:"",defaultValue:{value:"false",computed:!1}},className:{required:!1,tsType:{name:"string"},description:""},profileImage:{required:!1,tsType:{name:"string"},description:""},status:{defaultValue:{value:"'NOT_PLAYING'",computed:!1},required:!1},isMe:{defaultValue:{value:"false",computed:!1},required:!1}},composes:["VariantProps"]};const z={title:"components/ui/player-card/PlayerCard",component:R,argTypes:{status:{control:"select",options:["NOT_PLAYING","PLAYING"],description:"사용자의 현재 상태"},nickname:{control:"text",description:"사용자 이름"},isWinner:{control:"boolean",description:"1등 여부 (왕관 표시)"},score:{control:"number",description:"게임 중 획득한 점수"},role:{control:"select",options:[o.PAINTER,o.DEVIL,o.GUESSER],description:"게임에서의 역할"},isHost:{control:"boolean",description:"방장 여부"},isMe:{control:"boolean",description:"현재 사용자 여부"},className:{control:"text",description:"추가 스타일링"},profileImage:{control:"text",description:"사용자의 프로필 이미지"}},parameters:{layout:"centered",docs:{description:{component:"게임 참여자의 정보를 표시하는 카드 컴포넌트입니다. 상태(게임 진행/대기)와 역할(본인/방장)에 따라 다른 스타일이 적용됩니다."}}},tags:["autodocs"]},d={args:{nickname:"Player1",status:"NOT_PLAYING",isHost:null,isMe:!1},parameters:{docs:{description:{story:"기본적인 플레이어 카드 상태입니다."}}}},m={args:{nickname:"Player1",status:"NOT_PLAYING",isHost:null,isMe:!0},parameters:{docs:{description:{story:"현재 사용자의 카드 상태입니다. 보라색 테두리와 배경으로 구분됩니다."}}}},u={args:{nickname:"Player1",status:"NOT_PLAYING",isHost:!0,isMe:!1},parameters:{docs:{description:{story:'방장인 플레이어의 카드 상태입니다. "방장" 태그가 표시됩니다.'}}}},p={args:{nickname:"Player1",status:"NOT_PLAYING",isHost:!0,isMe:!0},parameters:{docs:{description:{story:"방장이면서 현재 사용자인 카드 상태입니다. 보라색 테마와 방장 태그가 모두 적용됩니다."}}}},g={args:{nickname:"Player1",status:"PLAYING",role:o.PAINTER,score:100,isWinner:!0,isHost:null,isMe:!1},parameters:{docs:{description:{story:"게임 진행 중인 플레이어의 카드입니다. 역할과 점수가 표시되며, 1등인 경우 왕관이 표시됩니다."}}}},f={args:{nickname:"VeryLongPlayerNameThatShouldBeTruncated",status:"PLAYING",role:o.DEVIL,score:75,isHost:null,isMe:!1},parameters:{docs:{description:{story:"긴 닉네임이 주어졌을 때의 처리를 보여줍니다. 닉네임이 길 경우 말줄임표로 표시됩니다."}}}};var N,b,h;d.parameters={...d.parameters,docs:{...(N=d.parameters)==null?void 0:N.docs,source:{originalSource:`{
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
}`,...(h=(b=d.parameters)==null?void 0:b.docs)==null?void 0:h.source}}};var P,T,I;m.parameters={...m.parameters,docs:{...(P=m.parameters)==null?void 0:P.docs,source:{originalSource:`{
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
}`,...(I=(T=m.parameters)==null?void 0:T.docs)==null?void 0:I.source}}};var v,w,L;u.parameters={...u.parameters,docs:{...(v=u.parameters)==null?void 0:v.docs,source:{originalSource:`{
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
}`,...(L=(w=u.parameters)==null?void 0:w.docs)==null?void 0:L.source}}};var j,k,A;p.parameters={...p.parameters,docs:{...(j=p.parameters)==null?void 0:j.docs,source:{originalSource:`{
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
}`,...(A=(k=p.parameters)==null?void 0:k.docs)==null?void 0:A.source}}};var G,q,_;g.parameters={...g.parameters,docs:{...(G=g.parameters)==null?void 0:G.docs,source:{originalSource:`{
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
}`,...(_=(q=g.parameters)==null?void 0:q.docs)==null?void 0:_.source}}};var Y,C,E;f.parameters={...f.parameters,docs:{...(Y=f.parameters)==null?void 0:Y.docs,source:{originalSource:`{
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
}`,...(E=(C=f.parameters)==null?void 0:C.docs)==null?void 0:E.source}}};const J=["Default","CurrentUser","Host","HostAndCurrentUser","Gaming","LongNickname"];export{m as CurrentUser,d as Default,g as Gaming,u as Host,p as HostAndCurrentUser,f as LongNickname,J as __namedExportsOrder,z as default};
