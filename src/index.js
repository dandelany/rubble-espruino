
SPI1.setup({ sck: D19, mosi: D18, order: "lsb", baud: 4000000 });

let t = 1;
let number = 1;

let pressedButtons = "";

let timeStr = "";

function update(g) {
  g.setBgColor(t % 2 ? 0 : 1);
  g.setColor(t % 2 ? 1 : 0);

  t += 1;
  timeStr = new Date().toISOString().slice(11, 19);
  draw();
}

function draw() {
  g.setFontVector(26);
  g.clear();
  g.drawString(timeStr,10,20);
  g.drawString(pressedButtons,10,80);
  g.drawString("hello", 10, 110);
  g.flip();
}

const BUTTON = {
  A: D27,
  B: D28,
  C: D26
};
let watches = [];


pinMode(D3, 'input_pullup');

setWatch(function(e) {
  pressedButtons = "";
  timeStr = new Date().toISOString().slice(11, 19);
  draw();
}, D3, { repeat: true, edge: 'falling', debounce: 50 });

function logPress(g, btnKey, e) {
  if(pressedButtons.length >= 5) pressedButtons = '';
  pressedButtons += btnKey;
  timeStr = new Date().toISOString().slice(11, 19);
  draw();
}

var g = require("MemoryLCD").connect(SPI1, D17/*SCS*/, D14/*EXTCOMIN*/, 144/*width*/, 196/*height*/, function() {

  const t = setInterval(update.bind(this, g), 10000);
  update(g);

  for(let btnKey in BUTTON) {
    const pin = BUTTON[btnKey];
    console.log(btnKey, pin);
    pinMode(pin, 'input_pullup');
    watches.push(setWatch(
      logPress.bind(this, g, btnKey),
      pin,
      { repeat: true, edge: 'falling', debounce: 80}
    ));
  }


  //g.clear();
  //g.drawString("Hello",0,0);
  //g.drawLine(0,10,g.getWidth(),10);
  //g.drawString(getTime(), 0, 20);
  //g.flip();
});

var  on = false;


/*

//setInterval(function() {
  //on = !on;
 // LED1.write(on);
  //LED2.write(on);
  //LED3.write(on);
//}, 120);



const C = {
  OFF: 0,
  RED: 1,
  GREEN: 2,
  YELLOW: 3,
  BLUE: 4,
  PURPLE: 5,
  CYAN: 6,
};



function setColor(color) {
  digitalWrite([LED3, LED2, LED1], color);
}

*/

/*
setInterval(function() {
  on = !on;
  LED1.write(on);
}, 2000);
*/

setWatch(function(e) {
  on = !on;
  LED1.write(on);
}, BTN, {repeat: true, edge: 'rising' });


/*
setWatch(function(e) {
  console.log("Button pressed");

  //(Math.random() > 0.5) ? LED1.set() : LED1.reset();
  //(Math.random() > 0.5) ? LED2.set() : LED2.reset();
  //(Math.random() > 0.5) ? LED3.set() : LED3.reset();

}, BTN, { repeat: true, edge: 'rising' });

*/


/*
Puck.magOn();

let zMag = 0;
Puck.on('mag', function(xyz) {
  console.log(xyz);
  zMag = xyz.z;
  zMag < -2000 ? LED1.reset() : LED1.set();
});

*/