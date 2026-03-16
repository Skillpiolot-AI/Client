import{r as o,f as P,a as _,j as e,X as O,L as U}from"./index-CT4LdIGq.js";import{C as g}from"./calendar-h-rglJe2.js";import{C as W}from"./clock-S20zQJ0I.js";import{C as j}from"./circle-alert-DutWdHqq.js";import{M as R}from"./message-square-Bgz7p_g6.js";const H=({isOpen:B,onClose:p,mentor:a,onConfirmBooking:z,isBooking:b,bookingService:l=null,couponCode:I=null,couponResult:r=null})=>{var w;const[i,E]=o.useState(""),[c,u]=o.useState(""),[f,A]=o.useState(""),[v,L]=o.useState(""),[h,d]=o.useState([]),[k,N]=o.useState(!1),[y,S]=o.useState(null),[C,m]=o.useState("");o.useEffect(()=>{i&&a?M(i):(d([]),m("")),u("")},[i,a]);const M=async s=>{N(!0),S(null),m("");try{const n=a.mentorProfileId||a.id||a._id,t=(await P.get(`${_.API_BASE_URL}/bookings/available-slots/${n}?date=${s}`)).data;t.isBusyDate||t.isWeeklyUnavailable?(d([]),m(t.message||"Mentor is unavailable on this date")):(d(t.slots||[]),t.availableCount===0&&m("All slots are booked for this date"))}catch(n){console.error("Error fetching slots:",n),S("Failed to load available slots"),d([])}finally{N(!1)}};if(!B||!a)return null;const T=()=>{const s=[],n=new Date;for(let x=1;x<=7;x++){const t=new Date(n);t.setDate(n.getDate()+x),s.push({value:t.toISOString().split("T")[0],label:t.toLocaleDateString("en-IN",{weekday:"short",month:"short",day:"numeric"}),dayName:t.toLocaleDateString("en-IN",{weekday:"long"})})}return s},$=()=>{if(!i||!c)return;const s=new Date(`${i}T${c}:00`);z({mentorProfileId:a.mentorProfileId||a.id||a._id,serviceId:l?l._id:void 0,couponCode:I||void 0,scheduledAt:s.toISOString(),duration:l?l.duration||60:a.sessionDuration||60,remark:f.trim(),topics:v.split(",").map(n=>n.trim()).filter(Boolean)})},F=T(),D=h.filter(s=>s.isAvailable);return h.filter(s=>s.isBooked),e.jsxs("div",{className:"booking-modal-overlay",onClick:p,children:[e.jsxs("div",{className:"booking-modal",onClick:s=>s.stopPropagation(),children:[e.jsxs("div",{className:"booking-modal-header",children:[e.jsxs("div",{className:"booking-modal-title",children:[e.jsx(g,{size:24}),e.jsx("h2",{children:l?l.title:"Book a Session"})]}),e.jsx("button",{className:"close-btn",onClick:p,children:e.jsx(O,{size:24})})]}),e.jsxs("div",{className:"booking-mentor-info",children:[e.jsx("img",{src:a.profileImage||`https://ui-avatars.com/api/?name=${encodeURIComponent(a.displayName||a.name)}&size=80&background=random`,alt:a.displayName||a.name}),e.jsxs("div",{children:[e.jsx("h3",{children:a.displayName||a.name}),e.jsx("p",{children:a.jobTitle||"Mentor"}),l?r!=null&&r.valid?e.jsxs("span",{className:"price-badge",style:{background:"#D1FAE5",color:"#059669",fontWeight:700},children:["₹",r.finalPrice," ",e.jsxs("span",{style:{textDecoration:"line-through",fontWeight:400,fontSize:"12px"},children:["₹",l.price]})]}):l.isFree?e.jsx("span",{className:"free-badge",children:"🎁 FREE"}):e.jsxs("span",{className:"price-badge",children:["₹",l.price]}):a.isFree?e.jsx("span",{className:"free-badge",children:"🎁 FREE Session"}):e.jsxs("span",{className:"price-badge",children:["₹",((w=a.trialSession)==null?void 0:w.price)||199]})]})]}),e.jsxs("div",{className:"booking-section",children:[e.jsxs("label",{children:[e.jsx(g,{size:16}),"Select Date (Next 7 Days)"]}),e.jsx("div",{className:"date-grid",children:F.map(s=>e.jsxs("button",{className:`date-btn ${i===s.value?"selected":""}`,onClick:()=>E(s.value),children:[e.jsx("span",{className:"day-name",children:s.label.split(",")[0]}),e.jsx("span",{className:"day-date",children:s.label.split(",")[1]||s.label})]},s.value))})]}),e.jsxs("div",{className:"booking-section",children:[e.jsxs("label",{children:[e.jsx(W,{size:16}),"Select Time",i&&!k&&D.length>0&&e.jsxs("span",{className:"slot-count",children:["(",D.length," available)"]})]}),i?k?e.jsxs("div",{className:"slots-loading",children:[e.jsx(U,{size:24,className:"spin"}),e.jsx("p",{children:"Loading available slots..."})]}):y?e.jsxs("div",{className:"slots-error",children:[e.jsx(j,{size:24}),e.jsx("p",{children:y})]}):C?e.jsxs("div",{className:"slots-unavailable",children:[e.jsx(j,{size:24}),e.jsx("p",{children:C})]}):e.jsx("div",{className:"time-grid",children:h.map(s=>e.jsxs("button",{className:`time-btn ${c===s.time?"selected":""} ${s.isBooked?"booked":""}`,onClick:()=>!s.isBooked&&u(s.time),disabled:s.isBooked,children:[s.label,s.isBooked&&e.jsx("span",{className:"booked-label",children:"Booked"})]},s.time))}):e.jsxs("div",{className:"slots-placeholder",children:[e.jsx(g,{size:24}),e.jsx("p",{children:"Please select a date to see available slots"})]})]}),e.jsxs("div",{className:"booking-section",children:[e.jsxs("label",{children:[e.jsx(R,{size:16}),"Message to Mentor (Optional)"]}),e.jsx("textarea",{value:f,onChange:s=>A(s.target.value),placeholder:"Tell the mentor what you'd like to discuss...",maxLength:500,rows:3})]}),e.jsxs("div",{className:"booking-section",children:[e.jsx("label",{children:"Topics to Discuss (comma separated)"}),e.jsx("input",{type:"text",value:v,onChange:s=>L(s.target.value),placeholder:"e.g., Career guidance, Resume review, Interview prep"})]}),e.jsxs("div",{className:"booking-info-note",children:[e.jsx(j,{size:16}),e.jsx("p",{children:"You'll receive a confirmation email with the Jitsi meeting link. Both you and your mentor will get reminders before the session."})]}),e.jsxs("div",{className:"booking-modal-actions",children:[e.jsx("button",{className:"btn-cancel",onClick:p,children:"Cancel"}),e.jsx("button",{className:"btn-confirm",onClick:$,disabled:!i||!c||b,children:b?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner"}),"Booking..."]}):e.jsx(e.Fragment,{children:"Confirm Booking"})})]})]}),e.jsx("style",{jsx:!0,children:`
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
            `})]})};export{H as B};
