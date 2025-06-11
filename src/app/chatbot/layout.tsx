import type React from "react"
export default function ChatbotLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <style>{`
          html, body {
            background: transparent !important;
            margin: 0;
            padding: 0;
            height: 100%;
            overflow: hidden;
          }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  )
}
