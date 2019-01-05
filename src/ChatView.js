import React, { Component } from 'react';

import { Provider } from 'react-redux';
import { LayerProvider } from 'layer-react';
import Messenger from './containers/Messenger';
import ActiveConversation from './containers/ActiveConversation';
import DefaultPanel from './components/DefaultPanel';
import { IndexRoute, Route } from 'react-router';
import { ReduxRouter } from 'redux-router';

export default class ChatView extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <LayerProvider client={this.props.client}>
        <Provider store={this.props.store}>
          <ReduxRouter>
            <Route path='/' component={Messenger}>
              <IndexRoute component={DefaultPanel}/>
              <Route path='/conversations/:conversationId' component={ActiveConversation}/>
            </Route>
          </ReduxRouter>
        </Provider>
      </LayerProvider>
    )
  }
}
