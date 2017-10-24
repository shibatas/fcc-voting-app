'use strict';

(function() {

   /*global appUrl ajaxFunctions React ReactDOM*/
   var apiUrl = appUrl + '/api/:id';
   var pollUrl = '/poll/';
   var formUrl = appUrl + '/form';
   var allPollsUrl = appUrl + '/renderPolls?useronly=false';
   var myPollsUrl = appUrl + '/renderPolls?useronly=true';
   var userApi = appUrl + '/api/:id';

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

   function renderPolls(url) {
     ajaxFunctions.ajaxRequest('GET', url, function (result) {
       var data = JSON.parse(result);
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
     });
   }

   var actions = function() {
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
                 onClick: function() { isLoggedIn(function(){renderMyPolls()} ); } //code too messy. change this to React Class
           }, 'Show only my polls')
        ),
        document.getElementById('actions'));
   }

   function renderMyPolls() {
      ajaxFunctions.ready(
        ajaxFunctions.ajaxRequest('GET', userApi, function (data) {
          if (data[0] !== '<') {
            var userObject = JSON.parse(data);
            var username = userObject.username;

            if (userObject.username) {
              console.log('Verified as logged in.');
              var url = myPollsUrl + '&username=' + username;
              console.log(url);
              renderPolls(url);

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
                         onClick: function() {
                           renderPolls(allPollsUrl);
                           isLoggedIn(actions); }
                   }, 'Show all polls')
                ),
                document.getElementById('actions'));
            }
          } else {
            console.log('not logged in');
          }
      }));
    }

    //render all polls
    ajaxFunctions.ready(renderPolls(allPollsUrl));
    isLoggedIn(actions);
})();
