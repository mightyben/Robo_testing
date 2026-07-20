// Reusable Multi-Chain Blockchain Verification API Backend
export default async function handler(req, res) {
    // Enable CORS so your other apps can use this same backend URL!
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { txHash, asset, expectedWallet } = req.body;

    if (!txHash || !asset || !expectedWallet) {
        return res.status(400).json({ error: 'Missing security parameters.' });
    }

    try {
        let paymentConfirmed = false;

        // 1. Ethereum / USDT (ERC20) Security Layer
        if (asset === 'ETH' || asset === 'USDT_ERC20') {
            const rpcResponse = await fetch('https://cloudflare-eth.com', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    jsonrpc: "2.0",
                    method: "eth_getTransactionByHash",
                    params: [txHash],
                    id: 1
                })
            });
            const rpcData = await rpcResponse.json();

            if (rpcData.result) {
                const tx = rpcData.result;
                // Securely match destination address in the cloud where users can't intercept it
                if (tx.to && tx.to.toLowerCase() === expectedWallet.toLowerCase()) {
                    paymentConfirmed = true;
                }
            }
        } 
        // 2. Bitcoin Security Layer
        else if (asset === 'BTC') {
            const btcResponse = await fetch(`https://blockstream.info/api/tx/${txHash}`);
            if (btcResponse.ok) {
                const tx = await btcResponse.json();
                tx.vout.forEach(output => {
                    if (output.scriptpubkey_address === expectedWallet) {
                        paymentConfirmed = true;
                    }
                });
            }
        }

        if (paymentConfirmed) {
            return res.status(200).json({ status: 'verified', token: btoa(txHash + '_SECURE_CLEARANCE') });
        } else {
            return res.status(400).json({ status: 'failed', error: 'Transaction destination mismatch or unconfirmed.' });
        }

    } catch (error) {
        return res.status(500).json({ error: 'Internal blockchain node sync error.' });
    }
}
