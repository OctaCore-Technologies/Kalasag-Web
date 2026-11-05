import arrowLeft from '../assets/icon-arrow-left.svg'
import { Button } from './Button'

export function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <Button icon={<img src={arrowLeft} alt="" width={18} height={18} />} onClick={onClick} style={{ minWidth: 132 }}>
      Back
    </Button>
  )
}
