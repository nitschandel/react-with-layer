import React from 'react';
import { render } from 'react-dom';

import { Client, Query } from 'layer-websdk';
import configureStore from './store/configureStore';
import { ownerSet } from './actions/messenger';
import ChatView from './ChatView'

let appId = window.layerSample.appId;

/**
 * Initialize Layer Client with `appId`
 */
let client = new Client({
  appId: appId
});

/**
 * Client authentication challenge.
 * Sign in to Layer sample identity provider service.
 *
 * See http://static.layer.com/sdk/docs/#!/api/layer.Client-event-challenge
 */
client.on('challenge', e => {
  window.layerSample.getIdentityToken(e.nonce, e.callback);
});

client.on('ready', () => {
  store.dispatch(ownerSet(client.user.toObject()));
});

window.layerSample.onLogin(() => {
  /**
   * Start authentication
   */
  client.connect();
});

/**
 * Share the client with the middleware layer
 */
let store = configureStore(client);

/**
 * validate that the sample data has been properly set up
 */
window.layerSample.validateSetup(client);

// Render the Chat UI passing in the client and the store
render(
  <ChatView client={client} store={store} />,
  document.getElementById('root')
);
