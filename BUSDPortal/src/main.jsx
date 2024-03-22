import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import { createWeb3Modal } from '@web3modal/wagmi/react'
import { WagmiConfig } from "wagmi";
import { http, createConfig, WagmiProvider } from 'wagmi'
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'
import { walletConnect, injected, coinbaseWallet } from 'wagmi/connectors'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'


// import { WagmiConfig } from "wagmi";
import { bscTestnet } from "wagmi/chains";

// const queryClient = new QueryClient()

const projectId = "bc19f516affc6bf7f6a1f4029500705e";

const metadata = {
  name: 'BUSD Portal',
  // description: 'Send BUSD to any address',
  // url: 'https://localhost:3000', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const chains = [bscTestnet];


const config = createConfig({
  chains: [bscTestnet],
  transports: {
    [bscTestnet.id]: http()
  },
  connectors: [
    walletConnect({ projectId, metadata, showQrModal: false }),
    injected({ shimDisconnect: true }),
    coinbaseWallet({
      appName: metadata.name,
      appLogoUrl: metadata.icons[0]
    })
  ]
})

createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
  enableOnramp: true // Optional - false as default
})

// export function Web3ModalProvider({ children }) {
//   return (
//     <WagmiProvider config={config}>
//       <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
//     </WagmiProvider>
//   )
// }

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      {/* <QueryClientProvider client={queryClient}> */}
      <App />
      {/* </QueryClientProvider> */}
    </WagmiProvider>
  </React.StrictMode>
);
