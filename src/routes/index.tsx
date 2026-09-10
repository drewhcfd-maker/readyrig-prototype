import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Building2,
  Check,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  Clock3,
  FilePenLine,
  Flame,
  LayoutDashboard,
  MapPin,
  Plus,
  Radio,
  RotateCcw,
  Send,
  ShieldCheck,
  Truck,
  UserRoundCheck,
  UsersRound,
} from 'lucide-react'

export const Route = createFileRoute('/')({ component: ReadyRigApp })

type IncidentStatus = 'Awaiting Firefighter' | 'Awaiting Officer Review' | 'Returned for Correction' | 'Approved'
type Screen = 'dashboard' | 'report' | 'officer' | 'final'

type UnitResponse = {
  staffing: string
  personnel: string[]
  officer: string
}

type Report = {
  incidentNumber: string
  incidentType: string
  address: string
  city: string
  state: string
  zip: string
  date: string
  incidentStatus: 'Active' | 'Cancelled'
  assignedTime: string
  dispatchTime: string
  enRouteTime: string
  arrivalTime: string
  clearedSceneTime: string
  backInServiceTime: string
  cancelledTime: string
  commander: string
  mutualAid: string[]
  units: Record<string, UnitResponse>
  details: Record<string, string | string[]>
  otherText: Record<string, string>
  officer: string
  personnel: string[]
  narrative: string
  notes: string
  cad: {
    incidentCode: string
    description: string
    priority: string
    callTime: string
    location: string
    reportingMethod: string
    primaryDisposition: string
    beat: string
    zone: string
    respondingAgencies: string[]
    respondingUnits: string[]
  }
}

const incidentTypes = [
  'Structure Fire',
  'Vehicle Fire',
  'Medical / EMS',
  'Search and Rescue',
  'Brush / Wildland Fire',
  'Hazmat',
  'Public Assist',
  'Storm / Weather Related',
  'Other',
]

const unitNames = ['Engine 1', 'Tanker 1', 'Rescue 1', 'Brush 1', 'Boat 1', 'POV']
const personnelNames = ['Firefighter A', 'Firefighter B', 'Firefighter C', 'Firefighter D', 'Firefighter E', 'Firefighter F']
const officerNames = ['Officer A', 'Officer B', 'Officer C']
const mutualAidDepartments = ['Springdale Fire', 'Pleasure Heights Fire', 'Bentonville Fire', 'Rogers Fire', 'Other']
const steps = ['Overview', 'Units & Personnel', 'Incident', 'Narrative', 'Review']

const demoReport: Report = {
  incidentNumber: 'TEST-26-00124',
  incidentType: 'Structure Fire',
  address: '123 Main Street',
  city: 'Testville',
  state: 'OH',
  zip: '44000',
  date: '2026-09-10',
  incidentStatus: 'Active',
  assignedTime: '18:33',
  dispatchTime: '18:32',
  enRouteTime: '18:34',
  arrivalTime: '18:39',
  clearedSceneTime: '20:02',
  backInServiceTime: '20:06',
  cancelledTime: '',
  commander: 'Officer A',
  mutualAid: ['Pleasure Heights Fire'],
  units: {
    'Engine 1': { staffing: '3', personnel: ['Firefighter A', 'Firefighter B'], officer: 'Officer A' },
    'Tanker 1': { staffing: '2', personnel: ['Firefighter C'], officer: 'Officer B' },
  },
  details: {
    structureType: 'Single Family',
    occupancy: 'Residential',
    origin: 'Kitchen',
    involvement: 'Room and contents',
    actions: ['Fire Attack', 'Primary Search', 'Secondary Search', 'Ventilation', 'Overhaul', 'Water Supply'],
    conditions: ['Smoke', 'Visible Fire', 'Heavy Fire'],
  },
  otherText: {},
  officer: 'Officer A',
  personnel: ['Firefighter A', 'Firefighter B', 'Firefighter C'],
  narrative: 'Crews arrived to find light smoke showing from a two-story residential structure. Engine 1 established a water supply and advanced a handline to the first floor. The fire was located, contained, and extinguished. Primary and secondary searches were completed with no occupants found inside. Crews performed ventilation and overhaul before returning the property to the owner.',
  notes: '',
  cad: {
    incidentCode: '28A',
    description: 'Structure Fire Training Call',
    priority: '02',
    callTime: '09/10/26 18:32:15',
    location: '123 Main Street, Testville, OH 44000',
    reportingMethod: '911',
    primaryDisposition: 'Fire Extinguished / No Patient',
    beat: 'BENTON COUNTY SHERIFF',
    zone: 'East',
    respondingAgencies: ['Hickory Creek & Pleasure Heights Fire Department', 'Pleasure Heights Fire'],
    respondingUnits: ['Engine 1', 'Tanker 1'],
  },
}

const newReport: Report = {
  ...demoReport,
  incidentNumber: 'TEST-26-00125',
  incidentType: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  date: '',
  incidentStatus: 'Active',
  assignedTime: '',
  dispatchTime: '',
  enRouteTime: '',
  arrivalTime: '',
  clearedSceneTime: '',
  backInServiceTime: '',
  cancelledTime: '',
  commander: '',
  mutualAid: [],
  units: {},
  details: {},
  otherText: {},
  officer: '',
  personnel: [],
  narrative: '',
  notes: '',
  cad: {
    incidentCode: '—', description: 'Simulated CAD incident', priority: '—', callTime: '—', location: '—', reportingMethod: '—', primaryDisposition: 'Pending', beat: '—', zone: '—', respondingAgencies: [], respondingUnits: [],
  },
}

const mockIncidents = [
  { number: 'TEST-26-00123', type: 'Medical / EMS', address: '456 Oak Street', time: '16:14', status: 'Awaiting Officer Review' as IncidentStatus },
  { number: 'TEST-26-00122', type: 'Vehicle Fire', address: '88 Training Loop', time: '13:47', status: 'Approved' as IncidentStatus },
  { number: 'TEST-26-00121', type: 'Search and Rescue', address: '12 Mockingbird Court', time: '09:08', status: 'Approved' as IncidentStatus },
]

function ReadyRigApp() {
  const [screen, setScreen] = useState<Screen>('dashboard')
  const [step, setStep] = useState(0)
  const [report, setReport] = useState<Report>(demoReport)
  const [status, setStatus] = useState<IncidentStatus>('Awaiting Firefighter')
  const [returnReason, setReturnReason] = useState('')
  const [reviewReason, setReviewReason] = useState('Please add the area of origin.')
  const [showValidation, setShowValidation] = useState(false)

  useEffect(() => {
    const saved = window.localStorage.getItem('readyrig-prototype')
    if (!saved) return
    try {
      const parsed = JSON.parse(saved)
      setReport(parsed.report ?? demoReport)
      setStatus(parsed.status ?? 'Awaiting Firefighter')
      setReturnReason(parsed.returnReason ?? '')
    } catch {
      window.localStorage.removeItem('readyrig-prototype')
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem('readyrig-prototype', JSON.stringify({ report, status, returnReason }))
  }, [report, status, returnReason])

  const missing = useMemo(() => getMissingFields(report), [report])

  const openDemo = () => {
    setReport((current) => current.incidentNumber === demoReport.incidentNumber ? current : demoReport)
    setScreen('report'); setStep(0); setShowValidation(false); window.scrollTo(0, 0)
  }

  const startFresh = () => {
    setReport({ ...newReport, units: {}, details: {}, otherText: {}, personnel: [], mutualAid: [] })
    setStatus('Awaiting Firefighter'); setReturnReason(''); setScreen('report'); setStep(0); setShowValidation(false); window.scrollTo(0, 0)
  }

  const resetDemo = () => {
    setReport({ ...demoReport, units: { ...demoReport.units }, details: { ...demoReport.details }, otherText: {}, personnel: [...demoReport.personnel], mutualAid: [...demoReport.mutualAid] })
    setStatus('Awaiting Firefighter'); setReturnReason(''); setScreen('dashboard'); setStep(0); window.scrollTo(0, 0)
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => setScreen('dashboard')} aria-label="ReadyRig dashboard">
          <span className="brand-mark"><Flame size={19} /></span>
          <span><strong>Ready<span>Rig</span></strong><small>PREPARE · RESPOND · TOGETHER</small></span>
        </button>
        <div className="department-name">Hickory Creek &amp; Pleasure Heights Fire Department</div>
        <div className="topbar-user"><span className="notification-dot"><Radio size={15} /></span><span className="user-avatar">DF</span><span className="user-name">Drew Foster</span><ChevronDown size={16} /></div>
      </header>

      <nav className="app-nav" aria-label="Primary navigation">
        <NavItem icon={<LayoutDashboard />} label="Home" active={screen === 'dashboard'} onClick={() => setScreen('dashboard')} />
        <NavItem icon={<ClipboardCheck />} label="My Reports" active={screen === 'report'} onClick={() => setScreen('report')} />
        <NavItem icon={<Truck />} label="Apparatus" onClick={() => setScreen('report')} />
        <NavItem icon={<FilePenLine />} label="Maintenance" onClick={() => setScreen('report')} />
        <NavItem icon={<BadgeCheck />} label="Training" onClick={() => setScreen('final')} />
        <NavItem icon={<UsersRound />} label="Personnel" onClick={() => setScreen('officer')} />
        <NavItem icon={<Radio />} label="Incidents" active={screen === 'officer' || screen === 'final'} onClick={() => setScreen('officer')} />
        <div className="nav-spacer" />
        <div className="nav-department">HICKORY CREEK &amp;<br />PLEASURE HEIGHTS FD<span>Neighbors Helping Neighbors</span></div>
      </nav>

      <nav className="mobile-nav" aria-label="Mobile navigation">
        <NavItem icon={<LayoutDashboard />} label="Home" active={screen === 'dashboard'} onClick={() => setScreen('dashboard')} />
        <NavItem icon={<ClipboardCheck />} label="Reports" active={screen === 'report'} onClick={() => setScreen('report')} />
        <NavItem icon={<BadgeCheck />} label="Training" onClick={() => setScreen('final')} />
        <NavItem icon={<FilePenLine />} label="Maint." onClick={() => setScreen('report')} />
        <NavItem icon={<ChevronDown />} label="More" onClick={() => setScreen('officer')} />
      </nav>

      {screen !== 'dashboard' && <div className="context-bar">
        <button className="text-button" onClick={() => setScreen('dashboard')}><ArrowLeft size={18} /> Dashboard</button>
        <div className="incident-context"><strong>{report.incidentNumber}</strong><span>{report.incidentType || 'New Incident'}</span></div>
        <StatusBadge status={status} />
      </div>}

      <main>
        {screen === 'dashboard' && <Dashboard status={status} report={report} onOpen={openDemo} onNew={startFresh} onOfficer={() => setScreen('officer')} onFinal={() => setScreen('final')} />}
        {screen === 'report' && <ReportWorkflow report={report} setReport={setReport} step={step} setStep={setStep} status={status} missing={missing} showValidation={showValidation} setShowValidation={setShowValidation} returnReason={returnReason} onSubmit={() => { if (missing.length) { setShowValidation(true); return }; setStatus('Awaiting Officer Review'); setScreen('officer'); window.scrollTo(0, 0) }} />}
        {screen === 'officer' && <OfficerReview report={report} status={status} reviewReason={reviewReason} setReviewReason={setReviewReason} onEdit={() => { setScreen('report'); setStep(0) }} onReturn={() => { setStatus('Returned for Correction'); setReturnReason(reviewReason); setScreen('report'); setStep(2); window.scrollTo(0, 0) }} onApprove={() => { setStatus('Approved'); setScreen('final'); window.scrollTo(0, 0) }} />}
        {screen === 'final' && <FinalStatus report={report} onDashboard={() => setScreen('dashboard')} onReset={resetDemo} />}
      </main>
    </div>
  )
}

function NavItem({ icon, label, active = false, onClick }: { icon: React.ReactNode; label: string; active?: boolean; onClick: () => void }) {
  return <button className={`nav-item${active ? ' active' : ''}`} onClick={onClick}>{icon}<span>{label}</span></button>
}

function Dashboard({ status, report, onOpen, onNew, onOfficer, onFinal }: { status: IncidentStatus; report: Report; onOpen: () => void; onNew: () => void; onOfficer: () => void; onFinal: () => void }) {
  const reportAction = status === 'Awaiting Officer Review' ? onOfficer : status === 'Approved' ? onFinal : onOpen
  return <div className="dashboard page-frame">
    <section className="dashboard-heading"><div><p className="eyebrow">Thursday, September 10 · Shift A</p><h1>Incident dashboard</h1><p>Complete active reports and move them through officer approval.</p></div><button className="primary-button large" onClick={onNew}><Plus size={21} /> Start New Report</button></section>
    <section className="cad-card">
      <div className="cad-signal"><Radio size={21} /><span>CAD incident received</span><i /></div>
      <div className="cad-content"><div className="incident-number">TEST-26-00124</div><div><h2>Structure Fire</h2><p><MapPin size={17} /> 123 Main Street, Testville</p></div><div className="cad-time"><Clock3 size={18} /><strong>18:32</strong><small>Dispatch</small></div><button className="light-button" onClick={onOpen}>{status === 'Awaiting Firefighter' ? 'Create Report' : 'Open Report'} <ArrowRight size={18} /></button></div>
      <div className="integration-strip"><span>CentralSquare CAD</span><ArrowRight size={14} /><strong>ReadyRig RMS</strong><ArrowRight size={14} /><span>NERIS</span><em>Simulated workflow</em></div>
    </section>
    <section className="ops-stats">
      <StatCard icon={<Truck />} label="Total" value="0" note="Scheduled" />
      <StatCard icon={<CheckCircle2 />} label="Complete" value="0" note="On Track" tone="green" />
      <StatCard icon={<Clock3 />} label="Pending" value={status === 'Awaiting Firefighter' ? '1' : '0'} note="Need Attention" tone="amber" />
      <StatCard icon={<AlertTriangle />} label="Overdue" value="0" note="Past Due" tone="red" />
    </section>
    <section className="section-heading compact-dashboard-heading"><div><p className="eyebrow">Operations</p><h2>Recent Activity</h2></div><button className="text-button" onClick={onOpen}>View All <ArrowRight size={16} /></button></section>
    <section className="queue-grid">
      <QueueCard icon={<FilePenLine />} label="Needing Completion" count={status === 'Awaiting Firefighter' || status === 'Returned for Correction' ? 1 : 0} accent="amber">{(status === 'Awaiting Firefighter' || status === 'Returned for Correction') ? <IncidentRow incident={{ number: report.incidentNumber, type: report.incidentType || 'New Incident', address: report.address || 'No address', time: report.dispatchTime || '—', status }} onClick={reportAction} /> : <EmptyQueue text="No reports need completion" />}</QueueCard>
      <QueueCard icon={<UserRoundCheck />} label="Officer Review" count={(status === 'Awaiting Officer Review' ? 1 : 0) + 1} accent="blue">{status === 'Awaiting Officer Review' && <IncidentRow incident={{ number: report.incidentNumber, type: report.incidentType, address: report.address, time: report.dispatchTime, status }} onClick={onOfficer} />}<IncidentRow incident={mockIncidents[0]} onClick={onOfficer} /></QueueCard>
      <QueueCard icon={<BadgeCheck />} label="Recently Approved" count={(status === 'Approved' ? 1 : 0) + 2} accent="green">{status === 'Approved' && <IncidentRow incident={{ number: report.incidentNumber, type: report.incidentType, address: report.address, time: report.dispatchTime, status }} onClick={onFinal} />}{mockIncidents.slice(1).map((incident) => <IncidentRow key={incident.number} incident={incident} onClick={onFinal} />)}</QueueCard>
    </section>
  </div>
}

function StatCard({ icon, label, value, note, tone = '' }: { icon: React.ReactNode; label: string; value: string; note: string; tone?: string }) {
  return <article className={`stat-card ${tone}`}><div className="stat-label">{icon}<span>{label}</span></div><strong>{value}</strong><small>{note}</small></article>
}

function QueueCard({ icon, label, count, accent, children }: { icon: React.ReactNode; label: string; count: number; accent: string; children: React.ReactNode }) {
  return <div className={`queue-card ${accent}`}><div className="queue-title"><span>{icon}</span><h2>{label}</h2><b>{count}</b></div><div className="queue-list">{children}</div></div>
}

function IncidentRow({ incident, onClick }: { incident: { number: string; type: string; address: string; time: string; status: IncidentStatus }; onClick: () => void }) {
  return <button className="incident-row" onClick={onClick}><div><strong>{incident.number}</strong><h3>{incident.type}</h3><p>{incident.address}</p></div><div className="row-meta"><span>{incident.time}</span><StatusBadge status={incident.status} compact /><ChevronDown size={17} className="row-chevron" /></div></button>
}

function EmptyQueue({ text }: { text: string }) { return <div className="empty-queue"><CheckCircle2 size={20} /><span>{text}</span></div> }

function ReportWorkflow({ report, setReport, step, setStep, status, missing, showValidation, setShowValidation, returnReason, onSubmit }: { report: Report; setReport: React.Dispatch<React.SetStateAction<Report>>; step: number; setStep: (step: number) => void; status: IncidentStatus; missing: string[]; showValidation: boolean; setShowValidation: (value: boolean) => void; returnReason: string; onSubmit: () => void }) {
  const next = () => { setStep(Math.min(step + 1, 4)); window.scrollTo(0, 0) }
  const back = () => { setStep(Math.max(step - 1, 0)); window.scrollTo(0, 0) }
  return <div className="workflow page-frame">
    {status === 'Returned for Correction' && <div className="return-banner"><RotateCcw size={21} /><div><strong>Returned for correction</strong><span>Officer note: “{returnReason}”</span></div></div>}
    <StepIndicator current={step} setStep={setStep} />
    <div className="workflow-layout"><section className="form-card">
      <div className="section-heading"><span>Step {step + 1} of 5</span><h1>{steps[step]}</h1><p>{stepHelp[step]}</p></div>
      {step === 0 && <OverviewStep report={report} setReport={setReport} />}
      {step === 1 && <UnitsPersonnelStep report={report} setReport={setReport} />}
      {step === 2 && <IncidentDetailsStep report={report} setReport={setReport} />}
      {step === 3 && <NarrativeStep report={report} setReport={setReport} />}
      {step === 4 && <ReviewStep report={report} missing={missing} showValidation={showValidation} setStep={setStep} />}
    </section><aside className="next-panel"><span>Current report</span><strong>{report.incidentNumber || 'New report'}</strong><p>{report.incidentType || 'Select an incident type'}</p><div className="completion-meter"><i style={{ width: `${Math.max(8, Math.round(((5 - Math.min(missing.length, 5)) / 5) * 100))}%` }} /></div><small>{missing.length ? `${missing.length} required areas need attention` : 'Required information complete'}</small><hr /><b>What happens next?</b><p>{step === 4 ? 'Submit this report to the officer queue.' : `Complete ${steps[step]}, then continue to ${steps[step + 1]}.`}</p></aside></div>
    <div className="workflow-actions"><button className="secondary-button" onClick={back} disabled={step === 0}><ArrowLeft size={19} /> Back</button><span>Draft saved on this device</span>{step < 4 ? <button className="primary-button" onClick={next}>Continue <ArrowRight size={19} /></button> : <button className="primary-button" onClick={() => { setShowValidation(true); onSubmit() }}><Send size={18} /> Submit for Officer Review</button>}</div>
  </div>
}

const stepHelp = ['Confirm CAD information and the incident-level response timeline.', 'Select responding units and assign each firefighter to one unit.', 'Answer only the questions relevant to this incident type.', 'Document what crews found, did, and accomplished.', 'Check the complete report before officer submission.']

function StepIndicator({ current, setStep }: { current: number; setStep: (step: number) => void }) {
  return <nav className="stepper" aria-label="Report progress">{steps.map((label, index) => <button key={label} className={index === current ? 'active' : index < current ? 'complete' : ''} onClick={() => setStep(index)}><span>{index < current ? <Check size={16} /> : index + 1}</span><b>{label}</b></button>)}</nav>
}

function OverviewStep({ report, setReport }: StepProps) {
  const toggleAid = (department: string) => setReport((current) => ({ ...current, mutualAid: current.mutualAid.includes(department) ? current.mutualAid.filter((item) => item !== department) : [...current.mutualAid, department] }))
  return <div>
    <section className="cad-import-card"><div className="cad-import-heading"><div><span>Read-only · simulated</span><h2><Radio size={18} /> CAD Information</h2></div><em>Imported from CentralSquare</em></div><div className="cad-readonly-grid">
      <ReadOnly label="Incident Number" value={report.incidentNumber} /><ReadOnly label="CAD Incident Code / Description" value={`${report.cad.incidentCode} · ${report.cad.description}`} /><ReadOnly label="Priority" value={report.cad.priority} /><ReadOnly label="Call Time" value={report.cad.callTime} /><ReadOnly label="Location" value={report.cad.location} wide /><ReadOnly label="Reporting Method" value={report.cad.reportingMethod} /><ReadOnly label="Primary Disposition" value={report.cad.primaryDisposition} /><ReadOnly label="Beat" value={report.cad.beat} /><ReadOnly label="Zone" value={report.cad.zone} /><ReadOnly label="Responding Agencies" value={report.cad.respondingAgencies.join(', ') || '—'} wide /><ReadOnly label="Responding Units" value={report.cad.respondingUnits.join(', ') || '—'} wide />
    </div><p className="cad-note"><ShieldCheck size={16} /> CAD data is shown for context. Firefighters do not re-enter information CAD already knows.</p></section>
    <div className="field-grid">
      <Field label="Incident Type" required><select value={report.incidentType} onChange={(event) => setReport((current) => ({ ...current, incidentType: event.target.value, details: {}, otherText: {} }))}><option value="">Select type</option>{incidentTypes.map((type) => <option key={type}>{type}</option>)}</select></Field>
      <Field label="Incident Number"><input value={report.incidentNumber} onChange={(event) => setReport((current) => ({ ...current, incidentNumber: event.target.value }))} /></Field>
      <div className="field-divider"><MapPin size={18} /> Location</div>
      <Field label="Street Address" required wide><input value={report.address} onChange={(event) => setReport((current) => ({ ...current, address: event.target.value }))} /></Field>
      <Field label="City" required><input value={report.city} onChange={(event) => setReport((current) => ({ ...current, city: event.target.value }))} /></Field>
      <Field label="State" required><input maxLength={2} value={report.state} onChange={(event) => setReport((current) => ({ ...current, state: event.target.value.toUpperCase() }))} /></Field>
      <Field label="ZIP" required><input inputMode="numeric" value={report.zip} onChange={(event) => setReport((current) => ({ ...current, zip: event.target.value }))} /></Field>
      <div className="field-divider"><Clock3 size={18} /> Incident Timeline</div>
      <Field label="Date" required><input type="date" value={report.date} onChange={(event) => setReport((current) => ({ ...current, date: event.target.value }))} /></Field>
      <Field label="Assigned"><input type="time" value={report.assignedTime} onChange={(event) => setReport((current) => ({ ...current, assignedTime: event.target.value }))} /></Field>
      <Field label="Dispatch Time" required><input type="time" value={report.dispatchTime} onChange={(event) => setReport((current) => ({ ...current, dispatchTime: event.target.value }))} /></Field>
      <Field label="En Route Time" required><input type="time" value={report.enRouteTime} onChange={(event) => setReport((current) => ({ ...current, enRouteTime: event.target.value }))} /></Field>
      <Field label="Arrival Time" required><input type="time" value={report.arrivalTime} onChange={(event) => setReport((current) => ({ ...current, arrivalTime: event.target.value }))} /></Field>
      <Field label="Cleared Scene"><input type="time" value={report.clearedSceneTime} onChange={(event) => setReport((current) => ({ ...current, clearedSceneTime: event.target.value }))} /></Field>
      <Field label="Back in Service"><input type="time" value={report.backInServiceTime} onChange={(event) => setReport((current) => ({ ...current, backInServiceTime: event.target.value }))} /></Field>
      <Field label="Incident Status"><select value={report.incidentStatus} onChange={(event) => setReport((current) => ({ ...current, incidentStatus: event.target.value as Report['incidentStatus'], cancelledTime: event.target.value === 'Cancelled' ? current.cancelledTime : '' }))}><option>Active</option><option>Cancelled</option></select></Field>
      {report.incidentStatus === 'Cancelled' && <Field label="Cancelled Time" required><input type="time" value={report.cancelledTime} onChange={(event) => setReport((current) => ({ ...current, cancelledTime: event.target.value }))} /></Field>}
      <Field label="Incident Commander / OIC"><select value={report.commander} onChange={(event) => setReport((current) => ({ ...current, commander: event.target.value }))}><option value="">Select officer</option>{officerNames.map((name) => <option key={name}>{name}</option>)}</select></Field>
      <div className="field-divider"><UsersRound size={18} /> Auto Mutual Aid</div>
      <div className="mutual-aid-block"><p>Select any outside departments that responded. This is a multi-select list.</p><ChoiceGrid multi options={mutualAidDepartments} selected={report.mutualAid} onSelect={toggleAid} otherKey="mutualAid" otherText={report.otherText.mutualAid ?? ''} onOtherText={(value) => setReport((current) => ({ ...current, otherText: { ...current.otherText, mutualAid: value } }))} /></div>
    </div>
  </div>
}

function ReadOnly({ label, value, wide }: { label: string; value: string; wide?: boolean }) { return <div className={`readonly-field ${wide ? 'wide' : ''}`}><span>{label}</span><strong>{value || '—'}</strong></div> }

function UnitsPersonnelStep({ report, setReport }: StepProps) {
  const toggleUnit = (unit: string) => setReport((current) => {
    const units = { ...current.units }
    if (units[unit]) {
      delete units[unit]
      return { ...current, units }
    }
    units[unit] = { staffing: '1', personnel: [], officer: current.commander || '' }
    return { ...current, units }
  })

  const togglePerson = (name: string, unit: string) => setReport((current) => {
    const units = Object.fromEntries(Object.entries(current.units).map(([key, value]) => [key, { ...value, personnel: [...value.personnel.filter((person) => person !== name)] }]))
    const target = units[unit]
    if (!target) return current
    const alreadyAssigned = target.personnel.includes(name)
    target.personnel = alreadyAssigned ? target.personnel.filter((person) => person !== name) : [...target.personnel, name]
    const personnel = Object.values(units).flatMap((value) => value.personnel).filter((person, index, array) => array.indexOf(person) === index)
    return { ...current, units, personnel }
  })

  const assignedPeople = Object.values(report.units).flatMap((unit) => unit.personnel)
  return <div>
    <div className="dynamic-note"><Truck size={20} /><span>Choose a unit first. Each selected unit expands so you can assign its personnel.</span></div>
    <div className="unit-selector">{unitNames.map((unit) => <button type="button" key={unit} className={report.units[unit] ? 'selected' : ''} onClick={() => toggleUnit(unit)}><Truck size={23} /><span>{unit}</span><i>{report.units[unit] ? <Check size={16} /> : <Plus size={16} />}</i></button>)}</div>
    {!Object.keys(report.units).length && <div className="inline-callout"><Truck size={22} /><div><strong>Select responding units</strong><span>Units are normal records in this prototype, including POV.</span></div></div>}
    <div className="unit-details">{Object.entries(report.units).map(([unit, values]) => <UnitPersonnelCard key={unit} unit={unit} values={values} report={report} setReport={setReport} togglePerson={togglePerson} />)}</div>
    {!!assignedPeople.length && <div className="personnel-count-callout"><UsersRound size={18} /><span><strong>{assignedPeople.length}</strong> personnel assigned across {Object.keys(report.units).length} unit{Object.keys(report.units).length === 1 ? '' : 's'}.</span></div>}
  </div>
}

function UnitPersonnelCard({ unit, values, report, setReport, togglePerson }: { unit: string; values: UnitResponse; report: Report; setReport: React.Dispatch<React.SetStateAction<Report>>; togglePerson: (name: string, unit: string) => void }) {
  const setUnit = (field: keyof UnitResponse, value: string) => setReport((current) => ({ ...current, units: { ...current.units, [unit]: { ...current.units[unit], [field]: value } } }))
  const otherAssigned = Object.fromEntries(Object.entries(report.units).filter(([key]) => key !== unit).map(([key, value]) => [key, value.personnel]))
  return <details className="unit-card" open><summary><span><Truck size={20} /><strong>{unit}</strong></span><span className="unit-summary">{values.personnel.length} assigned · {values.staffing} staffing <ChevronDown size={18} /></span></summary><div className="unit-fields">
    <Field label="Staffing"><input type="number" min="1" max="12" value={values.staffing} onChange={(event) => setUnit('staffing', event.target.value)} /></Field>
    <Field label="Unit Officer"><select value={values.officer} onChange={(event) => setUnit('officer', event.target.value)}><option value="">Select officer</option>{officerNames.map((name) => <option key={name}>{name}</option>)}</select></Field>
    <div className="unit-personnel-block"><div className="unit-personnel-heading"><strong>Assign personnel</strong><span>{values.personnel.length} selected</span></div><div className="personnel-grid compact-grid">{personnelNames.map((name) => { const assignedElsewhere = Object.values(otherAssigned).some((people) => people.includes(name)); const active = values.personnel.includes(name); return <button type="button" key={name} className={`${active ? 'selected' : ''} ${assignedElsewhere ? 'disabled-choice' : ''}`} disabled={assignedElsewhere} onClick={() => togglePerson(name, unit)}><span className="avatar">{name.slice(-1)}</span><strong>{name}</strong><i>{active ? <Check size={17} /> : assignedElsewhere ? 'Assigned' : <Plus size={17} />}</i></button> })}</div></div>
  </div></details>
}

const detailSchemas: Record<string, { title: string; fields: DetailField[] }[]> = {
  'Structure Fire': [
    { title: 'Structure Information', fields: [
      { key: 'structureType', label: 'Structure Type', type: 'single', options: ['Single Family', 'Multi-Family', 'Commercial', 'Outbuilding', 'Other'], required: true },
      { key: 'occupancy', label: 'Occupancy / Use', type: 'text', placeholder: 'Residential, retail, storage…' },
      { key: 'origin', label: 'Area of Origin', type: 'text', placeholder: 'Kitchen, garage, attic…', required: true },
      { key: 'involvement', label: 'Fire Involvement', type: 'single', options: ['Room and contents', 'Floor involved', 'Multiple floors', 'Structure fully involved'], required: true },
    ]},
    { title: 'Operations', fields: [
      { key: 'actions', label: 'Actions Taken', type: 'multi', options: ['Fire Attack', 'Primary Search', 'Secondary Search', 'Ventilation', 'Overhaul', 'Salvage', 'Exposure Protection', 'Water Supply', 'Other'], required: true },
      { key: 'conditions', label: 'Fire Conditions', type: 'multi', options: ['Smoke', 'Visible Fire', 'Heavy Fire', 'Extension'] },
    ]},
  ],
  'Vehicle Fire': [{ title: 'Vehicle Fire', fields: [
    { key: 'vehicleType', label: 'Vehicle Type', type: 'single', options: ['Passenger Vehicle', 'Commercial Vehicle', 'Motorcycle', 'Recreational Vehicle', 'Boat', 'Other'], required: true },
    { key: 'vehicleArea', label: 'Primary Area Involved', type: 'single', options: ['Engine Compartment', 'Passenger Compartment', 'Cargo Area', 'Entire Vehicle', 'Other'], required: true },
    { key: 'vehicleActions', label: 'Actions Taken', type: 'multi', options: ['Fire Attack', 'Traffic Control', 'Hazard Mitigation', 'Overhaul', 'Water Supply', 'Other'], required: true },
    { key: 'vehicleDescription', label: 'Vehicle Description', type: 'vehicle' },
  ]}],
  'Medical / EMS': [{ title: 'Patient & Care', fields: [
    { key: 'patientCount', label: 'Patient Count', type: 'number', required: true },
    { key: 'patientOutcome', label: 'Patient Outcome', type: 'single', options: ['Transported', 'Refused Care', 'Treated / Released', 'Other'], required: true },
    { key: 'careActions', label: 'Care / Actions', type: 'multi', options: ['Assessment', 'CPR', 'Oxygen', 'Trauma', 'Lift Assist', 'Other'], required: true },
  ]}],
  'Search and Rescue': [{ title: 'Search and Rescue Operations', fields: [
    { key: 'rescueType', label: 'Rescue Type', type: 'single', options: ['Vehicle Extraction', 'Water Rescue', 'Rope Rescue', 'Confined Space', 'Elevator', 'Search', 'Other'], required: true },
    { key: 'victimCount', label: 'Number of People Rescued', type: 'number', required: true },
    { key: 'rescueActions', label: 'Actions Taken', type: 'multi', options: ['Stabilization', 'Extrication', 'Rope System', 'Water Entry', 'Patient Removal', 'Scene Safety', 'Other'], required: true },
  ]}],
  'Brush / Wildland Fire': [{ title: 'Wildland Conditions', fields: [
    { key: 'acres', label: 'Estimated Acres Burned', type: 'number', required: true },
    { key: 'fuelType', label: 'Primary Fuel Type', type: 'single', options: ['Grass', 'Brush', 'Timber', 'Mixed Vegetation', 'Other'], required: true },
    { key: 'spread', label: 'Fire Spread', type: 'single', options: ['Contained on arrival', 'Slow', 'Moderate', 'Rapid'], required: true },
    { key: 'wildlandActions', label: 'Actions Taken', type: 'multi', options: ['Fire Attack', 'Fire Line', 'Water Supply', 'Structure Protection', 'Mop Up', 'Other'], required: true },
  ]}],
  Hazmat: [{ title: 'Hazardous Materials', fields: [
    { key: 'material', label: 'Material / Product', type: 'text', placeholder: 'Known product or observed markings', required: true },
    { key: 'releaseType', label: 'Release Type', type: 'single', options: ['Spill', 'Leak', 'Vapor', 'Unknown / Investigation'], required: true },
    { key: 'hazmatActions', label: 'Actions Taken', type: 'multi', options: ['Isolated Area', 'Denied Entry', 'Contained Release', 'Decontamination', 'Monitoring', 'Evacuation', 'Gas Monitoring', 'Other'], required: true },
  ]}],
  'Public Assist': [{ title: 'Public Assistance', fields: [
    { key: 'publicAssistType', label: 'Assistance Type', type: 'single', options: ['Smoke Detector Installation', 'Resident Assistance', 'Community Service', 'Hazard Mitigation', 'Other'], required: true },
    { key: 'publicActions', label: 'Actions Taken', type: 'multi', options: ['Inspection', 'Installation', 'Education', 'Hazard Mitigation', 'Other'], required: true },
  ]}],
  'Storm / Weather Related': [{ title: 'Storm / Weather Incident', fields: [
    { key: 'stormType', label: 'Weather Event', type: 'single', options: ['Tree Down', 'Power Lines Down', 'Storm Damage', 'Tornado Damage', 'Flooding', 'Wind Damage', 'Other'], required: true },
    { key: 'stormActions', label: 'Actions Taken', type: 'multi', options: ['Area Secured', 'Traffic Control', 'Hazard Mitigation', 'Search', 'Water Removal', 'Other'], required: true },
  ]}],
  Other: [{ title: 'Incident Information', fields: [
    { key: 'otherDescription', label: 'Incident Description', type: 'text', placeholder: 'Briefly describe the incident', required: true },
    { key: 'otherActions', label: 'Actions Taken', type: 'multi', options: ['Investigation', 'Public Assist', 'Hazard Mitigation', 'Standby', 'Other'], required: true },
  ]}],
}

type DetailField = { key: string; label: string; type: 'single' | 'multi' | 'text' | 'number' | 'vehicle'; options?: string[]; placeholder?: string; required?: boolean }

type StepProps = { report: Report; setReport: React.Dispatch<React.SetStateAction<Report>> }

function IncidentDetailsStep({ report, setReport }: StepProps) {
  const schema = detailSchemas[report.incidentType]
  if (!schema) return <div className="type-empty"><Flame size={32} /><h2>Select an incident type first</h2><p>Relevant questions appear automatically after an incident type is selected in Overview.</p></div>
  const setDetail = (key: string, value: string | string[]) => setReport((current) => ({ ...current, details: { ...current.details, [key]: value } }))
  const setOtherText = (key: string, value: string) => setReport((current) => ({ ...current, otherText: { ...current.otherText, [key]: value } }))
  return <div className="dynamic-form"><div className="dynamic-note"><ShieldCheck size={20} /><span>Showing questions for <strong>{report.incidentType}</strong>. Select <strong>Other</strong> anywhere it applies to reveal a free-text field.</span></div>{schema.map((section) => <section key={section.title} className="detail-section"><h2>{section.title}</h2>{section.fields.map((field) => <div key={field.key} className="detail-field">
    <label>{field.label}{field.required && <sup>*</sup>}</label>
    {field.type === 'text' && <input value={(report.details[field.key] as string) ?? ''} placeholder={field.placeholder} onChange={(event) => setDetail(field.key, event.target.value)} />}
    {field.type === 'number' && <input type="number" min="0" value={(report.details[field.key] as string) ?? ''} onChange={(event) => setDetail(field.key, event.target.value)} />}
    {field.type === 'vehicle' && <div className="vehicle-description-grid"><Field label="Description"><input value={(report.details.vehicleDescription as string) ?? ''} placeholder="Body style or distinguishing details" onChange={(event) => setDetail('vehicleDescription', event.target.value)} /></Field><Field label="Color"><input value={(report.details.vehicleColor as string) ?? ''} onChange={(event) => setDetail('vehicleColor', event.target.value)} /></Field><Field label="Make"><input value={(report.details.vehicleMake as string) ?? ''} onChange={(event) => setDetail('vehicleMake', event.target.value)} /></Field><Field label="Model"><input value={(report.details.vehicleModel as string) ?? ''} onChange={(event) => setDetail('vehicleModel', event.target.value)} /></Field><Field label="License Plate"><input value={(report.details.vehiclePlate as string) ?? ''} onChange={(event) => setDetail('vehiclePlate', event.target.value)} /></Field></div>}
    {field.type === 'single' && <ChoiceGrid options={field.options ?? []} selected={(report.details[field.key] as string) ?? ''} onSelect={(value) => setDetail(field.key, value)} otherKey={field.key} otherText={report.otherText[field.key] ?? ''} onOtherText={(value) => setOtherText(field.key, value)} />}
    {field.type === 'multi' && <ChoiceGrid multi options={field.options ?? []} selected={(report.details[field.key] as string[]) ?? []} onSelect={(value) => { const selected = (report.details[field.key] as string[]) ?? []; setDetail(field.key, selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value]) }} otherKey={field.key} otherText={report.otherText[field.key] ?? ''} onOtherText={(value) => setOtherText(field.key, value)} />}
  </div>)}</section>)}</div>
}

function ChoiceGrid({ options, selected, onSelect, multi = false, otherKey, otherText, onOtherText }: { options: string[]; selected: string | string[]; onSelect: (value: string) => void; multi?: boolean; otherKey?: string; otherText?: string; onOtherText?: (value: string) => void }) {
  const otherSelected = Array.isArray(selected) ? selected.includes('Other') : selected === 'Other'
  return <div className="choice-grid-wrap"><div className="choice-grid">{options.map((option) => { const active = Array.isArray(selected) ? selected.includes(option) : selected === option; return <button type="button" key={option} className={active ? 'selected' : ''} onClick={() => onSelect(option)}><span>{active ? <Check size={15} /> : multi ? <Plus size={15} /> : null}</span>{option}</button> })}</div>{otherSelected && otherKey && <div className="other-inline"><label><span>Other — please specify</span><input autoFocus value={otherText ?? ''} onChange={(event) => onOtherText?.(event.target.value)} placeholder="Enter details…" /></label></div>}</div>
}

function NarrativeStep({ report, setReport }: StepProps) { return <div className="narrative-fields"><Field label="Incident Narrative" required><textarea rows={12} placeholder="Describe what crews found, actions taken, and outcome." value={report.narrative} onChange={(event) => setReport((current) => ({ ...current, narrative: event.target.value }))} /><small>{report.narrative.length} characters</small></Field><Field label="Additional Notes"><textarea rows={5} placeholder="Optional internal notes or follow-up information." value={report.notes} onChange={(event) => setReport((current) => ({ ...current, notes: event.target.value }))} /></Field></div> }

function ReviewStep({ report, missing, showValidation, setStep }: { report: Report; missing: string[]; showValidation: boolean; setStep: (step: number) => void }) {
  return <div className="review-content">{missing.length ? <div className={`validation-summary ${showValidation ? 'emphasis' : ''}`}><AlertTriangle size={23} /><div><strong>{missing.length} {missing.length === 1 ? 'item needs' : 'items need'} attention</strong><p>{missing.join(' · ')}</p></div><button onClick={() => setStep(missing[0].includes('unit') ? 1 : missing[0].includes('detail') ? 2 : missing[0].includes('narrative') ? 3 : 0)}>Review Missing Information</button></div> : <div className="ready-summary"><CheckCircle2 size={24} /><div><strong>Ready for officer review</strong><span>All required information is complete.</span></div></div>}<ReportSummary report={report} editable setStep={setStep} /></div>
}

function ReportSummary({ report, editable = false, setStep }: { report: Report; editable?: boolean; setStep?: (step: number) => void }) {
  const detailValues = Object.entries(report.details).filter(([key]) => !['vehicleDescription', 'vehicleColor', 'vehicleMake', 'vehicleModel', 'vehiclePlate'].includes(key))
  const vehicleSummary: string[][] = report.incidentType === 'Vehicle Fire' ? [['Vehicle Description', [report.details.vehicleDescription, report.details.vehicleColor, report.details.vehicleMake, report.details.vehicleModel, report.details.vehiclePlate].filter(Boolean).join(' · ')]] : []
  const timelineItems: string[][] = [["Incident Number", report.incidentNumber], ["Incident Type", report.incidentType], ["Location", `${report.address}, ${report.city}, ${report.state} ${report.zip}`], ["Date", formatDate(report.date)], ["Assigned", report.assignedTime], ["Dispatch Time", report.dispatchTime], ["En Route Time", report.enRouteTime], ["Arrival Time", report.arrivalTime], ["Cleared Scene", report.clearedSceneTime], ["Back in Service", report.backInServiceTime], ["Cancelled Time", report.cancelledTime], ["Incident Commander / OIC", report.commander], ["Auto Mutual Aid", report.mutualAid.join(', ')]]
  return <div className="summary-stack">
    <SummarySection title="CAD Information" icon={<Radio />}><SummaryGrid items={[["Incident Code", `${report.cad.incidentCode} · ${report.cad.description}`], ["Priority", report.cad.priority], ["Call Time", report.cad.callTime], ["Reporting Method", report.cad.reportingMethod], ["Primary Disposition", report.cad.primaryDisposition], ["Responding Agencies", report.cad.respondingAgencies.join(', ')], ["Responding Units", report.cad.respondingUnits.join(', ')]]} /></SummarySection>
    <SummarySection title="Incident & Timeline" icon={<Building2 />} onEdit={editable ? () => setStep?.(0) : undefined}><SummaryGrid items={timelineItems.filter(([, value]) => value !== "")} /></SummarySection>
    <SummarySection title="Units & Personnel" icon={<Truck />} onEdit={editable ? () => setStep?.(1) : undefined}>{Object.entries(report.units).length ? <div className="response-summary">{Object.entries(report.units).map(([unit, values]) => <div key={unit}><strong>{unit}</strong><span>Staffing {values.staffing}</span><span>Officer {values.officer || '—'}</span><span>{values.personnel.join(', ') || 'No personnel assigned'}</span></div>)}</div> : <p className="missing-copy">No units selected</p>}</SummarySection>
    <SummarySection title="Incident Details" icon={<ClipboardCheck />} onEdit={editable ? () => setStep?.(2) : undefined}>{detailValues.length || vehicleSummary.length ? <SummaryGrid items={[...detailValues.map(([key, value]) => [humanize(key), Array.isArray(value) ? value.join(', ') : value as string] as string[]), ...vehicleSummary as string[][]]} /> : <p className="missing-copy">No incident details entered</p>}</SummarySection>
    <SummarySection title="Narrative" icon={<FilePenLine />} onEdit={editable ? () => setStep?.(3) : undefined}><p className="narrative-review">{report.narrative || 'No narrative entered'}</p>{report.notes && <><h4>Additional Notes</h4><p className="narrative-review">{report.notes}</p></>}</SummarySection>
  </div>
}

function SummarySection({ title, icon, onEdit, children }: { title: string; icon: React.ReactNode; onEdit?: () => void; children: React.ReactNode }) { return <section className="summary-section"><header><div>{icon}<h3>{title}</h3></div>{onEdit && <button onClick={onEdit}>Edit</button>}</header><div className="summary-body">{children}</div></section> }
function SummaryGrid({ items }: { items: string[][] }) { return <dl className="summary-grid">{items.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value || '—'}</dd></div>)}</dl> }

function OfficerReview({ report, status, reviewReason, setReviewReason, onEdit, onReturn, onApprove }: { report: Report; status: IncidentStatus; reviewReason: string; setReviewReason: (value: string) => void; onEdit: () => void; onReturn: () => void; onApprove: () => void }) {
  return <div className="officer-page page-frame"><section className="officer-heading"><div className="officer-icon"><ShieldCheck /></div><div><p className="eyebrow">Officer Review Queue</p><h1>{report.incidentNumber}</h1><p>{report.incidentType} · {report.address}, {report.city}</p></div><StatusBadge status={status} /></section>{status !== 'Awaiting Officer Review' && <div className="inline-callout"><AlertTriangle size={22} /><div><strong>Demo review mode</strong><span>This mock report is shown to demonstrate the officer experience.</span></div></div>}<div className="officer-layout"><div><ReportSummary report={report} /></div><aside className="review-controls"><span>Officer action</span><h2>Review complete?</h2><p>Approve the report or return it with a clear correction request.</p><label>Reason for return<textarea rows={4} value={reviewReason} onChange={(event) => setReviewReason(event.target.value)} /></label><button className="return-button" onClick={onReturn} disabled={!reviewReason.trim()}><RotateCcw size={19} /> Return to Firefighter</button><button className="approve-button" onClick={onApprove}><BadgeCheck size={20} /> Approve Report</button><button className="text-button centered" onClick={onEdit}>Open firefighter report</button></aside></div></div>
}

function FinalStatus({ report, onDashboard, onReset }: { report: Report; onDashboard: () => void; onReset: () => void }) { return <div className="final-page page-frame"><section className="approval-hero"><div className="approval-seal"><Check size={38} /></div><p className="eyebrow">Workflow Complete</p><h1>Report Approved</h1><h2>ReadyRig Report Complete</h2><p>{report.incidentNumber} · {report.incidentType} · {report.address}</p></section><section className="neris-card"><div className="neris-heading"><div><span>Future integration</span><h2>NERIS Submission</h2></div><span className="ready-pill"><CircleDotFallback /> Ready for NERIS Submission</span></div><div className="pipeline"><div className="done"><CheckCircle2 /><strong>CAD Received</strong><small>{report.dispatchTime || '—'}</small></div><i /><div className="done"><CheckCircle2 /><strong>ReadyRig Complete</strong><small>Officer approved</small></div><i /><div className="future"><Send /><strong>NERIS</strong><small>Future connection</small></div></div><div className="prototype-warning"><AlertTriangle size={19} /><strong>Prototype — No external submission occurred.</strong><span>This screen only demonstrates where future NERIS integration belongs in the workflow.</span></div></section><div className="final-actions"><button className="secondary-button" onClick={onDashboard}><LayoutDashboard size={19} /> Return to Dashboard</button><button className="text-button" onClick={onReset}><RotateCcw size={17} /> Reset Demo Scenario</button></div></div> }

function CircleDotFallback() { return <span className="status-dot" aria-hidden="true" /> }
function Field({ label, required, wide, children }: { label: string; required?: boolean; wide?: boolean; children: React.ReactNode }) { return <label className={`field ${wide ? 'wide' : ''}`}><span>{label}{required && <sup>*</sup>}</span>{children}</label> }
function StatusBadge({ status, compact = false }: { status: IncidentStatus; compact?: boolean }) { return <span className={`status-badge status-${status.toLowerCase().replaceAll(' ', '-')} ${compact ? 'compact' : ''}`}>{status === 'Approved' && <Check size={13} />}{status === 'Returned for Correction' && <RotateCcw size={13} />}{status}</span> }

function getMissingFields(report: Report) {
  const missing: string[] = []
  if (!report.incidentNumber || !report.incidentType || !report.address || !report.city || !report.state || !report.zip || !report.date || !report.dispatchTime || !report.enRouteTime || !report.arrivalTime) missing.push('Incident overview')
  if (report.incidentStatus === 'Cancelled' && !report.cancelledTime) missing.push('Cancelled time')
  if (!Object.keys(report.units).length || Object.values(report.units).some((unit) => !unit.officer)) missing.push('Units & personnel')
  const requiredDetails = (detailSchemas[report.incidentType] ?? []).flatMap((section) => section.fields.filter((field) => field.required))
  const missingDetail = requiredDetails.some((field) => {
    const value = report.details[field.key]
    if (!value || (Array.isArray(value) && !value.length)) return true
    if (Array.isArray(value) && value.includes('Other') && !report.otherText[field.key]?.trim()) return true
    if (value === 'Other' && !report.otherText[field.key]?.trim()) return true
    return false
  })
  if (!report.incidentType || !requiredDetails.length || missingDetail) missing.push('Required incident details')
  if (!report.personnel.length) missing.push('Personnel assignment')
  if (report.narrative.trim().length < 30) missing.push('Incident narrative')
  return missing
}

function humanize(value: string) { return value.replace(/([A-Z])/g, ' $1').replace(/^./, (letter) => letter.toUpperCase()) }
function formatDate(value: string) { if (!value) return '—'; return new Date(`${value}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }
