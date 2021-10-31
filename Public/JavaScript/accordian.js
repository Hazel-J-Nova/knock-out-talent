const acc = document.querySelector(".accordion");
acc.addEventListener("click", function () {
  this.classList.toggle("active");
  console.log(this);
  var panel = this.nextElementSibling;
  if (panel.style.maxHeight) {
    panel.style.maxHeight = null;
  } else {
    panel.style.maxHeight = panel.scrollHeight + "px";
  }
});
