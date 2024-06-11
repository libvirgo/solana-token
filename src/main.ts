import { AccountLayout } from '@solana/spl-token';
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';
import { Connection, PublicKey } from '@solana/web3.js';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { publicKey } from '@metaplex-foundation/umi';

async function getAccountMint(account: string): Promise<PublicKey> {
    const connection = new Connection('https://api.mainnet-beta.solana.com');
    const resp = await connection.getAccountInfo(new PublicKey(account));
    const accountInfo = AccountLayout.decode(resp?.data!!);
    return accountInfo.mint;
}

async function main() {
    const umi = createUmi(
        'https://mainnet.helius-rpc.com/?api-key=37700236-b823-4392-8c80-196462e47175',
    ).use(dasApi());
    const mint = await getAccountMint(
        'EUVcwKfGAhY4vRBB1j3JkqJ6YqBCLj2LCSmDhB8Yguw7',
    );
    const token = await umi.rpc.getAsset(publicKey(mint));
    const resp = await umi.rpc.getAssetsByAuthority({
        authority: publicKey(token.authorities[0].address),
        limit: 10,
        page: 1,
    });
    console.log(JSON.stringify(resp, null, 2))
}

main().then().catch(console.error);
