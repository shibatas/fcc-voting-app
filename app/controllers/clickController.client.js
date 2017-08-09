'use strict';

(function () {

   var btn1 = document.querySelector('.btn-1');
   var btn2 = document.querySelector('.btn-2');
   var deleteButton = document.querySelector('.btn-delete');
   var clickNbr = document.querySelector('#click-nbr');
   var apiUrl = appUrl + '/api/:id/clicks';
   
   var choices = ['Great!', 'Meh...'];

   function updateClickCount (data) {
      var clicksObject = JSON.parse(data);
      var output = {};
      var keys = ['btn1','btn2'];
      for(var i=0; i<choices.length; i++) {
         output[choices[i]] = clicksObject[keys[i]];
      }

      clickNbr.innerHTML = JSON.stringify(output);//clicksObject.clicks;
   }

   ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, updateClickCount));

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

})();
