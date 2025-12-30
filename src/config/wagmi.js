import { http, createConfig } from 'wagmi';
import { mainnet, base, arbitrum, polygon, celo } from 'wagmi/chains';
import { walletConnect, injected, coinbaseWallet } from 'wagmi/connectors';

// WalletConnect Project ID - Replace with your actual project ID from https://cloud.walletconnect.com/
const projectId = 'YOUR_WALLETCONNECT_PROJECT_ID';

export const config = createConfig({
  chains: [mainnet, base, arbitrum, polygon, celo],
  connectors: [
    walletConnect({ projectId }),
    injected({ shimDisconnect: true }),
    coinbaseWallet({
      appName: 'Liquid Nation',
    }),
  ],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
    [arbitrum.id]: http(),
    [polygon.id]: http(),
    [celo.id]: http(),
  },
});
