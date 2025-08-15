import Image from 'next/image'

interface AFrameIconProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function AFrameIcon({ className = '', size = 'md' }: AFrameIconProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  return (
    <div className={`${sizeClasses[size]} ${className} relative`}>
      <Image
        src="/icon.png"
        alt="ClearView Retreat A-frame cabin icon"
        fill
        className="object-contain brightness-0 invert drop-shadow-lg"
        sizes="(max-width: 768px) 24px, (max-width: 1024px) 32px, 48px"
      />
    </div>
  )
}
