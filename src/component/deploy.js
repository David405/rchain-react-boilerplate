import React, { useState } from 'react';
import * as rchainToolkit from 'rchain-toolkit';
import { waitForUnforgeable } from '../utils/waitForUnforgeable';

const DeployTerm = () => {
  const [state, setState] = useState("");

  const PRIVATE_KEY =
    '28a5c9ac133b4449ca38e9bdf7cacdce31079ef6b3ac2f0a080af83ecff98b36';
  const PUBLIC_KEY = rchainToolkit.utils.publicKeyFromPrivateKey(PRIVATE_KEY);
  const READ_ONLY_HOST = 'http://localhost:40403';
  const VALIDATOR_HOST = 'http://localhost:40403';

  const main = async () => {
    const timestamp = new Date().getTime();
    const pd = await rchainToolkit.http.prepareDeploy(READ_ONLY_HOST, {
      deployer: PUBLIC_KEY,
      timestamp: timestamp,
      nameQty: 1,
    });

    const term = `new channel in { channel!("Hello Blockchain!")}`;

    const validAfterBlock = JSON.parse(
      await rchainToolkit.http.blocks(READ_ONLY_HOST, {
        position: 1,
      })
    )[0].blockNumber;

    const deployOptions = await rchainToolkit.utils.getDeployOptions(
      'secp256k1',
      timestamp,
      term,
      PRIVATE_KEY,
      PUBLIC_KEY,
      1,
      1000000000,
      validAfterBlock
    );

    const deployResponse = await rchainToolkit.http.deploy(
      VALIDATOR_HOST,
      deployOptions
    );

    // wait 14 seconds for propose
    let dataAtNameResponse;
    try {
      dataAtNameResponse = await waitForUnforgeable(JSON.parse(pd).names[0]);
    } catch (err) {
      console.log(err);
      throw new Error('00_deployBox 05');
    }
    const data = rchainToolkit.utils.rhoValToJs(
      JSON.parse(dataAtNameResponse).exprs[0].expr
    );

      console.log(data);
      setState(data);
  };

  main();

  return (
    <div>
      <h1>{state}</h1>
    </div>
  );
}

export default DeployTerm;
