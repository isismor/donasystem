import type { Metadata, Viewport } from 'next'
import { TemaProvider } from 'next-themes'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
}

export const metadata: Metadata = {
  title: 'Torre Dona',
  description: 'Painel de Operações · Isis Moreira',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Torre Dona',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,700&family=DM+Serif+Text:ital@0;1&family=IBM+Plex+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased font-sans" suppressHydrationWarning>
        <TemaProvider
          attribute="class"
          defaultTema="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <div className="h-screen overflow-hidden bg-background text-foreground">
            {children}
          </div>
        </TemaProvider>
      </body>
    </html>
  )
}
