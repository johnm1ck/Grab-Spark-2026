import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ArrowDown, ArrowLeft, ArrowRight, Bell, BookOpen, CalendarDays, Check, CheckCheck, ChevronDown, ChevronRight, CircleHelp, ClipboardList, CookingPot, GraduationCap, Grid2X2, HandCoins, House, Leaf, Link, MapPin, Megaphone, MessageSquareText, Monitor, PencilLine, ShieldCheck, ShoppingBag, ShoppingCart, Sparkles, Store, TrendingUp, Users, Utensils, Wallet, X, type LucideIcon } from 'lucide-react'

type Sheet = 'journey' | 'discounts' | 'fees' | 'review' | 'notifications' | 'status' | 'quality' | 'assistant' | string | null
type Tab = 'overview' | 'results'
const suggestedDescription = 'Stir-fried chicken with Thai holy basil, served with steamed rice. Choose your spice level.'
const shortcuts: { label: string; icon: LucideIcon; kind?: string }[] = [
  { label: 'Orders', icon: CookingPot }, { label: 'Menu', icon: BookOpen }, { label: 'Cashier', icon: Monitor }, { label: 'Finance', icon: Wallet }, { label: 'AI Assistant', icon: Sparkles, kind: 'ai' },
  { label: 'Quality Merchant', icon: ShieldCheck, kind: 'quality' }, { label: 'Feedback', icon: MessageSquareText }, { label: 'Store', icon: Store }, { label: 'Grow Sales', icon: Megaphone }, { label: 'Express', icon: ShoppingBag },
  { label: 'Insights', icon: TrendingUp }, { label: 'Employees', icon: Users }, { label: 'Academy', icon: GraduationCap }, { label: 'GrabShop', icon: ShoppingCart }, { label: 'Smart Link', icon: Link },
  { label: 'Help', icon: CircleHelp }, { label: 'Learn to Earn', icon: Leaf, kind: 'learn' },
]

function readSaved(key: string) {
  try { return localStorage.getItem(key) === 'true' } catch { return false }
}

function WalletArt() {
  return <svg className="wallet-art" viewBox="0 0 160 125" aria-hidden="true">
    <ellipse cx="91" cy="111" rx="52" ry="8" fill="#e8ece8" />
    <g transform="rotate(15 89 64)"><path d="M61 29 69 8l49 9-4 30" fill="#009b47" /><path d="m77 34 3-21 43 6-2 32" fill="#00c55a" /><path d="M41 31h72a13 13 0 0 1 13 13v55H47a17 17 0 0 1-17-17V44a13 13 0 0 1 11-13" fill="#00893e" /><rect x="35" y="25" width="93" height="70" rx="13" fill="#00c653" /><path d="M35 81v7a13 13 0 0 0 13 13h66a13 13 0 0 0 14-13V78" fill="none" stroke="#00a34a" strokeWidth="8" /><path d="M111 53h24v29h-24a14.5 14.5 0 0 1 0-29" fill="#008e42" /><circle cx="110" cy="67.5" r="4.5" fill="#8eea9c" /></g>
    <ellipse cx="27" cy="38" rx="8" ry="12" fill="#f4cf14" transform="rotate(-24 27 38)" /><path d="m26 29 5 16" stroke="#ffe662" strokeWidth="2.5" /><ellipse cx="132" cy="101" rx="8" ry="11" fill="#f4cd12" transform="rotate(19 132 101)" /><ellipse cx="58" cy="104" rx="9" ry="5" fill="#ffd92c" /><path d="m140 31 3 7 7 3-7 3-3 7-3-7-7-3 7-3ZM48 11l2 5 5 2-5 2-2 5-2-5-5-2 5-2Z" fill="#f9d638" /><path d="m110 36 2 5 5 2-5 2-2 5-2-5-5-2 5-2Z" fill="#b9ee70" />
  </svg>
}

function App() {
  const [page, setPage] = useState(location.hash.startsWith('#learn') ? 'learn' : 'home')
  const [tab, setTab] = useState<Tab>('overview')
  const [sheet, setSheet] = useState<Sheet>(null)
  const [active, setActive] = useState(() => readSaved('grab-offer-active'))
  const [submitted, setSubmitted] = useState(() => readSaved('grab-task-submitted'))
  const [description, setDescription] = useState(() => {
    try { return localStorage.getItem('grab-task-description') || suggestedDescription } catch { return suggestedDescription }
  })
  const [storeOpen, setStoreOpen] = useState(true)
  const [toast, setToast] = useState('')
  const dialogRef = useRef<HTMLDialogElement>(null)
  const previousFocus = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const onHash = () => { setPage(location.hash.startsWith('#learn') ? 'learn' : 'home'); window.scrollTo(0, 0) }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  useEffect(() => {
    if (sheet) {
      if (!dialogRef.current?.open) previousFocus.current = document.activeElement as HTMLElement
      dialogRef.current?.showModal()
      document.body.style.overflow = 'hidden'
    } else {
      dialogRef.current?.close()
      document.body.style.overflow = ''
      previousFocus.current?.focus()
    }
    return () => { document.body.style.overflow = '' }
  }, [sheet])
  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(''), 4200)
    return () => clearTimeout(timer)
  }, [toast])

  function navigate(destination: string) {
    location.hash = destination === 'learn' ? 'learn-to-earn' : 'home'
    setPage(destination)
    setTab('overview')
    window.scrollTo(0, 0)
  }
  function save(key: string) { try { localStorage.setItem(key, 'true') } catch { /* The flow remains usable without storage. */ } }
  function openShortcut(label: string) {
    if (label === 'Learn to Earn') navigate('learn')
    else if (label === 'Quality Merchant') setSheet('quality')
    else if (label === 'AI Assistant') setSheet('assistant')
    else setSheet(label)
  }

  function sheetContent(): { title: string; body: ReactNode } {
    switch (sheet) {
      case 'journey': return { title: 'Small steps. More possibilities.', body: <>
        <p className="sheet-intro">Learn to Earn helps you understand your business and take your next step with support.</p>
        <ol className="journey-list">
          <li><span>1</span><div><h3>Check your costs</h3><p>See what remains from each order.</p></div></li>
          <li><span>2</span><div><h3>Start your first customer offer</h3><p>Qualify for up to 50 first-time-customer discounts.</p></div></li>
          <li><span>3</span><div><h3>Complete a useful improvement</h3><p>Receive one task based on your restaurant’s needs.</p></div></li>
          <li><span>4</span><div><h3>Unlock more support and review results</h3><p>Qualify for up to 50 more discounts, then track orders and returning customers.</p></div></li>
        </ol><button className="primary" onClick={() => setSheet(null)}>Let’s get started <ArrowRight size={18} /></button>
      </> }
      case 'discounts': return { title: active ? 'Your first offer is active' : 'Your first customer offer', body: <>
        <div className="offer-ticket"><HandCoins size={32} /><span>Grab-funded support</span><strong>Up to 50 discounts</strong><p>For first-time customers at your restaurant</p></div>
        <ul className="check-list"><li><Check />Your cost check is completed</li><li><Check />Grab funds the customer discounts</li><li><Check />Your usual order fees still apply</li></ul>
        <p className="muted">Review the fee breakdown before activating. This offer helps new customers try your restaurant; it does not guarantee orders.</p>
        <button className="inline-link" onClick={() => setSheet('fees')}>View fees after your promotion ends <ChevronRight size={16} /></button>
        <button className="primary" disabled={active} onClick={() => { setActive(true); save('grab-offer-active'); setToast('Demo offer activated on this device.') }}>{active ? <><CheckCheck size={19} /> Discounts activated</> : <>Activate discounts <ArrowRight size={18} /></>}</button>
        <p className="demo-note">Interactive preview. Activation is saved on this device and does not start a live Grab promotion.</p>
      </> }
      case 'fees': return { title: 'After your promotion ends', body: <>
        <p className="sheet-intro">Grab-funded discounts end when the offer finishes. The costs in your example remain:</p>
        <div className="fee-example"><CostRows /><div className="fee-total"><strong>Left per order</strong><strong>฿30</strong></div></div>
        <p className="muted">The ฿30 in platform fees and other order costs is the example amount you provided, not a quoted Grab fee rate. Your actual fees depend on your merchant agreement.</p>
        <p className="muted">The amount left helps cover rent, fixed salaries, and other ongoing expenses. It is not your final profit.</p>
        <button className="primary" onClick={() => setSheet('discounts')}>Back to your offer</button>
      </> }
      case 'review': return { title: submitted ? 'Your update is being checked' : 'Review your menu update', body: <>
        <div className="dish-label"><span className="food-icon"><Utensils size={21} /></span><div><h3>Chicken Basil Rice</h3><p>Menu description</p></div></div>
        <label className="field-label" htmlFor="description">Suggested description</label>
        <textarea id="description" value={description} onChange={event => setDescription(event.target.value)} rows={5} maxLength={350} disabled={submitted} />
        <p className="muted">Make sure this accurately describes your dish before submitting. Support becomes available after your update is checked.</p>
        {submitted ? <div className="pending-note"><CheckCheck size={20} /><div><strong>Submitted for review</strong><p>Up to 50 more discounts stay locked until the update is checked.</p></div></div> : <button className="primary" disabled={description.trim().length < 10} onClick={() => { setSubmitted(true); save('grab-task-submitted'); try { localStorage.setItem('grab-task-description', description) } catch { /* Storage is optional. */ } setToast('Demo update submitted for review.') }}>Publish update <ArrowRight size={18} /></button>}
        <p className="demo-note">Interactive preview. Your live restaurant menu will not be changed.</p>
      </> }
      case 'status': return { title: 'Store availability', body: <><p className="sheet-intro">Choose whether your restaurant is accepting orders in this preview.</p>{[true, false].map(value => <button key={String(value)} className={`option-row ${value === storeOpen ? 'selected' : ''}`} onClick={() => { setStoreOpen(value); setSheet(null) }}><span className={`status-dot ${value ? '' : 'paused'}`} />{value ? 'Normal · accepting orders' : 'Paused · not accepting orders'}{value === storeOpen && <Check size={19} />}</button>)}</> }
      case 'quality': return { title: 'Quality Merchant', body: <><div className="quality-hero"><ShieldCheck size={44} /></div><p className="sheet-intro">Complete your goals by the end of the month to unlock next month’s benefits.</p><div className="pending-note"><ClipboardList size={21} /><p>Your merchant goals will appear when your store is connected.</p></div><button className="primary" onClick={() => { setSheet(null); navigate('learn') }}>Explore Learn to Earn <Leaf size={18} /></button></> }
      case 'notifications': return { title: 'Notifications', body: <><button className="notification-row" onClick={() => { setSheet(null); navigate('learn') }}><span className="food-icon"><Leaf size={24} /></span><div><strong>Your first round of support is ready</strong><p>Check your costs and explore up to 50 Grab-funded discounts.</p></div><ChevronRight size={20} /></button><p className="demo-note">Sample notification for this preview.</p></> }
      case 'assistant': return { title: 'Your business assistant', body: <><p className="sheet-intro">Start with a useful question about your restaurant.</p><button className="option-row" onClick={() => { setSheet(null); navigate('learn') }}><Wallet size={21} />What is left from each order?<ChevronRight size={18} /></button><button className="option-row" onClick={() => setSheet('review')}><PencilLine size={21} />How can I improve my menu?<ChevronRight size={18} /></button><button className="option-row" onClick={() => setSheet('journey')}><Leaf size={21} />How does Learn to Earn work?<ChevronRight size={18} /></button></> }
      case 'Menu': return { title: 'Your menu', body: <><div className="dish-label"><span className="food-icon"><Utensils size={24} /></span><div><h3>Chicken Basil Rice</h3><p>฿100</p></div></div><p className="description-quote">“Chicken basil rice”</p>{submitted && <p className="completion"><CheckCheck size={17} /> Description update awaiting review</p>}<button className="primary" onClick={() => setSheet('review')}>Improve this description <PencilLine size={18} /></button></> }
      case 'Orders': return { title: 'Orders', body: <><div className="empty-state"><CookingPot size={42} /><h3>No orders being prepared</h3><p>Your new orders will appear here.</p></div><div className="option-row"><span>Today’s completed orders</span><strong>7</strong></div></> }
      case 'Finance': return { title: 'Finance', body: <><div className="finance-total"><span>Today’s revenue</span><strong>฿547.00</strong><p>7 orders</p></div><button className="option-row" onClick={() => { setSheet(null); navigate('learn') }}><Wallet size={22} />Check what remains from each order<ChevronRight size={18} /></button></> }
      case 'More': return { title: 'More tools', body: <div className="more-tools">{shortcuts.slice(5).map(({ label, icon: Icon }) => <button className="option-row" key={label} onClick={() => { if (label === 'Learn to Earn') { setSheet(null); navigate('learn') } else openShortcut(label) }}><Icon size={21} />{label}<ChevronRight size={18} /></button>)}</div> }
      default: return { title: sheet || '', body: <><div className="empty-state"><Store size={40} /><h3>{sheet === 'Store' ? 'GrabFood Aroijung' : `${sheet} workspace`}</h3><p>This tool is available when your merchant account is connected.</p></div><button className="primary" onClick={() => { setSheet(null); navigate('learn') }}>Explore Learn to Earn <Leaf size={18} /></button></> }
    }
  }
  const content = sheetContent()

  return <div className="app-shell">
    {page === 'home' ? <main className="home-page">
      <header className="home-header"><div className="store-name"><MapPin size={23} strokeWidth={2.5} /><h1>GrabFood Aroijung</h1></div><button className="icon-button notification-button" aria-label="Notifications, 7 unread" onClick={() => setSheet('notifications')}><Bell size={25} /><span className="notification-badge">7</span></button></header>
      <section aria-labelledby="sales-heading"><h2 className="section-title" id="sales-heading">Sales performance</h2><div className="sales-cards">
        <div className="orders-card"><button className="store-status" onClick={() => setSheet('status')}><span className={`status-dot ${storeOpen ? '' : 'paused'}`} />{storeOpen ? 'Normal' : 'Paused'}<ChevronDown size={15} /></button><button className="orders-summary" onClick={() => setSheet('Orders')}><strong>0</strong><span>Preparing</span></button></div>
        <button className="revenue-card" onClick={() => setSheet('Finance')}><span className="revenue-heading"><span className="revenue-icon"><TrendingUp size={24} /></span>Revenue</span><div className="revenue-numbers"><span className="currency">฿</span><strong>547.00</strong><span className="order-count">7 orders</span></div></button>
      </div></section>
      <section className="for-you" aria-labelledby="for-you-heading"><h2 className="section-title" id="for-you-heading">Just for you</h2><button className="quality-card" onClick={() => setSheet('quality')}><span className="quality-badge"><ShieldCheck size={30} strokeWidth={2.2} /></span><div><h3>Quality Merchant</h3><p>Complete all your goals this month to unlock next month’s benefits.</p></div><ChevronRight size={21} /></button></section>
      <nav className="shortcut-grid" aria-label="Merchant tools">{shortcuts.map(({ label, icon: Icon, kind }) => <button key={label} className={`shortcut ${kind || ''}`} onClick={() => openShortcut(label)}><span className="shortcut-icon"><Icon size={27} strokeWidth={1.9} /></span><span className="shortcut-label">{label}</span>{kind === 'learn' && <span className="new-dot" />}</button>)}</nav>
    </main> : <main className="learn-page">
      <header className="learn-header"><button className="icon-button" onClick={() => navigate('home')} aria-label="Back to Home"><ArrowLeft size={23} /></button><h1>Learn to Earn</h1><button className="icon-button" aria-label="How Learn to Earn works" onClick={() => setSheet('journey')}><CircleHelp size={23} /></button></header>
      <div className="learn-tabs" role="tablist" aria-label="Learn to Earn sections"><button id="overview-tab" role="tab" aria-selected={tab === 'overview'} aria-controls="overview-panel" tabIndex={tab === 'overview' ? 0 : -1} onKeyDown={e => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { setTab('results'); document.getElementById('results-tab')?.focus() } }} onClick={() => { setTab('overview'); window.scrollTo(0, 0) }}>Overview</button><button id="results-tab" role="tab" aria-selected={tab === 'results'} aria-controls="results-panel" tabIndex={tab === 'results' ? 0 : -1} onKeyDown={e => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { setTab('overview'); document.getElementById('overview-tab')?.focus() } }} onClick={() => { setTab('results'); window.scrollTo(0, 0) }}>Your results</button><button className="how-it-works" onClick={() => setSheet('journey')} aria-label="View your four steps"><Leaf size={15} /> Your journey</button></div>
      {tab === 'overview' ? <div id="overview-panel" role="tabpanel" aria-labelledby="overview-tab">
        <section className="learn-first" aria-label="Check costs and activate your first offer">
          <div className="cost-intro"><div><span className="eyebrow">A little clarity. A stronger business.</span><h2>Check My Costs</h2><span className="step-label">Your first step to more support</span></div><WalletArt /></div>
          <div className="cost-card"><div className="dish-label"><span className="food-icon"><Utensils size={21} /></span><h3>Chicken Basil Rice</h3><span className="per-order">Per order</span></div><CostRows /><div className="amount-left"><strong>฿30</strong><span>left per order</span><span className="amount-check"><Check size={16} /></span></div><p className="cost-explanation">This amount helps cover rent, fixed salaries, and other ongoing expenses. <strong>It is not your final profit.</strong></p></div>
          <p className="completion"><span><Check size={13} strokeWidth={3} /></span>Cost check completed</p>
          <div className="support-card"><div className="support-heading"><span className="support-icon"><HandCoins size={23} /></span><h2>{active ? 'Your first round of support is active' : 'Your first round of support is ready'}</h2></div><p>Up to <strong>50 Grab-funded discounts</strong> to help first-time customers try your restaurant.</p><button className="primary" onClick={() => setSheet('discounts')}>{active ? 'View your active discounts' : 'View and activate discounts'}<ArrowRight size={17} /></button></div>
          <button className="fees-link" onClick={() => setSheet('fees')}>View fees after your promotion ends <ChevronRight size={15} /></button>
          <a className="next-hint" href="#next-improvement" onClick={e => { e.preventDefault(); document.getElementById('next-improvement')?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }}>Your next improvement <ArrowDown size={13} /></a>
        </section>
        <section className="improvement-section" id="next-improvement"><div className="improvement-title"><span className="eyebrow"><Leaf size={14} /> A SMALL CHANGE CAN GO A LONG WAY</span><h2>Your Next Improvement</h2><p>Help more menu viewers place an order</p></div>
          <div className="weekly-card"><span className="week-label"><CalendarDays size={15} />This week</span><div className="weekly-stats"><div><strong>200</strong><span>menu viewers</span></div><ArrowRight size={21} /><div><strong>10</strong><span>orders</span></div><div className="conversion"><strong>5<span>%</span></strong><span>ordered</span></div></div><p>That means <strong>5 in every 100 viewers ordered.</strong></p></div>
          <div className="task-card"><span className="task-kicker"><PencilLine size={15} /> SUGGESTED TASK</span><h3>Make your main dish clearer</h3><p className="task-subtitle">Help customers understand what they will receive.</p><div className="current-description"><span>Current description</span><p>“Chicken basil rice”</p></div><div className="suggested-description"><span><Sparkles size={15} />Suggested description</span><p>“{suggestedDescription}”</p></div><div className="unlock-note"><span><Leaf size={21} /></span><p>Complete this task to unlock <strong>up to 50 more first-customer discounts.</strong></p></div><button className="primary" onClick={() => setSheet('review')}>{submitted ? 'View submitted update' : 'Review and publish'}{submitted ? <CheckCheck size={18} /> : <ArrowRight size={18} />}</button><p className="review-note">{submitted ? 'Update submitted. Your additional support is pending review.' : 'Support becomes available after your update is checked.'}</p></div>
          <div className="journey-bottom"><Leaf size={21} /><span>Build a stronger business, one step at a time.</span></div>
        </section>
      </div> : <section className="results-page" id="results-panel" role="tabpanel" aria-labelledby="results-tab"><span className="eyebrow">A clearer view of your progress</span><h2>Your results</h2><p className="muted">Keep an eye on orders and customers as you make improvements.</p><div className="results-period"><CalendarDays size={17} />This week</div><div className="results-grid"><div><Users size={21} /><strong>200</strong><span>Menu viewers</span></div><div><ShoppingBag size={21} /><strong>10</strong><span>Orders</span></div><div><TrendingUp size={21} /><strong>5%</strong><span>Viewers who ordered</span></div><div><Users size={21} /><strong>—</strong><span>Returning customers</span></div></div><p className="demo-note">Example weekly figures. Returning-customer data becomes available when your store is connected.</p><h3>Your support</h3><div className="support-status"><HandCoins size={23} /><div><strong>First 50 discounts</strong><p>{active ? 'Activated in this preview' : 'Ready to activate'}</p></div><button className="inline-link" onClick={() => setSheet('discounts')}>View<ChevronRight size={16} /></button></div><div className="support-status"><Leaf size={23} /><div><strong>Up to 50 more discounts</strong><p>{submitted ? 'Update awaiting review' : 'Complete your menu improvement'}</p></div></div><button className="primary" onClick={() => setTab('overview')}>Back to your next step<ArrowRight size={17} /></button></section>}
    </main>}
    <nav className="bottom-nav" aria-label="Main navigation"><button className="nav-item is-active" aria-current="page" onClick={() => navigate('home')}><House size={25} fill="currentColor" strokeWidth={2.3} /><span>Home</span></button><button className="nav-item" onClick={() => setSheet('Orders')}><CookingPot size={25} /><span>Orders</span></button><button className="nav-item" onClick={() => setSheet('Menu')}><BookOpen size={25} /><span>Menu</span></button><button className="nav-item" onClick={() => setSheet('Cashier')}><Monitor size={25} /><span>Cashier</span></button><button className="nav-item" onClick={() => setSheet('More')}><Grid2X2 size={25} /><span>More</span></button><button className="assistant-nav" aria-label="Open AI Assistant" onClick={() => setSheet('assistant')}><Sparkles size={27} fill="white" /></button></nav>
    <dialog ref={dialogRef} className="bottom-sheet" aria-labelledby="sheet-title" onCancel={event => { event.preventDefault(); setSheet(null) }} onClick={event => { if (event.target === event.currentTarget) setSheet(null) }}><div className="sheet-inner"><div className="sheet-handle" /><header className="sheet-header"><h2 id="sheet-title">{content.title}</h2><button className="icon-button" aria-label="Close dialog" onClick={() => setSheet(null)}><X size={22} /></button></header><div className="sheet-body">{content.body}</div></div></dialog>
    {toast && <div className="toast" role="status"><Check size={18} />{toast}</div>}
  </div>
}

function CostRows() {
  return <dl className="cost-rows">{[['Selling price', '฿100'], ['Ingredients', '฿35'], ['Packaging', '฿5'], ['Platform fees and other order costs', '฿30']].map(([label, amount]) => <div key={label}><dt>{label}</dt><span aria-hidden="true" /><dd>{amount}</dd></div>)}</dl>
}

export default App
