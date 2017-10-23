'use strict';

(function() {

   /*global appUrl ajaxFunctions React ReactDOM*/
   var apiUrl = appUrl + '/api/:id';
   var pollUrl = '/poll/';
   var formUrl = appUrl + '/form';
   var retrieveUrl = appUrl + '/renderQuestions';
   var userApi = appUrl + '/api/:id';

   //render all polls
   ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', retrieveUrl, function (result) {
      renderPolls(JSON.parse(result));

      isLoggedIn(function() {actions(JSON.parse(result));});
   }));

   function isLoggedIn(callback) {
     ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', userApi, function (data) {
       if (data[0] !== '<') {
         var userObject = JSON.parse(data);
         var username = userObject.username;
         //check to see if user is the poll owner
         if (userObject.username) {
           console.log('Verified as logged in.');
           callback();
         }
       } else {
         console.log('not logged in');
       }
     }));
   }

   function renderPolls(data) {
      var questionLink = React.createClass({
         propTypes: {
            question: React.PropTypes.string.isRequired,
            _id: React.PropTypes.string.isRequired,
         },

         render: function() {
            return (
               React.createElement('a', {
                  key: this.props._id,
                  href: pollUrl + this.props._id,
                  className: 'btn'
                  }, this.props.question)
            );
         }
      });

      var questions = data.map(function(data) { return React.createElement(questionLink, data) })

      ReactDOM.render(
         React.createElement('div', {},
            React.createElement('p', {}, 'Which question do you want to answer?'),
            React.createElement('div', {}, questions)),
         document.getElementById('questions'));
      renderPolls.state = true;
   }

   function actions(data) {
     ReactDOM.render(
        React.createElement('div', {className: 'btn-container'},
           React.createElement('button', {
                 type: 'submit',
                 className: 'btn btn-delete',
                 onClick: function() { window.location = formUrl }
              }, 'Create a new poll'),
           React.createElement('button', {
                 type: 'submit',
                 className: 'btn btn-delete',
                 onClick: function() { isLoggedIn(function(){renderMyPolls(data)} ); } //code too messy. change this to React Class
           }, 'Show only my polls')
        ),
        document.getElementById('actions'));
   }

   function renderMyPolls(data) {
      /*ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', retrieveUrl, function (result) {
        renderPolls(JSON.parse(result));
      }));
      var questionLink = React.createClass({
         propTypes: {
            question: React.PropTypes.string.isRequired,
            _id: React.PropTypes.string.isRequired,
         },

         render: function() {
            return (
               React.createElement('a', {
                  key: this.props._id,
                  href: pollUrl + this.props._id,
                  className: 'btn'
                  }, this.props.question)
            );
         }
      });

      var questions = data.map(function(data) { return React.createElement(questionLink, data) })
*/
      ReactDOM.render(
         React.createElement('div', {},
            React.createElement('p', {}, 'Showing user questions only')),
         document.getElementById('questions'));

      ReactDOM.render(
        React.createElement('div', {className: 'btn-container'},
           React.createElement('button', {
                 type: 'submit',
                 className: 'btn btn-delete',
                 onClick: function() { window.location = formUrl }
              }, 'Create a new poll'),
           React.createElement('button', {
                 type: 'submit',
                 className: 'btn btn-delete',
                 onClick: function() { window.location = '/' }
           }, 'Show all polls')
        ),
        document.getElementById('actions'));

     }
})();
