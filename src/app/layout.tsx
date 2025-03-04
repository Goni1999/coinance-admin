export const metadata = {
    title: "Capital Trust",
    description: "",
  };
  
  export default function RootLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <html>
        <head>
          <link rel="icon" href="/images/favicon.ico" sizes="any" />
        </head>
        <body>{children}</body>
      </html>
    );
  }