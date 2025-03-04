import { Outfit } from "next/font/google";
import "./globals.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { SidebarProvider } from "@/context/SidebarContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { notFound } from "next/navigation";
import NextIntlProvider from "@/components/NextIntlProvider";
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

// Set up the outfit font
const outfit = Outfit({
  variable: "--font-outfit-sans",
  subsets: ["latin"],
});

// Adjust the type for params to reflect the async layout signature
interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>; // This now matches the expected type for async layouts
}

// Update the RootLayout to handle async behavior correctly
export default async function RootLayout({ children, params }: RootLayoutProps) {
  // Wait for the params to resolve
  const { locale } = await params;

  let messages;

  try {
    // Dynamically import the messages JSON for the current locale
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    console.error("Failed to load messages:", error);
    notFound(); // Handle the case where messages cannot be found
  }

  return (
    <NextIntlProvider params={{ locale }} messages={messages}>
      <html lang={locale}>
        <head>
          <link rel="icon" href="/images/favicon.ico" sizes="any" />
        </head>
        <body className={`${outfit.variable} dark:bg-gray-900`} suppressHydrationWarning={true}>
          <ThemeProvider>
            <SidebarProvider>
              {children}
              <Analytics />
              <SpeedInsights />


            </SidebarProvider>
          </ThemeProvider>
        </body>
      </html>
    </NextIntlProvider>
  );
}
