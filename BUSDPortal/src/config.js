import { http, createConfig } from '@wagmi/core'
import { bscTestnet } from '@wagmi/core/chains'
import { walletConnect, injected, coinbaseWallet, metaMask } from 'wagmi/connectors'

const projectId = "bc19f516affc6bf7f6a1f4029500705e";

const metadata = {
    name: 'BUSD Portal',
    // description: 'Send BUSD to any address',
    // url: 'https://localhost:3000', // origin must match your domain & subdomain
    icons: ['https://avatars.githubusercontent.com/u/37784886']
}

export const config = createConfig({
    chains: [bscTestnet],
    transports: {
        [bscTestnet.id]: http()
    },
    connectors: [
        metaMask(),
        walletConnect({ projectId, metadata, showQrModal: false }),
        injected({ shimDisconnect: true }),
        coinbaseWallet({
            appName: metadata.name,
            appLogoUrl: metadata.icons[0]
        })
    ]
})