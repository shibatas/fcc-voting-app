'use strict';

/*global appUrl*/
/*global ajaxFunctions*/

function submitForm() {
   var apiUrl = appUrl + '/form';
   var newPoll = {
   	question: document.getElementById('question').value,
	   choices: {}
      };
   
   for (var i=1; i<6; i++) {
      var str = 'choice' + i.toString();
      if (document.getElementById(str).value) {
         newPoll.choices[i] = [document.getElementById(str).value, 0];
      }
   }
   
   console.log(JSON.stringify(newPoll));
   
   ajaxFunctions.ready(ajaxFunctions.ajaxRequest('POST', apiUrl, function(id) {
      console.log(id);
      
   }, newPoll));
}