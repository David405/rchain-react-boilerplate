import React, { useState } from 'react';
import * as rchainToolkit from 'rchain-toolkit';

const CheckBalance = async () => {
    //const [state, setState] = useState("");

    const PRIVATE_KEY =
    '28a5c9ac133b4449ca38e9bdf7cacdce31079ef6b3ac2f0a080af83ecff98b36';
    const PUBLIC_KEY = rchainToolkit.utils.publicKeyFromPrivateKey(PRIVATE_KEY);
    const READ_ONLY_HOST = 'http://localhost:40403';
    const VALIDATOR_HOST = 'http://localhost:40403';

     const term = `new return, rl(\`rho:registry:lookup\`), RevVaultCh, vaultCh, balanceCh in {
    rl!(\`rho:rchain:revVault\`, *RevVaultCh) |
    for (@(_, RevVault) <- RevVaultCh) {
      @RevVault!("findOrCreate", "${rchainToolkit.utils.revAddressFromPublicKey(
        PUBLIC_KEY
      )}", *vaultCh) |
      for (@(true, vault) <- vaultCh) {
        @vault!("balance", *balanceCh) |
        for (@balance <- balanceCh) { return!(balance) }
      }
    }
  }`;

     try {
       const result = await rchainToolkit.http.exploreDeploy(READ_ONLY_HOST, {
         term: term,
       });

         const data = rchainToolkit.utils.rhoValToJs(JSON.parse(result).expr[0]);
         console.log(data);
         
     } catch (e) {
       console.log("not found");
     }
    
    return (
        <div>
            <h2>Hello</h2>
        </div>
    )
}

export default CheckBalance;