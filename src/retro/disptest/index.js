const DL2416 = require("../dl2416");

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
// dl2416.write('TEST');
dl2416.scroll('HELLO WORLD');

setTimeout(() => {
  dl2416.scroll('HELLO WORLD');
}, 2000);

// dl2416.setCursor(1);
// dl2416.setCursor(3);
// dl2416.flashCursor();

setTimeout(() => {
  dl2416.unsetCursor(1);
  dl2416.unsetCursor(2);
}, 5500);

//
setTimeout(() => {
  dl2416.turnOff();
}, 10000);
// dl2416.setCursor(0);
// dl2416.setCursor(2);
// dl2416.flashCursor(250);

