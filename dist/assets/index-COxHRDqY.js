import{c as be,r as N,f as _,a as D,j as e,i as fe,d as me,X as Z,L as $,B as ge,h as ye,u as je}from"./index-xAK6oyoq.js";import{S as ve}from"./school-BhWoNwDq.js";import{G as Ne}from"./graduation-cap-rU-pE4v8.js";import{S as we}from"./share-2-DqK3gCUf.js";import{B as he}from"./bell-WwKS3q5f.js";import{S as ke}from"./shield-DVKY4D0S.js";import{n as y,F as Ce}from"./index-BxvvSo01.js";import{S as Q}from"./save-D8kLaK_r.js";import{T as J}from"./trash-2-yDzoJ5kH.js";import{A as Se}from"./award-D4Rq7wpE.js";import{B as U}from"./button-DWL3IelD.js";import{I as Y}from"./input-B24uO6cX.js";import{L as T}from"./label-BXpbBJVn.js";import{P as ae}from"./plus-Cx6_I0T1.js";import{G as Pe,L as ze}from"./linkedin-ihDj0YfU.js";import{G as Ee}from"./globe-CAiEwqs3.js";import{L as Le}from"./link-2-CnwZjown.js";import{M as pe}from"./mail-Cidlf7-F.js";import{K as Ae}from"./key-CGnRCnwe.js";import{T as Ie}from"./triangle-alert-DK1gnvYU.js";import"./index-BIOHHynE.js";import"./clsx-B-dksMZM.js";import"./index-DvHpnUpo.js";/**
 * @license lucide-react v0.437.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Be=be("Camera",[["path",{d:"M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z",key:"1tc9qg"}],["circle",{cx:"12",cy:"13",r:"3",key:"1vg3eu"}]]),Ue=()=>{const[a,n]=N.useState(null),[x,g]=N.useState(null),[u,h]=N.useState(!0),[d,j]=N.useState(null),[o,i]=N.useState(!1),w=N.useCallback(async()=>{var l,r;try{h(!0),j(null);const s=await _.get(`${D.API_BASE_URL}/profile/me`,{headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}});s.data.success&&(n(s.data.profile),g(s.data.profile.user))}catch(s){console.error("Error fetching profile:",s),j(((r=(l=s.response)==null?void 0:l.data)==null?void 0:r.message)||"Failed to load profile")}finally{h(!1)}},[]);return N.useEffect(()=>{w()},[w]),{profile:a,user:x,loading:u,error:d,saving:o,refetch:w,updatePersonalInfo:async l=>{var r,s;i(!0);try{if((await _.put(`${D.API_BASE_URL}/profile/personal`,l,{headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}})).data.success)return await w(),{success:!0,message:"Personal information updated"}}catch(t){return{success:!1,message:((s=(r=t.response)==null?void 0:r.data)==null?void 0:s.message)||"Failed to update"}}finally{i(!1)}},updateTenthGrade:async l=>{var r,s;i(!0);try{if((await _.put(`${D.API_BASE_URL}/profile/education/tenth`,l,{headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}})).data.success)return await w(),{success:!0,message:"10th grade details updated"}}catch(t){return{success:!1,message:((s=(r=t.response)==null?void 0:r.data)==null?void 0:s.message)||"Failed to update"}}finally{i(!1)}},updateTwelfthGrade:async l=>{var r,s;i(!0);try{if((await _.put(`${D.API_BASE_URL}/profile/education/twelfth`,l,{headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}})).data.success)return await w(),{success:!0,message:"12th grade details updated"}}catch(t){return{success:!1,message:((s=(r=t.response)==null?void 0:r.data)==null?void 0:s.message)||"Failed to update"}}finally{i(!1)}},updateUndergraduate:async l=>{var r,s;i(!0);try{if((await _.put(`${D.API_BASE_URL}/profile/education/undergraduate`,l,{headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}})).data.success)return await w(),{success:!0,message:"Undergraduate details updated"}}catch(t){return{success:!1,message:((s=(r=t.response)==null?void 0:r.data)==null?void 0:s.message)||"Failed to update"}}finally{i(!1)}},updateGraduation:async l=>{var r,s;i(!0);try{if((await _.put(`${D.API_BASE_URL}/profile/education/graduation`,l,{headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}})).data.success)return await w(),{success:!0,message:"Graduation details updated"}}catch(t){return{success:!1,message:((s=(r=t.response)==null?void 0:r.data)==null?void 0:s.message)||"Failed to update"}}finally{i(!1)}},updateExperience:async l=>{var r,s;i(!0);try{if((await _.put(`${D.API_BASE_URL}/profile/experience`,{experience:l},{headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}})).data.success)return await w(),{success:!0,message:"Experience updated"}}catch(t){return{success:!1,message:((s=(r=t.response)==null?void 0:r.data)==null?void 0:s.message)||"Failed to update"}}finally{i(!1)}},updateSocialLinks:async l=>{var r,s;i(!0);try{if((await _.put(`${D.API_BASE_URL}/profile/social-links`,l,{headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}})).data.success)return await w(),{success:!0,message:"Social links updated"}}catch(t){return{success:!1,message:((s=(r=t.response)==null?void 0:r.data)==null?void 0:s.message)||"Failed to update"}}finally{i(!1)}},uploadPhoto:async l=>{var r,s;i(!0);try{const t=new FormData;t.append("photo",l);const F=await _.post(`${D.API_BASE_URL}/profile/photo`,t,{headers:{Authorization:`Bearer ${localStorage.getItem("token")}`,"Content-Type":"multipart/form-data"}});if(F.data.success)return await w(),{success:!0,message:"Photo uploaded",imageUrl:F.data.imageUrl}}catch(t){return{success:!1,message:((s=(r=t.response)==null?void 0:r.data)==null?void 0:s.message)||"Failed to upload photo"}}finally{i(!1)}},removePhoto:async()=>{var l,r;i(!0);try{if((await _.delete(`${D.API_BASE_URL}/profile/photo`,{headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}})).data.success)return await w(),{success:!0,message:"Photo removed"}}catch(s){return{success:!1,message:((r=(l=s.response)==null?void 0:l.data)==null?void 0:r.message)||"Failed to remove photo"}}finally{i(!1)}},toggleNewsletter:async l=>{var r,s;i(!0);try{const t=await _.put(`${D.API_BASE_URL}/auth/newsletter`,{newsletter:l},{headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}});if(t.data.success)return await w(),{success:!0,message:t.data.message}}catch(t){return{success:!1,message:((s=(r=t.response)==null?void 0:r.data)==null?void 0:s.message)||"Failed to update"}}finally{i(!1)}}}},Ge=[{id:"personal",label:"Personal Information",icon:fe},{id:"education",label:"Education",icon:ve},{id:"higher-education",label:"Higher Education",icon:Ne},{id:"experience",label:"Experience",icon:me},{id:"social-links",label:"Social Links",icon:we},{id:"notifications",label:"Notifications",icon:he},{id:"security",label:"Security & Privacy",icon:ke}];function _e({activeSection:a,onSectionChange:n,user:x}){return e.jsxs("aside",{className:"hidden lg:flex flex-col w-72 border-r bg-slate-50 dark:bg-slate-950 p-6 h-[calc(100vh-64px)] overflow-y-auto sticky top-16",children:[e.jsxs("div",{className:"mb-10",children:[e.jsx("h1",{className:"text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight",children:"Career Navigator"}),e.jsx("p",{className:"font-manrope text-sm font-medium tracking-wide text-teal-700 dark:text-teal-400 mt-1",children:"Professional Profile"})]}),e.jsx("nav",{className:"flex-1 space-y-1",children:Ge.map(g=>{const u=a===g.id,h=g.icon;return e.jsxs("button",{onClick:()=>n(g.id),className:`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-200 text-left ${u?"text-teal-700 dark:text-teal-400 font-semibold border-r-4 border-teal-600 dark:border-teal-400 bg-slate-100 dark:bg-slate-900":"text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"}`,children:[e.jsx(h,{size:20,className:u?"text-teal-600":"text-slate-400"}),e.jsx("span",{className:"font-manrope text-sm tracking-wide",children:g.label})]},g.id)})}),e.jsxs("div",{className:"mt-8 pt-6 border-t border-slate-200 dark:border-slate-800",children:[e.jsxs("div",{className:"flex items-center gap-3 mb-4",children:[e.jsx("div",{className:"w-10 h-10 rounded-full bg-surface-container-highest overflow-hidden",children:e.jsx("img",{src:(x==null?void 0:x.imageUrl)||(x==null?void 0:x.avatarUrl)||"https://lh3.googleusercontent.com/aida-public/AB6AXuAlALyjCco-lGT6YyVmprGJDquxq3bPTSyRfFe17NjIrUldxc0OPqwB5Bp8HfjVJcYaGeJEHDUM71Z1ELhVm82cYDMRRe_LL9gGsORjIjNC8BgWzWT6rUfuHIpIXamMcU0rtbVZMUWITrqmLGqvXDAHzxt0e9Cz9yNCNfHZ_D7v-GQyurOU7e2fqftujHp7r72z2HNZXwdPoOsxQ9mgG7GlVt3C1evrx7CvnFCDAEOfZ2nVuLiDom7QE9tiy6xJshmqvcm710C0nBg",alt:"User",className:"w-full h-full object-cover"})}),e.jsxs("div",{className:"overflow-hidden",children:[e.jsx("p",{className:"text-sm font-bold text-slate-900 dark:text-slate-100 truncate",children:(x==null?void 0:x.name)||(x==null?void 0:x.firstName)||"Professional"}),e.jsx("p",{className:"text-xs text-slate-500 truncate",children:(x==null?void 0:x.headline)||"Navigator User"})]})]}),e.jsx("button",{className:"w-full py-2.5 px-4 bg-primary text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity",children:"View Public Profile"})]})]})}const De=({profile:a,user:n,saving:x,onUpdate:g,onUploadPhoto:u,onRemovePhoto:h})=>{var b,E,m;const[d,j]=N.useState(!1),[o,i]=N.useState({firstName:(a==null?void 0:a.firstName)||((b=n==null?void 0:n.name)==null?void 0:b.split(" ")[0])||"",lastName:(a==null?void 0:a.lastName)||((E=n==null?void 0:n.name)==null?void 0:E.split(" ").slice(1).join(" "))||"",dateOfBirth:a!=null&&a.dateOfBirth?new Date(a.dateOfBirth).toISOString().split("T")[0]:"",country:(a==null?void 0:a.country)||"",phoneNumber:(a==null?void 0:a.phoneNumber)||"",address:(a==null?void 0:a.address)||"",bio:(a==null?void 0:a.bio)||""}),w=N.useRef(null),k=c=>{i(f=>({...f,[c.target.name]:c.target.value}))},L=async c=>{c.preventDefault();const f=await g(o);f.success?(y.success(f.message),j(!1)):y.error(f.message)},A=()=>{var c,f;i({firstName:(a==null?void 0:a.firstName)||((c=n==null?void 0:n.name)==null?void 0:c.split(" ")[0])||"",lastName:(a==null?void 0:a.lastName)||((f=n==null?void 0:n.name)==null?void 0:f.split(" ").slice(1).join(" "))||"",dateOfBirth:a!=null&&a.dateOfBirth?new Date(a.dateOfBirth).toISOString().split("T")[0]:"",country:(a==null?void 0:a.country)||"",phoneNumber:(a==null?void 0:a.phoneNumber)||"",address:(a==null?void 0:a.address)||"",bio:(a==null?void 0:a.bio)||""}),j(!1)},v=async c=>{var r;const f=(r=c.target.files)==null?void 0:r[0];if(!f)return;if(f.size>5*1024*1024){y.error("File size must be less than 5MB");return}const l=await u(f);l.success?y.success(l.message):y.error(l.message)},p=async()=>{const c=await h();c.success?y.success(c.message):y.error(c.message)};return e.jsxs("div",{className:"max-w-4xl mx-auto px-4 sm:px-8 lg:px-12 py-8 lg:py-16",children:[e.jsxs("header",{className:"mb-12 lg:mb-16 flex flex-col md:flex-row justify-between items-start md:items-center gap-6",children:[e.jsxs("div",{children:[e.jsx("h2",{className:"text-3xl lg:text-4xl font-extrabold font-headline text-slate-900 mb-2 tracking-tight",children:"Personal Information"}),e.jsx("p",{className:"text-base lg:text-lg text-slate-600 leading-relaxed max-w-2xl",children:"Manage your personal details and how you appear to mentors and recruiters within the Navigator ecosystem."})]}),d?e.jsxs("div",{className:"flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto",children:[e.jsxs("button",{type:"button",onClick:A,disabled:x,className:"px-4 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-2",children:[e.jsx(Z,{size:16})," Cancel"]}),e.jsxs("button",{type:"button",onClick:L,disabled:x,className:"px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2",children:[x?e.jsx($,{size:16,className:"animate-spin"}):e.jsx(Q,{size:16}),"Save"]})]}):e.jsx("button",{onClick:()=>j(!0),className:"px-6 py-2.5 bg-white border border-slate-200 text-slate-800 rounded-xl font-bold text-sm shadow-sm hover:bg-slate-50 transition-colors w-full md:w-auto",children:"Edit Profile"})]}),e.jsxs("section",{className:"grid grid-cols-12 gap-8 mb-12",children:[e.jsxs("div",{className:"col-span-12 md:col-span-4 bg-surface-container-low p-8 rounded-xl flex flex-col items-center justify-center text-center relative group",children:[e.jsxs("div",{className:"relative cursor-pointer mb-4",onClick:()=>{var c;return(c=w.current)==null?void 0:c.click()},children:[e.jsx("div",{className:"w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-sm transition-transform group-hover:scale-105 duration-300 bg-gradient-to-br from-primary to-teal-600 flex items-center justify-center",children:n!=null&&n.imageUrl?e.jsx("img",{className:"w-full h-full object-cover",src:n.imageUrl,alt:"User Profile"}):e.jsx("span",{className:"text-4xl font-bold text-white uppercase",children:((m=n==null?void 0:n.name)==null?void 0:m.charAt(0))||"U"})}),e.jsx("div",{className:"absolute inset-0 bg-primary/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity",children:e.jsx(Be,{className:"text-white w-8 h-8"})})]}),e.jsx("input",{ref:w,type:"file",accept:"image/jpeg,image/png,image/webp",onChange:v,className:"hidden"}),(n==null?void 0:n.imageUrl)&&e.jsx("button",{onClick:p,disabled:x,className:"absolute top-4 right-4 p-2 text-slate-400 hover:text-error hover:bg-error/10 rounded-full transition-colors opacity-0 group-hover:opacity-100",title:"Remove Photo",children:e.jsx(J,{size:18})}),e.jsx("h3",{className:"font-headline font-bold text-primary",children:(n==null?void 0:n.name)||"User Name"}),e.jsx("p",{className:"text-xs font-label uppercase tracking-widest text-secondary mt-1",children:(n==null?void 0:n.headline)||o.country||"Navigator User"})]}),e.jsxs("div",{className:"col-span-12 md:col-span-8 bg-surface-container-lowest p-8 rounded-xl shadow-[0px_20px_40px_rgba(31,27,24,0.06)] border border-outline-variant/10 flex flex-col justify-center",children:[e.jsx("h4",{className:"text-sm font-label uppercase tracking-widest text-on-tertiary-container font-bold mb-4",children:"Quick Bio"}),e.jsxs("p",{className:"text-on-surface leading-relaxed italic text-sm md:text-base",children:['"',o.bio||(a==null?void 0:a.bio)||"You haven't added a bio yet. Click edit to share your professional journey.",'"']}),e.jsxs("div",{className:"mt-6 flex flex-wrap gap-3",children:[e.jsx("span",{className:"px-3 py-1 bg-tertiary-fixed text-on-tertiary-fixed-variant text-xs font-bold rounded-full",children:"Member"}),o.country&&e.jsx("span",{className:"px-3 py-1 bg-secondary-fixed text-on-secondary-fixed-variant text-xs font-bold rounded-full",children:o.country})]})]})]}),e.jsx("section",{className:"bg-surface-container-low rounded-xl p-6 lg:p-10 border border-outline-variant/10 shadow-sm",children:e.jsxs("form",{className:"space-y-10",onSubmit:L,children:[e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{className:"block text-xs font-label font-bold uppercase tracking-wider text-secondary px-1",children:"First Name"}),e.jsx("input",{name:"firstName",value:o.firstName,onChange:k,disabled:!d,className:"w-full bg-surface-container-highest border-none rounded-xl px-4 py-3.5 focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary/20 transition-all text-on-surface font-medium disabled:opacity-60 disabled:cursor-not-allowed",type:"text",placeholder:"John"})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{className:"block text-xs font-label font-bold uppercase tracking-wider text-secondary px-1",children:"Last Name"}),e.jsx("input",{name:"lastName",value:o.lastName,onChange:k,disabled:!d,className:"w-full bg-surface-container-highest border-none rounded-xl px-4 py-3.5 focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary/20 transition-all text-on-surface font-medium disabled:opacity-60 disabled:cursor-not-allowed",type:"text",placeholder:"Doe"})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{className:"block text-xs font-label font-bold uppercase tracking-wider text-secondary px-1",children:"Email Address"}),e.jsx("div",{className:"relative",children:e.jsx("input",{className:"w-full bg-surface-container-highest border-none rounded-xl px-4 py-3.5 focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary/20 transition-all text-on-surface font-medium opacity-60 cursor-not-allowed",type:"email",value:(n==null?void 0:n.email)||"",disabled:!0})}),e.jsx("span",{className:"text-xs text-slate-500 px-1 inline-block mt-1",children:"Email can be changed in Security settings"})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{className:"block text-xs font-label font-bold uppercase tracking-wider text-secondary px-1",children:"Phone Number"}),e.jsx("div",{className:"relative",children:e.jsx("input",{name:"phoneNumber",value:o.phoneNumber,onChange:k,disabled:!d,className:"w-full bg-surface-container-highest border-none rounded-xl px-4 py-3.5 focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary/20 transition-all text-on-surface font-medium disabled:opacity-60 disabled:cursor-not-allowed",type:"tel",placeholder:"+1 (555) 000-0000"})})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{className:"block text-xs font-label font-bold uppercase tracking-wider text-secondary px-1",children:"Date of Birth"}),e.jsx("input",{name:"dateOfBirth",value:o.dateOfBirth,onChange:k,disabled:!d,className:"w-full bg-surface-container-highest border-none rounded-xl px-4 py-3.5 focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary/20 transition-all text-on-surface font-medium disabled:opacity-60 disabled:cursor-not-allowed",type:"date"})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{className:"block text-xs font-label font-bold uppercase tracking-wider text-secondary px-1",children:"Country"}),e.jsx("input",{name:"country",value:o.country,onChange:k,disabled:!d,className:"w-full bg-surface-container-highest border-none rounded-xl px-4 py-3.5 focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary/20 transition-all text-on-surface font-medium disabled:opacity-60 disabled:cursor-not-allowed",type:"text",placeholder:"Your Country"})]}),e.jsxs("div",{className:"space-y-2 md:col-span-2",children:[e.jsx("label",{className:"block text-xs font-label font-bold uppercase tracking-wider text-secondary px-1",children:"Address"}),e.jsx("input",{name:"address",value:o.address,onChange:k,disabled:!d,className:"w-full bg-surface-container-highest border-none rounded-xl px-4 py-3.5 focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary/20 transition-all text-on-surface font-medium disabled:opacity-60 disabled:cursor-not-allowed",type:"text",placeholder:"Your full address"})]})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{className:"block text-xs font-label font-bold uppercase tracking-wider text-secondary px-1",children:"Short Professional Summary"}),e.jsx("textarea",{name:"bio",value:o.bio,onChange:k,disabled:!d,className:"w-full bg-surface-container-highest border-none rounded-xl px-4 py-3.5 focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary/20 transition-all text-on-surface font-medium resize-none disabled:opacity-60 disabled:cursor-not-allowed",rows:"4",placeholder:"Tell us about yourself..."})]}),d&&e.jsxs("div",{className:"pt-6 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 sm:gap-4 border-t border-slate-200",children:[e.jsx("button",{type:"button",onClick:A,disabled:x,className:"px-6 py-3 text-sm font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-all text-center",children:"Discard Changes"}),e.jsxs("button",{type:"submit",disabled:x,className:"px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2",children:[x?e.jsx($,{size:16,className:"animate-spin"}):null,"Save Profile Information"]})]})]})})]})},ue=["CBSE","ICSE","State Board","IB","Other"],Ye=["Science","Commerce","Arts","Other"],Te=({profile:a,saving:n,onUpdateTenth:x,onUpdateTwelfth:g})=>{var L,A,v,p,b,E,m,c,f,l,r;const[u,h]=N.useState(!1),[d,j]=N.useState({percentage:((L=a==null?void 0:a.tenthGrade)==null?void 0:L.percentage)||"",cgpa:((A=a==null?void 0:a.tenthGrade)==null?void 0:A.cgpa)||"",board:((v=a==null?void 0:a.tenthGrade)==null?void 0:v.board)||"",year:((p=a==null?void 0:a.tenthGrade)==null?void 0:p.year)||"",school:((b=a==null?void 0:a.tenthGrade)==null?void 0:b.school)||""}),[o,i]=N.useState({percentage:((E=a==null?void 0:a.twelfthGrade)==null?void 0:E.percentage)||"",cgpa:((m=a==null?void 0:a.twelfthGrade)==null?void 0:m.cgpa)||"",board:((c=a==null?void 0:a.twelfthGrade)==null?void 0:c.board)||"",stream:((f=a==null?void 0:a.twelfthGrade)==null?void 0:f.stream)||"",year:((l=a==null?void 0:a.twelfthGrade)==null?void 0:l.year)||"",school:((r=a==null?void 0:a.twelfthGrade)==null?void 0:r.school)||""}),w=async()=>{try{const s=await x(d);if(!s.success){y.error("10th details failed: "+s.message);return}const t=await g(o);if(!t.success){y.error("12th details failed: "+t.message);return}y.success("Education details saved successfully!"),h(!1)}catch{y.error("An error occurred while saving.")}},k=()=>{var s,t,F,O,H,P,B,C,V,q,z;j({percentage:((s=a==null?void 0:a.tenthGrade)==null?void 0:s.percentage)||"",cgpa:((t=a==null?void 0:a.tenthGrade)==null?void 0:t.cgpa)||"",board:((F=a==null?void 0:a.tenthGrade)==null?void 0:F.board)||"",year:((O=a==null?void 0:a.tenthGrade)==null?void 0:O.year)||"",school:((H=a==null?void 0:a.tenthGrade)==null?void 0:H.school)||""}),i({percentage:((P=a==null?void 0:a.twelfthGrade)==null?void 0:P.percentage)||"",cgpa:((B=a==null?void 0:a.twelfthGrade)==null?void 0:B.cgpa)||"",board:((C=a==null?void 0:a.twelfthGrade)==null?void 0:C.board)||"",stream:((V=a==null?void 0:a.twelfthGrade)==null?void 0:V.stream)||"",year:((q=a==null?void 0:a.twelfthGrade)==null?void 0:q.year)||"",school:((z=a==null?void 0:a.twelfthGrade)==null?void 0:z.school)||""}),h(!1)};return e.jsxs("div",{className:"max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-8 lg:py-16",children:[e.jsxs("header",{className:"mb-12",children:[e.jsx("h2",{className:"text-3xl lg:text-4xl font-extrabold font-headline text-primary mb-3 tracking-tight",children:"Academic Foundations"}),e.jsx("p",{className:"text-secondary max-w-2xl text-base lg:text-lg leading-relaxed",children:"Your educational journey defines your core strengths. Manage your institutional history and academic achievements below."})]}),e.jsxs("section",{children:[e.jsxs("div",{className:"flex flex-wrap items-center justify-between mb-8 gap-4",children:[e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx("div",{className:"w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-teal-700 shadow-sm border border-outline-variant/10",children:e.jsx(ge,{size:20})}),e.jsx("h3",{className:"text-xl md:text-2xl font-bold font-headline text-slate-800",children:"Schooling (10th & 12th)"})]}),u?e.jsxs("div",{className:"flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto",children:[e.jsxs("button",{type:"button",onClick:k,disabled:n,className:"px-4 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-2",children:[e.jsx(Z,{size:16})," Cancel"]}),e.jsxs("button",{type:"button",onClick:w,disabled:n,className:"px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2",children:[n?e.jsx($,{size:16,className:"animate-spin"}):e.jsx(Q,{size:16}),"Save"]})]}):e.jsx("button",{onClick:()=>h(!0),className:"px-6 py-2.5 bg-white border border-slate-200 text-slate-800 rounded-xl font-bold text-sm shadow-sm hover:bg-slate-50 transition-colors w-full sm:w-auto",children:"Edit Details"})]}),e.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-2 gap-8",children:[e.jsxs("div",{className:"group bg-surface-container-lowest p-6 md:p-8 rounded-xl border border-outline-variant/10 shadow-sm hover:shadow-[0px_20px_40px_rgba(31,27,24,0.06)] transition-all duration-300 relative",children:[e.jsx("div",{className:"absolute top-0 right-0 p-6 opacity-80 md:opacity-0 md:group-hover:opacity-100 transition-opacity",children:e.jsx("span",{className:"px-3 py-1 bg-tertiary-fixed text-on-tertiary-fixed-variant text-[10px] font-bold uppercase tracking-widest rounded-full",children:o.school?"Completed":"Pending"})}),e.jsx("p",{className:"text-[10px] font-label font-bold text-teal-700 uppercase tracking-[0.2em] mb-4",children:"Secondary Education (12th)"}),e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{className:"block text-[10px] font-label font-bold uppercase tracking-wider text-secondary px-1",children:"School Name"}),e.jsx("input",{className:"w-full bg-surface-container-highest border-none rounded-xl px-4 py-3.5 focus:ring-1 focus:ring-primary/20 transition-all text-on-surface font-semibold disabled:opacity-70 disabled:bg-transparent disabled:px-0 disabled:py-0 disabled:text-xl md:disabled:text-2xl",type:"text",value:o.school,onChange:s=>i(t=>({...t,school:s.target.value})),placeholder:"e.g. St. Xavier's International Academy",disabled:!u})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-6",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{className:"block text-[10px] font-label font-bold uppercase tracking-wider text-secondary px-1",children:"Year of Study"}),e.jsx("input",{className:"w-full bg-surface-container-highest border-none rounded-xl px-4 py-3.5 focus:ring-1 focus:ring-primary/20 transition-all text-on-surface font-semibold disabled:opacity-70 disabled:bg-transparent disabled:px-0 disabled:py-0 disabled:text-sm",type:"number",value:o.year,onChange:s=>i(t=>({...t,year:s.target.value})),placeholder:"2020",disabled:!u})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{className:"block text-[10px] font-label font-bold uppercase tracking-wider text-secondary px-1",children:"Board"}),e.jsxs("select",{className:"w-full bg-surface-container-highest border-none rounded-xl px-4 py-3.5 focus:ring-1 focus:ring-primary/20 transition-all text-on-surface font-semibold disabled:opacity-70 disabled:bg-transparent disabled:appearance-none disabled:px-0 disabled:py-0 disabled:text-sm",value:o.board,onChange:s=>i(t=>({...t,board:s.target.value})),disabled:!u,children:[e.jsx("option",{value:"",children:"Select Board"}),ue.map(s=>e.jsx("option",{value:s,children:s},s))]})]})]}),e.jsxs("div",{className:"grid grid-cols-2 lg:grid-cols-3 gap-6 pt-4 border-t border-slate-50 dark:border-slate-800",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{className:"block text-[10px] font-label font-bold uppercase tracking-wider text-secondary px-1",children:"Percentage"}),e.jsxs("div",{className:"relative",children:[e.jsx("input",{className:"w-full bg-surface-container-highest border-none rounded-xl px-4 py-3.5 focus:ring-1 focus:ring-primary/20 transition-all text-teal-700 font-bold disabled:opacity-90 disabled:bg-transparent disabled:px-0 disabled:py-0 disabled:text-sm",type:"number",value:o.percentage,onChange:s=>i(t=>({...t,percentage:s.target.value})),placeholder:"90.5",max:"100",disabled:!u}),u&&e.jsx("span",{className:"absolute right-4 top-3.5 text-secondary text-sm font-bold",children:"%"}),!u&&o.percentage&&e.jsx("span",{className:"text-teal-700 text-sm font-bold inline-block -translate-y-px ml-0.5",children:"%"})]})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{className:"block text-[10px] font-label font-bold uppercase tracking-wider text-secondary px-1",children:"CGPA"}),e.jsx("input",{className:"w-full bg-surface-container-highest border-none rounded-xl px-4 py-3.5 focus:ring-1 focus:ring-primary/20 transition-all text-on-surface font-semibold disabled:opacity-70 disabled:bg-transparent disabled:px-0 disabled:py-0 disabled:text-sm",type:"number",step:"0.1",value:o.cgpa,onChange:s=>i(t=>({...t,cgpa:s.target.value})),placeholder:"9.5",max:"10",disabled:!u})]}),e.jsxs("div",{className:"space-y-2 col-span-2 lg:col-span-1",children:[e.jsx("label",{className:"block text-[10px] font-label font-bold uppercase tracking-wider text-secondary px-1",children:"Stream"}),u?e.jsxs("select",{className:"w-full bg-surface-container-highest border-none rounded-xl px-4 py-3.5 focus:ring-1 focus:ring-primary/20 transition-all text-on-surface font-semibold",value:o.stream,onChange:s=>i(t=>({...t,stream:s.target.value})),children:[e.jsx("option",{value:"",children:"Stream"}),Ye.map(s=>e.jsx("option",{value:s,children:s},s))]}):e.jsx("div",{className:"flex flex-wrap pt-0 md:pt-1",children:o.stream?e.jsx("span",{className:"px-3 py-1 bg-surface-container rounded-lg text-xs font-medium text-slate-600",children:o.stream}):e.jsx("span",{className:"text-sm font-semibold opacity-70",children:"Not specified"})})]})]})]})]}),e.jsxs("div",{className:"group bg-surface-container-lowest p-6 md:p-8 rounded-xl border border-outline-variant/10 shadow-sm hover:shadow-[0px_20px_40px_rgba(31,27,24,0.06)] transition-all duration-300",children:[e.jsx("p",{className:"text-[10px] font-label font-bold text-teal-700 uppercase tracking-[0.2em] mb-4",children:"Primary Education (10th)"}),e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{className:"block text-[10px] font-label font-bold uppercase tracking-wider text-secondary px-1",children:"School Name"}),e.jsx("input",{className:"w-full bg-surface-container-highest border-none rounded-xl px-4 py-3.5 focus:ring-1 focus:ring-primary/20 transition-all text-on-surface font-semibold disabled:opacity-70 disabled:bg-transparent disabled:px-0 disabled:py-0 disabled:text-xl md:disabled:text-2xl",type:"text",value:d.school,onChange:s=>j(t=>({...t,school:s.target.value})),placeholder:"e.g. Heritage Global School",disabled:!u})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-6",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{className:"block text-[10px] font-label font-bold uppercase tracking-wider text-secondary px-1",children:"Year of Study"}),e.jsx("input",{className:"w-full bg-surface-container-highest border-none rounded-xl px-4 py-3.5 focus:ring-1 focus:ring-primary/20 transition-all text-on-surface font-semibold disabled:opacity-70 disabled:bg-transparent disabled:px-0 disabled:py-0 disabled:text-sm",type:"number",value:d.year,onChange:s=>j(t=>({...t,year:s.target.value})),placeholder:"2018",disabled:!u})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{className:"block text-[10px] font-label font-bold uppercase tracking-wider text-secondary px-1",children:"Board"}),e.jsxs("select",{className:"w-full bg-surface-container-highest border-none rounded-xl px-4 py-3.5 focus:ring-1 focus:ring-primary/20 transition-all text-on-surface font-semibold disabled:opacity-70 disabled:bg-transparent disabled:appearance-none disabled:px-0 disabled:py-0 disabled:text-sm",value:d.board,onChange:s=>j(t=>({...t,board:s.target.value})),disabled:!u,children:[e.jsx("option",{value:"",children:"Select Board"}),ue.map(s=>e.jsx("option",{value:s,children:s},s))]})]})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-6 pt-4 border-t border-slate-50 dark:border-slate-800",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{className:"block text-[10px] font-label font-bold uppercase tracking-wider text-secondary px-1",children:"Percentage"}),e.jsxs("div",{className:"relative",children:[e.jsx("input",{className:"w-full bg-surface-container-highest border-none rounded-xl px-4 py-3.5 focus:ring-1 focus:ring-primary/20 transition-all text-teal-700 font-bold disabled:opacity-90 disabled:bg-transparent disabled:px-0 disabled:py-0 disabled:text-sm",type:"number",value:d.percentage,onChange:s=>j(t=>({...t,percentage:s.target.value})),placeholder:"90.5",max:"100",disabled:!u}),u&&e.jsx("span",{className:"absolute right-4 top-3.5 text-secondary text-sm font-bold",children:"%"}),!u&&d.percentage&&e.jsx("span",{className:"text-teal-700 text-sm font-bold inline-block -translate-y-px ml-0.5",children:"%"})]})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{className:"block text-[10px] font-label font-bold uppercase tracking-wider text-secondary px-1",children:"CGPA"}),e.jsx("input",{className:"w-full bg-surface-container-highest border-none rounded-xl px-4 py-3.5 focus:ring-1 focus:ring-primary/20 transition-all text-on-surface font-semibold disabled:opacity-70 disabled:bg-transparent disabled:px-0 disabled:py-0 disabled:text-sm",type:"number",step:"0.1",value:d.cgpa,onChange:s=>j(t=>({...t,cgpa:s.target.value})),placeholder:"9.5",max:"10",disabled:!u})]})]})]})]})]})]})]})},Re=[{value:"not_started",label:"Not Started"},{value:"pursuing",label:"Pursuing"},{value:"completed",label:"Completed"}],$e=[{value:"not_applicable",label:"Not Applicable"},{value:"not_started",label:"Not Started"},{value:"pursuing",label:"Pursuing"},{value:"completed",label:"Completed"}],Fe=({profile:a,saving:n,onUpdateUndergraduate:x,onUpdateGraduation:g})=>{var A,v,p,b,E,m,c,f,l,r,s,t,F,O,H,P,B,C,V,q;const[u,h]=N.useState(!1),[d,j]=N.useState({status:((A=a==null?void 0:a.undergraduate)==null?void 0:A.status)||"not_started",courseName:((v=a==null?void 0:a.undergraduate)==null?void 0:v.courseName)||"",specialization:((p=a==null?void 0:a.undergraduate)==null?void 0:p.specialization)||"",collegeName:((b=a==null?void 0:a.undergraduate)==null?void 0:b.collegeName)||"",university:((E=a==null?void 0:a.undergraduate)==null?void 0:E.university)||"",startYear:((m=a==null?void 0:a.undergraduate)==null?void 0:m.startYear)||"",passoutYear:((c=a==null?void 0:a.undergraduate)==null?void 0:c.passoutYear)||"",expectedPassoutYear:((f=a==null?void 0:a.undergraduate)==null?void 0:f.expectedPassoutYear)||"",cgpa:((l=a==null?void 0:a.undergraduate)==null?void 0:l.cgpa)||"",percentage:((r=a==null?void 0:a.undergraduate)==null?void 0:r.percentage)||""}),[o,i]=N.useState({status:((s=a==null?void 0:a.graduation)==null?void 0:s.status)||"not_applicable",courseName:((t=a==null?void 0:a.graduation)==null?void 0:t.courseName)||"",specialization:((F=a==null?void 0:a.graduation)==null?void 0:F.specialization)||"",collegeName:((O=a==null?void 0:a.graduation)==null?void 0:O.collegeName)||"",university:((H=a==null?void 0:a.graduation)==null?void 0:H.university)||"",startYear:((P=a==null?void 0:a.graduation)==null?void 0:P.startYear)||"",passoutYear:((B=a==null?void 0:a.graduation)==null?void 0:B.passoutYear)||"",expectedPassoutYear:((C=a==null?void 0:a.graduation)==null?void 0:C.expectedPassoutYear)||"",cgpa:((V=a==null?void 0:a.graduation)==null?void 0:V.cgpa)||"",percentage:((q=a==null?void 0:a.graduation)==null?void 0:q.percentage)||""}),w=async()=>{try{const z=await x(d);if(!z.success){y.error("UG details failed: "+z.message);return}const G=await g(o);if(!G.success){y.error("PG details failed: "+G.message);return}y.success("Higher education details saved successfully!"),h(!1)}catch{y.error("An error occurred while saving.")}},k=()=>{var z,G,R,K,X,M,ee,S,I,W,se,te,ne,re,ie,ce,le,de,oe,xe;j({status:((z=a==null?void 0:a.undergraduate)==null?void 0:z.status)||"not_started",courseName:((G=a==null?void 0:a.undergraduate)==null?void 0:G.courseName)||"",specialization:((R=a==null?void 0:a.undergraduate)==null?void 0:R.specialization)||"",collegeName:((K=a==null?void 0:a.undergraduate)==null?void 0:K.collegeName)||"",university:((X=a==null?void 0:a.undergraduate)==null?void 0:X.university)||"",startYear:((M=a==null?void 0:a.undergraduate)==null?void 0:M.startYear)||"",passoutYear:((ee=a==null?void 0:a.undergraduate)==null?void 0:ee.passoutYear)||"",expectedPassoutYear:((S=a==null?void 0:a.undergraduate)==null?void 0:S.expectedPassoutYear)||"",cgpa:((I=a==null?void 0:a.undergraduate)==null?void 0:I.cgpa)||"",percentage:((W=a==null?void 0:a.undergraduate)==null?void 0:W.percentage)||""}),i({status:((se=a==null?void 0:a.graduation)==null?void 0:se.status)||"not_applicable",courseName:((te=a==null?void 0:a.graduation)==null?void 0:te.courseName)||"",specialization:((ne=a==null?void 0:a.graduation)==null?void 0:ne.specialization)||"",collegeName:((re=a==null?void 0:a.graduation)==null?void 0:re.collegeName)||"",university:((ie=a==null?void 0:a.graduation)==null?void 0:ie.university)||"",startYear:((ce=a==null?void 0:a.graduation)==null?void 0:ce.startYear)||"",passoutYear:((le=a==null?void 0:a.graduation)==null?void 0:le.passoutYear)||"",expectedPassoutYear:((de=a==null?void 0:a.graduation)==null?void 0:de.expectedPassoutYear)||"",cgpa:((oe=a==null?void 0:a.graduation)==null?void 0:oe.cgpa)||"",percentage:((xe=a==null?void 0:a.graduation)==null?void 0:xe.percentage)||""}),h(!1)},L=(z,G,R,K)=>{const X=z.status==="pursuing",M=z.status==="completed",ee=X||M||z.status==="not_started";return e.jsxs("div",{className:"space-y-6 w-full",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{className:"block text-[10px] font-label font-bold uppercase tracking-wider text-secondary px-1",children:"Status"}),e.jsx("select",{value:z.status,onChange:S=>G(I=>({...I,status:S.target.value})),disabled:!R,className:"w-full bg-surface-container-highest border-none rounded-xl px-4 py-3 focus:ring-1 focus:ring-primary/20 transition-all text-on-surface font-semibold disabled:opacity-70 disabled:bg-transparent disabled:appearance-none disabled:px-0 disabled:py-0 disabled:text-xs",children:(K==="grad"?$e:Re).map(S=>e.jsx("option",{value:S.value,children:S.label},S.value))})]}),ee&&z.status!=="not_applicable"&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-6",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{className:"block text-[10px] font-label font-bold uppercase tracking-wider text-secondary px-1",children:"Course/Degree Name"}),e.jsx("input",{type:"text",value:z.courseName,onChange:S=>G(I=>({...I,courseName:S.target.value})),disabled:!R,placeholder:"B.Tech, B.Sc...",className:"w-full bg-surface-container-highest border-none rounded-xl px-4 py-3 focus:ring-1 focus:ring-primary/20 transition-all text-on-surface font-semibold disabled:opacity-70 disabled:bg-transparent disabled:px-0 disabled:py-0 disabled:text-xl"})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{className:"block text-[10px] font-label font-bold uppercase tracking-wider text-secondary px-1",children:"Specialization"}),e.jsx("input",{type:"text",value:z.specialization,onChange:S=>G(I=>({...I,specialization:S.target.value})),disabled:!R,placeholder:"Computer Science...",className:"w-full bg-surface-container-highest border-none rounded-xl px-4 py-3 focus:ring-1 focus:ring-primary/20 transition-all text-on-surface font-semibold disabled:opacity-70 disabled:bg-transparent disabled:px-0 disabled:py-0 disabled:text-sm"})]})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{className:"block text-[10px] font-label font-bold uppercase tracking-wider text-secondary px-1",children:"College/Institution"}),e.jsx("input",{type:"text",value:z.collegeName,onChange:S=>G(I=>({...I,collegeName:S.target.value})),disabled:!R,placeholder:"College name",className:"w-full bg-surface-container-highest border-none rounded-xl px-4 py-3 focus:ring-1 focus:ring-primary/20 transition-all text-on-surface font-semibold disabled:opacity-70 disabled:bg-transparent disabled:px-0 disabled:py-0 disabled:text-sm text-teal-700"})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{className:"block text-[10px] font-label font-bold uppercase tracking-wider text-secondary px-1",children:"University"}),e.jsx("input",{type:"text",value:z.university,onChange:S=>G(I=>({...I,university:S.target.value})),disabled:!R,placeholder:"University name",className:"w-full bg-surface-container-highest border-none rounded-xl px-4 py-3 focus:ring-1 focus:ring-primary/20 transition-all text-on-surface font-semibold disabled:opacity-70 disabled:bg-transparent disabled:px-0 disabled:py-0 disabled:text-sm"})]}),e.jsxs("div",{className:"grid grid-cols-2 md:grid-cols-3 gap-6 pt-4 border-t border-slate-50 dark:border-slate-800",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{className:"block text-[10px] font-label font-bold uppercase tracking-wider text-secondary px-1",children:"Start Year"}),e.jsx("input",{type:"number",value:z.startYear,onChange:S=>G(I=>({...I,startYear:S.target.value})),disabled:!R,placeholder:"2020",className:"w-full bg-surface-container-highest border-none rounded-xl px-4 py-3 focus:ring-1 focus:ring-primary/20 transition-all text-on-surface font-bold disabled:opacity-90 disabled:bg-transparent disabled:px-0 disabled:py-0 disabled:text-sm"})]}),X&&e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{className:"block text-[10px] font-label font-bold uppercase tracking-wider text-secondary px-1",children:"Expected Passout"}),e.jsx("input",{type:"number",value:z.expectedPassoutYear,onChange:S=>G(I=>({...I,expectedPassoutYear:S.target.value})),disabled:!R,placeholder:"2024",className:"w-full bg-surface-container-highest border-none rounded-xl px-4 py-3 focus:ring-1 focus:ring-primary/20 transition-all text-on-surface font-bold disabled:opacity-90 disabled:bg-transparent disabled:px-0 disabled:py-0 disabled:text-sm"})]}),M&&e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{className:"block text-[10px] font-label font-bold uppercase tracking-wider text-secondary px-1",children:"Passout Year"}),e.jsx("input",{type:"number",value:z.passoutYear,onChange:S=>G(I=>({...I,passoutYear:S.target.value})),disabled:!R,placeholder:"2024",className:"w-full bg-surface-container-highest border-none rounded-xl px-4 py-3 focus:ring-1 focus:ring-primary/20 transition-all text-on-surface font-bold disabled:opacity-90 disabled:bg-transparent disabled:px-0 disabled:py-0 disabled:text-sm"})]}),M&&e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{className:"block text-[10px] font-label font-bold uppercase tracking-wider text-secondary px-1",children:"CGPA / %"}),e.jsx("div",{className:"flex gap-2",children:e.jsx("input",{type:"number",step:"0.1",value:z.cgpa||z.percentage,onChange:S=>{parseFloat(S.target.value)<=10?G(W=>({...W,cgpa:S.target.value,percentage:""})):G(W=>({...W,percentage:S.target.value,cgpa:""}))},disabled:!R,placeholder:"9.0 or 85",className:"w-full bg-surface-container-highest border-none rounded-xl px-4 py-3 focus:ring-1 focus:ring-primary/20 transition-all text-primary font-bold disabled:opacity-90 disabled:bg-transparent disabled:px-0 disabled:py-0 disabled:text-sm"})})]})]})]})]})};return e.jsx("div",{className:"max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-8 lg:py-16",children:e.jsxs("section",{children:[e.jsxs("div",{className:"flex flex-wrap items-center justify-between mb-8 gap-4",children:[e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx("div",{className:"w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-teal-700 shadow-sm border border-outline-variant/10",children:e.jsx(Se,{size:20})}),e.jsx("h3",{className:"text-xl md:text-2xl font-bold font-headline text-slate-800",children:"Higher Education"})]}),u?e.jsxs("div",{className:"flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto",children:[e.jsxs("button",{type:"button",onClick:k,disabled:n,className:"px-4 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-2",children:[e.jsx(Z,{size:16})," Cancel"]}),e.jsxs("button",{type:"button",onClick:w,disabled:n,className:"px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2",children:[n?e.jsx($,{size:16,className:"animate-spin"}):e.jsx(Q,{size:16}),"Save"]})]}):e.jsx("button",{onClick:()=>h(!0),className:"px-6 py-2.5 bg-white border border-slate-200 text-slate-800 rounded-xl font-bold text-sm shadow-sm hover:bg-slate-50 transition-colors w-full sm:w-auto",children:"Edit Details"})]}),e.jsxs("div",{className:"grid grid-cols-12 gap-8",children:[e.jsxs("div",{className:"col-span-12 lg:col-span-8 bg-surface-container-lowest p-6 md:p-10 rounded-2xl border border-outline-variant/10 shadow-sm relative overflow-hidden flex flex-col md:flex-row gap-8 lg:gap-10",children:[e.jsx("div",{className:"absolute -right-12 -top-12 w-48 h-48 bg-teal-50 rounded-full blur-3xl opacity-50"}),e.jsx("div",{className:"w-16 h-16 md:w-24 md:h-24 rounded-2xl bg-slate-50 flex-shrink-0 flex items-center justify-center border border-slate-100 shadow-sm z-10",children:e.jsx("span",{className:"text-xl md:text-3xl font-black text-slate-300",children:"PG"})}),e.jsxs("div",{className:"flex-1 z-10",children:[e.jsx("p",{className:"text-[10px] font-label font-bold text-teal-700 uppercase tracking-widest mb-4",children:"Post-Graduation / Masters"}),L(o,i,u,"grad")]})]}),e.jsx("div",{className:"col-span-12 lg:col-span-4 bg-surface-container-low p-6 md:p-8 rounded-2xl flex flex-col border border-transparent hover:border-teal-200/50 transition-all duration-300",children:e.jsxs("div",{className:"flex-1",children:[e.jsx("div",{className:"flex justify-between items-start mb-6",children:e.jsx("div",{className:"w-12 h-12 rounded-xl bg-white flex items-center justify-center border border-slate-100 shadow-sm",children:e.jsx(ge,{size:20,className:"text-primary"})})}),e.jsx("p",{className:"text-[10px] font-label font-bold text-teal-700 uppercase tracking-widest mb-4",children:"Undergraduate"}),L(d,j,u,"ug")]})})]})]})})},Oe={company:"",role:"",startDate:"",endDate:"",isCurrent:!1,description:"",location:""},He=({profile:a,saving:n,onUpdate:x})=>{const[g,u]=N.useState((a==null?void 0:a.experience)||[]),[h,d]=N.useState(!1),[j,o]=N.useState(!1),i=()=>{u(v=>[{...Oe},...v]),d(!0),o(!0)},w=v=>{u(p=>p.filter((b,E)=>E!==v)),o(!0)},k=(v,p,b)=>{u(E=>E.map((m,c)=>c===v?{...m,[p]:b}:m)),o(!0)},L=async()=>{const v=g.filter(b=>b.company&&b.role),p=await x(v);p.success?(y.success(p.message),d(!1),o(!1)):y.error(p.message)},A=()=>{u((a==null?void 0:a.experience)||[]),d(!1),o(!1)};return e.jsxs("div",{className:"section-container",children:[e.jsxs("div",{className:"section-header",children:[e.jsx("h2",{children:"Work Experience"}),e.jsxs("div",{className:"header-actions",children:[j&&e.jsxs(e.Fragment,{children:[e.jsxs(U,{variant:"outline",onClick:A,disabled:n,children:[e.jsx(Z,{size:16})," Cancel"]}),e.jsxs(U,{onClick:L,disabled:n,className:"save-btn",children:[n?e.jsx($,{size:16,className:"animate-spin"}):e.jsx(Q,{size:16}),"Save Changes"]})]}),e.jsxs(U,{variant:"outline",onClick:i,children:[e.jsx(ae,{size:16})," Add Experience"]})]})]}),g.length===0?e.jsxs("div",{className:"empty-state",children:[e.jsx(me,{size:48}),e.jsx("h3",{children:"No Experience Added"}),e.jsx("p",{children:"Add your work experience to showcase your professional journey"}),e.jsxs(U,{onClick:i,children:[e.jsx(ae,{size:16})," Add Your First Experience"]})]}):e.jsx("div",{className:"experience-list",children:g.map((v,p)=>e.jsxs("div",{className:"experience-card",children:[e.jsxs("div",{className:"card-header",children:[e.jsx("div",{className:"card-number",children:p+1}),e.jsx(U,{variant:"ghost",size:"sm",className:"remove-btn",onClick:()=>w(p),children:e.jsx(J,{size:16})})]}),e.jsx("div",{className:"card-content",children:e.jsxs("div",{className:"form-grid",children:[e.jsxs("div",{className:"form-group",children:[e.jsx(T,{children:"Company Name *"}),e.jsx(Y,{value:v.company,onChange:b=>k(p,"company",b.target.value),placeholder:"Google, Microsoft..."})]}),e.jsxs("div",{className:"form-group",children:[e.jsx(T,{children:"Role/Position *"}),e.jsx(Y,{value:v.role,onChange:b=>k(p,"role",b.target.value),placeholder:"Software Engineer"})]}),e.jsxs("div",{className:"form-group",children:[e.jsx(T,{children:"Start Date"}),e.jsx(Y,{type:"date",value:v.startDate?new Date(v.startDate).toISOString().split("T")[0]:"",onChange:b=>k(p,"startDate",b.target.value)})]}),e.jsxs("div",{className:"form-group",children:[e.jsx(T,{children:"End Date"}),e.jsx(Y,{type:"date",value:v.endDate?new Date(v.endDate).toISOString().split("T")[0]:"",onChange:b=>k(p,"endDate",b.target.value),disabled:v.isCurrent})]}),e.jsx("div",{className:"form-group checkbox-group",children:e.jsxs("label",{className:"checkbox-label",children:[e.jsx("input",{type:"checkbox",checked:v.isCurrent,onChange:b=>k(p,"isCurrent",b.target.checked)}),e.jsx("span",{children:"Currently Working Here"})]})}),e.jsxs("div",{className:"form-group",children:[e.jsx(T,{children:"Location"}),e.jsx(Y,{value:v.location,onChange:b=>k(p,"location",b.target.value),placeholder:"New Delhi, India"})]}),e.jsxs("div",{className:"form-group full-width",children:[e.jsx(T,{children:"Description"}),e.jsx("textarea",{value:v.description,onChange:b=>k(p,"description",b.target.value),placeholder:"Describe your responsibilities and achievements...",rows:3,className:"description-textarea"})]})]})})]},p))}),e.jsx("style",{jsx:!0,children:`
        .section-container {
          padding: 32px;
          background: #ffffff;
          margin: 24px;
          border-radius: 16px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid #e2e8f0;
          flex-wrap: wrap;
          gap: 12px;
        }

        .section-header h2 {
          font-size: 22px;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
        }

        .header-actions {
          display: flex;
          gap: 10px;
        }

        .save-btn {
          background: #f97316;
          color: white;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          background: #f8fafc;
          border: 2px dashed #e2e8f0;
          border-radius: 12px;
          color: #64748b;
        }

        .empty-state h3 {
          color: #1e293b;
          margin: 20px 0 8px;
        }

        .empty-state p {
          margin-bottom: 20px;
        }

        .experience-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .experience-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          overflow: hidden;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          background: #fff7ed;
          border-bottom: 1px solid #fed7aa;
        }

        .card-number {
          width: 28px;
          height: 28px;
          background: #f97316;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 600;
        }

        .remove-btn {
          color: #ef4444;
        }

        .card-content {
          padding: 20px;
          background: #ffffff;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        .checkbox-group {
          justify-content: flex-end;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #64748b;
          font-size: 14px;
          cursor: pointer;
        }

        .checkbox-label input {
          width: 16px;
          height: 16px;
          accent-color: #f97316;
        }

        .description-textarea {
          width: 100%;
          padding: 12px;
          border-radius: 8px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          color: #1e293b;
          font-size: 14px;
          resize: vertical;
          font-family: inherit;
        }

        .description-textarea:focus {
          outline: none;
          border-color: #f97316;
          box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
        }

        @media (max-width: 768px) {
          .section-container {
            padding: 20px;
            margin: 16px;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }
        }
      `})]})},Ve=({profile:a,saving:n,onUpdate:x})=>{var A,v,p,b,E;const[g,u]=N.useState(!1),[h,d]=N.useState({github:((A=a==null?void 0:a.socialLinks)==null?void 0:A.github)||"",linkedin:((v=a==null?void 0:a.socialLinks)==null?void 0:v.linkedin)||"",portfolio:((p=a==null?void 0:a.socialLinks)==null?void 0:p.portfolio)||"",twitter:((b=a==null?void 0:a.socialLinks)==null?void 0:b.twitter)||"",customLinks:((E=a==null?void 0:a.socialLinks)==null?void 0:E.customLinks)||[]}),j=(m,c)=>{d(f=>({...f,[m]:c}))},o=()=>{d(m=>({...m,customLinks:[...m.customLinks,{name:"",url:""}]}))},i=(m,c,f)=>{d(l=>({...l,customLinks:l.customLinks.map((r,s)=>s===m?{...r,[c]:f}:r)}))},w=m=>{d(c=>({...c,customLinks:c.customLinks.filter((f,l)=>l!==m)}))},k=async()=>{const m=/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/,c=r=>!r||r===""||m.test(r);if(!c(h.github)||!c(h.linkedin)||!c(h.portfolio)||!c(h.twitter)){y.error("Please enter valid URLs");return}const f=h.customLinks.filter(r=>r.name&&r.url),l=await x({...h,customLinks:f});l.success?(y.success(l.message),u(!1)):y.error(l.message)},L=()=>{var m,c,f,l,r;d({github:((m=a==null?void 0:a.socialLinks)==null?void 0:m.github)||"",linkedin:((c=a==null?void 0:a.socialLinks)==null?void 0:c.linkedin)||"",portfolio:((f=a==null?void 0:a.socialLinks)==null?void 0:f.portfolio)||"",twitter:((l=a==null?void 0:a.socialLinks)==null?void 0:l.twitter)||"",customLinks:((r=a==null?void 0:a.socialLinks)==null?void 0:r.customLinks)||[]}),u(!1)};return e.jsxs("div",{className:"section-container",children:[e.jsxs("div",{className:"section-header",children:[e.jsx("h2",{children:"Social Links"}),g?e.jsxs("div",{className:"header-actions",children:[e.jsxs(U,{variant:"outline",onClick:L,disabled:n,children:[e.jsx(Z,{size:16})," Cancel"]}),e.jsxs(U,{onClick:k,disabled:n,className:"save-btn",children:[n?e.jsx($,{size:16,className:"animate-spin"}):e.jsx(Q,{size:16}),"Save"]})]}):e.jsx(U,{variant:"outline",onClick:()=>u(!0),children:"Edit"})]}),e.jsxs("div",{className:"links-grid",children:[e.jsxs("div",{className:"link-card",children:[e.jsx("div",{className:"link-icon github",children:e.jsx(Pe,{size:24})}),e.jsxs("div",{className:"link-content",children:[e.jsx(T,{children:"GitHub"}),e.jsx(Y,{value:h.github,onChange:m=>j("github",m.target.value),disabled:!g,placeholder:"https://github.com/username"})]})]}),e.jsxs("div",{className:"link-card",children:[e.jsx("div",{className:"link-icon linkedin",children:e.jsx(ze,{size:24})}),e.jsxs("div",{className:"link-content",children:[e.jsx(T,{children:"LinkedIn"}),e.jsx(Y,{value:h.linkedin,onChange:m=>j("linkedin",m.target.value),disabled:!g,placeholder:"https://linkedin.com/in/username"})]})]}),e.jsxs("div",{className:"link-card",children:[e.jsx("div",{className:"link-icon portfolio",children:e.jsx(Ee,{size:24})}),e.jsxs("div",{className:"link-content",children:[e.jsx(T,{children:"Portfolio / Website"}),e.jsx(Y,{value:h.portfolio,onChange:m=>j("portfolio",m.target.value),disabled:!g,placeholder:"https://yourwebsite.com"})]})]}),e.jsxs("div",{className:"link-card",children:[e.jsx("div",{className:"link-icon twitter",children:e.jsx("span",{style:{fontSize:"20px",fontWeight:"bold"},children:"𝕏"})}),e.jsxs("div",{className:"link-content",children:[e.jsx(T,{children:"Twitter / X"}),e.jsx(Y,{value:h.twitter,onChange:m=>j("twitter",m.target.value),disabled:!g,placeholder:"https://twitter.com/username"})]})]})]}),e.jsxs("div",{className:"custom-links-section",children:[e.jsxs("div",{className:"custom-links-header",children:[e.jsx("h3",{children:"Custom Links"}),g&&e.jsxs(U,{variant:"outline",size:"sm",onClick:o,children:[e.jsx(ae,{size:16})," Add Link"]})]}),h.customLinks.length===0?e.jsxs("div",{className:"empty-custom",children:[e.jsx(Le,{size:20}),e.jsx("span",{children:"No custom links added"})]}):e.jsx("div",{className:"custom-links-list",children:h.customLinks.map((m,c)=>e.jsxs("div",{className:"custom-link-row",children:[e.jsxs("div",{className:"custom-link-inputs",children:[e.jsx(Y,{value:m.name,onChange:f=>i(c,"name",f.target.value),disabled:!g,placeholder:"Link Name",className:"name-input"}),e.jsx(Y,{value:m.url,onChange:f=>i(c,"url",f.target.value),disabled:!g,placeholder:"https://...",className:"url-input"})]}),g&&e.jsx(U,{variant:"ghost",size:"sm",className:"remove-btn",onClick:()=>w(c),children:e.jsx(J,{size:16})})]},c))})]}),e.jsx("style",{jsx:!0,children:`
        .section-container {
          padding: 32px;
          background: #ffffff;
          margin: 24px;
          border-radius: 16px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid #e2e8f0;
        }

        .section-header h2 {
          font-size: 22px;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
        }

        .header-actions {
          display: flex;
          gap: 10px;
        }

        .save-btn {
          background: #f97316;
          color: white;
        }

        .links-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          margin-bottom: 32px;
        }

        .link-card {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 20px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
        }

        .link-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .link-icon.github {
          background: linear-gradient(135deg, #333, #24292e);
        }

        .link-icon.linkedin {
          background: linear-gradient(135deg, #0077b5, #00a0dc);
        }

        .link-icon.portfolio {
          background: linear-gradient(135deg, #f97316, #ea580c);
        }

        .link-icon.twitter {
          background: linear-gradient(135deg, #1a1a1a, #333);
        }

        .link-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .custom-links-section {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 20px;
        }

        .custom-links-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .custom-links-header h3 {
          color: #1e293b;
          font-size: 16px;
          font-weight: 500;
          margin: 0;
        }

        .empty-custom {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 24px;
          color: #64748b;
        }

        .custom-links-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .custom-link-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .custom-link-inputs {
          display: flex;
          flex: 1;
          gap: 12px;
        }

        .name-input {
          flex: 1;
          max-width: 200px;
        }

        .url-input {
          flex: 2;
        }

        .remove-btn {
          color: #ef4444;
        }

        @media (max-width: 768px) {
          .section-container {
            padding: 20px;
            margin: 16px;
          }

          .links-grid {
            grid-template-columns: 1fr;
          }

          .custom-link-inputs {
            flex-direction: column;
          }

          .name-input {
            max-width: none;
          }
        }
      `})]})},qe=({user:a,saving:n,onToggleNewsletter:x})=>{const[g,u]=N.useState((a==null?void 0:a.newsletter)||!1),[h,d]=N.useState(!1),j=async()=>{const o=!g;d(!0);const i=await x(o);i.success?(u(o),y.success(i.message)):y.error(i.message),d(!1)};return e.jsxs("div",{className:"section-container",children:[e.jsx("div",{className:"section-header",children:e.jsx("h2",{children:"Notification Settings"})}),e.jsxs("div",{className:"settings-list",children:[e.jsxs("div",{className:"setting-card",children:[e.jsx("div",{className:"setting-icon",children:e.jsx(pe,{size:24})}),e.jsxs("div",{className:"setting-content",children:[e.jsx("h3",{children:"Newsletter Subscription"}),e.jsx("p",{children:"Receive weekly updates about new features, career tips, and opportunities."})]}),e.jsx("div",{className:"setting-action",children:e.jsx("button",{className:`toggle-btn ${g?"active":""}`,onClick:j,disabled:h||n,children:h?e.jsx($,{size:16,className:"animate-spin"}):e.jsx("span",{className:"toggle-track",children:e.jsx("span",{className:"toggle-thumb"})})})})]}),e.jsxs("div",{className:"setting-card",children:[e.jsx("div",{className:"setting-icon bell",children:e.jsx(he,{size:24})}),e.jsxs("div",{className:"setting-content",children:[e.jsx("h3",{children:"Email Notifications"}),e.jsx("p",{children:"Receive email alerts for important account activities and security updates."})]}),e.jsx("div",{className:"setting-action",children:e.jsx("span",{className:"always-on-badge",children:"Always On"})})]})]}),e.jsxs("div",{className:"info-card",children:[e.jsx("h4",{children:"📧 Email Preferences"}),e.jsx("p",{children:"We respect your privacy. You can unsubscribe from promotional emails at any time. Essential security and account-related emails cannot be disabled."})]}),e.jsx("style",{jsx:!0,children:`
        .section-container {
          padding: 32px;
          background: #ffffff;
          margin: 24px;
          border-radius: 16px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
        }

        .section-header {
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid #e2e8f0;
        }

        .section-header h2 {
          font-size: 22px;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
        }

        .settings-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 24px;
        }

        .setting-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
        }

        .setting-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #f97316, #ea580c);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .setting-icon.bell {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
        }

        .setting-content {
          flex: 1;
        }

        .setting-content h3 {
          color: #1e293b;
          font-size: 16px;
          font-weight: 500;
          margin: 0 0 4px 0;
        }

        .setting-content p {
          color: #64748b;
          font-size: 14px;
          margin: 0;
        }

        .toggle-btn {
          width: 52px;
          height: 28px;
          background: #e2e8f0;
          border: none;
          border-radius: 14px;
          cursor: pointer;
          transition: background 0.2s;
          padding: 2px;
        }

        .toggle-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .toggle-btn.active {
          background: #f97316;
        }

        .toggle-track {
          display: block;
          width: 100%;
          height: 100%;
          position: relative;
        }

        .toggle-thumb {
          display: block;
          width: 24px;
          height: 24px;
          background: white;
          border-radius: 50%;
          transition: transform 0.2s;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
        }

        .toggle-btn.active .toggle-thumb {
          transform: translateX(24px);
        }

        .always-on-badge {
          background: #dcfce7;
          color: #16a34a;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
        }

        .info-card {
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          border-radius: 12px;
          padding: 20px;
        }

        .info-card h4 {
          color: #1d4ed8;
          font-size: 14px;
          font-weight: 600;
          margin: 0 0 8px 0;
        }

        .info-card p {
          color: #64748b;
          font-size: 14px;
          margin: 0;
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .section-container {
            padding: 20px;
            margin: 16px;
          }

          .setting-card {
            flex-wrap: wrap;
          }

          .setting-action {
            width: 100%;
            margin-top: 12px;
          }
        }
      `})]})},Me=({user:a})=>{const{logout:n,setToken:x}=ye(),[g,u]=N.useState(!1),[h,d]=N.useState("request"),[j,o]=N.useState(""),[i,w]=N.useState(""),[k,L]=N.useState(!1),[A,v]=N.useState(!1),[p,b]=N.useState(""),[E,m]=N.useState(""),[c,f]=N.useState(!1),[l,r]=N.useState(!1),s=je(),t=async()=>{var P,B;if(!j){y.error("Please enter a new email address");return}if(j===(a==null?void 0:a.email)){y.error("New email must be different from current email");return}L(!0);try{(await _.post(`${D.API_BASE_URL}/auth/request-email-change`,{newEmail:j},{headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}})).data.success&&(y.success("Verification code sent to the new email"),d("verify"))}catch(C){y.error(((B=(P=C.response)==null?void 0:P.data)==null?void 0:B.message)||"Failed to send verification code")}finally{L(!1)}},F=async()=>{var P,B;if(!i){y.error("Please enter the verification code");return}L(!0);try{const C=await _.post(`${D.API_BASE_URL}/auth/verify-email-change`,{newEmail:j,otp:i},{headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}});C.data.success&&(y.success("Email changed successfully"),C.data.token&&(localStorage.setItem("token",C.data.token),x(C.data.token)),u(!1),d("request"),o(""),w(""),window.location.reload())}catch(C){y.error(((B=(P=C.response)==null?void 0:P.data)==null?void 0:B.message)||"Verification failed")}finally{L(!1)}},O=async()=>{var P;r(!0);try{(await _.post(`${D.API_BASE_URL}/auth/forgot-password`,{email:a==null?void 0:a.email})).data.success&&(y.success("Verification code sent to your email"),s("/change-password",{state:{email:a==null?void 0:a.email}}))}catch(B){const C=(P=B.response)==null?void 0:P.data,V=(C==null?void 0:C.message)||B.message||"Failed to send verification code",q=C!=null&&C.errorCode?` [Code: ${C.errorCode}]`:"";y.error(`${V}${q}`)}finally{r(!1)}},H=async()=>{var P,B;if(E!=="DELETE"){y.error("Please type DELETE to confirm");return}if((a==null?void 0:a.authProvider)!=="google"&&!p){y.error("Please enter your password");return}f(!0);try{(await _.delete(`${D.API_BASE_URL}/auth/delete-account`,{data:{password:p,confirmDelete:E},headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}})).data.success&&(y.success("Account deleted successfully"),n())}catch(C){y.error(((B=(P=C.response)==null?void 0:P.data)==null?void 0:B.message)||"Failed to delete account")}finally{f(!1)}};return e.jsxs("div",{className:"section-container",children:[e.jsx("div",{className:"section-header",children:e.jsx("h2",{children:"Security & Privacy"})}),e.jsxs("div",{className:"settings-list",children:[e.jsxs("div",{className:"setting-card",children:[e.jsx("div",{className:"setting-icon email",children:e.jsx(pe,{size:24})}),e.jsxs("div",{className:"setting-content",children:[e.jsx("h3",{children:"Change Email Address"}),e.jsxs("p",{children:["Current: ",e.jsx("strong",{children:a==null?void 0:a.email})]})]}),e.jsx(U,{variant:"outline",onClick:()=>u(!g),children:g?"Cancel":"Change Email"})]}),g&&e.jsx("div",{className:"email-change-form",children:h==="request"?e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"form-group",children:[e.jsx(T,{children:"New Email Address"}),e.jsx(Y,{type:"email",value:j,onChange:P=>o(P.target.value),placeholder:"Enter new email address"})]}),e.jsxs(U,{onClick:t,disabled:k,className:"primary-btn",children:[k?e.jsx($,{size:16,className:"animate-spin"}):null,"Send Verification Code"]})]}):e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"info-box",children:e.jsxs("p",{children:["A verification code has been sent to ",e.jsx("strong",{children:j}),". Please check your inbox."]})}),e.jsxs("div",{className:"form-group",children:[e.jsx(T,{children:"Verification Code"}),e.jsx(Y,{type:"text",value:i,onChange:P=>w(P.target.value),placeholder:"Enter 6-digit code",maxLength:6})]}),e.jsxs("div",{className:"form-actions",children:[e.jsx(U,{variant:"outline",onClick:()=>d("request"),children:"Back"}),e.jsxs(U,{onClick:F,disabled:k,className:"primary-btn",children:[k?e.jsx($,{size:16,className:"animate-spin"}):null,"Verify & Change Email"]})]})]})}),e.jsxs("div",{className:"setting-card",children:[e.jsx("div",{className:"setting-icon password",children:e.jsx(Ae,{size:24})}),e.jsxs("div",{className:"setting-content",children:[e.jsx("h3",{children:"Change Password"}),e.jsx("p",{children:"Update your password regularly for security"})]}),e.jsx(U,{className:"bg-[#6366F1] hover:bg-[#4F46E5] text-white transition-all duration-200",onClick:O,disabled:l,children:l?e.jsx($,{size:16,className:"animate-spin"}):"Change Password"})]}),e.jsxs("div",{className:"setting-card danger",children:[e.jsx("div",{className:"setting-icon delete",children:e.jsx(J,{size:24})}),e.jsxs("div",{className:"setting-content",children:[e.jsx("h3",{children:"Delete Account"}),e.jsx("p",{children:"Permanently delete your account and all data"})]}),e.jsx(U,{variant:"destructive",onClick:()=>v(!A),children:A?"Cancel":"Delete Account"})]}),A&&e.jsxs("div",{className:"delete-confirm-form",children:[e.jsxs("div",{className:"warning-box",children:[e.jsx(Ie,{size:24}),e.jsxs("div",{children:[e.jsx("h4",{children:"This action is irreversible!"}),e.jsx("p",{children:"All your data including profile, education details, experience, projects, and certifications will be permanently deleted."})]})]}),(a==null?void 0:a.authProvider)!=="google"&&e.jsxs("div",{className:"form-group",children:[e.jsx(T,{children:"Enter your password to confirm"}),e.jsx(Y,{type:"password",value:p,onChange:P=>b(P.target.value),placeholder:"Your password"})]}),e.jsxs("div",{className:"form-group",children:[e.jsxs(T,{children:["Type ",e.jsx("strong",{children:"DELETE"})," to confirm"]}),e.jsx(Y,{value:E,onChange:P=>m(P.target.value.toUpperCase()),placeholder:"Type DELETE"})]}),e.jsxs(U,{variant:"destructive",onClick:H,disabled:c||E!=="DELETE",className:"delete-btn",children:[c?e.jsx($,{size:16,className:"animate-spin"}):e.jsx(J,{size:16}),"Permanently Delete My Account"]})]})]}),e.jsx("style",{jsx:!0,children:`
        .section-container {
          padding: 32px;
          background: #ffffff;
          margin: 24px;
          border-radius: 16px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
        }

        .section-header {
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid #e2e8f0;
        }

        .section-header h2 {
          font-size: 22px;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
        }

        .settings-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .setting-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
        }

        .setting-card.danger {
          border-color: #fecaca;
          background: #fef2f2;
        }

        .setting-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .setting-icon.email {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
        }

        .setting-icon.password {
          background: linear-gradient(135deg, #f97316, #ea580c);
        }

        .setting-icon.delete {
          background: linear-gradient(135deg, #ef4444, #dc2626);
        }

        .setting-content {
          flex: 1;
        }

        .setting-content h3 {
          color: #1e293b;
          font-size: 16px;
          font-weight: 500;
          margin: 0 0 4px 0;
        }

        .setting-content p {
          color: #64748b;
          font-size: 14px;
          margin: 0;
        }

        .email-change-form,
        .delete-confirm-form {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 24px;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-actions {
          display: flex;
          gap: 12px;
        }

        .primary-btn {
          background: #f97316;
          color: white;
        }

        .info-box {
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 16px;
        }

        .info-box p {
          color: #64748b;
          margin: 0;
          font-size: 14px;
        }

        .warning-box {
          display: flex;
          gap: 16px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 20px;
          color: #ef4444;
        }

        .warning-box h4 {
          color: #dc2626;
          margin: 0 0 4px 0;
          font-size: 14px;
        }

        .warning-box p {
          margin: 0;
          font-size: 13px;
          line-height: 1.5;
          color: #991b1b;
        }

        .delete-btn {
          width: 100%;
          margin-top: 8px;
        }

        @media (max-width: 768px) {
          .section-container {
            padding: 20px;
            margin: 16px;
          }

          .setting-card {
            flex-wrap: wrap;
          }
        }
      `})]})},ba=()=>{const[a,n]=N.useState("personal"),{profile:x,user:g,loading:u,error:h,saving:d,updatePersonalInfo:j,updateTenthGrade:o,updateTwelfthGrade:i,updateUndergraduate:w,updateGraduation:k,updateExperience:L,updateSocialLinks:A,uploadPhoto:v,removePhoto:p,toggleNewsletter:b}=Ue(),E=()=>{switch(a){case"personal":return e.jsx(De,{profile:x,user:g,saving:d,onUpdate:j,onUploadPhoto:v,onRemovePhoto:p});case"education":return e.jsx(Te,{profile:x,saving:d,onUpdateTenth:o,onUpdateTwelfth:i});case"higher-education":return e.jsx(Fe,{profile:x,saving:d,onUpdateUndergraduate:w,onUpdateGraduation:k});case"experience":return e.jsx(He,{profile:x,saving:d,onUpdate:L});case"social-links":return e.jsx(Ve,{profile:x,saving:d,onUpdate:A});case"notifications":return e.jsx(qe,{user:g,saving:d,onToggleNewsletter:b});case"security":return e.jsx(Me,{user:g});default:return null}};return u?e.jsxs("div",{className:"flex flex-col items-center justify-center min-h-screen bg-surface",children:[e.jsx($,{size:48,className:"animate-spin text-primary"}),e.jsx("p",{className:"mt-4 text-on-surface-variant font-medium",children:"Loading your profile..."})]}):h?e.jsxs("div",{className:"flex flex-col items-center justify-center min-h-screen bg-surface text-center px-4",children:[e.jsx("h2",{className:"text-error text-2xl font-bold mb-2",children:"Error Loading Profile"}),e.jsx("p",{className:"text-on-surface-variant",children:h})]}):e.jsxs("div",{className:"flex min-h-screen bg-surface font-body text-on-surface",children:[e.jsx(Ce,{position:"top-right"}),e.jsx(_e,{activeSection:a,onSectionChange:n,user:g}),e.jsxs("main",{className:"flex-1 min-w-0 pb-16 lg:pb-0",children:[e.jsxs("div",{className:"lg:hidden p-4 border-b border-outline-variant/20 flex justify-between items-center bg-white sticky top-[64px] z-30 shadow-sm",children:[e.jsx("span",{className:"font-bold text-primary font-headline",children:"Profile Dashboard"}),e.jsxs("select",{value:a,onChange:m=>n(m.target.value),className:"text-sm bg-surface-container-highest border-none rounded-lg focus:ring-1 focus:ring-primary/20 text-on-surface font-medium py-2 px-3",children:[e.jsx("option",{value:"personal",children:"Personal Information"}),e.jsx("option",{value:"education",children:"Education"}),e.jsx("option",{value:"higher-education",children:"Higher Education"}),e.jsx("option",{value:"experience",children:"Experience"}),e.jsx("option",{value:"social-links",children:"Social Links"}),e.jsx("option",{value:"notifications",children:"Notifications"}),e.jsx("option",{value:"security",children:"Security & Privacy"})]})]}),e.jsx("div",{className:"animate-in fade-in duration-300",children:E()})]})]})};export{ba as default};
