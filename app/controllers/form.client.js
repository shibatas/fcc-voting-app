'use strict';

var userApi = appUrl + '/api/:id';
var pollUrl = appUrl + '/renderPoll/';
var numChoices = 3;
var poll = {
  question: '',
  choices: [],
  username: ''
};
var newChoice = {
   'id': 0,
   'choice': '',
   'count': 0
};

var params = new URLSearchParams(window.location.search);
var action = params.get('action');
var pollId = params.get('id');
console.log(pollId);

//pre-fill form for editing
if (action === 'edit') {
  //is logged in?
  ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', userApi, function (data) {
    if (data[0] !== '<') {
      var userObject = JSON.parse(data);
      var username = userObject.username;
      if (username) {
        console.log('Verified as logged in.');
        //retrieve poll info by ID
        ajaxFunctions.ajaxRequest('GET', pollUrl + pollId, function (data) {
          var parsed = JSON.parse(data);
          //is poll owner?
          if (parsed.username === username) {
            console.log('Verified as poll owner.');
            poll = parsed;
            numChoices = poll.choices.length;
            renderForm();
          }
        });
      }
    } else {
      console.log('not logged in');
      window.location = '/login';
    }

    }));
}

//render empty form to make new poll
if (action === 'new') {
  for (var i=0; i<numChoices; i++) {
    poll.choices.push(newChoice);
  }

  renderForm();
}

function renderForm() {
  console.log(poll);
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
                  style: {'verticalAlign': 'top'},
                  onChange: function() { update(); },
                  defaultValue: poll.question
               }))
         );
      }
   });
   var choice = React.createClass({
      propTypes: {
         num: React.PropTypes.number.isRequired
      },

      render: function() {
        var text = poll.choices[this.props.num-1].choice;
         return (
            React.createElement('p',{},
               'Choice ' + this.props.num + ': ',
               React.createElement('textarea', {
                  name:'choice' + this.props.num,
                  id: 'choice' + this.props.num,
                  rows: '1',
                  cols: '25',
                  style: {'verticalAlign': 'top'},
                  onChange: function() { update(); },
                  defaultValue: text
               }))
         );
      }
   });

   //creating array of choice fields based on numChoices
   var arr = [];
   for (var i=0; i<numChoices; i++) {
      arr.push(React.createElement(choice, {num: i+1}));
   }

   var addBtn = React.createClass({
      propTypes: {
         moreChoice: React.PropTypes.func
      },

      moreChoice: function() {
         //console.log('add another line');
         poll.choices.push(newChoice);
         numChoices++;
         renderForm(numChoices, poll);
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
            //console.log('delete line');
            poll.choices.pop();
            numChoices--;
            renderForm(poll);
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
         var pollApi = appUrl + '/form';
         var userApi = appUrl + '/api/:id';
         var updateApi = appUrl + '/updatePoll'

         //submit a new poll
         if (action === 'new') {
           var newPoll = {};

           if (poll.question) {
             newPoll.question = poll.question;
           } else {
             alert('Please fill out a question');
             return;
           }

           newPoll.choices = [];
           for (var i=0; i<poll.choices.length; i++) {
             if (poll.choices[i].choice !== '') {
               newPoll.choices.push(poll.choices[i]);
             }
           }

           console.log(newPoll);

           //retrieve username of the logged in user
           ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', userApi, function (data) {
               var userObject = JSON.parse(data);
               newPoll.username = userObject.username;
               //submit new poll to server
               ajaxFunctions.ajaxRequest('POST', pollApi, function(id) {
                  console.log(id);
                  window.location = appUrl;
               }, newPoll);
           }));
         }

         if (action === 'edit') {
           console.log('update existing poll');
           //console.log(poll);

           ajaxFunctions.ajaxRequest('POST', updateApi, function() {
              window.location = appUrl + '/poll/' + pollId;
           }, poll);

         }
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

function update() {
  poll.question = document.getElementById('question').value;
  for (var i=1; i<=poll.choices.length; i++) {
     var str = 'choice' + i.toString();
     if (document.getElementById(str).value) {
        poll.choices[i-1] = {
           'id':  i,
           'choice': document.getElementById(str).value,
           'count': 0
        };
     } else {
       poll.choices[i-1] = {
          'id':  i,
          'choice': '',
          'count': 0
       };
     }
  }
  //console.log(poll);
}
