// return element function
function r_e(id) {
  return document.querySelector(`#${id}`);
}

// open sign in
r_e("signin-button").addEventListener("click", () => {
  r_e("signinmodal").classList.add("is-active");
});

// open sign up
r_e("signup-button").addEventListener("click", () => {
  r_e("signupmodal").classList.add("is-active");
});

// open color key modal
r_e("colorBtn").addEventListener("click", () => {
  r_e("colormodal").classList.add("is-active");
});

// Close the modal and reset its forms
function closeModal($el) {
  $el.classList.remove("is-active");
  $el.querySelectorAll("form").forEach(($form) => {
    $form.reset();
  });
}

// Close all modals and reset their forms
function closeAllModals() {
  document.querySelectorAll(".modal").forEach(($modal) => {
    closeModal($modal);
  });
}

// Add click event to various elements to close the parent modal
document
  .querySelectorAll(
    ".modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button"
  )
  .forEach(($close) => {
    const $target = $close.closest(".modal");

    $close.addEventListener("click", () => {
      closeModal($target);
    });
  });

// Add a keyboard event to close all modals on Escape key press
document.addEventListener("keydown", (event) => {
  if (event.code === "Escape") {
    closeAllModals();
  }
});

(document.querySelectorAll(".notification .delete") || []).forEach(
  ($delete) => {
    const $notification = $delete.parentNode;

    $delete.addEventListener("click", () => {
      $notification.classList.add("is-hidden");
      $notification.innerHTML = "";
    });
  }
);

// sign up

function generatePass() {
  let pass = "";
  let str =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ" + "abcdefghijklmnopqrstuvwxyz0123456789@#$";

  for (let i = 1; i <= 8; i++) {
    let char = Math.floor(Math.random() * str.length + 1);

    pass += str.charAt(char);
  }

  return pass;
}

r_e("signup_form").addEventListener("submit", (e) => {
  // prevent the page from auto refresh
  e.preventDefault();

  // get the email and password
  let email = r_e("sign-up-email").value;
  let password = generatePass();

  // sign up the user

  auth
    .createUserWithEmailAndPassword(email, password)
    .then(() => {
      auth
        .sendPasswordResetEmail(email)
        .then(() => {
          r_e("sign-up-error").innerHTML = "";

          configure_message_bar(
            `Account ${auth.currentUser.email} has been created`
          );

          // reset the sign up form
          r_e("signup_form").reset();

          // close the modal
          r_e("signupmodal").classList.remove("is-active");
        })
        .catch((err) => {
          r_e("sign-up-error").innerHTML = err.message;
        });
    })
    .catch((err) => {
      r_e("sign-up-error").innerHTML = err.message;
    });
});

// sign out

r_e("signout-button").addEventListener("click", () => {
  auth.signOut().then(() => {
    configure_message_bar("You are now logged out!");
  });
});

// sign in

r_e("signin_form").addEventListener("submit", (e) => {
  r_e("sign-in-error").innerHTML = "";
  // prevent the page from auto refresh
  e.preventDefault();

  // get the email and password
  let email = r_e("sign-in-email").value;
  let password = r_e("sign-in-password").value;

  // sign in the user
  auth
    .signInWithEmailAndPassword(email, password)
    .then(() => {
      configure_message_bar(`Welcome back ${auth.currentUser.email}!`);

      // reset the sign up form
      r_e("signin_form").reset();

      // close the modal
      r_e("signinmodal").classList.remove("is-active");
    })
    .catch((err) => {
      if (
        err.message ==
        '{"error":{"code":400,"message":"INVALID_LOGIN_CREDENTIALS","errors":[{"message":"INVALID_LOGIN_CREDENTIALS","domain":"global","reason":"invalid"}]}}'
      ) {
        r_e("sign-in-error").innerHTML =
          "The email or password entered is incorrect.";
      } else {
        r_e("sign-in-error").innerHTML = err.message;
      }
    });
});

// message bar delete button
r_e("hide_message_bar").addEventListener("click", () => {
  r_e("message_bar").classList.add("is-hidden");
});

// display message on message bar
function configure_message_bar(msg) {
  r_e("message_bar").innerHTML = msg;

  // show the message bar
  r_e("message_bar").classList.remove("is-hidden");

  // make the message bar hidden again and clear it

  setTimeout(() => {
    r_e("message_bar").classList.add("is-hidden");
    r_e("message_bar").innerHTML = "";
  }, 2000);
}

// onauthstatechendged
auth.onAuthStateChanged((user) => {
  if (user) {
    // show recipes
    show_page(auth.currentUser.email);
  } else {
    // hide recipes
    show_page();
  }
});

function show_page(email) {
  // check if there is a current user
  if (email) {
    r_e("signed-out-div").classList.add("is-hidden");
    r_e("signed-in-div").classList.remove("is-hidden");
    r_e("signin-button").classList.add("is-hidden");
    r_e("signout-button").classList.remove("is-hidden");
  } else {
    r_e("signed-out-div").classList.remove("is-hidden");
    r_e("signed-in-div").classList.add("is-hidden");
    r_e("signin-button").classList.remove("is-hidden");
    r_e("signout-button").classList.add("is-hidden");
  }
}
