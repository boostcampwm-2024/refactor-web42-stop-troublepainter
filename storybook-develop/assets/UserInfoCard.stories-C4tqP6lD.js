import{j as e}from"./jsx-runtime-CkxqCPlQ.js";import{c as I}from"./index-Bb4qSo10.js";import{c as s}from"./cn-BM_CldAA.js";import"./index-DJO9vBfz.js";const C=""+new URL("profile-placeholder-BaGnGob3.png",import.meta.url).href,c=""+new URL("crown-first-DfpgbdN8.png",import.meta.url).href;function P(a){return{1:c,2:c,3:c}[a]}const U=I("flex duration-200 gap-2 lg:transition-colors",{variants:{status:{notReady:"bg-transparent lg:bg-eastbay-400 text-white",ready:"bg-transparent lg:bg-violet-500 text-white",gaming:"bg-transparent lg:bg-eastbay-400 text-white"}},defaultVariants:{status:"notReady"}}),j=({username:a,rank:r,score:i,role:d="???",profileImage:N,status:t="notReady",className:R})=>{const m=r!==void 0&&r<=3?P(r):null,g={ready:{text:"준비완료",className:"text-white bg-violet-400"},notReady:{text:"대기중",className:"bg-white/10 text-white/60"}};return e.jsxs("div",{className:s(U({status:t}),"h-20 w-20 items-center","lg:aspect-[3/1] lg:w-full lg:items-center lg:justify-between lg:rounded-lg lg:border-2 lg:border-violet-950 lg:p-1 xl:p-3",R),children:[e.jsxs("div",{className:"flex flex-col items-center justify-center lg:flex-row lg:gap-3",children:[e.jsx("div",{className:"relative mb-1 lg:m-0",children:e.jsxs("div",{className:"flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-2 border-violet-950 bg-white/20 lg:h-14 lg:w-14 lg:rounded-xl",children:[e.jsx("img",{src:N||C,alt:"사용자 프로필"}),t!=="gaming"?e.jsx("div",{className:s("absolute inset-0 flex items-center justify-center rounded-full transition-all duration-300 lg:hidden",{"bg-violet-500/80 opacity-100":t==="ready","bg-transparent opacity-0":t!=="ready"}),children:t==="ready"&&e.jsx("span",{className:"text-xs text-stroke-sm",children:"준비"})}):e.jsx("div",{className:"absolute inset-0 flex items-center justify-center rounded-full bg-black/50 lg:hidden",children:e.jsx("span",{className:"text-xl font-bold text-white text-stroke-sm",children:i})}),m&&e.jsx("img",{src:m,alt:`${r}등 사용자`,className:"absolute -right-1 -top-3 h-7 w-auto rotate-[30deg] lg:-right-5 lg:-top-7 lg:h-12"})]})}),e.jsxs("div",{className:"relative flex -translate-y-1 flex-col text-center lg:translate-y-0 lg:items-start",children:[e.jsx("div",{className:"relative h-3 text-stroke-sm lg:h-auto",children:e.jsx("div",{title:a,className:s("w-20 truncate text-xs text-chartreuseyellow-400","lg:w-auto lg:max-w-28 lg:text-base","xl:max-w-[9.5rem] xl:text-lg","2xl:max-w-52 2xl:text-xl"),children:a})}),e.jsx("div",{className:"h-3 text-stroke-sm lg:h-auto",children:e.jsx("div",{title:d,className:s("w-20 truncate text-[0.625rem] text-gray-50","lg:w-auto lg:max-w-28 lg:text-sm","xl:max-w-[9.5rem] xl:text-base","2xl:max-w-52"),children:d})})]})]}),e.jsxs("div",{className:"hidden items-center gap-2 lg:flex",children:[i!==void 0&&e.jsx("div",{className:"flex aspect-square h-8 items-center justify-center rounded-lg border-2 border-violet-950 bg-halfbaked-200 xl:h-10",children:e.jsx("div",{className:"translate-x-[0.05rem] leading-5 text-eastbay-950 lg:text-lg xl:text-2xl",children:i})}),t!=="gaming"&&e.jsx("div",{className:s("rounded-md px-3 py-1 text-sm font-medium",g[t||"notReady"].className),children:g[t||"notReady"].text})]})]})};j.__docgenInfo={description:`사용자 정보를 표시하는 카드 컴포넌트입니다.

@component
@example
// 대기 상태의 사용자
<UserInfoCard
  username="Player1"
  status="notReady"
/>

// 게임 중인 1등 사용자
<UserInfoCard
  username="Player1"
  role="그림꾼"
  score={100}
  rank={1}
  status="gaming"
/>`,methods:[],displayName:"UserInfoCard",props:{username:{required:!0,tsType:{name:"string"},description:""},rank:{required:!1,tsType:{name:"UserRank"},description:""},score:{required:!1,tsType:{name:"number"},description:""},role:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"'???'",computed:!1}},className:{required:!1,tsType:{name:"string"},description:""},profileImage:{required:!1,tsType:{name:"string"},description:""},status:{defaultValue:{value:"'notReady'",computed:!1},required:!1}},composes:["VariantProps"]};const S={title:"components/game/UserInfoCard",component:j,argTypes:{status:{control:"select",options:["notReady","ready","gaming"],description:"사용자의 현재 상태"},username:{control:"text",description:"사용자 이름"},rank:{control:"number",description:"사용자의 순위 (1-3등일 경우 왕관 표시)"},score:{control:"number",description:"게임 중 획득한 점수"},role:{control:"select",options:["그림꾼","방해꾼","구경꾼"],description:"게임에서의 역할"},className:{control:"text",description:"추가 스타일링"},profileImage:{control:"text",description:"사용자의 프로필 이미지"}},parameters:{layout:"centered"},tags:["autodocs"]},n={args:{username:"Player1",status:"notReady"}},l={args:{username:"Player1",status:"ready"}},o={args:{username:"Player1",status:"gaming",role:"그림꾼",score:100,rank:1}};var x,u,p;n.parameters={...n.parameters,docs:{...(x=n.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    username: 'Player1',
    status: 'notReady'
  }
}`,...(p=(u=n.parameters)==null?void 0:u.docs)==null?void 0:p.source}}};var f,y,h;l.parameters={...l.parameters,docs:{...(f=l.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    username: 'Player1',
    status: 'ready'
  }
}`,...(h=(y=l.parameters)==null?void 0:y.docs)==null?void 0:h.source}}};var w,b,v;o.parameters={...o.parameters,docs:{...(w=o.parameters)==null?void 0:w.docs,source:{originalSource:`{
  args: {
    username: 'Player1',
    status: 'gaming',
    role: '그림꾼',
    score: 100,
    rank: 1
  }
}`,...(v=(b=o.parameters)==null?void 0:b.docs)==null?void 0:v.source}}};const V=["Default","Ready","Gaming"];export{n as Default,o as Gaming,l as Ready,V as __namedExportsOrder,S as default};
