import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DashboardApp from './DashboardApp'

async function signOutAction() {
  'use server'
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/dashboard/login')
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/dashboard/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/dashboard/login')

  if (!profile.approved) {
    return <PendingApproval name={profile.name} signOut={signOutAction} />
  }

  const isPrivileged = profile.role === 'admin' || profile.role === 'leader'

  const [goalsRes, disciplinesRes, actionsRes, configRes, logRes, profilesRes] =
    await Promise.all([
      supabase.from('goals').select('*').order('submitted_at', { ascending: false }),
      supabase.from('disciplines').select('*').order('submitted_at', { ascending: false }),
      supabase.from('actions').select('*').order('submitted_at', { ascending: false }),
      supabase.from('team_config').select('*').limit(1).single(),
      supabase
        .from('activity_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100),
      isPrivileged
        ? supabase.from('profiles').select('*').order('created_at', { ascending: true })
        : Promise.resolve({ data: [] }),
    ])

  return (
    <DashboardApp
      profile={profile}
      initialGoals={goalsRes.data ?? []}
      initialDisciplines={disciplinesRes.data ?? []}
      initialActions={actionsRes.data ?? []}
      initialConfig={configRes.data ?? { id: '', name: '', leader: '', period: '', aim: '' }}
      initialLog={logRes.data ?? []}
      initialAllProfiles={profilesRes.data ?? []}
    />
  )
}

async function PendingApproval({ name, signOut }: { name: string; signOut: () => Promise<void> }) {
  return (
    <div className="cx-dash pending-screen">
      <div className="pending-box">
        <img src="/logo.png" alt="CHANGE_X" style={{ width: '160px', marginBottom: '24px' }} />
        <h2>Pending Approval</h2>
        <p>
          Hi {name}, your account is awaiting admin approval. You&rsquo;ll be notified once access is granted.
        </p>
        <form action={signOut}>
          <button type="submit" className="sign-out">Sign out &amp; go back</button>
        </form>
      </div>
    </div>
  )
}
