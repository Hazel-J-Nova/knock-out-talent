const acc = document.querySelectorAll(".accordion");
acc.forEach((el) => {
  el.addEventListener("click", function expand(e) {
    this.classList.toggle("active");

    var panel = this.nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
    e.preventDefault();
  });
});
