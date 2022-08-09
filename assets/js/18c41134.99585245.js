"use strict";(self.webpackChunk_inframe_docs=self.webpackChunk_inframe_docs||[]).push([[2859],{876:(e,t,n)=>{n.d(t,{Zo:()=>c,kt:()=>A});var r=n(2784);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function s(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var l=r.createContext({}),u=function(e){var t=r.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):s(s({},t),e)),n},c=function(e){var t=u(e.components);return r.createElement(l.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,l=e.parentName,c=i(e,["components","mdxType","originalType","parentName"]),d=u(n),A=a,g=d["".concat(l,".").concat(A)]||d[A]||p[A]||o;return n?r.createElement(g,s(s({ref:t},c),{},{components:n})):r.createElement(g,s({ref:t},c))}));function A(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,s=new Array(o);s[0]=d;var i={};for(var l in t)hasOwnProperty.call(t,l)&&(i[l]=t[l]);i.originalType=e,i.mdxType="string"==typeof e?e:a,s[1]=i;for(var u=2;u<o;u++)s[u]=n[u];return r.createElement.apply(null,s)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},8494:(e,t,n)=>{n.r(t),n.d(t,{Highlight:()=>c,assets:()=>l,contentTitle:()=>s,default:()=>d,frontMatter:()=>o,metadata:()=>i,toc:()=>u});var r=n(7896),a=(n(2784),n(876));const o={sidebar_position:4},s="Markdown Features",i={unversionedId:"tutorial-basics/markdown-features",id:"tutorial-basics/markdown-features",title:"Markdown Features",description:"Docusaurus supports Markdown and a few additional features.",source:"@site/docs/tutorial-basics/markdown-features.mdx",sourceDirName:"tutorial-basics",slug:"/tutorial-basics/markdown-features",permalink:"/docs/tutorial-basics/markdown-features",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/tutorial-basics/markdown-features.mdx",tags:[],version:"current",sidebarPosition:4,frontMatter:{sidebar_position:4},sidebar:"tutorialSidebar",previous:{title:"Create a Blog Post",permalink:"/docs/tutorial-basics/create-a-blog-post"},next:{title:"Deploy your site",permalink:"/docs/tutorial-basics/deploy-your-site"}},l={},u=[{value:"Front Matter",id:"front-matter",level:2},{value:"Links",id:"links",level:2},{value:"Images",id:"images",level:2},{value:"Code Blocks",id:"code-blocks",level:2},{value:"Admonitions",id:"admonitions",level:2},{value:"MDX and React Components",id:"mdx-and-react-components",level:2}],c=e=>{let{children:t,color:n}=e;return(0,a.kt)("span",{style:{backgroundColor:n,borderRadius:"20px",color:"#fff",padding:"10px",cursor:"pointer"},onClick:()=>{alert("You clicked the color "+n+" with label "+t)}},t)},p={toc:u,Highlight:c};function d(e){let{components:t,...o}=e;return(0,a.kt)("wrapper",(0,r.Z)({},p,o,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"markdown-features"},"Markdown Features"),(0,a.kt)("p",null,"Docusaurus supports ",(0,a.kt)("strong",{parentName:"p"},(0,a.kt)("a",{parentName:"strong",href:"https://daringfireball.net/projects/markdown/syntax"},"Markdown"))," and a few ",(0,a.kt)("strong",{parentName:"p"},"additional features"),"."),(0,a.kt)("h2",{id:"front-matter"},"Front Matter"),(0,a.kt)("p",null,"Markdown documents have metadata at the top called ",(0,a.kt)("a",{parentName:"p",href:"https://jekyllrb.com/docs/front-matter/"},"Front Matter"),":"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-text",metastring:'title="my-doc.md"',title:'"my-doc.md"'},"// highlight-start\n---\nid: my-doc-id\ntitle: My document title\ndescription: My document description\nslug: /my-custom-url\n---\n// highlight-end\n\n## Markdown heading\n\nMarkdown text with [links](./hello.md)\n")),(0,a.kt)("h2",{id:"links"},"Links"),(0,a.kt)("p",null,"Regular Markdown links are supported, using url paths or relative file paths."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-md"},"Let's see how to [Create a page](/create-a-page).\n")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-md"},"Let's see how to [Create a page](./create-a-page.md).\n")),(0,a.kt)("p",null,(0,a.kt)("strong",{parentName:"p"},"Result:")," Let's see how to ",(0,a.kt)("a",{parentName:"p",href:"/docs/tutorial-basics/create-a-page"},"Create a page"),"."),(0,a.kt)("h2",{id:"images"},"Images"),(0,a.kt)("p",null,"Regular Markdown images are supported."),(0,a.kt)("p",null,"You can use absolute paths to reference images in the static directory (",(0,a.kt)("inlineCode",{parentName:"p"},"static/img/inframe.png"),"):"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-md"},"![Docusaurus logo](/img/inframe.png)\n")),(0,a.kt)("p",null,(0,a.kt)("img",{alt:"Docusaurus logo",src:n(384).Z,width:"200",height:"200"})),(0,a.kt)("p",null,"You can reference images relative to the current file as well, as shown in ",(0,a.kt)("a",{parentName:"p",href:"/docs/tutorial-extras/manage-docs-versions"},"the extra guides"),"."),(0,a.kt)("h2",{id:"code-blocks"},"Code Blocks"),(0,a.kt)("p",null,"Markdown code blocks are supported with Syntax highlighting."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},'```jsx title="src/components/HelloDocusaurus.js"\nfunction HelloDocusaurus() {\n    return (\n        <h1>Hello, Docusaurus!</h1>\n    )\n}\n```\n')),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-jsx",metastring:'title="src/components/HelloDocusaurus.js"',title:'"src/components/HelloDocusaurus.js"'},"function HelloDocusaurus() {\n  return <h1>Hello, Docusaurus!</h1>;\n}\n")),(0,a.kt)("h2",{id:"admonitions"},"Admonitions"),(0,a.kt)("p",null,"Docusaurus has a special syntax to create admonitions and callouts:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},":::tip My tip\n\nUse this awesome feature option\n\n:::\n\n:::danger Take care\n\nThis action is dangerous\n\n:::\n")),(0,a.kt)("admonition",{title:"My tip",type:"tip"},(0,a.kt)("p",{parentName:"admonition"},"Use this awesome feature option")),(0,a.kt)("admonition",{title:"Take care",type:"danger"},(0,a.kt)("p",{parentName:"admonition"},"This action is dangerous")),(0,a.kt)("h2",{id:"mdx-and-react-components"},"MDX and React Components"),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"https://mdxjs.com/"},"MDX")," can make your documentation more ",(0,a.kt)("strong",{parentName:"p"},"interactive")," and allows using any ",(0,a.kt)("strong",{parentName:"p"},"React components inside Markdown"),":"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-jsx"},"export const Highlight = ({children, color}) => (\n  <span\n    style={{\n      backgroundColor: color,\n      borderRadius: '20px',\n      color: '#fff',\n      padding: '10px',\n      cursor: 'pointer',\n    }}\n    onClick={() => {\n      alert(`You clicked the color ${color} with label ${children}`)\n    }}>\n    {children}\n  </span>\n);\n\nThis is <Highlight color=\"#25c2a0\">Docusaurus green</Highlight> !\n\nThis is <Highlight color=\"#1877F2\">Facebook blue</Highlight> !\n")),(0,a.kt)("p",null,"This is ",(0,a.kt)(c,{color:"#25c2a0",mdxType:"Highlight"},"Docusaurus green")," !"),(0,a.kt)("p",null,"This is ",(0,a.kt)(c,{color:"#1877F2",mdxType:"Highlight"},"Facebook blue")," !"))}d.isMDXComponent=!0},384:(e,t,n)=>{n.d(t,{Z:()=>r});const r="data:image/png;base64,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"}}]);