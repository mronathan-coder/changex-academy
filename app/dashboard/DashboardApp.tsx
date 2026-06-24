'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Role = 'admin' | 'leader' | 'member'
type GoalStatus = 'green' | 'amber' | 'red'
type ViewType = 'dashboard' | 'goals' | 'disciplines' | 'actions' | 'log' | 'admin'
type ModalType = 'goal' | 'discipline' | 'action' | 'editGoal' | 'editDisc' | 'editAction' | null

interface Profile { id: string; name: string; email: string; role: Role; approved: boolean; created_at: string }
interface TeamConfig { id: string; name: string; leader: string; period: string; aim: string }
interface Goal { id: string; goal: string; kpi: string | null; baseline: number | null; target: number | null; current_value: number | null; comment: string | null; manual_status: string | null; approved: boolean; submitted_by: string | null; submitted_at: string }
interface Discipline { id: string; discipline: string; evidence: string | null; owner: string | null; status: GoalStatus; attention: string | null; approved: boolean; submitted_by: string | null; submitted_at: string }
interface Action { id: string; commitment: string; type: string | null; owner: string | null; due_date: string | null; status: 'not started' | 'in progress' | 'complete'; note: string | null; approved: boolean; submitted_by: string | null; submitted_at: string }
interface LogEntry { id: string; action: string; user_name: string; color: string; created_at: string }

interface Props {
  profile: Profile
  initialGoals: Goal[]
  initialDisciplines: Discipline[]
  initialActions: Action[]
  initialConfig: TeamConfig
  initialLog: LogEntry[]
  initialAllProfiles: Profile[]
}

function calcStatus(b: number | null, t: number | null, c: number | null): GoalStatus {
  if (b === null || t === null || c === null) return 'amber'
  const range = Math.abs(t - b)
  if (range === 0) return 'green'
  const prog = t > b ? (c - b) / range : (b - c) / (b - t)
  return prog >= 1 ? 'green' : prog >= 0.6 ? 'amber' : 'red'
}

function calcPct(b: number | null, t: number | null, c: number | null): number {
  if (b === null || t === null || c === null || t === b) return 0
  const prog = t > b ? (c - b) / (t - b) : (b - c) / (b - t)
  return Math.min(100, Math.max(0, Math.round(prog * 100)))
}

function Pill({ status }: { status: string }) {
  const map: Record<string, { cls: string; lbl: string }> = {
    green:         { cls: 'pill green',      lbl: '● Green' },
    amber:         { cls: 'pill amber',      lbl: '● Amber' },
    red:           { cls: 'pill red',        lbl: '● Red' },
    complete:      { cls: 'pill complete',   lbl: 'Complete' },
    'in progress': { cls: 'pill progress',  lbl: 'In Progress' },
    'not started': { cls: 'pill notstarted',lbl: 'Not Started' },
    pending:       { cls: 'pill pending',    lbl: 'Pending' },
  }
  const { cls, lbl } = map[status?.toLowerCase()] ?? { cls: 'pill notstarted', lbl: status }
  return <span className={cls}>{lbl}</span>
}

function ProgBar({ pct, status }: { pct: number; status: GoalStatus }) {
  return (
    <div className="prog-wrap">
      <div className="prog-bar"><div className={`prog-fill ${status}`} style={{ width: `${pct}%` }} /></div>
      <span className="prog-pct">{pct}%</span>
    </div>
  )
}

export default function DashboardApp({ profile, initialGoals, initialDisciplines, initialActions, initialConfig, initialLog, initialAllProfiles }: Props) {
  const router = useRouter()
  const supabase = createClient()

  const [goals, setGoals] = useState<Goal[]>(initialGoals)
  const [disciplines, setDisciplines] = useState<Discipline[]>(initialDisciplines)
  const [actions, setActions] = useState<Action[]>(initialActions)
  const [config, setConfig] = useState<TeamConfig>(initialConfig)
  const [log, setLog] = useState<LogEntry[]>(initialLog)
  const [allProfiles, setAllProfiles] = useState<Profile[]>(initialAllProfiles)

  const [view, setView] = useState<ViewType>('dashboard')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [modalType, setModalType] = useState<ModalType>(null)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [notif, setNotif] = useState<{ msg: string; type: string } | null>(null)
  const notifTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const canApprove = profile.role === 'admin' || profile.role === 'leader'

  // Real-time subscriptions
  useEffect(() => {
    const channel = supabase
      .channel('dashboard-rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'goals' }, (p) => {
        if (p.eventType === 'INSERT') setGoals(prev => [p.new as Goal, ...prev])
        else if (p.eventType === 'UPDATE') setGoals(prev => prev.map(g => g.id === (p.new as Goal).id ? p.new as Goal : g))
        else if (p.eventType === 'DELETE') setGoals(prev => prev.filter(g => g.id !== (p.old as { id: string }).id))
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'disciplines' }, (p) => {
        if (p.eventType === 'INSERT') setDisciplines(prev => [p.new as Discipline, ...prev])
        else if (p.eventType === 'UPDATE') setDisciplines(prev => prev.map(d => d.id === (p.new as Discipline).id ? p.new as Discipline : d))
        else if (p.eventType === 'DELETE') setDisciplines(prev => prev.filter(d => d.id !== (p.old as { id: string }).id))
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'actions' }, (p) => {
        if (p.eventType === 'INSERT') setActions(prev => [p.new as Action, ...prev])
        else if (p.eventType === 'UPDATE') setActions(prev => prev.map(a => a.id === (p.new as Action).id ? p.new as Action : a))
        else if (p.eventType === 'DELETE') setActions(prev => prev.filter(a => a.id !== (p.old as { id: string }).id))
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'activity_log' }, (p) => {
        setLog(prev => [p.new as LogEntry, ...prev.slice(0, 99)])
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
        if (canApprove) supabase.from('profiles').select('*').order('created_at').then(({ data }) => { if (data) setAllProfiles(data) })
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'team_config' }, (p) => {
        setConfig(p.new as TeamConfig)
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function showNotif(msg: string, type: 'green' | 'red' = 'green') {
    setNotif({ msg, type })
    if (notifTimer.current) clearTimeout(notifTimer.current)
    notifTimer.current = setTimeout(() => setNotif(null), 3500)
  }

  async function addLog(action: string, color = 'blue') {
    await supabase.from('activity_log').insert({ action, user_name: profile.name, color })
  }

  async function doLogout() {
    await supabase.auth.signOut()
    router.push('/dashboard/login')
    router.refresh()
  }

  function setF(k: string, v: string) { setForm(prev => ({ ...prev, [k]: v })) }

  function openModal(type: ModalType, id?: string) {
    const g = id ? goals.find(x => x.id === id) : undefined
    const d = id ? disciplines.find(x => x.id === id) : undefined
    const a = id ? actions.find(x => x.id === id) : undefined
    const defaults: Record<string, Record<string, string>> = {
      goal:       { goal: '', kpi: '', baseline: '', target: '', current: '', comment: '' },
      discipline: { discipline: '', evidence: '', owner: '', status: 'green', attention: '' },
      action:     { commitment: '', type: 'Working Rhythm', owner: '', due_date: '', status: 'not started', note: '' },
      editGoal:   { goal: g?.goal ?? '', kpi: g?.kpi ?? '', baseline: String(g?.baseline ?? ''), target: String(g?.target ?? ''), current: String(g?.current_value ?? ''), comment: g?.comment ?? '' },
      editDisc:   { discipline: d?.discipline ?? '', evidence: d?.evidence ?? '', owner: d?.owner ?? '', status: d?.status ?? 'green', attention: d?.attention ?? '' },
      editAction: { commitment: a?.commitment ?? '', type: a?.type ?? 'Working Rhythm', owner: a?.owner ?? '', due_date: a?.due_date ?? '', status: a?.status ?? 'not started', note: a?.note ?? '' },
    }
    setForm(type ? defaults[type] : {})
    setEditId(id ?? null)
    setModalType(type)
  }

  function closeModal() { setModalType(null); setEditId(null) }

  // Goal handlers
  async function submitGoal() {
    if (!form.goal?.trim()) { showNotif('Please enter a goal name.', 'red'); return }
    setSubmitting(true)
    const { error } = await supabase.from('goals').insert({ goal: form.goal.trim(), kpi: form.kpi || null, baseline: form.baseline !== '' ? Number(form.baseline) : null, target: form.target !== '' ? Number(form.target) : null, current_value: form.current !== '' ? Number(form.current) : null, comment: form.comment || null, approved: canApprove, submitted_by: profile.id })
    if (error) showNotif('Error saving goal.', 'red')
    else { await addLog(canApprove ? `Added goal: "${form.goal}"` : `Submitted for approval: "${form.goal}"`, 'green'); showNotif(canApprove ? 'Goal added!' : 'Submitted for approval.'); closeModal() }
    setSubmitting(false)
  }
  async function saveEditGoal() {
    if (!editId) return
    setSubmitting(true)
    const { error } = await supabase.from('goals').update({ goal: form.goal, kpi: form.kpi || null, baseline: form.baseline !== '' ? Number(form.baseline) : null, target: form.target !== '' ? Number(form.target) : null, current_value: form.current !== '' ? Number(form.current) : null, comment: form.comment || null }).eq('id', editId)
    if (error) showNotif('Error updating goal.', 'red')
    else { await addLog(`Updated goal: "${form.goal}"`); showNotif('Goal updated!'); closeModal() }
    setSubmitting(false)
  }
  async function deleteGoal(id: string) { const g = goals.find(x => x.id === id); await supabase.from('goals').delete().eq('id', id); await addLog(`Deleted goal: "${g?.goal}"`, 'red'); showNotif('Deleted.') }
  async function approveGoal(id: string) { const g = goals.find(x => x.id === id); await supabase.from('goals').update({ approved: true }).eq('id', id); await addLog(`Approved goal: "${g?.goal}"`, 'green'); showNotif('Approved!') }
  async function rejectGoal(id: string) { const g = goals.find(x => x.id === id); await supabase.from('goals').delete().eq('id', id); await addLog(`Rejected goal: "${g?.goal}"`, 'red'); showNotif('Rejected.') }

  // Discipline handlers
  async function submitDisc() {
    if (!form.discipline?.trim()) { showNotif('Please enter a discipline.', 'red'); return }
    setSubmitting(true)
    const { error } = await supabase.from('disciplines').insert({ discipline: form.discipline.trim(), evidence: form.evidence || null, owner: form.owner || null, status: form.status as GoalStatus, attention: form.attention || null, approved: canApprove, submitted_by: profile.id })
    if (error) showNotif('Error saving discipline.', 'red')
    else { await addLog(canApprove ? `Added discipline: "${form.discipline}"` : `Submitted for approval: "${form.discipline}"`, 'green'); showNotif(canApprove ? 'Discipline added!' : 'Submitted for approval.'); closeModal() }
    setSubmitting(false)
  }
  async function saveEditDisc() {
    if (!editId) return
    setSubmitting(true)
    const { error } = await supabase.from('disciplines').update({ discipline: form.discipline, evidence: form.evidence || null, owner: form.owner || null, status: form.status as GoalStatus, attention: form.attention || null }).eq('id', editId)
    if (error) showNotif('Error updating.', 'red')
    else { await addLog(`Updated discipline: "${form.discipline}"`); showNotif('Discipline updated!'); closeModal() }
    setSubmitting(false)
  }
  async function deleteDisc(id: string) { const d = disciplines.find(x => x.id === id); await supabase.from('disciplines').delete().eq('id', id); await addLog(`Deleted discipline: "${d?.discipline}"`, 'red'); showNotif('Deleted.') }
  async function approveDisc(id: string) { const d = disciplines.find(x => x.id === id); await supabase.from('disciplines').update({ approved: true }).eq('id', id); await addLog(`Approved discipline: "${d?.discipline}"`, 'green'); showNotif('Approved!') }
  async function rejectDisc(id: string) { const d = disciplines.find(x => x.id === id); await supabase.from('disciplines').delete().eq('id', id); await addLog(`Rejected discipline: "${d?.discipline}"`, 'red'); showNotif('Rejected.') }

  // Action handlers
  async function submitAction() {
    if (!form.commitment?.trim()) { showNotif('Please enter a commitment.', 'red'); return }
    setSubmitting(true)
    const { error } = await supabase.from('actions').insert({ commitment: form.commitment.trim(), type: form.type || null, owner: form.owner || null, due_date: form.due_date || null, status: form.status as Action['status'], note: form.note || null, approved: canApprove, submitted_by: profile.id })
    if (error) showNotif('Error saving action.', 'red')
    else { await addLog(canApprove ? `Added action: "${form.commitment}"` : `Submitted for approval: "${form.commitment}"`, 'green'); showNotif(canApprove ? 'Action added!' : 'Submitted for approval.'); closeModal() }
    setSubmitting(false)
  }
  async function saveEditAction() {
    if (!editId) return
    setSubmitting(true)
    const { error } = await supabase.from('actions').update({ commitment: form.commitment, type: form.type || null, owner: form.owner || null, due_date: form.due_date || null, status: form.status as Action['status'], note: form.note || null }).eq('id', editId)
    if (error) showNotif('Error updating.', 'red')
    else { await addLog(`Updated action: "${form.commitment}"`); showNotif('Action updated!'); closeModal() }
    setSubmitting(false)
  }
  async function deleteAction(id: string) { const a = actions.find(x => x.id === id); await supabase.from('actions').delete().eq('id', id); await addLog(`Deleted action: "${a?.commitment}"`, 'red'); showNotif('Deleted.') }
  async function approveAction(id: string) { const a = actions.find(x => x.id === id); await supabase.from('actions').update({ approved: true }).eq('id', id); await addLog(`Approved action: "${a?.commitment}"`, 'green'); showNotif('Approved!') }
  async function rejectAction(id: string) { const a = actions.find(x => x.id === id); await supabase.from('actions').delete().eq('id', id); await addLog(`Rejected action: "${a?.commitment}"`, 'red'); showNotif('Rejected.') }

  // User handlers
  async function approveUser(id: string) { const u = allProfiles.find(p => p.id === id); await supabase.from('profiles').update({ approved: true }).eq('id', id); await addLog(`Approved access for ${u?.name}`, 'green'); showNotif(`${u?.name} approved!`) }
  async function rejectUser(id: string) { const u = allProfiles.find(p => p.id === id); await supabase.from('profiles').delete().eq('id', id); await addLog(`Rejected access for ${u?.name}`, 'red'); showNotif('Request rejected.') }
  async function changeUserRole(id: string, role: Role) { await supabase.from('profiles').update({ role }).eq('id', id); showNotif('Role updated.') }

  async function saveConfig() {
    const updated = { name: form.cfg_name ?? config.name, leader: form.cfg_leader ?? config.leader, period: form.cfg_period ?? config.period, aim: form.cfg_aim ?? config.aim }
    if (config.id) await supabase.from('team_config').update({ ...updated, updated_at: new Date().toISOString() }).eq('id', config.id)
    else { const { data } = await supabase.from('team_config').insert(updated).select().single(); if (data) setConfig(data) }
    setConfig(prev => ({ ...prev, ...updated }))
    await addLog('Team configuration updated')
    showNotif('Configuration saved!')
  }

  function exportCSV() {
    let csv = 'CHANGE_X TEAM PERFORMANCE DASHBOARD\n'
    csv += `Team,${config.name}\nLeader,${config.leader}\nPeriod,${config.period}\nReset Aim,${config.aim}\n\n`
    csv += 'SECTION A - GOALS & KPI TRACKER\nGoal,KPI,Baseline,Target,Current,Status,Comment\n'
    goals.filter(g => g.approved).forEach(g => { const st = g.manual_status || calcStatus(g.baseline, g.target, g.current_value); csv += `"${g.goal}","${g.kpi ?? ''}",${g.baseline ?? ''},${g.target ?? ''},${g.current_value ?? ''},${st},"${g.comment ?? ''}"\n` })
    csv += '\nSECTION B - OPERATING DISCIPLINES\nDiscipline,Evidence,Owner,Status,Needs Attention\n'
    disciplines.filter(d => d.approved).forEach(d => { csv += `"${d.discipline}","${d.evidence ?? ''}","${d.owner ?? ''}",${d.status},"${d.attention ?? ''}"\n` })
    csv += '\nSECTION C - COMMITMENTS & ACTIONS\nCommitment,Type,Owner,Due Date,Status,Note\n'
    actions.filter(a => a.approved).forEach(a => { csv += `"${a.commitment}","${a.type ?? ''}","${a.owner ?? ''}","${a.due_date ?? ''}",${a.status},"${a.note ?? ''}"\n` })
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `ChangeX_${config.name || 'Team'}_${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
    showNotif('Dashboard exported!')
  }

  async function handleSubmit() {
    if (modalType === 'goal') await submitGoal()
    else if (modalType === 'discipline') await submitDisc()
    else if (modalType === 'action') await submitAction()
    else if (modalType === 'editGoal') await saveEditGoal()
    else if (modalType === 'editDisc') await saveEditDisc()
    else if (modalType === 'editAction') await saveEditAction()
  }

  const approvedGoals = goals.filter(g => g.approved)
  const approvedDiscs = disciplines.filter(d => d.approved)
  const approvedActions = actions.filter(a => a.approved)
  const pendingCount = goals.filter(g => !g.approved).length + disciplines.filter(d => !d.approved).length + actions.filter(a => !a.approved).length + allProfiles.filter(p => !p.approved).length
  const visibleGoals = canApprove ? goals : goals.filter(g => g.approved || g.submitted_by === profile.id)
  const visibleDiscs = canApprove ? disciplines : disciplines.filter(d => d.approved || d.submitted_by === profile.id)
  const visibleActions = canApprove ? actions : actions.filter(a => a.approved || a.submitted_by === profile.id)

  return (
    <div className="cx-dash">
      {/* NAV */}
      <nav className="topnav">
        <div className="nav-logo"><img src="/logo.png" alt="CHANGE_X" /></div>
        <div className="nav-center">
          {(['dashboard', 'goals', 'disciplines', 'actions', 'log'] as const).map(v => (
            <button key={v} className={`nav-btn${view === v ? ' active' : ''}`} onClick={() => setView(v)}>
              {v === 'dashboard' ? 'Dashboard' : v === 'goals' ? 'Goals & KPIs' : v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
          {canApprove && <button className={`nav-btn${view === 'admin' ? ' active' : ''}`} onClick={() => setView('admin')}>Admin</button>}
        </div>
        <div className="nav-right">
          {canApprove && pendingCount > 0 && <button className="pending-badge" onClick={() => setView('admin')}>{pendingCount} pending</button>}
          <div className="user-chip">
            <span>{profile.name}</span>
            <span className={`role-badge ${profile.role}`}>{profile.role.toUpperCase()}</span>
          </div>
          <button className="icon-btn" onClick={exportCSV}>↓ Export</button>
          <button className="icon-btn" onClick={doLogout}>Sign out</button>
        </div>
        <button className="hamburger" onClick={() => setMobileMenuOpen(o => !o)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </nav>

      {mobileMenuOpen && (
        <div className="mobile-nav">
          {(['dashboard', 'goals', 'disciplines', 'actions', 'log'] as const).map(v => (
            <button key={v} className={`mobile-nav-btn${view === v ? ' active' : ''}`} onClick={() => { setView(v); setMobileMenuOpen(false) }}>
              {v === 'dashboard' ? 'Dashboard' : v === 'goals' ? 'Goals & KPIs' : v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
          {canApprove && <button className={`mobile-nav-btn${view === 'admin' ? ' active' : ''}`} onClick={() => { setView('admin'); setMobileMenuOpen(false) }}>Admin {pendingCount > 0 && `(${pendingCount})`}</button>}
          <div className="mobile-nav-divider" />
          <button className="mobile-nav-btn" onClick={() => { exportCSV(); setMobileMenuOpen(false) }}>↓ Export CSV</button>
          <button className="mobile-nav-btn" onClick={doLogout}>Sign out</button>
        </div>
      )}

      <div className="main">
        <div className="rainbow-bar" />

        {/* DASHBOARD */}
        {view === 'dashboard' && (
          <div>
            <div className="team-banner">
              <div className="team-info">
                <div className="section-tag">Active Team</div>
                <h1>{config.name || '— No team configured —'}</h1>
                <div className="meta">{[config.leader ? `Leader: ${config.leader}` : '', config.period].filter(Boolean).join(' · ') || 'Configure your team in Admin to get started'}</div>
              </div>
              <div className="team-aim"><strong>Reset Aim</strong>{config.aim || '—'}</div>
            </div>

            <div className="summary-grid">
              <div className="summary-card sc-green"><div className="num">{approvedGoals.filter(g => (g.manual_status || calcStatus(g.baseline, g.target, g.current_value)) === 'green').length}</div><div className="lbl">On Track</div></div>
              <div className="summary-card sc-amber"><div className="num">{approvedGoals.filter(g => (g.manual_status || calcStatus(g.baseline, g.target, g.current_value)) === 'amber').length}</div><div className="lbl">At Risk</div></div>
              <div className="summary-card sc-red"><div className="num">{approvedGoals.filter(g => (g.manual_status || calcStatus(g.baseline, g.target, g.current_value)) === 'red').length}</div><div className="lbl">Off Track</div></div>
              <div className="summary-card sc-blue"><div className="num">{approvedActions.filter(a => a.status === 'complete').length}</div><div className="lbl">Actions Complete</div></div>
              <div className="summary-card sc-purple"><div className="num">{approvedActions.filter(a => a.status === 'in progress').length}</div><div className="lbl">In Progress</div></div>
            </div>

            <div className="flex-between"><div><div className="section-tag">A · Goals & KPI Tracker</div><h2 style={{ fontSize: 16, fontWeight: 700 }}>Progress Snapshot</h2></div><button className="btn-sm" onClick={() => setView('goals')}>View all →</button></div>
            <div className="table-wrap" style={{ marginBottom: 24 }}>
              <table><thead><tr><th>Goal</th><th>Progress</th><th>Status</th><th>Comment</th></tr></thead>
                <tbody>{approvedGoals.length === 0 ? <tr><td colSpan={4}><div className="empty-state"><div className="icon">📊</div><p>No goals added yet</p></div></td></tr> : approvedGoals.map(g => { const st = (g.manual_status as GoalStatus) || calcStatus(g.baseline, g.target, g.current_value); return <tr key={g.id}><td style={{ fontWeight: 600 }}>{g.goal}</td><td><ProgBar pct={calcPct(g.baseline, g.target, g.current_value)} status={st} /></td><td><Pill status={st} /></td><td style={{ color: 'var(--muted)', fontSize: 12 }}>{g.comment || '—'}</td></tr> })}</tbody>
              </table>
            </div>

            <div className="flex-between"><div><div className="section-tag">B · Operating Disciplines</div><h2 style={{ fontSize: 16, fontWeight: 700 }}>Discipline Status</h2></div><button className="btn-sm" onClick={() => setView('disciplines')}>View all →</button></div>
            <div className="table-wrap" style={{ marginBottom: 24 }}>
              <table><thead><tr><th>Discipline</th><th>Owner</th><th>Status</th><th>Needs Attention</th></tr></thead>
                <tbody>{approvedDiscs.length === 0 ? <tr><td colSpan={4}><div className="empty-state"><div className="icon">🎯</div><p>No disciplines added yet</p></div></td></tr> : approvedDiscs.map(d => <tr key={d.id}><td style={{ fontWeight: 600 }}>{d.discipline}</td><td>{d.owner || '—'}</td><td><Pill status={d.status} /></td><td style={{ color: 'var(--muted)', fontSize: 12 }}>{d.attention || '—'}</td></tr>)}</tbody>
              </table>
            </div>

            <div className="flex-between"><div><div className="section-tag">C · Key Commitments & Actions</div><h2 style={{ fontSize: 16, fontWeight: 700 }}>Action Tracker</h2></div><button className="btn-sm" onClick={() => setView('actions')}>View all →</button></div>
            <div className="table-wrap">
              <table><thead><tr><th>Commitment</th><th>Owner</th><th>Due</th><th>Status</th></tr></thead>
                <tbody>{approvedActions.length === 0 ? <tr><td colSpan={4}><div className="empty-state"><div className="icon">✅</div><p>No actions added yet</p></div></td></tr> : approvedActions.map(a => <tr key={a.id}><td style={{ fontWeight: 600 }}>{a.commitment}</td><td>{a.owner || '—'}</td><td style={{ color: 'var(--muted)' }}>{a.due_date || '—'}</td><td><Pill status={a.status} /></td></tr>)}</tbody>
              </table>
            </div>
          </div>
        )}

        {/* GOALS */}
        {view === 'goals' && (
          <div>
            <div className="flex-between">
              <div><div className="section-tag">A · Goals & KPI Tracker</div><h2 style={{ fontSize: 20, fontWeight: 700 }}>Goals & KPI Tracker</h2><p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 4 }}>Update monthly · Discuss in monthly review</p></div>
              <button className="btn-add" onClick={() => openModal('goal')}>+ Add Goal</button>
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Goal</th><th>KPI / Measure</th><th>Baseline</th><th>Target</th><th>Current</th><th>Progress</th><th>Status</th><th>Comment</th><th></th></tr></thead>
                <tbody>
                  {visibleGoals.length === 0 ? <tr><td colSpan={9}><div className="empty-state"><div className="icon">📊</div><p>No goals yet. Click &ldquo;+ Add Goal&rdquo; to get started.</p></div></td></tr>
                  : visibleGoals.map(g => {
                    const st = (g.manual_status as GoalStatus) || calcStatus(g.baseline, g.target, g.current_value)
                    const pending = !g.approved
                    return (
                      <tr key={g.id} className={pending ? 'pending-dim' : ''}>
                        <td style={{ fontWeight: 600 }}>{g.goal}{pending && <> <Pill status="pending" /></>}</td>
                        <td style={{ fontSize: 12, color: 'var(--muted)' }}>{g.kpi || '—'}</td>
                        <td>{g.baseline ?? '—'}</td><td>{g.target ?? '—'}</td><td>{g.current_value ?? '—'}</td>
                        <td><ProgBar pct={calcPct(g.baseline, g.target, g.current_value)} status={st} /></td>
                        <td><Pill status={st} /></td>
                        <td style={{ fontSize: 12, color: 'var(--muted)' }}>{g.comment || '—'}</td>
                        <td><div style={{ display: 'flex', gap: 6 }}>
                          {canApprove && !pending && <><button className="btn-sm" onClick={() => openModal('editGoal', g.id)}>Edit</button><button className="btn-sm danger" onClick={() => deleteGoal(g.id)}>Del</button></>}
                          {canApprove && pending && <><button className="btn-sm approve" onClick={() => approveGoal(g.id)}>Approve</button><button className="btn-sm reject" onClick={() => rejectGoal(g.id)}>Reject</button></>}
                        </div></td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* DISCIPLINES */}
        {view === 'disciplines' && (
          <div>
            <div className="flex-between">
              <div><div className="section-tag">B · Operating Disciplines</div><h2 style={{ fontSize: 20, fontWeight: 700 }}>Operating Disciplines</h2><p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 4 }}>Update monthly · Discuss in monthly team review</p></div>
              <button className="btn-add" onClick={() => openModal('discipline')}>+ Add Discipline</button>
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Discipline / Behaviour</th><th>Evidence This Month</th><th>Owner</th><th>Status</th><th>What Needs Attention</th><th></th></tr></thead>
                <tbody>
                  {visibleDiscs.length === 0 ? <tr><td colSpan={6}><div className="empty-state"><div className="icon">🎯</div><p>No disciplines yet.</p></div></td></tr>
                  : visibleDiscs.map(d => {
                    const pending = !d.approved
                    return (
                      <tr key={d.id} className={pending ? 'pending-dim' : ''}>
                        <td style={{ fontWeight: 600 }}>{d.discipline}{pending && <> <Pill status="pending" /></>}</td>
                        <td style={{ fontSize: 12, color: 'var(--muted)' }}>{d.evidence || '—'}</td>
                        <td>{d.owner || '—'}</td><td><Pill status={d.status} /></td>
                        <td style={{ fontSize: 12, color: 'var(--muted)' }}>{d.attention || '—'}</td>
                        <td><div style={{ display: 'flex', gap: 6 }}>
                          {canApprove && !pending && <><button className="btn-sm" onClick={() => openModal('editDisc', d.id)}>Edit</button><button className="btn-sm danger" onClick={() => deleteDisc(d.id)}>Del</button></>}
                          {canApprove && pending && <><button className="btn-sm approve" onClick={() => approveDisc(d.id)}>Approve</button><button className="btn-sm reject" onClick={() => rejectDisc(d.id)}>Reject</button></>}
                        </div></td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ACTIONS */}
        {view === 'actions' && (
          <div>
            <div className="flex-between">
              <div><div className="section-tag">C · Key Commitments & Actions</div><h2 style={{ fontSize: 20, fontWeight: 700 }}>Commitments & Actions</h2><p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 4 }}>Update weekly · Review in weekly check-in</p></div>
              <button className="btn-add" onClick={() => openModal('action')}>+ Add Action</button>
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Commitment</th><th>Type</th><th>Owner</th><th>Due Date</th><th>Status</th><th>Evidence / Note</th><th></th></tr></thead>
                <tbody>
                  {visibleActions.length === 0 ? <tr><td colSpan={7}><div className="empty-state"><div className="icon">✅</div><p>No actions yet.</p></div></td></tr>
                  : visibleActions.map(a => {
                    const pending = !a.approved
                    return (
                      <tr key={a.id} className={pending ? 'pending-dim' : ''}>
                        <td style={{ fontWeight: 600 }}>{a.commitment}{pending && <> <Pill status="pending" /></>}</td>
                        <td style={{ fontSize: 12, color: 'var(--muted)' }}>{a.type || '—'}</td>
                        <td>{a.owner || '—'}</td><td style={{ color: 'var(--muted)' }}>{a.due_date || '—'}</td>
                        <td><Pill status={a.status} /></td>
                        <td style={{ fontSize: 12, color: 'var(--muted)' }}>{a.note || '—'}</td>
                        <td><div style={{ display: 'flex', gap: 6 }}>
                          {canApprove && !pending && <><button className="btn-sm" onClick={() => openModal('editAction', a.id)}>Edit</button><button className="btn-sm danger" onClick={() => deleteAction(a.id)}>Del</button></>}
                          {canApprove && pending && <><button className="btn-sm approve" onClick={() => approveAction(a.id)}>Approve</button><button className="btn-sm reject" onClick={() => rejectAction(a.id)}>Reject</button></>}
                        </div></td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* LOG */}
        {view === 'log' && (
          <div>
            <div className="section-header"><div className="section-tag">Change Log</div><h2>Version History</h2><p>All approved changes to this dashboard</p></div>
            <div className="admin-section">
              {log.length === 0 ? <div className="empty-state"><div className="icon">📋</div><p>No changes logged yet.</p></div>
              : log.map(l => (
                <div key={l.id} className="log-entry">
                  <div className={`log-dot ${l.color || 'blue'}`} />
                  <div className="log-content">
                    <div className="action-text">{l.action}</div>
                    <div className="meta">{l.user_name} · {new Date(l.created_at).toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ADMIN */}
        {view === 'admin' && canApprove && (
          <div>
            <div className="section-header"><div className="section-tag">Administration</div><h2>Admin Panel</h2><p>Manage approvals, users, and team configuration</p></div>

            <div className="admin-section">
              <h3>⚙️ Team Configuration</h3>
              <div className="form-grid-2">
                <div className="form-group"><label>Team Name</label><input type="text" defaultValue={config.name} onChange={e => setF('cfg_name', e.target.value)} placeholder="e.g. Commercial Leadership Team" /></div>
                <div className="form-group"><label>Team Leader</label><input type="text" defaultValue={config.leader} onChange={e => setF('cfg_leader', e.target.value)} placeholder="e.g. N. Mokoena" /></div>
                <div className="form-group"><label>Review Period</label><input type="text" defaultValue={config.period} onChange={e => setF('cfg_period', e.target.value)} placeholder="e.g. June 2026 · Monthly Review" /></div>
                <div className="form-group"><label>Reset Aim</label><input type="text" defaultValue={config.aim} onChange={e => setF('cfg_aim', e.target.value)} placeholder="e.g. Faster, clearer decisions" /></div>
              </div>
              <button className="btn-add" onClick={saveConfig}>Save Configuration</button>
            </div>

            <div className="admin-section">
              <h3>⏳ Pending Approvals {pendingCount > 0 && <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 400 }}>({pendingCount})</span>}</h3>
              {goals.filter(g => !g.approved).length === 0 && disciplines.filter(d => !d.approved).length === 0 && actions.filter(a => !a.approved).length === 0
                ? <div className="empty-state" style={{ padding: '30px 0' }}><p>No pending changes.</p></div>
                : <>
                  {goals.filter(g => !g.approved).map(g => <div key={g.id} className="user-row"><div className="user-info"><div className="name">Goal: {g.goal}</div><div className="email">By {allProfiles.find(p => p.id === g.submitted_by)?.name ?? 'Unknown'} · {new Date(g.submitted_at).toLocaleString()}</div></div><div className="user-actions"><button className="btn-sm approve" onClick={() => approveGoal(g.id)}>Approve</button><button className="btn-sm reject" onClick={() => rejectGoal(g.id)}>Reject</button></div></div>)}
                  {disciplines.filter(d => !d.approved).map(d => <div key={d.id} className="user-row"><div className="user-info"><div className="name">Discipline: {d.discipline}</div><div className="email">By {allProfiles.find(p => p.id === d.submitted_by)?.name ?? 'Unknown'} · {new Date(d.submitted_at).toLocaleString()}</div></div><div className="user-actions"><button className="btn-sm approve" onClick={() => approveDisc(d.id)}>Approve</button><button className="btn-sm reject" onClick={() => rejectDisc(d.id)}>Reject</button></div></div>)}
                  {actions.filter(a => !a.approved).map(a => <div key={a.id} className="user-row"><div className="user-info"><div className="name">Action: {a.commitment}</div><div className="email">By {allProfiles.find(p => p.id === a.submitted_by)?.name ?? 'Unknown'} · {new Date(a.submitted_at).toLocaleString()}</div></div><div className="user-actions"><button className="btn-sm approve" onClick={() => approveAction(a.id)}>Approve</button><button className="btn-sm reject" onClick={() => rejectAction(a.id)}>Reject</button></div></div>)}
                </>
              }
            </div>

            <div className="admin-section">
              <h3>👥 Team Members</h3>
              {allProfiles.filter(p => p.approved).map(p => (
                <div key={p.id} className="user-row">
                  <div className="user-info"><div className="name">{p.name}</div><div className="email">{p.email}</div></div>
                  <div className="user-actions">
                    <Pill status={p.role === 'admin' ? 'complete' : p.role === 'leader' ? 'amber' : 'notstarted'} />
                    {p.id !== profile.id && <select className="role-select" defaultValue={p.role} onChange={e => changeUserRole(p.id, e.target.value as Role)}><option value="member">Member</option><option value="leader">Leader</option><option value="admin">Admin</option></select>}
                  </div>
                </div>
              ))}
            </div>

            <div className="admin-section">
              <h3>📬 Access Requests</h3>
              {allProfiles.filter(p => !p.approved).length === 0
                ? <div className="empty-state" style={{ padding: '30px 0' }}><p>No pending access requests.</p></div>
                : allProfiles.filter(p => !p.approved).map(p => (
                  <div key={p.id} className="user-row">
                    <div className="user-info"><div className="name">{p.name}</div><div className="email">{p.email} · Requested: {p.role} · {new Date(p.created_at).toLocaleString()}</div></div>
                    <div className="user-actions"><button className="btn-sm approve" onClick={() => approveUser(p.id)}>Approve</button><button className="btn-sm reject" onClick={() => rejectUser(p.id)}>Reject</button></div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* MODAL */}
      {modalType && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) closeModal() }}>
          <div className="modal">
            <h3>{modalType === 'goal' ? 'Add Goal & KPI' : modalType === 'discipline' ? 'Add Operating Discipline' : modalType === 'action' ? 'Add Commitment / Action' : modalType === 'editGoal' ? 'Edit Goal' : modalType === 'editDisc' ? 'Edit Discipline' : 'Edit Action'}</h3>
            {!canApprove && !modalType.startsWith('edit') && <div className="warn-note">⚠️ Your entry will be submitted for approval before it appears on the dashboard.</div>}

            {(modalType === 'goal' || modalType === 'editGoal') && <>
              <div className="form-group"><label>Goal</label><input type="text" value={form.goal ?? ''} onChange={e => setF('goal', e.target.value)} placeholder="e.g. Improve decision speed" /></div>
              <div className="form-group"><label>KPI / Success Measure</label><input type="text" value={form.kpi ?? ''} onChange={e => setF('kpi', e.target.value)} placeholder="e.g. % decisions made within timeframe" /></div>
              <div className="form-grid-3">
                <div className="form-group"><label>Baseline</label><input type="number" value={form.baseline ?? ''} onChange={e => setF('baseline', e.target.value)} /></div>
                <div className="form-group"><label>Target</label><input type="number" value={form.target ?? ''} onChange={e => setF('target', e.target.value)} /></div>
                <div className="form-group"><label>Current</label><input type="number" value={form.current ?? ''} onChange={e => setF('current', e.target.value)} /></div>
              </div>
              <div className="form-group"><label>Comment / Blocker</label><textarea value={form.comment ?? ''} onChange={e => setF('comment', e.target.value)} placeholder="Any blockers or notes..." /></div>
            </>}

            {(modalType === 'discipline' || modalType === 'editDisc') && <>
              <div className="form-group"><label>Discipline / Behaviour</label><input type="text" value={form.discipline ?? ''} onChange={e => setF('discipline', e.target.value)} placeholder="e.g. We make decisions at the correct level" /></div>
              <div className="form-group"><label>Evidence This Month</label><textarea value={form.evidence ?? ''} onChange={e => setF('evidence', e.target.value)} placeholder="What evidence supports this rating?" /></div>
              <div className="form-group"><label>Owner</label><input type="text" value={form.owner ?? ''} onChange={e => setF('owner', e.target.value)} /></div>
              <div className="form-group"><label>Status</label><select value={form.status ?? 'green'} onChange={e => setF('status', e.target.value)}><option value="green">Green – Consistently doing this</option><option value="amber">Amber – Mostly, with gaps</option><option value="red">Red – Not happening</option></select></div>
              <div className="form-group"><label>What Needs Attention Next</label><input type="text" value={form.attention ?? ''} onChange={e => setF('attention', e.target.value)} /></div>
            </>}

            {(modalType === 'action' || modalType === 'editAction') && <>
              <div className="form-group"><label>Commitment / Agreed Change</label><input type="text" value={form.commitment ?? ''} onChange={e => setF('commitment', e.target.value)} placeholder="e.g. Publish a one-page decision-rights matrix" /></div>
              <div className="form-group"><label>Type</label><select value={form.type ?? 'Working Rhythm'} onChange={e => setF('type', e.target.value)}><option>Working Rhythm</option><option>Meeting Design</option><option>Accountability</option><option>Review Rhythm</option><option>Other</option></select></div>
              <div className="form-grid-2">
                <div className="form-group"><label>Owner</label><input type="text" value={form.owner ?? ''} onChange={e => setF('owner', e.target.value)} /></div>
                <div className="form-group"><label>Due Date</label><input type="date" value={form.due_date ?? ''} onChange={e => setF('due_date', e.target.value)} /></div>
              </div>
              <div className="form-group"><label>Status</label><select value={form.status ?? 'not started'} onChange={e => setF('status', e.target.value)}><option value="not started">Not Started</option><option value="in progress">In Progress</option><option value="complete">Complete</option></select></div>
              <div className="form-group"><label>Evidence / Note</label><textarea value={form.note ?? ''} onChange={e => setF('note', e.target.value)} /></div>
            </>}

            <div className="modal-actions">
              <button className="btn-cancel" onClick={closeModal}>Cancel</button>
              <button className="btn-submit" onClick={handleSubmit} disabled={submitting}>{submitting ? 'Saving…' : modalType.startsWith('edit') ? 'Save' : 'Submit'}</button>
            </div>
          </div>
        </div>
      )}

      {/* NOTIFICATION */}
      {notif && <div className={`notif show notif-${notif.type}`}>{notif.msg}</div>}
    </div>
  )
}
