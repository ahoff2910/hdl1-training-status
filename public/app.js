// return element function
function r_e(id) {
  return document.querySelector(`#${id}`);
}

// activating sign in modal
let signinbtn = document.querySelector("#signin");

signinbtn.addEventListener("click", () => {
  let signinmodal = document.querySelector("#signinmodal");
  signinmodal.classList.add("is-active");
});

// hide the sign in modal
document.querySelector("#modalbg1").addEventListener("click", () => {
  signinmodal.classList.remove("is-active");
});

// activating color key modal
let colorbtn = document.querySelector("#colorBtn");

colorbtn.addEventListener("click", () => {
  let colormodal = document.querySelector("#colormodal");
  colormodal.classList.add("is-active");
});

// hide the sign in modal
document.querySelector("#modalbg2").addEventListener("click", () => {
  colormodal.classList.remove("is-active");
});
