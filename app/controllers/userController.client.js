'use strict';

(function () {

   var profileId = document.querySelector('#profile-id') || null;
   var profileUsername = document.querySelector('#profile-username') || null;
   var profileRepos = document.querySelector('#profile-repos') || null;
   var displayName = document.querySelector('#display-name');
   var apiUrl = appUrl + '/api/:id';

   function updateHtmlElement (data, element, userProperty) {
      element.innerHTML = data[userProperty];
   }

   /*<a class="menu" href="/login">Login</a>
   <a class="menu" href="/profile">Profile</a>
   <p>|</p>
   <a class="menu" href="/logout">Logout</a>*/

  function renderLinks(isLoggedIn) {
    var login = React.createElement('div', {},
      React.createElement('a', {
        className: 'menu',
        href: '/login'
      }, 'Login'));
    var logout = React.createElement('div', {},
      React.createElement('a', {
        className: 'menu',
        href: '/profile'
      }, 'Profile'),
      React.createElement('p', {}, '|'),
      React.createElement('a', {
        className: 'menu',
        href: '/logout'
      }, 'Logout'));

    if (isLoggedIn) {
      ReactDOM.render(logout, document.getElementById('auth-links'));
    } else {
      ReactDOM.render(login, document.getElementById('auth-links'));
    }
  }

   ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, function (data) {
     console.log(data);

     if (data[0] !== '<') {
      var userObject = JSON.parse(data);

      if (userObject.displayName !== null) {
         updateHtmlElement(userObject, displayName, 'displayName');
      } else {
         updateHtmlElement(userObject, displayName, 'username');
      }

      if (profileId !== null) {
         updateHtmlElement(userObject, profileId, 'id');
      }

      if (profileUsername !== null) {
         updateHtmlElement(userObject, profileUsername, 'username');
      }

      if (profileRepos !== null) {
         updateHtmlElement(userObject, profileRepos, 'publicRepos');
      }

      renderLinks(true);

    } else {
      renderLinks(false);
    }

   }));
})();
