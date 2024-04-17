var countDownDatea = new Date("April 19, 2024 1:10:00").getTime();
var countDownDateb = new Date("April 26, 2024 1:10:00").getTime();
var countDownDatec = new Date("May 10, 2024 1:10:00").getTime();


var xa = setInterval(function() {

  // Get today's date and time
  var nowa = new Date().getTime();
    
  // Find the distance between now and the count down date
  var distancea = countDownDatea - nowa;
    
  // Time calculations for days, hours, minutes and seconds
  var daysa = Math.floor(distancea / (1000 * 60 * 60 * 24));
  var hoursa = Math.floor((distancea % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutesa = Math.floor((distancea % (1000 * 60 * 60)) / (1000 * 60));
  var secondsa = Math.floor((distancea % (1000 * 60)) / 1000);
    
  // Output the result in an element with id="demo"
  document.getElementById("demoa").innerHTML = "Starts in: "+daysa + "d " + hoursa + "h "
  + minutesa + "m " + secondsa + "s ";
    
  // If the count down is over, write some text 
  if (distancea < 0) {
    clearInterval(x);
    document.getElementById("demoa").innerHTML = "EXPIRED";
  }
}, 1000);

var xb = setInterval(function() {

  // Get today's date and time
  var nowb = new Date().getTime();
    
  // Find the distance between now and the count down date
  var distanceb = countDownDateb - nowb;
    
  // Time calculations for days, hours, minutes and seconds
  var daysb = Math.floor(distanceb / (1000 * 60 * 60 * 24));
  var hoursb = Math.floor((distanceb % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutesb = Math.floor((distanceb % (1000 * 60 * 60)) / (1000 * 60));
  var secondsb = Math.floor((distanceb % (1000 * 60)) / 1000);
    
  // Output the result in an element with id="demo"
  document.getElementById("demob").innerHTML = "Starts in: "+daysb + "d " + hoursb + "h "
  + minutesb + "m " + secondsb + "s ";
    
  // If the count down is over, write some text 
  if (distanceb < 0) {
    clearInterval(x);
    document.getElementById("demob").innerHTML = "EXPIRED";
  }
}, 1000);

var xc = setInterval(function() {

  // Get today's date and time
  var nowc = new Date().getTime();
    
  // Find the distance between now and the count down date
  var distancec = countDownDatec - nowc;
    
  // Time calculations for days, hours, minutes and seconds
  var daysc = Math.floor(distancec / (1000 * 60 * 60 * 24));
  var hoursc = Math.floor((distancec % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutesc = Math.floor((distancec % (1000 * 60 * 60)) / (1000 * 60));
  var secondsc = Math.floor((distancec % (1000 * 60)) / 1000);
    
  // Output the result in an element with id="demo"
  document.getElementById("democ").innerHTML = "Starts in: "+daysc + "d " + hoursc + "h "
  + minutesc + "m " + secondsc + "s ";
    
  // If the count down is over, write some text 
  if (distancec < 0) {
    clearInterval(x);
    document.getElementById("democ").innerHTML = "EXPIRED";
  }
}, 1000);
