import './globals.css';
import { NextAuthProvider, ThemeProvider, ToastProvider } from './providers';
import { Sidebar } from '@/_components/Sidebar';

export const metadata = {
  title: 'Pigeon',
  description: 'Interact in real-time with the city of Toronto\'s data',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <NextAuthProvider>
        <ToastProvider>
          <body>
            <div className="drawer">
              <input id="my-drawer" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content">
                  <label htmlFor="my-drawer" className="btn sidebarbutton drawer-button">Open drawer</label>
                  <main>{children}</main>
                </div> 
              <div className="drawer-side">
                <label htmlFor="my-drawer" className="drawer-overlay"></label>
                <ul className="menu p-4 w-80 h-full bg-base-200 text-base-content">
                  <Sidebar />
                </ul>
              </div>
            </div>
          </body>
        </ToastProvider>
      </NextAuthProvider>
    </ThemeProvider>
  );
}
