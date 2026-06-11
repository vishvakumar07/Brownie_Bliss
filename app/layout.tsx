import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
})

export const metadata: Metadata = {
  title: 'Brownie Bliss | Premium Homemade Brownies',
  description: 'Indulge in handcrafted, premium brownies made with love. Experience the perfect blend of rich chocolate and artisanal ingredients.',
  keywords: ['brownies', 'premium brownies', 'homemade brownies', 'chocolate brownies', 'desserts', 'bakery'],
  authors: [{ name: 'Brownie Bliss' }],
  openGraph: {
    title: 'Brownie Bliss | Premium Homemade Brownies',
    description: 'Indulge in handcrafted, premium brownies made with love.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} bg-background`}>
      <body className="font-sans antialiased">
        {children}
        <Toaster position="top-center" />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
