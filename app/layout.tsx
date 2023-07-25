import './globals.css';
import { NextAuthProvider, ThemeProvider, ToastProvider } from './providers';
import { Sidebar } from '@/_components/sidebar/Sidebar';

export const metadata = {
  title: 'Pigeon',
  description: "Interact in real-time with the city of Toronto's data",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <NextAuthProvider>
        <ToastProvider>
          <body>
            <main>{children}</main>
          </body>
        </ToastProvider>
      </NextAuthProvider>
    </ThemeProvider>
  );
}
