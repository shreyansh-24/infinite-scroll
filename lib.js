var vm;

function InfiniteScroller(config) {
  vm = this;
  vm.el = config.element;
  vm.initData = config.data;
  vm.limit = config.limit;
  vm.offset = config.offset;
  vm.onRefresh = config.onRefresh;
}

InfiniteScroller.prototype.render = function () {
  vm.el.addEventListener('scroll', (event) => vm.listItemScrollHandler(event, this))

  const itemLimit = Math.min(vm.limit, vm.initData.length);

  for (let i = 0; i < itemLimit; i += 1) {
    vm.createDataListElement(vm.el, { data: vm.initData[i] });
  }
}

InfiniteScroller.prototype.listItemScrollHandler = function (event) {
  const listItems = event.target.querySelectorAll('li');

  listItems.forEach((item, index, self) => {
    const len = self.length - 1;
    if (len === index && isElementInViewport(item, event.target)) {
      vm.onRefreshTrigger(vm.onRefresh);
    }
  });
}


InfiniteScroller.prototype.createDataListElement = function (listWrapper, config) {
  const unorderedListContainer = listWrapper.querySelector('ul');
  const listElem = document.createElement('li');
  listElem.innerHTML = config.data;
  listElem.classList.add('padding-md');
  unorderedListContainer.appendChild(listElem);
}


function isElementInViewport(el, wrapper) {
  var elementRect = el.getBoundingClientRect();
  var wrapperRect = wrapper.getBoundingClientRect();

  return (
    elementRect.top >= 0 &&
    elementRect.left >= 0 &&
    wrapperRect.top < elementRect.top &&
    wrapperRect.bottom > elementRect.bottom
  );
}


InfiniteScroller.prototype.onRefreshTrigger = function (func) {
  let data = func();

  if (!(data instanceof Promise)) {
    data = Promise.resolve(data);
  }

  data.then(dataItems => {
    dataItems.forEach(dataItem => {
      vm.createDataListElement(vm.el, { data: dataItem });
    });
  }).catch(err => {
    throw (err);
  });
}


