# 平行任务控制

```js
class SuperTask {
  constructor(parallelCount = 2) {
    this.parallelCount = parallelCount;
    this.runningCount = 0;
    this.tasks = [];
  }

  add(task) {
    return new Promise((resolve, reject) => {
      this.tasks.push({ task, resolve, reject });
      this._run();
    });
  }

  _run() {
    while (this.runningCount < this.parallelCount && this.tasks.length) {
      const { task, resolve, reject } = this.tasks.shift();
      this.runningCount++;
      Promise.resolve(task())
        .then(resolve, reject)
        .finally(() => {
          this.runningCount--;
          this._run();
        });
    }
  }
}

function timeout(time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

const superTask = new SuperTask();

function addTask(time, name) {
  superTask
    .add(() => timeout(time))
    .then(() => {
      console.log(`The task ${name} done`);
    });
}

// Test

function test() {
  addTask(10e3, 1);
  addTask(5e3, 2);
  addTask(3e3, 3);
  addTask(4e3, 4);
  addTask(5e3, 5);
}

test();

// The output of the test will be:
//
// The task 2 done
// The task 3 done
// The task 1 done
// The task 4 done
// The task 5 done
```
