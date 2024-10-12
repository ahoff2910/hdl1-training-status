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

// open departed
r_e("open-departed-button").addEventListener("click", () => {
  r_e("departedmodal").classList.add("is-active");
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

r_e("signup_form").addEventListener("submit", async (e) => {
  e.preventDefault();

  let name = r_e("sign-up-name").value;
  let email = r_e("sign-up-email").value;
  let password = generatePass();
  let userType = r_e("user-type-select").value;

  try {
    let userCredential = await secondaryApp
      .auth()
      .createUserWithEmailAndPassword(email, password);
    await firebase
      .firestore()
      .collection("users")
      .doc(userCredential.user.uid)
      .set({
        name: name,
        email: email,
        role: userType,
      });
    await firebase.auth().sendPasswordResetEmail(email);
    r_e("sign-up-error").innerHTML = "";
    configure_message_bar(`Account ${email} has been created`);
    r_e("signup_form").reset();
    r_e("signupmodal").classList.remove("is-active");
  } catch (err) {
    r_e("sign-up-error").innerHTML = err.message;
  }
});

// sign out

r_e("signout-button").addEventListener("click", () => {
  auth.signOut().then(() => {
    configure_message_bar("You are now logged out!");
  });
});

// sign in

r_e("signin_form").addEventListener("submit", async (e) => {
  r_e("sign-in-error").innerHTML = "";
  // prevent the page from auto refresh
  e.preventDefault();

  // get the email and password
  let email = r_e("sign-in-email").value;
  let password = r_e("sign-in-password").value;

  try {
    // sign in the user
    await auth.signInWithEmailAndPassword(email, password);

    // fetch the user's document from Firestore
    const userDoc = await firebase
      .firestore()
      .collection("users")
      .doc(auth.currentUser.uid)
      .get();

    if (userDoc.exists) {
      const userName = userDoc.data().name;
      configure_message_bar(`Welcome back ${userName}!`);
    } else {
      configure_message_bar(`Welcome back!`);
    }

    // reset the sign in form
    r_e("signin_form").reset();

    // close the modal
    r_e("signinmodal").classList.remove("is-active");
  } catch (err) {
    if (
      err.message ==
      '{"error":{"code":400,"message":"INVALID_LOGIN_CREDENTIALS","errors":[{"message":"INVALID_LOGIN_CREDENTIALS","domain":"global","reason":"invalid"}]}}'
    ) {
      r_e("sign-in-error").innerHTML =
        "The email or password entered is incorrect.";
    } else {
      r_e("sign-in-error").innerHTML = err.message;
    }
  }
});

// Open the My Account Modal
r_e("openMyAccountModal").addEventListener("click", async () => {
  const user = firebase.auth().currentUser;
  if (user) {
    const userDoc = await firebase
      .firestore()
      .collection("users")
      .doc(user.uid)
      .get();
    if (userDoc.exists) {
      const userData = userDoc.data();
      r_e("myAccountName").value = userData.name || "";
      r_e("myAccountEmail").value = user.email || "";
      r_e("myAccountRole").value = userData.role || "";
      r_e("myAccountModal").classList.add("is-active");
    }
  }
});

// Save Changes in My Account Modal
r_e("myAccountForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const user = firebase.auth().currentUser;

  if (user) {
    const name = r_e("myAccountName").value;
    const email = r_e("myAccountEmail").value;
    const password = r_e("myAccountPassword").value;
    const userDocRef = firebase.firestore().collection("users").doc(user.uid);

    try {
      await user.updateEmail(email);
      if (password) {
        await user.updatePassword(password);
      }
      await userDocRef.update({ name: name, email: email });
      r_e("myAccountError").innerHTML = "";
      configure_message_bar("Account updated successfully.");
      r_e("myAccountModal").classList.remove("is-active");
    } catch (err) {
      r_e("myAccountError").innerHTML = err.message;
    }
  }
});

let userDataCache = {}; // Cache to store user data

// Open the View Users Modal
r_e("view-users-button").addEventListener("click", async () => {
  const usersTableBody = r_e("users-table-body");
  usersTableBody.innerHTML = ""; // Clear previous data

  const usersSnapshot = await firebase.firestore().collection("users").get();
  const usersArray = [];

  usersSnapshot.forEach((doc) => {
    const userData = doc.data();
    usersArray.push({ id: doc.id, ...userData });
  });

  // Sort users by name before caching
  usersArray.sort((a, b) => a.name.localeCompare(b.name));

  // Cache sorted user data and populate the table
  usersArray.forEach((user) => {
    userDataCache[user.id] = user; // Cache user data

    const userRow = document.createElement("tr");
    userRow.setAttribute("data-user-id", user.id);
    userRow.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td>
                <button class="button is-info view-user-button" data-user-id="${user.id}">View</button>
            </td>
        `;

    usersTableBody.appendChild(userRow);
  });

  r_e("viewUsersModal").classList.add("is-active");
});

// Filter users in the table
r_e("searchUsersInput").addEventListener("input", () => {
  let searchTerm = r_e("searchUsersInput").value.toLowerCase(); // Make values lowercase
  let usersTableBody = r_e("users-table-body");
  usersTableBody.innerHTML = ""; // Clear previous data

  Object.keys(userDataCache).forEach((userId) => {
    let userData = userDataCache[userId];
    if (
      userData.name.toLowerCase().includes(searchTerm) ||
      userData.email.toLowerCase().includes(searchTerm) ||
      userData.role.toLowerCase().includes(searchTerm)
    ) {
      const userRow = document.createElement("tr");
      userRow.setAttribute("data-user-id", userId);
      userRow.innerHTML = `
                <td>${userData.name}</td>
                <td>${userData.email}</td>
                <td>${userData.role}</td>
                <td>
                    <button class="button is-info view-user-button" data-user-id="${userId}">View</button>
                </td>
            `;
      usersTableBody.appendChild(userRow);
    }
  });
});

// Handle View User Button Click
document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("view-user-button")) {
    const userId = e.target.getAttribute("data-user-id");
    const userData = userDataCache[userId]; // Get user data from cache

    if (userData) {
      r_e("userAccountName").value = userData.name || "";
      r_e("userAccountEmail").value = userData.email || "";
      r_e("userAccountRole").value = userData.role || "";
      r_e("userAccountModal").setAttribute("data-user-id", userId); // Save user ID to modal
      r_e("userAccountModal").classList.add("is-active");
    }
  }
});

// Save Changes in User Account Modal
r_e("userAccountForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const userId = r_e("userAccountModal").getAttribute("data-user-id");
  const userDocRef = firebase.firestore().collection("users").doc(userId);

  const name = r_e("userAccountName").value;
  const email = r_e("userAccountEmail").value;
  const role = r_e("userAccountRole").value;

  try {
    await userDocRef.update({ name: name, email: email, role: role });
    // Update cache
    userDataCache[userId] = { name: name, email: email, role: role };
    // Update displayed info in the table
    const userRow = document.querySelector(`tr[data-user-id="${userId}"]`);
    userRow.innerHTML = `
            <td>${name}</td>
            <td>${email}</td>
            <td>${role}</td>
            <td>
                <button class="button is-info view-user-button" data-user-id="${userId}">View</button>
            </td>
        `;
    r_e("userAccountError").innerHTML = "";
    configure_message_bar("User account updated successfully.");
    r_e("userAccountModal").classList.remove("is-active");
  } catch (err) {
    r_e("userAccountError").innerHTML = err.message;
  }
});

// Delete User
r_e("deleteUserButton").addEventListener("click", async (e) => {
  e.preventDefault();
  const userId = r_e("userAccountModal").getAttribute("data-user-id");

  try {
    await firebase.firestore().collection("users").doc(userId).delete();
    configure_message_bar("User deleted successfully.");
    r_e("userAccountModal").classList.remove("is-active");
    // Remove user from cache and table
    delete userDataCache[userId];
    document.querySelector(`tr[data-user-id="${userId}"]`).remove();
  } catch (err) {
    r_e("userAccountError").innerHTML = err.message;
  }
});

document.addEventListener("DOMContentLoaded", function () {
  // Select all boxes with the class "collapsible"
  const boxes = document.querySelectorAll(".box.collapsible");

  // Loop through each box and add click event to the anchor element
  boxes.forEach((box) => {
    const trigger = box.querySelector("a");
    const content = box.querySelector("form");
    const caret = trigger.querySelector(".fas.fa-caret-down, .fas.fa-caret-up");

    // Initially hide content
    content.style.display = "none";

    // Add click event to the anchor element
    trigger.addEventListener("click", function () {
      // Toggle content visibility
      if (content.style.display === "none") {
        content.style.display = "block";
        caret.classList.remove("fa-caret-down");
        caret.classList.add("fa-caret-up");
      } else {
        content.style.display = "none";
        caret.classList.remove("fa-caret-up");
        caret.classList.add("fa-caret-down");
      }
    });
  });
});

// Handle Forgot Password Button Click
r_e("forgotPasswordButton").addEventListener("click", () => {
  let email = r_e("sign-in-email").value;
  if (email) {
    auth
      .sendPasswordResetEmail(email)
      .then(() => {
        configure_message_bar("Password reset email sent successfully.");
      })
      .catch((err) => {
        r_e("sign-in-error").innerHTML = err.message;
      });
  } else {
    r_e("sign-in-error").innerHTML =
      "Please enter your email address to reset your password.";
  }
});

// Send Password Reset Email
r_e("sendPasswordResetButton").addEventListener("click", async (e) => {
  e.preventDefault();
  const email = r_e("userAccountEmail").value;

  try {
    await firebase.auth().sendPasswordResetEmail(email);
    configure_message_bar(`Password reset email sent to ${email}.`);
  } catch (err) {
    r_e("userAccountError").innerHTML = err.message;
  }
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
firebase.auth().onAuthStateChanged(async (user) => {
  if (user) {
    const userDoc = await firebase
      .firestore()
      .collection("users")
      .doc(user.uid)
      .get();
    if (userDoc.exists) {
      const userData = userDoc.data();
      show_page(auth.currentUser.email, userData.role);
    } else {
      show_page();
      auth.currentUser.delete().then(() => {
        configure_message_bar(
          "You have no roles.  Your account has been deleted.  Contact an administrator."
        );
      });
    }
  } else {
    show_page();
  }
});

function show_page(email, role = "") {
  // check if there is a current user
  if (email) {
    r_e("signed-out-div").classList.add("is-hidden");
    r_e("signed-in-div").classList.remove("is-hidden");
    r_e("signin-button").classList.add("is-hidden");
    r_e("signout-button").classList.remove("is-hidden");
    r_e("openMyAccountModal").classList.remove("is-hidden");
    r_e("dashboard-div").classList.remove("is-hidden");
    r_e("user-page-div").classList.add("is-hidden");
    if (role == "admin") {
      r_e("signup-button").classList.remove("is-hidden");
      r_e("view-users-button").classList.remove("is-hidden");
    } else {
      r_e("signup-button").classList.add("is-hidden");
      r_e("view-users-button").classList.add("is-hidden");
    }
  } else {
    r_e("signed-out-div").classList.remove("is-hidden");
    r_e("signed-in-div").classList.add("is-hidden");
    r_e("signin-button").classList.remove("is-hidden");
    r_e("signout-button").classList.add("is-hidden");
    r_e("openMyAccountModal").classList.add("is-hidden");
    r_e("dashboard-div").classList.remove("is-hidden");
    r_e("user-page-div").classList.add("is-hidden");
  }
}

// Handle "return to home" button on user page
r_e("home-button").addEventListener("click", function () {
  r_e("user-page-div").classList.add("is-hidden");
  r_e("dashboard-div").classList.remove("is-hidden");
});

// Handle "return to home" button on user page
r_e("home-button").addEventListener("click", function () {
  r_e("user-page-div").classList.add("is-hidden");
  r_e("dashboard-div").classList.remove("is-hidden");
});

// Placeholder to make all agent buttons move to agent page
let agentButtons = document.querySelectorAll(".agent-button");

agentButtons.forEach((button) => {
  button.addEventListener("click", function () {
    closeAllModals();
    r_e("dashboard-div").classList.add("is-hidden");
    r_e("user-page-div").classList.remove("is-hidden");
  });
});

let departedRows = document.querySelectorAll(".agent-depart-row");

departedRows.forEach((row) => {
  row.addEventListener("click", function () {
    closeAllModals();
    r_e("dashboard-div").classList.add("is-hidden");
    r_e("user-page-div").classList.remove("is-hidden");
  });
});
