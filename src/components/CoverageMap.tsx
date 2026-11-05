import mapBase from '../assets/map-base.png'
import geofence from '../assets/geofence.svg'
import relayTower from '../assets/relay-tower.svg'
import redOuter from '../assets/marker-red-outer.svg'
import redInner from '../assets/marker-red-inner.svg'
import yellowOuter from '../assets/marker-yellow-outer.svg'
import yellowInner from '../assets/marker-yellow-inner.svg'
import greenOuter from '../assets/marker-green-outer.svg'
import greenInner from '../assets/marker-green-inner.svg'
import type { DistressStatus, MapMarker, RelayTower } from '../data/types'
import styles from './CoverageMap.module.css'

const MARKER_ART: Record<DistressStatus, { outer: string; inner: string }> = {
  Trapped: { outer: redOuter, inner: redInner },
  'Need Help': { outer: yellowOuter, inner: yellowInner },
  Safe: { outer: greenOuter, inner: greenInner },
}

interface CoverageMapProps {
  markers: MapMarker[]
  towers: RelayTower[]
  geofences: { id: string; x: number; y: number }[]
  focusedMarkerId?: string
  onMarkerSelect?: (id: string) => void
}

/**
 * Static map from the Figma "Device Monitoring" frame. Every overlay is
 * positioned in percentages of the 908 × 800 frame so the composition scales.
 */
export function CoverageMap({ markers, towers, geofences, focusedMarkerId, onMarkerSelect }: CoverageMapProps) {
  return (
    <div className={styles.map}>
      <img src={mapBase} alt="Map of the monitored barangay" className={styles.base} />

      {geofences.map((g) => (
        <img key={g.id} src={geofence} alt="" className={styles.geofence} style={{ left: `${g.x}%`, top: `${g.y}%` }} />
      ))}

      {towers.map((t) => (
        <img
          key={t.id}
          src={relayTower}
          alt={`Relay tower ${t.id}`}
          title={`Relay tower ${t.id}`}
          className={styles.tower}
          style={{ left: `${t.x}%`, top: `${t.y}%` }}
        />
      ))}

      {markers.map((m) => {
        const art = MARKER_ART[m.status]
        return (
          <button
            key={m.id}
            type="button"
            className={[styles.marker, m.id === focusedMarkerId && styles.focused].filter(Boolean).join(' ')}
            style={{ left: `${m.x}%`, top: `${m.y}%` }}
            onClick={() => onMarkerSelect?.(m.id)}
            aria-label={m.label}
          >
            <img src={art.outer} alt="" className={styles.outer} />
            <img src={art.inner} alt="" className={styles.inner} />
            <span className={styles.tooltip} role="presentation">
              {m.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
