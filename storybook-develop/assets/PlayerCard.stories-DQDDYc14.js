import{j as e}from"./jsx-runtime-CkxqCPlQ.js";import{c as T}from"./index-Bb4qSo10.js";import{c as s}from"./cn-BM_CldAA.js";import"./index-DJO9vBfz.js";var i=(t=>(t.NOT_PLAYING="NOT_PLAYING",t.PLAYING="PLAYING",t))(i||{}),P=(t=>(t.PAINTER="PAINTER",t.DEVIL="DEVIL",t.GUESSER="GUESSER",t))(P||{});const G=""+new URL("profile-placeholder-BaGnGob3.png",import.meta.url).href,m=""+new URL("crown-first-DfpgbdN8.png",import.meta.url).href;function R(t){return{0:m,1:m,2:m}[t]}const k=T("flex duration-200 gap-2 lg:transition-colors",{variants:{status:{NOT_PLAYING:"bg-transparent lg:bg-eastbay-400 text-white",PLAYING:"bg-transparent lg:bg-eastbay-400 text-white"},isHost:{true:"bg-transparent lg:bg-violet-500 text-white",false:""}},defaultVariants:{status:"NOT_PLAYING",isHost:!1}}),j=({nickname:t,rank:a,score:c,role:u=null,status:d="NOT_PLAYING",isHost:r=!1,profileImage:I,className:A})=>{const g=a!==void 0&&a<=3?R(a):null;return e.jsxs("div",{className:s(k({status:d,isHost:r}),"h-20 w-20 items-center","lg:aspect-[3/1] lg:w-full lg:items-center lg:justify-between lg:rounded-lg lg:border-2 lg:border-violet-950 lg:p-1 xl:p-3",A),children:[e.jsxs("div",{className:"flex flex-col items-center justify-center lg:flex-row lg:gap-2 xl:gap-3",children:[e.jsx("div",{className:"relative mb-1 lg:m-0",children:e.jsxs("div",{className:"flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-2 border-violet-950 bg-white/20 lg:h-14 lg:w-14 lg:rounded-xl",children:[e.jsx("img",{src:I||G,alt:"사용자 프로필"}),d!=="PLAYING"?e.jsx("div",{className:s("absolute inset-0 flex items-center justify-center rounded-full transition-all duration-300 lg:hidden",r&&"bg-violet-500/60 opacity-100"),children:r&&e.jsx("span",{className:"text-xs text-stroke-sm",children:"방장"})}):e.jsx("div",{className:"absolute inset-0 flex items-center justify-center rounded-full bg-black/50 lg:hidden",children:e.jsx("span",{className:"text-xl font-bold text-white text-stroke-sm",children:c})}),g&&e.jsx("img",{src:g,alt:`${a}등 사용자`,className:"absolute -right-1 -top-3 h-7 w-auto rotate-[30deg] lg:-right-5 lg:-top-7 lg:h-12"})]})}),e.jsxs("div",{className:"relative flex -translate-y-1 flex-col text-center lg:translate-y-0 lg:items-start",children:[e.jsx("div",{className:"relative h-3 text-stroke-sm lg:h-auto",children:e.jsx("div",{title:t,className:s("w-20 truncate text-xs text-chartreuseyellow-400","lg:w-full lg:max-w-28 lg:text-base","xl:max-w-[9.5rem] xl:text-lg","2xl:max-w-52 2xl:text-xl"),children:t})}),e.jsx("div",{className:"h-3 text-stroke-sm lg:h-auto",children:e.jsx("div",{title:u||"???",className:s("w-20 truncate text-[0.625rem] text-gray-50","lg:w-full lg:max-w-28 lg:text-sm","xl:max-w-[9.5rem] xl:text-base","2xl:max-w-52"),children:u||"???"})})]})]}),e.jsxs("div",{className:"hidden items-center gap-2 lg:flex",children:[c!==void 0&&e.jsx("div",{className:"flex aspect-square h-8 items-center justify-center rounded-lg border-2 border-violet-950 bg-halfbaked-200 xl:h-10",children:e.jsx("div",{className:"translate-x-[0.05rem] leading-5 text-eastbay-950 lg:text-lg xl:text-2xl",children:c})}),d!=="PLAYING"&&r&&e.jsx("div",{className:"rounded-md bg-violet-400 px-3 py-1 text-sm font-medium text-white",children:"방장"})]})]})};j.__docgenInfo={description:`사용자 정보를 표시하는 카드 컴포넌트입니다.

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
/>`,methods:[],displayName:"PlayerCard",props:{nickname:{required:!0,tsType:{name:"string"},description:""},rank:{required:!1,tsType:{name:"union",raw:"0 | 1 | 2",elements:[{name:"literal",value:"0"},{name:"literal",value:"1"},{name:"literal",value:"2"}]},description:""},score:{required:!1,tsType:{name:"number"},description:""},role:{required:!1,tsType:{name:"union",raw:"PlayerRole | null",elements:[{name:"PlayerRole"},{name:"null"}]},description:"",defaultValue:{value:"null",computed:!1}},isHost:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},className:{required:!1,tsType:{name:"string"},description:""},profileImage:{required:!1,tsType:{name:"string"},description:""},status:{defaultValue:{value:"'NOT_PLAYING'",computed:!1},required:!1}},composes:["VariantProps"]};const q={title:"components/game/PlayerCard",component:j,argTypes:{status:{control:"select",options:["notReady","ready","gaming"],description:"사용자의 현재 상태"},nickname:{control:"text",description:"사용자 이름"},rank:{control:"number",description:"사용자의 순위 (1-3등일 경우 왕관 표시)"},score:{control:"number",description:"게임 중 획득한 점수"},role:{control:"select",options:["그림꾼","방해꾼","구경꾼"],description:"게임에서의 역할"},className:{control:"text",description:"추가 스타일링"},profileImage:{control:"text",description:"사용자의 프로필 이미지"}},parameters:{layout:"centered"},tags:["autodocs"]},l={args:{nickname:"Player1",status:i.NOT_READY}},n={args:{nickname:"Player1",status:i.READY}},o={args:{nickname:"Player1",status:i.PLAYING,role:P.PAINTER,score:100,rank:1}};var x,p,f;l.parameters={...l.parameters,docs:{...(x=l.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    nickname: 'Player1',
    status: PlayerStatus.NOT_READY
  }
}`,...(f=(p=l.parameters)==null?void 0:p.docs)==null?void 0:f.source}}};var h,y,N;n.parameters={...n.parameters,docs:{...(h=n.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    nickname: 'Player1',
    status: PlayerStatus.READY
  }
}`,...(N=(y=n.parameters)==null?void 0:y.docs)==null?void 0:N.source}}};var w,v,b;o.parameters={...o.parameters,docs:{...(w=o.parameters)==null?void 0:w.docs,source:{originalSource:`{
  args: {
    nickname: 'Player1',
    status: PlayerStatus.PLAYING,
    role: PlayerRole.PAINTER,
    score: 100,
    rank: 1
  }
}`,...(b=(v=o.parameters)==null?void 0:v.docs)==null?void 0:b.source}}};const D=["Default","Ready","Gaming"];export{l as Default,o as Gaming,n as Ready,D as __namedExportsOrder,q as default};
