'use strict';
   
(function () {
   /*global ajaxFunctions appUrl React ReactDOM*/
   var apiUrl = appUrl + '/poll/:id';
   var id = window.location.search.substr(1);
   console.log(id);
   var dataUrl = appUrl + '/renderPoll/' + id;
   
   var output = {};

   console.log(dataUrl);
   ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', dataUrl, function(result) {
      renderPoll(result);
   }));
   ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, updateClickCount));

   function updateClickCount (data) {
      console.log('update click count');
      /*var clicksObject = JSON.parse(data);
      var keys = ['btn1','btn2'];
      for(var i=0; i<choices.length; i++) {
         output[choices[i]] = clicksObject[keys[i]];
      }
      console.log(output.toString());
      if (renderResult.state) {renderResult();}*/
   }
   
   function renderPoll(result) {
      var data = JSON.parse(result);
      console.log(JSON.stringify(data));
      ReactDOM.render(
         React.createElement('div', {}, 
            React.createElement('p', {}, data.question),
            React.createElement('div', {className: 'btn-container'},
               React.createElement('button', {
                  className: 'btn btn-1',
                  onClick: function(){vote(data.choices[1][0])}
               }, data.choices[1][0]),
               React.createElement('button', {
                  className: 'btn btn-1',
                  onClick: function(){vote(data.choices[2][0])}
               }, data.choices[2][0])),
            React.createElement('div', {
               className: 'container',
               id: 'results'
               }),
            React.createElement('div', {className: 'btn-container'},
               React.createElement('button', {
                  className: 'btn btn-show',
                  onClick: function(){renderResult()}
               }, 'Show Results'),
               React.createElement('button', {
                  className: 'btn btn-hide',
                  onClick: function(){hideResult()}
               }, 'Hide Results'),
               React.createElement('button', {
                  className: 'btn btn-delete',
                  onClick: function(){reset()}
               }, "RESET")),
            React.createElement('div', {className: 'btn-container'},
               React.createElement('button', {
                  className: 'btn',
                  onClick: function(){window.location = appUrl}},
                  'Back to Poll Selection'
               ))
            ),
         document.getElementById('vote'));
      renderPoll.state = true;
   }
   
   function table(props) {
      return React.createElement('p', {}, choices[props.num] + ': ' + props.result);
   }
   
   function renderResult() {
      ReactDOM.render(
         React.createElement('div', {}, 
            React.createElement(table,{
               result: output[choices[0]],
               num: 0
            }),
            React.createElement(table,{
               result: output[choices[1]],
               num: 1
            })),
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

   function vote(voteID) {
      alert('voted for: ' + voteID);
   }

   function reset(data) {
      alert('reset data');
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
