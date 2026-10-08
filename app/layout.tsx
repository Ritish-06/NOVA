import type { Metadata } from 'next';
import { Sora, Manrope } from 'next/font/google';
import 'leaflet/dist/leaflet.css';
import '@/app/globals.css';
import NavigationBar from '@/components/navigation/NavigationBar';
import Footer from '@/components/navigation/Footer';
import NovaAiDrawer from '@/components/ai/NovaAiDrawer';

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'NOVA — Global EV Charging Network',
  description: 'Find power. Anywhere. Discover, calculate, and plan EV charging across an interactive 3D global network.',
  keywords: ['EV charging', 'EV stations', 'Electric Vehicle', 'Tesla Supercharger', 'Ionity', 'ChargePoint', '3D Globe EV'],
  openGraph: {
    title: 'NOVA — Global EV Charging Network',
    description: 'Find power. Anywhere. Interactive 3D WebGL EV charging discovery.',
    url: 'https://nova-ev.com',
    siteName: 'NOVA',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sora.variable} ${manrope.variable}`}>
      <body className="bg-nova-bg text-nova-text font-sans antialiased selection:bg-nova-primary selection:text-nova-dark min-h-screen flex flex-col justify-between">
        <NavigationBar />
        <main className="flex-1 relative w-full">{children}</main>
        <Footer />
        <NovaAiDrawer />
      </body>
    </html>
  );
}
