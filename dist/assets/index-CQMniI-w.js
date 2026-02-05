import{c as R,i as M,r as p,f as A,a as z,j as e,h as U,L as E,d as W,X as P,g as G,B as Y}from"./index-rn63AO4R.js";import{n as S,F as H}from"./index-BmY-6Ivr.js";import{S as $}from"./star-BZ0RDyau.js";import{C as D}from"./calendar-BVw_jfUz.js";import{C as T}from"./clock-CXxZZNRD.js";import{L as V}from"./link-2-CCrEcutQ.js";import{S as I}from"./save-xCpoqb90.js";import{M as K}from"./map-pin-BKWfWIKi.js";import{A as O}from"./award-wproQHgY.js";import{G as _}from"./globe-DgBaqc0G.js";import{P as X}from"./plus-ByeEKfOh.js";import{V as J}from"./video-DOlNDD6f.js";import{C as q}from"./circle-x-DeZk6O_y.js";import{L as Q,G as Z}from"./linkedin-D0wkCI1A.js";import{T as ee}from"./twitter-DREdarxD.js";/**
 * @license lucide-react v0.437.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ae=R("Youtube",[["path",{d:"M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17",key:"1q2vi4"}],["path",{d:"m10 15 5-3-5-3z",key:"1jp15x"}]]),se=()=>{const{user:i}=M(),[l,o]=p.useState(null),[n,g]=p.useState(null),[h,u]=p.useState([]),[x,r]=p.useState({}),[b,c]=p.useState(!0),[f,m]=p.useState(!1),[N,w]=p.useState(null),v=p.useCallback(async()=>{var a,s;try{c(!0);const t=await A.get(`${z.API_BASE_URL}/mentors/my-profile`,{headers:{Authorization:`Bearer ${i.token}`}});o(t.data.profile),g(t.data.sessionStats),w(null)}catch(t){console.error("Error fetching mentor profile:",t),w(((s=(a=t.response)==null?void 0:a.data)==null?void 0:s.message)||"Failed to load profile")}finally{c(!1)}},[i.token]),k=p.useCallback(async(a=null)=>{try{const s=a?{status:a}:{},t=await A.get(`${z.API_BASE_URL}/mentors/my-sessions`,{headers:{Authorization:`Bearer ${i.token}`},params:s});u(t.data.sessions),r(t.data.statusCounts)}catch(s){console.error("Error fetching sessions:",s),S.error("Failed to load sessions")}},[i.token]);return p.useEffect(()=>{i!=null&&i.token&&(v(),k())},[i==null?void 0:i.token,v,k]),{profile:l,sessionStats:n,sessions:h,sessionStatusCounts:x,loading:b,saving:f,error:N,fetchProfile:v,fetchSessions:k,updateProfile:async a=>{var s,t;try{m(!0);const d=await A.put(`${z.API_BASE_URL}/mentors/my-profile`,a,{headers:{Authorization:`Bearer ${i.token}`}});return o(d.data.profile),S.success(`Profile updated! ${d.data.changesCount} changes saved.`),d.data}catch(d){throw console.error("Error updating profile:",d),S.error(((t=(s=d.response)==null?void 0:s.data)==null?void 0:t.message)||"Failed to update profile"),d}finally{m(!1)}},addBusyDate:async(a,s)=>{var t,d;try{m(!0);const y=await A.post(`${z.API_BASE_URL}/mentors/busy-dates`,{action:"add",date:a,reason:s},{headers:{Authorization:`Bearer ${i.token}`}});return o(j=>({...j,busyDates:y.data.busyDates})),S.success("Busy date added"),y.data}catch(y){throw console.error("Error adding busy date:",y),S.error(((d=(t=y.response)==null?void 0:t.data)==null?void 0:d.message)||"Failed to add busy date"),y}finally{m(!1)}},removeBusyDate:async a=>{var s,t;try{m(!0);const d=await A.post(`${z.API_BASE_URL}/mentors/busy-dates`,{action:"remove",dateId:a},{headers:{Authorization:`Bearer ${i.token}`}});return o(y=>({...y,busyDates:d.data.busyDates})),S.success("Busy date removed"),d.data}catch(d){throw console.error("Error removing busy date:",d),S.error(((t=(s=d.response)==null?void 0:s.data)==null?void 0:t.message)||"Failed to remove busy date"),d}finally{m(!1)}}}},te=[{id:"bio",label:"Bio & Details",icon:U},{id:"schedule",label:"Schedule & Availability",icon:D},{id:"sessions",label:"Sessions",icon:T},{id:"social",label:"Social & Links",icon:V}],ne=({activeSection:i,onSectionChange:l,profile:o,user:n,sessionStats:g})=>{var h,u;return e.jsxs("div",{className:"mentor-sidebar",children:[e.jsxs("div",{className:"sidebar-header",children:[e.jsxs("div",{className:"mentor-preview",children:[e.jsx("div",{className:"avatar-container",children:o!=null&&o.profileImage||n!=null&&n.imageUrl?e.jsx("img",{src:(o==null?void 0:o.profileImage)||(n==null?void 0:n.imageUrl),alt:(o==null?void 0:o.displayName)||(n==null?void 0:n.name),className:"mentor-avatar"}):e.jsx("div",{className:"avatar-placeholder",children:((u=(h=(o==null?void 0:o.displayName)||(n==null?void 0:n.name))==null?void 0:h.charAt(0))==null?void 0:u.toUpperCase())||"M"})}),e.jsxs("div",{className:"mentor-info",children:[e.jsx("h3",{children:(o==null?void 0:o.displayName)||(n==null?void 0:n.name)||"Mentor"}),e.jsx("p",{className:"tagline",children:(o==null?void 0:o.tagline)||"Verified Mentor"}),(o==null?void 0:o.averageRating)>0&&e.jsxs("div",{className:"rating",children:[e.jsx($,{size:14,fill:"#f59e0b",stroke:"#f59e0b"}),e.jsx("span",{children:o.averageRating.toFixed(1)})]})]})]}),g&&e.jsxs("div",{className:"stats-row",children:[e.jsxs("div",{className:"stat-item",children:[e.jsx("span",{className:"stat-value",children:g.completed||0}),e.jsx("span",{className:"stat-label",children:"Completed"})]}),e.jsxs("div",{className:"stat-item",children:[e.jsx("span",{className:"stat-value",children:g.pending||0}),e.jsx("span",{className:"stat-label",children:"Pending"})]}),e.jsxs("div",{className:"stat-item",children:[e.jsx("span",{className:"stat-value",children:g.total||0}),e.jsx("span",{className:"stat-label",children:"Total"})]})]})]}),e.jsx("nav",{className:"sidebar-nav",children:te.map(x=>{const r=x.icon,b=i===x.id;return e.jsxs("button",{className:`nav-item ${b?"active":""}`,onClick:()=>l(x.id),children:[e.jsx(r,{size:20}),e.jsx("span",{children:x.label})]},x.id)})}),e.jsx("style",{jsx:!0,children:`
        .mentor-sidebar {
          width: 300px;
          min-height: 100vh;
          background: #ffffff;
          border-right: 1px solid #e2e8f0;
          position: sticky;
          top: 0;
          box-shadow: 2px 0 8px rgba(0, 0, 0, 0.04);
        }

        .sidebar-header {
          padding: 24px 20px;
          border-bottom: 1px solid #e2e8f0;
          background: linear-gradient(135deg, #1A237E 0%, #3949AB 100%);
        }

        .mentor-preview {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .avatar-container {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          overflow: hidden;
          border: 3px solid rgba(255, 255, 255, 0.9);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          flex-shrink: 0;
        }

        .mentor-avatar {
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
          font-size: 24px;
          font-weight: 600;
          color: #1A237E;
        }

        .mentor-info h3 {
          color: white;
          font-size: 16px;
          font-weight: 600;
          margin: 0 0 4px 0;
        }

        .mentor-info .tagline {
          color: rgba(255, 255, 255, 0.8);
          font-size: 13px;
          margin: 0;
        }

        .rating {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-top: 6px;
          color: #f59e0b;
          font-size: 13px;
          font-weight: 600;
        }

        .stats-row {
          display: flex;
          gap: 16px;
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.2);
        }

        .stat-item {
          text-align: center;
          flex: 1;
        }

        .stat-value {
          display: block;
          color: white;
          font-size: 20px;
          font-weight: 700;
        }

        .stat-label {
          display: block;
          color: rgba(255, 255, 255, 0.7);
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
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
          background: #EEF2FF;
          color: #1A237E;
          border-left-color: #1A237E;
          font-weight: 600;
        }

        .nav-item svg {
          flex-shrink: 0;
        }

        @media (max-width: 768px) {
          .mentor-sidebar {
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
            border-bottom-color: #1A237E;
          }

          .nav-item span {
            display: none;
          }
        }
      `})]})},ie=({profile:i,saving:l,onUpdate:o})=>{const[n,g]=p.useState({displayName:"",tagline:"",bio:"",location:{city:"",state:"",country:"India"},expertise:[],targetingDomains:[],languages:[],preferredMenteeType:[]}),[h,u]=p.useState(""),[x,r]=p.useState(""),[b,c]=p.useState(""),[f,m]=p.useState(!1);p.useEffect(()=>{i&&g({displayName:i.displayName||"",tagline:i.tagline||"",bio:i.bio||"",location:i.location||{city:"",state:"",country:"India"},expertise:i.expertise||[],targetingDomains:i.targetingDomains||[],languages:i.languages||[],preferredMenteeType:i.preferredMenteeType||[]})},[i]);const N=(a,s)=>{g(t=>({...t,[a]:s})),m(!0)},w=(a,s)=>{g(t=>({...t,location:{...t.location,[a]:s}})),m(!0)},v=(a,s,t)=>{s.trim()&&!n[a].includes(s.trim())&&(g(d=>({...d,[a]:[...d[a],s.trim()]})),t(""),m(!0))},k=(a,s)=>{g(t=>({...t,[a]:t[a].filter(d=>d!==s)})),m(!0)},C=a=>{g(s=>({...s,preferredMenteeType:s.preferredMenteeType.includes(a)?s.preferredMenteeType.filter(t=>t!==a):[...s.preferredMenteeType,a]})),m(!0)},F=async()=>{f&&(await o(n),m(!1))},B=["Fresher","Working Professional","Student","Career Switch"];return e.jsxs("div",{className:"bio-section",children:[e.jsxs("div",{className:"section-header",children:[e.jsxs("div",{children:[e.jsx("h2",{children:"Bio & Details"}),e.jsx("p",{children:"Update your profile information visible to mentees"})]}),e.jsxs("button",{className:`save-btn ${f?"":"disabled"}`,onClick:F,disabled:l||!f,children:[l?e.jsx(E,{size:16,className:"spin"}):e.jsx(I,{size:16}),l?"Saving...":"Save Changes"]})]}),e.jsxs("div",{className:"form-grid",children:[e.jsxs("div",{className:"form-card",children:[e.jsxs("h3",{children:[e.jsx(W,{size:18})," Basic Information"]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Display Name"}),e.jsx("input",{type:"text",value:n.displayName,onChange:a=>N("displayName",a.target.value),placeholder:"Your professional name"})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Tagline"}),e.jsx("input",{type:"text",value:n.tagline,onChange:a=>N("tagline",a.target.value),placeholder:"e.g. Senior Software Engineer at Google",maxLength:200}),e.jsxs("span",{className:"char-count",children:[n.tagline.length,"/200"]})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Bio"}),e.jsx("textarea",{value:n.bio,onChange:a=>N("bio",a.target.value),placeholder:"Tell mentees about yourself, your experience, and what you can help them with...",rows:5,maxLength:1e3}),e.jsxs("span",{className:"char-count",children:[n.bio.length,"/1000"]})]})]}),e.jsxs("div",{className:"form-card",children:[e.jsxs("h3",{children:[e.jsx(K,{size:18})," Location"]}),e.jsxs("div",{className:"form-row",children:[e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"City"}),e.jsx("input",{type:"text",value:n.location.city,onChange:a=>w("city",a.target.value),placeholder:"City"})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"State"}),e.jsx("input",{type:"text",value:n.location.state,onChange:a=>w("state",a.target.value),placeholder:"State"})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Country"}),e.jsx("input",{type:"text",value:n.location.country,onChange:a=>w("country",a.target.value),placeholder:"Country"})]})]})]}),e.jsxs("div",{className:"form-card",children:[e.jsxs("h3",{children:[e.jsx(O,{size:18})," Expertise & Skills"]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Areas of Expertise"}),e.jsxs("div",{className:"tag-input-container",children:[e.jsx("input",{type:"text",value:h,onChange:a=>u(a.target.value),onKeyDown:a=>a.key==="Enter"&&(a.preventDefault(),v("expertise",h,u)),placeholder:"Type and press Enter (e.g., Java, DSA, System Design)"}),e.jsx("button",{onClick:()=>v("expertise",h,u),children:"Add"})]}),e.jsx("div",{className:"tags",children:n.expertise.map((a,s)=>e.jsxs("span",{className:"tag",children:[a,e.jsx("button",{onClick:()=>k("expertise",a),children:"×"})]},s))})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Targeting Domains"}),e.jsxs("div",{className:"tag-input-container",children:[e.jsx("input",{type:"text",value:x,onChange:a=>r(a.target.value),onKeyDown:a=>a.key==="Enter"&&(a.preventDefault(),v("targetingDomains",x,r)),placeholder:"Type and press Enter (e.g., Backend, Frontend, ML)"}),e.jsx("button",{onClick:()=>v("targetingDomains",x,r),children:"Add"})]}),e.jsx("div",{className:"tags",children:n.targetingDomains.map((a,s)=>e.jsxs("span",{className:"tag domain",children:[a,e.jsx("button",{onClick:()=>k("targetingDomains",a),children:"×"})]},s))})]})]}),e.jsxs("div",{className:"form-card",children:[e.jsxs("h3",{children:[e.jsx(_,{size:18})," Languages & Preferences"]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Languages You Speak"}),e.jsxs("div",{className:"tag-input-container",children:[e.jsx("input",{type:"text",value:b,onChange:a=>c(a.target.value),onKeyDown:a=>a.key==="Enter"&&(a.preventDefault(),v("languages",b,c)),placeholder:"Type and press Enter (e.g., English, Hindi)"}),e.jsx("button",{onClick:()=>v("languages",b,c),children:"Add"})]}),e.jsx("div",{className:"tags",children:n.languages.map((a,s)=>e.jsxs("span",{className:"tag language",children:[a,e.jsx("button",{onClick:()=>k("languages",a),children:"×"})]},s))})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Preferred Mentee Types"}),e.jsx("div",{className:"checkbox-group",children:B.map(a=>e.jsxs("label",{className:"checkbox-label",children:[e.jsx("input",{type:"checkbox",checked:n.preferredMenteeType.includes(a),onChange:()=>C(a)}),e.jsx("span",{children:a})]},a))})]})]})]}),e.jsx("style",{jsx:!0,children:`
        .bio-section {
          padding: 32px;
          max-width: 1000px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 32px;
        }

        .section-header h2 {
          font-size: 24px;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 4px 0;
        }

        .section-header p {
          color: #64748b;
          margin: 0;
        }

        .save-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: #1A237E;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .save-btn:hover:not(.disabled) {
          background: #3949AB;
        }

        .save-btn.disabled {
          background: #94a3b8;
          cursor: not-allowed;
        }

        .spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .form-grid {
          display: grid;
          gap: 24px;
        }

        .form-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .form-card h3 {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 20px 0;
          padding-bottom: 12px;
          border-bottom: 1px solid #e2e8f0;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 16px;
        }

        .form-group {
          margin-bottom: 16px;
          position: relative;
        }

        .form-group label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #475569;
          margin-bottom: 6px;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 14px;
          transition: border-color 0.2s;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #1A237E;
        }

        .char-count {
          position: absolute;
          right: 8px;
          bottom: -18px;
          font-size: 11px;
          color: #94a3b8;
        }

        .tag-input-container {
          display: flex;
          gap: 8px;
        }

        .tag-input-container input {
          flex: 1;
        }

        .tag-input-container button {
          padding: 10px 16px;
          background: #1A237E;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
        }

        .tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 12px;
        }

        .tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: #EEF2FF;
          color: #1A237E;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 500;
        }

        .tag.domain {
          background: #ECFDF5;
          color: #059669;
        }

        .tag.language {
          background: #FEF3C7;
          color: #D97706;
        }

        .tag button {
          background: none;
          border: none;
          font-size: 16px;
          cursor: pointer;
          color: inherit;
          opacity: 0.7;
          padding: 0;
          line-height: 1;
        }

        .tag button:hover {
          opacity: 1;
        }

        .checkbox-group {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          font-size: 14px;
          color: #475569;
        }

        .checkbox-label input {
          width: 18px;
          height: 18px;
          accent-color: #1A237E;
        }

        @media (max-width: 768px) {
          .bio-section {
            padding: 20px;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .section-header {
            flex-direction: column;
            gap: 16px;
          }

          .save-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `})]})},re=({profile:i,saving:l,onUpdate:o,onAddBusyDate:n,onRemoveBusyDate:g})=>{var a;const[h,u]=p.useState({sessionsPerWeek:1,sessionDuration:60,availabilitySlots:[]}),[x,r]=p.useState({date:"",reason:""}),[b,c]=p.useState(!1),[f,m]=p.useState(!1),N=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];p.useEffect(()=>{i&&u({sessionsPerWeek:i.sessionsPerWeek||1,sessionDuration:i.sessionDuration||60,availabilitySlots:i.availabilitySlots||[]})},[i]);const w=(s,t)=>{u(d=>({...d,[s]:t})),c(!0)},v=(s,t="09:00",d="18:00")=>{const y=h.availabilitySlots.find(j=>j.day===s);u(y?j=>({...j,availabilitySlots:j.availabilitySlots.map(L=>L.day===s?{...L,isAvailable:!L.isAvailable}:L)}):j=>({...j,availabilitySlots:[...j.availabilitySlots,{day:s,startTime:t,endTime:d,isAvailable:!0}]})),c(!0)},k=(s,t,d)=>{u(y=>({...y,availabilitySlots:y.availabilitySlots.map(j=>j.day===s?{...j,[t]:d}:j)})),c(!0)},C=async()=>{b&&(await o(h),c(!1))},F=async()=>{if(x.date){m(!0);try{await n(x.date,x.reason),r({date:"",reason:""})}finally{m(!1)}}},B=s=>h.availabilitySlots.find(t=>t.day===s)||null;return e.jsxs("div",{className:"schedule-section",children:[e.jsxs("div",{className:"section-header",children:[e.jsxs("div",{children:[e.jsx("h2",{children:"Schedule & Availability"}),e.jsx("p",{children:"Manage your weekly schedule and mark specific dates as unavailable"})]}),e.jsxs("button",{className:`save-btn ${b?"":"disabled"}`,onClick:C,disabled:l||!b,children:[l?e.jsx(E,{size:16,className:"spin"}):e.jsx(I,{size:16}),l?"Saving...":"Save Changes"]})]}),e.jsxs("div",{className:"content-grid",children:[e.jsxs("div",{className:"form-card",children:[e.jsxs("h3",{children:[e.jsx(T,{size:18})," Session Configuration"]}),e.jsxs("div",{className:"form-row",children:[e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Sessions per Week"}),e.jsx("input",{type:"number",min:1,max:10,value:h.sessionsPerWeek,onChange:s=>w("sessionsPerWeek",parseInt(s.target.value))})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Session Duration (minutes)"}),e.jsxs("select",{value:h.sessionDuration,onChange:s=>w("sessionDuration",parseInt(s.target.value)),children:[e.jsx("option",{value:30,children:"30 minutes"}),e.jsx("option",{value:45,children:"45 minutes"}),e.jsx("option",{value:60,children:"60 minutes"}),e.jsx("option",{value:90,children:"90 minutes"}),e.jsx("option",{value:120,children:"2 hours"})]})]})]})]}),e.jsxs("div",{className:"form-card",children:[e.jsxs("h3",{children:[e.jsx(D,{size:18})," Weekly Availability"]}),e.jsx("p",{className:"help-text",children:"Click a day to toggle availability, then set your hours."}),e.jsx("div",{className:"days-grid",children:N.map(s=>{const t=B(s),d=(t==null?void 0:t.isAvailable)??!1;return e.jsxs("div",{className:`day-card ${d?"available":""}`,children:[e.jsxs("div",{className:"day-header",onClick:()=>v(s),children:[e.jsx("span",{className:"day-name",children:s}),e.jsx("span",{className:`status-badge ${d?"on":"off"}`,children:d?"Available":"Off"})]}),d&&t&&e.jsxs("div",{className:"time-inputs",children:[e.jsx("input",{type:"time",value:t.startTime,onChange:y=>k(s,"startTime",y.target.value)}),e.jsx("span",{children:"to"}),e.jsx("input",{type:"time",value:t.endTime,onChange:y=>k(s,"endTime",y.target.value)})]})]},s)})})]}),e.jsxs("div",{className:"form-card",children:[e.jsxs("h3",{children:[e.jsx(P,{size:18})," Busy Dates (Unavailable)"]}),e.jsx("p",{className:"help-text",children:"Mark specific dates when you cannot take sessions."}),e.jsxs("div",{className:"add-busy-form",children:[e.jsx("input",{type:"date",value:x.date,onChange:s=>r(t=>({...t,date:s.target.value})),min:new Date().toISOString().split("T")[0]}),e.jsx("input",{type:"text",placeholder:"Reason (optional)",value:x.reason,onChange:s=>r(t=>({...t,reason:s.target.value}))}),e.jsxs("button",{onClick:F,disabled:f||!x.date,children:[f?e.jsx(E,{size:16,className:"spin"}):e.jsx(X,{size:16}),"Add"]})]}),e.jsx("div",{className:"busy-dates-list",children:((a=i==null?void 0:i.busyDates)==null?void 0:a.length)>0?i.busyDates.sort((s,t)=>new Date(s.date)-new Date(t.date)).map(s=>e.jsxs("div",{className:"busy-date-item",children:[e.jsxs("div",{className:"busy-info",children:[e.jsx("span",{className:"busy-date",children:new Date(s.date).toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric",year:"numeric"})}),s.reason&&e.jsx("span",{className:"busy-reason",children:s.reason})]}),e.jsx("button",{className:"remove-btn",onClick:()=>g(s._id),children:e.jsx(P,{size:16})})]},s._id)):e.jsx("p",{className:"no-dates",children:"No busy dates marked. You're available on all days!"})})]})]}),e.jsx("style",{jsx:!0,children:`
        .schedule-section {
          padding: 32px;
          max-width: 1000px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 32px;
        }

        .section-header h2 {
          font-size: 24px;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 4px 0;
        }

        .section-header p {
          color: #64748b;
          margin: 0;
        }

        .save-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: #1A237E;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .save-btn:hover:not(.disabled) {
          background: #3949AB;
        }

        .save-btn.disabled {
          background: #94a3b8;
          cursor: not-allowed;
        }

        .spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .content-grid {
          display: grid;
          gap: 24px;
        }

        .form-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .form-card h3 {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 8px 0;
        }

        .help-text {
          color: #64748b;
          font-size: 13px;
          margin: 0 0 20px 0;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-group label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #475569;
          margin-bottom: 6px;
        }

        .form-group input,
        .form-group select {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 14px;
        }

        .days-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 12px;
        }

        .day-card {
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          overflow: hidden;
          transition: all 0.2s;
        }

        .day-card.available {
          border-color: #1A237E;
          background: #EEF2FF;
        }

        .day-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          cursor: pointer;
          user-select: none;
        }

        .day-name {
          font-weight: 600;
          color: #1e293b;
        }

        .status-badge {
          font-size: 11px;
          font-weight: 600;
          padding: 4px 8px;
          border-radius: 12px;
          text-transform: uppercase;
        }

        .status-badge.on {
          background: #059669;
          color: white;
        }

        .status-badge.off {
          background: #e2e8f0;
          color: #64748b;
        }

        .time-inputs {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          background: white;
          border-top: 1px solid #e2e8f0;
        }

        .time-inputs input {
          flex: 1;
          padding: 8px;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          font-size: 13px;
        }

        .time-inputs span {
          color: #64748b;
          font-size: 13px;
        }

        .add-busy-form {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
        }

        .add-busy-form input[type="date"] {
          width: 180px;
          padding: 10px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
        }

        .add-busy-form input[type="text"] {
          flex: 1;
          padding: 10px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
        }

        .add-busy-form button {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 16px;
          background: #dc2626;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        }

        .add-busy-form button:disabled {
          background: #94a3b8;
          cursor: not-allowed;
        }

        .busy-dates-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .busy-date-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          background: #FEF2F2;
          border: 1px solid #FECACA;
          border-radius: 8px;
        }

        .busy-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .busy-date {
          font-weight: 600;
          color: #DC2626;
        }

        .busy-reason {
          font-size: 13px;
          color: #7F1D1D;
        }

        .remove-btn {
          padding: 6px;
          background: white;
          border: 1px solid #FECACA;
          border-radius: 6px;
          color: #DC2626;
          cursor: pointer;
        }

        .remove-btn:hover {
          background: #FEE2E2;
        }

        .no-dates {
          color: #64748b;
          font-size: 14px;
          text-align: center;
          padding: 20px;
        }

        @media (max-width: 768px) {
          .schedule-section {
            padding: 20px;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .add-busy-form {
            flex-direction: column;
          }

          .add-busy-form input[type="date"] {
            width: 100%;
          }
        }
      `})]})},oe=({sessions:i,statusCounts:l,onFetchSessions:o})=>{const[n,g]=p.useState("all");p.useEffect(()=>{o(n==="all"?null:n)},[n]);const h=[{id:"all",label:"All Sessions",count:(l==null?void 0:l.all)||0},{id:"scheduled",label:"Upcoming",count:(l==null?void 0:l.scheduled)||0},{id:"completed",label:"Completed",count:(l==null?void 0:l.completed)||0},{id:"pending",label:"Pending",count:(l==null?void 0:l.pending)||0},{id:"cancelled",label:"Cancelled",count:(l==null?void 0:l.cancelled)||0}],u=r=>{switch(r){case"completed":return e.jsx(G,{size:16,className:"text-green"});case"scheduled":return e.jsx(D,{size:16,className:"text-blue"});case"pending":return e.jsx(T,{size:16,className:"text-orange"});case"cancelled":return e.jsx(q,{size:16,className:"text-red"});default:return e.jsx(T,{size:16})}},x=r=>{switch(r){case"completed":return"#059669";case"scheduled":return"#2563eb";case"pending":return"#d97706";case"cancelled":return"#dc2626";default:return"#64748b"}};return e.jsxs("div",{className:"sessions-section",children:[e.jsxs("div",{className:"section-header",children:[e.jsx("h2",{children:"Sessions"}),e.jsx("p",{children:"View all your mentorship sessions"})]}),e.jsx("div",{className:"tabs",children:h.map(r=>e.jsxs("button",{className:`tab ${n===r.id?"active":""}`,onClick:()=>g(r.id),children:[r.label,e.jsx("span",{className:"count",children:r.count})]},r.id))}),e.jsx("div",{className:"sessions-list",children:(i==null?void 0:i.length)>0?i.map(r=>{var b,c,f;return e.jsxs("div",{className:"session-card",children:[e.jsxs("div",{className:"session-left",children:[e.jsx("div",{className:"mentee-avatar",children:(b=r.userId)!=null&&b.imageUrl?e.jsx("img",{src:r.userId.imageUrl,alt:r.userId.name}):e.jsx(U,{size:20})}),e.jsxs("div",{className:"session-info",children:[e.jsx("h4",{children:((c=r.userId)==null?void 0:c.name)||"User"}),e.jsx("p",{className:"session-email",children:(f=r.userId)==null?void 0:f.email}),e.jsx("div",{className:"session-meta",children:e.jsxs("span",{className:"session-date",children:[e.jsx(D,{size:14}),r.scheduledDate?new Date(r.scheduledDate).toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}):"Not scheduled"]})})]})]}),e.jsxs("div",{className:"session-right",children:[e.jsxs("div",{className:"status-badge",style:{background:x(r.status)+"15",color:x(r.status)},children:[u(r.status),r.status]}),r.rating&&e.jsxs("div",{className:"rating",children:[e.jsx($,{size:14,fill:"#f59e0b",stroke:"#f59e0b"}),e.jsx("span",{children:r.rating.overallRating||"N/A"})]}),r.meetingLink&&r.status==="scheduled"&&e.jsxs("a",{href:r.meetingLink,target:"_blank",rel:"noopener noreferrer",className:"join-btn",children:[e.jsx(J,{size:16}),"Join"]})]})]},r._id)}):e.jsxs("div",{className:"empty-state",children:[e.jsx(D,{size:48}),e.jsx("h3",{children:"No sessions found"}),e.jsx("p",{children:"Sessions will appear here when students book with you."})]})}),e.jsx("style",{jsx:!0,children:`
        .sessions-section {
          padding: 32px;
          max-width: 1000px;
        }

        .section-header {
          margin-bottom: 24px;
        }

        .section-header h2 {
          font-size: 24px;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 4px 0;
        }

        .section-header p {
          color: #64748b;
          margin: 0;
        }

        .tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid #e2e8f0;
          overflow-x: auto;
        }

        .tab {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: transparent;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .tab:hover {
          background: #f8fafc;
          color: #1e293b;
        }

        .tab.active {
          background: #1A237E;
          color: white;
          border-color: #1A237E;
        }

        .tab .count {
          padding: 2px 8px;
          background: rgba(0, 0, 0, 0.1);
          border-radius: 10px;
          font-size: 12px;
        }

        .tab.active .count {
          background: rgba(255, 255, 255, 0.2);
        }

        .sessions-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .session-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          transition: all 0.2s;
        }

        .session-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .session-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .mentee-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #EEF2FF;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          color: #1A237E;
        }

        .mentee-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .session-info h4 {
          font-size: 15px;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 2px 0;
        }

        .session-email {
          font-size: 13px;
          color: #64748b;
          margin: 0 0 6px 0;
        }

        .session-meta {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .session-date {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: #475569;
        }

        .session-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .status-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: capitalize;
        }

        .rating {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 14px;
          font-weight: 600;
          color: #f59e0b;
        }

        .join-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          background: #1A237E;
          color: white;
          border-radius: 8px;
          text-decoration: none;
          font-size: 13px;
          font-weight: 600;
        }

        .join-btn:hover {
          background: #3949AB;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #64748b;
        }

        .empty-state svg {
          color: #e2e8f0;
          margin-bottom: 16px;
        }

        .empty-state h3 {
          font-size: 18px;
          color: #1e293b;
          margin: 0 0 8px 0;
        }

        .empty-state p {
          margin: 0;
        }

        .text-green { color: #059669; }
        .text-blue { color: #2563eb; }
        .text-orange { color: #d97706; }
        .text-red { color: #dc2626; }

        @media (max-width: 768px) {
          .sessions-section {
            padding: 20px;
          }

          .session-card {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }

          .session-right {
            width: 100%;
            justify-content: flex-start;
          }
        }
      `})]})},le=({profile:i,saving:l,onUpdate:o})=>{const[n,g]=p.useState({socialLinks:{linkedIn:"",twitter:"",github:"",medium:"",portfolio:"",youtube:""}}),[h,u]=p.useState(!1);p.useEffect(()=>{i&&g({socialLinks:i.socialLinks||{linkedIn:"",twitter:"",github:"",medium:"",portfolio:"",youtube:""}})},[i]);const x=(c,f)=>{g(m=>({...m,socialLinks:{...m.socialLinks,[c]:f}})),u(!0)},r=async()=>{h&&(await o({socialLinks:n.socialLinks}),u(!1))},b=[{key:"linkedIn",label:"LinkedIn",icon:Q,placeholder:"https://linkedin.com/in/yourprofile",color:"#0A66C2"},{key:"twitter",label:"Twitter / X",icon:ee,placeholder:"https://twitter.com/yourhandle",color:"#1DA1F2"},{key:"github",label:"GitHub",icon:Z,placeholder:"https://github.com/yourusername",color:"#333"},{key:"medium",label:"Medium",icon:Y,placeholder:"https://medium.com/@yourprofile",color:"#000"},{key:"portfolio",label:"Portfolio",icon:_,placeholder:"https://yourportfolio.com",color:"#059669"},{key:"youtube",label:"YouTube",icon:ae,placeholder:"https://youtube.com/c/yourchannel",color:"#FF0000"}];return e.jsxs("div",{className:"social-section",children:[e.jsxs("div",{className:"section-header",children:[e.jsxs("div",{children:[e.jsx("h2",{children:"Social & Links"}),e.jsx("p",{children:"Add your social profiles and portfolio links"})]}),e.jsxs("button",{className:`save-btn ${h?"":"disabled"}`,onClick:r,disabled:l||!h,children:[l?e.jsx(E,{size:16,className:"spin"}):e.jsx(I,{size:16}),l?"Saving...":"Save Changes"]})]}),e.jsx("div",{className:"form-card",children:e.jsx("div",{className:"social-grid",children:b.map(c=>{const f=c.icon;return e.jsxs("div",{className:"social-input-group",children:[e.jsxs("div",{className:"input-label",children:[e.jsx(f,{size:18,style:{color:c.color}}),e.jsx("label",{children:c.label})]}),e.jsx("input",{type:"url",value:n.socialLinks[c.key]||"",onChange:m=>x(c.key,m.target.value),placeholder:c.placeholder}),n.socialLinks[c.key]&&e.jsx("a",{href:n.socialLinks[c.key],target:"_blank",rel:"noopener noreferrer",className:"preview-link",children:"Preview"})]},c.key)})})}),e.jsx("style",{jsx:!0,children:`
        .social-section {
          padding: 32px;
          max-width: 800px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 32px;
        }

        .section-header h2 {
          font-size: 24px;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 4px 0;
        }

        .section-header p {
          color: #64748b;
          margin: 0;
        }

        .save-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: #1A237E;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .save-btn:hover:not(.disabled) {
          background: #3949AB;
        }

        .save-btn.disabled {
          background: #94a3b8;
          cursor: not-allowed;
        }

        .spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .form-card {
          background: white;
          border-radius: 12px;
          padding: 32px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .social-grid {
          display: grid;
          gap: 24px;
        }

        .social-input-group {
          position: relative;
        }

        .input-label {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }

        .input-label label {
          font-size: 14px;
          font-weight: 600;
          color: #1e293b;
        }

        .social-input-group input {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          font-size: 14px;
          transition: all 0.2s;
        }

        .social-input-group input:focus {
          outline: none;
          border-color: #1A237E;
          box-shadow: 0 0 0 3px rgba(26, 35, 126, 0.1);
        }

        .preview-link {
          position: absolute;
          right: 12px;
          top: 42px;
          font-size: 12px;
          color: #1A237E;
          font-weight: 600;
          text-decoration: none;
        }

        .preview-link:hover {
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .social-section {
            padding: 20px;
          }

          .section-header {
            flex-direction: column;
            gap: 16px;
          }

          .save-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `})]})},Ne=()=>{const{user:i}=M(),[l,o]=p.useState("bio"),{profile:n,sessionStats:g,sessions:h,sessionStatusCounts:u,loading:x,saving:r,error:b,fetchSessions:c,updateProfile:f,addBusyDate:m,removeBusyDate:N}=se(),w=()=>{switch(l){case"bio":return e.jsx(ie,{profile:n,saving:r,onUpdate:f});case"schedule":return e.jsx(re,{profile:n,saving:r,onUpdate:f,onAddBusyDate:m,onRemoveBusyDate:N});case"sessions":return e.jsx(oe,{sessions:h,statusCounts:u,onFetchSessions:c});case"social":return e.jsx(le,{profile:n,saving:r,onUpdate:f});default:return null}};return x?e.jsxs("div",{className:"loading-container",children:[e.jsx(E,{size:48,className:"animate-spin"}),e.jsx("p",{children:"Loading your mentor profile..."}),e.jsx("style",{jsx:!0,children:`
          .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background: #f8fafc;
            color: #1A237E;
          }
          .loading-container p {
            margin-top: 16px;
            color: #64748b;
          }
          .animate-spin {
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `})]}):b?e.jsxs("div",{className:"error-container",children:[e.jsx("h2",{children:"Error Loading Profile"}),e.jsx("p",{children:b}),e.jsx("style",{jsx:!0,children:`
          .error-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background: #f8fafc;
          }
          .error-container h2 {
            color: #ef4444;
            margin-bottom: 8px;
          }
          .error-container p {
            color: #64748b;
          }
        `})]}):e.jsxs("div",{className:"mentor-profile-page",children:[e.jsx(H,{position:"top-right"}),e.jsx(ne,{activeSection:l,onSectionChange:o,profile:n,user:i,sessionStats:g}),e.jsx("main",{className:"mentor-profile-content",children:w()}),e.jsx("style",{jsx:!0,children:`
        .mentor-profile-page {
          display: flex;
          min-height: 100vh;
          background: #f8fafc;
        }

        .mentor-profile-content {
          flex: 1;
          min-height: 100vh;
          overflow-y: auto;
          background: #f8fafc;
        }

        @media (max-width: 768px) {
          .mentor-profile-page {
            flex-direction: column;
          }

          .mentor-profile-content {
            min-height: auto;
          }
        }
      `})]})};export{Ne as default};
