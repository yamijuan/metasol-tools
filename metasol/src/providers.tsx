// import {
//   ConnectionProvider,
//   WalletProvider,
// } from '@oyster/common';
import React, { FC } from 'react';
// import { AppLayout } from './components/Layout';
import { LoaderProvider } from './components/Loader';

export const Providers: FC = ({ children }) => {
  return (
    // <ConnectionProvider>
    //   <WalletProvider>
        <LoaderProvider>
          {/*<AppLayout>*/}
            {children}
          {/*</AppLayout>*/}
        </LoaderProvider>
    //   </WalletProvider>
    // </ConnectionProvider>
  );
};
