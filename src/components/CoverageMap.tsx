import { Link } from 'react-router'
import mapBase from '../assets/map-base.png'
import geofence from '../assets/geofence.svg'
import relayTower from '../assets/relay-tower.svg'
import redOuter from '../assets/marker-red-outer.svg'
import redInner from '../assets/marker-red-inner.svg'
import yellowOuter from '../assets/marker-yellow-outer.svg'
import yellowInner from '../assets/marker-yellow-inner.svg'
import greenOuter from '../assets/marker-green-outer.svg'
import greenInner from '../assets/marker-green-inner.svg'
import type { DistressStatus, MapMarker, MapPosition } from '../data/types'
import styles from './CoverageMap.module.css'

const MARKER_ART: Record<DistressStatus, { outer: string; inner: string }> = {
  Trapped: { outer: redOuter, inner: redInner },
  'Need Help': { outer: yellowOuter, inner: yellowInner },
  Safe: { outer: greenOuter, inner: greenInner },
}

/** Geofence coverage circles drawn on the static map (top-left corner, % of the frame). */
const GEOFENCES = [
  { id: 'g1', x: 28.41, y: 46.5 },
  { id: 'g2', x: 40.42, y: 51.88 },
  { id: 'g3', x: 54.52, y: 51.25 },
]

interface CoverageMapProps {
  markers: MapMarker[]
  towers: (MapPosition & { id: string })[]
}

/**
 * Static map from the Figma "Device Monitoring" frame. Every overlay is
 * positioned in percentages of the 908 × 800 frame so the composition scales.
 * Relay towers open the Relay Tower tab; distress markers open the device.
 */
export function CoverageMap({ markers, towers }: CoverageMapProps) {
  return (
    <div className={styles.map}>
      <img src={mapBase} alt="Map of the monitored barangay" className={styles.base} />

      {GEOFENCES.map((g) => (
        <img key={g.id} src={geofence} alt="" className={styles.geofence} style={{ left: `${g.x}%`, top: `${g.y}%` }} />
      ))}

      {towers.map((t) => (
        <Link
          key={t.id}
          to="/devices?tab=relay"
          className={[styles.pin, styles.tower].join(' ')}
          style={{ left: `${t.x}%`, top: `${t.y}%` }}
          aria-label={`Relay tower ${t.id}`}
        >
          <img src={relayTower} alt="" className={styles.towerArt} />
          <span className={styles.tooltip}>Relay tower {t.id}</span>
        </Link>
      ))}

      {markers.map((m) => {
        const art = MARKER_ART[m.status]
        return (
          <Link
            key={m.id}
            to={m.to}
            className={[styles.pin, styles.marker].join(' ')}
            style={{ left: `${m.x}%`, top: `${m.y}%` }}
            aria-label={m.label}
          >
            <img src={art.outer} alt="" className={styles.outer} />
            <img src={art.inner} alt="" className={styles.inner} />
            <span className={styles.tooltip}>{m.label}</span>
          </Link>
        )
      })}
    </div>
  )
}
