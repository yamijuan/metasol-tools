import React, {useEffect} from "react";
import * as anchor from '@project-serum/anchor'

import {
    MasterEdition
} from "@metaplex-foundation/mpl-token-metadata";
import {TokenBalance} from "@solana/web3.js";

export const HomeView = () => {
    const connection = new anchor.web3.Connection(
       "https://holy-small-sky.solana-mainnet.quiknode.pro/159754a0c96359c036bf30dc483f6a3067d5ba97/"
    );
    const mint = "2GeB4hgFzKNgDboKfc37k35HoDXkTh8d94VcYDkMi9MS"
    const supply = 2
    useEffect(() => {
        const load = async () => {
            const master_edition = await MasterEdition.getPDA(mint)
            console.log({master_edition})
            const editionsMints: string[] = []
            let lastSig: string | undefined = undefined
            while (editionsMints.length < supply){
                const fetched = await connection.getConfirmedSignaturesForAddress2(
                    master_edition,
                    {
                        limit: 10,
                        before: lastSig
                    }
                );
                console.log({fetched})
                if (fetched) {
                    lastSig = fetched[fetched.length - 1].signature
                    const nonErrorTx = fetched.filter(f => !f?.err)
                    if (nonErrorTx) {
                        console.log({nonErrorTx})
                        const parsedTxs = await connection.getParsedTransactions(nonErrorTx.map(tx => tx.signature));
                        console.log({parsedTxs})
                        for (let i = 0; i < parsedTxs.length; i++) {
                            const txOnInx = parsedTxs[i]
                            if (txOnInx !== null) {
                                const messages = txOnInx.meta?.logMessages || [];
                                console.log({messages})
                                let mintNew = false;
                                for (const message of messages) {
                                    if (message.toLowerCase().includes("Mint New Edition from Master Edition".toLowerCase())) {
                                        mintNew = true
                                        break;
                                    }
                                }
                                if (mintNew) {
                                    console.log({mintNew})
                                    const postBalances = txOnInx?.meta?.postTokenBalances || [];
                                    let preBalanceMap: { [index: number]: TokenBalance } = {};
                                    const preBalances = txOnInx?.meta?.preTokenBalances || [];
                                    preBalances.forEach(
                                        (balance) => (preBalanceMap[balance.accountIndex] = balance)
                                    );
                                    console.log({postBalances, preBalances})
                                    for (const index in postBalances) {
                                        const postBalance = postBalances[index];
                                        const preBalance = preBalanceMap[postBalance.accountIndex];
                                        if (!preBalance) {
                                            const tokenMint = postBalance.mint
                                            const uiTokenAmount = postBalance.uiTokenAmount;
                                            const decimals = uiTokenAmount.decimals;
                                            console.log({postBalance})
                                            if (tokenMint !== mint && decimals === 0) {
                                                const delta = parseInt(uiTokenAmount.amount)
                                                console.log({delta})
                                                if (delta === 1) {
                                                    editionsMints.push(postBalance.mint)
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                } else {
                    break
                }
            }
            console.log(editionsMints)
        }
        load()
    }, [])
    return  <div>Hola Mundo adssssssssssssssss</div>
}


// const master_edition_account = await connection.getAccountInfo(master_edition)
// if (master_edition_account){
//     console.log({master_edition_account})
//     const master_edition_instance = new MasterEdition(master_edition, master_edition_account)
//     console.log({master_edition_instance})
//     const editions = await master_edition_instance.getEditions(connection);
//     console.log("editionsss", editions)
// }