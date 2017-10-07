'use strict';

(function () {
   /*global ajaxFunctions appUrl React ReactDOM d3*/

   var apiUrl = appUrl + '/poll/:id';
   var id = window.location.search.substr(1);
   console.log(id);
   var dataUrl = appUrl + '/renderPoll/' + id;
   var voteUrl = appUrl + '/vote/' + id;
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
     var sum = 0;
     for (var prop in data) {
       sum += data[prop].count;
     };

     if (sum > 0) {
       chart(data);
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

   function renderActions (data) {
      var resetClass = React.createClass({
         propTypes: {
            reset: React.PropTypes.func
         },

         reset: function() {
            ajaxFunctions.ready(ajaxFunctions.ajaxRequest('DELETE', voteUrl+"/RESET", function(result) {
               console.log(JSON.stringify(result));
                  //updateClickCount();
                  hideResult();
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
               /*React.createElement('button', {
                  className: 'btn btn-hide',
                  onClick: function(){hideResult()}
               }, 'Hide Results'),*/
               React.createElement(resetClass)),
            React.createElement('div', {className: 'btn-container'},
               React.createElement('a', {
                  href: appUrl + '/delete/' + id,
                  className: 'btn btn-delete'
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
