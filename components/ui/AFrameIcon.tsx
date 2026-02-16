import Image from 'next/image'

interface AFrameIconProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function AFrameIcon({ className = '', size = 'lg' }: AFrameIconProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-8',
    lg: 'w-12 h-10'
  }

  return (
    <div className={`${sizeClasses[size]} ${className} relative`}>
      <Image
        src="/icon.png"
        alt="Clear View Retreat A-frame cabin icon"
        fill
        sizes="(max-width: 768px) 24px, (max-width: 1024px) 32px, 48px"
      />
    </div>
  )
}
