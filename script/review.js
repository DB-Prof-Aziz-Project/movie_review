$('.starRev span').click(function(){
  $(this).parent().children('span').removeClass('on');
  $(this).addClass('on').prevAll('span').addClass('on');
  return false;
});

function exe() {
  var obj = document.getElementById("popup");

  obj.style.display = "block";
}

function closed() {
  document.getElementById("popup").style.display = "none";
}