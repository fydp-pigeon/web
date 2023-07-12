import './globals.css';
import { NextAuthProvider, ThemeProvider, ToastProvider } from './providers';

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
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
