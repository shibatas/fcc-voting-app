'use strict';

/*global appUrl React ReactDOM*/
/*global ajaxFunctions*/

/*function submitForm() {
   var apiUrl = appUrl + '/form';
   var newPoll = {
   	question: document.getElementById('question').value,
	   choices: []
      };
   
   for (var i=1; i<6; i++) {
      var str = 'choice' + i.toString();
      if (document.getElementById(str).value) {
         newPoll.choices[i-1] = {
            'id':  i,
            'choice': document.getElementById(str).value,
            'count': 0
         };
      }
   }
   
   console.log(JSON.stringify(newPoll));
   
   ajaxFunctions.ready(ajaxFunctions.ajaxRequest('POST', apiUrl, function(id) {
      console.log(id);
      window.location = appUrl;
   }, newPoll));
}*/

function renderForm(numChoices) {
   var question = React.createClass({
      render: function() {
         return (
            React.createElement('p',{},
               'Question: ',
               React.createElement('textarea', {
                  name:'question',
                  id: 'question',
                  rows: '3',
                  cols: '25',
                  style: {'verticalAlign': 'top'}
               }))
         );
      }
   });
   var choice = React.createClass({
      propTypes: {
         num: React.PropTypes.number.isRequired
      },
   
      render: function() {
         return (
            React.createElement('p',{},
               'Choice ' + this.props.num + ': ',
               React.createElement('textarea', {
                  name:'choice' + this.props.num,
                  id: 'choice' + this.props.num,
                  rows: '1',
                  cols: '25',
                  style: {'verticalAlign': 'top'}
               }))
         );
      }
   });
   var arr = [];
   
   for (var i=0; i<numChoices; i++) {
      arr.push(React.createElement(choice, {num: i+1}));
   }

   var addBtn = React.createClass({
      propTypes: {
         moreChoice: React.PropTypes.func
      },
   
      moreChoice: function() {
         console.log('add another line');
         renderForm(numChoices+1);
      },
   
      render: function() {
         return (
            React.createElement('button',{
               className: 'btn',
               onClick: this.moreChoice
            }, 'More choice')
         );
      }
   });

   var delBtn = React.createClass({
      propTypes: {
         lessChoice: React.PropTypes.func
      },
   
      lessChoice: function() {
         if (numChoices > 2) {
            console.log('delete line');
            renderForm(numChoices-1);
         }
      },
   
      render: function() {
         return (
            React.createElement('button',{
               className: 'btn',
               onClick: this.lessChoice
            }, 'Less choice')
         );
      }
   });
   
   var submitBtn = React.createClass({
      propTypes: {
         submitForm: React.PropTypes.func
      },
      
      submitForm: function() {
         var apiUrl = appUrl + '/form';
         var newPoll = {
      	   question: document.getElementById('question').value,
	         choices: []
         };
   
         for (var i=1; i<=numChoices; i++) {
            var str = 'choice' + i.toString();
            if (document.getElementById(str).value) {
               newPoll.choices[i-1] = {
                  'id':  i,
                  'choice': document.getElementById(str).value,
                  'count': 0
               };
            }
         }
   
         ajaxFunctions.ready(ajaxFunctions.ajaxRequest('POST', apiUrl, function(id) {
            console.log(id);
            window.location = appUrl;
         }, newPoll));
      },
      
      render: function() {
         return (
            React.createElement('button',{
               className: 'btn',
               onClick: this.submitForm
            }, 'Submit')
         );
      }
   });

   ReactDOM.render(
      React.createElement('form',{method:'post', id:'form'},
         React.createElement('p',{}, 'Type the question and the choices below'),
         React.createElement(question),
         arr),
      document.getElementById('form-container')
   );
   
   ReactDOM.render(
      React.createElement('div', {className: 'btn-container'}, 
         React.createElement(addBtn),
         React.createElement(delBtn),
         React.createElement(submitBtn)),
      document.getElementById('actions')
   );
   
   return numChoices;
}

var numChoices

numChoices = renderForm(3);

console.log(numChoices);

/*<form method="post" id="form">
				<p>Type the question and the choices below</p>
				<br/>
				<p>Question:&nbsp&nbsp<textarea name="question" id="question" rows="3" cols="25" style="vertical-align: top"></textarea></p>
				<br/>
				<p>Choice 1:&nbsp&nbsp<input name="choice1" id="choice1"></input></p>
				<p>Choice 2:&nbsp&nbsp<input name="choice2" id="choice2"></input></p>
				<p>Choice 3:&nbsp&nbsp<input name="choice3" id="choice3"></input></p>
				<p>Choice 4:&nbsp&nbsp<input name="choice4" id="choice4"></input></p>
				<p>Choice 5:&nbsp&nbsp<input name="choice5" id="choice5"></input></p>
			</form>
				<p><button class="btn" onClick="submitForm()">Submit</button>*/