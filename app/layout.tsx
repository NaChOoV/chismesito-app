import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Analytics } from '@vercel/analytics/next';
import { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
    title: 'Chismesito App',
    description: 'App de chismes',
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
};

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" style={{ height: '100%', width: '100%', overflow: 'hidden' }}>
            <body className={`${geistSans.variable} ${geistMono.variable}`}>
                {children}
                <Analytics />
            </body>
        </html>
    );
}
