import { useSearchParams } from 'react-router-dom'
import PageTransition from '../../components/PageTransition/PageTransition'
import StaggerText from '../../components/motion/StaggerText'
import FilterBar from '../../components/WorkGrid/FilterBar'
import WorkGrid from '../../components/WorkGrid/WorkGrid'
import { getByMedium, MEDIUMS } from '../../data/projects'
import styles from './Work.module.css'

const VALID_KEYS = new Set(['all', ...MEDIUMS.map(m => m.key)])

export default function Work() {
  const [searchParams, setSearchParams] = useSearchParams()
  const param = searchParams.get('medium')
  const active = VALID_KEYS.has(param) ? param : 'all'
  const projects = getByMedium(active)

  function handleFilter(key) {
    if (key === 'all') {
      setSearchParams({}, { replace: false })
    } else {
      setSearchParams({ medium: key }, { replace: false })
    }
  }

  return (
    <PageTransition>
      <div className={`page ${styles.page}`}>
        <div className="container">
          <header className={styles.header}>
            <StaggerText text="Work" className={styles.heading} />
            <p className={styles.count}>
              {projects.length} project{projects.length === 1 ? '' : 's'}
              {active !== 'all' && <> &middot; {MEDIUMS.find(m => m.key === active)?.label}</>}
            </p>
          </header>

          <FilterBar active={active} onChange={handleFilter} />
          <WorkGrid projects={projects} filterKey={active} />
        </div>
      </div>
    </PageTransition>
  )
}
