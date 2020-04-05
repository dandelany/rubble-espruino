const connect = function(
  PIN_D0,
  PIN_D1,
  PIN_D2,
  PIN_D3,
  PIN_D4,
  PIN_D5,
  PIN_D6,
  PIN_BL,
  PIN_Ad0,
  PIN_Ad1,
  PIN_WR,
  PIN_CU,
  PIN_CUE,
  PIN_CLR,
  PIN_CE1,
  PIN_CE2
) {
  pinMode(PIN_D0, "output");
  pinMode(PIN_D1, "output");
  pinMode(PIN_D2, "output");
  pinMode(PIN_D3, "output");
  pinMode(PIN_D4, "output");
  pinMode(PIN_D5, "output");
  pinMode(PIN_D6, "output");
  pinMode(PIN_WR, "output");
  pinMode(PIN_CLR, "output");
  pinMode(PIN_CU, "output");
  pinMode(PIN_CUE, "output");
  pinMode(PIN_BL, "output");
  pinMode(PIN_Ad0, "output");
  pinMode(PIN_Ad1, "output");

  digitalWrite(PIN_WR, true);
  digitalWrite(PIN_Ad0, true);
  digitalWrite(PIN_Ad1, true);

  digitalWrite(PIN_BL, true);
  digitalWrite(PIN_CLR, true);
  digitalWrite(PIN_CUE, false);
  digitalWrite(PIN_CU, true);

  if (PIN_CE1 !== undefined) {
    pinMode(PIN_CE1, "output");
    digitalWrite(PIN_CE1, false);
  }
  if (PIN_CE2 !== undefined) {
    pinMode(PIN_CE2, "output");
    digitalWrite(PIN_CE2, false);
  }

  const setAddress = position => {
    digitalWrite(PIN_Ad1, (position & 0b10) >> 1);
    digitalWrite(PIN_Ad0, (position & 0b01) >> 0);
  };

  //will output the letter in the determined position
  const setLetter = (letter, position) => {

    setAddress(position);

    const charCode = letter.charCodeAt(0);

    digitalWrite(PIN_D6, (charCode & 0b1000000) >> 6);
    digitalWrite(PIN_D5, (charCode & 0b0100000) >> 5);
    digitalWrite(PIN_D4, (charCode & 0b0010000) >> 4);
    digitalWrite(PIN_D3, (charCode & 0b0001000) >> 3);
    digitalWrite(PIN_D2, (charCode & 0b0000100) >> 2);
    digitalWrite(PIN_D1, (charCode & 0b0000010) >> 1);
    digitalWrite(PIN_D0, (charCode & 0b0000001) >> 0);

    digitalWrite(PIN_WR, 0);
    digitalWrite(PIN_WR, 1);
  };

  //Only the first 4 (or less) letters will be printed
  const print = word => {
    const length = Math.min(word.length, 4);
    for (let i = 0; i < length; i++) {
      let m = length - 1 - i;
      setLetter(word[i], m);
    }
  };

  //this command will clear all the internal four-digit memory
  const clear = cb => {
    digitalWrite(PIN_CLR, 0);
    //according to datasheet we need at least 1 sec to clear
    setTimeout(() => {
      digitalWrite(PIN_CLR, 1);
      cb();
    }, 1000);
  };

  //turnOff will not delete anything, only dim the display
  const turnOff = () => {
    digitalWrite(PIN_BL, 0);
  };

  const turnOn = () => {
    digitalWrite(PIN_BL, 1);
  };

  return {
    setLetter: setLetter,
    print: print,
    clear: clear,
    turnOff: turnOff,
    turnOn: turnOn
  };
};

// connect(
//     D0, D1, D2, D3, D4, D5, D6, BL,
//     Ad0, Ad1, WR, CU, CUE, CLR, CE1, CE2
// )

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

const dl2416 = connect(
  D3, D31, D30, D29, D26, D27, D28, D25,
  D14, D15, D16, D17, D18, D19, D20, D22
);

// dl2416.print(getTimeStr());
dl2416.print("@*%#");

setTimeout(() => {
  dl2416.turnOff();
}, 3000);


setWatch(() => {
  if(isOn) {
    dl2416.turnOff();
  } else {
    const timeStr = getTimeStr();
    dl2416.print(timeStr);
    dl2416.turnOn();
  }
  isOn = !isOn;
}, BTN1, {repeat: true, edge: 'rising', debounce: 10});


