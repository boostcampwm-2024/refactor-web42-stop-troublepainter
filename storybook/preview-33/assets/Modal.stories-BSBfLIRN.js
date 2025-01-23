import{j as n}from"./jsx-runtime-CkxqCPlQ.js";import{r as p}from"./index-DJO9vBfz.js";import{F as C}from"./index-DJdX7xnk.js";import{c as f}from"./cn-BM_CldAA.js";const m=({className:e,handleKeyDown:o,closeModal:s,isModalOpened:t,title:r,children:l,...a})=>{const i=document.getElementById("modal-root"),c=p.useRef(null);return i?(p.useEffect(()=>{t&&c.current&&c.current.focus()},[t]),C.createPortal(n.jsxs("div",{ref:c,className:f("fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center",t?"pointer-events-auto":"pointer-events-none"),onClick:s,onKeyDown:o,tabIndex:0,children:[n.jsx("div",{className:f("absolute left-0 top-0 h-full w-full bg-violet-950",t?"opacity-50":"opacity-0","transition-opacity duration-300 ease-in-out")}),n.jsxs("div",{className:f("relative m-3 h-auto w-full flex-col justify-center overflow-hidden rounded-xl border-2 border-violet-950 bg-violet-100 transition-opacity duration-300 ease-in-out",t?"opacity-100":"opacity-0",e),onClick:b=>b.stopPropagation(),onKeyDown:o,tabIndex:0,...a,children:[r&&n.jsx("div",{className:"flex min-h-16 items-center justify-center border-b-2 border-violet-950 bg-violet-500 px-3 py-3 text-center",children:n.jsx("h2",{className:"translate-y-1 text-3xl text-stroke-md sm:text-4xl",children:r})}),n.jsx("div",{className:"p-5",children:l})]})]}),i)):null};m.displayName="Modal";function w(e,o,s){const t=e-o;return Math.ceil((s-t)/1e3)}function x(e,o){e&&(e.length>0?e(o):e())}function A({handleTick:e,handleComplete:o,delay:s}){const t=performance.now();let r;const l=a=>{const i=w(a,t,s);a-t>=s?(o&&x(o,i),e&&x(e,i)):(e&&x(e,i),r=requestAnimationFrame(l))};return r=requestAnimationFrame(l),()=>{cancelAnimationFrame(r)}}const E=e=>{const[o,s]=p.useState(!1),t=()=>{s(!1)};return{openModal:()=>{if(s(!0),e)return A({handleComplete:t,delay:e})},closeModal:t,handleKeyDown:a=>{a.key==="Escape"&&t()},isModalOpened:o}},R={title:"components/ui/Modal",component:m,argTypes:{title:{control:"text",description:"모달 제목",defaultValue:"예시 모달"},isModalOpened:{control:"boolean",description:"모달 열림/닫힘 상태"},closeModal:{description:"모달 닫는 함수",action:"closed"},handleKeyDown:{description:"키보드 이벤트 처리 함수",action:"closed"},children:{control:"text",description:"모달 내부 컨텐츠",defaultValue:"모달 내용입니다. 배경을 클릭하거나 focusing된 상태에서 ESC 키로 닫을 수 있습니다."},className:{control:"text",description:"추가 스타일링"}},parameters:{docs:{description:{component:"사용자에게 정보를 표시하거나 작업을 수행하기 위한 모달 컴포넌트입니다. <br/><br/> 모달 열기 버튼을 누르면 모달이 뜹니다."}}},tags:["autodocs"]},D=e=>{const{isModalOpened:o,openModal:s,closeModal:t,handleKeyDown:r}=E();return p.useEffect(()=>{e.isModalOpened&&!o?s():!e.isModalOpened&&o&&t()},[e.isModalOpened]),n.jsxs("div",{children:[n.jsx("button",{onClick:s,children:"모달 열기 버튼"}),n.jsx(m,{...e,isModalOpened:o,closeModal:t,handleKeyDown:r})]})},N=e=>{const{isModalOpened:o,openModal:s}=E(3e3);return n.jsxs("div",{children:[n.jsx("button",{onClick:s,children:"3초 후 자동으로 닫히는 모달 열기 버튼"}),n.jsx(m,{...e,isModalOpened:o,children:n.jsx("p",{children:"이 모달은 3초 후에 자동으로 닫힙니다."})})]})},d={parameters:{docs:{description:{story:"기본적인 모달 사용 예시입니다. 모달은 overlay를 클릭하거나, overlay나 모달이 focusing 됐을 때 ESC 키로 닫을 수 있습니다."}}},args:{title:"default Modal"},render:e=>n.jsx(D,{...e})},u={parameters:{docs:{description:{story:"3초 후 자동으로 닫히는 모달 예시입니다."}}},args:{title:"AutoClose Modal"},render:e=>n.jsx(N,{...e})};var y,M,g;d.parameters={...d.parameters,docs:{...(y=d.parameters)==null?void 0:y.docs,source:{originalSource:`{
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
}`,...(g=(M=d.parameters)==null?void 0:M.docs)==null?void 0:g.source}}};var j,v,h;u.parameters={...u.parameters,docs:{...(j=u.parameters)==null?void 0:j.docs,source:{originalSource:`{
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
}`,...(h=(v=u.parameters)==null?void 0:v.docs)==null?void 0:h.source}}};const I=["Default","AutoClose"];export{u as AutoClose,d as Default,I as __namedExportsOrder,R as default};
