import{j as f}from"./jsx-runtime-CkxqCPlQ.js";import{r as L}from"./index-DJO9vBfz.js";import{c as b}from"./index-Bb4qSo10.js";import{c as x}from"./cn-BM_CldAA.js";const h=""+new URL("main-logo-hNOP1ito.png",import.meta.url).href,v=""+new URL("side-logo-CJuBulte.png",import.meta.url).href,N=b("w-auto",{variants:{variant:{main:"h-40 sm:h-64",side:"h-20 xs:h-24"}},defaultVariants:{variant:"main"}}),o={main:{src:h,alt:"메인 로고",description:"우리 프로젝트를 대표하는 메인 로고 이미지입니다"},side:{src:v,alt:"보조 로고",description:"우리 프로젝트를 대표하는 보조 로고 이미지입니다"}},s=L.forwardRef(({className:l,variant:a="main",ariaLabel:d,...u},g)=>f.jsx("img",{src:o[a].src,alt:o[a].alt,"aria-label":d??o[a].description,className:x(N({variant:a,className:l})),ref:g,...u}));s.displayName="Logo";s.__docgenInfo={description:"",methods:[],displayName:"Logo",props:{ariaLabel:{required:!1,tsType:{name:"string"},description:"로고 이미지 설명을 위한 사용자 정의 aria-label"},variant:{defaultValue:{value:"'main'",computed:!1},required:!1}},composes:["Omit","VariantProps"]};const w={component:s,title:"components/game/Logo",argTypes:{variant:{control:"select",options:["main","side"],description:"로고 배치",table:{defaultValue:{summary:"main"}}},ariaLabel:{control:"text",description:"로고 이미지 설명"},className:{control:"text",description:"추가 스타일링"}},parameters:{docs:{description:{component:"프로젝트의 메인 로고와 보조 로고를 표시하는 컴포넌트입니다. 반응형 디자인을 지원하며 접근성을 고려한 설명을 포함합니다."}}},tags:["autodocs"]},e={args:{variant:"main",ariaLabel:"로고 설명"}},r={args:{variant:"side",ariaLabel:"로고 설명"}};var t,i,n;e.parameters={...e.parameters,docs:{...(t=e.parameters)==null?void 0:t.docs,source:{originalSource:`{
  args: {
    variant: 'main',
    ariaLabel: '로고 설명'
  }
}`,...(n=(i=e.parameters)==null?void 0:i.docs)==null?void 0:n.source}}};var c,m,p;r.parameters={...r.parameters,docs:{...(c=r.parameters)==null?void 0:c.docs,source:{originalSource:`{
  args: {
    variant: 'side',
    ariaLabel: '로고 설명'
  }
}`,...(p=(m=r.parameters)==null?void 0:m.docs)==null?void 0:p.source}}};const R=["Main","Side"];export{e as Main,r as Side,R as __namedExportsOrder,w as default};
