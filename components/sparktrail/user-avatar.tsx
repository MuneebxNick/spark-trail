import Image from 'next/image'

interface UserAvatarProps {
  avatarUrl?: string | null
  name: string
  username: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const SIZE_MAP = {
  sm: {
    container: 'h-7 w-7',
    text: 'text-[10px]',
    imgSize: 28,
  },
  md: {
    container: 'h-9 w-9',
    text: 'text-[12px]',
    imgSize: 36,
  },
  lg: {
    container: 'h-12 w-12',
    text: 'text-[13px]',
    imgSize: 48,
  },
  xl: {
    container: 'h-24 w-24',
    text: 'text-[32px]',
    imgSize: 96,
  },
}

export function UserAvatar({ avatarUrl, name, username, size = 'md', className = '' }: UserAvatarProps) {
  const initials = name
    ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : username.slice(0, 2).toUpperCase()

  const sizeConfig = SIZE_MAP[size]

  if (avatarUrl) {
    return (
      <Image
        src={avatarUrl}
        alt={name || username}
        width={sizeConfig.imgSize}
        height={sizeConfig.imgSize}
        className={`${sizeConfig.container} shrink-0 rounded-full object-cover ${className}`}
      />
    )
  }

  return (
    <span
      className={`flex ${sizeConfig.container} shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#7857FF] to-[#5D3FD3] ${sizeConfig.text} font-bold text-white uppercase ${className}`}
    >
      {initials}
    </span>
  )
}
