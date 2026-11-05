import mapBase from '../assets/map-base.png'
import pin from '../assets/icon-location-pin.svg'
import styles from './PinpointMap.module.css'

interface PinpointMapProps {
  title?: string
  className?: string
}

export function PinpointMap({ title = 'Map Pinpoint', className }: PinpointMapProps) {
  return (
    <div className={[styles.card, className].filter(Boolean).join(' ')}>
      <div className={styles.header}>{title}</div>
      <div className={styles.map}>
        <img src={mapBase} alt="Map showing the device location" className={styles.base} />
        <img src={pin} alt="" width={18} height={22} className={styles.pin} />
      </div>
    </div>
  )
}
