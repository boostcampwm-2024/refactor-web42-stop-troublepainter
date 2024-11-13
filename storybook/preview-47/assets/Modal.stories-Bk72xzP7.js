import{j as n}from"./jsx-runtime-CkxqCPlQ.js";import{r as h}from"./index-DJO9vBfz.js";import{c as u}from"./cn-jM7Hu9J5.js";const d=({className:e,handleKeyDown:o,closeModal:s,isModalOpened:t,title:r,children:i,...a})=>n.jsxs("div",{className:u("fixed left-0 top-0 flex h-full w-full items-center justify-center",t?"pointer-events-auto":"pointer-events-none"),onClick:s,onKeyDown:o,tabIndex:0,children:[n.jsx("div",{className:u("absolute left-0 top-0 h-full w-full bg-violet-950",t?"opacity-50":"opacity-0","transition-opacity duration-300 ease-in-out")}),n.jsxs("div",{className:u("relative m-3 h-auto w-full flex-col justify-center overflow-hidden rounded-xl border-2 border-violet-950 bg-violet-100 transition-opacity duration-300 ease-in-out",t?"opacity-100":"opacity-0",e),onClick:l=>l.stopPropagation(),onKeyDown:o,tabIndex:0,...a,children:[n.jsx("div",{className:"flex min-h-16 items-center justify-center border-b-2 border-violet-950 bg-violet-500 px-3 py-3",children:n.jsx("h2",{className:"translate-y-1 text-4xl text-stroke-md",children:r})}),n.jsx("div",{className:"p-5",children:i})]})]});d.displayName="Modal";d.__docgenInfo={description:"",methods:[],displayName:"Modal",props:{title:{required:!0,tsType:{name:"string"},description:""},closeModal:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},isModalOpened:{required:!0,tsType:{name:"boolean"},description:""},handleKeyDown:{required:!1,tsType:{name:"signature",type:"function",raw:"(e: KeyboardEvent<Element>) => void",signature:{arguments:[{type:{name:"KeyboardEvent",elements:[{name:"Element"}],raw:"KeyboardEvent<Element>"},name:"e"}],return:{name:"void"}}},description:""}},composes:["PropsWithChildren"]};function E(e,o,s){const t=e-o;return Math.ceil((s-t)/1e3)}function m(e,o){e&&(e.length>0?e(o):e())}function b({handleTick:e,handleComplete:o,delay:s}){const t=performance.now();let r;const i=a=>{const l=E(a,t,s);a-t>=s?(o&&m(o,l),e&&m(e,l)):(e&&m(e,l),r=requestAnimationFrame(i))};return r=requestAnimationFrame(i),()=>{cancelAnimationFrame(r)}}const j=e=>{const[o,s]=h.useState(!1),t=()=>{s(!1)};return{openModal:()=>{if(s(!0),e)return b({handleComplete:t,delay:e})},closeModal:t,handleKeyDown:a=>{a.key==="Escape"&&t()},isModalOpened:o}},O={title:"components/ui/Modal",component:d,argTypes:{title:{control:"text",description:"모달 제목",defaultValue:"예시 모달"},isModalOpened:{control:"boolean",description:"모달 열림/닫힘 상태"},closeModal:{description:"모달 닫는 함수",action:"closed"},handleKeyDown:{description:"키보드 이벤트 처리 함수",action:"closed"},children:{control:"text",description:"모달 내부 컨텐츠",defaultValue:"모달 내용입니다. 배경을 클릭하거나 focusing된 상태에서 ESC 키로 닫을 수 있습니다."}},parameters:{docs:{description:{component:"사용자에게 정보를 표시하거나 작업을 수행하기 위한 모달 컴포넌트입니다. <br/><br/> 모달 열기 버튼을 누르면 모달이 뜹니다."}}},tags:["autodocs"]},w=e=>{const{isModalOpened:o,openModal:s,closeModal:t,handleKeyDown:r}=j();return h.useEffect(()=>{e.isModalOpened&&!o?s():!e.isModalOpened&&o&&t()},[e.isModalOpened]),n.jsxs("div",{children:[n.jsx("button",{onClick:s,children:"모달 열기 버튼"}),n.jsx(d,{...e,isModalOpened:o,closeModal:t,handleKeyDown:r})]})},C=e=>{const{isModalOpened:o,openModal:s}=j(3e3);return n.jsxs("div",{children:[n.jsx("button",{onClick:s,children:"3초 후 자동으로 닫히는 모달 열기 버튼"}),n.jsx(d,{...e,isModalOpened:o,children:n.jsx("p",{children:"이 모달은 3초 후에 자동으로 닫힙니다."})})]})},c={parameters:{docs:{description:{story:"기본적인 모달 사용 예시입니다. 모달은 overlay를 클릭하거나, overlay나 모달이 focusing 됐을 때 ESC 키로 닫을 수 있습니다."}}},args:{title:"default Modal"},render:e=>n.jsx(w,{...e})},p={parameters:{docs:{description:{story:"3초 후 자동으로 닫히는 모달 예시입니다."}}},args:{title:"AutoClose Modal"},render:e=>n.jsx(C,{...e})};var f,x,y;c.parameters={...c.parameters,docs:{...(f=c.parameters)==null?void 0:f.docs,source:{originalSource:`{
  parameters: {
    docs: {
      description: {
        story: '기본적인 모달 사용 예시입니다. 모달은 overlay를 클릭하거나, overlay나 모달이 focusing 됐을 때 ESC 키로 닫을 수 있습니다.'
      }
    }
  },
  args: {
    title: 'default Modal'
  },
  render: args => <DefaultModalExample {...args} />
}`,...(y=(x=c.parameters)==null?void 0:x.docs)==null?void 0:y.source}}};var M,g,v;p.parameters={...p.parameters,docs:{...(M=p.parameters)==null?void 0:M.docs,source:{originalSource:`{
  parameters: {
    docs: {
      description: {
        story: '3초 후 자동으로 닫히는 모달 예시입니다.'
      }
    }
  },
  args: {
    title: 'AutoClose Modal'
  },
  render: args => <AutoCloseModalExample {...args} />
}`,...(v=(g=p.parameters)==null?void 0:g.docs)==null?void 0:v.source}}};const T=["Default","AutoClose"];export{p as AutoClose,c as Default,T as __namedExportsOrder,O as default};
