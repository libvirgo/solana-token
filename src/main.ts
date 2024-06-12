import { AccountLayout } from '@solana/spl-token';
import {
    dasApi,
    type DasApiAssetList,
} from '@metaplex-foundation/digital-asset-standard-api';
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
    let resp: DasApiAssetList;
    let page = 1;
    let total = 0;
    do {
        resp = await umi.rpc.getAssetsByAuthority({
            authority: publicKey(token.authorities[0].address),
            limit: 1000,
            page: page,
        });
        for (const item of resp.items) {
            if (item.content.metadata.symbol === 'MUTANT') {
                total += 1;
            }
        }
        page++;
    } while (resp.items.length > 0);
    console.log(`mutant count: ${total}`);
}

main().then().catch(console.error);
