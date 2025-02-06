import{j as O}from"./jsx-runtime-CmIOflP4.js";import{r as b}from"./index-KqYmeiyw.js";import{c as _}from"./index-BV9HlZSv.js";import{a as x}from"./cn-Dj5kSLHa.js";const t="https://kr.object.ncloudstorage.com/troublepainter-assets",i={MAIN_LOGO:`${t}/logo/main-logo.png`,SIDE_LOGO:`${t}/logo/side-logo.png`},N=_("w-auto",{variants:{variant:{main:"h-40 sm:h-64",side:"h-20 xs:h-24"}},defaultVariants:{variant:"main"}}),r={main:{src:i.MAIN_LOGO,alt:"메인 로고",description:"우리 프로젝트를 대표하는 메인 로고 이미지입니다"},side:{src:i.SIDE_LOGO,alt:"보조 로고",description:"우리 프로젝트를 대표하는 보조 로고 이미지입니다"}},s=b.forwardRef(({className:g,variant:a="main",ariaLabel:u,...L},f)=>O.jsx("img",{src:r[a].src,alt:r[a].alt,"aria-label":u??r[a].description,className:x(N({variant:a,className:g})),ref:f,...L}));s.displayName="Logo";s.__docgenInfo={description:"",methods:[],displayName:"Logo",props:{ariaLabel:{required:!1,tsType:{name:"string"},description:"로고 이미지 설명을 위한 사용자 정의 aria-label"},variant:{defaultValue:{value:"'main'",computed:!1},required:!1}},composes:["Omit","VariantProps"]};const I={component:s,title:"components/game/Logo",argTypes:{variant:{control:"select",options:["main","side"],description:"로고 배치",table:{defaultValue:{summary:"main"}}},ariaLabel:{control:"text",description:"로고 이미지 설명"},className:{control:"text",description:"추가 스타일링"}},parameters:{docs:{description:{component:"프로젝트의 메인 로고와 보조 로고를 표시하는 컴포넌트입니다. 반응형 디자인을 지원하며 접근성을 고려한 설명을 포함합니다."}}},tags:["autodocs"]},e={args:{variant:"main",ariaLabel:"로고 설명"}},o={args:{variant:"side",ariaLabel:"로고 설명"}};var n,c,m;e.parameters={...e.parameters,docs:{...(n=e.parameters)==null?void 0:n.docs,source:{originalSource:`{
  args: {
    variant: 'main',
    ariaLabel: '로고 설명'
  }
}`,...(m=(c=e.parameters)==null?void 0:c.docs)==null?void 0:m.source}}};var l,p,d;o.parameters={...o.parameters,docs:{...(l=o.parameters)==null?void 0:l.docs,source:{originalSource:`{
  args: {
    variant: 'side',
    ariaLabel: '로고 설명'
  }
}`,...(d=(p=o.parameters)==null?void 0:p.docs)==null?void 0:d.source}}};const y=["Main","Side"];export{e as Main,o as Side,y as __namedExportsOrder,I as default};
