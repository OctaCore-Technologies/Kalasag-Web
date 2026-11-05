import type { CSSProperties } from 'react'

interface MaskIconProps {
  src: string
  size: number
  className?: string
}

/** Renders a monochrome SVG asset tinted with the current text color. */
export function MaskIcon({ src, size, className }: MaskIconProps) {
  const style: CSSProperties = {
    display: 'inline-block',
    flexShrink: 0,
    width: size,
    height: size,
    backgroundColor: 'currentColor',
    mask: `url("${src}") center / contain no-repeat`,
    WebkitMask: `url("${src}") center / contain no-repeat`,
  }
  return <span aria-hidden="true" className={className} style={style} />
}
