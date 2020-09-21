type CallbackType = (_result: boolean) => void;

const openDebug = (_callBack?: CallbackType) => {
  const body = document.body;
  let startTime = 0;
  let count = 0;
  body.ondblclick = () => {
    if (startTime === 0) {
      startTime = Date.now();
    }
    const curDate = Date.now();
    if (curDate - startTime > 10000 || window.__wxComDebug) {
      startTime = 0;
      count = 0;
      if (window.__wxComDebug && _callBack) {
        _callBack(false);
      }
      window.__wxComDebug = false;
    }
    count += 1;
    if (count >= 8) {
      _callBack && _callBack(true);
      window.__wxComDebug = true;
      count = 0;
    }
  }
}


export {
  openDebug
}