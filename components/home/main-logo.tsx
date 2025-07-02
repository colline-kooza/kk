import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface MainLogoProps {
  src?: string
  alt?: string
  width?: number
  height?: number
  href?: string
  className?: string
  priority?: boolean
  showText?: boolean
  text?: string
}

export default function MainLogo({
  src = '/images/lecify-1.png',
  alt = 'Company Logo',
  width = 150,
  height = 20,
  href = '/',
  className = '',
  priority = false,
  showText = false,
  text = 'Your Company'
}: MainLogoProps) {
  const logoContent = (
    <Image
      src={src || "/placeholder.svg"}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      className={`object-cover h-18 ${className}`}
    />
  )

  if (href) {
    return (
      <Link 
        href={href}
        className="inline-block hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm"
        aria-label={`${alt} - Go to homepage`}
      >
        {logoContent}
        
      </Link>
    )
  }

  return logoContent
}