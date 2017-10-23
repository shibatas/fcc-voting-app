'use strict';

(function () {
   /*global ajaxFunctions appUrl React ReactDOM d3*/

   var apiUrl = appUrl + '/poll/:id';
   var id = window.location.pathname.split('/').pop();
   var dataUrl = appUrl + '/renderPoll/' + id;
   var voteUrl = appUrl + '/vote/' + id;
   var shareUrl = appUrl + '/poll/' + id;
   var userApi = appUrl + '/api/:id';
   var output = {};

   ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', dataUrl, function(result) {

      var poll = JSON.parse(result);

      renderPage(poll);

      isLoggedIn(function() {
        shareButtons(poll);
      });

      isOwner(poll, function() {
        renderAuthorContents(poll);
      });

   }));

   //runs callback only if logged in as the owner of the poll
   function isOwner(poll, callback) {
     ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', userApi, function (data) {
       if (data[0] !== '<') {
         var userObject = JSON.parse(data);
         var username = userObject.username;
         //check to see if user is the poll owner
         if (poll.username === userObject.username) {
           console.log('Verified as poll creator.');
           callback();
         }
       }
     }));
   }

   //runs callback only if logged in
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

   function updateClickCount () {
      console.log('update click count');

      ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', dataUrl, function(result) {
         var data = JSON.parse(result);
         renderResult(data.choices);
      }));
   }

   function renderPage(poll) {
      renderChoices(poll);

      renderActions();

      renderPage.state = true;
   }

   function renderAuthorContents(poll) {
     //console.log(poll);
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
              React.createElement('p', {}, 'As the creator of this poll you can also do the following:'),
              React.createElement(resetClass),
              React.createElement(deleteClass))),
        document.getElementById('author-actions'));
   }

   function renderChoices (poll) {

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
            React.createElement('p', {}, poll.question),
            React.createElement('btn', {}, buttons)),
         document.getElementById('vote')
      );
   }

   function renderResult (poll) {
     //confirm that results are not empty.
     var sum = 0;
     for (var prop in poll) {
       sum += poll[prop].count;
     };

     if (sum > 0) {
       chart(poll);
       renderResult.state = true;
     } else {
       ReactDOM.render(
         React.createElement('p',{},
           'No data... please vote first!'),
         document.getElementById('results')
       );
     }
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

   function shareButtons(poll) {
     var shareTxt = 'text=' + poll.question;

     var tweet = React.createClass({
       render: function() {
         return (
           React.createElement('a', {
             className: 'fa fa-twitter',
             href: 'https://twitter.com/intent/tweet?' + shareTxt + '&url=' + shareUrl,
             target: '_blank'
           }, ''));
       }
     });

     var facebook=React.createClass({
       render: function() {
         return (
           React.createElement('a', {
             className: 'fa fa-facebook',
             href: 'https://www.facebook.com/sharer/sharer.php?' + shareUrl,
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

      ReactDOM.render(
         React.createElement('div', {className: 'btn-container'},
           React.createElement('button', {
              className: 'btn btn-delete',
              onClick: function(){updateClickCount()}
           }, 'Show Results'),
           React.createElement('button', {
              className: 'btn btn-delete',
              onClick: function(){window.location = appUrl}},
              'Back to Poll Selection'
           )),
         document.getElementById('actions'));
   }

   function chart(chartData) {
      console.log('graph function');
      console.log(chartData);

     var targetID = '#results';

     d3.select(targetID).selectAll('svg').remove();
     d3.select(targetID).selectAll('p').remove();

     var w = 360,
       h = 360,
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
