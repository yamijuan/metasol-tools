import React from 'react';
import { HashRouter, Route, Routes as Switch } from 'react-router-dom';
import { Providers } from './providers';
import { HomeView } from './views';

export function Routes() {
    console.log("ajajjaja")
  return (
    <>
      <HashRouter basename={'/'}>
        {/*<Providers>*/}
          <Switch>
            <Route path="/" element={<HomeView />} />
          </Switch>
        {/*</Providers>*/}
      </HashRouter>
    </>
  );
}
