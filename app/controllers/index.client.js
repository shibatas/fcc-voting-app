'use strict';

(function() {

   /*global appUrl ajaxFunctions React ReactDOM*/
   var pollUrl = '/poll?';
   var formUrl = appUrl + '/form';
   var retrieveUrl = appUrl + '/renderQuestions';

   ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', retrieveUrl, function (result) {
      var data = JSON.parse(result);
      var questions = [];
      var URL = [];
      
      for (var i=0; i<data.length; i++) {
         URL.push(pollUrl + data[i]._id); 
         questions.push(data[i].question); 
      }
      
      
      
      renderPolls(questions, URL);
   }));
   
   function renderPolls(questions, URL) {
      var children = [];
      
      console.log(URL);
      
      for (var i=0; i<questions.length; i++) {
         children.push(
            React.createElement('button', {
                  type: 'submit',
                  className: 'btn',
                  key: URL[i],
                  onClick: function() {
                     window.location = URL[i];
                  },
               }, questions[i]));
      } 
      
      ReactDOM.render(
         React.createElement('div', {},
            React.createElement('p', {}, 'Which question do you want to answer?'),
            React.createElement('div',{className: 'btn-container'},
               children),
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
