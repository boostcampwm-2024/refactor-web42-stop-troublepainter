import{j as e}from"./jsx-runtime-CkxqCPlQ.js";import{c as b}from"./cn-jM7Hu9J5.js";import"./index-DJO9vBfz.js";const f=""+new URL("small-timer-BCKdz2t1.gif",import.meta.url).href,y="data:image/png;base64,R0lGODdhZABkAJEAAAAAAHo4/////wAAACH5BAkOAAMALAAAAABkAGQAAAL/nI+py+0Po5y02ouz3rz7D4biSJbmiabqyrbuC8fyTNf2jef6zsfADwwKgb3O8CgscpBMgHIDDEinVCnxmYlWt1fsRbuldr2RY7g6JEPM52la7WC3A2+4YTjPi+tKvF5/5OX3NxdYBBbWhFT4w4PIpTiY2LjziBYpxOiEY3kk8AkaKgoq50ZJ0zk0uipaanU6kyrESivgSgf7IlvLyysLs9srPPqr+wMJMKxMeny5uRK8LM0MgKwSPS1djIKdrbx90u0tDG4CBjSebtuM+xzOjq7ufZ5bQp8sn33/Xu2cr8/OlDsQ4v71KvehoMFaCD3cW5hu34iHEOfBq+fwIr6K+NMkiqDIUZtGEiBDfhs5UaNJkf3akVS58mTLMQRhxiSH8qPNm75yhijJk5bHnzuDshpac+YPoz2VDkxYlGkrn0kFShVKFarTq0ezZtzKlZhXI1HDItVqNexUpy/BqqUmsC0yswFfPf06l2tDsi3TXt2L1i5dtimAGj0rV7DesTr7Kr4JmKjjdkEjV/XH03LjvBU1J96zEaLnlJPjda7rUoasIB0l2bWx2rTMINZqxF7KkrazHJZAY0IN2hFwgb8nB6803G5xTX0yEdIURJDz52cMPXFN3TdNMsWb2GnQncl3BuGRjF9Q3vr59ezbu38PP778+fTrtygAADs=",u=({className:s,currentRound:d,totalRound:p,remainingTime:n,title:x,...g})=>e.jsx(e.Fragment,{children:e.jsxs("div",{className:b("relative flex w-full items-center justify-center border-violet-950 bg-violet-500 p-1.5 text-stroke-sm sm:rounded-lg sm:border-2 sm:p-3.5",s),...g,children:[e.jsxs("p",{className:"absolute left-4 text-xs sm:left-3.5 sm:text-xl",children:[e.jsx("span",{children:d}),e.jsx("span",{children:" of "}),e.jsx("span",{children:p})]}),e.jsx("h2",{className:"text-2xl sm:text-4xl",children:x}),e.jsx("div",{className:"absolute -right-0 -top-4 w-[4.25rem] sm:-right-10 sm:-top-11 sm:w-[8.75rem]",children:e.jsxs("div",{className:"relative",children:[n>10?e.jsx("img",{src:y,alt:"타이머",className:"h-full w-full"}):e.jsx("img",{src:f,alt:"타이머",className:"h-full w-full"}),e.jsx("span",{className:"absolute inset-0 top-1/2 ml-[0.1rem] flex -translate-y-1/3 items-center justify-center text-base text-stroke-md sm:ml-1 sm:text-[2rem]",children:n})]})})]})});u.__docgenInfo={description:"",methods:[],displayName:"QuizTitle",props:{currentRound:{required:!0,tsType:{name:"number"},description:""},totalRound:{required:!0,tsType:{name:"number"},description:""},title:{required:!0,tsType:{name:"string"},description:""},remainingTime:{required:!0,tsType:{name:"number"},description:""}},composes:["HTMLAttributes"]};const h={component:u,title:"components/game/QuizTitle",argTypes:{currentRound:{control:"number",description:"현재 라운드",table:{type:{summary:"number"}}},totalRound:{control:"number",description:"전체 라운드",table:{type:{summary:"number"}}},title:{control:"text",description:"제시어",table:{type:{summary:"string"}}},remainingTime:{control:"number",description:"남은 시간 (초)",table:{type:{summary:"number"}}},className:{control:"text",description:"추가 스타일링"}},parameters:{docs:{description:{component:`
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
}`,...(o=(a=t.parameters)==null?void 0:a.docs)==null?void 0:o.source}}};var m,l,c;r.parameters={...r.parameters,docs:{...(m=r.parameters)==null?void 0:m.docs,source:{originalSource:`{
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
}`,...(c=(l=r.parameters)==null?void 0:l.docs)==null?void 0:c.source}}};const N=["Default","UrgentTimer"];export{t as Default,r as UrgentTimer,N as __namedExportsOrder,h as default};
