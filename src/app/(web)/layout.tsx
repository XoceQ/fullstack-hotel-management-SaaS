import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';

import Header from '@/components/Header/Header';
import './globals.css';
import Footer from '@/components/Footer/Footer';
import ThemeProvider from '@/components/ThemeProvider/ThemeProvider';
import { NextAuthProvider } from '@/components/AuthProvider/AuthProvider';
import Toast from '@/components/Toast/Toast';
import { FaWhatsapp } from 'react-icons/fa';

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['400', '500', '700', '900'],
    style: ['italic', 'normal'],
    variable: '--font-poppins',
});

export const metadata: Metadata = {
    title: 'Hotel Management App',
    description: 'Discover the best hotel rooms',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={poppins.className}>
                <NextAuthProvider>
                    <ThemeProvider>
                        <Toast />
                        <main className="font-normal">
                            <Header />
                            {children}
                            <Footer />
                        </main>
                        {/* Botón flotante de WhatsApp */}
                        <a
                            href="https://wa.me/573153993202?text=Hola%20quisiera%20más%20información" 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-transform transform hover:scale-110"
                        >
                            <FaWhatsapp size={28} />
                        </a>
                    </ThemeProvider>
                </NextAuthProvider>
            </body>
        </html>
    );
}