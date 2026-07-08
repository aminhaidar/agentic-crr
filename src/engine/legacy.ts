// @ts-nocheck
/*
 * Ported application engine for the Agentic CRR Operator prototype.
 * Original proven prototype logic, transcribed verbatim into a TypeScript
 * module so behavior + styling stay pixel-identical to the source. It renders
 * view content into React-owned container nodes and is driven by handlers
 * exposed on window (called by inline onclick attributes in generated markup).
 */
import mermaid from "mermaid";
import DOCS_RAW_JSON from "../data/docs_raw.json";


const DOCS_RAW = (DOCS_RAW_JSON);

/* ---- next script block ---- */

const IC={
  op:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3l2.5 5.5L20 11l-5.5 2.5L12 19l-2.5-5.5L4 11l5.5-2.5z" stroke-linejoin="round"/></svg>',
  doc:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/></svg>',
  scope:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="8"/><path d="M12 4v16M4 12h16"/></svg>',
  pkg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M4 7.5l8 4.5 8-4.5M12 12v9"/></svg>',
  audit:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M9 11l2 2 4-4"/><circle cx="12" cy="12" r="8.5"/></svg>',
  agents:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M12 2l2 4.5L18.5 8 14 9.5 12 14l-2-4.5L5.5 8 10 6.5z"/></svg>',
  bell:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 9a6 6 0 1112 0c0 5 2 6 2 6H4s2-1 2-6z"/><path d="M10 20a2 2 0 004 0"/></svg>',
  clock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>',
  clockMini:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  chatDot:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 5h16v11H8l-4 4z"/></svg>',
  sched:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>',
  check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>',
  chev:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 6l6 6-6 6"/></svg>',
};
const PEOPLE={
  dr:{name:'Julie Ruiz',av:'dr'}, sc:{name:'Sarah Chen',av:'sc'}, mk:{name:'Maria Keller',av:'mk'},
  jd:{name:'James Doyle',av:'jd'}, tr:{name:'Tom Reyes',av:'tr'},
};
const STATUS_META={
  needs_you:{label:'Needs review',cls:'blue'}, waiting:{label:'Waiting',cls:'amber'},
  active:{label:'Active',cls:'green'}, done:{label:'Filed',cls:'grey'},
};
const av=(k)=>`<div class="av ${k}">${({dr:'JR',sc:'SC',mk:'MK',jd:'JD',tr:'TR'})[k]||''}</div>`;

let sessions=[
  {id:'be11-fy25',code:'BE-11',title:'BE-11 · FY25',sub:'Direct Investment Abroad · BEA',kind:'filing',engine:'be11',pinned:true,status:'needs_you',pct:92,people:['dr','sc'],updated:'2m ago',updatedSort:1,waitingOn:null,stagePhase:6,startDate:'2026-04-01',dueDate:'2026-07-10',dataDueDate:'2026-06-19'},
  {id:'cbcr-fy25',code:'CbCR',title:'Country-by-Country · FY25',sub:'Form 8975 · IRS/OECD',kind:'filing',engine:'history',pinned:true,status:'waiting',pct:38,people:['dr','sc'],updated:'38m ago',updatedSort:2,startDate:'2026-06-15',dueDate:'2026-09-15',dataDueDate:'2026-08-14',
   waitingOn:{who:'sc',reason:'Scope sign-off requested',since:'38m ago'},stagePhase:1,
   history:[
     {kind:'op',lvl:'recommend',html:`<p>From the same subsidiary and financial data behind BE-11, I also see a <strong>Country-by-Country</strong> obligation — your group is above the €750M consolidated-revenue threshold (Form 8975).</p>`},
     {kind:'user',text:'Prepare the scope plan'},
     {kind:'agents',agents:[{n:'Scope & Entity',p:'Grouped 6 tax jurisdictions by recommended outcome',status:'done'},{n:'Validation & Readiness',p:'Cross-checked the €750M consolidated-revenue threshold',status:'done'}]},
     {kind:'op',lvl:'prepare',html:`<p>Here's the <strong>scope plan</strong> — 6 tax jurisdictions grouped by outcome. My cross-check found no blocking issues; 1 item needs your review.</p><div class="kv"><span class="kk">Recommended</span><span>5 reporting · 1 needs confirmation</span><span class="kk">Cross-check</span><span>No blocking issues</span></div>`,
      actionsHtml:`<button class="action-btn" onclick="openModal('cbcr-scope')"><span>Open the scope plan</span><span class="lvl read">Read</span></button>`},
     {kind:'sys',text:'Sent to Sarah Chen (Controller) for scope approval'},
   ],
   resolve:{lvl:'commit',html:`<p><strong>Scope confirmed by Sarah Chen.</strong> She reviewed what changed and the cross-check, then confirmed.</p><div class="attrib">${av('sc')} Recorded with user, timestamp, scope version &amp; rule-pack version</div>`,notifText:'Sarah Chen confirmed CbCR scope',newStatus:'active'}},
  {id:'be577-q2',code:'BE-577',title:'BE-577 · Q2',sub:'Quarterly Transactions · BEA',kind:'filing',engine:'history',pinned:false,status:'waiting',pct:64,people:['dr','jd'],updated:'5h ago',updatedSort:3,startDate:'2026-06-20',dueDate:'2026-07-03',dataDueDate:'2026-06-30',
   waitingOn:{who:'tr',reason:'Data request outstanding',since:'5h ago'},stagePhase:3,
   history:[
     {kind:'op',lvl:'recommend',html:`<p><strong>BE-577 Q2 readiness review is ready.</strong> 8 reporting entities, standard scoping — no AI recommendation is used for this form class.</p>`},
     {kind:'user',text:'Prepare the missing-data requests'},
     {kind:'agents',agents:[{n:'Collection & Chase',p:'Sent 4 tracked requests, chasing 1 outstanding owner (Tom Reyes)',status:'run'}]},
     {kind:'op',lvl:'prepare',html:`<p>4 requests sent — 3 answered, 1 outstanding.</p><div class="inbubble"><div class="lab">Preview → Tom Reyes, Brazil Finance</div>"For the Q2 BE-577 filing, please confirm the intercompany balance transferred to the US parent this quarter."</div>`},
     {kind:'sys',text:'Sent to Tom Reyes — Brazil Finance'},
   ],
   resolve:{lvl:'commit',html:`<p>Tom Reyes replied with the Brazil intercompany balance. Mapped to Item 4, evidence attached.</p><div class="attrib">${av('tr')} Tom Reyes · Brazil Finance</div>`,notifText:'Tom Reyes replied on BE-577 · Q2',newStatus:'active'}},
  {id:'sf425-q2',code:'SF-425',title:'SF-425 · Q2',sub:'Federal Financial Report · GSA',kind:'filing',engine:'history',pinned:false,status:'active',pct:22,people:['dr'],updated:'12m ago',updatedSort:4,startDate:'2026-06-25',dueDate:'2026-07-31',dataDueDate:'2026-07-17',
   waitingOn:null,stagePhase:2,
   history:[
     {kind:'op',lvl:'recommend',html:`<p>Obligation Scout flagged that an <strong>SF-425</strong> (Federal Financial Report) may be due this quarter, based on your federal award activity.</p>`},
     {kind:'user',text:'Yes, start it'},
     {kind:'agents',agents:[{n:'Source Discovery & Ingestion',p:'Located your federal award & drawdown data',status:'done'},{n:'Mapping & Resolve',p:'Matching award data to SF-425 line items',status:'run'}]},
     {kind:'op',lvl:'prepare',html:`<p>The Mapping &amp; Resolve agent is matching your award data to the SF-425 line items on USDA Award #4471. No input needed from you right now — I'll flag anything that needs a decision.</p><div class="kv"><span class="kk">Mapped so far</span><span>9 of 14 line items</span><span class="kk">Status</span><span>Running</span></div>`},
   ]},
  {id:'be11-fy24',code:'BE-11',title:'BE-11 · FY24',sub:'Direct Investment Abroad · BEA',kind:'filing',engine:'history',pinned:false,status:'done',pct:100,people:['dr','sc'],updated:'Apr 14',updatedSort:5,startDate:'2026-01-10',dueDate:'2026-04-15',dataDueDate:'2026-03-15',
   waitingOn:null,stagePhase:7,
   history:[
     {kind:'op',lvl:'commit',html:`<p><strong>BE-11 FY24 is filed and closed.</strong> 40 affiliates, 0 blocking issues, approved by Sarah Chen on Apr 12.</p>`},
     {kind:'sys',text:'Package staged · next-year baseline saved'},
     {kind:'op',lvl:'read',html:`<p>One correction was applied after initial mapping: Item 12 for Meridian Trading Pte was restated with SME sign-off, recorded in the audit trail.</p>`,
      actionsHtml:`<button class="action-btn" onclick="openArtifact('Audits',3)"><span>Open the audit trail</span><span class="lvl read">Read</span></button>`},
   ]},
  {id:'be577-q1',code:'BE-577',title:'BE-577 · Q1',sub:'Quarterly Transactions · BEA',kind:'filing',engine:'history',pinned:false,status:'done',pct:100,people:['dr'],updated:'Apr 2',updatedSort:6,startDate:'2026-03-27',dueDate:'2026-04-03',dataDueDate:'2026-03-31',
   waitingOn:null,stagePhase:7,
   history:[
     {kind:'op',lvl:'commit',html:`<p><strong>BE-577 Q1 is filed and closed.</strong> All 8 entities reported, approved on Apr 2.</p>`},
     {kind:'op',lvl:'read',html:`<p>Operating history saved — this cycle took 6 days from front door to close, with no rework.</p>`,
      actionsHtml:`<button class="action-btn" onclick="openArtifact('Packages',2)"><span>Open the filing package</span><span class="lvl read">Read</span></button>`},
   ]},
  {id:'be11-fy23',code:'BE-11',title:'BE-11 · FY23',sub:'Direct Investment Abroad · BEA',kind:'filing',engine:'history',pinned:false,status:'done',archived:true,pct:100,people:['dr','sc'],updated:'May 2024',updatedSort:8,startDate:'2024-02-01',dueDate:'2024-05-15',dataDueDate:'2024-04-15',
   waitingOn:null,stagePhase:7,
   history:[
     {kind:'op',lvl:'commit',html:`<p><strong>BE-11 FY23 is filed and archived.</strong> 38 affiliates, approved and submitted May 2024.</p>`},
     {kind:'op',lvl:'read',html:`<p>Retained for audit — full evidence bundle, provenance, and approval record preserved.</p>`},
   ]},
  {id:'be125-fy23',code:'BE-125',title:'BE-125 · FY23',sub:'Services & IP Transactions · BEA',kind:'filing',engine:'history',pinned:false,status:'done',archived:true,pct:100,people:['dr'],updated:'Feb 2024',updatedSort:9,startDate:'2024-01-10',dueDate:'2024-02-15',dataDueDate:'2024-01-31',
   waitingOn:null,stagePhase:7,
   history:[
     {kind:'op',lvl:'commit',html:`<p><strong>BE-125 FY23 is filed and archived.</strong> Quarterly services & IP transactions, submitted Feb 2024.</p>`},
   ]},
  {id:'chat-portfolio',code:'AI',title:'Portfolio review',sub:'Ad-hoc question',kind:'chat',engine:'chatlog',pinned:false,status:'done',pct:null,people:['dr'],updated:'Yesterday',updatedSort:7,waitingOn:null,
   history:[
     {kind:'user',text:"What's our BE-11 exposure this year?"},
     {kind:'op',lvl:'read',html:`<p>Based on current entity data, <strong>42 foreign affiliates</strong> are in scope for FY25 — 31 unchanged from last year, 6 need ownership confirmation, 5 aren't decidable until current-year financials arrive. This is read-only — I'm not proposing any change here.</p>`},
   ]},
];

let notifications=[
  {id:1,sessionId:'sf425-q2',text:'Obligation Scout detected a new filing: SF-425',time:'1h ago',read:false},
  {id:2,sessionId:'cbcr-fy25',text:'CbCR scope plan sent to Sarah Chen for approval',time:'38m ago',read:true},
];

/* ---------- Source data ---------- */
let dataSources=[
  {id:'netsuite',name:'NetSuite ERP',type:'connector',detail:'FY25 financials · assets, revenue, net income, tax',last:'Synced 2h ago',linked:['BE-11','SF-425','BE-577']},
  {id:'consol',name:'Consolidation system',type:'connector',detail:'Ownership graph · intercompany balances',last:'Synced 1d ago',linked:['BE-11','CbCR']},
  {id:'hris',name:'HRIS export',type:'connector',detail:'Year-end employee counts',last:'Synced 3d ago',linked:['BE-11']},
  {id:'teams',name:'Email &amp; Teams',type:'connector',detail:'Data collection &amp; chase channel',last:'Live',linked:['BE-11','BE-577']},
];
let uploadedSources=[
  {id:'up-brazil',name:'Brazil_FY25_industry_class.xlsx',type:'upload',detail:'Industry classification · Brazil Services Ltda',last:'Uploaded 1h ago · accepted as governed fact',linked:['BE-11']},
];

/* ---------- Per-filing dashboard content ---------- */
const FILING_DASH={
  'be11-fy25':{
    agents:[
      {n:'Obligation Scout',out:'Detected 42 affiliates in scope · 5 not-yet-decidable',status:'done',art:['Audits',1]},
      {n:'Scope & Entity',out:'Grouped 42 by outcome · cross-check passed',status:'done',art:['Projects',0]},
      {n:'Mapping & Resolve',out:'18 fields mapped high-confidence · 7 flagged',status:'done',art:['Projects',1]},
      {n:'Collection & Chase',out:'8 requests sent · 6 replies accepted',status:'run',art:null},
      {n:'Validation & Readiness',out:'92% ready · 0 blocking · 3 warnings',status:'run',art:['Projects',2]},
      {n:'Review & Approval',out:'Judgment ledger prepared — awaiting Sarah Chen\'s signature',status:'run',art:['Audits',0]},
    ],
    pending:[{sev:'info',t:'Final approval — Sarah Chen',m:'Judgment ledger ready; awaiting signature',cta:{label:'Open judgment ledger',act:"openModal('ledger')"}}],
    attention:[
      {sev:'warn',t:'3 validation warnings',m:'Prior-period variance on 3 affiliates — resolved, for visibility',cta:{label:'Review warnings',act:"openArtifact('Projects',2)"}},
      {sev:'warn',t:'2 evidence items pending',m:'Awaiting attachment before package is final',cta:{label:'Add evidence',act:"showToast('Opening evidence checklist (mock)')"}},
    ]},
  'cbcr-fy25':{
    agents:[
      {n:'Obligation Scout',out:'Above €750M threshold · Form 8975 required',status:'done',art:null},
      {n:'Scope & Entity',out:'6 tax jurisdictions grouped · 1 needs review',status:'done',art:['Projects',3]},
    ],
    pending:[{sev:'info',t:'Scope sign-off — Sarah Chen',m:'Sent 38m ago; awaiting confirmation',cta:{label:'View scope plan',act:"openModal('cbcr-scope')"}}],
    attention:[{sev:'block',t:'Blocked on scope approval',m:'Mapping can\'t start until scope is confirmed',cta:{label:'Send reminder',act:"openSessionById('cbcr-fy25');sendReminder('cbcr-fy25')"}}]},
  'be577-q2':{
    agents:[
      {n:'Scope & Entity',out:'8 reporting entities · standard scoping',status:'done',art:null},
      {n:'Collection & Chase',out:'3 of 4 requests answered',status:'run',art:null},
    ],
    pending:[],
    attention:[{sev:'block',t:'Brazil intercompany balance overdue',m:'Tom Reyes hasn\'t responded — 5h overdue',cta:{label:'Send reminder',act:"openSessionById('be577-q2');sendReminder('be577-q2')"}}]},
  'sf425-q2':{
    agents:[
      {n:'Obligation Scout',out:'Flagged from federal award activity',status:'done',art:null},
      {n:'Mapping & Resolve',out:'9 of 14 line items mapped on USDA Award #4471 · running',status:'run',art:null},
    ],
    pending:[],
    attention:[]},
  'be11-fy24':{
    agents:[
      {n:'Full lifecycle',out:'40 affiliates · filed & closed Apr 12',status:'done',art:['Packages',3]},
      {n:'Review & Approval',out:'Approved by Sarah Chen · 1 restatement recorded',status:'done',art:['Audits',3]},
    ],
    pending:[],
    attention:[]},
  'be577-q1':{
    agents:[{n:'Full lifecycle',out:'8 entities · filed Apr 2 · 6-day cycle, no rework',status:'done',art:['Packages',2]}],
    pending:[],
    attention:[]},
  'be11-fy23':{
    agents:[{n:'Full lifecycle',out:'38 affiliates · filed & archived May 2024',status:'done',art:null}],
    pending:[],
    attention:[]},
  'be125-fy23':{
    agents:[{n:'Full lifecycle',out:'Services & IP transactions · archived Feb 2024',status:'done',art:null}],
    pending:[],
    attention:[]},
};

/* ---------- Forms within a report ----------
   A report is one obligation (e.g. BE-11 · FY25); it bundles many forms —
   for BEA, one form per entity in scope. BE-11 fans out into:
     BE-11A  — the U.S. Reporter's fully-consolidated domestic business (one per report)
     BE-11B  — each majority-owned foreign affiliate over the $60M size test
     BE-11C  — each minority-owned foreign affiliate over the $60M size test
   Each form below carries the identification + financial data the real BEA form
   collects, so a form has its own populated page. Monetary values are in $ thousands. */
const FORM_STATUS={done:{label:'Complete',cls:'green'},run:{label:'In progress',cls:'blue'},block:{label:'Blocked',cls:'red'},todo:{label:'Not started',cls:'grey'}};
const US_REPORTER='Acme Global Industries, Inc.';
const FORMS={
  'be11-fy25':{unit:'affiliate',total:42,items:[
    {id:'be11a-usr',entity:US_REPORTER,code:'BE-11A',status:'done',reporter:US_REPORTER,country:'United States',city:'Wilmington, DE',fyEnd:'12/31/2025',newAffiliate:false,
     activity:'Producer of goods',product:'Manufacture of industrial components; global holding parent',isi:'3363',employees:4800,comp:642000,rnd:96000,over300:true,netIncome:186000,sales:2140000,assets:1880000,ppe:512000,liabilities:1042000,ownersEq:838000,ppeExp:118000,
     agent:'Filing Preparation',src:'NetSuite ERP',conf:'high'},
    {id:'be11b-germany',entity:'Germany Manufacturing GmbH',code:'BE-11B',status:'done',reporter:US_REPORTER,country:'Germany',city:'Munich',fyEnd:'12/31/2025',newAffiliate:false,ownEquity:100.0,ownVoting:100.0,
     activity:'Producer of goods',product:'Manufacture industrial components to sell at wholesale',isi:'3363',employees:1240,comp:98500,rnd:12300,over300:true,netIncome:41200,sales:512800,assets:388600,ppe:142900,liabilities:176300,ownersEq:212300,ppeExp:24700,
     agent:'Filing Preparation',src:'NetSuite ERP',conf:'high'},
    {id:'be11b-meridian',entity:'Meridian Trading Pte',code:'BE-11B',status:'done',reporter:US_REPORTER,country:'Singapore',city:'Singapore',fyEnd:'12/31/2025',newAffiliate:false,ownEquity:100.0,ownVoting:100.0,
     activity:'Seller of goods the foreign affiliate does not produce',product:'Wholesale distribution of electronics',isi:'4234',employees:320,comp:41700,rnd:0,over300:false,netIncome:22800,sales:214500,assets:132400,ppe:18600,liabilities:61900,ownersEq:70500,ppeExp:4200,
     agent:'Filing Preparation',src:'NetSuite ERP',conf:'high'},
    {id:'be11b-france',entity:'France Holdings SAS',code:'BE-11B',status:'done',reporter:US_REPORTER,country:'France',city:'Paris',fyEnd:'12/31/2025',newAffiliate:false,ownEquity:100.0,ownVoting:100.0,
     activity:'Provider of services',product:'Holding company — equity investments in EMEA affiliates',isi:'5512',employees:95,comp:22400,rnd:0,over300:false,netIncome:8600,sales:64200,assets:156700,ppe:3100,liabilities:40200,ownersEq:116500,ppeExp:900,
     agent:'Filing Preparation',src:'Consolidation system',conf:'high'},
    {id:'be11b-brazil',entity:'Brazil Services Ltda',code:'BE-11B',status:'run',reporter:US_REPORTER,country:'Brazil',city:'São Paulo',fyEnd:'12/31/2025',newAffiliate:false,ownEquity:100.0,ownVoting:100.0,
     activity:'Provider of services',product:'IT and business-process services',isi:'5415',employees:210,comp:18900,rnd:1200,over300:false,netIncome:null,sales:71400,assets:null,ppe:null,liabilities:null,ownersEq:null,ppeExp:null,
     agent:'Mapping & Resolve',src:'NetSuite ERP',conf:'medium',note:'Net income and balance-sheet items awaiting the Brazil intercompany balance (data request outstanding to Tom Reyes).'},
    {id:'be11c-dutch',entity:'Dutch Peak Innovations',code:'BE-11C',status:'todo',reporter:US_REPORTER,country:'Netherlands',city:'Amsterdam',fyEnd:'12/31/2025',newAffiliate:true,ownEquity:32.5,ownVoting:32.5,
     activity:'Producer or distributor of information',product:'Software development',isi:'5112',employees:null,comp:null,rnd:null,over300:false,netIncome:null,sales:null,assets:null,ppe:null,liabilities:null,ownersEq:null,ppeExp:null,
     agent:'Obligation Scout',src:null,conf:null,note:'Newly acquired minority-owned affiliate (32.5% owned). BE-11C applicability under review — appears to cross the $60M size test at 71% confidence. Deferred until FY25 financials arrive from the affiliate controller.'},
    {id:'be11c-avikro',entity:'Avikro Consolidated',code:'BE-11C',status:'todo',reporter:US_REPORTER,country:'Ireland',city:'Dublin',fyEnd:'12/31/2025',newAffiliate:false,ownEquity:41.0,ownVoting:41.0,
     activity:'Provider of services',product:'Financial services',isi:'5223',employees:null,comp:null,rnd:null,over300:false,netIncome:null,sales:null,assets:null,ppe:null,liabilities:null,ownersEq:null,ppeExp:null,
     agent:null,src:null,conf:null,note:'Queued — the form is created once mapping reaches this affiliate.'},
  ]},
  'cbcr-fy25':{unit:'tax jurisdiction',total:6,items:[
    {id:'cbcr-us',entity:'United States',code:'8975 · Sch A',status:'todo'},
    {id:'cbcr-de',entity:'Germany',code:'8975 · Sch A',status:'todo'},
    {id:'cbcr-sg',entity:'Singapore',code:'8975 · Sch A',status:'todo'},
    {id:'cbcr-br',entity:'Brazil',code:'8975 · Sch A',status:'todo'},
  ]},
  'be577-q2':{unit:'affiliate',total:8,items:[
    {id:'be577q2-germany',entity:'Germany Manufacturing GmbH',code:'BE-577',status:'done'},
    {id:'be577q2-meridian',entity:'Meridian Trading Pte',code:'BE-577',status:'done'},
    {id:'be577q2-brazil',entity:'Brazil Services Ltda',code:'BE-577',status:'block'},
  ]},
  'sf425-q2':{unit:'federal award',total:2,items:[
    {id:'sf425q2-usda',entity:'USDA Award #4471',code:'SF-425',status:'run'},
    {id:'sf425q2-doe',entity:'DOE Award #2210',code:'SF-425',status:'todo'},
  ]},
  'be11-fy24':{unit:'affiliate',total:40,items:[
    {id:'be11a24-usr',entity:US_REPORTER,code:'BE-11A',status:'done',reporter:US_REPORTER,country:'United States',city:'Wilmington, DE',fyEnd:'12/31/2024',activity:'Producer of goods',product:'Manufacture of industrial components; global holding parent',isi:'3363',employees:4610,comp:598000,rnd:88000,over300:true,netIncome:171000,sales:1998000,assets:1740000,ppe:486000,liabilities:970000,ownersEq:770000,ppeExp:104000,agent:'Full lifecycle',src:'NetSuite ERP',conf:'high'},
    {id:'be11b24-germany',entity:'Germany Manufacturing GmbH',code:'BE-11B',status:'done',reporter:US_REPORTER,country:'Germany',city:'Munich',fyEnd:'12/31/2024',ownEquity:100.0,ownVoting:100.0,activity:'Producer of goods',product:'Manufacture industrial components to sell at wholesale',isi:'3363',employees:1190,comp:93100,rnd:11200,over300:true,netIncome:38700,sales:486300,assets:361200,ppe:138400,liabilities:169800,ownersEq:191400,ppeExp:21900,agent:'Full lifecycle',src:'NetSuite ERP',conf:'high'},
    {id:'be11b24-meridian',entity:'Meridian Trading Pte',code:'BE-11B',status:'done',reporter:US_REPORTER,country:'Singapore',city:'Singapore',fyEnd:'12/31/2024',ownEquity:100.0,ownVoting:100.0,activity:'Seller of goods the foreign affiliate does not produce',product:'Wholesale distribution of electronics',isi:'4234',employees:305,comp:39400,rnd:0,over300:false,netIncome:20900,sales:201700,assets:126800,ppe:17300,liabilities:58200,ownersEq:68600,ppeExp:3800,agent:'Full lifecycle',src:'NetSuite ERP',conf:'high'},
  ]},
  'be577-q1':{unit:'affiliate',total:8,items:[
    {id:'be577q1-germany',entity:'Germany Manufacturing GmbH',code:'BE-577',status:'done'},
    {id:'be577q1-meridian',entity:'Meridian Trading Pte',code:'BE-577',status:'done'},
  ]},
  'be11-fy23':{unit:'affiliate',total:38,items:[
    {id:'be11a23-usr',entity:US_REPORTER,code:'BE-11A',status:'done',reporter:US_REPORTER,country:'United States',city:'Wilmington, DE',fyEnd:'12/31/2023',activity:'Producer of goods',product:'Manufacture of industrial components; global holding parent',isi:'3363',employees:4470,comp:571000,over300:true,netIncome:158000,sales:1902000,assets:1655000,ppe:462000,liabilities:920000,ownersEq:735000,ppeExp:97000,agent:'Full lifecycle',src:'NetSuite ERP',conf:'high'},
    {id:'be11b23-germany',entity:'Germany Manufacturing GmbH',code:'BE-11B',status:'done',reporter:US_REPORTER,country:'Germany',city:'Munich',fyEnd:'12/31/2023',ownEquity:100.0,ownVoting:100.0,activity:'Producer of goods',product:'Manufacture industrial components to sell at wholesale',isi:'3363',employees:1150,comp:89400,over300:true,netIncome:35600,sales:471900,assets:349800,ppe:133100,liabilities:164200,ownersEq:185600,ppeExp:20400,agent:'Full lifecycle',src:'NetSuite ERP',conf:'high'},
  ]},
  'be125-fy23':{unit:'affiliate',total:6,items:[
    {id:'be125-meridian',entity:'Meridian Trading Pte',code:'BE-125',status:'done'},
  ]},
};
/* Report types offered when creating a new report — each says how it fans out into forms. */
const REPORT_TYPES=[
  {code:'BE-11',name:'Annual Survey of U.S. Direct Investment Abroad',sub:'Direct Investment Abroad · BEA',unit:'affiliate',formCode:'BE-11B',formNote:'One BE-11 form per foreign affiliate in scope.'},
  {code:'BE-577',name:'Quarterly Survey of Transactions',sub:'Quarterly Transactions · BEA',unit:'affiliate',formCode:'BE-577',formNote:'One form per affiliate with reportable transactions.'},
  {code:'BE-125',name:'Quarterly Survey of Services & IP Transactions',sub:'Services & IP Transactions · BEA',unit:'affiliate',formCode:'BE-125',formNote:'One form per affiliate with services/IP transactions.'},
  {code:'CbCR',name:'Country-by-Country Report (Form 8975)',sub:'Form 8975 · IRS/OECD',unit:'tax jurisdiction',formCode:'8975 · Sch A',formNote:'One schedule per tax jurisdiction where the group operates.'},
  {code:'SF-425',name:'Federal Financial Report',sub:'Federal Financial Report · GSA',unit:'federal award',formCode:'SF-425',formNote:'One form per federal award.'},
];
/* ---------- navigation (no dead ends) ---------- */
const titles={home:'Operator',dashboard:'Portfolio',filings:'Projects',agents:'Agents & Skills',artifacts:'Artifacts',sources:'Sources',schedules:'Schedules',settings:'Settings',docs:'Product Docs',session:'Session',filing:'Report',form:'Form',onboard:'Start a report',report:'Project'};
const globalViews=['home','dashboard','filings','artifacts','sources','schedules','settings','docs'];
const navFor={filing:'filings',form:'filings',agents:'settings',session:'',onboard:'home',report:'filings'};
const backTargets={filing:'filings',form:'filings',agents:'settings',onboard:'home',report:'home'};
let currentSessionId=null, docsInit=false;
function go(view){
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
  document.getElementById('view-'+view).classList.add('active');
  const navHi=navFor[view]!==undefined?navFor[view]:view;
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.toggle('active', n.dataset.nav===navHi));
  const sub=!globalViews.includes(view);
  const homeCrumb=document.querySelector('.crumbs .c-home');
  if(view==='report'){
    homeCrumb.textContent='Projects'; homeCrumb.onclick=()=>go('filings');
    document.getElementById('crumbCur').textContent = RPT?`${OB_TYPES[RPT.type].code} Project`:'Project';
  } else {
    homeCrumb.textContent='Operator'; homeCrumb.onclick=()=>go('home');
    document.getElementById('crumbCur').textContent=sub?titles[view]:'';
  }
  document.getElementById('crumbSep').style.display=sub?'inline':'none';
  homeCrumb.style.fontWeight=sub?'500':'600';
  homeCrumb.style.color=sub?'var(--text-3)':'var(--text)';
  const bb=document.getElementById('backbtn');
  bb.style.display=sub?'inline-flex':'none';
  bb.onclick=()=>go(backTargets[view]||'home');
  document.getElementById('activityBtn').style.display=(view==='session')?'inline-flex':'none';
  closeDrawer(); closeModal(); closeAllSessionMenus(); closeStartMenu();
  document.getElementById('notifPanel')?.classList.remove('open');
  if(view==='docs' && !docsInit){ docsInit=true; buildDocsTree(); renderDoc('INDEX.md',''); }
  document.body.classList.toggle('op-home', view==='home');
  document.body.classList.toggle('in-report', view==='report');
  if(view!=='report') closeFab();
  if(view==='home') renderOperator();
  if(view==='dashboard') renderDashboard();
  if(view==='filings') renderFilings();
  if(view==='sources') renderSources();
  updateFabCtx(view);
}
function openSessionById(id){
  const s=sessions.find(x=>x.id===id); if(!s) return;
  currentSessionId=id; go('session'); closeAllSessionMenus();
  if(s.engine==='be11'){ startFiling(true); }
  else if(s.kind==='chat'){ renderChatSession(s); }
  else { renderHistorySession(s); }
  notifications.forEach(n=>{ if(n.sessionId===id) n.read=true; });
  renderNotif(); renderSidebarSessions();
}
function newSession(){ currentSessionId=null; go('session'); startClean(); renderSidebarSessions(); }

/* ---------- Start report dropdown ---------- */
function startMenuMeta(r){
  const full=r.full||'';
  const cadence=/Quarterly/i.test(full)?'Quarterly':(/Annual/i.test(full)?'Annual':'');
  const agency=/BEA/i.test(r.agency)?'BEA':(/Census/i.test(r.agency)?'Census':r.agency);
  return [cadence,agency].filter(Boolean).join(' · ');
}
/* Keep the sidebar start menu in sync with the operator page (quick start + "Other") */
function renderStartMenu(){
  const menu=document.getElementById('startMenu'); if(!menu) return;
  const keys=[...OP_QUICK,...OP_QUICK_MORE];
  const opts=keys.map(key=>{ const r=OB_TYPES[key]; if(!r) return '';
    return `<button class="start-opt" onclick="pickStart('${key}')"><span class="start-opt-badge${r.alt?' alt':''}">${r.code}</span><span class="start-opt-txt"><span class="so-h">${r.short}</span><span class="so-m">${startMenuMeta(r)}</span></span></button>`;
  }).join('');
  menu.innerHTML=`<div class="start-menu-lab">Choose a report type</div>${opts}`;
}
function positionStartMenu(){
  const menu=document.getElementById('startMenu');
  const btn=document.querySelector('.startwrap .startbtn');
  if(!menu||!btn) return;
  if(document.body.classList.contains('collapsed')){
    const r=btn.getBoundingClientRect();
    menu.style.position='fixed';
    menu.style.left=(r.right+8)+'px';
    menu.style.top=r.top+'px';
    menu.style.right='auto';
    menu.style.width='300px';
    menu.style.maxHeight='calc(100vh - '+(r.top+16)+'px)';
    menu.style.overflowY='auto';
  } else {
    ['position','left','top','right','width','maxHeight','overflowY'].forEach(p=>menu.style[p]='');
  }
}
function toggleStartMenu(e){
  if(e) e.stopPropagation();
  const menu=document.getElementById('startMenu'); if(!menu) return;
  const willOpen=!menu.classList.contains('open');
  menu.classList.toggle('open');
  if(willOpen) positionStartMenu();
}
function closeStartMenu(){ document.getElementById('startMenu')?.classList.remove('open'); }
function pickStart(type){ closeStartMenu(); openReport(type); }
document.addEventListener('click',(e)=>{ if(!e.target.closest('.startwrap') && !e.target.closest('#startMenu')) closeStartMenu(); });

/* ---------- sidebar: sessions (pin / delete / timestamps) ---------- */
let pendingDelete=null;
function sessionIndicator(s){
  if(s.kind==='chat') return `<span class="sind chat">${IC.chatDot}</span>`;
  if(s.waitingOn) return `<span class="sind wait">${IC.clockMini}</span>`;
  if(s.status==='active') return `<span class="sind"><span class="dot pulse-dot"></span></span>`;
  if(s.status==='needs_you') return `<span class="sind"><span class="dot" style="background:var(--accent)"></span></span>`;
  return `<span class="sind"><span class="dot grey"></span></span>`;
}
function sessionRow(s){
  const unread=notifications.some(n=>n.sessionId===s.id && !n.read);
  const activeCls=s.id===currentSessionId?' active':'';
  return `<div class="slink${activeCls}" data-id="${s.id}" onclick="openSessionById('${s.id}')">
    ${sessionIndicator(s)}
    <div class="slink-name"><span class="stxt">${s.title}</span>${unread?'<span class="udot"></span>':''}</div>
    <div class="slink-meta">
      <span class="slink-time">${s.updated}</span>
      <button class="skebab" onclick="event.stopPropagation();toggleSessionMenu('${s.id}')" title="More">⋯</button>
    </div>
    <div class="smenu" id="menu-${s.id}">
      <div class="smenu-item" onclick="event.stopPropagation();togglePin('${s.id}')">${s.pinned?'Unpin':'Pin'}</div>
      <div class="smenu-item danger" onclick="event.stopPropagation();deleteSession('${s.id}')">Delete</div>
    </div>
  </div>`;
}
function renderSidebarSessions(){
  if(!document.getElementById('allList')) return; /* sidebar session lists removed in zero-point build */
  const q=(document.getElementById('sessionSearch')?.value||'').trim().toLowerCase();
  const sorted=sessions.slice().sort((a,b)=>a.updatedSort-b.updatedSort).filter(s=>!q || s.title.toLowerCase().includes(q) || s.sub.toLowerCase().includes(q));
  document.getElementById('pinnedList').innerHTML=sorted.filter(s=>s.pinned).map(sessionRow).join('') || '<div class="slink-empty">No pinned sessions</div>';
  document.getElementById('allList').innerHTML=sorted.filter(s=>!s.pinned).map(sessionRow).join('') || '<div class="slink-empty">No unpinned sessions</div>';
}
function togglePin(id){ const s=sessions.find(x=>x.id===id); if(s){ s.pinned=!s.pinned; closeAllSessionMenus(); renderSidebarSessions(); } }
function toggleSessionMenu(id){
  const menu=document.getElementById('menu-'+id); const wasOpen=menu.classList.contains('open');
  closeAllSessionMenus();
  if(wasOpen) return;
  const btn=document.querySelector(`.slink[data-id="${id}"] .skebab`);
  if(btn){
    const r=btn.getBoundingClientRect();
    const menuW=menu.offsetWidth||140, menuH=menu.offsetHeight||76;
    let top=r.bottom+4, left=r.right-menuW;
    if(top+menuH>window.innerHeight-8) top=r.top-menuH-4;
    if(left<8) left=8;
    menu.style.top=top+'px';
    menu.style.left=left+'px';
  }
  menu.classList.add('open');
}
function closeAllSessionMenus(){
  document.querySelectorAll('.smenu.open').forEach(m=>m.classList.remove('open'));
  document.querySelectorAll('.smenu-item.danger.confirm').forEach(el=>{el.textContent='Delete';el.classList.remove('confirm');});
  pendingDelete=null;
}
function deleteSession(id){
  if(pendingDelete!==id){
    pendingDelete=id;
    const el=document.querySelector(`#menu-${id} .smenu-item.danger`);
    if(el){ el.textContent='Confirm delete'; el.classList.add('confirm'); }
    return;
  }
  sessions=sessions.filter(s=>s.id!==id);
  pendingDelete=null;
  renderSidebarSessions(); renderHome();
  if(currentSessionId===id){ currentSessionId=null; go('home'); }
  showToast('Session deleted');
}
document.addEventListener('click',(e)=>{
  if(!e.target.closest('.slink')) closeAllSessionMenus();
  if(!e.target.closest('.notif-wrap')) document.getElementById('notifPanel')?.classList.remove('open');
});

/* ---------- notifications ---------- */
function renderNotif(){
  const unread=notifications.filter(n=>!n.read).length;
  const badge=document.getElementById('notifBadge');
  badge.style.display=unread?'flex':'none'; badge.textContent=unread;
  const panel=document.getElementById('notifPanel');
  panel.innerHTML=`<div class="notif-h">Notifications <button onclick="markAllRead(event)">Mark all read</button></div><div class="notif-list">`+
    (notifications.length? notifications.slice().reverse().map(n=>`
      <div class="notif-item ${n.read?'read':''}" onclick="notifClick(${n.id})"><span class="nd"></span>
      <div><div class="nt">${n.text}</div><div class="ntime">${n.time}</div></div></div>`).join('')
      : `<div class="notif-empty">You're all caught up.</div>`)+`</div>`;
}
function toggleNotif(e){ e.stopPropagation(); const p=document.getElementById('notifPanel'); const willOpen=!p.classList.contains('open'); closeAllSessionMenus(); p.classList.toggle('open'); if(willOpen) renderNotif(); }
function markAllRead(e){ e.stopPropagation(); notifications.forEach(n=>n.read=true); renderNotif(); renderSidebarSessions(); }
function notifClick(id){
  const n=notifications.find(x=>x.id===id); if(!n) return;
  n.read=true; document.getElementById('notifPanel').classList.remove('open'); renderNotif();
  if(n.sessionId) openSessionById(n.sessionId);
}

/* ---------- toast ---------- */
function showToast(msg){
  const wrap=document.getElementById('toastWrap');
  const t=document.createElement('div'); t.className='toast';
  t.innerHTML=`<span class="toast-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6L9 17l-5-5"/></svg></span><span>${msg}</span>`;
  wrap.appendChild(t);
  requestAnimationFrame(()=>t.classList.add('show'));
  setTimeout(()=>{ t.classList.remove('show'); setTimeout(()=>t.remove(),250); },2200);
}

/* ---------- Work queue (Home) ---------- */
function toggleBlockersOnly(sw){
  const on=sw.classList.toggle('on');
  document.querySelectorAll('.wq-item').forEach(item=>{
    const isBlocker=item.dataset.blocker==='true';
    item.classList.toggle('hidden-filter', on && !isBlocker);
  });
  document.querySelectorAll('.wq-group').forEach(group=>{
    const visible=Array.from(group.querySelectorAll('.wq-item')).some(i=>!i.classList.contains('hidden-filter'));
    group.classList.toggle('hidden-filter', on && !visible);
  });
}
/* Stat cards drill into the work queue, scoped to the item(s) that answer the stat. */
function showWorkQueue(groups,label){
  const card=document.getElementById('workQueueCard');
  card.style.display='block';
  document.querySelectorAll('.wq-item').forEach(i=>{ i.classList.toggle('hidden-scope', !!groups && !groups.includes(i.dataset.group)); });
  const pill=document.getElementById('wqFilterPill');
  if(groups){ pill.style.display='inline-flex'; pill.innerHTML=`Showing: ${label} <span onclick="showWorkQueue(null)">Show all</span>`; }
  else { pill.style.display='none'; }
  card.scrollIntoView({behavior:'smooth',block:'start'});
}

/* ---------- My Filings (list + dashboard) ---------- */
const PHASE_LABELS=['Front door','Scope','Map & ingest','Collect & chase','Validate','Prepare & assemble','Review','Close'];
function filingPhaseLabel(s){
  if(s.engine==='be11' && mode==='be11') return PHASE_LABELS[Math.min(steps[sIdx]?steps[sIdx].ph:0,7)];
  return PHASE_LABELS[s.stagePhase!=null?s.stagePhase:0];
}
function filingCard(s){
  const cls=s.waitingOn?'amber':(s.status==='needs_you'?'blue':(s.status==='done'?'':''));
  const barCls=s.waitingOn?'amber':(s.status==='needs_you'?'blue':'');
  const statusHtml=s.waitingOn?`<span class="pill amber dotp">Waiting on ${PEOPLE[s.waitingOn.who].name.split(' ')[0]}</span>`:`<span class="pill ${(STATUS_META[s.status]||{cls:'green'}).cls} dotp">${(STATUS_META[s.status]||{label:'Active'}).label}</span>`;
  return `<div class="filing" onclick="openFiling('${s.id}')">
    <div class="fmark">${s.code}</div>
    <div class="fbody"><div class="fname">${s.title}</div><div class="fmeta">${s.sub} · ${filingPhaseLabel(s)}</div><div class="bar ${barCls}"><i style="width:${s.pct||0}%"></i></div></div>
    <div style="text-align:right;min-width:120px">${statusHtml}<div class="presence" style="justify-content:flex-end;margin-top:8px">${s.people.map(av).join('')}</div></div>
    <div class="chev">${IC.chev}</div>
  </div>`;
}
function filingGroup(label,list){
  return `<div class="fgroup"><div class="fgroup-h">${label}<span class="wq-count">${list.length}</span></div>`+
    (list.length?`<div class="card">${list.map(filingCard).join('')}</div>`:`<div class="card"><div class="empty-mini">Nothing here</div></div>`)+`</div>`;
}
function renderFilings(){
  const all=sessions.filter(s=>s.kind==='filing').slice().sort((a,b)=>a.updatedSort-b.updatedSort);
  const inProgress=all.filter(s=>s.status!=='done');
  const completed=all.filter(s=>s.status==='done' && !s.archived);
  const archived=all.filter(s=>s.archived);
  document.getElementById('filingsGroups').innerHTML=
    filingGroup('In progress',inProgress)+filingGroup('Completed',completed)+filingGroup('Archived',archived);
}
/* ---------- Create a new report ---------- */
let reportSeq=0;
function newReportFormNote(){
  const t=REPORT_TYPES[document.getElementById('nrType').value];
  document.getElementById('nrNote').innerHTML=`<strong>${t.code}</strong> — ${t.name}. ${t.formNote} Once you confirm scope, the Operator generates one <strong>${t.formCode}</strong> form per ${t.unit} and carries each through the lifecycle.`;
}
function openNewReportModal(){
  const m=document.getElementById('modal');
  const typeOpts=REPORT_TYPES.map((t,i)=>`<option value="${i}">${t.code} · ${t.name}</option>`).join('');
  m.innerHTML=`<div class="modal-h"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/><path d="M9 13h6M9 17h6"/></svg><h3>New report</h3><button class="xbtn" onclick="closeModal()">✕</button></div>
  <div class="modal-b">
    <div class="field"><label class="field-lab" for="nrName">Report name</label><input id="nrName" placeholder="e.g. BE-11 · FY25" /><div class="field-hint">Shown as the report title across the workspace.</div></div>
    <div class="field"><label class="field-lab" for="nrType">Report type</label><select id="nrType" onchange="newReportFormNote()">${typeOpts}</select></div>
    <div class="nr-daterow" style="display:flex;gap:14px">
      <div class="field" style="flex:1;margin:0"><label class="field-lab" for="nrStart">Start date</label><input id="nrStart" type="date" /></div>
      <div class="field" style="flex:1;margin:0"><label class="field-lab" for="nrDue">Due date</label><input id="nrDue" type="date" /></div>
    </div>
    <div class="field"><label class="field-lab" for="nrDataDue">Data collection due date</label><input id="nrDataDue" type="date" /></div>
    <div class="field"><div class="field-note" id="nrNote"></div></div>
  </div>
  <div class="modal-f"><button class="btn sec" onclick="closeModal()">Cancel</button><button class="btn primary" onclick="createReport()">Create report</button></div>`;
  document.getElementById('overlay').classList.add('open');
  newReportFormNote();
}
function createReport(){
  const t=REPORT_TYPES[document.getElementById('nrType').value];
  const name=(document.getElementById('nrName').value||'').trim()||`${t.code} report`;
  const startDate=document.getElementById('nrStart').value||null;
  const dueDate=document.getElementById('nrDue').value||null;
  const dataDueDate=document.getElementById('nrDataDue').value||null;
  let base=name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'')||t.code.toLowerCase();
  let id=base; while(sessions.some(s=>s.id===id)) id=base+'-'+Date.now();
  const dl=dueDate?new Date(dueDate+'T00:00:00'):null;
  const s={
    id,code:t.code,title:name,sub:t.sub,kind:'filing',engine:'history',
    pinned:false,status:'active',pct:0,people:['dr'],updated:'just now',updatedSort:--reportSeq,waitingOn:null,stagePhase:0,
    startDate,dueDate,dataDueDate,
    forms:{unit:t.unit,total:0,items:[]},
    history:[{kind:'op',lvl:'recommend',html:`<p><strong>${name}</strong> report created. I'll start at the front door — reading your entity data and prior filings to work out scope, then generate one <strong>${t.formCode}</strong> form per ${t.unit} in scope.</p>`}],
  };
  sessions.unshift(s);
  FILING_DASH[id]={agents:[{n:'Obligation Scout',out:'Queued — assessing scope from entity data',status:'q',art:null}],pending:[],attention:[]};
  if(dl){ UPCOMING.push({id,label:name,date:{y:dl.getFullYear(),m:dl.getMonth(),d:dl.getDate()},dateLabel:dl.toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'}),note:'0% ready · just created',sev:'grey'}); }
  closeModal(); renderFilings(); renderSidebarSessions(); renderHome();
  openFiling(id);
  showToast(`${name} created`);
}
/* Full scope roster — a report's authored forms plus the rest of the entities in
   scope, generated deterministically so the whole set (e.g. 42 affiliates) can be
   shown. Generated forms are honestly "queued" (no data yet). Cached per report. */
const AFFIL_POOL=[
  ['Meridian Holdings K.K.','Japan'],['Nordic Assembly AB','Sweden'],['Iberia Components SL','Spain'],
  ['Alpine Precision AG','Switzerland'],['Maple Ridge Corp','Canada'],['Batavia Logistics BV','Netherlands'],
  ['Celtic Data Ltd','Ireland'],['Andes Mining SpA','Chile'],['Ganges Software Pvt','India'],
  ['Rhine Chemicals GmbH','Germany'],['Seine Media SAS','France'],['Thames Analytics Ltd','United Kingdom'],
  ['Pearl River Mfg Co','China'],['Lion City Ventures Pte','Singapore'],['Outback Resources Pty','Australia'],
  ['Carpathia Steel SA','Romania'],['Baltic Freight OÜ','Estonia'],['Aegean Trading AE','Greece'],
  ['Sahara Energy SARL','Morocco'],['Pampas Agro SA','Argentina'],['Fjord Robotics AS','Norway'],
  ['Danube Textiles Kft','Hungary'],['Kansai Optics G.K.','Japan'],['Cape Town Foods Pty','South Africa'],
];
const COUNTRY_POOL=['Germany','France','United Kingdom','Ireland','Netherlands','Switzerland','Singapore','Japan','Canada','Brazil','Mexico','Australia','India','China','Italy'];
const AGENCY_POOL=['USDA','DOE','HHS','NSF','DOT','EPA','NIH'];
/* How many of a report's full form set should read as complete — derived from where
   the report is in its lifecycle, so the roster's "N of total complete" never
   contradicts the readiness % or status shown elsewhere. */
function formsDoneTarget(rep,total){
  if(!rep) return 0;
  if(rep.status==='done') return total;
  const ph = rep.engine==='be11' ? 6 : (rep.stagePhase!=null?rep.stagePhase:0);
  const frac = ph<=1?0 : ph===2?0.30 : ph===3?0.55 : ph===4?0.78 : ph===5?0.90 : ph===6?0.93 : 1;
  return Math.round(total*frac);
}
/* Deterministic, internally-consistent BE-11 financials for a generated affiliate
   ($ thousands). Balance sheet ties out exactly (assets = liabilities + owners' equity)
   so a completed generated form reads like a real one, not a placeholder. */
const GEN_ACTIVITY=['Producer of goods','Provider of services','Seller of goods the foreign affiliate does not produce'];
const GEN_PRODUCT=['Manufacture of industrial components','IT and business-process services','Wholesale distribution of electronics','Assembly of precision instruments'];
const GEN_ISI=['3363','5415','4234','3345'];
function genBe11Fin(i){
  const tier=(i*37)%9;                         // 0..8
  const sales=90000+tier*44000;                // $90M..$442M
  const assets=Math.round(sales*0.82/100)*100;
  const liabilities=Math.round(assets*0.46/100)*100;
  const ownersEq=assets-liabilities;           // exact tie-out
  const netIncome=Math.round(sales*0.085/100)*100;
  const ppe=Math.round(assets*0.32/100)*100;
  const ppeExp=Math.round(ppe*0.11/100)*100;
  const employees=180+((i*53)%13)*100;         // 180..1380
  const comp=Math.round(employees*78/100)*100;
  const rnd=(i%3===0)?Math.round(sales*0.02/100)*100:0;
  return {sales,assets,liabilities,ownersEq,netIncome,ppe,ppeExp,employees,comp,rnd,over300:employees>300,
    activity:GEN_ACTIVITY[i%GEN_ACTIVITY.length],product:GEN_PRODUCT[i%GEN_PRODUCT.length],isi:GEN_ISI[i%GEN_ISI.length]};
}
function expandForms(reportId){
  const s=sessions.find(x=>x.id===reportId);
  const fd=(s&&s.forms)||FORMS[reportId]; if(!fd) return null;
  if(fd._all) return fd._all;
  const items=fd.items.slice();
  const isBe11=reportId.indexOf('be11')===0;
  const baseFy=(fd.items.find(x=>x.fyEnd)||{}).fyEnd||'12/31/2025';
  const baseCode=(fd.items[0]||{}).code||'Form';
  const doneTarget=formsDoneTarget(s,fd.total);
  let doneSoFar=items.filter(x=>x.status==='done').length;
  const used=new Set(items.map(x=>(x.entity||'').toLowerCase()));
  const pickUnused=(pool,i,fmt)=>{ let k=i; for(let t=0;t<pool.length;t++){ const cand=fmt(pool[(k+t)%pool.length],Math.floor((k+t)/pool.length)); if(!used.has(cand.toLowerCase())){ return cand; } } return fmt(pool[k%pool.length],Math.floor(k/pool.length)); };
  let i=0;
  while(items.length<fd.total){
    const status = doneSoFar<doneTarget ? 'done' : 'todo';
    if(status==='done') doneSoFar++;
    if(isBe11){
      const entity=pickUnused(AFFIL_POOL,i,(p,r)=>p[0]+(r?' '+(r+1):''));
      const country=(AFFIL_POOL[i%AFFIL_POOL.length])[1];
      const isC=(i%4===3);
      used.add(entity.toLowerCase());
      if(status==='done'){
        const g=genBe11Fin(i);
        items.push({id:`${reportId}-gen-${i}`,entity,country,code:isC?'BE-11C':'BE-11B',status,reporter:US_REPORTER,fyEnd:baseFy,
          ownEquity:isC?35.0:100.0,ownVoting:isC?35.0:100.0,activity:g.activity,product:g.product,isi:g.isi,
          employees:g.employees,comp:g.comp,rnd:g.rnd,over300:g.over300,netIncome:g.netIncome,sales:g.sales,assets:g.assets,ppe:g.ppe,liabilities:g.liabilities,ownersEq:g.ownersEq,ppeExp:g.ppeExp,
          agent:'Filing Preparation',src:'NetSuite ERP',conf:'high',generated:true,
          note:'Populated from ERP and consolidation data; balance sheet reconciled.'});
      } else {
        items.push({id:`${reportId}-gen-${i}`,entity,country,code:isC?'BE-11C':'BE-11B',status,reporter:US_REPORTER,fyEnd:baseFy,
          ownEquity:isC?35.0:100.0,ownVoting:isC?35.0:100.0,activity:'Provider of services',product:'Services provided to affiliated and unaffiliated customers',isi:'5415',
          employees:null,comp:null,rnd:null,over300:false,netIncome:null,sales:null,assets:null,ppe:null,liabilities:null,ownersEq:null,ppeExp:null,
          agent:'Mapping & Resolve',src:null,conf:null,generated:true,
          note:'In scope for this cycle — this form is queued. Figures are collected once mapping and chase reach this affiliate.'});
      }
    } else {
      let entity,country=null;
      if(fd.unit==='tax jurisdiction'){ entity=pickUnused(COUNTRY_POOL,i,(c)=>c); country=entity; }
      else if(fd.unit==='federal award'){ entity=pickUnused(AGENCY_POOL,i,(a)=>`${a} Award #${4400+i*7}`); }
      else { entity=pickUnused(AFFIL_POOL,i,(p,r)=>p[0]+(r?' '+(r+1):'')); country=(AFFIL_POOL[i%AFFIL_POOL.length])[1]; }
      used.add(entity.toLowerCase());
      items.push({id:`${reportId}-gen-${i}`,entity,country,code:baseCode,status,generated:true});
    }
    i++;
  }
  fd._all=items;
  return items;
}
let formsExpandedFor=null;
function toggleAllForms(id){ formsExpandedFor=(formsExpandedFor===id)?null:id; openFiling(id); }
/* Format an ISO (YYYY-MM-DD) report date for display, e.g. "Fri, Jul 3, 2026". */
function fmtReportDate(iso){ if(!iso) return '—'; const d=new Date(iso+'T00:00:00'); if(isNaN(d)) return iso; return d.toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric',year:'numeric'}); }
/* Key dates a report carries: start, data-collection cutoff, and filing due.
   The filing-due row also carries a relative indicator (in N days / overdue / filed). */
const KD_IC={
  start:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 3v18"/><path d="M5 4h11l-2 3 2 3H5"/></svg>',
  data:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 13v5a1 1 0 001 1h14a1 1 0 001-1v-5"/><path d="M4 13h4l1.5 2.5h5L16 13h4"/><path d="M12 4v7m0 0l-3-3m3 3l3-3"/></svg>',
  due:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="5" width="16" height="16" rx="2"/><path d="M8 3v4M16 3v4M4 10h16"/><path d="M9.5 15l1.8 1.8 3.2-3.4"/></svg>',
};
function keyDatesCard(s){
  if(!s.startDate && !s.dueDate && !s.dataDueDate) return '';
  const row=(ic,lab,iso,rel)=>`<div class="kd-row"><div class="kd-ic">${KD_IC[ic]}</div><div class="kd-main"><div class="kd-lab">${lab}</div><div class="kd-date">${fmtReportDate(iso)}</div></div>${rel||''}</div>`;
  let dueRel='';
  if(s.dueDate){
    if(s.status==='done'){ dueRel='<span class="kd-rel done">Filed</span>'; }
    else {
      const d=new Date(s.dueDate+'T00:00:00'), left=Math.round((d-new Date(TODAY.y,TODAY.m,TODAY.d))/86400000);
      if(left<0) dueRel=`<span class="kd-rel over">${-left} day${left===-1?'':'s'} overdue</span>`;
      else if(left===0) dueRel='<span class="kd-rel soon">Due today</span>';
      else dueRel=`<span class="kd-rel ${left<=14?'soon':''}">in ${left} day${left===1?'':'s'}</span>`;
    }
  }
  return `<div class="card" style="margin-bottom:20px"><div class="fd-card-h">Key dates</div>`+
    row('start','Start date',s.startDate)+
    row('data','Data collection due',s.dataDueDate)+
    row('due','Filing due',s.dueDate,dueRel)+
  `</div>`;
}
function openFiling(id){
  const s=sessions.find(x=>x.id===id); if(!s) return;
  go('filing');
  document.getElementById('crumbCur').textContent=s.title;
  const d=FILING_DASH[id]||{agents:[],pending:[],attention:[]};
  const phaseIdx=(s.engine==='be11'&&mode==='be11')?(steps[sIdx]?steps[sIdx].ph:0):(s.stagePhase!=null?s.stagePhase:0);
  const statusHtml=s.waitingOn?`<span class="pill amber dotp">Waiting on ${PEOPLE[s.waitingOn.who].name.split(' ')[0]}</span>`:`<span class="pill ${(STATUS_META[s.status]||{cls:'green'}).cls} dotp">${(STATUS_META[s.status]||{label:'Active'}).label}</span>`;
  const blockers=d.attention.filter(a=>a.sev==='block').length;
  const warns=d.attention.filter(a=>a.sev==='warn').length;
  // lifecycle spine (same look as the Operator session) — lives in the right column
  const lifecycleCard=`<div class="card" style="margin-bottom:20px"><div class="fd-card-h">Filing lifecycle</div>
    <div class="fd-life">
      <ol>${phaseSpineHtml(phaseIdx, s.status==='done')}</ol>
      <div class="spine-legend">
        <div class="li"><span class="lg-dot d"></span>Done</div>
        <div class="li"><span class="lg-dot c"></span>In progress</div>
        <div class="li"><span class="lg-dot"></span>Upcoming</div>
        <div class="li"><span class="lg-dot g"></span>Signature gate (human)</div>
      </div>
    </div>
  </div>`;
  const agentRows=d.agents.length?d.agents.map(a=>`
    <div class="agrow">
      <div class="aic">${IC.op}</div>
      <div class="ab"><div class="an">${a.n}${a.art?` <button class="action-btn" style="padding:3px 9px;font-size:11px;font-weight:600" onclick="openArtifact('${a.art[0]}',${a.art[1]})">View output</button>`:''}</div><div class="ao">${a.out}</div></div>
      <div class="astatus ${a.status}">${a.status==='done'?'Done':(a.status==='run'?'Running':'Queued')}</div>
    </div>`).join(''):`<div class="empty-mini">No agents have run yet</div>`;
  const ctaBtn=(c,solid)=>c?`<button class="prow-cta${solid?' solid':''}" onclick="${c.act}">${c.label}</button>`:'';
  // "Needs you" band: pending confirmations + blockers/warnings, merged and promoted above the columns.
  const pendingHtml=d.pending.map(p=>`
    <div class="prow"><div class="pi info"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="3.2"/><path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6"/></svg></div>
    <div class="pb"><div class="pt">${p.t}</div><div class="pm">${p.m}</div></div>${ctaBtn(p.cta,true)}</div>`).join('');
  const attnHtml=d.attention.map(a=>`
    <div class="prow"><div class="pi ${a.sev}">${a.sev==='block'?'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/></svg>':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 4l9 16H3z"/><path d="M12 10v4M12 17h.01"/></svg>'}</div>
    <div class="pb"><div class="pt">${a.t}</div><div class="pm">${a.m}</div></div>${ctaBtn(a.cta, a.sev==='block')}</div>`).join('');
  const needsCount=d.pending.length+d.attention.length;
  const nuChip=blockers?['var(--danger-bg)','var(--danger)']:(needsCount?['var(--accent-weak)','var(--accent)']:['var(--surface-3)','var(--text-2)']);
  const needsCard=`<div class="card nu-card${blockers?' has-block':''}"><div class="fd-card-h">Needs you${needsCount?`<span class="wq-count" style="background:${nuChip[0]};color:${nuChip[1]}">${needsCount}</span>`:''}</div>${needsCount?(pendingHtml+attnHtml):`<div class="nu-clear"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>On track — nothing needs your confirmation right now.</div>`}</div>`;
  const peopleRows=s.people.map(p=>{
    const roles={dr:'Preparer',sc:'Reviewer-approver · Controller',jd:'Preparer',mk:'Data owner · Germany',tr:'Data owner · Brazil'};
    return `<div class="fd-person">${av(p)}<div><div class="pn">${PEOPLE[p].name}</div><div class="pr">${roles[p]||''}</div></div></div>`;
  }).join('');
  // Forms — a report bundles many forms (for BEA, one per entity in scope)
  const fd=s.forms||FORMS[id]||null;
  const allForms=fd?expandForms(id):null;
  const doneForms=allForms?allForms.filter(f=>f.status==='done').length:0;
  const FORMS_SAMPLE=7;
  const expanded=formsExpandedFor===id;
  let formRows;
  if(allForms && allForms.length){
    const shown=expanded?allForms:allForms.slice(0,FORMS_SAMPLE);
    formRows=shown.map(f=>{
      const st=FORM_STATUS[f.status]||FORM_STATUS.todo;
      const meta=f.country?`${f.code} · ${f.country}`:`${f.code} · one form per ${fd.unit}`;
      return `<div class="form-row clickable" onclick="openForm('${id}','${f.id}')"><div class="form-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/><path d="M9 13h6M9 17h6"/></svg></div>
        <div class="form-b"><div class="form-n">${f.entity}</div><div class="form-m">${meta}</div></div>
        <span class="pill ${st.cls}">${st.label}</span><span class="chev"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 6l6 6-6 6"/></svg></span></div>`;
    }).join('');
    if(allForms.length>FORMS_SAMPLE){
      formRows+=`<div class="form-more clickable" onclick="toggleAllForms('${id}')">${expanded?'Show fewer':`Show all ${fd.total} forms · one per ${fd.unit} in scope`}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:15px;height:15px;transform:rotate(${expanded?180:0}deg)"><path d="M6 9l6 6 6-6"/></svg></div>`;
    }
  } else {
    const unit=(fd&&fd.unit)||'entity';
    formRows=`<div class="empty-mini">Forms are generated once scope is confirmed — one per ${unit} in scope.</div>`;
  }
  const formsCard=`<div class="card" style="margin-bottom:20px"><div class="fd-card-h">Forms in this report<span class="wq-count" style="background:var(--surface-3);color:var(--text-2)">${fd&&fd.total?doneForms+'/'+fd.total:'—'}</span></div>${formRows}</div>`;
  document.getElementById('filingDash').innerHTML=`
    <div class="fd-head">
      <div class="fd-mark">${s.code}</div>
      <div class="fd-title-wrap"><div class="fd-title">${s.title}</div><div class="fd-sub">${s.sub}${s.archived?' · Archived':''}</div></div>
      <div class="fd-actions">${statusHtml}<button class="btn primary" onclick="openSessionById('${s.id}')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:15px;height:15px"><path d="M4 5h16v11H8l-4 4z"/></svg>Open in Operator</button></div>
    </div>
    <div class="fd-strip">
      <div class="card fd-stat"><div class="k">Readiness</div><div class="v ${s.pct===100?'g':'b'}">${s.pct!=null?s.pct+'%':'—'}</div></div>
      <div class="card fd-stat"><div class="k">Forms</div><div class="v" style="font-size:16px">${fd&&fd.total?doneForms+' of '+fd.total+' complete':'Pending scope'}</div></div>
      <div class="card fd-stat"><div class="k">Current phase</div><div class="v" style="font-size:16px">${PHASE_LABELS[phaseIdx]}</div></div>
      <div class="card fd-stat"><div class="k">Attention</div><div class="v ${blockers?'d':(warns?'a':'g')}">${blockers?blockers+' blocker'+(blockers>1?'s':''):(warns?warns+' warning'+(warns>1?'s':''):'None')}</div></div>
    </div>
    ${needsCard}
    <div class="fd-cols">
      <div>
        ${formsCard}
        <div class="card" style="margin-bottom:20px"><div class="fd-card-h">Agents used &amp; outputs<span class="wq-count" style="background:var(--surface-3);color:var(--text-2)">${d.agents.length}</span></div>${agentRows}</div>
      </div>
      <div>
        ${lifecycleCard}
        ${keyDatesCard(s)}
        <div class="card"><div class="fd-card-h">People involved</div>${peopleRows}</div>
      </div>
    </div>`;
  document.getElementById('view-filing').scrollTop=0;
}

/* ---------- Single form page (a report's child form) ---------- */
const _fmt=n=>n.toLocaleString('en-US');
function shortMoney(n){ if(n==null) return '—'; return n>=1000?`$${(n/1000).toLocaleString('en-US',{maximumFractionDigits:1})}M`:`$${_fmt(n)}K`; }
function fMoney(n){ return n==null?`<div class="fval empty">— awaiting data</div>`:`<div class="fval money"><span class="cur">$</span>${_fmt(n)}</div>`; }
function fCount(n){ return n==null?`<div class="fval empty">— awaiting data</div>`:`<div class="fval money">${_fmt(n)}</div>`; }
function fText(v){ return (v!=null&&v!=='')?`<div class="fval txt">${v}</div>`:`<div class="fval empty">—</div>`; }
function fChoice(opts,sel){ return `<div class="fchoice">${opts.map(o=>`<span class="opt ${o.v===sel?'on':''}">${o.label}</span>`).join('')}</div>`; }
function fItem(num,label,valHtml,hint){ return `<div class="fitem"><div class="fnum">${num}</div><div class="flabel">${label}${hint?`<span class="fhint">${hint}</span>`:''}</div>${valHtml}</div>`; }
function fPart(t){ return `<div class="fpart">${t}</div>`; }
function fSec(t,note){ return `<div class="fsec">${t}${note?`<span class="bd">— ${note}</span>`:''}</div>`; }
function be11FormHtml(s,f){
  const yr=(f.fyEnd&&f.fyEnd.slice(-4))||'2025'; const dueYr=(parseInt(yr,10)+1)||'2026';
  const isAff=f.code!=='BE-11A';
  const subMap={'BE-11A':'Report for U.S. Reporter','BE-11B':'Report for Majority-Owned Foreign Affiliate of U.S. Reporter','BE-11C':'Report for Minority-Owned Foreign Affiliate of U.S. Reporter'};
  const idTitle=isAff?`Part I — Identification of ${f.code==='BE-11C'?'Minority':'Majority'}-Owned Foreign Affiliate`:'Part I — Identification of U.S. Reporter';
  const finTitle=f.over300
    ?`Part IV — Financial and Operating Data ${isAff?'of Foreign Affiliate ':''}With Assets, Sales, or Net Income (Loss) Greater Than $300 Million`
    :`Part III — Financial and Operating Data ${isAff?'of Foreign Affiliate ':''}With Assets, Sales, and Net Income (Loss) Less Than or Equal to $300 Million`;
  const band=`<div class="fdoc-band"><div class="row1"><span class="code">${f.code}</span><span class="cls">MANDATORY — CONFIDENTIAL</span></div>
    <div class="t">${yr} Annual Survey of U.S. Direct Investment Abroad</div><div class="sub">${subMap[f.code]||''}</div></div>`;
  const meta=`<div class="fdoc-meta">
    <div><div class="k">OMB No.</div><div class="v">0608-0053</div></div>
    <div><div class="k">${isAff?'Affiliate ID':'Reporter ID'}</div><div class="v">${isAff?('AFF-'+(f.id||'').toUpperCase().replace(/[^A-Z0-9]/g,'').slice(-6)):'RPT-100482'}</div></div>
    <div><div class="k">Fiscal year end</div><div class="v">${f.fyEnd||'—'}</div></div>
    <div><div class="k">Due date</div><div class="v">May 31, ${dueYr}</div></div></div>`;
  const summary=`<div class="fsummary">
    <div class="fsum"><div class="k">Sales / gross op. rev.</div><div class="v">${shortMoney(f.sales)}</div></div>
    <div class="fsum"><div class="k">Net income (loss)</div><div class="v">${shortMoney(f.netIncome)}</div></div>
    <div class="fsum"><div class="k">Total assets</div><div class="v">${shortMoney(f.assets)}</div></div>
    <div class="fsum"><div class="k">Employees</div><div class="v">${f.employees!=null?_fmt(f.employees):'—'}</div></div></div>`;
  const note=f.note?`<div class="fnote"><strong>Status note.</strong> ${f.note}</div>`:'';
  // Part I
  let p1=fPart(idTitle);
  p1+=fItem('1','Name of U.S. Reporter',fText(f.reporter||US_REPORTER));
  if(isAff) p1+=fItem('2','Name of foreign affiliate being reported',fText(f.entity));
  p1+=fItem('3','Country of location',fText(f.country),'Where the affiliate’s physical assets are located or its primary activity is carried out.');
  p1+=fItem('4','City of location',fText(f.city));
  p1+=fItem('5','Ending date of fiscal year',fText(f.fyEnd));
  if(isAff) p1+=fItem('6','Did the business become a foreign affiliate of the U.S. Reporter during the fiscal year?',fChoice([{v:true,label:'Yes — initial report'},{v:false,label:'No'}],!!f.newAffiliate));
  if(isAff){
    p1+=fSec('Section A — Direct Ownership in this Foreign Affiliate');
    const own=(f.ownEquity!=null)?`Equity ${f.ownEquity.toFixed(1)}%  ·  Voting ${f.ownVoting.toFixed(1)}%`:null;
    p1+=fItem('7','What is the direct ownership percent held by the U.S. Reporter?',fText(own),'Equity interest is total (voting + nonvoting) equity; voting interest is voting equity only.');
  }
  p1+=fSec('Section B — Industry Classification');
  p1+=fItem('19','What is the major activity of the '+(isAff?'foreign affiliate':'U.S. Reporter')+'?',fText(f.activity));
  p1+=fItem('20','What is the major product or service involved in this activity?',fText(f.product));
  p1+=fItem('ISI','International Surveys Industry (ISI) code',fText(f.isi),'4-digit ISI code that best describes the reporter’s sales or gross operating revenues.');
  // Part II
  let p2=fPart('Part II — Financial and Operating Data'+(isAff?' of Foreign Affiliate':' of U.S. Reporter'));
  p2+=fSec('Section A — Employment');
  p2+=fItem('30','What is the total number of employees at fiscal year-end?',fCount(f.employees));
  p2+=fItem('31','What is the total employee compensation expenditure?',fMoney(f.comp),'Wages and salaries plus employer expenditures for all employee benefit plans.');
  p2+=fSec('Section B — Research and Development');
  p2+=fItem('33','What is the expenditure for R&D performed by this '+(isAff?'affiliate':'reporter')+'?',fMoney(f.rnd));
  p2+=fSec('Section C — Size');
  p2+=fItem('34','Were total assets, sales, or net income (loss) greater than $300 million?',fChoice([{v:true,label:'Yes — complete Part IV'},{v:false,label:'No — complete Part III'}],!!f.over300));
  // Part III / IV financials
  let p3=fPart(finTitle);
  p3+=fSec('Section A — Income');
  p3+=fItem('35','What is the net income (loss) for the year, after provision for foreign income taxes?',fMoney(f.netIncome));
  p3+=fSec('Section B — Distribution of Sales or Gross Operating Revenues');
  p3+=fItem(f.over300?'45':'36','What are the sales or gross operating revenues, excluding sales taxes?',fMoney(f.sales));
  p3+=fSec('Section C — Balance Sheet');
  p3+=fItem('37','Total assets?',fMoney(f.assets));
  p3+=fItem('38','Of which: Property, plant, and equipment, net?',fMoney(f.ppe));
  p3+=fItem('39','Total liabilities?',fMoney(f.liabilities));
  p3+=fItem('40','Total owners’ equity? — Equals 37 minus 39',fMoney(f.ownersEq));
  p3+=fSec('Section D — Property, Plant, and Equipment Expenditures');
  p3+=fItem('41','Expenditure for new and used property, plant, and equipment (PP&E)?',fMoney(f.ppeExp));
  const govFoot=`<div class="fnote" style="margin-bottom:18px"><strong>Governed.</strong> Every populated value is drawn from accepted, sourced facts${f.src?` (source: ${f.src})`:''} — never invented. Monetary values are shown in U.S. dollars, thousands. This form is prepared for review; nothing is filed without a recorded human approval.</div>`;
  return `<div class="formdoc">${band}${meta}${summary}${note}${p1}${p2}${p3}</div>${govFoot}`;
}
function genericFormHtml(s,f){
  const st=FORM_STATUS[f.status]||FORM_STATUS.todo;
  const band=`<div class="fdoc-band"><div class="row1"><span class="code">${f.code}</span></div><div class="t">${s?s.title:''}</div><div class="sub">${s?s.sub:''}</div></div>`;
  let body=fPart('Identification');
  body+=fItem('1','Reporting entity',fText(f.entity));
  body+=fItem('2','Form type',fText(f.code));
  body+=fItem('3','Reporting period',fText(s?s.sub:'—'));
  body+=fItem('4','Status',`<div class="fval txt"><span class="pill ${st.cls}">${st.label}</span></div>`);
  const foot=`<div class="fnote" style="margin-bottom:18px">Field-level rendering in this prototype is built out for the BE-11 form family. This ${f.code} form is tracked here with its identification and status; open it in the Operator to work the underlying data.</div>`;
  return `<div class="formdoc">${band}${body}</div>${foot}`;
}
function openForm(reportId, formId){
  const s=sessions.find(x=>x.id===reportId);
  const all=expandForms(reportId);
  const f=all&&all.find(x=>x.id===formId);
  if(!f){ showToast('Form not available'); return; }
  go('form');
  const st=FORM_STATUS[f.status]||FORM_STATUS.todo;
  const cur=document.getElementById('crumbCur');
  cur.innerHTML=`<span style="cursor:pointer;color:var(--text-3)" onclick="openFiling('${reportId}')">${s?s.title:reportId}</span> <span style="color:var(--text-3)">›</span> ${f.code} · ${f.entity}`;
  document.getElementById('backbtn').onclick=()=>openFiling(reportId);
  const topbar=`<div class="form-topbar">
    <div><div class="tb-title">${f.entity}</div><div class="tb-sub">${f.code} · part of ${s?s.title:'report'}</div></div>
    <div class="sp"></div>
    <span class="pill ${st.cls} dotp">${st.label}</span>
    ${f.agent?`<span class="pill blue">${f.agent}</span>`:''}
    <button class="btn primary" onclick="openSessionById('${reportId}')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:15px;height:15px"><path d="M4 5h16v11H8l-4 4z"/></svg>Open in Operator</button>
  </div>`;
  const paper=(f.code&&f.code.indexOf('BE-11')===0)?be11FormHtml(s,f):genericFormHtml(s,f);
  document.getElementById('formPage').innerHTML=topbar+paper;
  document.getElementById('view-form').scrollTop=0;
}

/* ---------- Source data + manual upload ---------- */
function sourceRow(src){
  const linked=src.linked.map(l=>`<span class="pill grey">${l}</span>`).join('');
  const isUp=src.type==='upload';
  const ic=isUp?'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/></svg>':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><ellipse cx="12" cy="6" rx="7" ry="2.8"/><path d="M5 6v6c0 1.55 3.13 2.8 7 2.8s7-1.25 7-2.8V6"/><path d="M5 12v6c0 1.55 3.13 2.8 7 2.8s7-1.25 7-2.8v-6"/></svg>';
  return `<div class="src-row"><div class="src-ic ${isUp?'upload':''}">${ic}</div>
    <div class="src-b"><div class="src-n">${src.name}</div><div class="src-d">${src.detail}</div><div class="src-linked">${linked}</div></div>
    <div class="src-meta">${isUp?'<span class="pill green" style="margin-bottom:6px">Accepted</span><br>':'<span class="pill green dotp" style="margin-bottom:6px">Connected</span><br>'}${src.last}</div></div>`;
}
function renderSources(){
  document.getElementById('sourcesConnected').innerHTML=dataSources.map(sourceRow).join('');
  document.getElementById('sourcesUploads').innerHTML=uploadedSources.length?uploadedSources.map(sourceRow).join(''):`<div class="empty-mini">No manual uploads yet. The agent will ask you to upload when a required figure has no source.</div>`;
}
let uploadCtx=null;
function openUploadModal(ctx){
  uploadCtx=ctx||null;
  const m=document.getElementById('modal');
  const fieldLine=ctx&&ctx.field?`<div class="inbubble" style="margin-top:0;margin-bottom:16px"><div class="lab">Requested by the Operator</div>${ctx.field} for <strong>${ctx.entity||'this filing'}</strong> has no connected source. Upload it and I'll accept it as a governed fact with your file attached as evidence.</div>`:'';
  m.innerHTML=`<div class="modal-h"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 16V4m0 0L8 8m4-4l4 4"/><path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2"/></svg><h3>Upload data</h3><button class="xbtn" onclick="closeModal()">✕</button></div>
  <div class="modal-b">
    ${fieldLine}
    <div class="dropzone" onclick="pickMockFile()">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 16V4m0 0L8 8m4-4l4 4"/><path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2"/></svg>
      <div class="dz-t">Drop a file or click to browse</div>
      <div class="dz-s">CSV, XLSX or PDF · mapped to the requested field</div>
    </div>
    <div id="uploadPicked"></div>
  </div>
  <div class="modal-f"><button class="btn sec" onclick="closeModal()">Cancel</button><button class="btn primary" id="uploadConfirm" disabled onclick="confirmUpload()">Add source</button></div>`;
  document.getElementById('overlay').classList.add('open');
}
function pickMockFile(){
  const name=(uploadCtx&&uploadCtx.file)||'FY25_'+((uploadCtx&&uploadCtx.field)||'data').toLowerCase().replace(/[^a-z0-9]+/g,'_')+'.xlsx';
  window._uploadName=name;
  document.getElementById('uploadPicked').innerHTML=`<div class="file-chip"><div class="fc-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg></div><div><div class="fc-n">${name}</div><div class="fc-m">Ready to upload · 24 KB</div></div></div>`;
  document.getElementById('uploadConfirm').disabled=false;
}
function confirmUpload(){
  const name=window._uploadName||'uploaded_data.xlsx';
  const ctx=uploadCtx;
  uploadedSources.unshift({id:'up-'+Date.now(),type:'upload',name,
    detail:(ctx&&ctx.field?ctx.field+(ctx.entity?' · '+ctx.entity:''):'Manual upload'),
    last:'Uploaded just now · accepted as governed fact',
    linked:[(ctx&&ctx.code)||'BE-11']});
  closeModal(); renderSources();
  showToast('Uploaded — accepted as governed fact');
  if(ctx&&ctx.chat && mode==='be11'){
    append(sysTurn('Manual upload received — '+name));
    append(opTurn('commit',`<p>Got it. I accepted <strong>${name}</strong> as a governed fact, mapped it to ${ctx.field}, and added it to Source data with your file attached as evidence.</p><div class="prov"><span class="chip">${IC.doc} ${name}</span><span class="chip">Confidence: high</span><span class="chip">Now in Source data</span></div>`,''));
  }
}
/* ---------- Home ---------- */
const activity=[
  {ic:'audit',t:'<b>Review &amp; Approval agent</b> prepared the BE-11 judgment ledger for Sarah Chen',m:'BE-11 · awaiting signature',time:'12m'},
  {ic:'audit',t:'<b>Validation &amp; Readiness agent</b> flagged Brazil Services Ltda — now over the BE-11B threshold',m:'BE-11 · resolved',time:'34m'},
  {ic:'agents',t:'<b>Collection &amp; Chase agent</b> sent 8 data requests across 8 owners',m:'BE-11 · approved by Julie',time:'1h'},
  {ic:'sched',t:'<b>Deadline watch</b> found BE-577 due Friday',m:'Monitoring · digest',time:'2h'},
  {ic:'op',t:'<b>Mapping &amp; Resolve agent</b> matched 84% of required BE-11 values from source',m:'BE-11',time:'3h'},
];
const findings=[
  {ic:'clock',t:'BE-577 due in 2 days',m:'Deadline watch',time:'2h'},
  {ic:'audit',t:'New FY25 consolidation loaded — CbCR now decidable',m:'Source-freshness monitor',time:'5h'},
  {ic:'bell',t:'IRS updated Form 8975 instructions',m:'Regulatory-change radar',time:'1d'},
];
function filingMetaLine(s){
  if(s.waitingOn) return `${s.sub} · Waiting on ${PEOPLE[s.waitingOn.who].name}`;
  return `${s.sub} · ${(STATUS_META[s.status]||{label:'—'}).label}`;
}
function barClsForStatus(s){ if(s.waitingOn) return 'amber'; if(s.status==='needs_you') return 'blue'; return ''; }
/* ================================================================
   OPERATOR LAUNCHPAD — Claude-style hub
================================================================*/
let opLibTab='conversations';
function renderOperator(){
  renderOpQuick();
  renderOpPrompts();
  renderOpLib(opLibTab);
  setTimeout(()=>moveOpLibInk(),20);
}
function renderHome(){ renderOperator(); } /* alias for legacy callers */
const OP_QUICK=['be11','be577','be125'];
const OP_QUICK_MORE=['be185','abs1','aies','qfr9'];
function renderOpQuick(){
  const el=document.getElementById('opQuick'); if(!el) return;
  const btns=OP_QUICK.map((key,i)=>{
    const r=OB_TYPES[key];
    return `<button class="op-qbtn${i===0?' primary':''}" style="animation-delay:${.05+i*.05}s" onclick="openReport('${key}')">${OB_ICONS.spark}Start ${r.code}</button>`;
  }).join('');
  const menu=OP_QUICK_MORE.map(key=>{ const r=OB_TYPES[key]; return `<button class="op-qmore-item" onclick="pickOther('${key}')"><span class="op-qmore-code">${r.code}</span><span class="op-qmore-sub">${r.short}</span></button>`; }).join('');
  const more=`<div class="op-qmore" id="opQMore">
    <button class="op-qbtn ghost" onclick="toggleOpMore(event)">Other<span class="op-qcar">${IC.chev}</span></button>
    <div class="op-qmore-menu" id="opQMoreMenu">${menu}</div>
  </div>`;
  el.innerHTML=btns+more;
}
function toggleOpMore(e){ if(e) e.stopPropagation(); document.getElementById('opQMore')?.classList.toggle('open'); }
function closeOpMore(){ document.getElementById('opQMore')?.classList.remove('open'); }
function pickOther(key){ closeOpMore(); openReport(key); }
document.addEventListener('click',(e)=>{ if(!e.target.closest('#opQMore')) closeOpMore(); });
function renderOpPrompts(){
  const el=document.getElementById('opPrompts'); if(!el) return;
  const keys=['file','approve','duesoon','cmpreports'];
  const chips=keys.map(k=>STARTERS.find(s=>s.key===k)).filter(Boolean);
  el.innerHTML=chips.map(s=>`<button class="op-prompt" onclick="opStarter('${s.key}')">${IC.op}<span>${s.t}</span></button>`).join('');
}
function opAutoGrow(t){ t.style.height='auto'; t.style.height=Math.min(t.scrollHeight,180)+'px'; }
function opKey(e){ if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); opSend(); } }
function opStarter(key){
  const s=STARTERS.find(x=>x.key===key); if(!s) return;
  const type=detectReportType(s.t);
  if(type) operatorLaunch(s.t,type); else goToNewSessionWithMessage(s.t,key);
}
function goToNewSessionWithMessage(text,key){
  currentSessionId=null; go('session'); startClean(); renderSidebarSessions();
  userSay(text); clearSuggests(); cleanReply(key);
}
function detectReportType(t){
  const s=(t||'').toLowerCase();
  if(/be[\s-]?577|\b577\b|quarterly transaction/.test(s)) return 'be577';
  if(/be[\s-]?11|\bbe11\b|direct investment/.test(s)) return 'be11';
  return null;
}
function opSend(){
  const inp=document.getElementById('opInput'); const txt=(inp.value||'').trim(); if(!txt) return;
  inp.value=''; opAutoGrow(inp);
  const type=detectReportType(txt);
  if(type) operatorLaunch(txt,type);
  else goToNewSessionWithMessage(txt,'generic');
}

/* ---------- Operator → Report transition (thinking → morph → FAB) ---------- */
let pendingSeed=null;
function operatorLaunch(txt,type){
  const comp=document.getElementById('opComposer');
  document.querySelectorAll('.op-thinking').forEach(n=>n.remove());
  const think=document.createElement('div'); think.className='op-thinking';
  think.innerHTML=`<div class="op-think-user">${txt}</div>
    <div class="op-think-row"><span class="op-think-spark">${IC.op}</span><span class="op-think-dots"><i></i><i></i><i></i></span><span class="op-think-txt">Starting your ${OB_TYPES[type].code} — opening the report…</span></div>`;
  comp.insertAdjacentElement('afterend', think);
  requestAnimationFrame(()=>think.classList.add('show'));
  setTimeout(()=>{
    opMorphToFab(comp, ()=>{
      think.remove();
      pendingSeed=[
        {who:'user',text:txt},
        {who:'op',text:`On it — I've opened your <strong>${OB_TYPES[type].code}</strong>. I'll walk you through Setup first. Ask me anything here as we go.`,ev:'Recognized a “start a report” intent'}
      ];
      openReport(type, pendingSeed);
      setTimeout(openFabSeeded, 480);
    });
  }, 1150);
}
function opMorphToFab(fromEl, done){
  const fab=document.getElementById('chatFab');
  if(!fab){ if(done) done(); return; }
  const a=fromEl.getBoundingClientRect(), b=fab.getBoundingClientRect();
  const ghost=document.createElement('div'); ghost.className='op-ghost'; ghost.innerHTML=IC.op;
  ghost.style.left=a.left+'px'; ghost.style.top=a.top+'px'; ghost.style.width=a.width+'px'; ghost.style.height=a.height+'px';
  document.body.appendChild(ghost);
  requestAnimationFrame(()=>{
    const tx=(b.left+b.width/2)-(a.left+a.width/2);
    const ty=(b.top+b.height/2)-(a.top+a.height/2);
    ghost.style.transform=`translate(${tx}px,${ty}px) scale(.05)`;
    ghost.style.opacity='0'; ghost.style.borderRadius='50%';
  });
  setTimeout(()=>{ ghost.remove(); if(done) done(); }, 640);
}

/* ---------- Operator library (Conversations / Artifacts / Schedules) ---------- */
function opLib(tab){
  if(opLibTab===tab) return;
  opLibTab=tab;
  document.querySelectorAll('.op-lib-tab').forEach(b=>b.classList.toggle('active', b.dataset.lib===tab));
  moveOpLibInk();
  renderOpLib(tab);
  const b=document.getElementById('opLibBody'); if(b){ b.classList.remove('enter'); void b.offsetWidth; b.classList.add('enter'); }
}
function moveOpLibInk(){
  const ink=document.getElementById('opLibInk'); const act=document.querySelector('.op-lib-tab.active'); if(!ink||!act) return;
  ink.style.width=act.offsetWidth+'px'; ink.style.transform=`translateX(${act.offsetLeft}px)`;
}
function opLibRow(ic,h,m,time,click){
  return `<button class="op-row" onclick="${click}"><span class="op-row-ic">${ic}</span><span class="op-row-main"><span class="op-row-h">${h}</span><span class="op-row-m">${m}</span></span><span class="op-row-time">${time}</span></button>`;
}
function renderOpLib(tab){
  const el=document.getElementById('opLibBody'); if(!el) return;
  let rows='';
  if(tab==='conversations'){
    const sorted=sessions.slice().sort((a,b)=>a.updatedSort-b.updatedSort);
    rows=sorted.map(s=>{
      const sm=STATUS_META[s.status]||{label:s.status,cls:'grey'};
      const badge=`<span class="pill ${sm.cls}" style="margin-left:8px">${sm.label}</span>`;
      return opLibRow(IC.chatDot, s.title+badge, s.sub, s.updated, `openSessionById('${s.id}')`);
    }).join('');
  } else if(tab==='artifacts'){
    const flat=[]; Object.keys(artifacts).forEach(k=>artifacts[k].forEach((a,idx)=>flat.push({...a,group:k,idx})));
    rows=flat.slice(0,8).map(a=>opLibRow(IC[a.ic], a.t, a.m, a.time, `openArtifact('${a.group}',${a.idx})`)).join('');
  } else {
    rows=schedules.map((s,idx)=>{
      const state=`<span class="pill ${s.on?'green':'grey'}" style="margin-left:8px">${s.on?'On':'Off'}</span>`;
      return opLibRow(IC.sched, s.n+state, `${s.d} · last run ${s.runs[0].time.toLowerCase()}`, s.runs[0].time, `openScheduleModal(${idx})`);
    }).join('');
  }
  el.innerHTML=rows||'<div class="op-lib-empty">Nothing here yet.</div>';
}

/* ================================================================
   DASHBOARD — portfolio view
================================================================*/
function renderDashboard(){
  const el=document.getElementById('dashWrap'); if(!el) return;
  const active=sessions.filter(s=>s.status!=='done');
  const needs=sessions.filter(s=>s.status==='needs_you');
  const waiting=sessions.filter(s=>s.status==='waiting');
  const up=UPCOMING.map(u=>({...u,left:daysLeftOf(u.date)})).sort((a,b)=>a.left-b.left);
  const next=up.find(u=>u.left>=0)||up[0];
  const soon=up.filter(u=>u.left>=0&&u.left<=7).length;

  const stat=(k,v,sub,cls,onclick)=>`<button class="dash-stat ${cls||''}" ${onclick?`onclick="${onclick}"`:''}>
    <div class="dash-stat-v">${v}</div><div class="dash-stat-k">${k}</div><div class="dash-stat-sub">${sub}</div></button>`;

  const queue=[...needs,...waiting].map(s=>{
    const sm=STATUS_META[s.status]||{label:s.status,cls:'grey'};
    const who=s.waitingOn?`${PEOPLE[s.waitingOn.who]?.name||''} · ${s.waitingOn.reason}`:'Your review is requested';
    return `<button class="dash-row" onclick="openSessionById('${s.id}')">
      <span class="dash-row-mark ${s.code==='BE-577'?'alt':''}">${s.code}</span>
      <span class="dash-row-main"><span class="dash-row-h">${s.title}<span class="pill ${sm.cls}" style="margin-left:8px">${sm.label}</span></span><span class="dash-row-m">${who}</span></span>
      <span class="dash-row-pct">${s.pct}%<span class="dash-bar"><i style="width:${s.pct}%"></i></span></span>
    </button>`;
  }).join('')||'<div class="dash-empty">Nothing needs you right now.</div>';

  const dls=up.map(u=>{
    const sev=u.left<0?'danger':(u.left<=7?'accent':'grey');
    const lbl=u.left<0?`${-u.left}d overdue`:(u.left===0?'due today':`${u.left}d left`);
    return `<button class="dash-dl" onclick="${sessions.find(x=>x.id===u.id)?`openSessionById('${u.id}')`:`showToast('Opening ${u.label} (demo)')`}">
      <span class="dash-dl-date ${sev}">${u.dateLabel}</span>
      <span class="dash-dl-main"><span class="dash-dl-h">${u.label}</span><span class="dash-dl-m">${u.note}</span></span>
      <span class="pill ${sev==='grey'?'grey':(sev==='danger'?'red':'blue')}">${lbl}</span>
    </button>`;
  }).join('');

  const feed=[
    {ic:'target',t:'Scope & Forms assigned 6 forms',m:'BE-11 · FY25 · 1 flagged for review',time:'2m ago'},
    {ic:'map',t:'Mapping Agent closed a data gap',m:'BE-11 · FY25 · Brazil intercompany balance',time:'18m ago'},
    {ic:'people',t:'Collection agent chasing Tom Reyes',m:'BE-577 · Q2 · Brazil balance outstanding',time:'5h ago'},
    {ic:'shield',t:'Readiness sweep — 0 blockers',m:'Across 3 active reports',time:'1h ago'},
  ].map(a=>`<div class="dash-feed-row"><span class="dash-feed-ic">${OB_ICONS[a.ic]}</span><div class="dash-feed-txt"><div class="dash-feed-h">${a.t}</div><div class="dash-feed-m">${a.m}</div></div><span class="dash-feed-time">${a.time}</span></div>`).join('');

  el.innerHTML=`
    <div class="dash-head">
      <div><h2 class="title">Portfolio</h2><p class="subtitle">Wednesday, 1 July 2026 · ${active.length} active reports · ${needs.length} awaiting your approval</p></div>
      <button class="btn primary" onclick="toggleStartMenu(event)">${OB_ICONS.setup}Start a report</button>
    </div>
    <div class="dash-stats">
      ${stat('Active reports',active.length,'in flight now','','go(\'filings\')')}
      ${stat('Awaiting approval',needs.length,'need your sign-off','accent','go(\'filings\')')}
      ${stat('Due this week',soon,'within 7 days','warn')}
      ${stat('Next deadline',next?next.dateLabel.split(',')[1].trim():'—',next?next.label:'nothing scheduled','')}
    </div>
    <div class="dash-grid">
      <div class="dash-col">
        <div class="dash-card"><div class="dash-card-h">Work queue <span class="dash-card-sub">${needs.length+waiting.length} items</span></div><div class="dash-list">${queue}</div></div>
        <div class="dash-card"><div class="dash-card-h">Agent activity</div><div class="dash-feed">${feed}</div></div>
      </div>
      <div class="dash-col">
        <div class="dash-card"><div class="dash-card-h">Upcoming deadlines</div><div class="dash-list">${dls}</div></div>
      </div>
    </div>`;
}

/* ---------- Home: upcoming reports calendar ---------- */
/* Mock "today" = Wed, Jul 1, 2026 (matches the Home greeting date). Sun-start grid.
   The calendar can be paged month-by-month; deadlines carry real dates so they
   land in the right month as you navigate. Weekday labels match the 2026 calendar. */
const MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];
const TODAY={y:2026,m:6,d:1};
let calY=TODAY.y, calM=TODAY.m;
const UPCOMING=[
  {id:'be577-q2',label:'BE-577 · Q2',date:{y:2026,m:6,d:3},dateLabel:'Fri, Jul 3',note:'64% ready · Brazil balance outstanding',sev:'danger'},
  {id:'be11-fy25',label:'BE-11 · FY25',date:{y:2026,m:6,d:10},dateLabel:'Fri, Jul 10',note:'92% ready · awaiting Sarah Chen\'s signature',sev:'accent'},
  {id:'sf425-q2',label:'SF-425 · Q2',date:{y:2026,m:6,d:31},dateLabel:'Fri, Jul 31',note:'22% ready · mapping in progress',sev:'grey'},
  {id:'cbcr-fy25',label:'Country-by-Country · FY25',date:{y:2026,m:8,d:15},dateLabel:'Tue, Sep 15',note:'38% ready · waiting on scope sign-off',sev:'grey'},
];
function daysLeftOf(dt){ return Math.round((new Date(dt.y,dt.m,dt.d)-new Date(TODAY.y,TODAY.m,TODAY.d))/86400000); }
function calShift(delta){ let m=calM+delta,y=calY; if(m<0){m=11;y--;} if(m>11){m=0;y++;} calM=m; calY=y; renderUpcoming(); }
function renderUpcoming(){
  const y=calY, m=calM;
  const lead=new Date(y,m,1).getDay();
  const daysInMonth=new Date(y,m+1,0).getDate();
  const prevMonthDays=new Date(y,m,0).getDate();
  const byDay={}; UPCOMING.forEach(u=>{ if(u.date.y===y && u.date.m===m) (byDay[u.date.d]=byDay[u.date.d]||[]).push(u); });
  const sevColor={danger:'var(--danger)',accent:'var(--accent)',grey:'var(--text-3)'};
  const isToday=(d)=>d===TODAY.d && y===TODAY.y && m===TODAY.m;
  let cells='';
  for(let i=0;i<lead;i++){ cells+=`<div class="mc-day out">${prevMonthDays-lead+1+i}</div>`; }
  for(let d=1; d<=daysInMonth; d++){
    const items=byDay[d];
    const cls='mc-day'+(isToday(d)?' today':'')+(items?' has-item':'');
    const click=items?` onclick="openFiling('${items[0].id}')" title="${items.map(x=>x.label).join(', ')}"`:(isToday(d)?' title="Today"':'');
    const dot=items?`<span class="mc-dot" style="color:${sevColor[items[0].sev]||'var(--text-3)'}"></span>`:'';
    cells+=`<div class="${cls}"${click}>${d}${dot}</div>`;
  }
  const trailing=(7-((lead+daysInMonth)%7))%7;
  for(let i=1;i<=trailing;i++){ cells+=`<div class="mc-day out">${i}</div>`; }
  document.getElementById('upcomingCal').innerHTML=
    `<div class="mc-monthbar"><button class="mc-nav" onclick="calShift(-1)" title="Previous month"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg></button><span class="mc-month">${MONTHS[m]} ${y}</span><button class="mc-nav" onclick="calShift(1)" title="Next month"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg></button></div><div class="mc-grid">`+
    ['S','M','T','W','T','F','S'].map(d=>`<div class="mc-dow">${d}</div>`).join('')+cells+`</div>`;
  const agenda=UPCOMING.slice().sort((a,b)=>new Date(a.date.y,a.date.m,a.date.d)-new Date(b.date.y,b.date.m,b.date.d));
  document.getElementById('upcomingAgenda').innerHTML=agenda.map(u=>{
    const dl=daysLeftOf(u.date);
    const left=dl<0?`${-dl} days ago`:(dl===0?'Today':`${dl} days left`);
    return `<div class="ua-row" onclick="openFiling('${u.id}')">
      <div class="ua-date"><div class="ua-d">${u.dateLabel}</div><div class="ua-left">${left}</div></div>
      <div class="ua-body"><div class="ua-t">${u.label}</div><div class="ua-m">${u.note}</div></div>
      <div class="chev">${IC.chev}</div>
    </div>`;}).join('');
  document.getElementById('upcomingCount').textContent=UPCOMING.length;
}

/* ---------- Agents & Skills ---------- */
const agents=[
  {n:'Obligation Scout',d:'Scans data, rules & prior filings for what you must file',c:'Recommend',s:'Published',tr:96,on:true,ceiling:'Recommend',
   how:['Reads prior filings, entity register, and available source data for signals','Checks each governed rule set for applicability, thresholds, and exemptions','Classifies every obligation as required, needs confirmation, or not-yet-decidable','Cites the evidence and rule behind each recommendation — never asserts a legal conclusion'],
   applies:['BE-11','Country-by-Country','SF-425','BE-577']},
  {n:'Scope & Entity',d:'Reasons over ownership & thresholds to decide who files what',c:'Recommend',s:'Published',tr:98,on:true,ceiling:'Recommend',
   how:['Builds the ownership graph from entity and consolidation data','Applies size, ownership, and exemption tests per the rule pack','Groups entities by recommended outcome with evidence and the rule behind it','Runs an independent deterministic cross-check before the reviewer commits'],
   applies:['BE-11','Country-by-Country','BE-577']},
  {n:'Source Discovery & Ingestion',d:'Finds sources, schemas & periods; pulls in-scope figures',c:'Prepare',s:'Published',tr:94,on:true,ceiling:'Prepare',
   how:['Matches required fields to known source systems and prior mappings','Confirms the correct source period for each figure','Pulls in-scope values for scoped entities and fields','Reports coverage honestly — high-confidence vs. still missing'],
   applies:['BE-11','SF-425','BE-577']},
  {n:'Mapping & Resolve',d:'Maps data to requirements; flags low-confidence mappings',c:'Prepare',s:'Published',tr:91,on:true,ceiling:'Prepare',
   how:["Maps pulled source data to filing fields using the data dictionary",'Scores each mapping\'s confidence','Routes low-confidence mappings to the preparer for review','Never lets an unresolved mapping populate a filing silently'],
   applies:['BE-11','Country-by-Country','SF-425']},
  {n:'Collection & Chase',d:'Creates, routes, chases & tracks every missing input',c:'Prepare',s:'Published',tr:93,on:true,ceiling:'Prepare',
   how:['Turns each missing fact into a request tied to a field, owner, and due date','Drafts the request for the preparer to review before sending',"Sends on the owner's existing channel — email or Teams",'Chases, escalates, and captures the reply as a governed fact once accepted'],
   applies:['BE-11','BE-577']},
  {n:'Filing Preparation',d:'Populates the filing from accepted facts only',c:'Prepare',s:'Published',tr:97,on:true,ceiling:'Prepare',
   how:['Populates every field from accepted, sourced facts — never invented values','Carries forward allowed context from prior periods','Detects when a newly accepted fact changes a scope decision','Composes the draft package for validation'],
   applies:['BE-11','Country-by-Country','SF-425','BE-577']},
  {n:'Validation & Readiness',d:'Runs checks, interprets results, judges readiness',c:'Recommend',s:'Shadow',tr:88,on:true,ceiling:'Recommend',
   how:['Reconciles accepted facts and re-tests thresholds on real numbers','Interprets check results into blocking errors vs. warnings','Quantifies readiness as a single, explainable percentage','Currently running in shadow mode — compared against human review before it can surface without one'],
   applies:['BE-11']},
  {n:'Review & Approval',d:'Routes review, builds the judgment ledger, manages gates',c:'Prepare',s:'Published',tr:95,on:true,ceiling:'Prepare',
   how:['Builds the judgment ledger — every decision, value, and override with its source','Runs final verification and summarizes the result','Routes to the right reviewer per your governance policy','Never releases a package without a recorded final approval'],
   applies:['BE-11','Country-by-Country','BE-577']},
  {n:'Package & Filing',d:'Composes the package & evidence bundle, stages the run',c:'Prepare',s:'Published',tr:99,on:false,ceiling:'Prepare',
   how:['Assembles final forms with full source provenance','Builds the evidence bundle and attaches the audit trail',"Saves the next-year baseline and this cycle's operating history",'Stages the package for your approved submission process — never files directly'],
   applies:['BE-11','BE-577']},
];
const skills=[
  {n:'Send tracked request (email / Teams)',d:'Drafts and sends a field-level data request, then tracks it to close',usedBy:['Collection & Chase'],io:'Field + owner + due date + evidence requirement → a tracked, auditable request',scopes:['Outbound email','Teams message'],on:true},
  {n:'Deterministic threshold evaluator',d:'The authority for repeatable scope, size, and validation logic',usedBy:['Scope & Entity','Validation & Readiness'],io:'Entity figures + rule pack → pass/fail + the independent cross-check result',scopes:['Read rule pack'],on:true},
  {n:'Judgment-ledger composer',d:"Assembles the reviewer's complete, sourced decision record",usedBy:['Review & Approval'],io:'Scope, values, warnings, overrides → one signable ledger',scopes:['Read audit trail'],on:true},
  {n:'XML / CSV package builder',d:'Produces the agency-ready artifact per form class',usedBy:['Package & Filing'],io:'Populated forms → CSV / XML / PDF filing artifacts',scopes:['Write package store'],on:true},
];
function toggleAgent(idx){ agents[idx].on=!agents[idx].on; document.querySelectorAll(`.agent-switch[data-idx="${idx}"]`).forEach(b=>b.classList.toggle('on',agents[idx].on)); }
function toggleSkill(idx){ skills[idx].on=!skills[idx].on; document.querySelectorAll(`.skill-switch[data-idx="${idx}"]`).forEach(b=>b.classList.toggle('on',skills[idx].on)); }
function renderAgents(){
  document.getElementById('agentsList').innerHTML=agents.map((a,idx)=>`
    <div class="set-row clickable" onclick="openAgentModal(${idx})">
      <div class="sl"><div class="t">${a.n}</div><div class="d">${a.d}</div></div>
      <span class="pill ${a.s==='Published'?'green':'amber'}">${a.s}</span>
      <span class="lvl ${a.c.toLowerCase()}">${a.c}</span>
      <span class="muted" style="font-size:12px;width:82px;text-align:right">${a.tr}% accepted</span>
      <button class="switch agent-switch ${a.on?'on':''}" data-idx="${idx}" onclick="event.stopPropagation();toggleAgent(${idx})"></button>
    </div>`).join('');
  document.getElementById('skillsList').innerHTML=skills.map((s,idx)=>`
    <div class="set-row clickable" onclick="openSkillModal(${idx})">
      <div class="sl"><div class="t">${s.n}</div><div class="d">${s.d}</div></div>
      <button class="switch skill-switch ${s.on?'on':''}" data-idx="${idx}" onclick="event.stopPropagation();toggleSkill(${idx})"></button>
    </div>`).join('');
}
function openAgentModal(idx){
  const a=agents[idx]; const m=document.getElementById('modal');
  m.innerHTML=`<div class="modal-h">${IC.agents}<h3>${a.n}</h3><span class="pill ${a.s==='Published'?'green':'amber'}" style="margin-left:4px">${a.s}</span><button class="xbtn" onclick="closeModal()">✕</button></div>
  <div class="modal-b">
    <p class="muted" style="margin-bottom:16px">${a.d}</p>
    <div class="section-h" style="margin-top:0">How it works</div>
    <ul class="brief-list" style="gap:9px">${a.how.map(h=>`<li><span class="tag ok" style="min-width:0;padding:2px 7px">✓</span>${h}</li>`).join('')}</ul>
    <div class="section-h">Applies to</div>
    <div style="display:flex;flex-wrap:wrap;gap:7px">${a.applies.map(x=>`<span class="pill blue">${x}</span>`).join('')}</div>
    <div class="section-h">Autonomy ceiling</div>
    <div class="set-row" style="padding:0 0 6px"><div class="sl"><div class="d" style="margin-top:0">How far this agent may act before asking. It can never cross a signature commit.</div></div>
      <select class="mini"><option ${a.ceiling==='Read'?'selected':''}>Read</option><option ${a.ceiling==='Recommend'?'selected':''}>Recommend</option><option ${a.ceiling==='Prepare'?'selected':''}>Prepare</option></select></div>
    <div class="section-h">Track record</div>
    <div class="rd"><span class="lbl">Accepted without change</span><div class="bar" style="flex:1;max-width:none"><i style="width:${a.tr}%"></i></div><span class="num g">${a.tr}%</span></div>
  </div>
  <div class="modal-f"><span class="muted" style="font-size:12.5px;margin-right:auto">Enabled</span><button class="switch agent-switch ${a.on?'on':''}" data-idx="${idx}" onclick="toggleAgent(${idx})"></button><button class="btn primary" onclick="closeModal()">Done</button></div>`;
  document.getElementById('overlay').classList.add('open');
}
function openSkillModal(idx){
  const s=skills[idx]; const m=document.getElementById('modal');
  m.innerHTML=`<div class="modal-h">${IC.doc}<h3>${s.n}</h3><button class="xbtn" onclick="closeModal()">✕</button></div>
  <div class="modal-b">
    <p class="muted" style="margin-bottom:16px">${s.d}</p>
    <div class="section-h" style="margin-top:0">Used by</div>
    <div style="display:flex;flex-wrap:wrap;gap:7px">${s.usedBy.map(x=>`<span class="pill blue">${x}</span>`).join('')}</div>
    <div class="section-h">Inputs → outputs</div>
    <div class="inbubble">${s.io}</div>
    <div class="section-h">Permission scopes</div>
    <div style="display:flex;flex-wrap:wrap;gap:7px">${s.scopes.map(x=>`<span class="pill">${x}</span>`).join('')}</div>
  </div>
  <div class="modal-f"><span class="muted" style="font-size:12.5px;margin-right:auto">Enabled</span><button class="switch skill-switch ${s.on?'on':''}" data-idx="${idx}" onclick="toggleSkill(${idx})"></button><button class="btn primary" onclick="closeModal()">Done</button></div>`;
  document.getElementById('overlay').classList.add('open');
}
/* ---------- Artifacts ---------- */
const artifacts={
  Projects:[
    {ic:'scope',kind:'scope',t:'BE-11 FY25 Scope Plan',m:'BE-11 · v3 · Scope & Entity agent',time:'today'},
    {ic:'doc',kind:'mapping',t:'BE-11 FY25 Mapping Table',m:'BE-11 · v2 · Mapping & Resolve agent',time:'today'},
    {ic:'doc',kind:'readiness',t:'Readiness Report — 92%',m:'BE-11 FY25 · v5 · Validation & Readiness agent',time:'1h'},
    {ic:'scope',kind:'cbcr-scope',t:'CbCR Scope Plan (draft)',m:'CbCR · v1 · Scope & Entity agent',time:'2h'},
  ],
  Packages:[
    {ic:'pkg',kind:'package',t:'BE-11 FY25 Filing Package',m:'BE-11 · draft · Package & Filing agent',time:'1h'},
    {ic:'pkg',kind:'evidence',t:'BE-11 FY25 Evidence Bundle',m:'BE-11 · assembling · 41 items',time:'1h'},
    {ic:'pkg',kind:'package',t:'BE-577 Q1 Package',m:'BE-577 · filed · v final',time:'Apr'},
    {ic:'pkg',kind:'package',t:'BE-11 FY24 Filing Package',m:'BE-11 · filed Apr 12 · v final',time:'Apr'},
  ],
  Audits:[
    {ic:'audit',kind:'ledger',t:'BE-11 FY25 Judgment Ledger',m:'BE-11 · prepared for Sarah Chen',time:'1h'},
    {ic:'audit',kind:'audittrail',t:'BE-11 FY25 Audit Trail',m:'BE-11 · 214 attributed events',time:'live'},
    {ic:'audit',kind:'export',t:'Regulator-ready Explainability Export',m:'BE-577 Q1 · PDF',time:'Apr'},
    {ic:'audit',kind:'audittrail',t:'BE-11 FY24 Audit Trail',m:'BE-11 · filed & closed · 1 restatement',time:'Apr'},
  ],
};
let artTab='Projects';
function setArt(tab,btn){ artTab=tab; document.querySelectorAll('#artSeg button').forEach(b=>b.classList.remove('active')); btn.classList.add('active'); renderArt(); }
function renderArt(){
  if(artTab==='Forms'){ renderArtForms(); return; }
  const l=artifacts[artTab];
  document.getElementById('artCount').textContent=`${l.length} ${artTab.toLowerCase()}`;
  document.getElementById('artList').innerHTML=l.map((a,idx)=>`<div class="row clickable" onclick="openArtifact('${artTab}',${idx})"><div class="rico">${IC[a.ic]}</div><div class="rtxt"><div class="t"><b>${a.t}</b></div><div class="m">${a.m}</div></div><div class="rtime">${a.time}</div></div>`).join('');
}
/* Forms tab — every form in scope, grouped by the report that owns it. */
const artFormsExpanded=new Set();
function toggleArtForms(id){ if(artFormsExpanded.has(id)) artFormsExpanded.delete(id); else artFormsExpanded.add(id); renderArtForms(); }
function renderArtForms(){
  let total=0, html='';
  const CAP=8;
  sessions.forEach(s=>{
    const fd=s.forms||FORMS[s.id]; if(!fd||!fd.items||!fd.items.length) return;
    const all=expandForms(s.id);
    const done=all.filter(f=>f.status==='done').length;
    total+=all.length;
    const isEx=artFormsExpanded.has(s.id);
    const shown=isEx?all:all.slice(0,CAP);
    html+=`<div class="art-grp"><div class="art-grp-h"><span class="mark">${s.code}</span><div class="gb"><div class="gt">${s.title}</div><div class="gm">${s.sub}</div></div><span class="wq-count" style="background:var(--surface-3);color:var(--text-2)">${done}/${fd.total} complete</span></div>`;
    html+=shown.map(f=>{
      const st=FORM_STATUS[f.status]||FORM_STATUS.todo;
      const meta=f.country?`${f.code} · ${f.country}`:`${f.code} · one form per ${fd.unit}`;
      return `<div class="row clickable" onclick="openForm('${s.id}','${f.id}')"><div class="rico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/><path d="M9 13h6M9 17h6"/></svg></div><div class="rtxt"><div class="t"><b>${f.entity}</b></div><div class="m">${meta}</div></div><span class="pill ${st.cls}">${st.label}</span><span class="rtime" style="margin-left:10px"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" style="width:16px;height:16px"><path d="M9 6l6 6-6 6"/></svg></span></div>`;
    }).join('');
    if(all.length>CAP) html+=`<div class="form-more clickable" onclick="toggleArtForms('${s.id}')">${isEx?'Show fewer':`Show all ${fd.total} forms · one per ${fd.unit} in scope`}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:15px;height:15px;transform:rotate(${isEx?180:0}deg)"><path d="M6 9l6 6 6-6"/></svg></div>`;
    html+=`</div>`;
  });
  document.getElementById('artCount').textContent=`${total} forms across active reports`;
  document.getElementById('artList').innerHTML=html;
}
const scrow=(n,out,c,why,ev)=>`<div class="scrow"><div class="g"><span class="tag ${c==='g'?'ok':'conf'}" style="min-width:0">${out}</span></div><div style="flex:1"><div style="font-weight:600;font-size:13.5px">${n}</div><div class="muted" style="font-size:12.5px">${why}</div><div class="prov" style="margin-top:8px;border:none;padding:0"><span class="chip">${IC.doc} ${ev}</span></div></div></div>`;
const lrow=(c,t,d)=>`<div class="lrow"><div class="lico ${c}">${c==='g'?'✓':'!'}</div><div><div style="font-weight:600;font-size:13.5px">${t}</div><div class="muted" style="font-size:12.5px">${d}</div></div></div>`;
function scopeTableHtml(){
  return `<p class="muted" style="margin-bottom:14px">42 affiliates grouped by recommended outcome. Each row cites its evidence and rule. 3 need review before approval.</p>`+
    scrow('Germany Manufacturing GmbH','BE-11B','g','Majority-owned · sales above threshold','FY25 ERP revenue · affiliate size test')+
    scrow('France Holdings SAS','BE-11A','g','US-reporter consolidated','Ownership graph')+
    scrow('Brazil Services Ltda','Review','a','Revenue near threshold — confirm FY25','Pending accepted revenue')+
    scrow('Singapore Trading Pte','Not filing','g','Below size test','Exemption rule 3.1')+
    scrow('India Tech Pvt (+2)','Deferred','a','Awaiting current-year financials','Watched — re-checks daily');
}
function cbcrScopeTableHtml(){
  return `<p class="muted" style="margin-bottom:14px">6 tax jurisdictions grouped by outcome. Facts are shared with the BE-11 filing where they overlap.</p>`+
    scrow('United States','Reporting entity','g','Ultimate parent · consolidated group','Entity register')+
    scrow('Germany','Constituent entity','g','Above threshold · revenue &amp; profit reported','FY25 consolidation')+
    scrow('Brazil','Review','a','Jurisdiction assignment needs confirming','Pending accepted revenue')+
    scrow('Singapore','Constituent entity','g','Below materiality — included for completeness','Consolidation extract')+
    scrow('Ireland, Canada (+2 more)','Constituent entity','g','Standard reporting','Entity register');
}
function mappingTableHtml(){
  const rows=[
    {f:'Total assets',src:'ERP · Balance sheet',c:'High'},{f:'Sales / operating revenue',src:'ERP · Income statement',c:'High'},
    {f:'Net income',src:'ERP · Income statement',c:'High'},{f:'Employee count',src:'HRIS export',c:'High'},
    {f:'Industry classification',src:'Entity register',c:'Review'},{f:'Intercompany balances',src:'Consolidation system',c:'Review'},
    {f:'FY25 period-end FX rate',src:'Treasury feed',c:'Confirm period'},
  ];
  return `<p class="muted" style="margin-bottom:12px">18 fields mapped with high confidence, 7 flagged for review, 4 periods to confirm.</p>
  <table class="table"><thead><tr><th>Field</th><th>Source</th><th>Confidence</th></tr></thead><tbody>`+
  rows.map(r=>`<tr><td>${r.f}</td><td class="muted">${r.src}</td><td><span class="pill ${r.c==='High'?'green':'amber'}">${r.c}</span></td></tr>`).join('')+
  `</tbody></table>`;
}
function readinessBlockHtml(pct,block,warn,evid){
  return `<div class="readiness">
    <div class="rd"><span class="lbl">Package ready</span><div class="bar" style="flex:1;max-width:none"><i style="width:${pct}%"></i></div><span class="num g">${pct}%</span></div>
    <div class="rd"><span class="lbl">Blocking errors</span><span class="num g">${block}</span></div>
    <div class="rd"><span class="lbl">Warnings</span><span class="num a">${warn}</span></div>
    <div class="rd"><span class="lbl">Pending evidence</span><span class="num a">${evid}</span></div>
  </div><p class="muted" style="margin-top:14px;font-size:12.5px">1 approved scope change (Brazil Services Ltda → BE-11B) reflected above.</p>`;
}
function ledgerBodyHtml(){
  return `<p class="muted" style="margin-bottom:14px">Sign on evidence, not faith. Every decision, value, and override — with its source.</p>`+
    lrow('g','Final scope confirmed','42 affiliates · 37 consistent with last year · 3 claims for not filing')+
    lrow('a','1 scope change approved','Brazil Services Ltda → BE-11B after accepted FY25 revenue')+
    lrow('g','All values sourced','No invented figures — each traces to a deterministic tool or accepted fact')+
    lrow('a','1 value from email','Germany net income from Maria Keller — evidence attached, confidence high')+
    lrow('g','3 warnings resolved','Reconciliation & prior-period checks passed')+
    lrow('g','Final verification passed','0 blocking issues');
}
function packageBodyHtml(item){
  return `<p class="muted" style="margin-bottom:12px">${item.m}</p>`+
    lrow('g','Forms included','BE-11A, BE-11B ×31, BE-11C ×3, BE-11D ×5')+
    lrow('g','Provenance attached','Every value traces to a source or deterministic calculation')+
    lrow('g','Versions','Blueprint v4 · Rule pack v7 · Scope v3');
}
function evidenceBodyHtml(item){
  return `<p class="muted" style="margin-bottom:12px">${item.m}</p>
  <table class="table"><thead><tr><th>Item</th><th>Type</th><th>Linked to</th></tr></thead><tbody>
  <tr><td>FY25 ERP revenue export</td><td class="muted">System export</td><td>28 affiliates</td></tr>
  <tr><td>Maria Keller — email reply</td><td class="muted">Email</td><td>Germany Manufacturing GmbH</td></tr>
  <tr><td>Consolidation extract</td><td class="muted">System export</td><td>Ownership graph</td></tr>
  <tr><td>Scope approval record</td><td class="muted">Signature commit</td><td>Sarah Chen · scope</td></tr>
  <tr><td>+37 more items</td><td class="muted">—</td><td>—</td></tr>
  </tbody></table>`;
}
function auditTrailBodyHtml(item){
  const rows=[['Just now','Julie Ruiz','Accepted 2 governed facts'],['1h ago','Collection agent','Sent 8 data requests'],
    ['2h ago','Sarah Chen','Confirmed scope (signature commit)'],['3h ago','Scope & Entity agent','Cross-check passed — 0 blocking issues'],
    ['3h ago','Obligation Scout','Classified 42 affiliates']];
  return `<p class="muted" style="margin-bottom:12px">${item.m}</p>
  <table class="table"><thead><tr><th>When</th><th>Actor</th><th>Action</th></tr></thead><tbody>`+
  rows.map(r=>`<tr><td class="muted">${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('')+`</tbody></table>`;
}
function exportBodyHtml(item){
  return `<p class="muted" style="margin-bottom:12px">${item.m}</p>
  <div class="inbubble"><div class="lab">Contents</div>Final scope · every value with source · warnings &amp; resolutions · overrides · final verification result · blueprint &amp; rule-pack versions — formatted for an auditor or regulator, not just internal use.</div>`;
}
function openArtifact(tab,idx){
  const item=artifacts[tab][idx]; const m=document.getElementById('modal');
  let body='', foot=`<button class="btn sec" onclick="closeModal()">Close</button>`;
  const badge=item.m.split('·')[0].trim();
  const header=`<div class="modal-h">${IC[item.ic]}<h3>${item.t}</h3><span class="pill" style="margin-left:4px">${badge}</span><button class="xbtn" onclick="closeModal()">✕</button></div>`;
  switch(item.kind){
    case 'scope': body=scopeTableHtml(); foot+=`<button class="btn sig" onclick="closeModal()">Send for scope approval</button>`; break;
    case 'cbcr-scope': body=cbcrScopeTableHtml(); foot+=`<button class="btn sig" onclick="closeModal()">Send for scope approval</button>`; break;
    case 'mapping': body=mappingTableHtml(); break;
    case 'readiness': body=readinessBlockHtml(92,0,3,2); break;
    case 'ledger': body=ledgerBodyHtml(); foot=`<button class="btn sec" onclick="closeModal()">Send back with comments</button><button class="btn sig" onclick="closeModal();approveFromLedger()">Approve final package</button>`; break;
    case 'package': body=packageBodyHtml(item); foot+=`<button class="btn primary" onclick="showToast('Download started (mock)')">Download package</button>`; break;
    case 'evidence': body=evidenceBodyHtml(item); foot+=`<button class="btn primary" onclick="showToast('Download started (mock)')">Download bundle</button>`; break;
    case 'audittrail': body=auditTrailBodyHtml(item); foot+=`<button class="btn primary" onclick="showToast('Export started (mock)')">Export CSV</button>`; break;
    case 'export': body=exportBodyHtml(item); foot+=`<button class="btn primary" onclick="showToast('Download started (mock)')">Download PDF</button>`; break;
    default: body=`<p class="muted">Preview not available.</p>`;
  }
  m.innerHTML=header+`<div class="modal-b">${body}</div><div class="modal-f">${foot}</div>`;
  document.getElementById('overlay').classList.add('open');
}
/* ---------- Schedules ---------- */
const schedules=[
  {n:'Deadline watch',d:'Daily · all filings',on:true,runs:[
    {time:'2h ago',outcome:'1 finding — BE-577 due in 2 days',sid:'be577-q2'},
    {time:'1d ago',outcome:'No findings'},{time:'2d ago',outcome:'No findings'},
    {time:'3d ago',outcome:'1 finding — CbCR filing window opens next week',sid:'cbcr-fy25'}]},
  {n:'Source-freshness monitor',d:'On new source data',on:true,runs:[
    {time:'5h ago',outcome:'CbCR unblocked — new FY25 consolidation loaded',sid:'cbcr-fy25'},
    {time:'1d ago',outcome:'No new source data'},{time:'3d ago',outcome:'BE-11 sources refreshed'}]},
  {n:'Deferred-decision re-check',d:'Daily · not-yet-decidable items',on:true,runs:[
    {time:'Today',outcome:'0 findings — 5 items still pending current-year financials'},
    {time:'Yesterday',outcome:'0 findings'}]},
  {n:'Regulatory-change radar',d:'Weekly · BEA, IRS',on:false,runs:[
    {time:'Last week',outcome:'1 change — IRS updated Form 8975 instructions',sid:'cbcr-fy25'},
    {time:'2 weeks ago',outcome:'No changes'}]},
  {n:'Readiness sweep',d:'Daily · active filings',on:true,runs:[
    {time:'1h ago',outcome:'0 blockers across 3 active filings'},
    {time:'Yesterday',outcome:'1 blocker resolved on BE-11'}]},
];
function toggleSchedule(idx){ schedules[idx].on=!schedules[idx].on; document.querySelectorAll(`.sched-switch[data-idx="${idx}"]`).forEach(b=>b.classList.toggle('on',schedules[idx].on)); }
function renderSched(){
  document.getElementById('schedList').innerHTML=schedules.map((s,idx)=>`
    <div class="set-row clickable" onclick="openScheduleModal(${idx})">
      <div class="sl"><div class="t">${s.n}</div><div class="d">${s.d} · last run ${s.runs[0].time.toLowerCase()}</div></div>
      <span class="lvl prepare">Prepare-capped</span>
      <button class="switch sched-switch ${s.on?'on':''}" data-idx="${idx}" onclick="event.stopPropagation();toggleSchedule(${idx})"></button>
    </div>`).join('');
  document.getElementById('schedFindings').innerHTML=findings.map(a=>`<div class="row"><div class="rico">${IC[a.ic]}</div><div class="rtxt"><div class="t">${a.t}</div><div class="m">${a.m}</div></div><div class="rtime">${a.time}</div></div>`).join('');
}
function openScheduleModal(idx){
  const s=schedules[idx]; const m=document.getElementById('modal');
  m.innerHTML=`<div class="modal-h">${IC.sched}<h3>${s.n}</h3><span class="pill ${s.on?'green':'grey'}" style="margin-left:4px">${s.on?'On':'Off'}</span><button class="xbtn" onclick="closeModal()">✕</button></div>
  <div class="modal-b"><p class="muted" style="margin-bottom:14px">${s.d} · capped at Prepare — findings come to you, it never files on its own.</p>
  ${s.runs.map(r=>{
    const ok=r.outcome.startsWith('0')||r.outcome.startsWith('No');
    return `<div class="lrow"><div class="lico ${ok?'g':'a'}">${ok?'✓':'!'}</div>
    <div style="flex:1"><div style="font-weight:600;font-size:13.5px">${r.time}</div><div class="muted" style="font-size:12.5px">${r.outcome}</div></div>
    ${r.sid?`<button class="btn sec" style="padding:6px 12px;font-size:12px" onclick="closeModal();openSessionById('${r.sid}')">Open</button>`:''}</div>`;
  }).join('')}
  </div>
  <div class="modal-f"><button class="btn sec" onclick="closeModal()">Close</button></div>`;
  document.getElementById('overlay').classList.add('open');
}

/* ---------- drawer / session-flow modal ---------- */
function openDrawer(){document.getElementById('drawer').classList.add('open');}
function closeDrawer(){document.getElementById('drawer').classList.remove('open');}
function closeModal(){document.getElementById('overlay').classList.remove('open');}
function openModal(kind){
  const m=document.getElementById('modal');
  if(kind==='scope'){m.innerHTML=`
    <div class="modal-h">${IC.scope}<h3>BE-11 Scope Plan</h3><span class="pill" style="margin-left:4px">v3 · cross-checked</span><button class="xbtn" onclick="closeModal()">✕</button></div>
    <div class="modal-b">${scopeTableHtml()}</div>
    <div class="modal-f"><button class="btn sec" onclick="closeModal()">Close</button><button class="btn sig" onclick="closeModal()">Send for scope approval</button></div>`;}
  if(kind==='cbcr-scope'){m.innerHTML=`
    <div class="modal-h">${IC.scope}<h3>CbCR Scope Plan</h3><span class="pill" style="margin-left:4px">v1 · cross-checked</span><button class="xbtn" onclick="closeModal()">✕</button></div>
    <div class="modal-b">${cbcrScopeTableHtml()}</div>
    <div class="modal-f"><button class="btn sec" onclick="closeModal()">Close</button><button class="btn sig" onclick="closeModal()">Send for scope approval</button></div>`;}
  if(kind==='ledger'){m.innerHTML=`
    <div class="modal-h">${IC.audit}<h3>Judgment Ledger — BE-11 FY25</h3><span class="pill" style="margin-left:4px">for Sarah Chen</span><button class="xbtn" onclick="closeModal()">✕</button></div>
    <div class="modal-b">${ledgerBodyHtml()}</div>
    <div class="modal-f"><button class="btn sec" onclick="closeModal()">Send back with comments</button><button class="btn sig" onclick="closeModal();approveFromLedger()">Approve final package</button></div>`;}
  document.getElementById('overlay').classList.add('open');
}
/* ---------- SESSION narrative ---------- */
const phases=[
  {t:'step',ph:0,label:'Front door',meta:'Obligation & readiness'},
  {t:'step',ph:1,label:'Scope',meta:'Who files what'},
  {t:'gate',after:1,label:'Scope sign-off'},
  {t:'step',ph:2,label:'Map & ingest',meta:'Find the data'},
  {t:'step',ph:3,label:'Collect & chase',meta:'Close the gaps'},
  {t:'step',ph:4,label:'Validate',meta:'Reconcile on real numbers'},
  {t:'step',ph:5,label:'Prepare & assemble',meta:'Build the package'},
  {t:'step',ph:6,label:'Review',meta:'Judgment ledger'},
  {t:'gate',after:6,label:'Final approval'},
  {t:'step',ph:7,label:'Close',meta:'Stage & carry forward'},
];
const steps=[
 {ph:0,lvl:'recommend',html:`<p><strong>BE-11 readiness review is ready.</strong> I read last year's filing, current entity data, your FY25 sources, the BE-11 blueprint, and the current rule pack — organising what's known, not declaring a conclusion.</p>
   <ul class="brief-list"><li><span class="tag ok">31 clean</span> affiliates unchanged from last year</li><li><span class="tag conf">6 confirm</span> need ownership confirmation</li><li><span class="tag nyd">5 pending</span> not decidable until current-year financials</li></ul>`,
   agents:[{n:'Obligation Scout',p:'Confirmed BE-11 applies from entity size & revenue tests',status:'done'},{n:'Scope & Entity',p:'Pre-grouped 42 affiliates by expected outcome',status:'done'}],
   actions:[{t:'Prepare the scope plan',lvl:'prepare',adv:true}]},
 {ph:1,lvl:'prepare',html:`<p>Here's the <strong>scope plan</strong> — 42 affiliates grouped by recommended outcome, each with its evidence and rule. My independent cross-check found no blocking issues. <strong>3 items need your review</strong> before approval.</p>
   <div class="kv"><span class="kk">Recommended</span><span>28 file · 9 claim not-filing · 5 deferred</span><span class="kk">Cross-check</span><span>No blocking issues</span></div>`,
   agents:[{n:'Scope & Entity',p:'Grouped 42 affiliates by recommended outcome, evidence & rule',status:'done'},{n:'Validation & Readiness',p:'Ran the independent deterministic cross-check on every threshold',status:'done'}],
   actions:[{t:'Open the scope plan',lvl:'read',modal:'scope'},{t:'Send it to the controller',lvl:'commit',sig:true,adv:true}]},
 {ph:1,lvl:'commit',sys:'Sent to Sarah Chen (Controller) for scope approval',html:`<p><strong>Scope confirmed by Sarah Chen.</strong> She saw what changed from last year, the exceptions you resolved, and the cross-check — then confirmed.</p>
   <div class="attrib">${av('sc')} Recorded with user, timestamp, scope version, evidence &amp; rule-pack version</div>`,
   actions:[{t:'Continue — find the data',lvl:'recommend',adv:true}]},
 {ph:2,lvl:'recommend',html:`<p>I found likely sources for <strong>84% of required BE-11 values</strong> — matched to your ERP, consolidation, and prior mappings. I won't pretend the rest is done:</p>
   <div class="kv"><span class="kk">Mapped (high)</span><span>18 fields</span><span class="kk">Needs review</span><span>7 fields</span><span class="kk">Missing</span><span>12 required facts</span><span class="kk">Periods to confirm</span><span>4 sources</span></div>
   <p style="margin-top:11px">One figure has <strong>no connected source</strong> — <em>industry classification for Brazil Services Ltda</em> isn't in your ERP or consolidation system. If you have it, upload it and I'll accept it as a governed fact; otherwise I'll request it from an owner.</p>`,
   agents:[{n:'Source Discovery & Ingestion',p:'Matched required fields to your ERP, consolidation & prior mappings',status:'done'},{n:'Mapping & Resolve',p:'Mapping pulled values to BE-11 fields and scoring confidence'}],
   actions:[{t:'Upload the missing figure',lvl:'prepare',upload:true,uctx:{field:'Industry classification',entity:'Brazil Services Ltda',code:'BE-11',file:'Brazil_FY25_industry_class.xlsx',chat:true}},{t:'Prepare the missing-data requests',lvl:'prepare',adv:true}]},
 {ph:3,lvl:'prepare',html:`<p>This is where I get to work. I turned each gap into a targeted request tied to a field, affiliate, owner and due date. <strong>8 are ready to send.</strong></p>
   <div class="inbubble"><div class="lab">Preview → Maria Keller, Germany Manufacturing GmbH</div>"For the FY25 BE-11 filing, please provide year-end employee count and net income after foreign income tax. These feed BE-11B readiness."</div>
   <div class="prov"><span class="chip">12 missing</span><span class="chip">8 ready</span><span class="chip">2 need confirmation</span><span class="chip">2 overdue</span></div>`,
   agents:[{n:'Collection & Chase',p:'Turning 12 gaps into tracked requests across 8 owners'}],
   actions:[{t:'Show me the agent activity',lvl:'read',drawer:true},{t:'Send the 8 requests',lvl:'commit',adv:true}]},
 {ph:3,lvl:'commit',sys:'Reply received from Maria Keller — by email, no new tool to learn',html:`<p>Maria replied. I mapped her values to the form and attached her email as evidence.</p>
   <div class="kv"><span class="kk">Employee count</span><span>→ BE-11B Item 10</span><span class="kk">Net income</span><span>→ BE-11B Item 7</span><span class="kk">Confidence</span><span>High · evidence attached</span></div>
   <div class="attrib">${av('mk')} Maria Keller · captured &amp; mapped by Collection agent</div>`,
   agents:[{n:'Collection & Chase',p:"Captured Maria's emailed reply and attached it as evidence",status:'done'},{n:'Mapping & Resolve',p:'Mapped her values to BE-11B Items 7 & 10',status:'done'}],
   actions:[{t:'Accept these as governed facts',lvl:'commit',adv:true}]},
 {ph:4,lvl:'recommend',html:`<p>Re-testing on the real numbers, I caught something — I won't quietly continue on a stale decision:</p>
   <p><strong>Scope change detected.</strong> Brazil Services Ltda now exceeds the BE-11B threshold on accepted FY25 revenue.</p>`,
   agents:[{n:'Validation & Readiness',p:'Re-tested every threshold on the accepted FY25 numbers',status:'done'},{n:'Scope & Entity',p:'Flagged Brazil Services Ltda — now over the BE-11B size test',status:'done'}],
   actions:[{t:'Prepare the scope update',lvl:'prepare',adv:true}]},
 {ph:5,lvl:'prepare',sys:'Delta approved by Sarah Chen · Brazil → BE-11B',html:`<p><strong>Draft package prepared from accepted facts only.</strong> Every value has a source. Here's where readiness stands:</p>
   ${readinessBlockHtml(92,0,3,2)}`,
   agents:[{n:'Filing Preparation',p:'Populated the draft package from accepted, sourced facts only'}],
   actions:[{t:'Prepare it for final review',lvl:'prepare',adv:true}]},
 {ph:6,lvl:'commit',html:`<p><strong>BE-11 is ready for final review.</strong> I built Sarah a judgment ledger — final scope, every value with source, warnings resolved, and the one value that came from email. She can sign in minutes, or refuse with the exact divergence named.</p>`,
   agents:[{n:'Review & Approval',p:'Built the judgment ledger and routed it to Sarah Chen',status:'done'}],
   actions:[{t:'Open the judgment ledger',lvl:'read',modal:'ledger'},{t:'Approve the final package',lvl:'commit',sig:true,adv:true}]},
 {ph:7,lvl:'commit',sys:'Approved & locked by Sarah Chen',html:`<p><strong>BE-11 package is complete.</strong> Evidence bundle created, provenance and audit trail attached, next-year baseline saved.</p>
   <div class="prov"><span class="chip">${IC.pkg} Filing package</span><span class="chip">41 evidence items</span><span class="chip">214 audited events</span><span class="chip">Baseline saved</span></div>`,
   agents:[{n:'Package & Filing',p:'Composed the agency package, evidence bundle & audit trail',status:'done'}],
   actions:[{t:"Create next year's monitoring plan",lvl:'commit',adv:true}]},
 {ph:7,lvl:'recommend',html:`<p>Monitoring plan created. I'll watch deadlines, source freshness, and the deferred items — and reopen BE-11 next year <strong>already ahead</strong>. That's the shift: from coordinating the filing to governing it.</p>`,
   agents:[{n:'Obligation Scout',p:'Scheduled next-year monitoring, deadline & source-freshness watches',status:'done'}],
   actions:[{t:'Back to Home',lvl:'read',home:true}]},
];
let sIdx=0, busy=false, complete=false, mode='clean';
let spineState={active:false,phase:0,complete:false};
const STARTERS=[
  {t:'What do we need to file this period?',key:'file'},
  {t:'What needs my approval?',key:'approve'},
  {t:"What's overdue right now?",key:'overdue'},
  {t:"What's due this week?",key:'duesoon'},
  {t:'Compare BE-11: FY25 vs FY24',key:'cmpyoy'},
  {t:'Compare readiness across my reports',key:'cmpreports'},
  {t:'Start the BE-11 FY25 filing',key:'startbe11'},
];
/* Shared 8-step lifecycle spine markup (used by the report dashboard). */
function phaseSpineHtml(cp, comp){
  return phases.map(n=>{
    if(n.t==='gate'){
      const st=comp && n.after>=6 ? 'done' : (cp>n.after?'done':(cp===n.after?'current':'pending'));
      return `<li class="snode gate ${st}"><span class="smark">${st==='done'?IC.check:''}</span><div class="srow"><div class="slabel">${n.label} <span class="gate-tag">Human</span></div><div class="smeta">Signature commit</div></div></li>`;
    }
    const st=n.ph<cp?'done':(n.ph===cp?(comp?'done':'current'):'pending');
    return `<li class="snode ${st}"><span class="smark">${st==='done'?IC.check:''}</span><div class="srow"><div class="slabel">${n.label}</div><div class="smeta">${n.meta}</div></div></li>`;
  }).join('');
}
function renderSpine(){
  const el=document.getElementById('spine'); if(!el) return;
  if(!spineState.active){ el.innerHTML=`<li class="spine-empty">Pick or start a filing and its 8-step lifecycle will track here.</li>`; return; }
  el.innerHTML=phaseSpineHtml(spineState.phase, spineState.complete);
}
function append(html){ document.getElementById('threadInner').insertAdjacentHTML('beforeend',html); scrollThread(); }
function opTurn(lvl,body,actionsHtml,id){ return `<div class="op-turn turn"${id?` id="${id}"`:''}><div class="op-av">${IC.op}</div><div class="op-body"><div class="op-name">Operator <span class="lvl ${lvl}">${cap(lvl)}</span></div><div class="bubble">${body}${actionsHtml?`<div class="actions">${actionsHtml}</div>`:''}</div></div></div>`; }
function sysTurn(text){ return `<div class="sys-turn turn"><span>${IC.op} ${text}</span></div>`; }
/* Shows, inside the chat, which specialist agents the Operator spins up for a step —
   each with the purpose it was dispatched for and a live status. */
function agentRowHtml(a){
  const st=a.status||'run';
  const lab=st==='done'?'Done':(st==='queued'?'Queued':'Working');
  return `<div class="ad-row" data-st="${st}">
    <div class="ad-ic">${IC.agents}</div>
    <div class="ad-tx"><div class="ad-n">${a.n} agent</div><div class="ad-p">${a.p}</div></div>
    <span class="ad-st ${st}"><span class="dot"></span>${lab}</span>
  </div>`;
}
function agentDispatchHtml(list,id){
  const running=list.some(a=>(a.status||'run')==='run');
  return `<div class="op-turn turn"${id?` id="${id}"`:''}><div class="op-av alt">${IC.agents}</div><div class="op-body">
    <div class="op-name">Operator · dispatching specialists</div>
    <div class="agent-dispatch"><div class="ad-h">Spun up ${list.length} agent${list.length>1?'s':''} for this step${running?`<span class="wdot"></span>`:''}</div>${list.map(agentRowHtml).join('')}</div>
  </div></div>`;
}
/* Append the dispatch card; running agents settle to "done" shortly after, for a live feel. */
function appendAgentDispatch(list,id){
  append(agentDispatchHtml(list,id));
  const settle=list.map(a=>({...a,status:(a.status||'run')==='run'?'done':a.status}));
  if(settle.some((a,i)=>a.status!==(list[i].status||'run'))){
    setTimeout(()=>{ const card=document.getElementById(id); if(!card)return;
      card.querySelector('.wdot')?.remove();
      const h=card.querySelector('.ad-h'); if(h) h.firstChild.textContent=`Ran ${list.length} agent${list.length>1?'s':''} for this step`;
      card.querySelectorAll('.ad-row').forEach((row,i)=>{ if((list[i].status||'run')==='run'){ row.dataset.st='done'; const pill=row.querySelector('.ad-st'); if(pill){pill.className='ad-st done';pill.innerHTML='<span class="dot"></span>Done';} } });
    },1050);
  }
}
function setStarters(){ document.getElementById('suggests').innerHTML=`<span class="sg-lab">Try</span>`+STARTERS.map(s=>`<button class="sg-chip" onclick="starter('${s.key}')">${s.t}</button>`).join(''); }
function clearSuggests(){ document.getElementById('suggests').innerHTML=''; }
function focusInput(){ const ci=document.getElementById('chatInput'); if(ci){ci.value='';ci.focus&&ci.focus();} }
function setSessBarGeneric(s){
  const mark=document.getElementById('sessMark'),title=document.getElementById('sessTitle'),meta=document.getElementById('sessMeta'),st=document.getElementById('sessStatus');
  mark.className=s.kind==='chat'?'fmark ai':'fmark'; mark.innerHTML=s.kind==='chat'?IC.op:s.code;
  title.textContent=s.title; meta.textContent=s.sub; document.getElementById('crumbCur').textContent=s.title;
  if(s.waitingOn){ st.style.display=''; st.className='pill amber dotp'; st.textContent='Waiting on '+PEOPLE[s.waitingOn.who].name.split(' ')[0]; }
  else { const sm=STATUS_META[s.status]||{label:'Active',cls:'green'}; st.style.display=''; st.className='pill '+sm.cls+' dotp'; st.textContent=sm.label; }
}
function setSessBarClean(){
  document.getElementById('sessMark').className='fmark ai'; document.getElementById('sessMark').innerHTML=IC.op;
  document.getElementById('sessTitle').textContent='New session'; document.getElementById('sessMeta').textContent='Regulatory Filing Operator';
  document.getElementById('sessStatus').style.display='none'; document.getElementById('crumbCur').textContent='New session';
}
function startClean(){
  mode='clean'; busy=false; complete=false; setSessBarClean(); spineState={active:false}; renderSpine();
  document.getElementById('threadInner').innerHTML='';
  append(opTurn('recommend',`<p>Hi Julie — I'm your Regulatory Filing Operator. I can work out what you need to file, start or continue a filing, and carry the work while you approve the decisions that matter.</p><p class="muted" style="font-size:13.5px;margin-top:2px">What would you like to do?</p>`,''));
  setStarters(); focusInput();
}
function starter(key){ if(busy)return; const s=STARTERS.find(x=>x.key===key); userSay(s.t); clearSuggests(); cleanReply(key); }
/* ---------- Visual compare cards (operator chat) ---------- */
/* Year-over-year compare for BE-11 (canned, internally consistent). */
function cmpYoYHtml(){
  const tile=(lab,val,delta,dir)=>`<div class="cmp-tile"><div class="tl">${lab}</div><div class="tv">${val}</div><div class="td ${dir}">${dir==='up'?'▲':(dir==='down'?'▼':'—')} ${delta}</div></div>`;
  const pair=(lab,prior,cur,pw,cw,delta,dir)=>`
    <div class="cmp-bar">
      <div class="cmp-bar-top"><span class="lab">${lab}</span><span class="val">${prior} → <b>${cur}</b> <span class="cmp-delta ${dir}">${dir==='up'?'▲':(dir==='down'?'▼':'')} ${delta}</span></span></div>
      <div class="cmp-pair">
        <div class="pb"><span class="yr">FY24</span><div class="cmp-track"><i style="width:${pw}%;background:var(--text-3)"></i></div></div>
        <div class="pb"><span class="yr">FY25</span><div class="cmp-track"><i style="width:${cw}%;background:var(--accent)"></i></div></div>
      </div>
    </div>`;
  return `<div class="cmp">
    <div class="cmp-h">${IC.doc} BE-11 · FY25 vs FY24<span class="cmp-sub">Year over year</span></div>
    <div class="cmp-tiles">
      ${tile('Affiliates in scope','42','+3','up')}
      ${tile('Countries','19','+1','up')}
      ${tile('New entities','3','vs 1','up')}
    </div>
    <div class="cmp-bars">
      ${pair('Total foreign sales','$2.14B','$2.38B',90,100,'11%','up')}
      ${pair('Net income','$312M','$357M',87,100,'14%','up')}
      ${pair('Total assets','$5.61B','$5.94B',94,100,'6%','up')}
      ${pair('Forms filed','39','42',93,100,'3 more','up')}
    </div>
    <div class="prov"><span class="chip">${IC.doc} Source: FY24 filed package · FY25 accepted facts</span><span class="chip">${IC.doc} No material rule changes detected</span></div>
  </div>`;
}
/* Portfolio compare — readiness across active reports, dynamic from live data. */
function cmpReportsHtml(){
  const rows=sessions.filter(s=>s.kind==='filing' && s.status!=='done' && !s.archived).slice().sort((a,b)=>(b.pct||0)-(a.pct||0));
  const color=s=>s.waitingOn?'var(--prepare)':(s.pct>=90?'var(--commit)':'var(--accent)');
  const pill=s=>s.waitingOn?`<span class="pill amber">Waiting on ${PEOPLE[s.waitingOn.who].name.split(' ')[0]}</span>`:`<span class="pill ${(STATUS_META[s.status]||{cls:'green'}).cls}">${(STATUS_META[s.status]||{label:'Active'}).label}</span>`;
  const bars=rows.map(s=>`
    <div class="cmp-bar">
      <div class="cmp-bar-top"><span class="lab">${s.title}</span><span class="val">${s.pct||0}% ${pill(s)}</span></div>
      <div class="cmp-track"><i style="width:${s.pct||0}%;background:${color(s)}"></i></div>
    </div>`).join('');
  return `<div class="cmp"><div class="cmp-h">${IC.doc} Readiness across active reports<span class="cmp-sub">${rows.length} reports</span></div><div class="cmp-bars">${bars}</div></div>`;
}
function cleanReply(key){
  busy=true; showTyping();
  setTimeout(()=>{ clearTyping(); busy=false;
    if(key==='startbe11'){ startFiling(false); return; }
    if(key==='file'){
      append(opTurn('recommend',
        `<p>From your subsidiary and financial data I see <strong>two likely obligations</strong>, plus one that isn't decidable yet. I'm recommending, not asserting — each cites its evidence.</p><div class="kv"><span class="kk">BE-11</span><span>42 affiliates · BEA · <span class="pill blue">Required</span></span><span class="kk">Country-by-Country</span><span>Above €750M · IRS/OECD · <span class="pill blue">Required</span></span><span class="kk">BE-577</span><span>Pending consolidation · <span class="pill">Not yet decidable</span></span></div><div class="prov"><span class="chip">${IC.doc} Evidence: FY25 consolidation</span><span class="chip">${IC.doc} Rule: entity size &amp; revenue tests</span></div>`,
        `<button class="action-btn primary" onclick="startFiling(false)">Prepare BE-11 scope plan<span class="lvl prepare">Prepare</span></button><button class="action-btn" onclick="openSessionById('cbcr-fy25')">Open CbCR scope plan<span class="lvl prepare">Prepare</span></button>`));
    } else if(key==='approve'){
      append(opTurn('read',
        `<p>Two things need attention right now:</p><ul class="brief-list"><li><span class="tag conf">Scope</span> Country-by-Country scope, waiting on Sarah Chen</li><li><span class="tag req">Final</span> BE-11 FY25 package, ready for final review</li></ul>`,
        `<button class="action-btn primary" onclick="startFiling(false)">Open the BE-11 filing<span class="lvl read">Read</span></button>`));
    } else if(key==='overdue'){
      append(opTurn('read',
        `<p><strong>2 things are overdue</strong> across the portfolio:</p><ul class="brief-list"><li><span class="tag req">5h overdue</span> Tom Reyes hasn't answered the BE-577 Q2 data request</li><li><span class="tag req">38m waiting</span> Sarah Chen hasn't confirmed the Country-by-Country scope</li></ul>`,
        `<button class="action-btn primary" onclick="openSessionById('be577-q2');sendReminder('be577-q2')">Remind Tom Reyes<span class="lvl prepare">Prepare</span></button><button class="action-btn" onclick="openSessionById('cbcr-fy25');sendReminder('cbcr-fy25')">Remind Sarah Chen<span class="lvl prepare">Prepare</span></button>`));
    } else if(key==='duesoon'){
      append(opTurn('read',
        `<p><strong>2 reports</strong> are due in the next two weeks:</p><div class="kv"><span class="kk">BE-577 · Q2</span><span>Due Fri, Jul 3 · 64% ready</span><span class="kk">BE-11 · FY25</span><span>Due Fri, Jul 10 · awaiting signature</span></div>`,
        `<button class="action-btn primary" onclick="openFiling('be577-q2')">Open BE-577 · Q2<span class="lvl read">Read</span></button><button class="action-btn" onclick="startFiling(false)">Open BE-11 filing<span class="lvl read">Read</span></button>`));
    } else if(key==='cmpyoy'){
      append(opTurn('read',
        `<p>Here's <strong>BE-11 FY25 against last year's filed FY24</strong> — scope grew and every headline figure is up, with no material rule changes.</p>${cmpYoYHtml()}`,
        `<button class="action-btn primary" onclick="openFiling('be11-fy25')">Open BE-11 · FY25<span class="lvl read">Read</span></button><button class="action-btn" onclick="openFiling('be11-fy24')">Open FY24 filing<span class="lvl read">Read</span></button>`));
    } else if(key==='cmpreports'){
      append(opTurn('read',
        `<p>Here's how your <strong>active reports</strong> compare on readiness right now — highest first. Two are waiting on a person.</p>${cmpReportsHtml()}`,
        `<button class="action-btn primary" onclick="go('home');showWorkQueue(null)">See what needs you<span class="lvl read">Read</span></button>`));
    } else {
      append(opTurn('read',`<p>I can help you figure out what to file, start a filing, or check what's due.</p>`,
        `<button class="action-btn" onclick="starter('file')">What do we need to file?</button><button class="action-btn" onclick="starter('startbe11')">Start BE-11 filing</button>`));
    }
  },640);
}
function startFiling(fresh){
  mode='be11'; busy=false; complete=false; sIdx=0; currentSessionId='be11-fy25';
  setSessBarGeneric(sessions.find(s=>s.id==='be11-fy25')); clearSuggests();
  if(fresh){ document.getElementById('threadInner').innerHTML=''; }
  renderStep(0); focusInput(); renderSidebarSessions();
}
function actionsHTML(i){
  return steps[i].actions.map((a,ai)=>{ const cls=a.sig?'sig':(a.adv?'primary':''); const badge=`<span class="lvl ${a.sig?'sig':a.lvl}">${a.sig?'Signature':cap(a.lvl)}</span>`; return `<button class="action-btn ${cls}" onclick="chooseAction(${i},${ai})">${a.t}${badge}</button>`; }).join('');
}
function renderStep(i){
  const s=steps[i]; if(!s)return;
  complete=(i===steps.length-1); spineState={active:true,phase:s.ph,complete}; renderSpine();
  if(s.sys) append(sysTurn(s.sys));
  if(s.agents && s.agents.length) appendAgentDispatch(s.agents,'disp-'+i);
  append(opTurn(s.lvl,s.html,actionsHTML(i),'turn-'+i));
  const rec=sessions.find(x=>x.id==='be11-fy25'); if(rec) renderSessionSuggests(rec);
}
function disableTurn(i){ const t=document.getElementById('turn-'+i); if(t) t.querySelectorAll('button').forEach(b=>b.disabled=true); }
function chooseAction(i,ai){
  const a=steps[i].actions[ai];
  if(a.modal){openModal(a.modal);return;}
  if(a.drawer){openDrawer();return;}
  if(a.upload){openUploadModal(a.uctx);return;}
  if(a.home){go('home');return;}
  if(a.adv){ disableTurn(i); userSay(a.t); advance(i); }
}
function sendChat(){
  if(busy)return;
  const inp=document.getElementById('chatInput'); const txt=(inp.value||'').trim(); if(!txt)return;
  inp.value=''; userSay(txt);
  if(mode==='be11'){
    const i=sIdx; const prim=steps[i].actions.find(a=>a.adv);
    if(prim){ disableTurn(i); advance(i); }
    else { busy=true; showTyping(); setTimeout(()=>{ clearTyping(); append(opTurn('read',`<p>This filing is complete and staged. I can take you back to Home, or you can open another filing from the sidebar.</p>`,`<button class="action-btn" onclick="go('home')">Back to Home</button>`)); busy=false; },600); }
    return;
  }
  clearSuggests(); cleanReply('generic');
}
function userSay(t){ append(`<div class="user-turn turn"><div class="user-bubble">${escapeHtml(t)}</div></div>`); }
function advance(i){
  busy=true; document.getElementById('sendBtn').disabled=true; showTyping();
  setTimeout(()=>{ clearTyping(); sIdx=i+1; renderStep(sIdx); busy=false; document.getElementById('sendBtn').disabled=false; },720);
}
function showTyping(){ append(`<div class="op-turn turn typing" id="typing"><div class="op-av">${IC.op}</div><div class="op-body"><div class="bubble"><i></i><i></i><i></i></div></div></div>`); }
function clearTyping(){ const t=document.getElementById('typing'); if(t)t.remove(); }
function approveFromLedger(){ if(mode==='be11' && sIdx===8){ disableTurn(8); userSay('Approve the final package'); advance(8); } }
const cap=s=>s.charAt(0).toUpperCase()+s.slice(1);
function escapeHtml(s){return s.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));}
function scrollThread(){const v=document.getElementById('thread');setTimeout(()=>{v.scrollTop=v.scrollHeight;},30);}

/* ---------- history / chat sessions ---------- */
function renderWaitingBanner(s){
  const existing=document.getElementById('waitBanner'); if(existing) existing.remove();
  if(!s.waitingOn) return;
  const p=PEOPLE[s.waitingOn.who];
  document.getElementById('threadInner').insertAdjacentHTML('afterbegin',`<div class="wait-banner" id="waitBanner">
    <div class="wb-ic">${IC.clock}</div>
    <div class="wb-body"><div class="wb-t">Waiting on <strong>${p.name}</strong> — ${s.waitingOn.reason}</div><div class="wb-s">Requested ${s.waitingOn.since}</div></div>
    <button class="btn sec" style="padding:7px 13px;font-size:12.5px" onclick="sendReminder('${s.id}')">Send reminder</button>
  </div>`);
}
function sendReminder(id){
  const s=sessions.find(x=>x.id===id); if(!s || !s.waitingOn) return;
  const who=PEOPLE[s.waitingOn.who].name;
  const btn=document.querySelector('.wait-banner button'); if(btn) btn.disabled=true;
  append(sysTurn(`Reminder sent to ${who}`));
  busy=true;
  setTimeout(()=>{
    busy=false;
    const res=s.resolve;
    if(res){ append(opTurn(res.lvl,res.html,'')); }
    s.waitingOn=null; s.status=(res&&res.newStatus)||'active'; s.updated='just now'; s.updatedSort=0;
    document.getElementById('waitBanner')?.remove();
    notifications.push({id:Date.now(),sessionId:id,text:(res&&res.notifText)||`${who} responded on ${s.title}`,time:'just now',read:currentSessionId===id});
    renderNotif(); renderSidebarSessions(); renderHome(); setSessBarGeneric(s);
  },1400);
}
function renderHistorySession(s){
  mode='history'; busy=false; complete=(s.status==='done');
  setSessBarGeneric(s); spineState={active:true,phase:s.stagePhase,complete:s.status==='done'}; renderSpine();
  document.getElementById('threadInner').innerHTML=''; clearSuggests();
  (s.history||[]).forEach(entry=>{
    if(entry.kind==='user') append(`<div class="user-turn turn"><div class="user-bubble">${escapeHtml(entry.text)}</div></div>`);
    else if(entry.kind==='sys') append(sysTurn(entry.text));
    else if(entry.kind==='agents') append(agentDispatchHtml(entry.agents,''));
    else append(opTurn(entry.lvl,entry.html,entry.actionsHtml||'',''));
  });
  renderWaitingBanner(s);
  renderSessionSuggests(s);
  if(s.status==='active' && !s.waitingOn){
    document.getElementById('suggests').insertAdjacentHTML('afterbegin',`<span class="working-pill">${IC.op}<i class="wdot"></i> Agent working — no input needed right now</span>`);
  }
  focusInput();
}
function renderChatSession(s){
  mode='chatlog'; busy=false; complete=false;
  setSessBarGeneric(s); spineState={active:false}; renderSpine();
  document.getElementById('threadInner').innerHTML=''; clearSuggests();
  (s.history||[]).forEach(entry=>{
    if(entry.kind==='user') append(`<div class="user-turn turn"><div class="user-bubble">${escapeHtml(entry.text)}</div></div>`);
    else if(entry.kind==='agents') append(agentDispatchHtml(entry.agents,''));
    else append(opTurn(entry.lvl,entry.html,'',''));
  });
  renderSessionSuggests(s);
  focusInput();
}

/* ---------- Smart, per-session predefined prompts ----------
   Every session offers a handful of one-click follow-up questions, tailored to
   its state (waiting on someone / actively running / done) or, for ad-hoc
   chats, to what was just discussed — rather than one static list for all. */
const CHAT_FOLLOWUPS={
  'chat-portfolio':[
    {t:'Show me the 6 needing ownership confirmation',key:'ownership6'},
    {t:'Start the BE-11 FY25 filing',key:'gotobe11'},
    {t:'What about Country-by-Country?',key:'cbcrinfo'},
  ],
};
function smartSuggestChips(s){
  if(s.kind==='chat') return CHAT_FOLLOWUPS[s.id]||[{t:'What else should I be tracking?',key:'general'}];
  if(s.waitingOn) return [
    {t:'Send a reminder',key:'remind'},
    {t:'What exactly are we waiting on?',key:'waitwhat'},
    {t:"What happens if they don't respond in time?",key:'waitrisk'},
  ];
  if(s.status==='done') return [
    {t:'Show me the filing package',key:'pkg'},
    {t:'What changed vs. last cycle?',key:'diff'},
    {t:'Open the audit trail',key:'audit'},
  ];
  return [
    {t:"What's the current status?",key:'status'},
    {t:'Anything blocking this filing?',key:'blockers'},
    {t:'What still needs data?',key:'needsdata'},
  ];
}
function renderSessionSuggests(s){
  const chips=smartSuggestChips(s);
  document.getElementById('suggests').innerHTML=chips.length?`<span class="sg-lab">Ask</span>`+chips.map(c=>`<button class="sg-chip" onclick="smartPrompt('${s.id}','${c.key}')">${c.t}</button>`).join(''):'';
}
function smartPrompt(id,key){
  if(busy) return;
  const s=sessions.find(x=>x.id===id); if(!s) return;
  const chip=smartSuggestChips(s).find(c=>c.key===key);
  userSay(chip?chip.t:key); clearSuggests();
  if(key==='remind'){ sendReminder(id); return; }
  busy=true; showTyping();
  setTimeout(()=>{
    clearTyping(); busy=false;
    if(key==='gotobe11'){ startFiling(false); return; }
    const d=FILING_DASH[id]||{agents:[],pending:[],attention:[]};
    let lvl='read', html='', actionsHtml='';
    if(key==='waitwhat'){
      html=`<p>I'm waiting on <strong>${PEOPLE[s.waitingOn.who].name}</strong> — ${s.waitingOn.reason.toLowerCase()}. Requested ${s.waitingOn.since}; nothing downstream can run until it's resolved.</p>`;
      actionsHtml=`<button class="action-btn" onclick="smartPrompt('${id}','remind')">Send a reminder<span class="lvl prepare">Prepare</span></button>`;
    } else if(key==='waitrisk'){
      html=`<p>If ${PEOPLE[s.waitingOn.who].name.split(' ')[0]} doesn't respond, I'll escalate with a reminder and flag it as a blocker in your Home work queue. This filing's phase can't advance until it's resolved.</p>`;
    } else if(key==='status'){
      html=`<p><strong>${s.title}</strong> is ${s.pct||0}% ready, currently in <strong>${filingPhaseLabel(s)}</strong>.</p>`+(d.agents.length?`<div class="kv">${d.agents.slice(-2).map(a=>`<span class="kk">${a.n}</span><span>${a.out}</span>`).join('')}</div>`:'');
    } else if(key==='blockers'){
      const blocks=d.attention.filter(a=>a.sev==='block');
      html=blocks.length?`<p>Yes — ${blocks.length} blocker${blocks.length>1?'s':''}:</p><ul class="brief-list">${blocks.map(b=>`<li><span class="tag req">Blocked</span> ${b.t} — ${b.m}</li>`).join('')}</ul>`:`<p>No blockers right now — ${s.title} is on track.</p>`;
    } else if(key==='needsdata'){
      const open=[...d.pending,...d.attention];
      html=open.length?`<p>Here's what's still outstanding:</p><ul class="brief-list">${open.map(x=>`<li><span class="tag conf">${x.sev||'info'}</span> ${x.t}</li>`).join('')}</ul>`:`<p>All required data is in — nothing outstanding right now.</p>`;
    } else if(key==='pkg'){
      const art=d.agents.find(a=>a.art&&a.art[0]==='Packages');
      html=`<p>The filing package for <strong>${s.title}</strong> is staged and ready.</p>`;
      if(art) actionsHtml=`<button class="action-btn" onclick="openArtifact('${art.art[0]}',${art.art[1]})">Open the package<span class="lvl read">Read</span></button>`;
    } else if(key==='diff'){
      html=`<p>Compared with the prior cycle, scope and required fields for ${s.code} were stable — no material rule changes were detected.</p>`;
    } else if(key==='audit'){
      const art=d.agents.find(a=>a.art&&a.art[0]==='Audits');
      html=`<p>Here's the audit trail for <strong>${s.title}</strong> — every decision, source, and approval, timestamped.</p>`;
      if(art) actionsHtml=`<button class="action-btn" onclick="openArtifact('${art.art[0]}',${art.art[1]})">Open the audit trail<span class="lvl read">Read</span></button>`;
    } else if(key==='ownership6'){
      html=`<p>6 affiliates need ownership confirmation before they're decidable: <strong>2 newly acquired</strong>, <strong>3 with changed ownership %</strong>, and <strong>1</strong> pending a legal entity name change. I can draft outreach to each affiliate controller.</p>`;
      actionsHtml=`<button class="action-btn" onclick="showToast('Drafting ownership confirmation requests (mock)')">Draft ownership requests<span class="lvl prepare">Prepare</span></button>`;
    } else if(key==='cbcrinfo'){
      html=`<p>You're also likely subject to <strong>Country-by-Country</strong> reporting (Form 8975) — your group is above the €750M consolidated-revenue threshold. The scope plan is prepared and currently waiting on Sarah Chen's sign-off.</p>`;
      actionsHtml=`<button class="action-btn" onclick="openSessionById('cbcr-fy25')">Open CbCR scope plan<span class="lvl read">Read</span></button>`;
    } else {
      html=`<p>I can check on any filing's status, what's blocking it, or what still needs data — just ask.</p>`;
    }
    append(opTurn(lvl,html,actionsHtml));
  },650);
}
/* ---------- Product Docs: markdown renderer ---------- */
const SECTION_LABELS={
  '01-product-overview':'01 · Product Overview','02-glossary':'02 · Glossary','03-personas':'03 · Personas',
  '04-information-architecture':'04 · Information Architecture','05-operator-flows':'05 · Operator Flows',
  '06-features':'06 · Capabilities & Governance','07-pages':'07 · Pages / Surfaces','08-customer-journey':'08 · Customer Journey',
  '09-design-patterns':'09 · Design Patterns','10-analysis':'10 · Analysis','11-agent-operations':'11 · Agent Operations',
};
const SECTION_LABELS_SUB={'05-operator-flows/report-patterns':'Report patterns'};
let currentDocKey=null;
function splitFrontmatter(src){
  const m=src.match(/^---\n([\s\S]*?)\n---\n?/);
  if(!m) return {meta:{},body:src};
  const meta={};
  m[1].split('\n').forEach(line=>{ const mm=line.match(/^([A-Za-z_]+):\s*(.*)$/); if(mm) meta[mm[1]]=mm[2].replace(/^['"]|['"]$/g,''); });
  return {meta,body:src.slice(m[0].length)};
}
function slugify(raw){
  let s=raw.replace(/`/g,'').replace(/\*\*/g,'').toLowerCase();
  let out=''; for(const ch of s){ if(/[a-z0-9]/.test(ch)) out+=ch; else if(ch===' '||ch==='-') out+=' '; }
  return out.trim().replace(/\s+/g,'-');
}
function resolveDocPath(curKey,rel){
  const curDir=curKey.includes('/')?curKey.slice(0,curKey.lastIndexOf('/')):'';
  const parts=(curDir?curDir.split('/'):[]).concat(rel.split('/'));
  const stack=[];
  for(const p of parts){ if(p===''||p==='.') continue; if(p==='..') stack.pop(); else stack.push(p); }
  return stack.join('/');
}
function renderLink(text,href,curKey){
  if(/^https?:\/\//.test(href)) return `<a href="${href}" target="_blank" rel="noopener">${text}</a>`;
  let [pathPart,anchor]=href.split('#'); pathPart=decodeURIComponent(pathPart||'');
  if(!pathPart) return `<a href="#" class="doc-link" onclick="scrollDocAnchor('${anchor}');return false;">${text}</a>`;
  if(!pathPart.endsWith('.md')) return `<span class="ext-ref" title="Not included in this prototype">${text}</span>`;
  const targetKey=resolveDocPath(curKey,pathPart);
  if(targetKey && DOCS_RAW[targetKey]) return `<a href="#" class="doc-link" onclick="openDoc('${targetKey}','${anchor||''}');return false;">${text}</a>`;
  return `<span class="ext-ref" title="Outside this prototype's doc set">${text}</span>`;
}
function mdInline(raw,curKey){
  let s=escapeHtml(raw);
  s=s.replace(/`([^`]+)`/g,(m,c)=>`<code>${c}</code>`);
  s=s.replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>');
  s=s.replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g,'$1<em>$2</em>');
  s=s.replace(/\[([^\]]+)\]\(([^)]+)\)/g,(m,text,href)=>renderLink(text,href,curKey));
  return s;
}
function splitRow(line){ let s=line.trim(); if(s.startsWith('|'))s=s.slice(1); if(s.endsWith('|'))s=s.slice(0,-1); return s.split('|').map(c=>c.trim()); }
function listItemInfo(line){ const m=line.match(/^(\s*)([-*]|\d+\.)\s+(.*)$/); if(!m) return null; return {indent:m[1].length,ordered:/\d/.test(m[2]),text:m[3]}; }
function parseList(lines,start,curKey){
  function build(idx,baseIndent){
    let items=[],ordered=null;
    while(idx<lines.length){
      const info=listItemInfo(lines[idx]);
      if(!info || info.indent<baseIndent) break;
      if(info.indent>baseIndent) break;
      if(ordered===null) ordered=info.ordered;
      let raw=info.text; const cb=raw.match(/^\[([ xX])\]\s+(.*)$/);
      let itemHtml = cb? `<label class="md-check"><input type="checkbox" disabled ${cb[1]!==' '?'checked':''}/> ${mdInline(cb[2],curKey)}</label>` : mdInline(raw,curKey);
      idx++;
      const nested=idx<lines.length?listItemInfo(lines[idx]):null;
      if(nested && nested.indent>baseIndent){ const sub=build(idx,nested.indent); itemHtml+=sub.htmlOut; idx=sub.next; }
      items.push(`<li>${itemHtml}</li>`);
    }
    const tag=ordered?'ol':'ul';
    return {htmlOut:`<${tag}>${items.join('')}</${tag}>`,next:idx};
  }
  const first=listItemInfo(lines[start]);
  return build(start,first.indent);
}
function mdBlock(body,curKey){
  const lines=body.split('\n'); let html='',i=0;
  function isTableSep(line){ return /^\s*\|?[\s:\-|]+\|?\s*$/.test(line) && line.includes('-'); }
  while(i<lines.length){
    let line=lines[i];
    if(line.trim()===''){ i++; continue; }
    let fence=line.match(/^```\s*(\w*)/);
    if(fence){
      const lang=fence[1]||''; let code=[]; i++;
      while(i<lines.length && !/^```/.test(lines[i])){ code.push(lines[i]); i++; }
      i++;
      const escaped=escapeHtml(code.join('\n'));
      if(lang==='mermaid') html+=`<div class="mmd"><pre class="mermaid">${escaped}</pre></div>`;
      else html+=`<pre><code>${escaped}</code></pre>`;
      continue;
    }
    let h=line.match(/^(#{1,6})\s+(.*)$/);
    if(h){ const level=h[1].length,text=h[2].trim(); html+=`<h${level} id="${slugify(text)}">${mdInline(text,curKey)}</h${level}>`; i++; continue; }
    if(/^-{3,}\s*$/.test(line.trim())){ html+='<hr>'; i++; continue; }
    if(/^>\s?/.test(line)){
      let buf=[]; while(i<lines.length && /^>\s?/.test(lines[i])){ buf.push(lines[i].replace(/^>\s?/,'')); i++; }
      html+=`<blockquote>${buf.filter(x=>x.trim()!=='').map(x=>`<p>${mdInline(x,curKey)}</p>`).join('')}</blockquote>`;
      continue;
    }
    if(/^\|/.test(line.trim()) && i+1<lines.length && isTableSep(lines[i+1])){
      const headerCells=splitRow(line); i+=2; let rows=[];
      while(i<lines.length && /^\|/.test(lines[i].trim())){ rows.push(splitRow(lines[i])); i++; }
      html+='<table><thead><tr>'+headerCells.map(c=>`<th>${mdInline(c,curKey)}</th>`).join('')+'</tr></thead><tbody>'+
        rows.map(r=>'<tr>'+r.map(c=>`<td>${mdInline(c,curKey)}</td>`).join('')+'</tr>').join('')+'</tbody></table>';
      continue;
    }
    if(/^\s*([-*]|\d+\.)\s+/.test(line)){ const res=parseList(lines,i,curKey); html+=res.htmlOut; i=res.next; continue; }
    let buf=[line]; i++;
    while(i<lines.length && lines[i].trim()!=='' && !/^```/.test(lines[i]) && !/^#{1,6}\s/.test(lines[i]) && !/^>\s?/.test(lines[i]) &&
          !/^\s*([-*]|\d+\.)\s+/.test(lines[i]) && !/^-{3,}\s*$/.test(lines[i].trim()) && !(/^\|/.test(lines[i].trim()))){ buf.push(lines[i]); i++; }
    html+=`<p>${mdInline(buf.join(' '),curKey)}</p>`;
  }
  return html;
}
function docTitle(key){ const {meta}=splitFrontmatter(DOCS_RAW[key]); return meta.title || key.split('/').pop().replace('.md',''); }
function sortDocs(arr){ return arr.slice().sort((a,b)=>{ const ar=a.endsWith('README.md'),br=b.endsWith('README.md'); if(ar!==br) return ar?-1:1; return a.localeCompare(b); }); }
function buildDocsTree(){
  const keys=Object.keys(DOCS_RAW).sort();
  const top=keys.filter(k=>!k.includes('/'));
  const sections={};
  keys.forEach(k=>{ if(!k.includes('/'))return; const folder=k.split('/')[0]; (sections[folder]=sections[folder]||[]).push(k); });
  let html='';
  top.forEach(k=>{ html+=`<div class="docs-file" data-key="${k}" onclick="openDoc('${k}')">${docTitle(k)}</div>`; });
  Object.keys(sections).sort().forEach(folder=>{
    const files=sections[folder];
    const sub=sortDocs(files.filter(f=>f.split('/').length===3));
    const direct=sortDocs(files.filter(f=>f.split('/').length===2));
    html+=`<div class="docs-section"><div class="docs-section-h">${SECTION_LABELS[folder]||folder}</div>`;
    direct.forEach(k=>{ html+=`<div class="docs-file" data-key="${k}" onclick="openDoc('${k}')">${docTitle(k)}</div>`; });
    if(sub.length){
      const subFolder=sub[0].split('/').slice(0,2).join('/');
      html+=`<div class="docs-section-h" style="padding-left:16px;font-size:10.5px">${SECTION_LABELS_SUB[subFolder]||'Subsection'}</div><div class="docs-subgroup">`;
      sub.forEach(k=>{ html+=`<div class="docs-file" data-key="${k}" onclick="openDoc('${k}')">${docTitle(k)}</div>`; });
      html+=`</div>`;
    }
    html+=`</div>`;
  });
  document.getElementById('docsTree').innerHTML=html;
}
function filterDocsNav(){
  const q=document.getElementById('docsSearch').value.trim().toLowerCase();
  document.querySelectorAll('#docsTree .docs-file').forEach(el=>{
    const match=!q || el.textContent.toLowerCase().includes(q) || (el.dataset.key||'').toLowerCase().includes(q);
    el.style.display=match?'':'none';
  });
  document.querySelectorAll('#docsTree .docs-section').forEach(sec=>{
    const anyVisible=Array.from(sec.querySelectorAll('.docs-file')).some(f=>f.style.display!=='none');
    sec.style.display=anyVisible?'':'none';
  });
}
function renderDoc(key,anchor){
  const raw=DOCS_RAW[key]; if(!raw) return;
  const {meta,body}=splitFrontmatter(raw);
  const html=mdBlock(body,key);
  const title=meta.title || key.split('/').pop().replace('.md','');
  const statusPill=meta.status?`<span class="pill" style="margin-left:8px">${meta.status}</span>`:'';
  const crumbPath=key.replace(/\.md$/,'').split('/').join(' / ');
  document.getElementById('docsContent').innerHTML=`<div class="md-body"><div class="doc-crumb muted">${crumbPath}</div><h1>${title}${statusPill}</h1>${html}</div>`;
  document.querySelectorAll('#docsTree .docs-file').forEach(el=>el.classList.toggle('active',el.dataset.key===key));
  document.getElementById('docsContent').scrollTop=0;
  if(anchor){ setTimeout(()=>scrollDocAnchor(anchor),30); }
  currentDocKey=key;
  renderMermaidBlocks();
}
function renderMermaidBlocks(){
  const nodes=document.querySelectorAll('#docsContent pre.mermaid');
  if(!nodes.length) return;
  if(typeof mermaid==='undefined'){
    // CDN unreachable — leave the raw diagram source visible instead of failing silently.
    nodes.forEach(n=>n.classList.add('mmd-fallback'));
    return;
  }
  try{ mermaid.run({ nodes, suppressErrors:true }); }catch(e){ nodes.forEach(n=>n.classList.add('mmd-fallback')); }
}
function scrollDocAnchor(anchor){ if(!anchor)return; const el=document.getElementById(anchor); if(el) el.scrollIntoView({behavior:'smooth',block:'start'}); }
function openDoc(key,anchor){ go('docs'); renderDoc(key,anchor||''); }
/* =============================================================
   ONBOARD / STEP 0 — agent-driven report setup
   Principles: recordable · evidence-backed · you approve · you confirm
=============================================================*/
const AGENT_RUN_MS=2900;
const FAB_TYPING_MS=1000;
const OB_ICONS={
  spark:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3l2.5 5.5L20 11l-5.5 2.5L12 19l-2.5-5.5L4 11l5.5-2.5z" stroke-linejoin="round"/></svg>',
  tb:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 5h16M4 12h16M4 19h16"/><circle cx="8" cy="5" r="1.6" fill="currentColor" stroke="none"/><circle cx="15" cy="12" r="1.6" fill="currentColor" stroke="none"/><circle cx="10" cy="19" r="1.6" fill="currentColor" stroke="none"/></svg>',
  gl:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M5 4h11l3 3v13H5z"/><path d="M8 9h8M8 12.5h8M8 16h5"/></svg>',
  pr:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/><path d="M9 13l2 2 4-4"/></svg>',
  scan:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 8V6a2 2 0 012-2h2M16 4h2a2 2 0 012 2v2M20 16v2a2 2 0 01-2 2h-2M8 20H6a2 2 0 01-2-2v-2"/><path d="M4 12h16"/></svg>',
  setup:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3l2.5 5.5L20 11l-5.5 2.5L12 19l-2.5-5.5L4 11l5.5-2.5z" stroke-linejoin="round"/></svg>',
  check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>',
  upload:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 16V6M8 10l4-4 4 4"/><path d="M5 18h14"/></svg>',
  cal:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="4" y="5" width="16" height="16" rx="2"/><path d="M4 9h16M9 3v4M15 3v4"/></svg>',
  tag:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 4h8l8 8-8 8-8-8z"/><circle cx="8.5" cy="8.5" r="1.4"/></svg>',
  arrow:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h13M12 5l7 7-7 7"/></svg>',
  human:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="3.4"/><path d="M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6"/></svg>',
  src:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><ellipse cx="12" cy="6" rx="7" ry="2.6"/><path d="M5 6v6c0 1.5 3.1 2.6 7 2.6s7-1.1 7-2.6V6"/><path d="M5 12v6c0 1.5 3.1 2.6 7 2.6s7-1.1 7-2.6v-6"/></svg>',
  org:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="9" y="3" width="6" height="5" rx="1"/><rect x="3" y="16" width="6" height="5" rx="1"/><rect x="15" y="16" width="6" height="5" rx="1"/><path d="M12 8v4M6 16v-2h12v2"/></svg>',
  target:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1" fill="currentColor"/></svg>',
  people:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.2 2.7-5.5 6-5.5s6 2.3 6 5.5"/><path d="M16 5.2a3 3 0 010 5.6M18 20c0-2.4-1-4.3-2.5-5.2"/></svg>',
  map:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 7l6-2 4 2 6-2v12l-6 2-4-2-6 2z"/><path d="M10 5v12M14 7v12"/></svg>',
  shield:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"/><path d="M9 12l2 2 4-4"/></svg>',
  pkg2:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M4 7.5l8 4.5 8-4.5M12 12v9"/></svg>',
  sign:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 18c3-1 4-6 6-6s2 3 4 3 3-2 6-4"/><path d="M4 21h16"/></svg>',
  send:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="M4 12l16-7-7 16-2.5-6.5z"/></svg>',
  info:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 8h.01"/></svg>',
  edit:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 5l5 5M4 20l1-4L16 5l3 3L8 19z"/></svg>',
};
const OB_TYPES={
  be11:{code:'BE-11', short:'Direct Investment Abroad', full:'Annual Survey of U.S. Direct Investment Abroad',
    agency:'BEA · U.S. Dept. of Commerce', desc:'Annual survey of every foreign affiliate owned by a U.S. parent — financials, ownership, and operations.',
    period:'Fiscal Year 2025', proposedName:'BE-11 · FY2025 Annual', due:'May 29, 2026', dueReason:'BEA statutory due date for FY2025 annual filers', agentCount:3, alt:false},
  be577:{code:'BE-577', short:'Quarterly Transactions', full:'Quarterly Survey of U.S. Direct Investment Abroad',
    agency:'BEA · U.S. Dept. of Commerce', desc:'Quarterly transactions and positions between a U.S. reporter and its foreign affiliates.',
    period:'Q2 2026', proposedName:'BE-577 · Q2 2026', due:'Sep 4, 2026', dueReason:'BEA due date, 30 days after quarter close (Jun 30)', agentCount:3, alt:true},
  be125:{code:'BE-125', short:'Services & IP Transactions', full:'Quarterly Survey of Transactions in Selected Services and IP with Foreign Persons',
    agency:'BEA · U.S. Dept. of Commerce', desc:'Quarterly sales and purchases of selected services and intellectual property with foreign persons.',
    period:'Q2 2026', proposedName:'BE-125 · Q2 2026', due:'Sep 15, 2026', dueReason:'BEA quarterly due date, 45 days after quarter close', agentCount:3, alt:true},
  be185:{code:'BE-185', short:'Financial Services Transactions', full:'Quarterly Survey of Financial Services Transactions with Foreign Persons',
    agency:'BEA · U.S. Dept. of Commerce', desc:'Quarterly financial services transactions between U.S. financial companies and foreign persons.',
    period:'Q2 2026', proposedName:'BE-185 · Q2 2026', due:'Sep 15, 2026', dueReason:'BEA quarterly due date', agentCount:3, alt:true},
  abs1:{code:'ABS-1', short:'Annual Business Survey', full:'Annual Business Survey',
    agency:'U.S. Census Bureau', desc:'Annual survey of business characteristics, revenue and employment.',
    period:'FY2025', proposedName:'ABS-1 · FY2025', due:'Jun 30, 2026', dueReason:'Census annual due date', agentCount:3, alt:true},
  aies:{code:'AIES', short:'Annual Integrated Economic Survey', full:'Annual Integrated Economic Survey',
    agency:'U.S. Census Bureau', desc:'Consolidated annual economic survey of business operations and finances.',
    period:'FY2025', proposedName:'AIES · FY2025', due:'Jul 31, 2026', dueReason:'Census annual due date', agentCount:3, alt:true},
  qfr9:{code:'QFR-9', short:'Quarterly Financial Report', full:'Quarterly Financial Report',
    agency:'U.S. Census Bureau', desc:'Quarterly financial position and income statement for manufacturing and trade.',
    period:'Q2 2026', proposedName:'QFR-9 · Q2 2026', due:'Aug 15, 2026', dueReason:'Census quarterly due date', agentCount:3, alt:true},
};
const OB_SOURCES=[
  {id:'tb', name:'Trial balance', found:true, evSys:'NetSuite · US Consolidated', evDoc:'TB_2025-12-31_final.xlsx · 96% match'},
  {id:'gl', name:'General ledger', found:true, evSys:'NetSuite · GL export', evDoc:'GL_FY2025_full.csv · 94% match'},
  {id:'pr', name:'Previous filed report', found:false},
];
/* Financial figures are in $ thousands (value/1000 = $M), matching fmtRev().
   BEA size tests: BE-11B/C at $60M; BE-11D short form at $25M–$60M for newly
   acquired affiliates. netIncome uses absolute value in the test. */
const OB_ENTITIES=[
  {name:'Acme Global Industries, Inc.', country:'United States', reporter:true, own:null, majority:true, newly:false, ownSrc:'Consolidating filer', assets:3120000, sales:2140000, netIncome:264000, rev:2140000, revSrc:'NetSuite ERP', conf:'high'},
  {name:'Germany Manufacturing GmbH', country:'Germany', own:100, majority:true, newly:false, ownSrc:'Consolidation', assets:640000, sales:512800, netIncome:84200, rev:512800, revSrc:'NetSuite ERP', conf:'high'},
  {name:'Meridian Trading Pte', country:'Singapore', own:100, majority:true, newly:false, ownSrc:'Consolidation', assets:198000, sales:214500, netIncome:31600, rev:214500, revSrc:'NetSuite ERP', conf:'high'},
  {name:'France Holdings SAS', country:'France', own:100, majority:true, newly:false, ownSrc:'Consolidation', assets:88000, sales:64200, netIncome:9800, rev:64200, revSrc:'Consolidation system', conf:'high'},
  {name:'Brazil Services Ltda', country:'Brazil', own:100, majority:true, newly:false, ownSrc:'Consolidation', assets:70000, sales:71400, netIncome:null, rev:71400, revSrc:'NetSuite ERP', conf:'medium', note:'net income awaiting intercompany balance'},
  {name:'Nordic Ventures AB', country:'Sweden', own:100, majority:true, newly:true, ownSrc:'Acquisition close · Mar 2025', assets:42000, sales:38500, netIncome:6200, rev:38500, revSrc:'NetSuite ERP', conf:'high', note:'acquired this year'},
  {name:'Dutch Peak Innovations', country:'Netherlands', own:32.5, majority:false, newly:true, ownSrc:'Cap table', assets:71000, sales:63500, netIncome:8400, rev:63500, revSrc:'Affiliate estimate', conf:'low', note:'new minority affiliate — confirm the not-filing claim'},
  {name:'Avikro Consolidated', country:'Ireland', own:41.0, majority:false, newly:false, ownSrc:'Cap table', assets:34000, sales:38900, netIncome:4100, rev:38900, revSrc:'Affiliate estimate', conf:'low'},
];
let OB=null; /* legacy alias — report state now lives in RPT */
let obClock=0;
function pad2(n){ return String(n).padStart(2,'0'); }
function obNow(){ const base=9*3600+12*7; obClock+=Math.floor(3+Math.random()*5); const t=base+obClock; return `${pad2(Math.floor(t/3600)%24)}:${pad2(Math.floor(t/60)%60)}:${pad2(t%60)}`; }

/* ---------- shared render helpers ---------- */
function fmtRev(v){ if(v==null) return '—'; const m=v/1000; if(m>=1000) return '$'+(m/1000).toFixed(2)+'B'; return '$'+m.toLocaleString('en-US',{minimumFractionDigits:1,maximumFractionDigits:1})+'M'; }
function cite(txt,conf){ const col={high:'var(--commit)',medium:'var(--prepare)',low:'var(--violet)'}[conf]; const dot=col?`<span class="cite-dot" style="background:${col}"></span>`:''; return `<span class="cite">${dot}${OB_ICONS.src}<span>${txt}</span></span>`; }
function chip(t){ return `<span class="chip">${t}</span>`; }
function fmtDate(s){ if(!s) return '—'; const d=new Date(s+'T00:00:00'); return d.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}); }
function ymd(d){ return d.getFullYear()+'-'+pad2(d.getMonth()+1)+'-'+pad2(d.getDate()); }
function defaultReadiness(r){ const due=new Date(r.due); const d=new Date(due.getTime()-14*86400000); return ymd(d); }

/* ================================================================
   REPORT ENGINE — tab-based lifecycle (Setup → Planning → Data collection → Review & approve → File)
================================================================*/
const RP_TABS=[
  {key:'setup', label:'Setup'},
  {key:'scoping', label:'Planning'},
  {key:'mapping', label:'Data collection'},
  {key:'review', label:'Review & approve', stub:true},
  {key:'file', label:'File', stub:true},
];
const FORM_OPTIONS=['BE-11A','BE-11B','BE-11D','Claim for Not Filing','Exempt'];
/* Which reporting "area" each affiliate's country rolls up to — drives the
   groups-per-area routing on the Planning stage. */
const AREA_OF={'United States':'Americas','Brazil':'Americas','Germany':'EMEA','France':'EMEA','Netherlands':'EMEA','Sweden':'EMEA','Ireland':'EMEA','Singapore':'APAC'};
/* People groups that own each area, split by their role in the approval chain.
   The reviewer tier only participates when two-level approval is selected. */
const PLAN_AREAS=[
  {area:'Americas',
    prep:{name:'Americas Finance Ops', people:[{i:'JR',c:'dr',n:'Julie Ruiz'},{i:'TR',c:'tr',n:'Tom Reyes'}]},
    review:{name:'Regional Controller — Americas', people:[{i:'PN',c:'pn',n:'Priya Nair'}]},
    approve:{name:'Corporate Controllership', people:[{i:'SC',c:'sc',n:'Sarah Chen'}]}},
  {area:'EMEA',
    prep:{name:'EMEA Shared Services', people:[{i:'MK',c:'mk',n:'Maria Keller'},{i:'LW',c:'lw',n:'Lukas Weber'}]},
    review:{name:'Regional Controller — EMEA', people:[{i:'JD',c:'jd',n:'James Doyle'}]},
    approve:{name:'Corporate Controllership', people:[{i:'SC',c:'sc',n:'Sarah Chen'}]}},
  {area:'APAC',
    prep:{name:'APAC Finance', people:[{i:'WL',c:'wl',n:'Wei Lin'}]},
    review:{name:'Regional Controller — APAC', people:[{i:'PN',c:'pn',n:'Priya Nair'}]},
    approve:{name:'Corporate Controllership', people:[{i:'SC',c:'sc',n:'Sarah Chen'}]}},
];
/* Roster the user can pick from when changing who's assigned to a group. */
const ROSTER=[
  {i:'JR',c:'dr',n:'Julie Ruiz'},
  {i:'TR',c:'tr',n:'Tom Reyes'},
  {i:'MK',c:'mk',n:'Maria Keller'},
  {i:'LW',c:'lw',n:'Lukas Weber'},
  {i:'WL',c:'wl',n:'Wei Lin'},
  {i:'PN',c:'pn',n:'Priya Nair'},
  {i:'JD',c:'jd',n:'James Doyle'},
  {i:'SC',c:'sc',n:'Sarah Chen'},
];
let RPT=null;
/* Per-report copy of the area/group assignments so edits are scoped to this report. */
function planAreas(){ if(!RPT.planPeople) RPT.planPeople=JSON.parse(JSON.stringify(PLAN_AREAS)); return RPT.planPeople; }

function suggestForm(e){
  if(e.reporter) return {form:'BE-11A', reason:`U.S. Reporter — the consolidated domestic parent always files a BE-11A.`};
  const figs=[{k:'assets',v:e.assets},{k:'sales',v:e.sales},{k:'net income',v:e.netIncome==null?null:Math.abs(e.netIncome)}].filter(x=>x.v!=null);
  let top=figs[0]; figs.forEach(x=>{ if(x.v>top.v) top=x; });
  const over60=top.v>60000, over25=top.v>25000;
  if(e.majority){
    if(e.newly && over25 && !over60) return {form:'BE-11D', reason:`Newly acquired, majority-owned (${e.own}%). Largest figure — ${top.k} of ${fmtRev(top.v)} — falls in the $25M–$60M band, so it files the short BE-11D.`};
    if(over60) return {form:'BE-11B', reason:`Majority-owned (${e.own}%) with ${top.k} of ${fmtRev(top.v)}, above the $60M size test — files a full BE-11B.`};
    return {form:'Exempt', reason:`Majority-owned, but its largest figure (${top.k} ${fmtRev(top.v)}) is below the $25M threshold — exempt this year.`};
  }
  const base={form:'Claim for Not Filing', reason:`Minority-owned (${e.own}%). A minority affiliate files a Claim for Not Filing rather than a BE-11B/D.`, review:false};
  if(e.newly && over60){ base.review=true; base.reason=`Minority-owned (${e.own}%), but ${top.k} of ${fmtRev(top.v)} crosses $60M and it's a new affiliate — the agent defaults to a Claim for Not Filing but flags it for your decision.`; }
  return base;
}
function isFiling(f){ return f==='BE-11A'||f==='BE-11B'||f==='BE-11D'; }
function curForm(e){ return RPT.forms[e.name]||e.sugForm; }
function formCounts(){ let filing=0,notfiling=0; RPT.entities.forEach(e=>{ isFiling(curForm(e))?filing++:notfiling++; }); return {filing,notfiling}; }
function scopeSummary(){ const c=formCounts(); const byForm={}; RPT.entities.forEach(e=>{ const f=curForm(e); byForm[f]=(byForm[f]||0)+1; }); const chips=Object.keys(byForm).map(f=>chip(`${f} × ${byForm[f]}`)).join(' '); return `${c.filing} filing · ${c.notfiling} not filing ${chips}`; }

function masterFields(){ return [
  {id:'f1',name:'Net sales / operating revenue',master:'MF.REV.NET',from:'GL 4000-series revenue',src:'NetSuite',conf:'high',status:'mapped'},
  {id:'f2',name:'Total assets',master:'MF.BS.ASSETS',from:'Trial balance rollup',src:'NetSuite',conf:'high',status:'mapped'},
  {id:'f3',name:'Net income (loss)',master:'MF.PL.NI',from:'GL close · P&L summary',src:'NetSuite',conf:'high',status:'mapped'},
  {id:'f4',name:"Owners' equity",master:'MF.BS.EQUITY',from:'Trial balance rollup',src:'NetSuite',conf:'high',status:'mapped'},
  {id:'f5',name:'Employee count',master:'MF.OPS.EMP',from:'HRIS headcount',src:'Workday',conf:'medium',status:'low'},
  {id:'f6',name:'Industry classification (ISI)',master:'MF.CLASS.ISI',from:'Prior filing',src:'BE-11 FY2024',conf:'low',status:'low'},
  {id:'f7',name:'Intercompany balance — Brazil',master:'MF.IC.BR',from:'—',src:null,conf:null,status:'gap'},
  {id:'f8',name:'FY2025 statements — Nordic Ventures',master:'MF.FS.NORDIC',from:'—',src:null,conf:null,status:'gap'},
]; }

function openReport(type, seed){
  const r=OB_TYPES[type]; if(!r) return;
  obClock=0;
  RPT={
    type, full:(type==='be11'), tab:'setup',
    unlocked:{setup:true,scoping:false,mapping:false,review:false,file:false},
    uploaded:false, sources:[], staged:[],
    hubScanning:false, hubScanned:false, hubConfirmed:false,
    scanRun:false, scanning:false, entitiesApproved:false, editEntities:false,
    setupRun:false, setupProposing:false, setupAccepted:false,
    readiness:defaultReadiness(r), readinessSet:false, setupDone:false,
    scopeRun:false, scoping:false, scopeApproved:false, forms:{}, scopeDone:false, approval:2,
    mapRun:false, mapping:false, remapping:false, validated:false, mapDone:false,
    valRun:false, validating:false, valApproved:false, valDone:false,
    reviewed:{}, reviewDone:false, formOpen:null,
    signed:false, filed:false, fileDone:false,
    entities:OB_ENTITIES.map(e=>({...e})),
    fields:masterFields(),
    conv:seed||[], timeline:[], recordOpen:false,
  };
  RPT.entities.forEach(e=>{ const s=suggestForm(e); e.sugForm=s.form; e.form=s.form; e.reason=s.reason; e.review=!!s.review; });
  document.getElementById('rpMark').textContent=r.code;
  document.getElementById('rpMark').className='rp-mark'+(r.alt?' alt':'');
  document.getElementById('rpTitle').textContent=`${r.code} Project`;
  document.getElementById('rpSub').textContent=`${r.full} · ${r.agency}`;
  document.getElementById('rpRecord')?.classList.remove('open');
  document.getElementById('rpRecBtn')?.classList.remove('open');
  rptLog('agent','Report opened',`${r.code} · Setup → Planning → Data collection → Review & approve → File`);
  go('report');
  scanOverlay(1050);
  renderReport();
  setTimeout(rptHubScan, 700);
}
function scanOverlay(ms){ const ov=document.getElementById('rpScanOverlay'); if(!ov) return; ov.classList.remove('show'); void ov.offsetWidth; ov.classList.add('show'); setTimeout(()=>ov.classList.remove('show'), ms||AGENT_RUN_MS); }

/* ---------- activity record ---------- */
function rptLog(kind,t,m){ if(!RPT) return; RPT.timeline.unshift({kind,t,m,time:obNow()}); renderRecord(); }
function renderRecord(){ const el=document.getElementById('obTimeline'); if(!el||!RPT) return; if(!RPT.timeline.length){ el.innerHTML='<div class="tl-empty">Nothing recorded yet.</div>'; return; } const dotIc={agent:OB_ICONS.setup,commit:OB_ICONS.check,human:OB_ICONS.human}; el.innerHTML=RPT.timeline.map(x=>`<div class="tl-item"><div class="tl-dot ${x.kind}">${dotIc[x.kind]||dotIc.agent}</div><div class="tl-txt"><div class="tl-t">${x.t}</div>${x.m?`<div class="tl-m">${x.m}</div>`:''}<div class="tl-time">${x.time}</div></div></div>`).join(''); }
function toggleRecord(){ if(!RPT) return; RPT.recordOpen=!RPT.recordOpen; document.getElementById('rpRecord').classList.toggle('open',RPT.recordOpen); document.getElementById('rpRecBtn').classList.toggle('open',RPT.recordOpen); }

/* ---------- shell render (lifecycle = anchored sections, not tabs) ---------- */
function rptTabLabel(){ const t=RP_TABS.find(x=>x.key===RPT.tab); return t?t.label:''; }
function stageDone(key){ return (key==='setup'&&RPT.setupDone)||(key==='scoping'&&RPT.scopeDone)||(key==='mapping'&&RPT.valDone)||(key==='review'&&RPT.reviewDone)||(key==='file'&&RPT.fileDone); }
const STAGE_TODO={
  setup:"Give the agents your source data, then review the entities, ownership and project setup they propose — and confirm.",
  scoping:"Confirm the forms mapped to each entity, choose the approval process, and check the groups routed to each area — then approve the plan.",
  mapping:"Check how your sources map to the BE-11 fields, close any data gaps, then run the BEA edit checks to validate the numbers.",
  review:"Read each assembled form the way a BEA reviewer would, then mark it reviewed and approved for filing.",
  file:"Authorize the sign-off and submit the completed filing package to BEA.",
};
const LOCK_IC='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/></svg>';
function stageBody(key){
  if(!RPT.unlocked[key]){
    const idx=RP_TABS.findIndex(x=>x.key===key); const prev=RP_TABS[idx-1];
    return `<div class="rp-locked">${LOCK_IC}<div><div class="rp-locked-h">Opens after ${prev?prev.label:'the previous step'}</div><div class="rp-locked-m">Finish the step above and this stage unlocks automatically — every stage stays visible so you can see the whole lifecycle.</div></div></div>`;
  }
  if(key==='setup') return setupTab();
  if(key==='scoping') return RPT.full?scopingTab():be577Stub('Planning');
  if(key==='mapping') return RPT.full?mappingTab():be577Stub('Data collection');
  if(key==='review') return RPT.full?reviewTab():be577Stub('Review & approve');
  if(key==='file') return RPT.full?fileTab():be577Stub('File');
  return stubTab(key);
}
function renderReport(){
  if(!RPT) return;
  renderRecord();
  const r=OB_TYPES[RPT.type];
  document.getElementById('rpDates').innerHTML=`
    <div class="rp-date"><span class="rp-date-k">Statutory due</span><span class="rp-date-v">${rptDue()}</span></div>
    <div class="rp-date"><span class="rp-date-k">Readiness target</span><span class="rp-date-v ${RPT.readinessSet?'':'muted'}">${RPT.readinessSet?fmtDate(RPT.readiness):'not set'}</span></div>`;
  renderTabs();
  renderKpis();
  renderAttn();
  renderSections();
  bindRptSpy();
  updateFabCtx();
}
const LOCK_IC_SM='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/></svg>';
function daysToDue(){ try{ const d=new Date(OB_TYPES[RPT.type].due); const ms=d-new Date(); return Math.max(0,Math.ceil(ms/86400000)); }catch(e){ return null; } }
function renderKpis(){
  const el=document.getElementById('rpKpis'); if(!el) return;
  const c=formCounts();
  const ents=RPT.scanRun?RPT.entities.length:'—';
  const filing=RPT.scopeRun?c.filing:'—';
  const gaps=RPT.mapRun?gapCount():'—';
  const dd=daysToDue();
  const kpis=[
    {k:'Entities',v:ents,s:RPT.scanRun?'from the scan':'after scan'},
    {k:'Forms filing',v:filing,s:RPT.scopeRun?`${c.notfiling} not filing`:'after scoping'},
    {k:'Open data gaps',v:gaps,s:RPT.mapRun?(gapCount()?'need a source':'all closed'):'after mapping'},
    {k:'Days to due',v:dd==null?'—':dd,s:OB_TYPES[RPT.type].due},
  ];
  el.innerHTML=kpis.map(x=>`<div class="rp-kpi"><div class="rp-kpi-v">${x.v}</div><div class="rp-kpi-k">${x.k}</div><div class="rp-kpi-s">${x.s}</div></div>`).join('');
}
function attnItems(){
  const items=[];
  if(!RPT.uploaded){ items.push({t:'Add your source data to begin',k:'setup'}); return items; }
  if(RPT.scanning){ items.push({t:'Scan running — entities & ownership',k:'setup'}); }
  else if(!RPT.entitiesApproved){ items.push({t:`Review & approve ${RPT.entities.length} entities`,k:'setup'}); }
  else if(RPT.setupProposing){ items.push({t:'Setting up the project…',k:'setup'}); }
  else if(RPT.setupRun && !RPT.setupDone){ items.push({t:'Confirm setup & readiness target',k:'setup'}); }
  if(RPT.setupDone && RPT.full){
    if(RPT.scoping){ items.push({t:'Building your filing plan…',k:'scoping'}); }
    else if(RPT.scopeRun && !RPT.scopeApproved){ const fl=RPT.entities.filter(e=>e.review).length; items.push({t:fl?`${fl} form flagged — review the plan`:'Approve the plan',k:'scoping'}); }
    else if(!RPT.scopeRun){ items.push({t:'Plan your filing — forms, approvals & groups',k:'scoping'}); }
  }
  if(RPT.scopeDone){
    if(RPT.mapping){ items.push({t:'Mapping sources to fields…',k:'mapping'}); }
    else if(RPT.mapRun && gapCount()>0){ items.push({t:`${gapCount()} data gaps to close`,k:'mapping'}); }
    else if(!RPT.mapRun){ items.push({t:'Map & collect your data',k:'mapping'}); }
  }
  if(RPT.mapDone && !RPT.valApproved){ items.push({t: RPT.valRun?'Confirm validation results':'Run the BEA edit checks',k:'mapping'}); }
  if(RPT.valDone && !RPT.reviewDone){ const {total,done}=reviewCounts(); items.push({t:`Review ${total-done} of ${total} forms`,k:'review'}); }
  if(RPT.reviewDone && !RPT.filed){ items.push({t: RPT.signed?'Submit the package to BEA':'Authorize sign-off & file',k:'file'}); }
  if(RPT.filed){ items.push({t:'Filed — nothing needs you',k:'file',done:true}); }
  return items;
}
function renderAttn(){
  const el=document.getElementById('rpAttn'); if(!el) return;
  const items=attnItems();
  const rows=items.map(x=>`<button class="rp-attn-item ${x.done?'done':''}" onclick="rptGoTab('${x.k}')"><span class="rp-attn-dot">${x.done?OB_ICONS.check:''}</span><span class="rp-attn-t">${x.t}</span>${x.done?'':`<span class="rp-attn-go">${IC.chev}</span>`}</button>`).join('');
  el.innerHTML=`<div class="rp-attn-h">${OB_ICONS.info}What needs my attention</div><div class="rp-attn-list">${rows||'<div class="rp-attn-empty">Nothing right now.</div>'}</div>`;
}
function renderTabs(){
  const el=document.getElementById('rpTabs'); if(!el) return;
  const items=RP_TABS.map((t,i)=>{
    const unlocked=RPT.unlocked[t.key];
    const done=stageDone(t.key);
    const active=RPT.tab===t.key;
    const cls=['rp-life-item']; if(active)cls.push('active'); if(done)cls.push('done'); if(!unlocked)cls.push('locked');
    const node=done?OB_ICONS.check:(unlocked?(i+1):LOCK_IC_SM);
    const soon=(t.stub&&!RPT.full)?'<span class="rp-life-soon">soon</span>':'';
    return `<button class="${cls.join(' ')}" data-key="${t.key}" onclick="rptGoTab('${t.key}')"><span class="rp-life-node">${node}</span><span class="rp-life-lab">${t.label}${soon}</span></button>`;
  }).join('');
  el.innerHTML=`<div class="rp-life-h">Report lifecycle</div><div class="rp-life-list">${items}</div>`;
}
function moveTabInk(){ /* vertical lifecycle uses active styling, no sliding ink */ }
function markRailActive(key){ document.querySelectorAll('.rp-life-item').forEach(b=>b.classList.toggle('active', b.dataset.key===key)); }
/* single-section view: only the active lifecycle stage is shown */
function renderSections(){
  const el=document.getElementById('rpBody'); if(!el) return;
  const i=RP_TABS.findIndex(t=>t.key===RPT.tab); const t=RP_TABS[i<0?0:i]; if(!t) return;
  const unlocked=RPT.unlocked[t.key];
  const done=stageDone(t.key);
  const cls=['rp-sec','cur']; if(!unlocked)cls.push('locked'); if(done)cls.push('done');
  const badge=done?OB_ICONS.check:((i<0?0:i)+1);
  const ask=unlocked?`<button class="rp-ask" onclick="openFabFor('${t.key}')" title="Get help with ${HELP_LABEL[t.key]||'this step'} from the Operator">${OB_ICONS.spark||''}Help with ${HELP_LABEL[t.key]||'this step'}</button>`:'';
  el.innerHTML=`<section class="${cls.join(' ')}" id="sec-${t.key}" key="${t.key}">
      <div class="rp-sec-head">
        <div class="rp-sec-ix">${badge}</div>
        <div class="rp-sec-htx"><div class="rp-sec-title">${t.label}</div><div class="rp-sec-todo">${STAGE_TODO[t.key]||''}</div></div>
        ${ask}
      </div>
      <div class="rp-sec-body">${stageBody(t.key)}</div>
    </section>`;
}
/* clicking a lifecycle anchor swaps to that section (no scrolling through all) */
function rptGoTab(key){ if(!RPT.unlocked[key]){ markRailActive(RPT.tab); return; } RPT.tab=key; renderReport(); const el=document.getElementById('rpBody'); el?.scrollIntoView({behavior:'smooth',block:'nearest'}); updateFabCtx(); }
/* progression helper — reveal the next stage */
function rptGoto(key){ RPT.tab=key; renderReport(); const el=document.getElementById('rpBody'); requestAnimationFrame(()=>{ el?.scrollIntoView({behavior:'smooth',block:'nearest'}); }); }
function bindRptSpy(){ /* single-section view — no scroll spy needed */ }
function rptScrollSpy(){}

/* ---------- reusable card builders ---------- */
function agentCard(o){
  return `<div class="agentc ${o.running?'running':''}">
    <div class="agentc-head">
      <div class="agentc-av">${o.icon}</div>
      <div class="agentc-htxt"><div class="agentc-name">${o.name}${o.tag?`<span class="pill grey">${o.tag}</span>`:''}</div><div class="agentc-role">${o.role||''}</div></div>
    </div>
    <div class="agentc-body">${o.body||''}${o.cta||''}</div>
  </div>`;
}
function rcpt(title,agent,summary){
  return `<div class="receipt"><div class="rcpt-ic">${OB_ICONS.check}</div><div class="rcpt-body"><div class="rcpt-h">${title}<span class="rcpt-agent">${agent}</span></div><div class="rcpt-m">${summary}</div></div></div>`;
}
function ctaRun(fn,label,icon,hint,running,runningLabel){
  return running
   ? `<div class="agentc-run">${stepsPanelHtml()}<span class="agent-status"><span class="dots"><i></i><i></i><i></i></span> ${runningLabel}</span></div>`
   : `<div class="agentc-cta"><button class="btn primary" onclick="${fn}">${icon||OB_ICONS.setup}${label}</button>${hint?`<span class="agent-status">${hint}</span>`:''}</div>`;
}

/* ---- live agent reasoning stream (shows how it's thinking, Claude-style) ---- */
const THINK={
  scan:[
    "Opening the trial balance — I can see 8 distinct entity codes in the consolidation.",
    "Cross-referencing last year's filed BE-11 so identifiers carry forward cleanly.",
    "France Holdings and Germany Mfg both roll up at 100%, so they're wholly owned.",
    "Dutch Peak is only 32.5% — that's a minority affiliate, I'll flag it later.",
    "Nordic Ventures closed an acquisition in March, so it's newly acquired this year.",
    "Pulling revenue per entity and attaching a source to every figure.",
  ],
  setup:[
    "The ledger period closes 12/31/2025 — this is a fiscal-year annual filing.",
    "That maps to the BE-11 family, the annual survey rather than the BE-577 quarterly.",
    "BEA's statutory due date for FY2025 annual filers is May 29, 2026.",
    "I'll suggest a readiness target a couple of weeks ahead to leave review buffer.",
  ],
  scope:[
    "Loading the current BEA size tests — $60M for the full BE-11B, $25M–$60M for the short BE-11D.",
    "Acme is the U.S. Reporter, so it always files the BE-11A.",
    "Germany clears $60M on sales — that's a full BE-11B.",
    "Nordic is newly acquired and lands in the $25M–$60M band, so the short BE-11D fits.",
    "Dutch Peak is minority-owned — defaulting to a Claim for Not Filing, but it's close, I'll flag it.",
    "Grouping the affiliates by area so the right regional finance teams pick each one up.",
    "A form is flagged, so I'll default to two-level approval — a regional reviewer ahead of the filing approver.",
  ],
  map:[
    "Loading the BE-11 master-field model and lining up your ledger accounts.",
    "Net sales and total assets map cleanly from the NetSuite rollups — high confidence.",
    "Employee count is coming from Workday; the match is weaker, marking it medium.",
    "I can't find the Brazil intercompany balance or Nordic's FY2025 statements — those are gaps.",
  ],
  val:[
    "Cross-footing each balance sheet — assets should tie to liabilities plus equity.",
    "Reconciling every ownership percentage back to the consolidation.",
    "Running the BEA size-test edit checks across all assembled forms.",
    "Comparing against the prior year — Germany's revenue is up 12%, within a normal range.",
  ],
};
let curThink=null, thinkTimers=[];
function initSteps(key){ curThink={lines:THINK[key]||[],shown:0}; }
function scheduleSteps(ms){ if(!curThink||!curThink.lines.length) return; thinkTimers.forEach(clearTimeout); thinkTimers=[]; const n=curThink.lines.length; for(let i=0;i<n;i++){ thinkTimers.push(setTimeout(()=>{ curThink.shown=Math.min(n,i+1); paintSteps(); }, Math.round(ms*i/(n+0.4))+140)); } }
function thinkBodyHtml(){
  if(!curThink) return '';
  const n=curThink.lines.length, shown=Math.min(curThink.shown,n), done=shown>=n;
  return curThink.lines.slice(0,shown).map((l,i)=>{
    const active=!done && i===shown-1;
    const caret=active?'<span class="think-caret"></span>':'';
    return `<div class="think-step ${active?'now':''}">${l}${caret}</div>`;
  }).join('');
}
function thinkTitleHtml(done){ return done?`Thought for a few seconds`:`<span class="think-shim">Thinking</span>`; }
function stepsPanelHtml(){
  const n=curThink?curThink.lines.length:0, shown=curThink?Math.min(curThink.shown,n):0, done=!!curThink && n>0 && shown>=n;
  return `<div class="think${done?' done':''}"><div class="think-h"><span class="think-star">${OB_ICONS.spark}</span><span class="think-title">${thinkTitleHtml(done)}</span></div><div class="think-body" id="thinkBody">${thinkBodyHtml()}</div></div>`;
}
function paintSteps(){
  const el=document.getElementById('thinkBody'); if(!el) return;
  el.innerHTML=thinkBodyHtml();
  const panel=el.closest('.think'); if(!panel||!curThink) return;
  const done=curThink.shown>=curThink.lines.length;
  panel.classList.toggle('done',done);
  const t=panel.querySelector('.think-title'); if(t) t.innerHTML=thinkTitleHtml(done);
}

/* ================= SETUP TAB ================= */
function setupProgress(){
  const steps=[['Source data',RPT.uploaded],['Entities scanned',RPT.scanRun],['Entities confirmed',RPT.entitiesApproved],['Setup proposed',RPT.setupRun],['Setup confirmed',RPT.setupDone]];
  const total=steps.length, done=steps.filter(s=>s[1]).length, pct=Math.round(done/total*100);
  const dots=steps.map(s=>`<span class="sp-step ${s[1]?'done':''}"><span class="sp-dot">${s[1]?OB_ICONS.check:''}</span><span class="sp-lab">${s[0]}</span></span>`).join('');
  return `<div class="setup-prog"><div class="sp-top"><span class="sp-title">Setup progress</span><span class="sp-count">${done} of ${total} · ${pct}%</span></div><div class="sp-track"><div class="sp-fill" style="width:${pct}%"></div></div><div class="sp-steps">${dots}</div></div>`;
}
function setupTab(){
  let h=setupProgress();
  if(RPT.uploaded){
    h+=rcpt('Source data provided','You · '+RPT.sources.length+' item'+(RPT.sources.length===1?'':'s'),RPT.sources.map(s=>chip(s)).join(' '));
  } else {
    h+=sourceDataStep();
    return h;
  }
  if(RPT.entitiesApproved){
    h+=rcpt('Entities & ownership approved','Entity & Ownership Scan',`${RPT.entities.length} entities · ownership &amp; revenue extracted ${chip('you approved')}`);
  } else {
    if(!RPT.scanRun){
      h+=agentCard({icon:OB_ICONS.scan,name:'Entity & Ownership Scan',tag:'Step 2',role:"Reads the trial balance and prior filing to build your entity list — each affiliate, the parent's ownership %, and its revenue.",cta:ctaRun("rptScan()",'Scan my data for me',OB_ICONS.scan,'The Operator extracts entities, ownership and revenue.',RPT.scanning,'Scanning ledger & prior filing…')});
      return h;
    }
    h+=agentCard({icon:OB_ICONS.scan,name:'Entity & Ownership Scan',tag:'Step 2',role:'Here is the structure the scan extracted — every figure carries its source and confidence inline. Confirm it to continue.',body:entityTable(),cta:`<div class="agentc-cta"><button class="btn primary" onclick="rptApproveEntities()">${OB_ICONS.check}Confirm entities</button></div>`});
    return h;
  }
  if(RPT.setupDone){
    const r=OB_TYPES[RPT.type];
    h+=rcpt('Report set up','Filing Setup Assistant',`${rptName()} · due ${rptDue()} · readiness ${fmtDate(RPT.readiness)}`);
    if(RPT.full){
      h+=`<div class="confirm-bar"><div class="cb-ic">${OB_ICONS.arrow}</div><div class="cb-txt"><div class="cb-h">Setup complete — plan your entities next</div><div class="cb-m">Scope &amp; Forms assigns the right BEA form to each entity.</div></div><button class="btn primary" onclick="rptToScoping()">Continue to Planning</button></div>`;
    } else {
      h+=`<div class="confirm-bar done"><div class="cb-ic">${OB_ICONS.check}</div><div class="cb-txt"><div class="cb-h">BE-577 setup complete</div><div class="cb-m">Planning, Data collection &amp; the later stages are stubbed for BE-577 in this prototype.</div></div></div>`;
    }
    return h;
  }
  if(!RPT.setupRun){
    h+=agentCard({icon:OB_ICONS.setup,name:'Filing Setup Assistant',tag:'Step 3',role:'Proposes the report name (type + period) and statutory due date from your source data and the BEA calendar.',cta:ctaRun("rptSetupRun()",'Set up the project for me',OB_ICONS.setup,'The Operator derives the name, period and due date.',RPT.setupProposing,'Deriving report name & due date…')});
    return h;
  }
  h+=agentCard({icon:OB_ICONS.setup,name:'Filing Setup Assistant',tag:'Step 3',role:'Review the proposed details and set your internal readiness target, then confirm.',body:setupProposal(),cta:`<div class="agentc-cta"><button class="btn primary" onclick="rptAcceptSetup()">${OB_ICONS.check}Confirm setup</button></div>`});
  return h;
}
/* ---- Source data ingestion ----
   The Operator scans the connected Data Hub, surfaces the sources it found
   (entity list + trial balance for the period), the user confirms them, then
   uploads the one thing the hub doesn't have (previous filings). A quieter
   manual-upload path is available at every step. */
function hubProbeBody(){
  const probes=['Entity register','Trial balance','Prior-year filings'].map((p,i)=>`<div class="probe" style="animation-delay:${i*.1}s"><div class="probe-ic">${OB_ICONS.src}</div><div class="probe-name">${p}</div><div class="probe-state"><span class="probe-dot"></span>searching…</div></div>`).join('');
  return `<div class="conn-scanhead"><span class="think-spin"></span>Scanning your Data Hub…</div><div class="conn-scan">${probes}</div>`;
}
function hubFoundList(){
  const r=OB_TYPES[RPT.type];
  const rows=[
    {n:'Entity List', s:'Data Hub · Entity register · updated 3 days ago'},
    {n:`Trial Balance · ${r.period}`, s:'Data Hub · NetSuite consolidation · 96% match'},
  ].map((x,i)=>`<div class="hub-row" style="animation-delay:${i*.07}s"><div class="hub-ic">${OB_ICONS.check}</div><div class="hub-main"><div class="hub-name">${x.n}</div><div class="hub-src">${x.s}</div></div><span class="hub-badge">In Data Hub</span></div>`).join('');
  return `<div class="hub-find">${rows}</div>`;
}
function manualFallback(){
  return `<div class="src-manual"><button onclick="rptManualUpload()">${OB_ICONS.upload}<span>Or upload your source files manually</span></button></div>`;
}
function missingFilingsUpload(){
  return `<button class="up1-drop" onclick="rptUploadFilings()">
    <div class="up1-ic">${OB_ICONS.upload}</div>
    <div class="up1-h">Upload your previous filings</div>
    <div class="up1-m">Last year's filed report so the Operator can baseline against it — <span class="up1-fmt">PDF</span><span class="up1-fmt">XLSX</span><span class="up1-fmt">ZIP</span></div>
  </button>`;
}
function sourceDataStep(){
  const r=OB_TYPES[RPT.type];
  if(!RPT.hubScanned){
    return agentCard({icon:OB_ICONS.spark,name:'Source Discovery',tag:'Step 1',role:'The Operator checks your connected Data Hub for what this filing needs — the latest entity list, the trial balance for the period, and your previous filings.',body:hubProbeBody()})+manualFallback();
  }
  if(!RPT.hubConfirmed){
    return agentCard({icon:OB_ICONS.spark,name:'Source Discovery',tag:'Step 1',role:`I found the latest <strong>Entity List</strong> and <strong>Trial Balance · ${r.period}</strong> in your Data Hub. Confirm to pull them straight in — no export needed.`,body:hubFoundList(),cta:`<div class="agentc-cta"><button class="btn primary" onclick="rptHubConfirm()">${OB_ICONS.check}Use these sources</button><span class="agent-status">Pulled directly from your Data Hub.</span></div>`})+manualFallback();
  }
  let h=rcpt('Data Hub sources confirmed','You',`Entity List &amp; Trial Balance · ${r.period} ${chip('from Data Hub')}`);
  h+=agentCard({icon:OB_ICONS.upload,name:'Source Discovery',tag:'Step 1',role:`One thing isn't in your Data Hub: your <strong>previous filings</strong>. Upload last year's ${r.code} and I'll baseline the new report against it.`,body:missingFilingsUpload()});
  h+=manualFallback();
  return h;
}
function rptHubScan(){
  if(!RPT || RPT.hubScanning || RPT.hubScanned || RPT.uploaded) return;
  RPT.hubScanning=true; if(inReport()) renderReport();
  rptLog('agent','Data Hub scan started','Looking for entity list, trial balance & prior filings');
  setTimeout(()=>{
    if(!RPT || RPT.hubConfirmed || RPT.uploaded){ if(RPT) RPT.hubScanning=false; return; }
    RPT.hubScanning=false; RPT.hubScanned=true;
    rptLog('agent','Data Hub scan finished','Entity list & trial balance found · previous filings missing');
    showToast('Data Hub scanned — 2 sources found');
    if(inReport()) renderReport();
  }, AGENT_RUN_MS);
}
function rptHubConfirm(){
  const r=OB_TYPES[RPT.type];
  RPT.hubConfirmed=true;
  RPT.sources=['Entity List · Data Hub', `Trial Balance ${r.period} · Data Hub`];
  rptLog('commit','You confirmed the Data Hub sources','Entity list & trial balance');
  showToast('Using your Data Hub sources'); renderReport();
}
function prevFilingName(){ const r=OB_TYPES[RPT.type]; const y=parseInt((r.period.match(/\d{4}/)||['2025'])[0],10)-1; return `${r.code.replace(/[^A-Za-z0-9]/g,'')}_${y}_filed.pdf`; }
function rptUploadFilings(){
  const f=prevFilingName();
  RPT.sources=(RPT.sources||[]).concat([f]);
  RPT.uploaded=true;
  rptLog('human','You uploaded previous filings',f);
  showToast('Uploaded — scanning'); renderReport(); rptScan();
}
function rptManualUpload(){
  const r=OB_TYPES[RPT.type];
  RPT.hubScanned=true; RPT.hubConfirmed=true;
  RPT.sources=['Trial_Balances_'+r.period.replace(/\s+/g,'')+'.zip', prevFilingName()];
  RPT.uploaded=true;
  rptLog('human','You uploaded source data manually',RPT.sources.join(' · '));
  showToast('Uploaded — scanning'); renderReport(); rptScan();
}
function uploadBox(){
  if(RPT.staged && RPT.staged.length){
    const items=RPT.staged.map((s,i)=>`<div class="stg-item"><span class="stg-ic">${/query|netsuite|onestream|hyperion|sap|erp|ledger|search|consolidation/i.test(s)?OB_ICONS.src:OB_ICONS.upload}</span><span class="stg-name">${s}</span><button class="stg-x" onclick="rptUnstage(${i})" title="Remove">✕</button></div>`).join('');
    return `<div class="up1">
      <div class="stg-head">${RPT.staged.length} item${RPT.staged.length===1?'':'s'} ready — add anything else, then confirm you're done.</div>
      <div class="stg-list">${items}</div>
      <div class="stg-more">
        <button class="up1-mini" onclick="rptUpload()">${OB_ICONS.upload}Add more files</button>
        <button class="up1-mini" onclick="rptConnect()">${OB_ICONS.src}Connect a source</button>
      </div>
      <div class="agentc-cta stg-cta"><button class="btn primary" onclick="rptConfirmUpload()">${OB_ICONS.check}Done — start the scan</button><span class="agent-status">The Operator scans as soon as you confirm.</span></div>
    </div>`;
  }
  return `<div class="up1">
    <button class="up1-drop" onclick="rptUpload()">
      <div class="up1-ic">${OB_ICONS.upload}</div>
      <div class="up1-h">Drop files here, or click to upload</div>
      <div class="up1-m">Trial balance(s) with per-entity detail and your previous filings. Multiple files and <strong>.zip</strong> archives are fine — <span class="up1-fmt">XLSX</span><span class="up1-fmt">CSV</span><span class="up1-fmt">PDF</span><span class="up1-fmt">ZIP</span></div>
    </button>
    <div class="up1-or"><span>or</span></div>
    <button class="up1-connect" onclick="rptConnect()">${OB_ICONS.src}<span class="up1-ctxt"><span class="up1-ch">Connect a data source for me</span><span class="up1-cm">The Operator scans your connected systems, ranks the ones that fit by confidence, and you pick the best match — no export needed.</span></span><span class="up1-cgo">${IC.chev}</span></button>
  </div>`;
}
const UP_POOL=['Trial_Balances_FY2025.zip','BE-11_FY2024_filed.pdf','GL_detail_FY2025.csv','Entity_ownership.xlsx'];
function rptStage(name){ RPT.staged=RPT.staged||[]; if(!RPT.staged.includes(name)) RPT.staged.push(name); }
/* Systems the Operator probes when finding a data source, and the ranked
   matches it surfaces — each with a confidence so the user picks the right one. */
const CONN_PROBE=['NetSuite ERP','OneStream','Oracle Hyperion','Workday','SAP S/4HANA','SharePoint'];
const CONN_MATCHES=[
  {id:'ns-tb', sys:'NetSuite ERP', env:'US Consolidated', detail:'Saved search · TB_FY2025', ic:'src', match:96, conf:'high', why:"Trial balance with per-entity detail, period ending 12/31/2025 — exactly the ledger this filing needs."},
  {id:'ns-gl', sys:'NetSuite ERP', env:'GL export', detail:'General ledger · FY2025 full', ic:'gl', match:90, conf:'high', why:"Full GL detail for the same period — great backup for drill-down, but heavier than the trial balance."},
  {id:'onestream', sys:'OneStream', env:'Group consolidation', detail:'Entity & ownership register', ic:'org', match:74, conf:'medium', why:"Strong for ownership % per affiliate, but doesn't carry the financial figures on its own."},
  {id:'hyperion', sys:'Oracle Hyperion', env:'Legacy consolidation', detail:'FY2023 close package', ic:'src', match:31, conf:'low', why:"Prior-period consolidation — two years stale for an FY2025 filing."},
];
const CONF_LABEL={high:'High match', medium:'Medium match', low:'Low match'};
let CONN=null;
function escAttr(s){ return String(s==null?'':s).replace(/"/g,'&quot;'); }
function entityTable(){
  const edit=RPT.editEntities;
  const typeTag=e=> e.reporter?'<span class="tag">Parent</span>':(e.own>=100?'<span class="tag">Wholly owned</span>':(e.majority?'<span class="tag">Majority '+e.own+'%</span>':'<span class="tag warn">Minority '+e.own+'%</span>'));
  const rows=RPT.entities.map((e,i)=>{
    if(edit){
      return `<tr>
        <td><input class="etin" value="${escAttr(e.name)}" onchange="rptEditEntity(${i},'name',this.value)"><input class="etin sm" value="${escAttr(e.country)}" onchange="rptEditEntity(${i},'country',this.value)"></td>
        <td>${e.reporter?'<span class="tag">Parent</span>':`<div class="etnum"><input class="etin num" type="number" min="0" max="100" step="0.1" value="${e.own}" onchange="rptEditEntity(${i},'own',this.value)"><span class="etu">%</span></div>`}</td>
        <td><div class="etnum"><span class="etu">$</span><input class="etin num" type="number" value="${e.rev!=null?Math.round(e.rev):''}" onchange="rptEditEntity(${i},'rev',this.value)"><span class="etu">K</span></div></td>
        <td>${e.reporter?'':`<button class="etdel" onclick="rptRemoveEntity(${i})" title="Remove entity"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 7h16M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2M6 7l1 13a1 1 0 001 1h8a1 1 0 001-1l1-13"/></svg></button>`}</td>
      </tr>`;
    }
    return `<tr class="reveal" style="animation-delay:${i*.05}s">
      <td><div class="e-name">${e.name}</div><div class="e-sub">${e.country}${e.note?' · '+e.note:''}</div></td>
      <td><div class="e-val">${e.reporter?'Parent':e.own+'%'}</div><div class="e-cite">${cite(e.ownSrc,e.conf)}</div></td>
      <td><div class="e-val">${fmtRev(e.rev)}</div><div class="e-cite">${cite(e.revSrc,e.conf)}</div></td>
      <td>${typeTag(e)}</td>
    </tr>`;
  }).join('');
  const tools=`<div class="et-tools"><button class="ghost sm" onclick="rptToggleEditEntities()">${edit?OB_ICONS.check+' Done':OB_ICONS.setup+' Edit entities & ownership'}</button></div>`;
  const foot=edit
    ? `<div class="etable-foot edit"><button class="chipbtn" onclick="rptAddEntity()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>Add entity</button><span>Correct any name, country, ownership % or revenue the scan got wrong — ownership drives the form each entity is assigned.</span></div>`
    : `<div class="etable-foot">${OB_ICONS.info}<span><strong>${RPT.entities.length} entities</strong> extracted from the ledger and prior filing. Ownership comes from the consolidation and cap table; revenue from NetSuite — each figure carries its source and confidence inline. <strong>Edit</strong> anything the scan got wrong.</span></div>`;
  return `${tools}<div class="etable-wrap"><table class="etable${edit?' editing':''}"><thead><tr><th>Entity</th><th>Parent ownership</th><th>Revenue · FY2025</th><th>${edit?'':'Type'}</th></tr></thead><tbody>${rows}</tbody></table></div>${foot}`;
}
function rptToggleEditEntities(){ RPT.editEntities=!RPT.editEntities; if(!RPT.editEntities) rptLog('human','You edited the entity list',`${RPT.entities.length} entities after your changes`); renderReport(); }
function rptRescope(e){ const sg=suggestForm(e); e.sugForm=sg.form; if(!RPT.forms[e.name]) e.form=sg.form; e.reason=sg.reason; e.review=!!sg.review; }
function rptEditEntity(i,field,val){
  const e=RPT.entities[i]; if(!e) return;
  if(field==='own'){ e.own=Math.max(0,Math.min(100,parseFloat(val)||0)); e.majority=e.own>=50; }
  else if(field==='rev'){ const n=parseFloat(val); e.rev=isNaN(n)?null:n; e.sales=e.rev; }
  else e[field]=val;
  rptRescope(e);
}
function rptAddEntity(){ RPT.entities.push({name:'New entity',country:'—',own:100,majority:true,newly:false,ownSrc:'Manual entry',assets:null,sales:null,netIncome:null,rev:null,revSrc:'Manual entry',conf:'low'}); rptRescope(RPT.entities[RPT.entities.length-1]); rptLog('human','You added an entity','Manual entry'); renderReport(); }
function rptRemoveEntity(i){ const e=RPT.entities[i]; if(!e||e.reporter) return; RPT.entities.splice(i,1); rptLog('human','You removed an entity',e.name); renderReport(); }
function rptName(){ return RPT.propName!=null?RPT.propName:OB_TYPES[RPT.type].proposedName; }
function rptPeriod(){ return RPT.propPeriod!=null?RPT.propPeriod:OB_TYPES[RPT.type].period; }
function rptDue(){ return RPT.propDue!=null?RPT.propDue:OB_TYPES[RPT.type].due; }
function rptSetProp(k,v){ const clean=String(v).trim(); RPT[k]=clean.length?clean:null; }
function setupProposal(){
  const r=OB_TYPES[RPT.type];
  const ef=(ic,k,val,src,key)=>`<div class="prop-field reveal"><div class="prop-ic">${ic}</div><div class="prop-main"><div class="prop-k">${k}</div><div class="prop-v"><input class="prop-in" value="${escAttr(val)}" onchange="rptSetProp('${key}',this.value)" /></div><div class="prop-cite">${cite(src,'high')}</div></div></div>`;
  return `<div class="propose">
    <div class="prop-editnote">${OB_ICONS.edit||''}The Operator proposed these — edit any field to overwrite it.</div>
    ${ef(OB_ICONS.tag,'Report name',rptName(),'Report type + ledger period','propName')}
    ${ef(OB_ICONS.cal,'Filing period',rptPeriod(),'Ledger period end · Dec 31, 2025','propPeriod')}
    ${ef(OB_ICONS.cal,'Statutory due date',rptDue(),r.dueReason,'propDue')}
    <div class="prop-field readiness reveal"><div class="prop-ic">${OB_ICONS.target}</div><div class="prop-main"><div class="prop-k">Your readiness target <span class="prop-opt">internal</span></div><div class="prop-v"><input type="date" id="rptReadiness" value="${RPT.readiness}" onchange="rptSetReadiness(this.value)" class="date-in" /></div><div class="prop-cite">${cite('Suggested ~2 weeks before the statutory due date','medium')}</div></div></div>
  </div>`;
}
function rptUpload(){
  const before=(RPT.staged||[]).length;
  const next=UP_POOL.filter(f=>!(RPT.staged||[]).includes(f)).slice(0,before?1:2);
  if(!next.length){ showToast('All sample files already added'); return; }
  next.forEach(rptStage);
  rptLog('human','You added source files',next.join(' · '));
  showToast(next.length+' file'+(next.length===1?'':'s')+' added');
  renderReport();
}
function rptConnect(){
  CONN={phase:'scan', sel:null};
  document.getElementById('overlay').classList.add('open');
  renderConnectModal();
  rptLog('agent','Connection scan started','Probing your connected systems for a match');
  setTimeout(()=>{ if(!CONN || CONN.phase!=='scan') return; CONN.phase='results'; CONN.sel=CONN_MATCHES[0].id; renderConnectModal(); rptLog('agent','Connection scan finished',`${CONN_MATCHES.length} possible sources · ${CONN_MATCHES[0].sys} is the best match`); }, AGENT_RUN_MS);
}
function renderConnectModal(){
  const m=document.getElementById('modal'); if(!m || !CONN) return;
  const head=`<div class="modal-h">${OB_ICONS.src}<h3>Find a data source</h3><button class="xbtn" onclick="closeModal();CONN=null;">✕</button></div>`;
  if(CONN.phase==='scan'){
    const probes=CONN_PROBE.map((p,i)=>`<div class="probe" style="animation-delay:${i*.09}s"><div class="probe-ic">${OB_ICONS.src}</div><div class="probe-name">${p}</div><div class="probe-state"><span class="probe-dot"></span>checking…</div></div>`).join('');
    m.innerHTML=head+`<div class="modal-b">
      <div class="conn-intro">${OB_ICONS.spark}<span>I'm scanning the systems you're connected to for a source that matches this filing — the right period, entity detail and figures. I'll rank what I find by how well it fits.</span></div>
      <div class="conn-scanhead"><span class="think-spin"></span>Scanning connected systems…</div>
      <div class="conn-scan">${probes}</div>
    </div>
    <div class="modal-f"><button class="btn sec" onclick="closeModal();CONN=null;">Cancel</button><button class="btn primary" disabled><span class="dots" style="display:inline-flex;gap:4px"><i></i><i></i><i></i></span>Scanning…</button></div>`;
    return;
  }
  const rows=CONN_MATCHES.map((c,i)=>{
    const sel=CONN.sel===c.id;
    const rec=i===0?`<span class="conn-rec">${OB_ICONS.check}Best match</span>`:'';
    return `<button class="conn-opt ${sel?'sel':''}" style="animation-delay:${i*.06}s" onclick="rptConnSel('${c.id}')">
      <span class="conn-radio"></span>
      <div class="conn-ic">${OB_ICONS[c.ic]||OB_ICONS.src}</div>
      <div class="conn-main">
        <div class="conn-sys">${c.sys} ${rec}</div>
        <div class="conn-detail">${c.env} · ${c.detail}</div>
        <div class="conn-why">${c.why}</div>
      </div>
      <div class="conn-side"><span class="conf-badge ${c.conf}">${c.match}% · ${CONF_LABEL[c.conf]}</span><div class="conf-bar ${c.conf}"><i style="width:${c.match}%"></i></div></div>
    </button>`;
  }).join('');
  m.innerHTML=head+`<div class="modal-b">
    <div class="conn-intro">${OB_ICONS.spark}<span>I scanned your connected systems and found <strong>${CONN_MATCHES.length} sources</strong> that could supply this filing's data. Here's how well each one fits — pick the one to connect.</span></div>
    <div class="conn-list">${rows}</div>
  </div>
  <div class="modal-f"><button class="btn sec" onclick="closeModal();CONN=null;">Cancel</button><button class="btn primary" id="connGo" onclick="rptConnectPick()" ${CONN.sel?'':'disabled'}>${OB_ICONS.src}Connect selected</button></div>`;
}
function rptConnSel(id){
  if(!CONN) return; CONN.sel=id;
  document.querySelectorAll('.conn-opt').forEach(o=>o.classList.remove('sel'));
  const el=document.querySelector(`.conn-opt[onclick*="'${id}'"]`); if(el) el.classList.add('sel');
  const go=document.getElementById('connGo'); if(go) go.disabled=false;
}
function rptConnectPick(){
  if(!CONN || !CONN.sel) return;
  const c=CONN_MATCHES.find(x=>x.id===CONN.sel); if(!c) return;
  closeModal(); CONN=null;
  rptStage(`${c.sys} · ${c.detail}`);
  rptLog('human','You connected a data source',`${c.sys} · ${c.detail} · ${c.match}% match`);
  showToast('Connected — '+c.sys);
  if(inReport()) renderReport();
}
function rptUnstage(i){ RPT.staged.splice(i,1); renderReport(); }
function rptConfirmUpload(){
  if(!RPT.staged || !RPT.staged.length) return;
  RPT.uploaded=true; RPT.sources=RPT.staged.slice();
  rptLog('human','You confirmed your source data',RPT.sources.length+' item'+(RPT.sources.length===1?'':'s'));
  showToast('Confirmed — scanning'); renderReport(); rptScan();
}
function rptScan(){ if(RPT.scanning) return; RPT.scanning=true; initSteps('scan'); renderReport(); scheduleSteps(AGENT_RUN_MS); scanOverlay(); rptLog('agent','Entity & Ownership Scan started','Reading ledger & prior filing'); setTimeout(()=>{ RPT.scanning=false; RPT.scanRun=true; rptLog('agent','Entity & Ownership Scan finished',`${RPT.entities.length} entities extracted`); showToast('Scan complete — '+RPT.entities.length+' entities'); renderReport(); }, AGENT_RUN_MS); }
function rptApproveEntities(){ RPT.entitiesApproved=true; rptLog('commit','You confirmed the entity list',`${RPT.entities.length} entities with ownership & revenue`); renderReport(); if(!RPT.setupRun && !RPT.setupProposing) rptSetupRun(); }
function rptSetupRun(){ if(RPT.setupProposing) return; RPT.setupProposing=true; initSteps('setup'); renderReport(); scheduleSteps(AGENT_RUN_MS); rptLog('agent','Filing Setup Assistant started','Deriving name, period & due date'); setTimeout(()=>{ RPT.setupProposing=false; RPT.setupRun=true; rptLog('agent','Filing Setup Assistant finished','Name, period & due date proposed'); renderReport(); }, AGENT_RUN_MS); }
function rptSetReadiness(v){ RPT.readiness=v; }
function rptAcceptSetup(){ RPT.setupAccepted=true; RPT.readinessSet=true; RPT.setupDone=true; RPT.unlocked.scoping=RPT.full; rptLog('commit','You confirmed the report setup',`Readiness target ${fmtDate(RPT.readiness)}`); renderReport(); }
function rptToScoping(){ rptLog('human','You moved to Planning','Scope & Forms standing by'); rptGoto('scoping'); if(!RPT.scopeRun && !RPT.scoping) setTimeout(rptScopeRun,340); }

/* ================= SCOPING TAB ================= */
function scopingTab(){
  let h='';
  if(RPT.scopeApproved){
    h+=rcpt('Plan approved','Planning',planSummary());
    h+=`<div class="confirm-bar"><div class="cb-ic">${OB_ICONS.arrow}</div><div class="cb-txt"><div class="cb-h">Plan confirmed — collect your data next</div><div class="cb-m">The Mapping Agent aligns your ledger to the BE-11 master fields, then validates the numbers.</div></div><button class="btn primary" onclick="rptToMapping()">Continue to Data collection</button></div>`;
    return h;
  }
  if(!RPT.scopeRun){
    h+=agentCard({icon:OB_ICONS.target,name:'Scope & Forms',tag:'Planning',role:'Plans the whole filing: it maps each entity to its BEA form, proposes the approval process, and routes every affiliate to the right group by area.',cta:ctaRun("rptScopeRun()",'Plan my filing for me',OB_ICONS.target,'The Operator maps forms, sets approvals & assigns groups.',RPT.scoping,'Applying BEA rules & building the plan…')});
    return h;
  }
  h+=agentCard({icon:OB_ICONS.target,name:'Forms & entities',tag:'Scope',role:'Each form is assigned from the BEA rules — review the reasoning, override any call, then confirm the plan below.',body:scopeTable()});
  h+=planApprovalCard();
  h+=planPeopleCard();
  return h;
}
/* ---- Planning · approval process (1 vs 2 levels) ---- */
function planApprovalCard(){
  const step=(lab,kind)=>`<span class="appr-step ${kind||''}"><span class="ard"></span>${lab}</span>`;
  const arr=`<span class="appr-arr">${OB_ICONS.arrow}</span>`;
  const flow1=step('Preparer')+arr+step('Filing approver','appr');
  const flow2=step('Preparer')+arr+step('Regional reviewer','rev')+arr+step('Filing approver','appr');
  const opt=(lvl,name,desc,flow,rec)=>`<button class="appr-opt ${RPT.approval===lvl?'sel':''}" data-lvl="${lvl}" onclick="rptSetApproval(${lvl})">
      <div class="appr-top"><span class="appr-name">${name}</span><span class="appr-radio"></span></div>
      <div class="appr-desc">${desc}</div>
      <div class="appr-flow">${flow}</div>
      ${rec?`<div><span class="appr-rec">${OB_ICONS.check}Recommended</span></div>`:''}
    </button>`;
  const body=`<div class="plan-appr">
    ${opt(1,'Single-level approval','Each area\'s preparer submits straight to the filing approver. Fastest path — best when every form is routine.',flow1,false)}
    ${opt(2,'Two-level approval','A regional reviewer signs off before the filing approver — an added governance checkpoint. Recommended when the agent flags any form.',flow2,true)}
  </div>`;
  return agentCard({icon:OB_ICONS.shield,name:'Approval process',tag:'Sign-off',role:'Choose how many levels of sign-off each area\'s numbers pass through before filing.',body});
}
/* ---- Planning · people / groups per area ---- */
function areaStats(area){
  const ents=RPT.entities.filter(e=>AREA_OF[e.country]===area);
  const filing=ents.filter(e=>isFiling(curForm(e))).length;
  const ctys=[...new Set(ents.map(e=>e.country))];
  return {n:ents.length, filing, ctys};
}
function planAvs(people){ return `<div class="grp-avs">${people.map(p=>`<div class="av ${p.c}">${p.i}</div>`).join('')}</div>`; }
const PENCIL_IC='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4z"/></svg>';
function rosterChips(ai,roleKey){
  const grp=planAreas()[ai][roleKey];
  return ROSTER.map((p,pi)=>{
    const on=grp.people.some(x=>x.i===p.i&&x.c===p.c);
    return `<button class="rp-pick ${on?'on':''}" onclick="rptTogglePerson(${ai},'${roleKey}',${pi})"><span class="av ${p.c}">${p.i}</span><span class="rp-pick-n">${p.n}</span><span class="rp-pick-c">${on?OB_ICONS.check:''}</span></button>`;
  }).join('');
}
function grpRow(ai,roleKey,role,cls,g){
  const names=g.people.map(p=>p.n).join(' · ');
  const key=ai+':'+roleKey; const open=RPT.planOpen===key;
  return `<div class="grp-row ${open?'editing':''}">
    <span class="grp-role ${cls}">${role}</span>
    <div class="grp-main"><div class="grp-name">${g.name}</div><div class="grp-names">${names||'Unassigned'}</div></div>
    ${planAvs(g.people)}
    <button class="grp-edit" onclick="rptTogglePlanEdit(${ai},'${roleKey}')" title="Change who's assigned">${PENCIL_IC}<span>Change</span></button>
    ${open?`<div class="grp-picker"><div class="grp-picker-h">Assign to ${role.toLowerCase()} — ${g.name}</div><div class="grp-picker-list">${rosterChips(ai,roleKey)}</div></div>`:''}
  </div>`;
}
function planPeopleInner(){
  const two=RPT.approval===2;
  const rows=planAreas().map((a,ai)=>{
    const st=areaStats(a.area);
    if(!st.n) return '';
    let grps=grpRow(ai,'prep','Preparer','prep',a.prep);
    if(two) grps+=grpRow(ai,'review','Reviewer','rev',a.review);
    grps+=grpRow(ai,'approve','Approver','appr',a.approve);
    return `<div class="area-row"><div class="area-head"><div><div class="area-name">${OB_ICONS.org}${a.area}</div><div class="area-cty">${st.ctys.join(' · ')}</div></div><div class="area-count">${st.n} ${st.n===1?'entity':'entities'}<br>${st.filing} filing</div></div><div class="grp-grid">${grps}</div></div>`;
  }).join('');
  return `<div class="area-list">${rows}</div>`;
}
function rptTogglePlanEdit(ai,roleKey){ const key=ai+':'+roleKey; RPT.planOpen=RPT.planOpen===key?null:key; const pc=document.getElementById('planPeople'); if(pc) pc.innerHTML=planPeopleInner(); }
function rptTogglePerson(ai,roleKey,pi){
  const grp=planAreas()[ai][roleKey]; const p=ROSTER[pi]; if(!grp||!p) return;
  const idx=grp.people.findIndex(x=>x.i===p.i&&x.c===p.c);
  if(idx>=0){ if(grp.people.length<=1){ showToast('Keep at least one person assigned'); return; } grp.people.splice(idx,1); }
  else { grp.people.push({i:p.i,c:p.c,n:p.n}); }
  rptLog('human','You changed the '+roleKey+' assignment', planAreas()[ai].area+' · '+grp.name+' → '+grp.people.map(x=>x.n).join(', '));
  const pc=document.getElementById('planPeople'); if(pc) pc.innerHTML=planPeopleInner();
}
function planApproveStatusText(){ const c=formCounts(); return `${c.filing} filing · ${c.notfiling} not filing · ${RPT.approval===2?'two-level':'single-level'} approval`; }
function planPeopleCard(){
  return agentCard({icon:OB_ICONS.people,name:'People involved',tag:'Groups per area',role:'Every affiliate is routed to a group by area, following the approval chain you set above. Use <strong>Change</strong> on any group to swap who\'s assigned — switch the approval depth and the right groups pick up the work.',body:`<div id="planPeople">${planPeopleInner()}</div>`,cta:`<div class="agentc-cta"><button class="btn primary" onclick="rptApproveScope()">${OB_ICONS.check}Confirm plan</button><span class="agent-status" id="planApproveStatus">${planApproveStatusText()}</span></div>`});
}
function rptSetApproval(n){
  if(RPT.approval===n) return; RPT.approval=n;
  rptLog('human','You set '+(n===2?'two-level':'single-level')+' approval', n===2?'Preparer → Regional reviewer → Filing approver':'Preparer → Filing approver');
  document.querySelectorAll('.appr-opt').forEach(o=>o.classList.toggle('sel',+o.dataset.lvl===n));
  const pc=document.getElementById('planPeople'); if(pc) pc.innerHTML=planPeopleInner();
  const st=document.getElementById('planApproveStatus'); if(st) st.textContent=planApproveStatusText();
}
function planSummary(){
  const c=formCounts();
  const lvl=RPT.approval===2?'two-level approval (preparer → reviewer → approver)':'single-level approval (preparer → approver)';
  const areas=planAreas().filter(a=>areaStats(a.area).n).map(a=>a.area).join(', ');
  return `${c.filing} filing · ${c.notfiling} not filing · ${lvl} · groups assigned across ${areas}`;
}
function ownTag(e){ if(e.reporter) return '<span class="tag">Reporter</span>'; if(e.own>=100) return '<span class="tag">Wholly owned</span>'; if(e.majority) return `<span class="tag">Majority ${e.own}%</span>`; return `<span class="tag warn">Minority ${e.own}%</span>`; }
function figLine(k,v){ if(v==null) return `<div class="fig"><span class="fig-k">${k}</span><span class="fig-v muted">pending</span></div>`; const big=Math.abs(v)>60000; return `<div class="fig"><span class="fig-k">${k}</span><span class="fig-v ${big?'over':''}">${fmtRev(Math.abs(v))}</span></div>`; }
function scopeTable(){
  const rows=RPT.entities.map((e,i)=>{
    const cur=curForm(e);
    const overridden=RPT.forms[e.name]&&RPT.forms[e.name]!==e.sugForm;
    const opts=FORM_OPTIONS.map(o=>`<option value="${o}" ${o===cur?'selected':''}>${o}</option>`).join('');
    const filing=isFiling(cur);
    return `<tr class="reveal ${e.review?'flag':''}" style="animation-delay:${i*.05}s">
      <td><div class="e-name">${e.name}</div><div class="e-sub">${e.country}${e.newly?' · newly acquired':''}${e.reporter?' · U.S. Reporter':''}</div></td>
      <td>${ownTag(e)}</td>
      <td><div class="fig-list">${figLine('Assets',e.assets)}${figLine('Sales',e.sales)}${figLine('Net income',e.netIncome)}</div></td>
      <td><div class="form-pick ${filing?'filing':'notfiling'} ${overridden?'over':''}"><select onchange="rptSetForm(${i},this.value)">${opts}</select>${overridden?'<span class="over-tag">override</span>':''}</div></td>
      <td><div class="reason ${e.review?'review':''}">${e.review?OB_ICONS.info:''}<span>${e.reason}</span></div></td>
    </tr>`;
  }).join('');
  return `<div class="etable-wrap"><table class="etable scope"><thead><tr><th>Entity</th><th>Ownership</th><th>Key figures</th><th>Form</th><th>Why</th></tr></thead><tbody>${rows}</tbody></table></div>
    <div class="etable-foot">${OB_ICONS.info}<span>The <strong>$60M</strong> size test (and the <strong>$25M–$60M</strong> short-form band for newly acquired affiliates) is applied automatically. Minority-owned affiliates file a <strong>Claim for Not Filing</strong>. Override any call from the dropdown — <strong>Dutch Peak Innovations</strong> is the one the agent flags for you.</span></div>`;
}
function rptSetForm(i,val){
  const e=RPT.entities[i]; if(!e) return; RPT.forms[e.name]=val;
  rptLog('human','You set '+e.name+' to '+val,'Override recorded');
  /* update in place so the scope table doesn't re-animate on every override */
  const tr=document.querySelectorAll('.etable.scope tbody tr')[i];
  const pick=tr?tr.querySelector('.form-pick'):null;
  if(pick){
    const overridden=val!==e.sugForm;
    pick.className='form-pick '+(isFiling(val)?'filing':'notfiling')+(overridden?' over':'');
    let tag=pick.querySelector('.over-tag');
    if(overridden && !tag){ tag=document.createElement('span'); tag.className='over-tag'; tag.textContent='override'; pick.appendChild(tag); }
    else if(!overridden && tag){ tag.remove(); }
    tr.classList.add('row-flash'); setTimeout(()=>tr.classList.remove('row-flash'),600);
  }
  const status=document.getElementById('planApproveStatus');
  if(status) status.textContent=planApproveStatusText();
}
function rptScopeRun(){ if(RPT.scoping) return; RPT.scoping=true; initSteps('scope'); renderReport(); scheduleSteps(AGENT_RUN_MS); rptLog('agent','Planning started','Mapping forms, approvals & groups'); setTimeout(()=>{ RPT.scoping=false; RPT.scopeRun=true; const c=formCounts(); rptLog('agent','Planning finished',`${c.filing} filing · ${c.notfiling} not filing · two-level approval · groups assigned`); showToast('Plan ready — 1 form needs your call'); renderReport(); }, AGENT_RUN_MS); }
function rptApproveScope(){ RPT.scopeApproved=true; RPT.scopeDone=true; RPT.unlocked.mapping=true; const c=formCounts(); rptLog('commit','You confirmed scope & forms',`${c.filing} filing · ${c.notfiling} not filing`); renderReport(); }
function rptToMapping(){ rptLog('human','You moved to Data collection','Mapping Agent standing by'); rptGoto('mapping'); if(!RPT.mapRun && !RPT.mapping) setTimeout(rptMapRun,340); }

/* ================= MAPPING & COLLECTION TAB ================= */
function gapCount(){ return RPT.fields.filter(f=>f.status==='gap'||f.status==='collecting').length; }
function mappingTab(){
  let h='';
  if(!RPT.mapRun){
    h+=agentCard({icon:OB_ICONS.map,name:'Mapping Agent',tag:'Data collection',role:'Maps every source field to the BE-11 master field model, with a confidence on each match. Then you validate and fill any gaps with more sources or a collection agent.',cta:ctaRun("rptMapRun()",'Map my data for me',OB_ICONS.map,'The Operator aligns sources to the master field model.',RPT.mapping,'Mapping sources to master fields…')});
    return h;
  }
  h+=agentCard({icon:OB_ICONS.map,name:'Mapping Agent',tag:'Data collection',role:'Every field is mapped to its master-field concept and source. Validate the matches and resolve any gaps below — adding a source re-runs the mapping.',body:mapMetrics()+mapTable()+(RPT.remapping?`<div class="remap-note"><span class="dots"><i></i><i></i><i></i></span> Re-mapping with the new source…</div>`:'')});
  h+=gapsPanel();
  if(gapCount()===0 && RPT.validated){
    h+=rcpt('Mapping & collection complete','Mapping Agent · Validation',`All master fields mapped &amp; collected ${chip('0 gaps')}`);
    h+=validateBlock();
  }
  return h;
}
function mapMetrics(){ const mapped=RPT.fields.filter(f=>f.status==='mapped'||f.status==='resolved').length; const low=RPT.fields.filter(f=>f.status==='low').length; const gaps=gapCount(); return `<div class="metric-row"><div class="metric"><div class="metric-v good">${mapped}</div><div class="metric-k">mapped</div></div><div class="metric"><div class="metric-v ${low?'warn':'good'}">${low}</div><div class="metric-k">low confidence</div></div><div class="metric"><div class="metric-v ${gaps?'warn':'good'}">${gaps}</div><div class="metric-k">open gaps</div></div></div>`; }
function mapTable(){
  const rows=RPT.fields.map(f=>{
    const stMap={mapped:['ok','Mapped'],low:['warn','Low conf.'],gap:['gap','Gap'],collecting:['warn','Collecting'],resolved:['ok','Resolved']};
    const st=stMap[f.status];
    const from = f.status==='gap'?`<span class="muted">— not found</span>`:(f.status==='collecting'?`<span class="muted">awaiting ${f.owner||'source'}…</span>`:`<span class="mf-from">${f.from}</span>${f.src?cite(f.src,f.conf||'medium'):''}`);
    return `<tr><td><div class="mf-name">${f.name}</div><div class="mf-master">${f.master}</div></td><td class="mf-arrow">${OB_ICONS.arrow}</td><td>${from}</td><td><span class="mstat ${st[0]}">${st[0]==='ok'?OB_ICONS.check:(st[0]==='gap'?OB_ICONS.info:'')}${st[1]}</span></td></tr>`;
  }).join('');
  return `<div class="etable-wrap"><table class="etable maptable"><thead><tr><th>Master field</th><th></th><th>Mapped from</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}
function gapsPanel(){
  const gaps=RPT.fields.filter(f=>f.status==='gap'||f.status==='collecting');
  if(!gaps.length){
    return `<div class="gaps-card resolved"><div class="gaps-h">${OB_ICONS.check}<span>No open gaps — every master field is mapped to a source.</span></div>${RPT.validated?'':`<div class="agentc-cta"><button class="btn primary" onclick="rptValidate()">${OB_ICONS.shield}Validate the values for me</button><span class="agent-status">The Operator cross-checks the mapped values before the next stage.</span></div>`}</div>`;
  }
  const rows=gaps.map(f=>{
    if(f.status==='collecting') return `<div class="gap-row"><div class="gap-ic collecting"><span class="dots"><i></i><i></i><i></i></span></div><div class="gap-main"><div class="gap-h">${f.name}</div><div class="gap-m">Collection agent assigned to ${f.owner} — collecting…</div></div></div>`;
    return `<div class="gap-row"><div class="gap-ic">${OB_ICONS.info}</div><div class="gap-main"><div class="gap-h">${f.name}</div><div class="gap-m">${f.master} · no source mapped</div></div>
      <div class="gap-actions"><button class="chipbtn" onclick="rptAddSource('${f.id}')">${OB_ICONS.upload}Add source</button><button class="chipbtn" onclick="rptAskAgent('${f.id}')">${IC.op}Ask agent</button><button class="chipbtn" onclick="rptAssignCollector('${f.id}')">${OB_ICONS.people}Assign collector</button></div></div>`;
  }).join('');
  return `<div class="gaps-card"><div class="gaps-h">${OB_ICONS.info}<span><strong>${gaps.length} data ${gaps.length===1?'gap':'gaps'}</strong> — resolve each by adding a source, asking an agent to find it, or assigning a collection agent. Any new source re-runs the mapping.</span></div><div class="gap-list">${rows}</div></div>`;
}
function rptMapRun(){ if(RPT.mapping) return; RPT.mapping=true; initSteps('map'); renderReport(); scheduleSteps(AGENT_RUN_MS); rptLog('agent','Mapping Agent started','Aligning sources to master fields'); setTimeout(()=>{ RPT.mapping=false; RPT.mapRun=true; rptLog('agent','Mapping Agent finished',`${RPT.fields.filter(f=>f.status==='mapped').length} mapped · ${gapCount()} gaps`); showToast('Mapping complete — '+gapCount()+' gaps'); renderReport(); }, AGENT_RUN_MS); }
function rptRemapResolve(fid, from, src, conf, logT, logM, toast){
  const f=RPT.fields.find(x=>x.id===fid); if(!f) return;
  RPT.remapping=true; renderReport();
  setTimeout(()=>{ RPT.remapping=false; f.status='resolved'; f.from=from; f.src=src; f.conf=conf; rptLog('agent',logT,logM); showToast(toast); renderReport(); }, AGENT_RUN_MS);
}
function rptAddSource(fid){ const f=RPT.fields.find(x=>x.id===fid); if(!f) return; rptLog('human','You added a data source','For '+f.name); const from=fid==='f7'?'Brazil IC subledger':'Uploaded statement'; const src=fid==='f7'?'NetSuite · BR':'Nordic_FY2025.pdf'; rptRemapResolve(fid,from,src,'high','Re-mapping finished',f.name+' mapped — gap closed','Re-mapped — gap closed'); }
function rptAskAgent(fid){ const f=RPT.fields.find(x=>x.id===fid); if(!f) return; rptLog('human','You asked an agent to find '+f.name,'Search agent dispatched'); rptRemapResolve(fid,'Agent-sourced','Found in workspace','medium','Search agent finished',f.name+' located & mapped','Agent found the data'); }
function rptAssignCollector(fid){ const f=RPT.fields.find(x=>x.id===fid); if(!f) return; f.status='collecting'; f.owner=fid==='f7'?'Tom Reyes · Brazil Finance':'Nordic controller'; rptLog('human','You assigned a collection agent',f.name+' → '+f.owner); renderReport(); setTimeout(()=>{ f.status='resolved'; f.from='Collected reply'; f.src=f.owner; f.conf='high'; rptLog('agent','Collection agent finished',f.name+' received & mapped'); showToast('Collected — '+f.name); renderReport(); }, Math.round(AGENT_RUN_MS*1.6)); }
function rptValidate(){ RPT.validated=true; RPT.mapDone=true; rptLog('commit','You validated the mapped values','0 blocking issues · values cross-checked'); showToast('Validation passed'); renderReport(); }

/* ================= VALIDATE · REVIEW · FILE ================= */
/* These stages reuse the real BE-11 form UI (be11FormHtml) and the authored
   FORMS data, wired to the report's RPT state so the lifecycle is continuous. */
const RPT_CITY={Germany:'Munich',Singapore:'Singapore',France:'Paris',Brazil:'São Paulo',Sweden:'Stockholm',Netherlands:'Amsterdam',Ireland:'Dublin','United States':'Wilmington, DE'};
function rptEnter(){ const b=document.getElementById('rpBody'); if(b){ b.classList.remove('enter'); void b.offsetWidth; b.classList.add('enter'); } }
function rptFormData(e){
  const assets=e.assets, sales=e.sales, ni=e.netIncome;
  const liabilities=assets!=null?Math.round(assets*0.42):null;
  const ownersEq=(assets!=null&&liabilities!=null)?assets-liabilities:null;
  const ppe=assets!=null?Math.round(assets*0.30):null;
  const ppeExp=ppe!=null?Math.round(ppe*0.12):null;
  const employees=sales!=null?Math.max(20,Math.round(sales/180)):null;
  const comp=employees!=null?Math.round(employees*95):null;
  const rnd=sales!=null?Math.round(sales*0.04):null;
  const over300=[assets,sales,ni==null?null:Math.abs(ni)].some(v=>v!=null&&v>300000);
  return {assets,sales,netIncome:ni,liabilities,ownersEq,ppe,ppeExp,employees,comp,rnd,over300};
}
function reviewForms(){
  const named=(FORMS['be11-fy25']&&FORMS['be11-fy25'].items)||[];
  const byName={}; named.forEach(it=>byName[it.entity]=it);
  return RPT.entities.filter(e=>isFiling(curForm(e))).map(e=>{
    const base=byName[e.name]||{};
    const synth=rptFormData(e);
    const f={
      id:(base.id||('rev-'+e.name)).replace(/[^a-zA-Z0-9]/g,''),
      code:curForm(e), reporter:US_REPORTER, entity:e.name, country:e.country,
      city:base.city||RPT_CITY[e.country]||'—', fyEnd:base.fyEnd||'12/31/2025',
      newAffiliate:(base.newAffiliate!=null?base.newAffiliate:!!e.newly),
      ownEquity:(e.reporter?null:(base.ownEquity!=null?base.ownEquity:e.own)),
      ownVoting:(e.reporter?null:(base.ownVoting!=null?base.ownVoting:e.own)),
      activity:base.activity||'Provider of services',
      product:base.product||'Services provided to affiliated and unaffiliated customers',
      isi:base.isi||'5415', src:base.src||'NetSuite ERP', note:null,
    };
    ['assets','sales','netIncome','liabilities','ownersEq','ppe','ppeExp','employees','comp','rnd'].forEach(k=>{ f[k]=(base[k]!=null?base[k]:synth[k]); });
    f.over300=(base.over300!=null?base.over300:synth.over300);
    return {e,f};
  });
}
function reviewCounts(){ const forms=reviewForms(); const done=forms.filter(x=>RPT.reviewed[x.e.name]).length; return {total:forms.length, done}; }

/* ---------- Validate (folded into the Data collection stage) ---------- */
function valChecks(){ return [
  {t:'Balance sheet cross-foots',m:'Assets = Liabilities + Owners’ equity on every filing form',s:'ok'},
  {t:'Net income ties to the P&L close',m:'Part III / IV income reconciles to the mapped GL close',s:'ok'},
  {t:'Direct ownership reconciles to consolidation',m:'Equity & voting % match the consolidation and cap table',s:'ok'},
  {t:'Size test drives the right schedule',m:'Part III vs Part IV selected from assets / sales / net income',s:'ok'},
  {t:'Identification fields complete',m:'Country, city, fiscal-year end and ISI present on all forms',s:'ok'},
  {t:'Prior-year variance within tolerance',m:'Germany sales +5.5% vs FY2024 — within threshold, explained',s:'adv'},
]; }
function validateBlock(){
  let h='';
  if(RPT.valApproved){
    h+=rcpt('Validation approved','Validation Agent',`${valChecks().length} BEA edit checks · 0 blocking ${chip('1 advisory')}`);
    h+=`<div class="confirm-bar"><div class="cb-ic">${OB_ICONS.arrow}</div><div class="cb-txt"><div class="cb-h">Data collected &amp; validated — review the assembled forms next</div><div class="cb-m">Open each BE-11 form, check the populated values, then mark it reviewed and approved.</div></div><button class="btn primary" onclick="rptToReview()">Continue to Review &amp; approve</button></div>`;
    return h;
  }
  if(!RPT.valRun){
    h+=agentCard({icon:OB_ICONS.shield,name:'Validation Agent',tag:'Data collection',role:'Runs the BEA edit checks across every assembled form — cross-footing, size tests, ownership reconciliation and prior-year variance.',cta:ctaRun("rptValRun()",'Run the edit checks for me',OB_ICONS.shield,'The Operator validates every filing form against BEA rules.',RPT.validating,'Running BEA edit checks…')});
    return h;
  }
  h+=agentCard({icon:OB_ICONS.shield,name:'Validation Agent',tag:'Data collection',role:'All BEA edit checks ran — nothing blocks the filing, with one advisory for your awareness. Confirm to move on to review.',body:valList(),cta:`<div class="agentc-cta"><button class="btn primary" onclick="rptApproveValidation()">${OB_ICONS.check}Confirm validation</button><span class="agent-status">0 blocking · 1 advisory</span></div>`});
  return h;
}
function valList(){
  const rows=valChecks().map((c,i)=>`<div class="vchk ${c.s} reveal" style="animation-delay:${i*.05}s"><div class="vchk-ic">${c.s==='ok'?OB_ICONS.check:OB_ICONS.info}</div><div class="vchk-main"><div class="vchk-t">${c.t}</div><div class="vchk-m">${c.m}</div></div><span class="vchk-tag">${c.s==='ok'?'Pass':'Advisory'}</span></div>`).join('');
  return `<div class="vchk-list">${rows}</div>`;
}
function rptValRun(){ if(RPT.validating) return; RPT.validating=true; initSteps('val'); renderReport(); scheduleSteps(AGENT_RUN_MS); rptLog('agent','Validation Agent started','Running BEA edit checks'); setTimeout(()=>{ RPT.validating=false; RPT.valRun=true; rptLog('agent','Validation Agent finished','6 checks · 0 blocking · 1 advisory'); showToast('Edit checks passed'); renderReport(); }, AGENT_RUN_MS); }
function rptApproveValidation(){ RPT.valApproved=true; RPT.valDone=true; RPT.unlocked.review=true; rptLog('commit','You confirmed validation','0 blocking issues'); renderReport(); }

/* ---------- Review ---------- */
function rptToReview(){ RPT.formOpen=null; rptLog('human','You moved to Review & approve','Assembled forms ready'); rptGoto('review'); }
function reviewTab(){
  if(RPT.formOpen!=null) return reviewFormView(RPT.formOpen);
  const forms=reviewForms();
  const {total,done}=reviewCounts();
  const notFiling=RPT.entities.filter(e=>!isFiling(curForm(e)));
  const allDone=total>0&&done===total;
  let h=agentCard({icon:OB_ICONS.pkg2,name:'Filing Preparation',tag:'Review & approve',role:'Every filing form is assembled from accepted, sourced facts — never invented. Open each one, check the populated values, and mark it reviewed. Nothing files until you have.',body:`<div class="rv-prog"><div class="rv-prog-bar"><i style="width:${total?Math.round(done/total*100):0}%"></i></div><span class="rv-prog-t">${done} of ${total} forms reviewed</span></div>`+reviewList(forms)});
  if(notFiling.length){
    h+=`<div class="rv-claim">${OB_ICONS.info}<span><strong>${notFiling.length} not filing</strong> — ${notFiling.map(e=>e.name).join(', ')} file a Claim for Not Filing rather than a BE-11 form.</span></div>`;
  }
  if(allDone){
    h+=`<div class="confirm-bar"><div class="cb-ic">${OB_ICONS.arrow}</div><div class="cb-txt"><div class="cb-h">All forms reviewed — file the package next</div><div class="cb-m">Sign off and submit the ${total}-form ${OB_TYPES[RPT.type].code} package to the BEA.</div></div><button class="btn primary" onclick="rptToFile()">Continue to File</button></div>`;
  }
  return h;
}
function reviewList(forms){
  const rows=forms.map((x,i)=>{
    const rev=RPT.reviewed[x.e.name];
    const nm=x.e.name.replace(/'/g,"\\'");
    return `<button class="rv-row reveal" style="animation-delay:${i*.04}s" onclick="openRptForm('${nm}')">
      <span class="rv-code ${x.e.reporter?'a':''}">${x.f.code}</span>
      <span class="rv-main"><span class="rv-name">${x.e.name}</span><span class="rv-sub">${x.e.country} · ${x.e.reporter?'U.S. Reporter':(x.e.own+'% owned')}${x.e.newly?' · newly acquired':''}</span></span>
      <span class="rv-status ${rev?'done':''}">${rev?OB_ICONS.check+' Reviewed':'Review'}</span>
      <span class="rv-chev">${OB_ICONS.arrow}</span>
    </button>`;
  }).join('');
  return `<div class="rv-list">${rows}</div>`;
}
function reviewFormView(name){
  const x=reviewForms().find(y=>y.e.name===name); if(!x) return reviewTab();
  const rev=RPT.reviewed[name]; const nm=name.replace(/'/g,"\\'");
  const action=rev?`<span class="pill green">${OB_ICONS.check} Reviewed</span>`:`<button class="btn primary" onclick="rptMarkReviewed('${nm}')">${OB_ICONS.check} Mark reviewed</button>`;
  const bar=`<div class="fp-bar"><button class="ghost fp-back" onclick="closeRptForm()">${OB_ICONS.arrow} Back to forms</button><div class="fp-title">${x.e.name}<span class="fp-sub">${x.f.code} · part of ${rptName()}</span></div><div class="fp-sp"></div>${action}</div>`;
  return `<div class="fp-wrap">${bar}${be11FormHtml(null,x.f)}</div>`;
}
function scrollToSec(key){ requestAnimationFrame(()=>{ const s=document.getElementById('sec-'+key); if(s) s.scrollIntoView({block:'start'}); }); }
function openRptForm(name){ RPT.formOpen=name; rptLog('human','You opened '+name,'Reviewing '+(curFormByName(name)||'the form')); renderReport(); scrollToSec('review'); }
function curFormByName(name){ const e=RPT.entities.find(x=>x.name===name); return e?curForm(e):null; }
function closeRptForm(){ RPT.formOpen=null; renderReport(); scrollToSec('review'); }
function rptMarkReviewed(name){ RPT.reviewed[name]=true; RPT.formOpen=null; rptLog('commit','You reviewed '+name,'Form approved for filing'); showToast('Marked reviewed'); renderReport(); scrollToSec('review'); }

/* ---------- File ---------- */
function rptToFile(){ const {total,done}=reviewCounts(); if(total===0||done<total) return; RPT.reviewDone=true; RPT.unlocked.file=true; rptLog('human','You moved to File','Filing package ready for sign-off'); rptGoto('file'); }
function fileTab(){
  const {total}=reviewCounts(); const r=OB_TYPES[RPT.type]; const c=formCounts();
  if(RPT.filed){
    let h=rcpt('Filed with the BEA','Filing Preparation',`${total} forms · ${rptName()} ${chip('Confirmation '+RPT.confNo)}`);
    h+=`<div class="confirm-bar done"><div class="cb-ic">${OB_ICONS.check}</div><div class="cb-txt"><div class="cb-h">${r.code} filed successfully</div><div class="cb-m">Submitted ${RPT.filedAt} · confirmation ${RPT.confNo}. An acknowledgement was recorded to this report's activity.</div></div><button class="btn sec" onclick="showToast('Acknowledgement downloaded (demo)')">${OB_ICONS.upload} Acknowledgement</button></div>`;
    return h;
  }
  const pkg=`<div class="fpk">
    <div class="fpk-row"><span class="fpk-k">Report</span><span class="fpk-v">${rptName()}</span></div>
    <div class="fpk-row"><span class="fpk-k">Filing period</span><span class="fpk-v">${rptPeriod()}</span></div>
    <div class="fpk-row"><span class="fpk-k">Statutory due</span><span class="fpk-v">${rptDue()}</span></div>
    <div class="fpk-row"><span class="fpk-k">Forms in package</span><span class="fpk-v">${total} filing · ${c.notfiling} claims for not filing</span></div>
  </div>`;
  const sign=`<div class="sign ${RPT.signed?'on':''}"><button class="sign-check" onclick="rptSign()" ${RPT.signed?'disabled':''} aria-label="Authorize filing"><span class="sign-box">${RPT.signed?OB_ICONS.check:''}</span></button><div class="sign-txt"><div class="sign-h">Authorized sign-off</div><div class="sign-m">I, <strong>Julie Whitfield</strong> (Director, Regulatory Reporting), confirm these forms are accurate and authorize the ${r.code} filing.</div></div></div>`;
  const submit=RPT.signed
    ? `<button class="btn primary" onclick="rptFile()">${OB_ICONS.send} Submit to BEA</button><span class="agent-status">Ready to file</span>`
    : `<button class="btn primary" disabled title="Provide the authorized sign-off above to enable submission">${OB_ICONS.send} Submit to BEA</button><span class="agent-status">Sign off above to enable submission</span>`;
  return agentCard({icon:OB_ICONS.sign,name:'File to BEA',tag:'File',role:'The package is validated and every form reviewed. Provide the authorized sign-off, then submit to the BEA.',body:pkg+sign,cta:`<div class="agentc-cta">${submit}</div>`});
}
function rptSign(){ if(RPT.signed) return; RPT.signed=true; rptLog('human','You signed off the filing','Julie Whitfield · authorized'); renderReport(); }
function rptFile(){ if(!RPT.signed||RPT.filed) return; RPT.confNo='BEA-'+OB_TYPES[RPT.type].code.replace('-','')+'-'+Math.floor(100000+Math.random()*900000); RPT.filedAt=new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}); RPT.filed=true; RPT.fileDone=true; rptLog('commit','You filed the report',`${OB_TYPES[RPT.type].code} submitted · ${RPT.confNo}`); showToast('Filed — '+RPT.confNo); renderReport(); }

/* ================= STUBS ================= */
function stubTab(key){ const t=RP_TABS.find(x=>x.key===key); return `<div class="rp-stub">${OB_ICONS.info}<div class="rp-stub-h">${t.label} is up next</div><div class="rp-stub-m">This stage unlocks after Data collection. In this prototype the lifecycle is fleshed out through Setup, Planning, and Data collection.</div></div>`; }
function be577Stub(label){ return `<div class="rp-stub">${OB_ICONS.info}<div class="rp-stub-h">${label} — stubbed for BE-577</div><div class="rp-stub-m">BE-577's Setup is fully interactive. Its ${label} and later stages are stubbed in this prototype — the full lifecycle is demonstrated on BE-11.</div></div>`; }

/* =============================================================
   AI CHAT FAB — contextual conversation
=============================================================*/
let fabSeeded=false;
function toggleFab(){
  const open=document.body.classList.toggle('fab-open');
  if(open){
    if(!fabSeeded){ seedFab(); fabSeeded=true; }
    renderFabSuggests();
    setTimeout(()=>document.getElementById('fabInput')?.focus(),120);
  }
}
function closeFab(){ document.body.classList.remove('fab-open'); }
const HELP_LABEL={setup:'setup',scoping:'planning',mapping:'data collection',review:'review & approve',file:'filing'};
function openFabFor(key){
  if(RPT){ RPT.tab=key; markRailActive(key); }
  fabSeeded=true;
  const body=document.getElementById('fabBody'); if(body) body.innerHTML='';
  document.body.classList.add('fab-open');
  const lab=HELP_LABEL[key]||'this step';
  if(key==='setup'){
    const code=OB_TYPES[RPT.type].code;
    fabMsg('op',`Happy to help with <strong>setup</strong>. For a ${code} you'll want your current-year <strong>trial balance(s) with per-entity detail</strong> and last year's <strong>filed report</strong>. If exporting is a hassle, I can pull the trial balance straight from your ERP by query.${fabAction("closeFab();rptConnect()",OB_ICONS.src,'Connect a data source for me')}`);
  } else {
    fabMsg('op',`Happy to help with <strong>${lab}</strong>. Ask me anything about it, or pick a suggestion below — I'll show the evidence behind every answer.`);
  }
  renderFabSuggests(); updateFabCtx();
  setTimeout(()=>document.getElementById('fabInput')?.focus(),120);
}
function openFabSeeded(){
  fabSeeded=false;
  const body=document.getElementById('fabBody'); if(body) body.innerHTML='';
  if(!document.body.classList.contains('fab-open')){ toggleFab(); }
  else { seedFab(); fabSeeded=true; renderFabSuggests(); }
  updateFabCtx();
}
function inReport(){ return document.querySelector('.view.active')?.id==='view-report' && RPT; }
function fabCtxText(){
  if(inReport()){ return `${OB_TYPES[RPT.type].code} · ${rptTabLabel()}`; }
  return 'Operator workspace';
}
function updateFabCtx(){
  const el=document.getElementById('fabCtx'); if(el) el.textContent=fabCtxText();
  if(document.body.classList.contains('fab-open')) renderFabSuggests();
}
function seedFab(){
  const body=document.getElementById('fabBody'); if(!body) return;
  if(inReport() && RPT.conv && RPT.conv.length){
    RPT.conv.forEach(m=>fabMsg(m.who==='user'?'user':'op', m.text, m.ev));
    return;
  }
  fabMsg('op', `Hi Julie — I'm the Operator. Ask me anything about ${inReport()?OB_TYPES[RPT.type].code+' — '+rptTabLabel():'your workspace'}. I'll show the evidence behind every answer.`);
}
function fabAction(fn,icon,label){ return `<div class="fab-acts"><button class="fab-act" onclick="${fn.replace(/"/g,'&quot;')}">${icon||''}${label}</button></div>`; }
function fabMsg(who,text,ev){
  const body=document.getElementById('fabBody'); if(!body) return;
  const av = who==='user' ? OB_ICONS.human : OB_ICONS.setup;
  const evHtml = ev?`<div class="fm-ev">${OB_ICONS.check}${ev}</div>`:'';
  body.insertAdjacentHTML('beforeend', `<div class="fab-msg ${who==='user'?'user':''}"><div class="fm-av">${av}</div><div class="fm-bubble">${text}${evHtml}</div></div>`);
  body.scrollTop=body.scrollHeight;
}
function renderFabSuggests(){
  const el=document.getElementById('fabSuggests'); if(!el) return;
  const map={setup:['What source data do I need?','Why this due date?','What is a readiness target?'],scoping:['Why BE-11B vs BE-11D?','Explain the $60M test','Which entities file?'],mapping:['What are the open gaps?','What is a master field?','How do I close a gap?']};
  const chips = inReport() ? (map[RPT.tab]||['What happens next?','Explain this stage']) : ['What can I file right now?','How does the Operator work?','What are agents?'];
  el.innerHTML=chips.map(c=>`<button class="fab-chip" onclick="fabSend('${c.replace(/'/g,"\\'")}')">${c}</button>`).join('');
}
function fabReplyFor(q){
  const r = inReport() ? OB_TYPES[RPT.type] : null;
  const s=q.toLowerCase();
  if(r && (s.includes('source')||s.includes('upload')||s.includes('data'))) return {t:`For ${r.code} Setup you provide two things: the current-year <strong>trial balance</strong> (with per-entity detail) and last year's <strong>filed report</strong>. The scan agent reads both to build your entity list. I can also pull the trial balance straight from your ERP by query — no export needed.${fabAction("closeFab();rptConnect()",OB_ICONS.src,'Connect a data source for me')}`, ev:'BEA '+r.code+' setup inputs'};
  if(s.includes('due')&&r) return {t:`The statutory due date is <strong>${r.due}</strong> — ${r.dueReason}. Your <strong>readiness target</strong> is an internal date you set so the team finishes ahead of the deadline.`, ev:'BEA filing calendar'};
  if(s.includes('readiness')) return {t:`The <strong>readiness target</strong> is your internal deadline — defaulted about two weeks before the statutory due date to leave buffer for review and sign-off. It's never filed to BEA.`, ev:'Internal target'};
  if(s.includes('60')||s.includes('size test')||s.includes('threshold')) return {t:`BEA applies a <strong>$60M size test</strong> on the largest of total assets, sales, or absolute net income. Above it, majority-owned affiliates file a full <strong>BE-11B</strong>; newly acquired affiliates between <strong>$25M–$60M</strong> file the short <strong>BE-11D</strong>; minority affiliates file a <strong>Claim for Not Filing</strong>.`, ev:'BEA BE-11 filing rules'};
  if(s.includes('11d')||s.includes('11b')||s.includes(' vs ')) return {t:`<strong>BE-11B</strong> is the full form for majority-owned affiliates above $60M. <strong>BE-11D</strong> is a short form for <em>newly acquired</em> majority-owned affiliates whose largest figure lands between $25M and $60M — like Nordic Ventures AB this year.`, ev:'Per-entity reasoning shown in Planning'};
  if(s.includes('master field')) return {t:`A <strong>master field</strong> is one canonical concept (e.g. “Net income”) that many source columns map to. Map once to the master model and every BEA form that needs that value is filled consistently.`, ev:'Master field model'};
  if(s.includes('gap')) return {t:`A gap is a master field with no mapped source. Resolve it by <strong>adding a data source</strong>, <strong>asking an agent to find it</strong>, or <strong>assigning a collection agent</strong> to the owner. Any new source re-runs the mapping automatically.`, ev:'Data collection loop'};
  if(s.includes('entit')||s.includes('scope')||s.includes('which')) return {t:`Planning assigns each entity its BEA form from the rules, showing the figure that triggered the call. You can override any row — the minority affiliate Dutch Peak is flagged for your decision.`, ev:'Scope & Forms output'};
  if(s.includes('file right now')||s.includes('what can i file')) return {t:`Start a <strong>BE-11</strong> or <strong>BE-577</strong> from the Operator or the sidebar and I'll walk you through Setup, Planning and Data collection.`, ev:'Based on your workspace'};
  return {t:`In this ${r?r.code+' ':''}context I'd pull the relevant source data and BEA guidance, show the evidence, and wait for your approval before applying anything.`, ev:'Every answer is evidence-backed'};
}
function fabSend(preset){
  const inp=document.getElementById('fabInput');
  const txt=(preset || (inp?inp.value:'')||'').trim(); if(!txt) return;
  if(inp) inp.value='';
  fabMsg('user',txt);
  const body=document.getElementById('fabBody');
  body.insertAdjacentHTML('beforeend',`<div class="fab-msg fab-typing" id="fabTyping"><div class="fm-av">${OB_ICONS.setup}</div><div class="fm-bubble"><i></i><i></i><i></i></div></div>`);
  body.scrollTop=body.scrollHeight;
  setTimeout(()=>{
    document.getElementById('fabTyping')?.remove();
    const rep=fabReplyFor(txt);
    fabMsg('op',rep.t,rep.ev);
  }, FAB_TYPING_MS);
}



/* ---- expose read-only fixture data used by React + shadcn surfaces ---- */
Object.assign(window as any, { __OP_DATA: { REPORT_TYPES, OB_TYPES, get notifications(){ return notifications; }, get sessions(){ return sessions; } } });

/* ---- expose handlers used by inline onclick attributes ---- */
Object.assign(window as any, { actionsHTML, advance, agentCard, agentDispatchHtml, agentRowHtml, append, appendAgentDispatch, approveFromLedger, areaStats, attnItems, auditTrailBodyHtml, av, barClsForStatus, be11FormHtml, be577Stub, bindRptSpy, buildDocsTree, calShift, cbcrScopeTableHtml, chip, chooseAction, cite, cleanReply, clearSuggests, clearTyping, closeAllSessionMenus, closeDrawer, closeFab, closeModal, closeOpMore, closeRptForm, closeStartMenu, cmpReportsHtml, cmpYoYHtml, confirmUpload, createReport, ctaRun, curForm, curFormByName, daysLeftOf, daysToDue, defaultReadiness, deleteSession, detectReportType, disableTurn, docTitle, entityTable, escAttr, escapeHtml, evidenceBodyHtml, expandForms, exportBodyHtml, fChoice, fCount, fItem, fMoney, fPart, fSec, fText, fabAction, fabCtxText, fabMsg, fabReplyFor, fabSend, figLine, fileTab, filingCard, filingGroup, filingMetaLine, filingPhaseLabel, filterDocsNav, fmtDate, fmtReportDate, fmtRev, focusInput, formCounts, formsDoneTarget, gapCount, gapsPanel, genBe11Fin, genericFormHtml, go, goToNewSessionWithMessage, grpRow, hubFoundList, hubProbeBody, inReport, initSteps, isFiling, keyDatesCard, ledgerBodyHtml, listItemInfo, lrow, manualFallback, mapMetrics, mapTable, mappingTab, mappingTableHtml, markAllRead, markRailActive, masterFields, mdBlock, mdInline, missingFilingsUpload, moveOpLibInk, moveTabInk, newReportFormNote, newSession, notifClick, obNow, opAutoGrow, opKey, opLib, opLibRow, opMorphToFab, opSend, opStarter, opTurn, openAgentModal, openArtifact, openDoc, openDrawer, openFabFor, openFabSeeded, openFiling, openForm, openModal, openNewReportModal, openReport, openRptForm, openScheduleModal, openSessionById, openSkillModal, openUploadModal, operatorLaunch, ownTag, packageBodyHtml, pad2, paintSteps, parseList, phaseSpineHtml, pickMockFile, pickOther, pickStart, planApprovalCard, planApproveStatusText, planAreas, planAvs, planPeopleCard, planPeopleInner, planSummary, positionStartMenu, prevFilingName, rcpt, readinessBlockHtml, renderAgents, renderArt, renderArtForms, renderAttn, renderChatSession, renderConnectModal, renderDashboard, renderDoc, renderFabSuggests, renderFilings, renderHistorySession, renderHome, renderKpis, renderLink, renderMermaidBlocks, renderNotif, renderOpLib, renderOpPrompts, renderOpQuick, renderOperator, renderRecord, renderReport, renderSched, renderSections, renderSessionSuggests, renderSidebarSessions, renderSources, renderSpine, renderStartMenu, renderStep, renderTabs, renderUpcoming, renderWaitingBanner, resolveDocPath, reviewCounts, reviewFormView, reviewForms, reviewList, reviewTab, rosterChips, rptAcceptSetup, rptAddEntity, rptAddSource, rptApproveEntities, rptApproveScope, rptApproveValidation, rptAskAgent, rptAssignCollector, rptConfirmUpload, rptConnSel, rptConnect, rptConnectPick, rptDue, rptEditEntity, rptEnter, rptFile, rptFormData, rptGoTab, rptGoto, rptHubConfirm, rptHubScan, rptLog, rptManualUpload, rptMapRun, rptMarkReviewed, rptName, rptPeriod, rptRemapResolve, rptRemoveEntity, rptRescope, rptScan, rptScopeRun, rptScrollSpy, rptSetApproval, rptSetForm, rptSetProp, rptSetReadiness, rptSetupRun, rptSign, rptStage, rptTabLabel, rptToFile, rptToMapping, rptToReview, rptToScoping, rptToggleEditEntities, rptTogglePerson, rptTogglePlanEdit, rptUnstage, rptUpload, rptUploadFilings, rptValRun, rptValidate, scanOverlay, scheduleSteps, scopeSummary, scopeTable, scopeTableHtml, scopingTab, scrollDocAnchor, scrollThread, scrollToSec, scrow, seedFab, sendChat, sendReminder, sessionIndicator, sessionRow, setArt, setSessBarClean, setSessBarGeneric, setStarters, setupProgress, setupProposal, setupTab, shortMoney, showToast, showTyping, showWorkQueue, slugify, smartPrompt, smartSuggestChips, sortDocs, sourceDataStep, sourceRow, splitFrontmatter, splitRow, stageBody, stageDone, startClean, startFiling, startMenuMeta, starter, stepsPanelHtml, stubTab, suggestForm, sysTurn, thinkBodyHtml, thinkTitleHtml, toggleAgent, toggleAllForms, toggleArtForms, toggleBlockersOnly, toggleFab, toggleNotif, toggleOpMore, togglePin, toggleRecord, toggleSchedule, toggleSessionMenu, toggleSkill, toggleStartMenu, updateFabCtx, uploadBox, userSay, valChecks, valList, validateBlock, ymd });

let _legacyStarted = false;
export function initLegacy(){
  if (_legacyStarted) return;
  _legacyStarted = true;
if(typeof mermaid!=='undefined'){
  mermaid.initialize({ startOnLoad:false, theme:'neutral', securityLevel:'strict', fontFamily:'AdelleSans, "Helvetica Neue", Helvetica, Arial, sans-serif' });
}
document.body.classList.add('op-home');
renderStartMenu(); renderOperator(); renderAgents(); renderArt(); renderSched(); renderSidebarSessions(); renderNotif();
try{ const _q=new URLSearchParams(location.search); const _p=_q.get('ob'); if(_p && OB_TYPES[_p]) openReport(_p); const _v=_q.get('view'); if(_v && document.getElementById('view-'+_v)) go(_v); }catch(e){}
window.addEventListener('resize',()=>{ if(document.querySelector('.view.active')?.id==='view-home') moveOpLibInk(); if(inReport()) moveTabInk(); if(document.getElementById('startMenu')?.classList.contains('open')) positionStartMenu(); });
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeModal();closeDrawer();document.getElementById('notifPanel')?.classList.remove('open');closeAllSessionMenus();closeFab();}});
document.querySelector('.nav')?.addEventListener('scroll',closeAllSessionMenus);
window.addEventListener('resize',closeAllSessionMenus);
}
