import{j as e}from"./jsx-runtime-CmIOflP4.js";import{a as h}from"./cn-Dj5kSLHa.js";import"./index-KqYmeiyw.js";const j=""+new URL("small-timer-BCKdz2t1.gif",import.meta.url).href,y="data:image/png;base64,R0lGODdhZABkAJEAAAAAAHo4/////wAAACH5BAkOAAMALAAAAABkAGQAAAL/nI+py+0Po5y02ouz3rz7D4biSJbmiabqyrbuC8fyTNf2jef6zsfADwwKgb3O8CgscpBMgHIDDEinVCnxmYlWt1fsRbuldr2RY7g6JEPM52la7WC3A2+4YTjPi+tKvF5/5OX3NxdYBBbWhFT4w4PIpTiY2LjziBYpxOiEY3kk8AkaKgoq50ZJ0zk0uipaanU6kyrESivgSgf7IlvLyysLs9srPPqr+wMJMKxMeny5uRK8LM0MgKwSPS1djIKdrbx90u0tDG4CBjSebtuM+xzOjq7ufZ5bQp8sn33/Xu2cr8/OlDsQ4v71KvehoMFaCD3cW5hu34iHEOfBq+fwIr6K+NMkiqDIUZtGEiBDfhs5UaNJkf3akVS58mTLMQRhxiSH8qPNm75yhijJk5bHnzuDshpac+YPoz2VDkxYlGkrn0kFShVKFarTq0ezZtzKlZhXI1HDItVqNexUpy/BqqUmsC0yswFfPf06l2tDsi3TXt2L1i5dtimAGj0rV7DesTr7Kr4JmKjjdkEjV/XH03LjvBU1J96zEaLnlJPjda7rUoasIB0l2bWx2rTMINZqxF7KkrazHJZAY0IN2hFwgb8nB6803G5xTX0yEdIURJDz52cMPXFN3TdNMsWb2GnQncl3BuGRjF9Q3vr59ezbu38PP778+fTrtygAADs=",d=({className:s,currentRound:u,totalRound:p,remainingTime:n,title:x,isHidden:g,...b})=>e.jsx(e.Fragment,{children:e.jsxs("div",{className:h("relative flex w-full max-w-screen-sm items-center justify-center border-violet-950 bg-violet-500 p-1.5 sm:rounded-lg sm:border-2 sm:p-2.5",g&&"hidden",s),...b,children:[e.jsxs("p",{className:"absolute left-2 text-xs text-stroke-sm sm:text-sm md:text-base lg:left-3.5 xl:text-lg",children:[e.jsx("span",{children:u}),e.jsx("span",{children:" of "}),e.jsx("span",{children:p})]}),e.jsx("h2",{className:"text-xl text-stroke-md lg:text-2xl xl:text-3xl",children:x}),e.jsx("div",{className:"absolute -right-0 -top-[1.125rem] h-16 w-16 sm:-top-[1.3rem] sm:right-0 sm:h-20 sm:w-20 lg:-right-7 lg:-top-5 lg:w-20 xl:-right-[1.85rem] xl:-top-7 xl:w-24 2xl:-right-8 2xl:-top-9 2xl:w-28",children:e.jsxs("div",{className:"relative",children:[n>10?e.jsx("img",{src:y,alt:"타이머",className:"object-fill",width:128,height:128}):e.jsx("img",{src:j,alt:"타이머",className:"object-fill",width:128,height:128}),e.jsx("span",{className:"absolute inset-0 top-1/2 flex -translate-y-1/3 items-center justify-center text-base text-stroke-md sm:text-xl lg:ml-1 lg:text-2xl xl:text-3xl 2xl:text-[2rem]",children:n})]})})]})});d.__docgenInfo={description:"",methods:[],displayName:"QuizTitle",props:{currentRound:{required:!0,tsType:{name:"number"},description:""},totalRound:{required:!0,tsType:{name:"number"},description:""},title:{required:!0,tsType:{name:"string"},description:""},remainingTime:{required:!0,tsType:{name:"number"},description:""},isHidden:{required:!0,tsType:{name:"boolean"},description:""}},composes:["HTMLAttributes"]};const N={component:d,title:"components/game/QuizTitle",argTypes:{currentRound:{control:"number",description:"현재 라운드",table:{type:{summary:"number"}}},totalRound:{control:"number",description:"전체 라운드",table:{type:{summary:"number"}}},title:{control:"text",description:"제시어",table:{type:{summary:"string"}}},remainingTime:{control:"number",description:"남은 시간 (초)",table:{type:{summary:"number"}}},className:{control:"text",description:"추가 스타일링"}},parameters:{docs:{description:{component:`
게임의 현재 상태를 보여주는 컴포넌트입니다.

### 기능
- 현재 라운드 / 전체 라운드 표시
- 퀴즈 제시어 표시
- 남은 드로잉 시간 표시 (10초 이하일 때 깜빡이는 효과)
`}}},decorators:[s=>e.jsx("div",{className:"bg-eastbay-50 p-5",children:e.jsx(s,{})})],tags:["autodocs"]},t={args:{currentRound:1,totalRound:10,title:"사과",remainingTime:30}},r={args:{currentRound:5,totalRound:10,title:"바나나",remainingTime:8},parameters:{docs:{description:{story:"남은 시간이 10초 이하일 때는 타이머가 깜빡이는 효과가 적용됩니다."}}}};var i,a,o;t.parameters={...t.parameters,docs:{...(i=t.parameters)==null?void 0:i.docs,source:{originalSource:`{
  args: {
    currentRound: 1,
    totalRound: 10,
    title: '사과',
    remainingTime: 30
  }
}`,...(o=(a=t.parameters)==null?void 0:a.docs)==null?void 0:o.source}}};var l,m,c;r.parameters={...r.parameters,docs:{...(l=r.parameters)==null?void 0:l.docs,source:{originalSource:`{
  args: {
    currentRound: 5,
    totalRound: 10,
    title: '바나나',
    remainingTime: 8
  },
  parameters: {
    docs: {
      description: {
        story: '남은 시간이 10초 이하일 때는 타이머가 깜빡이는 효과가 적용됩니다.'
      }
    }
  }
}`,...(c=(m=r.parameters)==null?void 0:m.docs)==null?void 0:c.source}}};const R=["Default","UrgentTimer"];export{t as Default,r as UrgentTimer,R as __namedExportsOrder,N as default};
