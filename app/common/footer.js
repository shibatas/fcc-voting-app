
ReactDOM.render(
    React.createElement('div', { className: "container footer"},
      React.createElement('br'),
      React.createElement('hr'),
      //React.createElement('br'),
      React.createElement('p', {}, 'This is a ',
        React.createElement('a', {
          href: "https://www.freecodecamp.org/challenges/build-a-voting-app",
          target: "_blank" }, 'freeCodeCamp project'),
        '. See my other work on ',
        React.createElement('a', {
          href: "https://github.com/shibatas/",
          target: "_blank" },
          React.createElement('img', {
            src: "/public/img/GitHub-Mark-32px.png",
            width: '20', height: '20'})),
        '  and  ',
        React.createElement('a', {
          href: "https://codepen.io/Shohei51/",
          target: "_blank" },
          React.createElement('img', {
            src: "/public/img/codepen.png",
            width: '20', height: '20'}))),
      React.createElement('p', {}, 'Shohei Shibata \u00A9 copyright 2017')
    ), document.getElementsByTagName('footer')[0]
);

/*
<div class="container footer">
  <br><hr><br>
  <p>This is a <a href="https://www.freecodecamp.org/challenges/build-a-voting-app" target="_blank">freeCodeCamp project</a>.
    See my other work on <a class="fa fa-github fa-2x" aria-hidden="true" href="https://github.com/shibatas/" target="_blank"></a> and
    <a class="fa fa-codepen fa-2x" aria-hidden="true" href="https://codepen.io/Shohei51/" target="_blank"></a></p>
  <p>Shohei Shibata &#9426; copyright 2017</p>
</div>
*/
