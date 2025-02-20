import{j as e}from"./jsx-runtime-CmIOflP4.js";import{r as M}from"./index-KqYmeiyw.js";import{c as k}from"./index-BV9HlZSv.js";import{a as i}from"./cn-Dj5kSLHa.js";const B=k("select-text break-all px-2.5 inline-flex max-w-[85%] items-center justify-center rounded-lg border-2 border-violet-950 text-violet-950 text-base min-h-8 lg:text-lg 2xl:py-0.5 2xl:text-xl",{variants:{variant:{default:"bg-halfbaked-200",secondary:"bg-chartreuseyellow-200"}},defaultVariants:{variant:"default"}}),f=M.memo(({className:r,variant:h,content:n,nickname:o,...v})=>{const c=!!o,j=c?`${o}님의 메시지: ${n}`:`내 메시지: ${n}`;return e.jsxs("div",{"aria-label":j,tabIndex:0,className:i("flex",c?"flex-col items-start gap-0.5":"justify-end"),children:[c&&e.jsx("span",{className:"text-sm text-stroke-sm lg:text-base 2xl:text-lg","aria-hidden":"true",children:o}),e.jsx("p",{className:i(B({variant:h,className:r})),...v,children:n})]})});f.__docgenInfo={description:"",methods:[],displayName:"ChatBubble",props:{content:{required:!0,tsType:{name:"string"},description:""},nickname:{required:!1,tsType:{name:"string"},description:""}},composes:["HTMLAttributes","VariantProps"]};const O={component:f,title:"components/chat/ChatBubbleUI",argTypes:{content:{control:"text",description:"채팅 메시지 내용",table:{type:{summary:"string"}}},nickname:{control:"text",description:"사용자 닉네임 (있으면 다른 사용자의 메시지)",table:{type:{summary:"string"}}},variant:{control:"select",options:["default","secondary"],description:"채팅 버블 스타일"},className:{control:"text",description:"추가 스타일링"}},parameters:{docs:{description:{component:`
채팅 메시지를 표시하는 버블 컴포넌트입니다.

### 특징
- 내 메시지와 다른 사용자의 메시지를 구분하여 표시
- 다른 사용자의 메시지일 경우 닉네임 표시
- 두 가지 스타일 variant 지원 (default: 하늘색, secondary: 노란색)
`}}},decorators:[r=>e.jsx("div",{className:"min-h-[200px] w-full bg-eastbay-950 p-4",children:e.jsx(r,{})})],tags:["autodocs"]},t={args:{content:"안녕하세요!",variant:"secondary"},parameters:{docs:{description:{story:"내가 보낸 메시지입니다. 오른쪽 정렬되며 닉네임이 표시되지 않습니다."}}}},s={args:{content:"반갑습니다!",nickname:"사용자1",variant:"default"},parameters:{docs:{description:{story:"다른 사용자가 보낸 메시지입니다. 왼쪽 정렬되며 닉네임이 표시됩니다."}}}},a={args:{content:"이것은 매우 긴 메시지입니다. 채팅 버블이 어떻게 긴 텍스트를 처리하는지 보여주기 위한 예시입니다. 최대 너비는 85%로 제한됩니다.",nickname:"사용자2",variant:"default"},parameters:{docs:{description:{story:"긴 메시지가 주어졌을 때의 레이아웃을 보여줍니다."}}}};var d,l,p;t.parameters={...t.parameters,docs:{...(d=t.parameters)==null?void 0:d.docs,source:{originalSource:`{
  args: {
    content: '안녕하세요!',
    variant: 'secondary'
  },
  parameters: {
    docs: {
      description: {
        story: '내가 보낸 메시지입니다. 오른쪽 정렬되며 닉네임이 표시되지 않습니다.'
      }
    }
  }
}`,...(p=(l=t.parameters)==null?void 0:l.docs)==null?void 0:p.source}}};var m,u,g;s.parameters={...s.parameters,docs:{...(m=s.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    content: '반갑습니다!',
    nickname: '사용자1',
    variant: 'default'
  },
  parameters: {
    docs: {
      description: {
        story: '다른 사용자가 보낸 메시지입니다. 왼쪽 정렬되며 닉네임이 표시됩니다.'
      }
    }
  }
}`,...(g=(u=s.parameters)==null?void 0:u.docs)==null?void 0:g.source}}};var x,y,b;a.parameters={...a.parameters,docs:{...(x=a.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    content: '이것은 매우 긴 메시지입니다. 채팅 버블이 어떻게 긴 텍스트를 처리하는지 보여주기 위한 예시입니다. 최대 너비는 85%로 제한됩니다.',
    nickname: '사용자2',
    variant: 'default'
  },
  parameters: {
    docs: {
      description: {
        story: '긴 메시지가 주어졌을 때의 레이아웃을 보여줍니다.'
      }
    }
  }
}`,...(b=(y=a.parameters)==null?void 0:y.docs)==null?void 0:b.source}}};const T=["MyMessage","OtherUserMessage","LongMessage"];export{a as LongMessage,t as MyMessage,s as OtherUserMessage,T as __namedExportsOrder,O as default};
