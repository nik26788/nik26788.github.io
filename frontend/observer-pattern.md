# 观察者模式

也叫作发布订阅模式，代码实现如下

```js
class Observable {
  constructor() {
    this.observers = [];
  }

  subscribe(callback) {
    this.observers.push(callback);
  }

  unsubscribe(callback) {
    this.observers = this.observers.filter(observer !== callback);
  }

  notify(data) {
    this.observers.forEach((observer) => observer(data));
  }
}

// Test
function test() {
  const observable = new Observable();

  const changePrice = (price) => {
    console.log(price);
  };

  observable.subscribe(changePrice);

  setInterval(() => {
    const price = Math.random().toFixed(4).toString().split(".")[1];
    observable.notify(price);
  }, 1000);
}

test();
```
