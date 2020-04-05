const DL2416 = require("./dl2416");

let isOn = false;

E.setTimeZone(-7);

const getTimeStr = () => {
  const now = new Date();
  const hourStr = "" + now.getHours();
  const minStr = ("0" + now.getMinutes()).substr(-2);
  return (hourStr.length > 1) ?
    hourStr + minStr :
    hourStr + ":" + minStr;
};

function getDateStr() {
  const now = new Date();
  return now.toString().substr(0, 15).toUpperCase();
}

const dl2416 = DL2416.connect(
  D3, D31, D30, D29, D26, D27, D28, D25,
  D14, D15, D16, D17, D18, D19, D20, D22
);

// dl2416.write(getTimeStr());
// dl2416.write("DUDE");
// dl2416.write("HI");

// dl2416.clear(() => {
//   // dl2416.showCursor();
//   // dl2416.flashCursor();
//   dl2416.write("HACK");
// })
dl2416.clear();
dl2416.write('HACK');
// dl2416.setCursor(0);
// dl2416.setCursor(2);
// dl2416.flashCursor(250);


// const symbols = ['/', '-', '\\'];
// let sI = 0;

// setInterval(() => {
//   s = symbols[sI];
//   sI = (sI + 1) % symbols.length;
//   dl2416.write(s + s + s + s);
// }, 50);


// dl2416.clear(() => {
//   dl2416.write("HI");
// });
// dl2416.scroll("HELLO DAN THIS IS COOL");


let mode = 'off';
let sleepTimeout;
let sleepDelay = 4000;

setTimeout(() => {
  dl2416.turnOff();
}, sleepDelay);


function sleepDisplay() {

}

function wakeDisplay() {
  dl2416.turnOn();
  if(sleepTimeout !== undefined) clearTimeout(sleepTimeout);
  sleepTimeout = setTimeout(() => {
    dl2416.turnOff();
    dl2416.stopScroll();
    mode = 'off';
  }, sleepDelay);
}

setWatch(() => {
  if(mode === 'off') {
    // turn on and display time
    mode = 'time';
    dl2416.write(getTimeStr());
    // dl2416.write("HACK");
    wakeDisplay();
  } else if(mode === 'time') {
    // change to date mode and display date
    mode = 'date';
    dl2416.scroll(getDateStr());
    wakeDisplay();
  } else if(mode === 'date') {
    mode = 'message';
    dl2416.scroll("ADAFRUIT SHOW N TELL");
    wakeDisplay();
  } else {
    // turn off display
    dl2416.stopScroll();
    mode = 'off';
    dl2416.turnOff();
  }

}, BTN1, {repeat: true, edge: 'rising', debounce: 10});
