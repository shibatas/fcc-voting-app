'use strict';

(function() {

   /*global appUrl ajaxFunctions React ReactDOM*/
   var pollUrl = '/poll?';
   var formUrl = appUrl + '/form';
   var retrieveUrl = appUrl + '/renderQuestions';

   ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', retrieveUrl, function (result) {
      renderPolls(JSON.parse(result));
   }));
   
   
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
            React.createElement('div', {}, questions),
            React.createElement('button', {
                  type: 'submit',
                  className: 'btn',
                  onClick: function() { window.location = formUrl }
               }, 'Create a new poll')
         ),
         document.getElementById('questions'));
      renderPolls.state = true; 
   }

})();
