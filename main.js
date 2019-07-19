(function () {

  const startButton = document.querySelector('#startButton');

  startButton.addEventListener('click', buttonClick);

  function buttonClick(event) {
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then(posts => posts.json())
      .then(initializeScroller);
  }


  function initializeScroller(items) {
    const infiniteScroller = new InfiniteScroller({
      element: document.querySelector('.list-wrapper'),
      data: items.map(item => item.title),
      limit: 7,
      offset: 0,
      onRefresh: function () {
        return fetch('https://jsonplaceholder.typicode.com/posts')
          .then(data => data.json())
          .then(data => data.map(item => item.title));
      }
    }).render();

  };


})()
