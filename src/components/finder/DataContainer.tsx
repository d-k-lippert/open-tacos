import { useRouter } from 'next/router'
import { Position } from '@turf/helpers'

import Heatmap from '../maps/Heatmap'
import useCragFinder from '../../js/hooks/finder/useCragFinder'
import { CragDensity, LABELS } from '../search/CragsNearBy'
import CragTable from './CragTable'
import TwoColumnLayout from './TwoColumnLayout'

const DataContainer = (): JSX.Element => {
  const cragFinderStore = useCragFinder(useRouter())

  const { total, searchText, groups, isLoading, lnglat } = cragFinderStore.useStore()
  const points: Position[] = groups !== undefined && groups.length > 0
    ? groups[0].crags.map(
      ({ metadata }) => [metadata.lng, metadata.lat]
    )
    : []
  return (
    <TwoColumnLayout
      left={
        <>
          <Preface isLoading={isLoading} total={total} searchText={searchText} />
          <CragDensity crags={groups} />
          {groups.map(({ _id, crags, total }) => {
            return <CragTable key={_id} subheader={LABELS[_id].label} crags={crags} />
          })}
        </>
}
      right={<Heatmap geojson={points} center={lnglat} />}
    />
  )
}

export default DataContainer

const Preface = ({ isLoading, total, searchText }: {isLoading: boolean, total: number, searchText: string}): JSX.Element => (
  <section className='mt-32 text-sm'>
    <div>
      {isLoading
        ? `Loading crags in ${searchText}...`
        : `${humanizeNumber(total)} crags near ${searchText}`}
    </div>
    <div>Consult local climbing community and guidebooks before you visit.</div>
  </section>
)
const humanizeNumber = (n: number): string => n > 300 ? '300+' : n.toString()