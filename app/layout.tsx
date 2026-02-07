import '@coinbase/cds-icons/fonts/web/icon-font.css';
import '@coinbase/cds-web/defaultFontStyles';
import '@coinbase/cds-web/globalStyles';
import './globals.css';

import { ThemeProvider, MediaQueryProvider } from '@coinbase/cds-web/system';
import { baseScannerTheme } from './theme/baseScannerTheme';

export const metadata = {
  title: 'Base Scanner - Real-time Contract Discovery',
  description: 'Discover new tokens, NFTs, and smart contracts on Base network in real-time. Agent-friendly API for automated discovery.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <MediaQueryProvider>
          <ThemeProvider theme={baseScannerTheme} activeColorScheme="dark">
            {children}
          </ThemeProvider>
        </MediaQueryProvider>
      </body>
    </html>
  );
}
