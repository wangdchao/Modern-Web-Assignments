/*jshint esversion: 6*/
/*High Accuracy Algorithm Supported*/
/*Scientific Calculation Supported*/
/*Non-server version*/

math.config({
  number: 'BigNumber'
});

var limitedEval = math.eval;

function ln(a) {
  return limitedEval("log(" + a + ")/log(e)");
}

function degrees(a) {
  return limitedEval(a + "deg");
}

function lev(a){
  return limitedEval(a + "!");
}

math.import({
  ln: ln,
  degrees: degrees,
  lev: lev
});// config of mathjs

math.import({
  'import':     function () { throw new Error('Function import is disabled') },
  'createUnit': function () { throw new Error('Function createUnit is disabled') },
  'eval':       function () { throw new Error('Function eval is disabled') },
  'parse':      function () { throw new Error('Function parse is disabled') },
  'simplify':   function () { throw new Error('Function simplify is disabled') },
  'derivative': function () { throw new Error('Function derivative is disabled') }
}, {override: true});// To prevent from XSS attack

function calculator(data){
  console.log("Calculating: " + data);
  if(data == "INVALID"){
    return "INVALID";
  }
  data = data.replace(/π/g, "pi");
  try{
    if(data == "")
      return "";
    let result = limitedEval(data);
    if(result == "NaN")
      throw "Error!";
    if((result + "").length > 17)
      return result.toPrecision(16) + "";
    else
      return result + "";
  }
  catch(exception){
    alert('What you typed in is not a valid formula, please try again');
    return "INVALID";
  }
}

$(document).ready(function () {
  let numOfLeft = 0;
  let isRes = false;
  let fom = document.getElementById('equation'), 
    res = document.getElementById('result');

  function init() {
    numOfLeft = 0;
  }

  function autoFill(){
    for(;numOfLeft > 0; --numOfLeft)
      fom.textContent += ")";
  }

  function addFunc(funcName){
    ++numOfLeft;
    fom.textContent += funcName + "(";
  }

  function addOperator(opr){
    fom.textContent += opr;
  }

  $('#result').addClass('s0').addClass('animation');
  $('#equation').addClass('s1').addClass('animation');

  function reset(callback) {
    $('#equation').removeClass('animation').removeClass('s0').addClass('s1');
    $('#result').removeClass('animation').removeClass('s1').addClass('s0');
    if (callback != undefined)
      setTimeout(callback, 50);
  }

  let fade = function () {
    $('#equation').removeClass('s1').addClass('animation').addClass('s0');
    $('#result').removeClass('s0').addClass('animation').addClass('s1');
  };

  $('.button').click(function () {
    reset(undefined);
    if(isNaN(this.textContent)){
      if(isRes){
        if(res.textContent == "INVALID" || this.textContent == "Del" || res.textContent.indexOf("Infinity") != -1)
          fom.textContent = "";
        else
          fom.textContent = res.textContent;
        isRes = false;
      }
      switch (this.textContent) {
        case "---":
          break;
        case 'CE':
          fom.textContent = "";
          init();
          break;
        case '(':
          ++numOfLeft;
          fom.textContent += "(";
          break;
        case ')':
          if(numOfLeft > 0){
            --numOfLeft;
            fom.textContent += ")";
          }
          break;
        case 'Del':
          if(fom.textContent != "")
            fom.textContent = fom.textContent.substr(0, fom.textContent.length - 1);
          break;
        case "n!":
          addFunc("lev");
          break;
        case "deg":
          addFunc("degrees");
          break;
        case "sin": case "cos": case "tan":
        case "asin": case "acos": case "atan":
        case "ln": case "log":
          addFunc(this.textContent);
          break;
        case "x^y":
          addOperator("^");
          break;
        case "π":
          fom.textContent += "π";
          break;
        case "e":
          fom.textContent += "e";
          break;
        case "=":
          autoFill();
          init();
          res.textContent = calculator(fom.textContent);
          reset(fade);
          isRes = true;
          break;

        default:
          addOperator(this.textContent);
          break;
      }
    }
    else{
      if(isRes){
        fom.textContent = "";
        isRes = false;
      }
      fom.textContent += this.textContent;
    }
  });
});