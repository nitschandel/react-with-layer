/* global layer */
'use strict';

  // Synchronous load of the configuration
  var config;
  if (window.layerSampleConfig) {
    config = window.layerSampleConfig;
  } else {
    var request = new XMLHttpRequest();
    request.onload = function() {
      config = JSON.parse(this.responseText);
    };
    request.open('GET', 'config/LayerConfiguration.json', false);
    request.send();
  }

  if (!config[0].app_id) throw new Error("No app_id key found in LayerConfiguration.json");

  /**
   * layerSample global utility
   *
   * @param {String}    appId - Layer Staging Application ID
   * @param {String}    userId - User ID to log in as
   * @param {Function}  challenge - Layer Client challenge function
   * @param {Function}  dateFormat - Get a nice date string
   */
  window.layerSample = {
    appId: config[0].app_id,
    identityProviderUrl: config[0].identity_provider_url + '/authenticate',
    userId: null,
    email: null,
    password: null,
    validateSetup: function(client) {
      var conversationQuery = client.createQuery({
        paginationWindow: 1,
        model: layer.Query.Conversation
      });
      conversationQuery.on('change:data', function() {
        if (conversationQuery.data.length === 0) {
          var identityQuery = client.createQuery({
            paginationWindow: 5,
            model: layer.Query.Identity
          });
          identityQuery.on('change:data', function() {
            if (identityQuery.data.length === 0) {
              alert("There are no other users to talk to; please use your Identity Server to register new users");
            } else {
              alert("Select new participant from Conversation List Header to start new conversation");
            }
          });
        }
      });
    },
    getIdentityToken: function(nonce, callback) {
      layer.xhr({
        url: window.layerSample.identityProviderUrl,
        headers: {
          'Content-type': 'application/json',
          'Accept': 'application/json'
        },
        method: 'POST',
        data: {
          nonce: nonce,
          email: window.layerSample.email,
          password: window.layerSample.password
        }
      }, function(res) {
        if (res.success && res.data.identity_token) {
          console.log('challenge: ok');
          // localStorage.setItem('nonce',nonce);
          // localStorage.getItem('')

          callback(res.data.identity_token);

          // Cleanup identity dialog
          var node = window.document && document.getElementById('identity');
          if (node) node.parentNode.removeChild(node);
        } else {
          alert('Login failed; please check your user id and password');
        }
      });
    },
    dateFormat: function(date) {
      var now = new Date();
      if (!date) return now.toLocaleDateString();

      if (date.toLocaleDateString() === now.toLocaleDateString()) return date.toLocaleTimeString();
      else return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    },
    onLogin: function(callback) {
      this.loginCallback = callback;
    }
  };

window.document && document.addEventListener('DOMContentLoaded', function() {
  /**
   * Dirty HTML dialog injection
   */
  var form = document.createElement('form');
  form.innerHTML += '<img src="http://static.layer.com/logo-only-blue.png" />';
  form.innerHTML += '<h1>Welcome To React Layer Chat App!</h1>';
  form.innerHTML += '<div class="login-group"><label for="email">Email</label><input type="text" id="email" /></div>';
  form.innerHTML += '<div class="login-group"><label for="password">Password</label><input type="password" id="password" /></div>';

  var button = document.createElement('button');
  button.type = 'button';
  button.appendChild(document.createTextNode('Login'));

  form.appendChild(button);

  var container = document.createElement('div');
  container.setAttribute('id', 'identity');
  container.appendChild(form);
  document.body.insertBefore(container, document.querySelectorAll('.main-app')[0]);

  function submit() {
    window.layerSample.email = document.getElementById('email').value;
    window.layerSample.password = document.getElementById('password').value;
    if (window.layerSample.email && window.layerSample.password) {
      window.layerSample.loginCallback(window.layerSample.userId);
    } else {
      alert("Please fill in an email address and password");
    }
  }

  button.addEventListener('click', submit);
  form.addEventListener('submit', submit);
});
