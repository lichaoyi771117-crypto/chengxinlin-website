import { StartupCheck } from '@/components/features/StartupCheck'

export default function FullscreenLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <StartupCheck />
      {children}
    </>
  )
}
