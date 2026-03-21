import{c as le,r as j,f as D,a as _,j as e,h as me,B as he,d as ne,X as q,L as $,C as ae,i as ge,u as xe}from"./index-B62Lipmu.js";import{G as ue}from"./graduation-cap-SywM-8Kr.js";import{L as ie}from"./link-2-BV953yK7.js";import{B as re}from"./bell-BoiAQu3q.js";import{S as pe}from"./shield-6wbJzrTy.js";import{B as S}from"./button-ixIYDf-o.js";import{I as x}from"./input-F7vN5Sfk.js";import{L as d}from"./label-H4IlqcPr.js";import{n as k,F as fe}from"./index-Beff5agY.js";import{S as H}from"./save-B9kizyvi.js";import{T as M}from"./trash-2-CzumiFhX.js";import{C as se}from"./chevron-up-BXyauA-W.js";import{P as K}from"./plus-BHrBy8RQ.js";import{G as be,L as je}from"./linkedin-DnlCUOjh.js";import{G as ve}from"./globe-sN2AoLEd.js";import{M as ce}from"./mail-CqpzCbzM.js";import{K as Ne}from"./key-DTq1EhJU.js";import{T as we}from"./triangle-alert-D4yC_t2G.js";import"./index-DehRuF4z.js";import"./clsx-B-dksMZM.js";import"./index-BWEFY4kP.js";/**
 * @license lucide-react v0.437.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ye=le("Camera",[["path",{d:"M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z",key:"1tc9qg"}],["circle",{cx:"12",cy:"13",r:"3",key:"1vg3eu"}]]),ke=()=>{const[a,t]=j.useState(null),[h,v]=j.useState(null),[E,f]=j.useState(!0),[l,z]=j.useState(null),[N,c]=j.useState(!1),w=j.useCallback(async()=>{var i,n;try{f(!0),z(null);const r=await D.get(`${_.API_BASE_URL}/profile/me`,{headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}});r.data.success&&(t(r.data.profile),v(r.data.profile.user))}catch(r){console.error("Error fetching profile:",r),z(((n=(i=r.response)==null?void 0:i.data)==null?void 0:n.message)||"Failed to load profile")}finally{f(!1)}},[]);return j.useEffect(()=>{w()},[w]),{profile:a,user:h,loading:E,error:l,saving:N,refetch:w,updatePersonalInfo:async i=>{var n,r;c(!0);try{if((await D.put(`${_.API_BASE_URL}/profile/personal`,i,{headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}})).data.success)return await w(),{success:!0,message:"Personal information updated"}}catch(b){return{success:!1,message:((r=(n=b.response)==null?void 0:n.data)==null?void 0:r.message)||"Failed to update"}}finally{c(!1)}},updateTenthGrade:async i=>{var n,r;c(!0);try{if((await D.put(`${_.API_BASE_URL}/profile/education/tenth`,i,{headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}})).data.success)return await w(),{success:!0,message:"10th grade details updated"}}catch(b){return{success:!1,message:((r=(n=b.response)==null?void 0:n.data)==null?void 0:r.message)||"Failed to update"}}finally{c(!1)}},updateTwelfthGrade:async i=>{var n,r;c(!0);try{if((await D.put(`${_.API_BASE_URL}/profile/education/twelfth`,i,{headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}})).data.success)return await w(),{success:!0,message:"12th grade details updated"}}catch(b){return{success:!1,message:((r=(n=b.response)==null?void 0:n.data)==null?void 0:r.message)||"Failed to update"}}finally{c(!1)}},updateUndergraduate:async i=>{var n,r;c(!0);try{if((await D.put(`${_.API_BASE_URL}/profile/education/undergraduate`,i,{headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}})).data.success)return await w(),{success:!0,message:"Undergraduate details updated"}}catch(b){return{success:!1,message:((r=(n=b.response)==null?void 0:n.data)==null?void 0:r.message)||"Failed to update"}}finally{c(!1)}},updateGraduation:async i=>{var n,r;c(!0);try{if((await D.put(`${_.API_BASE_URL}/profile/education/graduation`,i,{headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}})).data.success)return await w(),{success:!0,message:"Graduation details updated"}}catch(b){return{success:!1,message:((r=(n=b.response)==null?void 0:n.data)==null?void 0:r.message)||"Failed to update"}}finally{c(!1)}},updateExperience:async i=>{var n,r;c(!0);try{if((await D.put(`${_.API_BASE_URL}/profile/experience`,{experience:i},{headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}})).data.success)return await w(),{success:!0,message:"Experience updated"}}catch(b){return{success:!1,message:((r=(n=b.response)==null?void 0:n.data)==null?void 0:r.message)||"Failed to update"}}finally{c(!1)}},updateSocialLinks:async i=>{var n,r;c(!0);try{if((await D.put(`${_.API_BASE_URL}/profile/social-links`,i,{headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}})).data.success)return await w(),{success:!0,message:"Social links updated"}}catch(b){return{success:!1,message:((r=(n=b.response)==null?void 0:n.data)==null?void 0:r.message)||"Failed to update"}}finally{c(!1)}},uploadPhoto:async i=>{var n,r;c(!0);try{const b=new FormData;b.append("photo",i);const F=await D.post(`${_.API_BASE_URL}/profile/photo`,b,{headers:{Authorization:`Bearer ${localStorage.getItem("token")}`,"Content-Type":"multipart/form-data"}});if(F.data.success)return await w(),{success:!0,message:"Photo uploaded",imageUrl:F.data.imageUrl}}catch(b){return{success:!1,message:((r=(n=b.response)==null?void 0:n.data)==null?void 0:r.message)||"Failed to upload photo"}}finally{c(!1)}},removePhoto:async()=>{var i,n;c(!0);try{if((await D.delete(`${_.API_BASE_URL}/profile/photo`,{headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}})).data.success)return await w(),{success:!0,message:"Photo removed"}}catch(r){return{success:!1,message:((n=(i=r.response)==null?void 0:i.data)==null?void 0:n.message)||"Failed to remove photo"}}finally{c(!1)}},toggleNewsletter:async i=>{var n,r;c(!0);try{const b=await D.put(`${_.API_BASE_URL}/auth/newsletter`,{newsletter:i},{headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}});if(b.data.success)return await w(),{success:!0,message:b.data.message}}catch(b){return{success:!1,message:((r=(n=b.response)==null?void 0:n.data)==null?void 0:r.message)||"Failed to update"}}finally{c(!1)}}}},Ce=[{id:"personal",label:"Personal Information",icon:me},{id:"education",label:"Education (10th & 12th)",icon:ue},{id:"higher-education",label:"Higher Education",icon:he},{id:"experience",label:"Experience",icon:ne},{id:"social-links",label:"Social Links",icon:ie},{id:"notifications",label:"Notifications",icon:re},{id:"security",label:"Security & Privacy",icon:pe}];function Se({activeSection:a,onSectionChange:t,user:h}){var v,E;return e.jsxs("aside",{className:"fixed inset-y-0 left-0 w-72 bg-slate-50 flex flex-col h-full py-8 px-4 font-headline text-sm font-medium tracking-wide z-50 border-r border-slate-200/60 shadow-sm",children:[e.jsxs("div",{className:"mb-10 px-4",children:[e.jsx("h1",{className:"text-xl font-bold text-slate-900 font-headline",children:"Career Navigator"}),e.jsx("p",{className:"text-xs text-slate-500 mt-1 uppercase tracking-widest font-label",children:"Professional Profile"})]}),e.jsx("nav",{className:"flex-1 space-y-1",children:Ce.map(f=>{const l=f.icon,z=a===f.id;return e.jsxs("button",{onClick:()=>t(f.id),className:`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left ${z?"text-teal-700 font-bold border-r-4 border-teal-600 bg-slate-100":"text-slate-600 hover:text-slate-900 hover:bg-slate-100"}`,children:[e.jsx(l,{size:20,className:z?"text-teal-700":"text-slate-400"}),e.jsx("span",{className:"font-medium tracking-wide",children:f.label})]},f.id)})}),e.jsxs("div",{className:"mt-auto px-4 pt-6 border-t border-slate-200/50",children:[e.jsxs("div",{className:"flex items-center mb-6 gap-3",children:[e.jsx("div",{className:"h-10 w-10 rounded-full overflow-hidden bg-slate-200 border border-white shadow-sm flex items-center justify-center",children:h!=null&&h.imageUrl?e.jsx("img",{src:h.imageUrl,alt:h.name,className:"h-full w-full object-cover"}):e.jsx("span",{className:"text-sm font-bold text-slate-600",children:(E=(v=h==null?void 0:h.name)==null?void 0:v.charAt(0))==null?void 0:E.toUpperCase()})}),e.jsxs("div",{children:[e.jsx("p",{className:"text-sm font-bold text-slate-900",children:(h==null?void 0:h.name)||"User"}),e.jsxs("p",{className:"text-xs text-slate-500 truncate max-w-[140px]",children:["@",(h==null?void 0:h.username)||"username"]})]})]}),e.jsx("button",{className:"w-full py-3 px-4 bg-[#1d2b3e] text-white font-semibold text-sm rounded-xl hover:translate-y-[-1px] transition-all duration-300 shadow-sm",children:"View Public Profile"})]})]})}const ze=({profile:a,user:t,saving:h,onUpdate:v,onUploadPhoto:E,onRemovePhoto:f})=>{var y,U,p,C;const[l,z]=j.useState(!1),[N,c]=j.useState({firstName:(a==null?void 0:a.firstName)||((y=t==null?void 0:t.name)==null?void 0:y.split(" ")[0])||"",lastName:(a==null?void 0:a.lastName)||((U=t==null?void 0:t.name)==null?void 0:U.split(" ").slice(1).join(" "))||"",dateOfBirth:a!=null&&a.dateOfBirth?new Date(a.dateOfBirth).toISOString().split("T")[0]:"",country:(a==null?void 0:a.country)||"",phoneNumber:(a==null?void 0:a.phoneNumber)||"",address:(a==null?void 0:a.address)||"",bio:(a==null?void 0:a.bio)||""}),w=j.useRef(null),P=m=>{c(i=>({...i,[m.target.name]:m.target.value}))},B=async()=>{const m=await v(N);m.success?(k.success(m.message),z(!1)):k.error(m.message)},G=()=>{var m,i;c({firstName:(a==null?void 0:a.firstName)||((m=t==null?void 0:t.name)==null?void 0:m.split(" ")[0])||"",lastName:(a==null?void 0:a.lastName)||((i=t==null?void 0:t.name)==null?void 0:i.split(" ").slice(1).join(" "))||"",dateOfBirth:a!=null&&a.dateOfBirth?new Date(a.dateOfBirth).toISOString().split("T")[0]:"",country:(a==null?void 0:a.country)||"",phoneNumber:(a==null?void 0:a.phoneNumber)||"",address:(a==null?void 0:a.address)||"",bio:(a==null?void 0:a.bio)||""}),z(!1)},u=async m=>{var r;const i=(r=m.target.files)==null?void 0:r[0];if(!i)return;if(i.size>5*1024*1024){k.error("File size must be less than 5MB");return}const n=await E(i);n.success?k.success(n.message):k.error(n.message)},g=async()=>{const m=await f();m.success?k.success(m.message):k.error(m.message)};return e.jsxs("div",{className:"section-container",children:[e.jsxs("div",{className:"section-header",children:[e.jsx("h2",{children:"Personal Information"}),l?e.jsxs("div",{className:"header-actions",children:[e.jsxs(S,{variant:"outline",onClick:G,disabled:h,children:[e.jsx(q,{size:16}),"Cancel"]}),e.jsxs(S,{onClick:B,disabled:h,className:"save-btn",children:[h?e.jsx($,{size:16,className:"animate-spin"}):e.jsx(H,{size:16}),"Save"]})]}):e.jsx(S,{variant:"outline",onClick:()=>z(!0),children:"Edit"})]}),e.jsxs("div",{className:"photo-section",children:[e.jsx("div",{className:"photo-container",children:t!=null&&t.imageUrl?e.jsx("img",{src:t.imageUrl,alt:t.name,className:"profile-photo"}):e.jsx("div",{className:"photo-placeholder",children:((C=(p=t==null?void 0:t.name)==null?void 0:p.charAt(0))==null?void 0:C.toUpperCase())||"U"})}),e.jsxs("div",{className:"photo-actions",children:[e.jsx("input",{ref:w,type:"file",accept:"image/jpeg,image/png,image/webp",onChange:u,className:"hidden-input"}),e.jsxs(S,{variant:"outline",size:"sm",onClick:()=>{var m;return(m=w.current)==null?void 0:m.click()},disabled:h,children:[e.jsx(ye,{size:16}),"Upload Photo"]}),(t==null?void 0:t.imageUrl)&&e.jsxs(S,{variant:"ghost",size:"sm",onClick:g,disabled:h,className:"remove-btn",children:[e.jsx(M,{size:16}),"Remove"]})]})]}),e.jsxs("div",{className:"form-grid",children:[e.jsxs("div",{className:"form-group",children:[e.jsx(d,{children:"First Name"}),e.jsx(x,{name:"firstName",value:N.firstName,onChange:P,disabled:!l,placeholder:"John"})]}),e.jsxs("div",{className:"form-group",children:[e.jsx(d,{children:"Last Name"}),e.jsx(x,{name:"lastName",value:N.lastName,onChange:P,disabled:!l,placeholder:"Doe"})]}),e.jsxs("div",{className:"form-group",children:[e.jsx(d,{children:"Email"}),e.jsx(x,{value:(t==null?void 0:t.email)||"",disabled:!0,className:"disabled-field"}),e.jsx("span",{className:"field-hint",children:"Email can be changed in Security settings"})]}),e.jsxs("div",{className:"form-group",children:[e.jsx(d,{children:"Username"}),e.jsx(x,{value:(t==null?void 0:t.username)||"",disabled:!0,className:"disabled-field"})]}),e.jsxs("div",{className:"form-group",children:[e.jsx(d,{children:"Date of Birth"}),e.jsx(x,{name:"dateOfBirth",type:"date",value:N.dateOfBirth,onChange:P,disabled:!l})]}),e.jsxs("div",{className:"form-group",children:[e.jsx(d,{children:"Country"}),e.jsx(x,{name:"country",value:N.country,onChange:P,disabled:!l,placeholder:"India"})]}),e.jsxs("div",{className:"form-group",children:[e.jsx(d,{children:"Phone Number"}),e.jsx(x,{name:"phoneNumber",value:N.phoneNumber,onChange:P,disabled:!l,placeholder:"+91 9876543210"})]}),e.jsxs("div",{className:"form-group full-width",children:[e.jsx(d,{children:"Address"}),e.jsx(x,{name:"address",value:N.address,onChange:P,disabled:!l,placeholder:"Your address"})]}),e.jsxs("div",{className:"form-group full-width",children:[e.jsx(d,{children:"Bio"}),e.jsx("textarea",{name:"bio",value:N.bio,onChange:P,disabled:!l,placeholder:"Tell us about yourself...",rows:3,className:"bio-textarea"})]})]}),e.jsx("style",{jsx:!0,children:`
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
          margin-bottom: 32px;
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
          gap: 12px;
        }

        .save-btn {
          background: #f97316;
          color: white;
        }

        .save-btn:hover {
          background: #ea580c;
        }

        .photo-section {
          display: flex;
          align-items: center;
          gap: 24px;
          margin-bottom: 32px;
          padding: 24px;
          background: #f8fafc;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
        }

        .photo-container {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          overflow: hidden;
          border: 3px solid #f97316;
          box-shadow: 0 4px 12px rgba(249, 115, 22, 0.2);
        }

        .profile-photo {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .photo-placeholder {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #f97316, #ea580c);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 36px;
          font-weight: 600;
          color: white;
        }

        .photo-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .hidden-input {
          display: none;
        }

        .remove-btn {
          color: #ef4444;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        .disabled-field {
          opacity: 0.6;
          cursor: not-allowed;
          background: #f1f5f9;
        }

        .field-hint {
          font-size: 12px;
          color: #64748b;
        }

        .bio-textarea {
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

        .bio-textarea:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          background: #f1f5f9;
        }

        .bio-textarea:focus {
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

          .photo-section {
            flex-direction: column;
            text-align: center;
          }
        }
      `})]})},te=["CBSE","ICSE","State Board","IB","Other"],Pe=["Science","Commerce","Arts","Other"],Ee=({profile:a,saving:t,onUpdateTenth:h,onUpdateTwelfth:v})=>{var p,C,m,i,n,r,b,F,O,V,L;const[E,f]=j.useState(!0),[l,z]=j.useState(!0),[N,c]=j.useState(!1),[w,P]=j.useState(!1),[B,G]=j.useState({percentage:((p=a==null?void 0:a.tenthGrade)==null?void 0:p.percentage)||"",cgpa:((C=a==null?void 0:a.tenthGrade)==null?void 0:C.cgpa)||"",board:((m=a==null?void 0:a.tenthGrade)==null?void 0:m.board)||"",year:((i=a==null?void 0:a.tenthGrade)==null?void 0:i.year)||"",school:((n=a==null?void 0:a.tenthGrade)==null?void 0:n.school)||""}),[u,g]=j.useState({percentage:((r=a==null?void 0:a.twelfthGrade)==null?void 0:r.percentage)||"",cgpa:((b=a==null?void 0:a.twelfthGrade)==null?void 0:b.cgpa)||"",board:((F=a==null?void 0:a.twelfthGrade)==null?void 0:F.board)||"",stream:((O=a==null?void 0:a.twelfthGrade)==null?void 0:O.stream)||"",year:((V=a==null?void 0:a.twelfthGrade)==null?void 0:V.year)||"",school:((L=a==null?void 0:a.twelfthGrade)==null?void 0:L.school)||""}),y=async()=>{const s=await h(B);s.success?(k.success(s.message),c(!1)):k.error(s.message)},U=async()=>{const s=await v(u);s.success?(k.success(s.message),P(!1)):k.error(s.message)};return e.jsxs("div",{className:"section-container",children:[e.jsx("div",{className:"section-header",children:e.jsx("h2",{children:"Education Details"})}),e.jsxs("div",{className:"education-card",children:[e.jsxs("div",{className:"card-header",onClick:()=>f(!E),children:[e.jsxs("div",{className:"card-title",children:[e.jsx("span",{className:"grade-badge",children:"10th"}),e.jsx("h3",{children:"10th Grade (Secondary)"})]}),e.jsxs("div",{className:"card-controls",children:[N?e.jsxs(e.Fragment,{children:[e.jsx(S,{variant:"ghost",size:"sm",onClick:s=>{s.stopPropagation(),c(!1)},disabled:t,children:e.jsx(q,{size:14})}),e.jsxs(S,{size:"sm",onClick:s=>{s.stopPropagation(),y()},disabled:t,className:"save-btn",children:[t?e.jsx($,{size:14,className:"animate-spin"}):e.jsx(H,{size:14}),"Save"]})]}):e.jsx(S,{variant:"ghost",size:"sm",onClick:s=>{s.stopPropagation(),c(!0)},children:"Edit"}),E?e.jsx(se,{size:20}):e.jsx(ae,{size:20})]})]}),E&&e.jsx("div",{className:"card-content",children:e.jsxs("div",{className:"form-grid",children:[e.jsxs("div",{className:"form-group",children:[e.jsx(d,{children:"Percentage"}),e.jsx(x,{type:"number",value:B.percentage,onChange:s=>G(o=>({...o,percentage:s.target.value})),disabled:!N,placeholder:"85.5",min:"0",max:"100"})]}),e.jsxs("div",{className:"form-group",children:[e.jsx(d,{children:"CGPA (out of 10)"}),e.jsx(x,{type:"number",value:B.cgpa,onChange:s=>G(o=>({...o,cgpa:s.target.value})),disabled:!N,placeholder:"9.2",min:"0",max:"10",step:"0.1"})]}),e.jsxs("div",{className:"form-group",children:[e.jsx(d,{children:"Board"}),e.jsxs("select",{value:B.board,onChange:s=>G(o=>({...o,board:s.target.value})),disabled:!N,className:"select-field",children:[e.jsx("option",{value:"",children:"Select Board"}),te.map(s=>e.jsx("option",{value:s,children:s},s))]})]}),e.jsxs("div",{className:"form-group",children:[e.jsx(d,{children:"Passing Year"}),e.jsx(x,{type:"number",value:B.year,onChange:s=>G(o=>({...o,year:s.target.value})),disabled:!N,placeholder:"2020",min:"1990",max:"2100"})]}),e.jsxs("div",{className:"form-group full-width",children:[e.jsx(d,{children:"School Name"}),e.jsx(x,{value:B.school,onChange:s=>G(o=>({...o,school:s.target.value})),disabled:!N,placeholder:"Your school name"})]})]})})]}),e.jsxs("div",{className:"education-card",children:[e.jsxs("div",{className:"card-header",onClick:()=>z(!l),children:[e.jsxs("div",{className:"card-title",children:[e.jsx("span",{className:"grade-badge twelfth",children:"12th"}),e.jsx("h3",{children:"12th Grade (Higher Secondary)"})]}),e.jsxs("div",{className:"card-controls",children:[w?e.jsxs(e.Fragment,{children:[e.jsx(S,{variant:"ghost",size:"sm",onClick:s=>{s.stopPropagation(),P(!1)},disabled:t,children:e.jsx(q,{size:14})}),e.jsxs(S,{size:"sm",onClick:s=>{s.stopPropagation(),U()},disabled:t,className:"save-btn",children:[t?e.jsx($,{size:14,className:"animate-spin"}):e.jsx(H,{size:14}),"Save"]})]}):e.jsx(S,{variant:"ghost",size:"sm",onClick:s=>{s.stopPropagation(),P(!0)},children:"Edit"}),l?e.jsx(se,{size:20}):e.jsx(ae,{size:20})]})]}),l&&e.jsx("div",{className:"card-content",children:e.jsxs("div",{className:"form-grid",children:[e.jsxs("div",{className:"form-group",children:[e.jsx(d,{children:"Percentage"}),e.jsx(x,{type:"number",value:u.percentage,onChange:s=>g(o=>({...o,percentage:s.target.value})),disabled:!w,placeholder:"85.5",min:"0",max:"100"})]}),e.jsxs("div",{className:"form-group",children:[e.jsx(d,{children:"CGPA (out of 10)"}),e.jsx(x,{type:"number",value:u.cgpa,onChange:s=>g(o=>({...o,cgpa:s.target.value})),disabled:!w,placeholder:"9.2",min:"0",max:"10",step:"0.1"})]}),e.jsxs("div",{className:"form-group",children:[e.jsx(d,{children:"Board"}),e.jsxs("select",{value:u.board,onChange:s=>g(o=>({...o,board:s.target.value})),disabled:!w,className:"select-field",children:[e.jsx("option",{value:"",children:"Select Board"}),te.map(s=>e.jsx("option",{value:s,children:s},s))]})]}),e.jsxs("div",{className:"form-group",children:[e.jsx(d,{children:"Stream"}),e.jsxs("select",{value:u.stream,onChange:s=>g(o=>({...o,stream:s.target.value})),disabled:!w,className:"select-field",children:[e.jsx("option",{value:"",children:"Select Stream"}),Pe.map(s=>e.jsx("option",{value:s,children:s},s))]})]}),e.jsxs("div",{className:"form-group",children:[e.jsx(d,{children:"Passing Year"}),e.jsx(x,{type:"number",value:u.year,onChange:s=>g(o=>({...o,year:s.target.value})),disabled:!w,placeholder:"2022",min:"1990",max:"2100"})]}),e.jsxs("div",{className:"form-group full-width",children:[e.jsx(d,{children:"School/College Name"}),e.jsx(x,{value:u.school,onChange:s=>g(o=>({...o,school:s.target.value})),disabled:!w,placeholder:"Your school/college name"})]})]})})]}),e.jsx("style",{jsx:!0,children:`
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

        .education-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 16px;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .card-header:hover {
          background: #f1f5f9;
        }

        .card-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .grade-badge {
          background: linear-gradient(135deg, #f97316, #ea580c);
          color: white;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
        }

        .grade-badge.twelfth {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
        }

        .card-title h3 {
          color: #1e293b;
          font-size: 16px;
          font-weight: 500;
          margin: 0;
        }

        .card-controls {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #64748b;
        }

        .save-btn {
          background: #f97316;
          color: white;
        }

        .card-content {
          padding: 20px;
          border-top: 1px solid #e2e8f0;
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

        .select-field {
          width: 100%;
          padding: 10px 12px;
          border-radius: 8px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          color: #1e293b;
          font-size: 14px;
          cursor: pointer;
        }

        .select-field:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          background: #f1f5f9;
        }

        .select-field:focus {
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
      `})]})},Le=[{value:"not_started",label:"Not Started"},{value:"pursuing",label:"Pursuing"},{value:"completed",label:"Completed"}],Ae=[{value:"not_applicable",label:"Not Applicable"},{value:"not_started",label:"Not Started"},{value:"pursuing",label:"Pursuing"},{value:"completed",label:"Completed"}],Be=({profile:a,saving:t,onUpdateUndergraduate:h,onUpdateGraduation:v})=>{var g,y,U,p,C,m,i,n,r,b,F,O,V,L,s,o,W,X,J,Q;const[E,f]=j.useState(!1),[l,z]=j.useState(!1),[N,c]=j.useState({status:((g=a==null?void 0:a.undergraduate)==null?void 0:g.status)||"not_started",courseName:((y=a==null?void 0:a.undergraduate)==null?void 0:y.courseName)||"",specialization:((U=a==null?void 0:a.undergraduate)==null?void 0:U.specialization)||"",collegeName:((p=a==null?void 0:a.undergraduate)==null?void 0:p.collegeName)||"",university:((C=a==null?void 0:a.undergraduate)==null?void 0:C.university)||"",startYear:((m=a==null?void 0:a.undergraduate)==null?void 0:m.startYear)||"",passoutYear:((i=a==null?void 0:a.undergraduate)==null?void 0:i.passoutYear)||"",expectedPassoutYear:((n=a==null?void 0:a.undergraduate)==null?void 0:n.expectedPassoutYear)||"",cgpa:((r=a==null?void 0:a.undergraduate)==null?void 0:r.cgpa)||"",percentage:((b=a==null?void 0:a.undergraduate)==null?void 0:b.percentage)||""}),[w,P]=j.useState({status:((F=a==null?void 0:a.graduation)==null?void 0:F.status)||"not_applicable",courseName:((O=a==null?void 0:a.graduation)==null?void 0:O.courseName)||"",specialization:((V=a==null?void 0:a.graduation)==null?void 0:V.specialization)||"",collegeName:((L=a==null?void 0:a.graduation)==null?void 0:L.collegeName)||"",university:((s=a==null?void 0:a.graduation)==null?void 0:s.university)||"",startYear:((o=a==null?void 0:a.graduation)==null?void 0:o.startYear)||"",passoutYear:((W=a==null?void 0:a.graduation)==null?void 0:W.passoutYear)||"",expectedPassoutYear:((X=a==null?void 0:a.graduation)==null?void 0:X.expectedPassoutYear)||"",cgpa:((J=a==null?void 0:a.graduation)==null?void 0:J.cgpa)||"",percentage:((Q=a==null?void 0:a.graduation)==null?void 0:Q.percentage)||""}),B=async()=>{const I=await h(N);I.success?(k.success(I.message),f(!1)):k.error(I.message)},G=async()=>{const I=await v(w);I.success?(k.success(I.message),z(!1)):k.error(I.message)},u=(I,Y,R,oe)=>{const Z=I.status==="pursuing",ee=I.status==="completed",de=Z||ee||I.status==="not_started";return e.jsxs("div",{className:"form-grid",children:[e.jsxs("div",{className:"form-group",children:[e.jsx(d,{children:"Status"}),e.jsx("select",{value:I.status,onChange:A=>Y(T=>({...T,status:A.target.value})),disabled:!R,className:"select-field",children:(oe==="grad"?Ae:Le).map(A=>e.jsx("option",{value:A.value,children:A.label},A.value))})]}),de&&I.status!=="not_applicable"&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"form-group",children:[e.jsx(d,{children:"Course/Degree Name"}),e.jsx(x,{value:I.courseName,onChange:A=>Y(T=>({...T,courseName:A.target.value})),disabled:!R,placeholder:"B.Tech, B.Sc, BBA..."})]}),e.jsxs("div",{className:"form-group",children:[e.jsx(d,{children:"Specialization"}),e.jsx(x,{value:I.specialization,onChange:A=>Y(T=>({...T,specialization:A.target.value})),disabled:!R,placeholder:"Computer Science, Electronics..."})]}),e.jsxs("div",{className:"form-group",children:[e.jsx(d,{children:"College Name"}),e.jsx(x,{value:I.collegeName,onChange:A=>Y(T=>({...T,collegeName:A.target.value})),disabled:!R,placeholder:"Your college name"})]}),e.jsxs("div",{className:"form-group",children:[e.jsx(d,{children:"University"}),e.jsx(x,{value:I.university,onChange:A=>Y(T=>({...T,university:A.target.value})),disabled:!R,placeholder:"University name"})]}),e.jsxs("div",{className:"form-group",children:[e.jsx(d,{children:"Start Year"}),e.jsx(x,{type:"number",value:I.startYear,onChange:A=>Y(T=>({...T,startYear:A.target.value})),disabled:!R,placeholder:"2022",min:"1990",max:"2100"})]}),Z&&e.jsxs("div",{className:"form-group",children:[e.jsx(d,{children:"Expected Passout Year"}),e.jsx(x,{type:"number",value:I.expectedPassoutYear,onChange:A=>Y(T=>({...T,expectedPassoutYear:A.target.value})),disabled:!R,placeholder:"2026",min:"1990",max:"2100"})]}),ee&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"form-group",children:[e.jsx(d,{children:"Passout Year"}),e.jsx(x,{type:"number",value:I.passoutYear,onChange:A=>Y(T=>({...T,passoutYear:A.target.value})),disabled:!R,placeholder:"2026",min:"1990",max:"2100"})]}),e.jsxs("div",{className:"form-group",children:[e.jsx(d,{children:"CGPA (out of 10)"}),e.jsx(x,{type:"number",value:I.cgpa,onChange:A=>Y(T=>({...T,cgpa:A.target.value})),disabled:!R,placeholder:"8.5",min:"0",max:"10",step:"0.1"})]}),e.jsxs("div",{className:"form-group",children:[e.jsx(d,{children:"Percentage"}),e.jsx(x,{type:"number",value:I.percentage,onChange:A=>Y(T=>({...T,percentage:A.target.value})),disabled:!R,placeholder:"85.5",min:"0",max:"100"})]})]})]})]})};return e.jsxs("div",{className:"section-container",children:[e.jsx("div",{className:"section-header",children:e.jsx("h2",{children:"Higher Education"})}),e.jsxs("div",{className:"education-card",children:[e.jsxs("div",{className:"card-header",children:[e.jsxs("div",{className:"card-title",children:[e.jsx("span",{className:"grade-badge ug",children:"UG"}),e.jsx("h3",{children:"Undergraduate"})]}),e.jsx("div",{className:"card-controls",children:E?e.jsxs(e.Fragment,{children:[e.jsxs(S,{variant:"ghost",size:"sm",onClick:()=>f(!1),disabled:t,children:[e.jsx(q,{size:14})," Cancel"]}),e.jsxs(S,{size:"sm",onClick:B,disabled:t,className:"save-btn",children:[t?e.jsx($,{size:14,className:"animate-spin"}):e.jsx(H,{size:14}),"Save"]})]}):e.jsx(S,{variant:"outline",size:"sm",onClick:()=>f(!0),children:"Edit"})})]}),e.jsx("div",{className:"card-content",children:u(N,c,E,"ug")})]}),e.jsxs("div",{className:"education-card",children:[e.jsxs("div",{className:"card-header",children:[e.jsxs("div",{className:"card-title",children:[e.jsx("span",{className:"grade-badge grad",children:"PG"}),e.jsx("h3",{children:"Post-Graduation"})]}),e.jsx("div",{className:"card-controls",children:l?e.jsxs(e.Fragment,{children:[e.jsxs(S,{variant:"ghost",size:"sm",onClick:()=>z(!1),disabled:t,children:[e.jsx(q,{size:14})," Cancel"]}),e.jsxs(S,{size:"sm",onClick:G,disabled:t,className:"save-btn",children:[t?e.jsx($,{size:14,className:"animate-spin"}):e.jsx(H,{size:14}),"Save"]})]}):e.jsx(S,{variant:"outline",size:"sm",onClick:()=>z(!0),children:"Edit"})})]}),e.jsx("div",{className:"card-content",children:u(w,P,l,"grad")})]}),e.jsx("style",{jsx:!0,children:`
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

        .education-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 16px;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid #e2e8f0;
        }

        .card-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .grade-badge {
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          color: white;
        }

        .grade-badge.ug {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
        }

        .grade-badge.grad {
          background: linear-gradient(135deg, #8b5cf6, #7c3aed);
        }

        .card-title h3 {
          color: #1e293b;
          font-size: 16px;
          font-weight: 500;
          margin: 0;
        }

        .card-controls {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .save-btn {
          background: #f97316;
          color: white;
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

        .select-field {
          width: 100%;
          padding: 10px 12px;
          border-radius: 8px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          color: #1e293b;
          font-size: 14px;
        }

        .select-field:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          background: #f1f5f9;
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
      `})]})},Ue={company:"",role:"",startDate:"",endDate:"",isCurrent:!1,description:"",location:""},Ie=({profile:a,saving:t,onUpdate:h})=>{const[v,E]=j.useState((a==null?void 0:a.experience)||[]),[f,l]=j.useState(!1),[z,N]=j.useState(!1),c=()=>{E(u=>[{...Ue},...u]),l(!0),N(!0)},w=u=>{E(g=>g.filter((y,U)=>U!==u)),N(!0)},P=(u,g,y)=>{E(U=>U.map((p,C)=>C===u?{...p,[g]:y}:p)),N(!0)},B=async()=>{const u=v.filter(y=>y.company&&y.role),g=await h(u);g.success?(k.success(g.message),l(!1),N(!1)):k.error(g.message)},G=()=>{E((a==null?void 0:a.experience)||[]),l(!1),N(!1)};return e.jsxs("div",{className:"section-container",children:[e.jsxs("div",{className:"section-header",children:[e.jsx("h2",{children:"Work Experience"}),e.jsxs("div",{className:"header-actions",children:[z&&e.jsxs(e.Fragment,{children:[e.jsxs(S,{variant:"outline",onClick:G,disabled:t,children:[e.jsx(q,{size:16})," Cancel"]}),e.jsxs(S,{onClick:B,disabled:t,className:"save-btn",children:[t?e.jsx($,{size:16,className:"animate-spin"}):e.jsx(H,{size:16}),"Save Changes"]})]}),e.jsxs(S,{variant:"outline",onClick:c,children:[e.jsx(K,{size:16})," Add Experience"]})]})]}),v.length===0?e.jsxs("div",{className:"empty-state",children:[e.jsx(ne,{size:48}),e.jsx("h3",{children:"No Experience Added"}),e.jsx("p",{children:"Add your work experience to showcase your professional journey"}),e.jsxs(S,{onClick:c,children:[e.jsx(K,{size:16})," Add Your First Experience"]})]}):e.jsx("div",{className:"experience-list",children:v.map((u,g)=>e.jsxs("div",{className:"experience-card",children:[e.jsxs("div",{className:"card-header",children:[e.jsx("div",{className:"card-number",children:g+1}),e.jsx(S,{variant:"ghost",size:"sm",className:"remove-btn",onClick:()=>w(g),children:e.jsx(M,{size:16})})]}),e.jsx("div",{className:"card-content",children:e.jsxs("div",{className:"form-grid",children:[e.jsxs("div",{className:"form-group",children:[e.jsx(d,{children:"Company Name *"}),e.jsx(x,{value:u.company,onChange:y=>P(g,"company",y.target.value),placeholder:"Google, Microsoft..."})]}),e.jsxs("div",{className:"form-group",children:[e.jsx(d,{children:"Role/Position *"}),e.jsx(x,{value:u.role,onChange:y=>P(g,"role",y.target.value),placeholder:"Software Engineer"})]}),e.jsxs("div",{className:"form-group",children:[e.jsx(d,{children:"Start Date"}),e.jsx(x,{type:"date",value:u.startDate?new Date(u.startDate).toISOString().split("T")[0]:"",onChange:y=>P(g,"startDate",y.target.value)})]}),e.jsxs("div",{className:"form-group",children:[e.jsx(d,{children:"End Date"}),e.jsx(x,{type:"date",value:u.endDate?new Date(u.endDate).toISOString().split("T")[0]:"",onChange:y=>P(g,"endDate",y.target.value),disabled:u.isCurrent})]}),e.jsx("div",{className:"form-group checkbox-group",children:e.jsxs("label",{className:"checkbox-label",children:[e.jsx("input",{type:"checkbox",checked:u.isCurrent,onChange:y=>P(g,"isCurrent",y.target.checked)}),e.jsx("span",{children:"Currently Working Here"})]})}),e.jsxs("div",{className:"form-group",children:[e.jsx(d,{children:"Location"}),e.jsx(x,{value:u.location,onChange:y=>P(g,"location",y.target.value),placeholder:"New Delhi, India"})]}),e.jsxs("div",{className:"form-group full-width",children:[e.jsx(d,{children:"Description"}),e.jsx("textarea",{value:u.description,onChange:y=>P(g,"description",y.target.value),placeholder:"Describe your responsibilities and achievements...",rows:3,className:"description-textarea"})]})]})})]},g))}),e.jsx("style",{jsx:!0,children:`
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
      `})]})},Ge=({profile:a,saving:t,onUpdate:h})=>{var G,u,g,y,U;const[v,E]=j.useState(!1),[f,l]=j.useState({github:((G=a==null?void 0:a.socialLinks)==null?void 0:G.github)||"",linkedin:((u=a==null?void 0:a.socialLinks)==null?void 0:u.linkedin)||"",portfolio:((g=a==null?void 0:a.socialLinks)==null?void 0:g.portfolio)||"",twitter:((y=a==null?void 0:a.socialLinks)==null?void 0:y.twitter)||"",customLinks:((U=a==null?void 0:a.socialLinks)==null?void 0:U.customLinks)||[]}),z=(p,C)=>{l(m=>({...m,[p]:C}))},N=()=>{l(p=>({...p,customLinks:[...p.customLinks,{name:"",url:""}]}))},c=(p,C,m)=>{l(i=>({...i,customLinks:i.customLinks.map((n,r)=>r===p?{...n,[C]:m}:n)}))},w=p=>{l(C=>({...C,customLinks:C.customLinks.filter((m,i)=>i!==p)}))},P=async()=>{const p=/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/,C=n=>!n||n===""||p.test(n);if(!C(f.github)||!C(f.linkedin)||!C(f.portfolio)||!C(f.twitter)){k.error("Please enter valid URLs");return}const m=f.customLinks.filter(n=>n.name&&n.url),i=await h({...f,customLinks:m});i.success?(k.success(i.message),E(!1)):k.error(i.message)},B=()=>{var p,C,m,i,n;l({github:((p=a==null?void 0:a.socialLinks)==null?void 0:p.github)||"",linkedin:((C=a==null?void 0:a.socialLinks)==null?void 0:C.linkedin)||"",portfolio:((m=a==null?void 0:a.socialLinks)==null?void 0:m.portfolio)||"",twitter:((i=a==null?void 0:a.socialLinks)==null?void 0:i.twitter)||"",customLinks:((n=a==null?void 0:a.socialLinks)==null?void 0:n.customLinks)||[]}),E(!1)};return e.jsxs("div",{className:"section-container",children:[e.jsxs("div",{className:"section-header",children:[e.jsx("h2",{children:"Social Links"}),v?e.jsxs("div",{className:"header-actions",children:[e.jsxs(S,{variant:"outline",onClick:B,disabled:t,children:[e.jsx(q,{size:16})," Cancel"]}),e.jsxs(S,{onClick:P,disabled:t,className:"save-btn",children:[t?e.jsx($,{size:16,className:"animate-spin"}):e.jsx(H,{size:16}),"Save"]})]}):e.jsx(S,{variant:"outline",onClick:()=>E(!0),children:"Edit"})]}),e.jsxs("div",{className:"links-grid",children:[e.jsxs("div",{className:"link-card",children:[e.jsx("div",{className:"link-icon github",children:e.jsx(be,{size:24})}),e.jsxs("div",{className:"link-content",children:[e.jsx(d,{children:"GitHub"}),e.jsx(x,{value:f.github,onChange:p=>z("github",p.target.value),disabled:!v,placeholder:"https://github.com/username"})]})]}),e.jsxs("div",{className:"link-card",children:[e.jsx("div",{className:"link-icon linkedin",children:e.jsx(je,{size:24})}),e.jsxs("div",{className:"link-content",children:[e.jsx(d,{children:"LinkedIn"}),e.jsx(x,{value:f.linkedin,onChange:p=>z("linkedin",p.target.value),disabled:!v,placeholder:"https://linkedin.com/in/username"})]})]}),e.jsxs("div",{className:"link-card",children:[e.jsx("div",{className:"link-icon portfolio",children:e.jsx(ve,{size:24})}),e.jsxs("div",{className:"link-content",children:[e.jsx(d,{children:"Portfolio / Website"}),e.jsx(x,{value:f.portfolio,onChange:p=>z("portfolio",p.target.value),disabled:!v,placeholder:"https://yourwebsite.com"})]})]}),e.jsxs("div",{className:"link-card",children:[e.jsx("div",{className:"link-icon twitter",children:e.jsx("span",{style:{fontSize:"20px",fontWeight:"bold"},children:"𝕏"})}),e.jsxs("div",{className:"link-content",children:[e.jsx(d,{children:"Twitter / X"}),e.jsx(x,{value:f.twitter,onChange:p=>z("twitter",p.target.value),disabled:!v,placeholder:"https://twitter.com/username"})]})]})]}),e.jsxs("div",{className:"custom-links-section",children:[e.jsxs("div",{className:"custom-links-header",children:[e.jsx("h3",{children:"Custom Links"}),v&&e.jsxs(S,{variant:"outline",size:"sm",onClick:N,children:[e.jsx(K,{size:16})," Add Link"]})]}),f.customLinks.length===0?e.jsxs("div",{className:"empty-custom",children:[e.jsx(ie,{size:20}),e.jsx("span",{children:"No custom links added"})]}):e.jsx("div",{className:"custom-links-list",children:f.customLinks.map((p,C)=>e.jsxs("div",{className:"custom-link-row",children:[e.jsxs("div",{className:"custom-link-inputs",children:[e.jsx(x,{value:p.name,onChange:m=>c(C,"name",m.target.value),disabled:!v,placeholder:"Link Name",className:"name-input"}),e.jsx(x,{value:p.url,onChange:m=>c(C,"url",m.target.value),disabled:!v,placeholder:"https://...",className:"url-input"})]}),v&&e.jsx(S,{variant:"ghost",size:"sm",className:"remove-btn",onClick:()=>w(C),children:e.jsx(M,{size:16})})]},C))})]}),e.jsx("style",{jsx:!0,children:`
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
      `})]})},Te=({user:a,saving:t,onToggleNewsletter:h})=>{const[v,E]=j.useState((a==null?void 0:a.newsletter)||!1),[f,l]=j.useState(!1),z=async()=>{const N=!v;l(!0);const c=await h(N);c.success?(E(N),k.success(c.message)):k.error(c.message),l(!1)};return e.jsxs("div",{className:"section-container",children:[e.jsx("div",{className:"section-header",children:e.jsx("h2",{children:"Notification Settings"})}),e.jsxs("div",{className:"settings-list",children:[e.jsxs("div",{className:"setting-card",children:[e.jsx("div",{className:"setting-icon",children:e.jsx(ce,{size:24})}),e.jsxs("div",{className:"setting-content",children:[e.jsx("h3",{children:"Newsletter Subscription"}),e.jsx("p",{children:"Receive weekly updates about new features, career tips, and opportunities."})]}),e.jsx("div",{className:"setting-action",children:e.jsx("button",{className:`toggle-btn ${v?"active":""}`,onClick:z,disabled:f||t,children:f?e.jsx($,{size:16,className:"animate-spin"}):e.jsx("span",{className:"toggle-track",children:e.jsx("span",{className:"toggle-thumb"})})})})]}),e.jsxs("div",{className:"setting-card",children:[e.jsx("div",{className:"setting-icon bell",children:e.jsx(re,{size:24})}),e.jsxs("div",{className:"setting-content",children:[e.jsx("h3",{children:"Email Notifications"}),e.jsx("p",{children:"Receive email alerts for important account activities and security updates."})]}),e.jsx("div",{className:"setting-action",children:e.jsx("span",{className:"always-on-badge",children:"Always On"})})]})]}),e.jsxs("div",{className:"info-card",children:[e.jsx("h4",{children:"📧 Email Preferences"}),e.jsx("p",{children:"We respect your privacy. You can unsubscribe from promotional emails at any time. Essential security and account-related emails cannot be disabled."})]}),e.jsx("style",{jsx:!0,children:`
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
      `})]})},De=({user:a})=>{const{logout:t,setToken:h}=ge(),[v,E]=j.useState(!1),[f,l]=j.useState("request"),[z,N]=j.useState(""),[c,w]=j.useState(""),[P,B]=j.useState(!1),[G,u]=j.useState(!1),[g,y]=j.useState(""),[U,p]=j.useState(""),[C,m]=j.useState(!1),[i,n]=j.useState(!1),r=xe(),b=async()=>{var L,s;if(!z){k.error("Please enter a new email address");return}if(z===(a==null?void 0:a.email)){k.error("New email must be different from current email");return}B(!0);try{(await D.post(`${_.API_BASE_URL}/auth/request-email-change`,{newEmail:z},{headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}})).data.success&&(k.success("Verification code sent to the new email"),l("verify"))}catch(o){k.error(((s=(L=o.response)==null?void 0:L.data)==null?void 0:s.message)||"Failed to send verification code")}finally{B(!1)}},F=async()=>{var L,s;if(!c){k.error("Please enter the verification code");return}B(!0);try{const o=await D.post(`${_.API_BASE_URL}/auth/verify-email-change`,{newEmail:z,otp:c},{headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}});o.data.success&&(k.success("Email changed successfully"),o.data.token&&(localStorage.setItem("token",o.data.token),h(o.data.token)),E(!1),l("request"),N(""),w(""),window.location.reload())}catch(o){k.error(((s=(L=o.response)==null?void 0:L.data)==null?void 0:s.message)||"Verification failed")}finally{B(!1)}},O=async()=>{var L;n(!0);try{(await D.post(`${_.API_BASE_URL}/auth/forgot-password`,{email:a==null?void 0:a.email})).data.success&&(k.success("Verification code sent to your email"),r("/change-password",{state:{email:a==null?void 0:a.email}}))}catch(s){const o=(L=s.response)==null?void 0:L.data,W=(o==null?void 0:o.message)||s.message||"Failed to send verification code",X=o!=null&&o.errorCode?` [Code: ${o.errorCode}]`:"";k.error(`${W}${X}`)}finally{n(!1)}},V=async()=>{var L,s;if(U!=="DELETE"){k.error("Please type DELETE to confirm");return}if((a==null?void 0:a.authProvider)!=="google"&&!g){k.error("Please enter your password");return}m(!0);try{(await D.delete(`${_.API_BASE_URL}/auth/delete-account`,{data:{password:g,confirmDelete:U},headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}})).data.success&&(k.success("Account deleted successfully"),t())}catch(o){k.error(((s=(L=o.response)==null?void 0:L.data)==null?void 0:s.message)||"Failed to delete account")}finally{m(!1)}};return e.jsxs("div",{className:"section-container",children:[e.jsx("div",{className:"section-header",children:e.jsx("h2",{children:"Security & Privacy"})}),e.jsxs("div",{className:"settings-list",children:[e.jsxs("div",{className:"setting-card",children:[e.jsx("div",{className:"setting-icon email",children:e.jsx(ce,{size:24})}),e.jsxs("div",{className:"setting-content",children:[e.jsx("h3",{children:"Change Email Address"}),e.jsxs("p",{children:["Current: ",e.jsx("strong",{children:a==null?void 0:a.email})]})]}),e.jsx(S,{variant:"outline",onClick:()=>E(!v),children:v?"Cancel":"Change Email"})]}),v&&e.jsx("div",{className:"email-change-form",children:f==="request"?e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"form-group",children:[e.jsx(d,{children:"New Email Address"}),e.jsx(x,{type:"email",value:z,onChange:L=>N(L.target.value),placeholder:"Enter new email address"})]}),e.jsxs(S,{onClick:b,disabled:P,className:"primary-btn",children:[P?e.jsx($,{size:16,className:"animate-spin"}):null,"Send Verification Code"]})]}):e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"info-box",children:e.jsxs("p",{children:["A verification code has been sent to ",e.jsx("strong",{children:z}),". Please check your inbox."]})}),e.jsxs("div",{className:"form-group",children:[e.jsx(d,{children:"Verification Code"}),e.jsx(x,{type:"text",value:c,onChange:L=>w(L.target.value),placeholder:"Enter 6-digit code",maxLength:6})]}),e.jsxs("div",{className:"form-actions",children:[e.jsx(S,{variant:"outline",onClick:()=>l("request"),children:"Back"}),e.jsxs(S,{onClick:F,disabled:P,className:"primary-btn",children:[P?e.jsx($,{size:16,className:"animate-spin"}):null,"Verify & Change Email"]})]})]})}),e.jsxs("div",{className:"setting-card",children:[e.jsx("div",{className:"setting-icon password",children:e.jsx(Ne,{size:24})}),e.jsxs("div",{className:"setting-content",children:[e.jsx("h3",{children:"Change Password"}),e.jsx("p",{children:"Update your password regularly for security"})]}),e.jsx(S,{className:"bg-[#6366F1] hover:bg-[#4F46E5] text-white transition-all duration-200",onClick:O,disabled:i,children:i?e.jsx($,{size:16,className:"animate-spin"}):"Change Password"})]}),e.jsxs("div",{className:"setting-card danger",children:[e.jsx("div",{className:"setting-icon delete",children:e.jsx(M,{size:24})}),e.jsxs("div",{className:"setting-content",children:[e.jsx("h3",{children:"Delete Account"}),e.jsx("p",{children:"Permanently delete your account and all data"})]}),e.jsx(S,{variant:"destructive",onClick:()=>u(!G),children:G?"Cancel":"Delete Account"})]}),G&&e.jsxs("div",{className:"delete-confirm-form",children:[e.jsxs("div",{className:"warning-box",children:[e.jsx(we,{size:24}),e.jsxs("div",{children:[e.jsx("h4",{children:"This action is irreversible!"}),e.jsx("p",{children:"All your data including profile, education details, experience, projects, and certifications will be permanently deleted."})]})]}),(a==null?void 0:a.authProvider)!=="google"&&e.jsxs("div",{className:"form-group",children:[e.jsx(d,{children:"Enter your password to confirm"}),e.jsx(x,{type:"password",value:g,onChange:L=>y(L.target.value),placeholder:"Your password"})]}),e.jsxs("div",{className:"form-group",children:[e.jsxs(d,{children:["Type ",e.jsx("strong",{children:"DELETE"})," to confirm"]}),e.jsx(x,{value:U,onChange:L=>p(L.target.value.toUpperCase()),placeholder:"Type DELETE"})]}),e.jsxs(S,{variant:"destructive",onClick:V,disabled:C||U!=="DELETE",className:"delete-btn",children:[C?e.jsx($,{size:16,className:"animate-spin"}):e.jsx(M,{size:16}),"Permanently Delete My Account"]})]})]}),e.jsx("style",{jsx:!0,children:`
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
      `})]})},ia=()=>{const[a,t]=j.useState("personal"),{profile:h,user:v,loading:E,error:f,saving:l,updatePersonalInfo:z,updateTenthGrade:N,updateTwelfthGrade:c,updateUndergraduate:w,updateGraduation:P,updateExperience:B,updateSocialLinks:G,uploadPhoto:u,removePhoto:g,toggleNewsletter:y}=ke(),U=()=>{switch(a){case"personal":return e.jsx(ze,{profile:h,user:v,saving:l,onUpdate:z,onUploadPhoto:u,onRemovePhoto:g});case"education":return e.jsx(Ee,{profile:h,saving:l,onUpdateTenth:N,onUpdateTwelfth:c});case"higher-education":return e.jsx(Be,{profile:h,saving:l,onUpdateUndergraduate:w,onUpdateGraduation:P});case"experience":return e.jsx(Ie,{profile:h,saving:l,onUpdate:B});case"social-links":return e.jsx(Ge,{profile:h,saving:l,onUpdate:G});case"notifications":return e.jsx(Te,{user:v,saving:l,onToggleNewsletter:y});case"security":return e.jsx(De,{user:v});default:return null}};return E?e.jsxs("div",{className:"loading-container",children:[e.jsx($,{size:48,className:"animate-spin"}),e.jsx("p",{children:"Loading your profile..."})]}):f?e.jsxs("div",{className:"error-container",children:[e.jsx("h2",{children:"Error Loading Profile"}),e.jsx("p",{children:f})]}):e.jsxs("div",{className:"profile-page",children:[e.jsx(fe,{position:"top-right"}),e.jsx(Se,{activeSection:a,onSectionChange:t,user:v}),e.jsx("main",{className:"profile-content",children:U()}),e.jsx("style",{jsx:!0,children:`
        .profile-page {
          display: flex;
          min-height: 100vh;
          background: #f8fafc;
        }

        .profile-content {
          flex: 1;
          min-height: 100vh;
          overflow-y: auto;
          background: #f8fafc;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: #f8fafc;
          color: #f97316;
        }

        .loading-container p {
          margin-top: 16px;
          color: #64748b;
        }

        .error-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: #f8fafc;
          color: #1e293b;
        }

        .error-container h2 {
          color: #ef4444;
          margin-bottom: 8px;
        }

        .error-container p {
          color: #64748b;
        }

        @media (max-width: 768px) {
          .profile-page {
            flex-direction: column;
          }

          .profile-content {
            min-height: auto;
          }
        }
      `})]})};export{ia as default};
