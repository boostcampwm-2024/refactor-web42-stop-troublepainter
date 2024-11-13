import{j as e}from"./jsx-runtime-CkxqCPlQ.js";import{c as C}from"./index-Bb4qSo10.js";import{c,a as u}from"./cn-jM7Hu9J5.js";import"./index-DJO9vBfz.js";const P=""+new URL("profile-placeholder-BaGnGob3.png",import.meta.url).href,l=""+new URL("crown-first-DfpgbdN8.png",import.meta.url).href;function k(i){return{1:l,2:l,3:l}[i]}const T=C("flex duration-200 gap-2 sm:transition-colors",{variants:{status:{notReady:"bg-transparent sm:bg-eastbay-400 text-white",ready:"bg-transparent sm:bg-violet-500 text-white",gaming:"bg-transparent sm:bg-eastbay-400 text-white"}},defaultVariants:{status:"notReady"}}),v=({username:i,rank:t,score:r,role:N="???",profileImage:R,status:s="notReady",className:I})=>{const m=t!==void 0&&t<=3?k(t):null,d={ready:{text:"준비완료",className:"text-white bg-violet-400"},notReady:{text:"대기중",className:"bg-white/10 text-white/60"}};return e.jsxs("div",{className:c(T({status:s}),"sm:h-[5.5rem] sm:w-[18.25rem] sm:items-center sm:justify-between sm:rounded-lg sm:border-2 sm:border-violet-950 sm:p-3","h-20 w-12 items-center justify-between p-2",I),children:[e.jsxs("div",{className:"flex flex-col items-center justify-center sm:flex-row sm:gap-3",children:[e.jsx("div",{className:"relative",children:e.jsxs("div",{className:"bg-white/20 flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-2 border-violet-950 sm:h-14 sm:w-14 sm:rounded-xl",children:[e.jsx("img",{src:R||P,alt:"사용자 프로필"}),s!=="gaming"?e.jsx("div",{className:u("absolute inset-0 flex items-center justify-center rounded-full transition-all duration-300 sm:hidden",{"bg-violet-500/80 opacity-100":s==="ready","bg-transparent opacity-0":s!=="ready"}),children:s==="ready"&&e.jsx("span",{className:"text-xs text-stroke-sm",children:"준비"})}):e.jsx("div",{className:"bg-black/50 absolute inset-0 flex items-center justify-center rounded-full sm:hidden",children:e.jsx("span",{className:"text-white text-xl font-bold text-stroke-sm",children:r})}),m&&e.jsx("img",{src:m,alt:`${t}등 사용자`,className:"absolute -right-1 -top-3 h-7 w-auto rotate-[30deg] sm:-right-5 sm:-top-7 sm:h-12"})]})}),e.jsxs("div",{className:"flex -translate-y-1 flex-col items-center sm:translate-y-0 sm:items-start",children:[e.jsx("div",{className:"h-3 text-stroke-sm sm:h-auto",children:e.jsx("span",{className:"text-xs text-chartreuseyellow-400 sm:text-2xl",children:i})}),e.jsx("div",{className:"h-3 text-stroke-sm sm:h-auto",children:e.jsx("span",{className:"text-gray-50 text-[0.625rem] sm:text-base",children:N})})]})]}),e.jsxs("div",{className:"hidden items-center gap-2 sm:flex",children:[r!==void 0&&e.jsx("div",{className:u("flex h-10 items-center justify-center rounded-lg border-2 border-violet-950 bg-halfbaked-200",{"px-3":r<10,"px-1.5":r>=10}),children:e.jsx("div",{className:"translate-x-[0.05rem] text-2xl leading-5 text-eastbay-950",children:r})}),s!=="gaming"&&e.jsx("div",{className:c("rounded-md px-3 py-1 text-sm font-medium",d[s||"notReady"].className),children:d[s||"notReady"].text})]})]})};v.__docgenInfo={description:`사용자 정보를 표시하는 카드 컴포넌트입니다.

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
/>`,methods:[],displayName:"UserInfoCard",props:{username:{required:!0,tsType:{name:"string"},description:""},rank:{required:!1,tsType:{name:"UserRank"},description:""},score:{required:!1,tsType:{name:"number"},description:""},role:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"'???'",computed:!1}},className:{required:!1,tsType:{name:"string"},description:""},profileImage:{required:!1,tsType:{name:"string"},description:""},status:{defaultValue:{value:"'notReady'",computed:!1},required:!1}},composes:["VariantProps"]};const V={title:"Game/UserInfoCard",component:v,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{status:{control:"select",options:["notReady","ready","gaming"],description:"사용자의 현재 상태를 표시"},username:{control:"text",description:"사용자 이름"},rank:{control:"number",description:"사용자의 순위 (1-3등일 경우 왕관 표시)"},score:{control:"number",description:"게임 중 획득한 점수"},role:{control:"text",description:"게임에서의 역할 (그림꾼, 방해꾼 등)"}}},a={args:{username:"Player1",status:"notReady"}},n={args:{username:"Player1",status:"ready"}},o={args:{username:"Player1",status:"gaming",role:"그림꾼",score:100,rank:1}};var p,x,g;a.parameters={...a.parameters,docs:{...(p=a.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    username: 'Player1',
    status: 'notReady'
  }
}`,...(g=(x=a.parameters)==null?void 0:x.docs)==null?void 0:g.source}}};var f,y,h;n.parameters={...n.parameters,docs:{...(f=n.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    username: 'Player1',
    status: 'ready'
  }
}`,...(h=(y=n.parameters)==null?void 0:y.docs)==null?void 0:h.source}}};var b,w,j;o.parameters={...o.parameters,docs:{...(b=o.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    username: 'Player1',
    status: 'gaming',
    role: '그림꾼',
    score: 100,
    rank: 1
  }
}`,...(j=(w=o.parameters)==null?void 0:w.docs)==null?void 0:j.source}}};const D=["Default","Ready","Gaming"];export{a as Default,o as Gaming,n as Ready,D as __namedExportsOrder,V as default};
