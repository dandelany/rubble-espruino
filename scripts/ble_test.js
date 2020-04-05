const { init } = require("espruino");

//override default console.log
var log = console.log;
// console.log = function() {};

function Queue(concurrency = 1) {
  let running = 0;
  const taskQueue = [];

  const runTask = task => {
    running++;
    task(_ => {
      running--;
      if (taskQueue.length > 0) {
        runTask(taskQueue.shift());
      }
    });
  };

  const enqueueTask = task => taskQueue.push(task);

  return {
    push: task => (running < concurrency ? runTask(task) : enqueueTask(task))
  };
}

init(() => {
  function checkPorts(done) {
    Espruino.Core.Serial.getPorts(function(ports) {
      if (ports.length >= 2) {
        log("OK ON 1ST TRY");
        done();
      } else { /* Try again */
        Espruino.Core.Serial.getPorts(function(ports) {
          if (ports.length >= 2) log("OK ON 2ND TRY");
          else log("NOT FOUND :(");
          done();
        });
      }
    });
  }

  const queue = Queue(1);

  for (i = 0; i < 1; i++) {
    queue.push(checkPorts);
    queue.push(done => {
      setTimeout(() => done(), 2000);
    });
  }
  queue.push(done => {
    process.exit(0);
    done();
  });
});
