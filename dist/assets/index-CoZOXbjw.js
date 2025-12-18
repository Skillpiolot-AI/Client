import{c as le,r as b,f as _,a as F,j as e,h as he,B as me,d as ne,X as O,L as $,C as ae,i as ge}from"./index-BAlrBGp4.js";import{G as xe}from"./graduation-cap-BUyYKOdp.js";import{L as ie}from"./link-2-BS65qm5T.js";import{B as re}from"./bell-DG4y6qsb.js";import{S as ue}from"./shield-DLfCY4lR.js";import{B as k}from"./button-EhQ-ccGA.js";import{I as x}from"./input-BpoRsO7q.js";import{L as d}from"./label-DBz4JW7Q.js";import{n as C,F as pe}from"./index-DrlY-eN8.js";import{S as H}from"./save-DHza2hf9.js";import{T as M}from"./trash-2-D44PZXci.js";import{C as se}from"./chevron-up-C1gc7Z14.js";import{P as W}from"./plus-BVpr_9Ti.js";import{G as fe,L as be}from"./linkedin-BPMMESlP.js";import{G as je}from"./globe-BlpWJMlc.js";import{M as oe}from"./mail-D71hmLHa.js";import{K as ve}from"./key-92H2EWBd.js";import{T as we}from"./triangle-alert-uW1tfQzF.js";import"./index-DKBmZfRQ.js";import"./clsx-B-dksMZM.js";import"./index-DwJcq4Z8.js";/**
 * @license lucide-react v0.437.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ne=le("Camera",[["path",{d:"M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z",key:"1tc9qg"}],["circle",{cx:"12",cy:"13",r:"3",key:"1vg3eu"}]]),ye=()=>{const[a,s]=b.useState(null),[m,j]=b.useState(null),[E,f]=b.useState(!0),[l,S]=b.useState(null),[v,c]=b.useState(!1),w=b.useCallback(async()=>{var r,t;try{f(!0),S(null);const o=await _.get(`${F.API_BASE_URL}/profile/me`,{headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}});o.data.success&&(s(o.data.profile),j(o.data.profile.user))}catch(o){console.error("Error fetching profile:",o),S(((t=(r=o.response)==null?void 0:r.data)==null?void 0:t.message)||"Failed to load profile")}finally{f(!1)}},[]);return b.useEffect(()=>{w()},[w]),{profile:a,user:m,loading:E,error:l,saving:v,refetch:w,updatePersonalInfo:async r=>{var t,o;c(!0);try{if((await _.put(`${F.API_BASE_URL}/profile/personal`,r,{headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}})).data.success)return await w(),{success:!0,message:"Personal information updated"}}catch(i){return{success:!1,message:((o=(t=i.response)==null?void 0:t.data)==null?void 0:o.message)||"Failed to update"}}finally{c(!1)}},updateTenthGrade:async r=>{var t,o;c(!0);try{if((await _.put(`${F.API_BASE_URL}/profile/education/tenth`,r,{headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}})).data.success)return await w(),{success:!0,message:"10th grade details updated"}}catch(i){return{success:!1,message:((o=(t=i.response)==null?void 0:t.data)==null?void 0:o.message)||"Failed to update"}}finally{c(!1)}},updateTwelfthGrade:async r=>{var t,o;c(!0);try{if((await _.put(`${F.API_BASE_URL}/profile/education/twelfth`,r,{headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}})).data.success)return await w(),{success:!0,message:"12th grade details updated"}}catch(i){return{success:!1,message:((o=(t=i.response)==null?void 0:t.data)==null?void 0:o.message)||"Failed to update"}}finally{c(!1)}},updateUndergraduate:async r=>{var t,o;c(!0);try{if((await _.put(`${F.API_BASE_URL}/profile/education/undergraduate`,r,{headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}})).data.success)return await w(),{success:!0,message:"Undergraduate details updated"}}catch(i){return{success:!1,message:((o=(t=i.response)==null?void 0:t.data)==null?void 0:o.message)||"Failed to update"}}finally{c(!1)}},updateGraduation:async r=>{var t,o;c(!0);try{if((await _.put(`${F.API_BASE_URL}/profile/education/graduation`,r,{headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}})).data.success)return await w(),{success:!0,message:"Graduation details updated"}}catch(i){return{success:!1,message:((o=(t=i.response)==null?void 0:t.data)==null?void 0:o.message)||"Failed to update"}}finally{c(!1)}},updateExperience:async r=>{var t,o;c(!0);try{if((await _.put(`${F.API_BASE_URL}/profile/experience`,{experience:r},{headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}})).data.success)return await w(),{success:!0,message:"Experience updated"}}catch(i){return{success:!1,message:((o=(t=i.response)==null?void 0:t.data)==null?void 0:o.message)||"Failed to update"}}finally{c(!1)}},updateSocialLinks:async r=>{var t,o;c(!0);try{if((await _.put(`${F.API_BASE_URL}/profile/social-links`,r,{headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}})).data.success)return await w(),{success:!0,message:"Social links updated"}}catch(i){return{success:!1,message:((o=(t=i.response)==null?void 0:t.data)==null?void 0:o.message)||"Failed to update"}}finally{c(!1)}},uploadPhoto:async r=>{var t,o;c(!0);try{const i=new FormData;i.append("photo",r);const D=await _.post(`${F.API_BASE_URL}/profile/photo`,i,{headers:{Authorization:`Bearer ${localStorage.getItem("token")}`,"Content-Type":"multipart/form-data"}});if(D.data.success)return await w(),{success:!0,message:"Photo uploaded",imageUrl:D.data.imageUrl}}catch(i){return{success:!1,message:((o=(t=i.response)==null?void 0:t.data)==null?void 0:o.message)||"Failed to upload photo"}}finally{c(!1)}},removePhoto:async()=>{var r,t;c(!0);try{if((await _.delete(`${F.API_BASE_URL}/profile/photo`,{headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}})).data.success)return await w(),{success:!0,message:"Photo removed"}}catch(o){return{success:!1,message:((t=(r=o.response)==null?void 0:r.data)==null?void 0:t.message)||"Failed to remove photo"}}finally{c(!1)}},toggleNewsletter:async r=>{var t,o;c(!0);try{const i=await _.put(`${F.API_BASE_URL}/auth/newsletter`,{newsletter:r},{headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}});if(i.data.success)return await w(),{success:!0,message:i.data.message}}catch(i){return{success:!1,message:((o=(t=i.response)==null?void 0:t.data)==null?void 0:o.message)||"Failed to update"}}finally{c(!1)}}}},ke=[{id:"personal",label:"Personal Information",icon:he},{id:"education",label:"Education (10th & 12th)",icon:xe},{id:"higher-education",label:"Higher Education",icon:me},{id:"experience",label:"Experience",icon:ne},{id:"social-links",label:"Social Links",icon:ie},{id:"notifications",label:"Notifications",icon:re},{id:"security",label:"Security & Privacy",icon:ue}],Ce=({activeSection:a,onSectionChange:s,user:m})=>{var j,E;return e.jsxs("div",{className:"profile-sidebar",children:[e.jsx("div",{className:"sidebar-header",children:e.jsxs("div",{className:"user-preview",children:[e.jsx("div",{className:"avatar-container",children:m!=null&&m.imageUrl?e.jsx("img",{src:m.imageUrl,alt:m.name,className:"user-avatar"}):e.jsx("div",{className:"avatar-placeholder",children:((E=(j=m==null?void 0:m.name)==null?void 0:j.charAt(0))==null?void 0:E.toUpperCase())||"U"})}),e.jsxs("div",{className:"user-info",children:[e.jsx("h3",{children:(m==null?void 0:m.name)||"User"}),e.jsxs("p",{children:["@",(m==null?void 0:m.username)||"username"]})]})]})}),e.jsx("nav",{className:"sidebar-nav",children:ke.map(f=>{const l=f.icon,S=a===f.id;return e.jsxs("button",{className:`nav-item ${S?"active":""}`,onClick:()=>s(f.id),children:[e.jsx(l,{size:20}),e.jsx("span",{children:f.label})]},f.id)})}),e.jsx("style",{jsx:!0,children:`
        .profile-sidebar {
          width: 280px;
          min-height: 100vh;
          background: #ffffff;
          border-right: 1px solid #e2e8f0;
          padding: 0;
          position: sticky;
          top: 0;
          box-shadow: 2px 0 8px rgba(0, 0, 0, 0.04);
        }

        .sidebar-header {
          padding: 24px 20px;
          border-bottom: 1px solid #e2e8f0;
          background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
        }

        .user-preview {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .avatar-container {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          overflow: hidden;
          border: 3px solid rgba(255, 255, 255, 0.9);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }

        .user-avatar {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .avatar-placeholder {
          width: 100%;
          height: 100%;
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          font-weight: 600;
          color: #f97316;
        }

        .user-info h3 {
          color: white;
          font-size: 15px;
          font-weight: 600;
          margin: 0 0 2px 0;
        }

        .user-info p {
          color: rgba(255, 255, 255, 0.85);
          font-size: 13px;
          margin: 0;
        }

        .sidebar-nav {
          padding: 12px 0;
        }

        .nav-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 24px;
          background: transparent;
          border: none;
          color: #64748b;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
          border-left: 3px solid transparent;
        }

        .nav-item:hover {
          background: #f8fafc;
          color: #1e293b;
        }

        .nav-item.active {
          background: #fff7ed;
          color: #ea580c;
          border-left-color: #f97316;
          font-weight: 600;
        }

        .nav-item svg {
          flex-shrink: 0;
        }

        @media (max-width: 768px) {
          .profile-sidebar {
            width: 100%;
            min-height: auto;
            position: relative;
            border-right: none;
            border-bottom: 1px solid #e2e8f0;
          }

          .sidebar-nav {
            display: flex;
            overflow-x: auto;
            padding: 8px;
            gap: 4px;
          }

          .nav-item {
            padding: 10px 16px;
            border-left: none;
            border-bottom: 2px solid transparent;
            white-space: nowrap;
            flex-shrink: 0;
          }

          .nav-item.active {
            border-left-color: transparent;
            border-bottom-color: #f97316;
          }

          .nav-item span {
            display: none;
          }
        }
      `})]})},Se=({profile:a,user:s,saving:m,onUpdate:j,onUploadPhoto:E,onRemovePhoto:f})=>{var N,U,p,y;const[l,S]=b.useState(!1),[v,c]=b.useState({firstName:(a==null?void 0:a.firstName)||((N=s==null?void 0:s.name)==null?void 0:N.split(" ")[0])||"",lastName:(a==null?void 0:a.lastName)||((U=s==null?void 0:s.name)==null?void 0:U.split(" ").slice(1).join(" "))||"",dateOfBirth:a!=null&&a.dateOfBirth?new Date(a.dateOfBirth).toISOString().split("T")[0]:"",country:(a==null?void 0:a.country)||"",phoneNumber:(a==null?void 0:a.phoneNumber)||"",address:(a==null?void 0:a.address)||"",bio:(a==null?void 0:a.bio)||""}),w=b.useRef(null),z=h=>{c(r=>({...r,[h.target.name]:h.target.value}))},A=async()=>{const h=await j(v);h.success?(C.success(h.message),S(!1)):C.error(h.message)},I=()=>{var h,r;c({firstName:(a==null?void 0:a.firstName)||((h=s==null?void 0:s.name)==null?void 0:h.split(" ")[0])||"",lastName:(a==null?void 0:a.lastName)||((r=s==null?void 0:s.name)==null?void 0:r.split(" ").slice(1).join(" "))||"",dateOfBirth:a!=null&&a.dateOfBirth?new Date(a.dateOfBirth).toISOString().split("T")[0]:"",country:(a==null?void 0:a.country)||"",phoneNumber:(a==null?void 0:a.phoneNumber)||"",address:(a==null?void 0:a.address)||"",bio:(a==null?void 0:a.bio)||""}),S(!1)},u=async h=>{var o;const r=(o=h.target.files)==null?void 0:o[0];if(!r)return;if(r.size>5*1024*1024){C.error("File size must be less than 5MB");return}const t=await E(r);t.success?C.success(t.message):C.error(t.message)},g=async()=>{const h=await f();h.success?C.success(h.message):C.error(h.message)};return e.jsxs("div",{className:"section-container",children:[e.jsxs("div",{className:"section-header",children:[e.jsx("h2",{children:"Personal Information"}),l?e.jsxs("div",{className:"header-actions",children:[e.jsxs(k,{variant:"outline",onClick:I,disabled:m,children:[e.jsx(O,{size:16}),"Cancel"]}),e.jsxs(k,{onClick:A,disabled:m,className:"save-btn",children:[m?e.jsx($,{size:16,className:"animate-spin"}):e.jsx(H,{size:16}),"Save"]})]}):e.jsx(k,{variant:"outline",onClick:()=>S(!0),children:"Edit"})]}),e.jsxs("div",{className:"photo-section",children:[e.jsx("div",{className:"photo-container",children:s!=null&&s.imageUrl?e.jsx("img",{src:s.imageUrl,alt:s.name,className:"profile-photo"}):e.jsx("div",{className:"photo-placeholder",children:((y=(p=s==null?void 0:s.name)==null?void 0:p.charAt(0))==null?void 0:y.toUpperCase())||"U"})}),e.jsxs("div",{className:"photo-actions",children:[e.jsx("input",{ref:w,type:"file",accept:"image/jpeg,image/png,image/webp",onChange:u,className:"hidden-input"}),e.jsxs(k,{variant:"outline",size:"sm",onClick:()=>{var h;return(h=w.current)==null?void 0:h.click()},disabled:m,children:[e.jsx(Ne,{size:16}),"Upload Photo"]}),(s==null?void 0:s.imageUrl)&&e.jsxs(k,{variant:"ghost",size:"sm",onClick:g,disabled:m,className:"remove-btn",children:[e.jsx(M,{size:16}),"Remove"]})]})]}),e.jsxs("div",{className:"form-grid",children:[e.jsxs("div",{className:"form-group",children:[e.jsx(d,{children:"First Name"}),e.jsx(x,{name:"firstName",value:v.firstName,onChange:z,disabled:!l,placeholder:"John"})]}),e.jsxs("div",{className:"form-group",children:[e.jsx(d,{children:"Last Name"}),e.jsx(x,{name:"lastName",value:v.lastName,onChange:z,disabled:!l,placeholder:"Doe"})]}),e.jsxs("div",{className:"form-group",children:[e.jsx(d,{children:"Email"}),e.jsx(x,{value:(s==null?void 0:s.email)||"",disabled:!0,className:"disabled-field"}),e.jsx("span",{className:"field-hint",children:"Email can be changed in Security settings"})]}),e.jsxs("div",{className:"form-group",children:[e.jsx(d,{children:"Username"}),e.jsx(x,{value:(s==null?void 0:s.username)||"",disabled:!0,className:"disabled-field"})]}),e.jsxs("div",{className:"form-group",children:[e.jsx(d,{children:"Date of Birth"}),e.jsx(x,{name:"dateOfBirth",type:"date",value:v.dateOfBirth,onChange:z,disabled:!l})]}),e.jsxs("div",{className:"form-group",children:[e.jsx(d,{children:"Country"}),e.jsx(x,{name:"country",value:v.country,onChange:z,disabled:!l,placeholder:"India"})]}),e.jsxs("div",{className:"form-group",children:[e.jsx(d,{children:"Phone Number"}),e.jsx(x,{name:"phoneNumber",value:v.phoneNumber,onChange:z,disabled:!l,placeholder:"+91 9876543210"})]}),e.jsxs("div",{className:"form-group full-width",children:[e.jsx(d,{children:"Address"}),e.jsx(x,{name:"address",value:v.address,onChange:z,disabled:!l,placeholder:"Your address"})]}),e.jsxs("div",{className:"form-group full-width",children:[e.jsx(d,{children:"Bio"}),e.jsx("textarea",{name:"bio",value:v.bio,onChange:z,disabled:!l,placeholder:"Tell us about yourself...",rows:3,className:"bio-textarea"})]})]}),e.jsx("style",{jsx:!0,children:`
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
      `})]})},te=["CBSE","ICSE","State Board","IB","Other"],ze=["Science","Commerce","Arts","Other"],Ee=({profile:a,saving:s,onUpdateTenth:m,onUpdateTwelfth:j})=>{var p,y,h,r,t,o,i,D,T,V,q;const[E,f]=b.useState(!0),[l,S]=b.useState(!0),[v,c]=b.useState(!1),[w,z]=b.useState(!1),[A,I]=b.useState({percentage:((p=a==null?void 0:a.tenthGrade)==null?void 0:p.percentage)||"",cgpa:((y=a==null?void 0:a.tenthGrade)==null?void 0:y.cgpa)||"",board:((h=a==null?void 0:a.tenthGrade)==null?void 0:h.board)||"",year:((r=a==null?void 0:a.tenthGrade)==null?void 0:r.year)||"",school:((t=a==null?void 0:a.tenthGrade)==null?void 0:t.school)||""}),[u,g]=b.useState({percentage:((o=a==null?void 0:a.twelfthGrade)==null?void 0:o.percentage)||"",cgpa:((i=a==null?void 0:a.twelfthGrade)==null?void 0:i.cgpa)||"",board:((D=a==null?void 0:a.twelfthGrade)==null?void 0:D.board)||"",stream:((T=a==null?void 0:a.twelfthGrade)==null?void 0:T.stream)||"",year:((V=a==null?void 0:a.twelfthGrade)==null?void 0:V.year)||"",school:((q=a==null?void 0:a.twelfthGrade)==null?void 0:q.school)||""}),N=async()=>{const n=await m(A);n.success?(C.success(n.message),c(!1)):C.error(n.message)},U=async()=>{const n=await j(u);n.success?(C.success(n.message),z(!1)):C.error(n.message)};return e.jsxs("div",{className:"section-container",children:[e.jsx("div",{className:"section-header",children:e.jsx("h2",{children:"Education Details"})}),e.jsxs("div",{className:"education-card",children:[e.jsxs("div",{className:"card-header",onClick:()=>f(!E),children:[e.jsxs("div",{className:"card-title",children:[e.jsx("span",{className:"grade-badge",children:"10th"}),e.jsx("h3",{children:"10th Grade (Secondary)"})]}),e.jsxs("div",{className:"card-controls",children:[v?e.jsxs(e.Fragment,{children:[e.jsx(k,{variant:"ghost",size:"sm",onClick:n=>{n.stopPropagation(),c(!1)},disabled:s,children:e.jsx(O,{size:14})}),e.jsxs(k,{size:"sm",onClick:n=>{n.stopPropagation(),N()},disabled:s,className:"save-btn",children:[s?e.jsx($,{size:14,className:"animate-spin"}):e.jsx(H,{size:14}),"Save"]})]}):e.jsx(k,{variant:"ghost",size:"sm",onClick:n=>{n.stopPropagation(),c(!0)},children:"Edit"}),E?e.jsx(se,{size:20}):e.jsx(ae,{size:20})]})]}),E&&e.jsx("div",{className:"card-content",children:e.jsxs("div",{className:"form-grid",children:[e.jsxs("div",{className:"form-group",children:[e.jsx(d,{children:"Percentage"}),e.jsx(x,{type:"number",value:A.percentage,onChange:n=>I(P=>({...P,percentage:n.target.value})),disabled:!v,placeholder:"85.5",min:"0",max:"100"})]}),e.jsxs("div",{className:"form-group",children:[e.jsx(d,{children:"CGPA (out of 10)"}),e.jsx(x,{type:"number",value:A.cgpa,onChange:n=>I(P=>({...P,cgpa:n.target.value})),disabled:!v,placeholder:"9.2",min:"0",max:"10",step:"0.1"})]}),e.jsxs("div",{className:"form-group",children:[e.jsx(d,{children:"Board"}),e.jsxs("select",{value:A.board,onChange:n=>I(P=>({...P,board:n.target.value})),disabled:!v,className:"select-field",children:[e.jsx("option",{value:"",children:"Select Board"}),te.map(n=>e.jsx("option",{value:n,children:n},n))]})]}),e.jsxs("div",{className:"form-group",children:[e.jsx(d,{children:"Passing Year"}),e.jsx(x,{type:"number",value:A.year,onChange:n=>I(P=>({...P,year:n.target.value})),disabled:!v,placeholder:"2020",min:"1990",max:"2100"})]}),e.jsxs("div",{className:"form-group full-width",children:[e.jsx(d,{children:"School Name"}),e.jsx(x,{value:A.school,onChange:n=>I(P=>({...P,school:n.target.value})),disabled:!v,placeholder:"Your school name"})]})]})})]}),e.jsxs("div",{className:"education-card",children:[e.jsxs("div",{className:"card-header",onClick:()=>S(!l),children:[e.jsxs("div",{className:"card-title",children:[e.jsx("span",{className:"grade-badge twelfth",children:"12th"}),e.jsx("h3",{children:"12th Grade (Higher Secondary)"})]}),e.jsxs("div",{className:"card-controls",children:[w?e.jsxs(e.Fragment,{children:[e.jsx(k,{variant:"ghost",size:"sm",onClick:n=>{n.stopPropagation(),z(!1)},disabled:s,children:e.jsx(O,{size:14})}),e.jsxs(k,{size:"sm",onClick:n=>{n.stopPropagation(),U()},disabled:s,className:"save-btn",children:[s?e.jsx($,{size:14,className:"animate-spin"}):e.jsx(H,{size:14}),"Save"]})]}):e.jsx(k,{variant:"ghost",size:"sm",onClick:n=>{n.stopPropagation(),z(!0)},children:"Edit"}),l?e.jsx(se,{size:20}):e.jsx(ae,{size:20})]})]}),l&&e.jsx("div",{className:"card-content",children:e.jsxs("div",{className:"form-grid",children:[e.jsxs("div",{className:"form-group",children:[e.jsx(d,{children:"Percentage"}),e.jsx(x,{type:"number",value:u.percentage,onChange:n=>g(P=>({...P,percentage:n.target.value})),disabled:!w,placeholder:"85.5",min:"0",max:"100"})]}),e.jsxs("div",{className:"form-group",children:[e.jsx(d,{children:"CGPA (out of 10)"}),e.jsx(x,{type:"number",value:u.cgpa,onChange:n=>g(P=>({...P,cgpa:n.target.value})),disabled:!w,placeholder:"9.2",min:"0",max:"10",step:"0.1"})]}),e.jsxs("div",{className:"form-group",children:[e.jsx(d,{children:"Board"}),e.jsxs("select",{value:u.board,onChange:n=>g(P=>({...P,board:n.target.value})),disabled:!w,className:"select-field",children:[e.jsx("option",{value:"",children:"Select Board"}),te.map(n=>e.jsx("option",{value:n,children:n},n))]})]}),e.jsxs("div",{className:"form-group",children:[e.jsx(d,{children:"Stream"}),e.jsxs("select",{value:u.stream,onChange:n=>g(P=>({...P,stream:n.target.value})),disabled:!w,className:"select-field",children:[e.jsx("option",{value:"",children:"Select Stream"}),ze.map(n=>e.jsx("option",{value:n,children:n},n))]})]}),e.jsxs("div",{className:"form-group",children:[e.jsx(d,{children:"Passing Year"}),e.jsx(x,{type:"number",value:u.year,onChange:n=>g(P=>({...P,year:n.target.value})),disabled:!w,placeholder:"2022",min:"1990",max:"2100"})]}),e.jsxs("div",{className:"form-group full-width",children:[e.jsx(d,{children:"School/College Name"}),e.jsx(x,{value:u.school,onChange:n=>g(P=>({...P,school:n.target.value})),disabled:!w,placeholder:"Your school/college name"})]})]})})]}),e.jsx("style",{jsx:!0,children:`
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
      `})]})},Pe=[{value:"not_started",label:"Not Started"},{value:"pursuing",label:"Pursuing"},{value:"completed",label:"Completed"}],Le=[{value:"not_applicable",label:"Not Applicable"},{value:"not_started",label:"Not Started"},{value:"pursuing",label:"Pursuing"},{value:"completed",label:"Completed"}],Ae=({profile:a,saving:s,onUpdateUndergraduate:m,onUpdateGraduation:j})=>{var g,N,U,p,y,h,r,t,o,i,D,T,V,q,n,P,X,K,J,Q;const[E,f]=b.useState(!1),[l,S]=b.useState(!1),[v,c]=b.useState({status:((g=a==null?void 0:a.undergraduate)==null?void 0:g.status)||"not_started",courseName:((N=a==null?void 0:a.undergraduate)==null?void 0:N.courseName)||"",specialization:((U=a==null?void 0:a.undergraduate)==null?void 0:U.specialization)||"",collegeName:((p=a==null?void 0:a.undergraduate)==null?void 0:p.collegeName)||"",university:((y=a==null?void 0:a.undergraduate)==null?void 0:y.university)||"",startYear:((h=a==null?void 0:a.undergraduate)==null?void 0:h.startYear)||"",passoutYear:((r=a==null?void 0:a.undergraduate)==null?void 0:r.passoutYear)||"",expectedPassoutYear:((t=a==null?void 0:a.undergraduate)==null?void 0:t.expectedPassoutYear)||"",cgpa:((o=a==null?void 0:a.undergraduate)==null?void 0:o.cgpa)||"",percentage:((i=a==null?void 0:a.undergraduate)==null?void 0:i.percentage)||""}),[w,z]=b.useState({status:((D=a==null?void 0:a.graduation)==null?void 0:D.status)||"not_applicable",courseName:((T=a==null?void 0:a.graduation)==null?void 0:T.courseName)||"",specialization:((V=a==null?void 0:a.graduation)==null?void 0:V.specialization)||"",collegeName:((q=a==null?void 0:a.graduation)==null?void 0:q.collegeName)||"",university:((n=a==null?void 0:a.graduation)==null?void 0:n.university)||"",startYear:((P=a==null?void 0:a.graduation)==null?void 0:P.startYear)||"",passoutYear:((X=a==null?void 0:a.graduation)==null?void 0:X.passoutYear)||"",expectedPassoutYear:((K=a==null?void 0:a.graduation)==null?void 0:K.expectedPassoutYear)||"",cgpa:((J=a==null?void 0:a.graduation)==null?void 0:J.cgpa)||"",percentage:((Q=a==null?void 0:a.graduation)==null?void 0:Q.percentage)||""}),A=async()=>{const B=await m(v);B.success?(C.success(B.message),f(!1)):C.error(B.message)},I=async()=>{const B=await j(w);B.success?(C.success(B.message),S(!1)):C.error(B.message)},u=(B,Y,R,ce)=>{const Z=B.status==="pursuing",ee=B.status==="completed",de=Z||ee||B.status==="not_started";return e.jsxs("div",{className:"form-grid",children:[e.jsxs("div",{className:"form-group",children:[e.jsx(d,{children:"Status"}),e.jsx("select",{value:B.status,onChange:L=>Y(G=>({...G,status:L.target.value})),disabled:!R,className:"select-field",children:(ce==="grad"?Le:Pe).map(L=>e.jsx("option",{value:L.value,children:L.label},L.value))})]}),de&&B.status!=="not_applicable"&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"form-group",children:[e.jsx(d,{children:"Course/Degree Name"}),e.jsx(x,{value:B.courseName,onChange:L=>Y(G=>({...G,courseName:L.target.value})),disabled:!R,placeholder:"B.Tech, B.Sc, BBA..."})]}),e.jsxs("div",{className:"form-group",children:[e.jsx(d,{children:"Specialization"}),e.jsx(x,{value:B.specialization,onChange:L=>Y(G=>({...G,specialization:L.target.value})),disabled:!R,placeholder:"Computer Science, Electronics..."})]}),e.jsxs("div",{className:"form-group",children:[e.jsx(d,{children:"College Name"}),e.jsx(x,{value:B.collegeName,onChange:L=>Y(G=>({...G,collegeName:L.target.value})),disabled:!R,placeholder:"Your college name"})]}),e.jsxs("div",{className:"form-group",children:[e.jsx(d,{children:"University"}),e.jsx(x,{value:B.university,onChange:L=>Y(G=>({...G,university:L.target.value})),disabled:!R,placeholder:"University name"})]}),e.jsxs("div",{className:"form-group",children:[e.jsx(d,{children:"Start Year"}),e.jsx(x,{type:"number",value:B.startYear,onChange:L=>Y(G=>({...G,startYear:L.target.value})),disabled:!R,placeholder:"2022",min:"1990",max:"2100"})]}),Z&&e.jsxs("div",{className:"form-group",children:[e.jsx(d,{children:"Expected Passout Year"}),e.jsx(x,{type:"number",value:B.expectedPassoutYear,onChange:L=>Y(G=>({...G,expectedPassoutYear:L.target.value})),disabled:!R,placeholder:"2026",min:"1990",max:"2100"})]}),ee&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"form-group",children:[e.jsx(d,{children:"Passout Year"}),e.jsx(x,{type:"number",value:B.passoutYear,onChange:L=>Y(G=>({...G,passoutYear:L.target.value})),disabled:!R,placeholder:"2026",min:"1990",max:"2100"})]}),e.jsxs("div",{className:"form-group",children:[e.jsx(d,{children:"CGPA (out of 10)"}),e.jsx(x,{type:"number",value:B.cgpa,onChange:L=>Y(G=>({...G,cgpa:L.target.value})),disabled:!R,placeholder:"8.5",min:"0",max:"10",step:"0.1"})]}),e.jsxs("div",{className:"form-group",children:[e.jsx(d,{children:"Percentage"}),e.jsx(x,{type:"number",value:B.percentage,onChange:L=>Y(G=>({...G,percentage:L.target.value})),disabled:!R,placeholder:"85.5",min:"0",max:"100"})]})]})]})]})};return e.jsxs("div",{className:"section-container",children:[e.jsx("div",{className:"section-header",children:e.jsx("h2",{children:"Higher Education"})}),e.jsxs("div",{className:"education-card",children:[e.jsxs("div",{className:"card-header",children:[e.jsxs("div",{className:"card-title",children:[e.jsx("span",{className:"grade-badge ug",children:"UG"}),e.jsx("h3",{children:"Undergraduate"})]}),e.jsx("div",{className:"card-controls",children:E?e.jsxs(e.Fragment,{children:[e.jsxs(k,{variant:"ghost",size:"sm",onClick:()=>f(!1),disabled:s,children:[e.jsx(O,{size:14})," Cancel"]}),e.jsxs(k,{size:"sm",onClick:A,disabled:s,className:"save-btn",children:[s?e.jsx($,{size:14,className:"animate-spin"}):e.jsx(H,{size:14}),"Save"]})]}):e.jsx(k,{variant:"outline",size:"sm",onClick:()=>f(!0),children:"Edit"})})]}),e.jsx("div",{className:"card-content",children:u(v,c,E,"ug")})]}),e.jsxs("div",{className:"education-card",children:[e.jsxs("div",{className:"card-header",children:[e.jsxs("div",{className:"card-title",children:[e.jsx("span",{className:"grade-badge grad",children:"PG"}),e.jsx("h3",{children:"Post-Graduation"})]}),e.jsx("div",{className:"card-controls",children:l?e.jsxs(e.Fragment,{children:[e.jsxs(k,{variant:"ghost",size:"sm",onClick:()=>S(!1),disabled:s,children:[e.jsx(O,{size:14})," Cancel"]}),e.jsxs(k,{size:"sm",onClick:I,disabled:s,className:"save-btn",children:[s?e.jsx($,{size:14,className:"animate-spin"}):e.jsx(H,{size:14}),"Save"]})]}):e.jsx(k,{variant:"outline",size:"sm",onClick:()=>S(!0),children:"Edit"})})]}),e.jsx("div",{className:"card-content",children:u(w,z,l,"grad")})]}),e.jsx("style",{jsx:!0,children:`
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
      `})]})},Ue={company:"",role:"",startDate:"",endDate:"",isCurrent:!1,description:"",location:""},Be=({profile:a,saving:s,onUpdate:m})=>{const[j,E]=b.useState((a==null?void 0:a.experience)||[]),[f,l]=b.useState(!1),[S,v]=b.useState(!1),c=()=>{E(u=>[{...Ue},...u]),l(!0),v(!0)},w=u=>{E(g=>g.filter((N,U)=>U!==u)),v(!0)},z=(u,g,N)=>{E(U=>U.map((p,y)=>y===u?{...p,[g]:N}:p)),v(!0)},A=async()=>{const u=j.filter(N=>N.company&&N.role),g=await m(u);g.success?(C.success(g.message),l(!1),v(!1)):C.error(g.message)},I=()=>{E((a==null?void 0:a.experience)||[]),l(!1),v(!1)};return e.jsxs("div",{className:"section-container",children:[e.jsxs("div",{className:"section-header",children:[e.jsx("h2",{children:"Work Experience"}),e.jsxs("div",{className:"header-actions",children:[S&&e.jsxs(e.Fragment,{children:[e.jsxs(k,{variant:"outline",onClick:I,disabled:s,children:[e.jsx(O,{size:16})," Cancel"]}),e.jsxs(k,{onClick:A,disabled:s,className:"save-btn",children:[s?e.jsx($,{size:16,className:"animate-spin"}):e.jsx(H,{size:16}),"Save Changes"]})]}),e.jsxs(k,{variant:"outline",onClick:c,children:[e.jsx(W,{size:16})," Add Experience"]})]})]}),j.length===0?e.jsxs("div",{className:"empty-state",children:[e.jsx(ne,{size:48}),e.jsx("h3",{children:"No Experience Added"}),e.jsx("p",{children:"Add your work experience to showcase your professional journey"}),e.jsxs(k,{onClick:c,children:[e.jsx(W,{size:16})," Add Your First Experience"]})]}):e.jsx("div",{className:"experience-list",children:j.map((u,g)=>e.jsxs("div",{className:"experience-card",children:[e.jsxs("div",{className:"card-header",children:[e.jsx("div",{className:"card-number",children:g+1}),e.jsx(k,{variant:"ghost",size:"sm",className:"remove-btn",onClick:()=>w(g),children:e.jsx(M,{size:16})})]}),e.jsx("div",{className:"card-content",children:e.jsxs("div",{className:"form-grid",children:[e.jsxs("div",{className:"form-group",children:[e.jsx(d,{children:"Company Name *"}),e.jsx(x,{value:u.company,onChange:N=>z(g,"company",N.target.value),placeholder:"Google, Microsoft..."})]}),e.jsxs("div",{className:"form-group",children:[e.jsx(d,{children:"Role/Position *"}),e.jsx(x,{value:u.role,onChange:N=>z(g,"role",N.target.value),placeholder:"Software Engineer"})]}),e.jsxs("div",{className:"form-group",children:[e.jsx(d,{children:"Start Date"}),e.jsx(x,{type:"date",value:u.startDate?new Date(u.startDate).toISOString().split("T")[0]:"",onChange:N=>z(g,"startDate",N.target.value)})]}),e.jsxs("div",{className:"form-group",children:[e.jsx(d,{children:"End Date"}),e.jsx(x,{type:"date",value:u.endDate?new Date(u.endDate).toISOString().split("T")[0]:"",onChange:N=>z(g,"endDate",N.target.value),disabled:u.isCurrent})]}),e.jsx("div",{className:"form-group checkbox-group",children:e.jsxs("label",{className:"checkbox-label",children:[e.jsx("input",{type:"checkbox",checked:u.isCurrent,onChange:N=>z(g,"isCurrent",N.target.checked)}),e.jsx("span",{children:"Currently Working Here"})]})}),e.jsxs("div",{className:"form-group",children:[e.jsx(d,{children:"Location"}),e.jsx(x,{value:u.location,onChange:N=>z(g,"location",N.target.value),placeholder:"New Delhi, India"})]}),e.jsxs("div",{className:"form-group full-width",children:[e.jsx(d,{children:"Description"}),e.jsx("textarea",{value:u.description,onChange:N=>z(g,"description",N.target.value),placeholder:"Describe your responsibilities and achievements...",rows:3,className:"description-textarea"})]})]})})]},g))}),e.jsx("style",{jsx:!0,children:`
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
      `})]})},Ie=({profile:a,saving:s,onUpdate:m})=>{var I,u,g,N,U;const[j,E]=b.useState(!1),[f,l]=b.useState({github:((I=a==null?void 0:a.socialLinks)==null?void 0:I.github)||"",linkedin:((u=a==null?void 0:a.socialLinks)==null?void 0:u.linkedin)||"",portfolio:((g=a==null?void 0:a.socialLinks)==null?void 0:g.portfolio)||"",twitter:((N=a==null?void 0:a.socialLinks)==null?void 0:N.twitter)||"",customLinks:((U=a==null?void 0:a.socialLinks)==null?void 0:U.customLinks)||[]}),S=(p,y)=>{l(h=>({...h,[p]:y}))},v=()=>{l(p=>({...p,customLinks:[...p.customLinks,{name:"",url:""}]}))},c=(p,y,h)=>{l(r=>({...r,customLinks:r.customLinks.map((t,o)=>o===p?{...t,[y]:h}:t)}))},w=p=>{l(y=>({...y,customLinks:y.customLinks.filter((h,r)=>r!==p)}))},z=async()=>{const p=/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/,y=t=>!t||t===""||p.test(t);if(!y(f.github)||!y(f.linkedin)||!y(f.portfolio)||!y(f.twitter)){C.error("Please enter valid URLs");return}const h=f.customLinks.filter(t=>t.name&&t.url),r=await m({...f,customLinks:h});r.success?(C.success(r.message),E(!1)):C.error(r.message)},A=()=>{var p,y,h,r,t;l({github:((p=a==null?void 0:a.socialLinks)==null?void 0:p.github)||"",linkedin:((y=a==null?void 0:a.socialLinks)==null?void 0:y.linkedin)||"",portfolio:((h=a==null?void 0:a.socialLinks)==null?void 0:h.portfolio)||"",twitter:((r=a==null?void 0:a.socialLinks)==null?void 0:r.twitter)||"",customLinks:((t=a==null?void 0:a.socialLinks)==null?void 0:t.customLinks)||[]}),E(!1)};return e.jsxs("div",{className:"section-container",children:[e.jsxs("div",{className:"section-header",children:[e.jsx("h2",{children:"Social Links"}),j?e.jsxs("div",{className:"header-actions",children:[e.jsxs(k,{variant:"outline",onClick:A,disabled:s,children:[e.jsx(O,{size:16})," Cancel"]}),e.jsxs(k,{onClick:z,disabled:s,className:"save-btn",children:[s?e.jsx($,{size:16,className:"animate-spin"}):e.jsx(H,{size:16}),"Save"]})]}):e.jsx(k,{variant:"outline",onClick:()=>E(!0),children:"Edit"})]}),e.jsxs("div",{className:"links-grid",children:[e.jsxs("div",{className:"link-card",children:[e.jsx("div",{className:"link-icon github",children:e.jsx(fe,{size:24})}),e.jsxs("div",{className:"link-content",children:[e.jsx(d,{children:"GitHub"}),e.jsx(x,{value:f.github,onChange:p=>S("github",p.target.value),disabled:!j,placeholder:"https://github.com/username"})]})]}),e.jsxs("div",{className:"link-card",children:[e.jsx("div",{className:"link-icon linkedin",children:e.jsx(be,{size:24})}),e.jsxs("div",{className:"link-content",children:[e.jsx(d,{children:"LinkedIn"}),e.jsx(x,{value:f.linkedin,onChange:p=>S("linkedin",p.target.value),disabled:!j,placeholder:"https://linkedin.com/in/username"})]})]}),e.jsxs("div",{className:"link-card",children:[e.jsx("div",{className:"link-icon portfolio",children:e.jsx(je,{size:24})}),e.jsxs("div",{className:"link-content",children:[e.jsx(d,{children:"Portfolio / Website"}),e.jsx(x,{value:f.portfolio,onChange:p=>S("portfolio",p.target.value),disabled:!j,placeholder:"https://yourwebsite.com"})]})]}),e.jsxs("div",{className:"link-card",children:[e.jsx("div",{className:"link-icon twitter",children:e.jsx("span",{style:{fontSize:"20px",fontWeight:"bold"},children:"𝕏"})}),e.jsxs("div",{className:"link-content",children:[e.jsx(d,{children:"Twitter / X"}),e.jsx(x,{value:f.twitter,onChange:p=>S("twitter",p.target.value),disabled:!j,placeholder:"https://twitter.com/username"})]})]})]}),e.jsxs("div",{className:"custom-links-section",children:[e.jsxs("div",{className:"custom-links-header",children:[e.jsx("h3",{children:"Custom Links"}),j&&e.jsxs(k,{variant:"outline",size:"sm",onClick:v,children:[e.jsx(W,{size:16})," Add Link"]})]}),f.customLinks.length===0?e.jsxs("div",{className:"empty-custom",children:[e.jsx(ie,{size:20}),e.jsx("span",{children:"No custom links added"})]}):e.jsx("div",{className:"custom-links-list",children:f.customLinks.map((p,y)=>e.jsxs("div",{className:"custom-link-row",children:[e.jsxs("div",{className:"custom-link-inputs",children:[e.jsx(x,{value:p.name,onChange:h=>c(y,"name",h.target.value),disabled:!j,placeholder:"Link Name",className:"name-input"}),e.jsx(x,{value:p.url,onChange:h=>c(y,"url",h.target.value),disabled:!j,placeholder:"https://...",className:"url-input"})]}),j&&e.jsx(k,{variant:"ghost",size:"sm",className:"remove-btn",onClick:()=>w(y),children:e.jsx(M,{size:16})})]},y))})]}),e.jsx("style",{jsx:!0,children:`
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
      `})]})},Ge=({user:a,saving:s,onToggleNewsletter:m})=>{const[j,E]=b.useState((a==null?void 0:a.newsletter)||!1),[f,l]=b.useState(!1),S=async()=>{const v=!j;l(!0);const c=await m(v);c.success?(E(v),C.success(c.message)):C.error(c.message),l(!1)};return e.jsxs("div",{className:"section-container",children:[e.jsx("div",{className:"section-header",children:e.jsx("h2",{children:"Notification Settings"})}),e.jsxs("div",{className:"settings-list",children:[e.jsxs("div",{className:"setting-card",children:[e.jsx("div",{className:"setting-icon",children:e.jsx(oe,{size:24})}),e.jsxs("div",{className:"setting-content",children:[e.jsx("h3",{children:"Newsletter Subscription"}),e.jsx("p",{children:"Receive weekly updates about new features, career tips, and opportunities."})]}),e.jsx("div",{className:"setting-action",children:e.jsx("button",{className:`toggle-btn ${j?"active":""}`,onClick:S,disabled:f||s,children:f?e.jsx($,{size:16,className:"animate-spin"}):e.jsx("span",{className:"toggle-track",children:e.jsx("span",{className:"toggle-thumb"})})})})]}),e.jsxs("div",{className:"setting-card",children:[e.jsx("div",{className:"setting-icon bell",children:e.jsx(re,{size:24})}),e.jsxs("div",{className:"setting-content",children:[e.jsx("h3",{children:"Email Notifications"}),e.jsx("p",{children:"Receive email alerts for important account activities and security updates."})]}),e.jsx("div",{className:"setting-action",children:e.jsx("span",{className:"always-on-badge",children:"Always On"})})]})]}),e.jsxs("div",{className:"info-card",children:[e.jsx("h4",{children:"📧 Email Preferences"}),e.jsx("p",{children:"We respect your privacy. You can unsubscribe from promotional emails at any time. Essential security and account-related emails cannot be disabled."})]}),e.jsx("style",{jsx:!0,children:`
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
      `})]})},Te=({user:a})=>{const{logout:s,setToken:m}=ge(),[j,E]=b.useState(!1),[f,l]=b.useState("request"),[S,v]=b.useState(""),[c,w]=b.useState(""),[z,A]=b.useState(!1),[I,u]=b.useState(!1),[g,N]=b.useState(""),[U,p]=b.useState(""),[y,h]=b.useState(!1),r=async()=>{var i,D;if(!S){C.error("Please enter a new email address");return}if(S===(a==null?void 0:a.email)){C.error("New email must be different from current email");return}A(!0);try{(await _.post(`${F.API_BASE_URL}/auth/request-email-change`,{newEmail:S},{headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}})).data.success&&(C.success("Verification code sent to the new email"),l("verify"))}catch(T){C.error(((D=(i=T.response)==null?void 0:i.data)==null?void 0:D.message)||"Failed to send verification code")}finally{A(!1)}},t=async()=>{var i,D;if(!c){C.error("Please enter the verification code");return}A(!0);try{const T=await _.post(`${F.API_BASE_URL}/auth/verify-email-change`,{newEmail:S,otp:c},{headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}});T.data.success&&(C.success("Email changed successfully"),T.data.token&&(localStorage.setItem("token",T.data.token),m(T.data.token)),E(!1),l("request"),v(""),w(""),window.location.reload())}catch(T){C.error(((D=(i=T.response)==null?void 0:i.data)==null?void 0:D.message)||"Verification failed")}finally{A(!1)}},o=async()=>{var i,D;if(U!=="DELETE"){C.error("Please type DELETE to confirm");return}if((a==null?void 0:a.authProvider)!=="google"&&!g){C.error("Please enter your password");return}h(!0);try{(await _.delete(`${F.API_BASE_URL}/auth/delete-account`,{data:{password:g,confirmDelete:U},headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}})).data.success&&(C.success("Account deleted successfully"),s())}catch(T){C.error(((D=(i=T.response)==null?void 0:i.data)==null?void 0:D.message)||"Failed to delete account")}finally{h(!1)}};return e.jsxs("div",{className:"section-container",children:[e.jsx("div",{className:"section-header",children:e.jsx("h2",{children:"Security & Privacy"})}),e.jsxs("div",{className:"settings-list",children:[e.jsxs("div",{className:"setting-card",children:[e.jsx("div",{className:"setting-icon email",children:e.jsx(oe,{size:24})}),e.jsxs("div",{className:"setting-content",children:[e.jsx("h3",{children:"Change Email Address"}),e.jsxs("p",{children:["Current: ",e.jsx("strong",{children:a==null?void 0:a.email})]})]}),e.jsx(k,{variant:"outline",onClick:()=>E(!j),children:j?"Cancel":"Change Email"})]}),j&&e.jsx("div",{className:"email-change-form",children:f==="request"?e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"form-group",children:[e.jsx(d,{children:"New Email Address"}),e.jsx(x,{type:"email",value:S,onChange:i=>v(i.target.value),placeholder:"Enter new email address"})]}),e.jsxs(k,{onClick:r,disabled:z,className:"primary-btn",children:[z?e.jsx($,{size:16,className:"animate-spin"}):null,"Send Verification Code"]})]}):e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"info-box",children:e.jsxs("p",{children:["A verification code has been sent to ",e.jsx("strong",{children:S}),". Please check your inbox."]})}),e.jsxs("div",{className:"form-group",children:[e.jsx(d,{children:"Verification Code"}),e.jsx(x,{type:"text",value:c,onChange:i=>w(i.target.value),placeholder:"Enter 6-digit code",maxLength:6})]}),e.jsxs("div",{className:"form-actions",children:[e.jsx(k,{variant:"outline",onClick:()=>l("request"),children:"Back"}),e.jsxs(k,{onClick:t,disabled:z,className:"primary-btn",children:[z?e.jsx($,{size:16,className:"animate-spin"}):null,"Verify & Change Email"]})]})]})}),e.jsxs("div",{className:"setting-card",children:[e.jsx("div",{className:"setting-icon password",children:e.jsx(ve,{size:24})}),e.jsxs("div",{className:"setting-content",children:[e.jsx("h3",{children:"Change Password"}),e.jsx("p",{children:"Update your password regularly for security"})]}),e.jsx(k,{variant:"outline",onClick:()=>window.location.href="/forgot-password",children:"Change Password"})]}),e.jsxs("div",{className:"setting-card danger",children:[e.jsx("div",{className:"setting-icon delete",children:e.jsx(M,{size:24})}),e.jsxs("div",{className:"setting-content",children:[e.jsx("h3",{children:"Delete Account"}),e.jsx("p",{children:"Permanently delete your account and all data"})]}),e.jsx(k,{variant:"destructive",onClick:()=>u(!I),children:I?"Cancel":"Delete Account"})]}),I&&e.jsxs("div",{className:"delete-confirm-form",children:[e.jsxs("div",{className:"warning-box",children:[e.jsx(we,{size:24}),e.jsxs("div",{children:[e.jsx("h4",{children:"This action is irreversible!"}),e.jsx("p",{children:"All your data including profile, education details, experience, projects, and certifications will be permanently deleted."})]})]}),(a==null?void 0:a.authProvider)!=="google"&&e.jsxs("div",{className:"form-group",children:[e.jsx(d,{children:"Enter your password to confirm"}),e.jsx(x,{type:"password",value:g,onChange:i=>N(i.target.value),placeholder:"Your password"})]}),e.jsxs("div",{className:"form-group",children:[e.jsxs(d,{children:["Type ",e.jsx("strong",{children:"DELETE"})," to confirm"]}),e.jsx(x,{value:U,onChange:i=>p(i.target.value.toUpperCase()),placeholder:"Type DELETE"})]}),e.jsxs(k,{variant:"destructive",onClick:o,disabled:y||U!=="DELETE",className:"delete-btn",children:[y?e.jsx($,{size:16,className:"animate-spin"}):e.jsx(M,{size:16}),"Permanently Delete My Account"]})]})]}),e.jsx("style",{jsx:!0,children:`
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
      `})]})},na=()=>{const[a,s]=b.useState("personal"),{profile:m,user:j,loading:E,error:f,saving:l,updatePersonalInfo:S,updateTenthGrade:v,updateTwelfthGrade:c,updateUndergraduate:w,updateGraduation:z,updateExperience:A,updateSocialLinks:I,uploadPhoto:u,removePhoto:g,toggleNewsletter:N}=ye(),U=()=>{switch(a){case"personal":return e.jsx(Se,{profile:m,user:j,saving:l,onUpdate:S,onUploadPhoto:u,onRemovePhoto:g});case"education":return e.jsx(Ee,{profile:m,saving:l,onUpdateTenth:v,onUpdateTwelfth:c});case"higher-education":return e.jsx(Ae,{profile:m,saving:l,onUpdateUndergraduate:w,onUpdateGraduation:z});case"experience":return e.jsx(Be,{profile:m,saving:l,onUpdate:A});case"social-links":return e.jsx(Ie,{profile:m,saving:l,onUpdate:I});case"notifications":return e.jsx(Ge,{user:j,saving:l,onToggleNewsletter:N});case"security":return e.jsx(Te,{user:j});default:return null}};return E?e.jsxs("div",{className:"loading-container",children:[e.jsx($,{size:48,className:"animate-spin"}),e.jsx("p",{children:"Loading your profile..."})]}):f?e.jsxs("div",{className:"error-container",children:[e.jsx("h2",{children:"Error Loading Profile"}),e.jsx("p",{children:f})]}):e.jsxs("div",{className:"profile-page",children:[e.jsx(pe,{position:"top-right"}),e.jsx(Ce,{activeSection:a,onSectionChange:s,user:j}),e.jsx("main",{className:"profile-content",children:U()}),e.jsx("style",{jsx:!0,children:`
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
      `})]})};export{na as default};
