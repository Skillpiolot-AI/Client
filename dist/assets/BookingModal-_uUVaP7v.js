import{r as o,f as O,a as U,j as e,X as W,L as R}from"./index-CqOrpR9s.js";import{C as g}from"./calendar-i0r9Fllk.js";import{C as q}from"./clock-BE5RYPly.js";import{C as j}from"./circle-alert-ChriExGJ.js";import{M as J}from"./message-square-DcavSdre.js";const Q=({isOpen:I,onClose:x,mentor:a,mentorProfileId:b,onConfirmBooking:z,isBooking:u,bookingService:l=null,couponCode:E=null,couponResult:c=null})=>{var B;const[i,T]=o.useState(""),[d,f]=o.useState(""),[v,A]=o.useState(""),[k,L]=o.useState(""),[h,m]=o.useState([]),[N,y]=o.useState(!1),[S,C]=o.useState(null),[D,p]=o.useState("");o.useEffect(()=>{i&&a?M(i):(m([]),p("")),f("")},[i,a]);const M=async s=>{y(!0),C(null),p("");try{const n=b||a.mentorProfileId||a.id||a._id,t=(await O.get(`${U.API_BASE_URL}/bookings/available-slots/${n}?date=${s}`)).data;t.isBusyDate||t.isWeeklyUnavailable?(m([]),p(t.message||"Mentor is unavailable on this date")):(m(t.slots||[]),t.availableCount===0&&p("All slots are booked for this date"))}catch(n){console.error("Error fetching slots:",n),C("Failed to load available slots"),m([])}finally{y(!1)}};if(!I||!a)return null;const $=()=>{const s=[],n=new Date;for(let r=0;r<=7;r++){const t=new Date(n);t.setDate(n.getDate()+r);const _=r===0;s.push({value:t.toISOString().split("T")[0],label:_?"Today":t.toLocaleDateString("en-IN",{weekday:"short",month:"short",day:"numeric"}),dayName:t.toLocaleDateString("en-IN",{weekday:"long"})})}return s},F=()=>{if(!i||!d)return;const s=new Date(`${i}T${d}:00`),n=b||a.mentorProfileId||a.id||a._id;z({mentorProfileId:n,serviceId:l?l._id:void 0,couponCode:E||void 0,scheduledAt:s.toISOString(),duration:l?l.duration||60:a.sessionDuration||60,remark:v.trim(),topics:k.split(",").map(r=>r.trim()).filter(Boolean)})},P=$(),w=h.filter(s=>s.isAvailable);return h.filter(s=>s.isBooked),e.jsxs("div",{className:"booking-modal-overlay",onClick:x,children:[e.jsxs("div",{className:"booking-modal",onClick:s=>s.stopPropagation(),children:[e.jsxs("div",{className:"booking-modal-header",children:[e.jsxs("div",{className:"booking-modal-title",children:[e.jsx(g,{size:24}),e.jsx("h2",{children:l?l.title:"Book a Session"})]}),e.jsx("button",{className:"close-btn",onClick:x,children:e.jsx(W,{size:24})})]}),e.jsxs("div",{className:"booking-mentor-info",children:[e.jsx("img",{src:a.profileImage||`https://ui-avatars.com/api/?name=${encodeURIComponent(a.displayName||a.name)}&size=80&background=random`,alt:a.displayName||a.name}),e.jsxs("div",{children:[e.jsx("h3",{children:a.displayName||a.name}),e.jsx("p",{children:a.jobTitle||"Mentor"}),l?c!=null&&c.valid?e.jsxs("span",{className:"price-badge",style:{background:"#D1FAE5",color:"#059669",fontWeight:700},children:["₹",c.finalPrice," ",e.jsxs("span",{style:{textDecoration:"line-through",fontWeight:400,fontSize:"12px"},children:["₹",l.price]})]}):l.isFree?e.jsx("span",{className:"free-badge",children:"🎁 FREE"}):e.jsxs("span",{className:"price-badge",children:["₹",l.price]}):a.isFree?e.jsx("span",{className:"free-badge",children:"🎁 FREE Session"}):e.jsxs("span",{className:"price-badge",children:["₹",((B=a.trialSession)==null?void 0:B.price)||199]})]})]}),e.jsxs("div",{className:"booking-section",children:[e.jsxs("label",{children:[e.jsx(g,{size:16}),"Select Date (Next 8 Days)"]}),e.jsx("div",{className:"date-grid",children:P.map(s=>e.jsxs("button",{className:`date-btn ${i===s.value?"selected":""}`,onClick:()=>T(s.value),children:[e.jsx("span",{className:"day-name",children:s.label.split(",")[0]}),e.jsx("span",{className:"day-date",children:s.label.split(",")[1]||s.label})]},s.value))})]}),e.jsxs("div",{className:"booking-section",children:[e.jsxs("label",{children:[e.jsx(q,{size:16}),"Select Time",i&&!N&&w.length>0&&e.jsxs("span",{className:"slot-count",children:["(",w.length," available)"]})]}),i?N?e.jsxs("div",{className:"slots-loading",children:[e.jsx(R,{size:24,className:"spin"}),e.jsx("p",{children:"Loading available slots..."})]}):S?e.jsxs("div",{className:"slots-error",children:[e.jsx(j,{size:24}),e.jsx("p",{children:S})]}):D?e.jsxs("div",{className:"slots-unavailable",children:[e.jsx(j,{size:24}),e.jsx("p",{children:D})]}):e.jsx("div",{className:"time-grid",children:h.map(s=>e.jsxs("button",{className:`time-btn ${d===s.time?"selected":""} ${s.isBooked?"booked":""}`,onClick:()=>!s.isBooked&&f(s.time),disabled:s.isBooked,children:[s.label,s.isBooked&&e.jsx("span",{className:"booked-label",children:"Booked"})]},s.time))}):e.jsxs("div",{className:"slots-placeholder",children:[e.jsx(g,{size:24}),e.jsx("p",{children:"Please select a date to see available slots"})]})]}),e.jsxs("div",{className:"booking-section",children:[e.jsxs("label",{children:[e.jsx(J,{size:16}),"Message to Mentor (Optional)"]}),e.jsx("textarea",{value:v,onChange:s=>A(s.target.value),placeholder:"Tell the mentor what you'd like to discuss...",maxLength:500,rows:3})]}),e.jsxs("div",{className:"booking-section",children:[e.jsx("label",{children:"Topics to Discuss (comma separated)"}),e.jsx("input",{type:"text",value:k,onChange:s=>L(s.target.value),placeholder:"e.g., Career guidance, Resume review, Interview prep"})]}),e.jsxs("div",{className:"booking-info-note",children:[e.jsx(j,{size:16}),e.jsx("p",{children:"You'll receive a confirmation email with the Jitsi meeting link. Both you and your mentor will get reminders before the session."})]}),e.jsxs("div",{className:"booking-modal-actions",children:[e.jsx("button",{className:"btn-cancel",onClick:x,children:"Cancel"}),e.jsx("button",{className:"btn-confirm",onClick:F,disabled:!i||!d||u,children:u?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner"}),"Booking..."]}):e.jsx(e.Fragment,{children:"Confirm Booking"})})]})]}),e.jsx("style",{jsx:!0,children:`
                .slots-placeholder,
                .slots-loading,
                .slots-error,
                .slots-unavailable {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 24px;
                    background: #f8fafc;
                    border-radius: 12px;
                    color: #64748b;
                    text-align: center;
                    gap: 8px;
                }

                .slots-error {
                    background: #fef2f2;
                    color: #dc2626;
                }

                .slots-unavailable {
                    background: #fef3c7;
                    color: #d97706;
                }

                .slot-count {
                    font-weight: normal;
                    color: #059669;
                    margin-left: 8px;
                }

                .time-btn.booked {
                    background: #fee2e2 !important;
                    color: #dc2626 !important;
                    border-color: #fecaca !important;
                    cursor: not-allowed;
                    position: relative;
                    opacity: 0.8;
                }

                .time-btn .booked-label {
                    display: block;
                    font-size: 9px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    margin-top: 2px;
                }

                .spin {
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `})]})};export{Q as B};
