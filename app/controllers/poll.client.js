'use strict';
   
(function () {
   /*global ajaxFunctions appUrl React ReactDOM*/
   var apiUrl = appUrl + '/poll/:id';
   var id = window.location.search.substr(1);
   console.log(id);
   var dataUrl = appUrl + '/renderPoll/' + id;
   var voteUrl = appUrl + '/vote/' + id;
   //var resetUrl = appUrl + 
   var output = {};
   
   ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', dataUrl, function(result) {
      renderPage(result);
   }));

   function updateClickCount () {
      console.log('update click count');
      
      ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', dataUrl, function(result) {
         var data = JSON.parse(result);
         renderResult(data.choices);
      }));
   }
   
   function renderPage(result) {
      var data = JSON.parse(result);
      
      renderChoices(data);
      
      renderActions(data);
      
      renderPage.state = true;
   }
   
   function renderChoices (data) {
      
      var choices = data.choices;
      
      var item = React.createClass({
         propTypes: {
            id: React.PropTypes.number.isRequired,
            choice: React.PropTypes.string.isRequired,
            count: React.PropTypes.number.isRequired,
            submitVote: React.PropTypes.func
         },
         
         submitVote: function() {
            console.log(this.props.id);
            ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', voteUrl+"/"+this.props.id, function(result) {
               console.log(JSON.stringify(result));
                  updateClickCount();
            }));
            
            
         },
         
         render: function() {
            return (
               React.createElement('button', {
                  key: this.props.id,
                  className: 'btn btn-1',
                  onClick: this.submitVote
               }, this.props.choice)
            );
         }
      });
    
      var buttons = choices.map(function(choices) { return React.createElement(item, choices) });
      
      ReactDOM.render(
         React.createElement('div', {}, 
            React.createElement('p', {}, data.question),
            React.createElement('btn', {}, buttons)),
         document.getElementById('vote')
      );
   }
   
   function renderResult (data) {
      
      var item = React.createClass({
         propTypes: {
            id: React.PropTypes.number.isRequired,
            choice: React.PropTypes.string.isRequired,
            count: React.PropTypes.number.isRequired
         },
         
         render: function() {
            var text = this.props.choice + ': ' + this.props.count;
            return (
               React.createElement('p', {
                  key: this.props.id,
                  }, text)
            );
         }
      });
   
      var graph = data.map(function(data) { return React.createElement(item, data) });
      
      ReactDOM.render(
         React.createElement('div', {}, graph),
         document.getElementById('results'));
      renderResult.state = true;
   }
   
   function hideResult() {
      ReactDOM.unmountComponentAtNode(
         document.getElementById('results')
      );
      ReactDOM.render(
         React.createElement(
            'p',{},'Results hidden'   
         ),
         document.getElementById('results'));
      renderResult.state = false;
   }
   
   function renderActions (data) {
      var resetClass = React.createClass({
         propTypes: {
            reset: React.PropTypes.func
         },
         
         reset: function() {
            ajaxFunctions.ready(ajaxFunctions.ajaxRequest('DELETE', voteUrl+"/RESET", function(result) {
               console.log(JSON.stringify(result));
                  updateClickCount();
            }));
         },
         
         render: function() {
            return (
              React.createElement('button', {
                  className: 'btn btn-delete',
                  onClick: this.reset
               }, "RESET")
            );
         }
      });
      
      ReactDOM.render(
         React.createElement('div', {}, 
            React.createElement('div', {className: 'btn-container'},
               React.createElement('button', {
                  className: 'btn btn-show',
                  onClick: function(){updateClickCount()}
               }, 'Show Results'),
               React.createElement('button', {
                  className: 'btn btn-hide',
                  onClick: function(){hideResult()}
               }, 'Hide Results'),
               React.createElement(resetClass)),
            React.createElement('div', {className: 'btn-container'},
               React.createElement('a', {
                  href: appUrl + '/delete/' + id,
                  className: 'btn'
               }, 'Delete this poll')),
            React.createElement('div', {className: 'btn-container'},
               React.createElement('button', {
                  className: 'btn',
                  onClick: function(){window.location = appUrl}},
                  'Back to Poll Selection'
               ))
            ),
         document.getElementById('actions'));
   }

/*
   btn1.addEventListener('click', function () {
      let btn = '?btn=btn1';
      ajaxFunctions.ajaxRequest('POST', apiUrl+btn, function () {
         ajaxFunctions.ajaxRequest('GET', apiUrl, updateClickCount);
      });

   }, false);
   
   btn2.addEventListener('click', function () {
      let btn = '?btn=btn2';
      ajaxFunctions.ajaxRequest('POST', apiUrl+btn, function () {
         ajaxFunctions.ajaxRequest('GET', apiUrl, updateClickCount);
      });
   }, false);

   deleteButton.addEventListener('click', function () {
      ajaxFunctions.ajaxRequest('DELETE', apiUrl, function () {
         ajaxFunctions.ajaxRequest('GET', apiUrl, updateClickCount);
      });

   }, false);
*/
})();
