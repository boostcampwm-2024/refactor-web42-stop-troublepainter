import{j as O}from"./jsx-runtime-CkxqCPlQ.js";import{r as b}from"./index-DJO9vBfz.js";import{c as _}from"./index-Bb4qSo10.js";import{c as N}from"./cn-BM_CldAA.js";const r="https://kr.object.ncloudstorage.com/troublepainter-assets",i={BACKGROUND_MUSIC:`${r}/sounds/background-music.mp3`,MAIN_LOGO:`${r}/logo/main-logo.png`,SIDE_LOGO:`${r}/logo/side-logo.png`},x=_("w-auto",{variants:{variant:{main:"h-40 sm:h-64",side:"h-20 xs:h-24"}},defaultVariants:{variant:"main"}}),e={main:{src:i.MAIN_LOGO,alt:"메인 로고",description:"우리 프로젝트를 대표하는 메인 로고 이미지입니다"},side:{src:i.SIDE_LOGO,alt:"보조 로고",description:"우리 프로젝트를 대표하는 보조 로고 이미지입니다"}},t=b.forwardRef(({className:g,variant:a="main",ariaLabel:u,...L},f)=>O.jsx("img",{src:e[a].src,alt:e[a].alt,"aria-label":u??e[a].description,className:N(x({variant:a,className:g})),ref:f,...L}));t.displayName="Logo";t.__docgenInfo={description:"",methods:[],displayName:"Logo",props:{ariaLabel:{required:!1,tsType:{name:"string"},description:"로고 이미지 설명을 위한 사용자 정의 aria-label"},variant:{defaultValue:{value:"'main'",computed:!1},required:!1}},composes:["Omit","VariantProps"]};const E={component:t,title:"components/game/Logo",argTypes:{variant:{control:"select",options:["main","side"],description:"로고 배치",table:{defaultValue:{summary:"main"}}},ariaLabel:{control:"text",description:"로고 이미지 설명"},className:{control:"text",description:"추가 스타일링"}},parameters:{docs:{description:{component:"프로젝트의 메인 로고와 보조 로고를 표시하는 컴포넌트입니다. 반응형 디자인을 지원하며 접근성을 고려한 설명을 포함합니다."}}},tags:["autodocs"]},s={args:{variant:"main",ariaLabel:"로고 설명"}},o={args:{variant:"side",ariaLabel:"로고 설명"}};var n,c,m;s.parameters={...s.parameters,docs:{...(n=s.parameters)==null?void 0:n.docs,source:{originalSource:`{
  args: {
    variant: 'main',
    ariaLabel: '로고 설명'
  }
}`,...(m=(c=s.parameters)==null?void 0:c.docs)==null?void 0:m.source}}};var p,l,d;o.parameters={...o.parameters,docs:{...(p=o.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    variant: 'side',
    ariaLabel: '로고 설명'
  }
}`,...(d=(l=o.parameters)==null?void 0:l.docs)==null?void 0:d.source}}};const G=["Main","Side"];export{s as Main,o as Side,G as __namedExportsOrder,E as default};
