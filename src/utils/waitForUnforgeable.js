import * as rchainToolkit from 'rchain-toolkit';
const READ_ONLY_HOST = 'http://localhost:40403';

export const waitForUnforgeable = (name) => {
  try {
    return new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        try {
          let resp = undefined;
          rchainToolkit.http
            .dataAtName(READ_ONLY_HOST, {
              name: {
                UnforgPrivate: { data: name },
              },
              depth: 3,
            })
            .then((dataAtNameResponse) => {
              resp = dataAtNameResponse;
              if (
                resp &&
                JSON.parse(resp) &&
                JSON.parse(resp).exprs &&
                JSON.parse(resp).exprs.length
              ) {
                resolve(resp);
                clearInterval(interval);
              } else {
                console.log('  .');
              }
            })
            .catch((err) => {
              console.log(resp);
              console.log(err);
              throw new Error('wait for unforgeable name');
            });
        } catch (err) {
          console.log(err);
          throw new Error('wait for unforgeable name');
        }
      }, 10000);
    });
  } catch (err) {
    console.log(err);
    throw new Error('wait for unforgeable name');
  }
};
