/**
 * Espruino module for the DL2416 4-character intelligent LED display
 * Dl2416 datasheet: http://www.decadecounter.com/vta/pdf/DL2416.pdf
 *
 * @param P_D0 D0 Data Input pin (IC pin 11)
 * @param P_D1 D1 Data Input pin (IC pin 12)
 * @param P_D2 D2 Data Input pin (IC pin 13)
 * @param P_D3 D3 Data Input pin (IC pin 14)
 * @param P_D4 D4 Data Input pin (IC pin 17) (! note order !)
 * @param P_D5 D5 Data Input pin (IC pin 16)
 * @param P_D6 D6 Data Input pin (IC pin 15)
 * @param P_BL BL Display Blank pin (IC pin 18)
 * @param P_Ad0 Digit Select pin (IC pin 8)
 * @param P_Ad1 Digit Select pin (IC pin 7)
 * @param P_WR Write pin (IC pin 6)
 * @param P_CU Cursor Select pin (IC pin 5)
 * @param P_CUE Cursor Enable pin (IC pin 4)
 * @param P_CLR Clear pin (IC pin 3)
 * @param [P_CE1] Chip Enable pin (IC pin 2)
 * @param [P_CE2] Chip Enable pin (IC pin 1)
 * @returns {{turnOff: *, write: *, turnOn: *, setLetter: *, scroll: *, stopScroll: *, clear: *}}
 * @constructor
 */

function DL2416(P_D0, P_D1, P_D2, P_D3, P_D4, P_D5, P_D6, P_BL, P_Ad0, P_Ad1, P_WR, P_CU, P_CUE, P_CLR, P_CE1, P_CE2) {
  // Initialize pins
  setOutput(P_D0, P_D1, P_D2, P_D3, P_D4, P_D5, P_D6, P_Ad0, P_Ad1, P_WR, P_BL, P_CLR, P_CU, P_CUE, P_CE1, P_CE2);
  // digitalWrite(P_Ad0, 1);
  // digitalWrite(P_Ad1, 1);
  digitalWrite(P_WR, 1);
  digitalWrite(P_BL, 1);
  digitalWrite(P_CLR, 1);
  digitalWrite(P_CUE, 0);
  digitalWrite(P_CU, 1);
  if (P_CE1 !== undefined) {
    digitalWrite(P_CE1, 0);
  }
  if (P_CE2 !== undefined) {
    digitalWrite(P_CE2, 0);
  }

  // Internal state variables
  // for scroll function - keep track of full message and position
  let msg = "";
  let scrollIndex = 0;
  let scrollInterval = undefined;
  // for cursor function
  let cursors = [];
  let cursorEnabled = false;
  let flashInterval = undefined;

  // Clear the internal four-digit memory, including the cursor setting
  // Good idea to call this first, in case anything leftover in memory
  function clear() {
    // According to datasheet, should wait 1us after setting CLR to low, but the Espruino interpreter is slow enough :)
    digitalWrite(P_CLR, 0);
    digitalWrite(P_CLR, 1);
    // stop scrolling and/or flashing
    stopInterval(scrollInterval);
    stopInterval(flashInterval);
  }

  // Turn display on, showing whatever is in memory
  function turnOn() {
    digitalWrite(P_BL, 1);
  }

  // Turn display off (but preserve memory)
  // Datasheet calls this "blanking"
  function turnOff() {
    digitalWrite(P_BL, 0);
    // pause scrolling and/or flashing
    stopInterval(scrollInterval);
    stopInterval(flashInterval);
  }

  // Select which digit (0-3) will be set by next data write
  function selectDigit(digit) {
    // display expects Right-to-Left order (0 is rightmost digit) - translate from L-to-R
    const d = 3 - digit;
    // write two bits of `d` to digit selector pins
    digitalWrite(P_Ad1, (d & 0b10) >> 1);
    digitalWrite(P_Ad0, (d & 0b01) >> 0);
  }

  // Write a single character to the display at the given digit position (0-3)
  function writeChar(letter, digit) {
    selectDigit(digit);

    // get ASCII code of character and write to data pins
    const charCode = letter.charCodeAt(0);
    digitalWrite(P_D6, (charCode & 0b1000000) >> 6);
    digitalWrite(P_D5, (charCode & 0b0100000) >> 5);
    digitalWrite(P_D4, (charCode & 0b0010000) >> 4);
    digitalWrite(P_D3, (charCode & 0b0001000) >> 3);
    digitalWrite(P_D2, (charCode & 0b0000100) >> 2);
    digitalWrite(P_D1, (charCode & 0b0000010) >> 1);
    digitalWrite(P_D0, (charCode & 0b0000001) >> 0);

    // flip WR pin to write to internal memory
    digitalWrite(P_WR, 0);
    digitalWrite(P_WR, 1);
  }

  // Print up to 4 characters on the display (first 4, if length > 4)
  function write(str) {
    for (let i = 0; i < 4; i++) {
      writeChar(str[i] || " ", i);
    }
  }

  // Scroll an arbitrary-length message across the display
  function scroll(newMsg, delay) {
    // stop previous scrolling, if it exists
    stopScroll();

    msg = newMsg;
    scrollIndex = 0;
    delay = delay || 300;

    // if message is short enough, don't need to scroll
    if(msg.length <= 4) {
      write(msg);
      return;
    }
    // start scrolling message
    scrollInterval = setInterval(() => _updateScroll(), delay);
    // todo - endDelay param - should wait longer at end of message before replaying
  }
  function _updateScroll() {
    const msgPart = msg.substr(scrollIndex, 4);
    const endIndex = Math.max(0, msg.length - 3);
    scrollIndex = (scrollIndex + 1) % endIndex;
    write(msgPart);
  }
  // remove any existing scroll interval timer, if present
  function stopScroll() {
    stopInterval(scrollInterval);
  }

  // Set a cursor at the given digit
  function setCursor(digit, unset) {
    digitalWrite(P_CUE, 1);
    selectDigit(digit);
    digitalWrite(P_D0, !unset);
    digitalWrite(P_CU, 0);
    digitalWrite(P_WR, 0);
    digitalWrite(P_WR, 1);
    digitalWrite(P_CU, 1);
  }

  // Unset (clear) cursor at the given digit
  function unsetCursor(digit) {
    return setCursor(digit, true);
  }

  function flashCursor(flashTime) {
    stopInterval(flashInterval);
    // pass `false` to disable flashing
    if (flashTime !== false) {
      // set default delay of 500ms if user doesn't pass one
      if (typeof flashTime !== "number") flashTime = 300;
      flashInterval = setInterval(() => {
        digitalWrite(P_CUE, cursorEnabled);
        cursorEnabled = !cursorEnabled;
      }, flashTime);
    }
  }
  function stopFlash() {
    stopInterval(flashInterval);
  }

  function stopInterval(interval) {
    if (typeof interval !== "undefined") clearInterval(interval);
  }

  return {
    writeChar: writeChar,
    write: write,
    scroll: scroll,
    stopScroll: stopScroll,
    clear: clear,
    turnOff: turnOff,
    turnOn: turnOn,
    setCursor: setCursor,
    unsetCursor: unsetCursor,
    flashCursor: flashCursor,
    stopFlash: stopFlash
  };
}

exports.connect = DL2416;

// utils
function setOutput() {
  for (let i = 0; i < arguments.length; i++) {
    const pin = arguments[i];
    if (typeof pin !== "undefined") {
      pinMode(pin, "output");
    }
  }
}
