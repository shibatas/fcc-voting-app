'use strict';

(function () {
   /*global ajaxFunctions appUrl React ReactDOM d3*/

   var apiUrl = appUrl + '/poll/:id';
   var id = window.location.pathname.split('/').pop();
   var dataUrl = appUrl + '/renderPoll/' + id;
   var voteUrl = appUrl + '/vote/' + id;
   var pollUrl = appUrl + '/poll/' + id;
   var userApi = appUrl + '/api/:id';
   var editUrl = appUrl + '/form?action=edit&id=' + id;
   var updateApi = appUrl + '/updatePoll';
   var poll = {};
   var newChoice;

   //runs callback only if logged in as the owner of the poll
   var isOwner = function(poll, callback) {
     isOwner.state = false;
     ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', userApi, function (data) {
       if (data[0] !== '<') {
         var userObject = JSON.parse(data);
         var username = userObject.username;
         //check to see if user is the poll owner
         if (poll.username === userObject.username) {
           console.log('Verified as poll creator.');
           isOwner.state = true;
           callback();
         }
       }
     }));
     return isOwner.state;
   }
   //runs callback only if logged in
   var isLoggedIn = function(callback) {
     isLoggedIn.state = false;
     ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', userApi, function (data) {
       if (data[0] !== '<') {
         var userObject = JSON.parse(data);
         var username = userObject.username;
         //check to see if user is the poll owner
         if (userObject.username) {
           console.log('Verified as logged in.');
           isLoggedIn.state = true;
           if (callback) {
             callback();
           }
         }
       } else {
         console.log('not logged in');
       }
     }));
     return isLoggedIn.state;
   }

   isLoggedIn();

   ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', dataUrl, function(result) {

      poll = JSON.parse(result);

      renderPage(poll);

      isLoggedIn(function() {
        shareButtons(poll);
      });

      isOwner(poll, function() {
        renderOwnerContents(poll);
      });

   }));

   function updateClickCount () {
      ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', dataUrl, function(result) {
         var data = JSON.parse(result);
         renderResult(data.choices);
      }));
   }

   function renderPage() {
      renderChoices(poll);

      renderActions();

      renderPage.state = true;
   }

   function renderOwnerContents() {
     //console.log(poll);
     var editClass = React.createClass({
        render: function() {
           return (
             React.createElement('button', {
                 className: 'btn btn-delete',
                 onClick: function() {window.location = editUrl;}
              }, "Edit this poll")
           );
        }
     });

     var resetClass = React.createClass({
        propTypes: {
           reset: React.PropTypes.func
        },

        reset: function() {
          isOwner(poll, function() {
            ajaxFunctions.ajaxRequest('DELETE', voteUrl+"/RESET", function(result) {
                 hideResult();
            });
          });
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

     var deleteClass = React.createClass({
       propTypes: {
         delete: React.PropTypes.func
       },
       delete: function() {
         isOwner(poll, function () {
           ajaxFunctions.ajaxRequest('GET', appUrl + '/delete/' + poll._id, function(result) {
                 console.log('poll successfully deleted. Redirect to home.');
                 window.location = appUrl;
           });
         });
       },
       render: function() {
         return(
           React.createElement('btn', {
              className: 'btn btn-delete',
              onClick: this.delete
           }, 'Delete this poll')
         );
       }

     });

     ReactDOM.render(
        React.createElement('div', {},
           React.createElement('div', {className: 'btn-container'},
              React.createElement('hr'),
              React.createElement('br'),
              React.createElement('p', {}, 'As the creator of this poll you can also do the following:'),
              React.createElement(editClass),
              React.createElement(resetClass),
              React.createElement(deleteClass))),
        document.getElementById('author-actions'));
   }

   function renderChoices() {
     //console.log(poll.total);

      var choices = poll.choices;

      var item = React.createClass({
         propTypes: {
            id: React.PropTypes.number.isRequired,
            choice: React.PropTypes.string.isRequired,
            count: React.PropTypes.number.isRequired,
            submitVote: React.PropTypes.func
         },

         submitVote: function() {
            //console.log(this.props.id);
            ajaxFunctions.ready(ajaxFunctions.ajaxRequest(
              'GET', voteUrl+"/"+this.props.id, function(result) {
                if (result === "already voted") {
                  alert('This user/IP address has already voted.');
                }
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

      //populate newChoice button only if logged in.
      var newChoiceClass = React.createClass({
        propTypes: {
          form: React.PropTypes.func
        },
        form: function() {
          ReactDOM.render(
             React.createElement('div', {},
                React.createElement('h3', {}, poll.question),
                //React.createElement('btn', {}, buttons),
                React.createElement('br'),
                React.createElement(newChoiceForm)),
             document.getElementById('poll')
          );
        },
        render: function() {
            return (
              React.createElement('button', {
                className: 'btn btn-delete',
                onClick: this.form
              }, "New choice")
            );
        }
      });;
      var newChoiceElement = null;
      if (isLoggedIn.state) { newChoiceElement = React.createElement(newChoiceClass); }

      var newChoiceForm = React.createClass({
        propTypes: {
          submit: React.PropTypes.func,
          cancel: React.PropTypes.func
        },
        submit: function() {
          var newChoice = document.getElementById('newChoice').value;
          if (newChoice.length < 1) {
            alert('Please type a new choice first!');
          } else {
            var num = poll.choices.length;
            poll.choices[num] = {
               'id':  num+1,
               'choice': newChoice,
               'count': 0
            };
            ajaxFunctions.ajaxRequest('POST', updateApi, function(id) {
               renderChoices();
            }, poll);
          }
        },
        cancel: function() {
          window.location = pollUrl;
        },
        render: function() {
          return(
            React.createElement('form', { className: 'box'},
              React.createElement('p', {}, 'Enter a new choice and click submit: '),
              React.createElement('input', {
                type: 'text',
                id: 'newChoice'
              }),
              React.createElement('input', {
                className: 'btn btn-submit',
                type: 'submit',
                value: 'Submit',
                onClick: this.submit
              }),
              React.createElement('button', {
                className: 'btn btn-cancel',
                onClick: this.cancel
              }, 'Cancel'))
          );
        }
      });

      //DOM render operations
      ReactDOM.render(
         React.createElement('div', {},
            React.createElement('h3', {}, poll.question),
            React.createElement('btn', {}, buttons),
            //React.createElement('br'),
            newChoiceElement),
         document.getElementById('poll')
      );
   }

   function renderResult (result) {
     //confirm that results are not empty.
     var sum = 0;
     for (var prop in result) {
       sum += result[prop].count;
     };

     if (sum > 0) {
       chart(result);
       renderResult.state = true;
     } else {
       ReactDOM.render(
         React.createElement('p',{},
           'No data... please vote first!'),
         document.getElementById('results')
       );
     }
     //re-render buttons after state change
     renderActions();
   }

   function hideResult() {
     console.log('hide result');
     ReactDOM.unmountComponentAtNode(
       document.getElementById('results')
     );
     ReactDOM.render(
       React.createElement('p',{}),
       document.getElementById('results'));
     renderResult.state = false;
   }

   function shareButtons() {
     var shareTxt = 'text=' + poll.question;

     var tweet = React.createClass({
       render: function() {
         return (
           React.createElement('a', {
             className: 'fa fa-twitter',
             href: 'https://twitter.com/intent/tweet?' + shareTxt + '&url=' + pollUrl,
             target: '_blank'
           }, ''));
       }
     });

     var facebook=React.createClass({
       render: function() {
         return (
           React.createElement('a', {
             className: 'fa fa-facebook',
             href: 'https://www.facebook.com/sharer/sharer.php?' + pollUrl,
             target: '_blank'
           }, ''));
       }
     });

     ReactDOM.render(
        React.createElement('div', {className: 'btn-container'},
              React.createElement(tweet),
              React.createElement(facebook)),
        document.getElementById('share'));
   }

   function renderActions () {
      var showResult = null;

      if (renderResult.state !== true) {
        showResult = React.createElement('button', {
         className: 'btn btn-delete',
         onClick: function(){
           updateClickCount();
           renderActions(); }
         }, 'Show Results');
      }

      var backToPollSelection = React.createElement('button', {
         className: 'btn btn-delete',
         onClick: function(){window.location = appUrl}},
         'Back to Poll Selection');

      ReactDOM.render(
         React.createElement('div', {className: 'btn-container'},
           showResult,
           backToPollSelection),
         document.getElementById('actions'));
   }

   function chart(chartData) {
      //console.log('graph function');
      //console.log(chartData);

     var targetID = '#results';

     d3.select(targetID).selectAll('svg').remove();
     d3.select(targetID).selectAll('p').remove();

     var w = 360,
       h = 400,
       r = 180;

     var color = d3.scaleOrdinal(d3.schemeCategory20b);

     var svg = d3.select(targetID)
       .append('svg')
       .attr('width', w)
       .attr('height', h)
       .append('g')
       .attr('transform', 'translate(' + (w/2) + ',' + (h/2) + ')');

     var arc = d3.arc()
       .innerRadius(0)
       .outerRadius(r);

     var pie = d3.pie()
       .value(function(d) {return d.count})
       .sort(null);

     var path = svg.selectAll('path')
       .data(pie(chartData))
       .enter();

     path.append('path')
         .attr('d', arc)
         .attr('fill', function (d, i) {
           return color(d.data.choice); });

     path.append('text')
       .attr('transform', function(d) {
         d.innerRadius = 0;
         d.outerRadius = r;
         return "translate(" + arc.centroid(d) + ")";
       })
       .attr('text-anchor', 'middle')
       .text(function (d) {
         var text = d.data.choice + ': ' + d.data.count;
         return text;
       });
     }


})();
