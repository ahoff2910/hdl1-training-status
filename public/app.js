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

// open training up
r_e("edit-training-button").addEventListener("click", () => {
  r_e("trainingLevelsModal").classList.add("is-active");
});

// open departed
r_e("open-departed-button").addEventListener("click", () => {
  const tableBody = document.getElementById("departed-agents-table");
  const searchInput = document.getElementById("searchDepartedInput");
  const cache = []; // Cache for storing fetched data

  // Fetch agents data from Firestore
  db.collection("agents")
    .doc("departing")
    .get()
    .then((doc) => {
      if (doc.exists) {
        const data = doc.data();
        cache.push(...Object.values(data)); // Store data in the cache
        populateTable(cache);
        searchInput.value = "";
        r_e("departedmodal").classList.add("is-active");
      } else {
        console.error("No such document!");
      }
    })
    .catch((error) => {
      console.error("Error getting document:", error);
    });

  // Populate table with sorted data
  function populateTable(data) {
    // Sort data by lastDay, with most recent date at the top
    const sortedData = data.sort((a, b) => {
      const dateA = new Date(a.departing?.lastDay || "1970-01-01");
      const dateB = new Date(b.departing?.lastDay || "1970-01-01");
      return dateB - dateA; // Descending order
    });

    // Clear existing rows
    tableBody.innerHTML = "";

    // Current date for comparison
    const today = new Date();

    // Create rows for each agent
    sortedData.forEach((agent) => {
      // Parse the `lastDay` as a Date object
      const lastDay = new Date(agent.departing?.lastDay || "1970-01-01");
      const today = new Date();

      // Retrieve boolean values for conditional checks
      const laptop = agent.departing?.laptop || false;
      const services = agent.departing?.services || false;
      const offboarded = agent.departing?.offboarded || false;

      const row = document.createElement("tr");
      row.classList.add("agent-depart-row");

      // Add conditional formatting
      const isPastLastDay = lastDay < today;

      const lastDayCell = `<td>${agent.departing?.lastDay || "N/A"}</td>`;
      const offboardingCell = `
    <td class="${isPastLastDay && !offboarded ? "is-danger" : ""}">
      <input type="checkbox" ${offboarded ? "checked" : ""} disabled />
    </td>`;
      const servicesCell = `
    <td class="${
      isPastLastDay && offboarded && !services
        ? "is-danger"
        : isPastLastDay && !offboarded
        ? "is-warning"
        : ""
    }">
      <input type="checkbox" ${services ? "checked" : ""} disabled />
    </td>`;
      const laptopCell = `
    <td class="${
      isPastLastDay && offboarded && !laptop
        ? "is-danger"
        : isPastLastDay && !offboarded
        ? "is-warning"
        : ""
    }">
      <input type="checkbox" ${laptop ? "checked" : ""} disabled />
    </td>`;

      row.innerHTML = `
        <td>${agent.agent || "N/A"}</td>
        ${lastDayCell}
        ${offboardingCell}
        ${servicesCell}
        ${laptopCell}
      `;

      // Add click event listener to row
      row.addEventListener("click", () => {
        showUserPage(agent.agent, "departing");
      });

      tableBody.appendChild(row);
    });
  }

  // Filter and display data based on search input
  searchInput.addEventListener("input", (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filteredData = cache.filter((agent) =>
      (agent.agent || "").toLowerCase().includes(searchTerm)
    );
    populateTable(filteredData);
  });
});

// open inactive
r_e("show-all-departed").addEventListener("click", () => {
  const tableBody = document.getElementById("inactive-agents-table");
  const searchInput = document.getElementById("searchinactiveInput");
  const cache = []; // Cache for storing fetched data

  // Fetch agents data from Firestore
  db.collection("agents")
    .doc("inactive")
    .get()
    .then((doc) => {
      if (doc.exists) {
        const data = doc.data();
        cache.push(...Object.values(data)); // Store data in the cache
        populateTable(cache);
        searchInput.value = "";
        r_e("inactivemodal").classList.add("is-active");
      } else {
        console.error("No such document!");
      }
    })
    .catch((error) => {
      console.error("Error getting document:", error);
    });

  // Populate table with sorted data
  function populateTable(data) {
    // Sort data by lastDay, with most recent date at the top
    const sortedData = data.sort((a, b) => {
      const dateA = new Date(a.departing?.lastDay || "1970-01-01");
      const dateB = new Date(b.departing?.lastDay || "1970-01-01");
      return dateB - dateA; // Descending order
    });

    // Clear existing rows
    tableBody.innerHTML = "";

    // Current date for comparison
    const today = new Date();

    // Create rows for each agent
    sortedData.forEach((agent) => {
      // Parse the `lastDay` as a Date object
      const lastDay = new Date(agent.departing?.lastDay || "1970-01-01");
      const today = new Date();

      // Retrieve boolean values for conditional checks
      const laptop = agent.departing?.laptop || false;
      const services = agent.departing?.services || false;
      const offboarded = agent.departing?.offboarded || false;

      const row = document.createElement("tr");
      row.classList.add("agent-depart-row");

      // Add conditional formatting
      const isPastLastDay = lastDay < today;

      const lastDayCell = `<td>${agent.departing?.lastDay || "N/A"}</td>`;
      const offboardingCell = `
    <td class="${isPastLastDay && !offboarded ? "is-danger" : ""}">
      <input type="checkbox" ${offboarded ? "checked" : ""} disabled />
    </td>`;
      const servicesCell = `
    <td class="${
      isPastLastDay && offboarded && !services
        ? "is-danger"
        : isPastLastDay && !offboarded
        ? "is-warning"
        : ""
    }">
      <input type="checkbox" ${services ? "checked" : ""} disabled />
    </td>`;
      const laptopCell = `
    <td class="${
      isPastLastDay && offboarded && !laptop
        ? "is-danger"
        : isPastLastDay && !offboarded
        ? "is-warning"
        : ""
    }">
      <input type="checkbox" ${laptop ? "checked" : ""} disabled />
    </td>`;

      row.innerHTML = `
        <td>${agent.agent || "N/A"}</td>
        ${lastDayCell}
        ${offboardingCell}
        ${servicesCell}
        ${laptopCell}
      `;

      // Add click event listener to row
      row.addEventListener("click", () => {
        showUserPage(agent.agent, "inactive");
      });

      tableBody.appendChild(row);
    });
  }

  // Filter and display data based on search input
  searchInput.addEventListener("input", (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filteredData = cache.filter((agent) =>
      (agent.agent || "").toLowerCase().includes(searchTerm)
    );
    populateTable(filteredData);
  });
});

document.querySelectorAll(".tabs ul li").forEach((tab, index) => {
  tab.addEventListener("click", () => {
    document
      .querySelectorAll(".tabs ul li")
      .forEach((item) => item.classList.remove("is-active"));
    tab.classList.add("is-active");

    document
      .querySelectorAll("#tab-content > div")
      .forEach((content) => (content.style.display = "none"));
    document.querySelectorAll("#tab-content > div")[index].style.display =
      "block";
  });
});

// add a burger
document.addEventListener("DOMContentLoaded", () => {
  const burger = document.querySelector(".navbar-burger");
  const menu = document.querySelector(".navbar-menu");

  if (burger && menu) {
    burger.addEventListener("click", () => {
      burger.classList.toggle("is-active");
      menu.classList.toggle("is-active");
    });
  }
});

function activateTab(tabId) {
  // Get all tabs and tab content elements
  const tabs = document.querySelectorAll(".tabs ul li");
  const tabContents = document.querySelectorAll("#tab-content > div");

  // Loop through all tabs to deactivate them
  tabs.forEach((tab, index) => {
    const content = tabContents[index];
    if (tab.textContent.trim().toLowerCase() === tabId.toLowerCase()) {
      // Activate the matching tab and its content
      tab.classList.add("is-active");
      content.style.display = "block";
    } else {
      // Deactivate other tabs and their contents
      tab.classList.remove("is-active");
      content.style.display = "none";
    }
  });
}

// Animated Color Key Modal
// Get the modal
var colormodal = r_e("colormodal");
// Get the button that opens the modal
var colorbtn = r_e("colorBtn");
// Get the <span> element that closes the modal
var colorspan = document.getElementsByClassName("colorclose")[0];
// When the user clicks the button, open the modal
colorbtn.onclick = function () {
  colormodal.style.display = "block";
};
// When the user clicks on <span> (x), close the modal
colorspan.onclick = function () {
  colormodal.style.display = "none";
};
// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == colormodal) {
    colormodal.style.display = "none";
  }
};
// End of Color key Modal

// open add employee modal
r_e("add-employee-button").addEventListener("click", () => {
  r_e("addemployeemodal").classList.add("is-active");
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
    try {
      const userDoc = await db.collection("users").doc(user.uid).get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        r_e("myAccountName").value = userData.name || "";
        r_e("myAccountEmail").value = user.email || "";
        r_e("myAccountRole").value = userData.role || "";
        r_e("myAccountModal").classList.add("is-active");
      }
    } catch (error) {
      console.error("Error fetching user data: ", error);
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
    const userDocRef = db.collection("users").doc(user.uid);

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

let userDataCache = {};

// Open the View Users Modal
r_e("view-users-button").addEventListener("click", async () => {
  const usersTableBody = r_e("users-table-body");
  usersTableBody.innerHTML = "";

  try {
    const usersSnapshot = await db.collection("users").get();
    const usersArray = [];

    usersSnapshot.forEach((doc) => {
      const userData = doc.data();
      usersArray.push({ id: doc.id, ...userData });
    });

    // Sort users by name before caching
    usersArray.sort((a, b) => a.name.localeCompare(b.name));

    // Cache sorted user data and fill table
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
  } catch (error) {
    console.error("Error getting users:", error);
  }
});

// Filter users in the table
r_e("searchUsersInput").addEventListener("input", () => {
  let searchTerm = r_e("searchUsersInput").value.toLowerCase(); // Make values lowercase
  let usersTableBody = r_e("users-table-body");
  usersTableBody.innerHTML = "";

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
document.addEventListener("click", (e) => {
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
r_e("userAccountForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const userId = r_e("userAccountModal").getAttribute("data-user-id");
  const userDocRef = db.collection("users").doc(userId);

  const name = r_e("userAccountName").value;
  const email = r_e("userAccountEmail").value;
  const role = r_e("userAccountRole").value;

  try {
    userDocRef.update({ name: name, email: email, role: role });
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
r_e("deleteUserButton").addEventListener("click", (e) => {
  e.preventDefault();
  const userId = r_e("userAccountModal").getAttribute("data-user-id");

  try {
    db.collection("users").doc(userId).delete();
    configure_message_bar("User deleted successfully.");
    r_e("userAccountModal").classList.remove("is-active");
    // Remove user from cache and table
    delete userDataCache[userId];
    document.querySelector(`tr[data-user-id="${userId}"]`).remove();
  } catch (err) {
    r_e("userAccountError").innerHTML = err.message;
  }
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
r_e("sendPasswordResetButton").addEventListener("click", (e) => {
  e.preventDefault();
  const email = r_e("userAccountEmail").value;

  try {
    firebase.auth().sendPasswordResetEmail(email);
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
    displayAgentButtons();
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
      r_e("edit-training-button").classList.remove("is-hidden");
    } else {
      r_e("signup-button").classList.add("is-hidden");
      r_e("view-users-button").classList.add("is-hidden");
      r_e("edit-training-button").classList.add("is-hidden");
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

let departedRows = document.querySelectorAll(".agent-depart-row");

departedRows.forEach((row) => {
  row.addEventListener("click", function () {
    closeAllModals();
    r_e("dashboard-div").classList.add("is-hidden");
    r_e("user-page-div").classList.remove("is-hidden");
  });
});

let trainingDataCache = {};
let localTrainingData = {};

// Function to sanitize field names
function sanitizeFieldName(name) {
  return name.replace(/[~*/[\]]/g, "_");
}

// Function to display steps from the cache
function displaySteps() {
  const stepsTableBody = r_e("stepsTableBody");
  stepsTableBody.innerHTML = "";

  // Check if steps exist and are not empty
  if (localTrainingData.steps && localTrainingData.steps.length > 0) {
    localTrainingData.steps.forEach((step, index) => {
      const stepRow = document.createElement("tr");
      stepRow.setAttribute("data-step-index", index);
      stepRow.classList.add("is-narrow");
      stepRow.innerHTML = `
        <td class="p-1"><input class="input step-name" type="text" value="${
          step.name
        }" data-step-index="${index}"></td>
        <td class="p-1">
          <div class="select">
            <select class="step-type" data-step-index="${index}">
              <option value="checkbox" ${
                step.type === "checkbox" ? "selected" : ""
              }>Checkbox</option>
              <option value="date" ${
                step.type === "date" ? "selected" : ""
              }>Date</option>
              <option value="text" ${
                step.type === "text" ? "selected" : ""
              }>Text</option>
              <option value="schedule" ${
                step.type === "schedule" ? "selected" : ""
              }>Schedule</option>
              <option value="finish" ${
                step.type === "finish" ? "selected" : ""
              }>Finish</option>
            </select>
          </div>
        </td>
        <td class="p-1">
          <button class="button is-danger delete-step-button" data-step-index="${index}">
            <span class="icon">
              <i class="fas fa-times"></i>
            </span>
          </button>
          ${
            index > 0
              ? `
          <button class="button is-warning move-up-step-button" data-step-index="${index}">
            <span class="icon">
              <i class="fas fa-arrow-up"></i>
            </span>
          </button>`
              : ""
          }
          ${
            index < localTrainingData.steps.length - 1
              ? `
          <button class="button is-warning move-down-step-button" data-step-index="${index}">
            <span class="icon">
              <i class="fas fa-arrow-down"></i>
            </span>
          </button>`
              : ""
          }
        </td>
      `;
      stepsTableBody.appendChild(stepRow);
    });
  } else {
    // Display a message if there are no steps
    const noStepsRow = document.createElement("tr");
    noStepsRow.innerHTML = `
      <td colspan="3" class="has-text-centered p-1">No steps available. Please add a step.</td>
    `;
    stepsTableBody.appendChild(noStepsRow);
  }

  // Re-attach event listeners
  attachEventListeners();
}

// Function to attach event listeners
function attachEventListeners() {
  document.querySelectorAll(".delete-step-button").forEach((button) => {
    button.addEventListener("click", (e) => {
      const stepIndex = parseInt(
        e.currentTarget.getAttribute("data-step-index")
      );
      localTrainingData.steps.splice(stepIndex, 1);
      displaySteps();
    });
  });

  document.querySelectorAll(".move-up-step-button").forEach((button) => {
    button.addEventListener("click", (e) => {
      const stepIndex = parseInt(
        e.currentTarget.getAttribute("data-step-index")
      );
      if (stepIndex > 0) {
        const temp = localTrainingData.steps[stepIndex];
        localTrainingData.steps[stepIndex] =
          localTrainingData.steps[stepIndex - 1];
        localTrainingData.steps[stepIndex - 1] = temp;
        displaySteps();
      }
    });
  });

  document.querySelectorAll(".move-down-step-button").forEach((button) => {
    button.addEventListener("click", (e) => {
      const stepIndex = parseInt(
        e.currentTarget.getAttribute("data-step-index")
      );
      if (stepIndex < localTrainingData.steps.length - 1) {
        const temp = localTrainingData.steps[stepIndex];
        localTrainingData.steps[stepIndex] =
          localTrainingData.steps[stepIndex + 1];
        localTrainingData.steps[stepIndex + 1] = temp;
        displaySteps();
      }
    });
  });
}

// Open the Training Levels Modal
r_e("edit-training-button").addEventListener("click", async () => {
  const trainingLevelsTableBody = r_e("trainingLevelsTableBody");
  trainingLevelsTableBody.innerHTML = "";

  const trainingDoc = await db.collection("training").doc("training").get();
  const trainingData = trainingDoc.data();

  if (trainingData) {
    trainingDataCache["training"] = trainingData; // Cache training data

    // Convert training data to an array and sort by order
    const trainingArray = Object.keys(trainingData)
      .map((key) => ({
        id: key,
        ...trainingData[key],
      }))
      .sort((a, b) => a.order - b.order);

    // Loop through each sorted training level
    trainingArray.forEach((training) => {
      const trainingRow = document.createElement("tr");
      trainingRow.setAttribute("data-training-id", training.id);
      trainingRow.innerHTML = `
        <td>${training.name}</td>
        <td>
          <button class="button is-info edit-training-button" data-training-id="${training.id}">Edit</button>
        </td>
      `;

      trainingLevelsTableBody.appendChild(trainingRow);
    });
  }

  r_e("trainingLevelsModal").classList.add("is-active");
});

// Filter training levels in the table
r_e("searchTrainingLevelsInput").addEventListener("input", () => {
  let searchTerm = r_e("searchTrainingLevelsInput").value.toLowerCase();
  let trainingLevelsTableBody = r_e("trainingLevelsTableBody");
  trainingLevelsTableBody.innerHTML = "";

  // Convert training data to an array and sort by order
  const trainingArray = Object.keys(trainingDataCache.training)
    .map((key) => ({
      id: key,
      ...trainingDataCache.training[key],
    }))
    .sort((a, b) => a.order - b.order);

  // Filter and display the sorted training levels
  trainingArray.forEach((training) => {
    if (training.name.toLowerCase().includes(searchTerm)) {
      const trainingRow = document.createElement("tr");
      trainingRow.setAttribute("data-training-id", training.id);
      trainingRow.innerHTML = `
        <td>${training.name}</td>
        <td>
          <button class="button is-info edit-training-button" data-training-id="${training.id}">Edit</button>
        </td>
      `;
      trainingLevelsTableBody.appendChild(trainingRow);
    }
  });
});

// Handle Edit Training Button Click
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("edit-training-button")) {
    const trainingId = e.target.getAttribute("data-training-id");
    const trainingData = trainingDataCache.training[trainingId]; // Get training data from cache

    if (trainingData) {
      localTrainingData = { ...trainingData }; // Make a local copy of the training data
      displaySteps();

      r_e("editTrainingLevelModal").setAttribute(
        "data-training-id",
        trainingId
      );
      r_e("editTrainingLevelModal").classList.add("is-active");
    }
  }
});

// Add New Step
r_e("addStepButton").addEventListener("click", () => {
  const newStepName = r_e("newStepName").value;
  const newStepType = r_e("newStepType").value;

  if (newStepName && newStepType) {
    const newStep = { name: newStepName, type: newStepType };

    if (!localTrainingData.steps) {
      localTrainingData.steps = [];
    }
    localTrainingData.steps.push(newStep);

    displaySteps();

    r_e("newStepName").value = "";
    r_e("newStepType").value = "checkbox";
    r_e("errorMessage").innerHTML = "";
  } else {
    r_e("errorMessage").innerHTML = "Please fill out all fields.";
  }
});

// Save Changes in Steps to Firestore
r_e("saveChangesButton").addEventListener("click", async () => {
  const trainingDocRef = db.collection("training").doc("training");

  // Update localTrainingData with the latest values from the inputs
  localTrainingData.steps.forEach((step, index) => {
    const stepNameInput = document.querySelector(
      `.step-name[data-step-index="${index}"]`
    );
    const stepTypeSelect = document.querySelector(
      `.step-type[data-step-index="${index}"]`
    );
    step.name = stepNameInput.value;
    step.type = stepTypeSelect.value;
  });

  try {
    const sanitizedFieldName = sanitizeFieldName(localTrainingData.name);
    await trainingDocRef.update({ [sanitizedFieldName]: localTrainingData });

    // Update cache
    trainingDataCache.training[localTrainingData.name] = localTrainingData;

    r_e("errorMessage").innerHTML = "";
    configure_message_bar("Training level updated successfully.");
    r_e("editTrainingLevelModal").classList.remove("is-active");
  } catch (err) {
    r_e("errorMessage").innerHTML = err.message;
  }
});

// Initial call to attach event listeners
attachEventListeners();

// Function to fetch agent data and display as buttons in the appropriate divs
function displayAgentButtons() {
  document.querySelectorAll(".agent-button-div").forEach((div) => {
    div.innerHTML = "";
  });

  db.collection("agents")
    .doc("active")
    .get()
    .then((doc) => {
      if (doc.exists) {
        const agents = doc.data();
        const agentArray = Object.keys(agents).map((key) => ({
          agent: key,
          ...agents[key],
        }));

        // Sort agents by lastReviewed date, with empty dates at the top, and by agent if dates are equal
        agentArray.sort((a, b) => {
          if (!a.lastReviewed && !b.lastReviewed)
            return a.agent.localeCompare(b.agent);
          if (!a.lastReviewed) return -1;
          if (!b.lastReviewed) return 1;
          const dateComparison =
            new Date(a.lastReviewed) - new Date(b.lastReviewed);
          if (dateComparison !== 0) return dateComparison;
          return a.agent.localeCompare(b.agent);
        });

        agentArray.forEach((agent) => {
          const button = document.createElement("button");
          button.id = `agent-${agent.agent}`;
          button.className = "button is-small m-1 agent-button";
          button.draggable = true;
          button.textContent = agent.agent;

          // Apply red text color if the flag is 1
          if (agent.flag === 1) {
            button.classList.add("has-text-danger");
          }

          // Apply blue text color if the flag is 1
          if (agent.flag === 2) {
            button.classList.add("has-text-info");
          }

          // Apply yellow highlight if departing
          if (agent.departing) {
            button.classList.add("has-background-warning");
          }

          // Check if lastReviewed is within the last 2 months
          if (agent.lastReviewed) {
            const lastReviewedDate = new Date(agent.lastReviewed);
            const currentDate = new Date();
            const timeDiff = currentDate - lastReviewedDate;
            const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
            if (daysDiff < 60) {
              button.classList.add("has-background-review");
            }
          }

          button.onclick = function () {
            showUserPage(agent.agent);
          };

          r_e(
            `agent-button-${agent.trainingLevel}-${agent.trainingStatus}`
          ).appendChild(button);
        });
      }
    })
    .catch((error) => {
      console.error("Error getting document:", error);
    });
}

// Map training levels to names
const trainingLevelNames = {
  1: "Pick 1",
  2: "Advanced Phones",
  3: "Chat/Email",
  4: "Onsite",
  5: "HDQA",
};

const slpNames = {
  0: "",
  1: "Student Team Lead",
  2: "Student Developer",
  3: "Data & Metrics Student Lead",
};

const flagNames = {
  0: "",
  1: "Attendance or performance concerns",
  2: "Does not want to train up",
};

// Function to initialize collapsible functionality
function initializeCollapsibles() {
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
}

// Call initializeCollapsibles on DOMContentLoaded
document.addEventListener("DOMContentLoaded", function () {
  initializeCollapsibles();
});

function calculateDuration(date) {
  let lastReviewedDate = new Date(date);
  let today = new Date();
  let timeDifference = today - lastReviewedDate;
  let durationInDays = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  return durationInDays;
}

// Function to display the user page for a specific agent
function showUserPage(agentId, agentStatus = "active", tab = "") {
  // Get the agent data from Firestore
  db.collection("agents")
    .doc(agentStatus)
    .collection("data")
    .doc(agentId)
    .get()
    .then((doc) => {
      if (doc.exists) {
        const agent = doc.data();
        if (tab == "") {
          if (!agent.departing) {
            activateTab("Training");
          } else {
            activateTab("Offboarding");
          }
        } else if (!(tab == "Keep")) {
          activateTab(tab);
        }

        // Populate user page elements with agent data
        r_e("user-page-agent-name").textContent = agent.agent;
        r_e("user-page-training-level").textContent =
          trainingLevelNames[agent.trainingLevel] || "Unknown";
        r_e("user-page-slp").textContent = slpNames[agent.slpRole] || "";
        r_e("user-page-status").textContent = agent.status || "Unknown";
        r_e("user-page-flag").textContent = flagNames[agent.flag] || "";
        r_e("user-page-hire-date").textContent = agent.hireDate;
        r_e("user-page-graduation").textContent = agent.graduation;
        r_e("user-page-last-reviewed").textContent =
          agent.lastReviewed || "Never";
        r_e("user-page-last-reviewed-duration").textContent =
          calculateDuration(agent.lastReviewed) || "∞";

        // Fetch and display training steps
        const trainingDiv = document.querySelector(".training-div");
        trainingDiv.innerHTML = ""; // Clear existing content

        const trainingArray = Object.keys(agent.training).map((key) => ({
          ...agent.training[key],
          key,
        }));

        // Sort the training array by the order property
        trainingArray.sort((a, b) => a.order - b.order);

        // Find the highest order
        const highestOrder = trainingArray
          .filter((item) => item.order !== 6)
          .reduce((max, item) => (item.order > max ? item.order : max), 0);

        trainingArray.forEach((trainingData) => {
          const steps = trainingData.steps;

          // Create training box
          const trainingBox = document.createElement("div");
          trainingBox.classList.add("box", "collapsible");

          // Create training header
          const trainingHeader = document.createElement("a");
          trainingHeader.innerHTML = `
            <div class="columns is-mobile is-vcentered">
              <div class="column">
                <h2 class="title is-size-5">${trainingData.name}</h2>
              </div>
              <div class="column has-text-left">
                <h2 class="title is-size-6">
                  <span class="icon has-text-${
                    agent.trainingStatus === 2 &&
                    trainingData.order === highestOrder
                      ? "warning"
                      : "success"
                  } is-size-7">
                    <i class="fas fa-circle"></i>
                  </span>
                  ${
                    agent.trainingStatus === 2 &&
                    trainingData.order === highestOrder
                      ? "In Progress"
                      : `Completed ${trainingData.completedDate || "N/A"}`
                  }
                </h2>
              </div>
              <div class="column has-text-right is-one-fifth">
                <h2 class="title is-size-5">
                  <i class="fas fa-caret-down"></i>
                </h2>
              </div>
            </div>
          `;
          trainingBox.appendChild(trainingHeader);

          // Create training form
          const trainingForm = document.createElement("form");
          trainingForm.classList.add("pt-5");
          trainingForm.id = "trainingForm";

          for (const stepKey in steps) {
            if (steps.hasOwnProperty(stepKey)) {
              const step = steps[stepKey];

              const field = document.createElement("div");
              field.classList.add("field", "is-horizontal");

              const fieldLabel = document.createElement("div");
              fieldLabel.classList.add("field-label", "is-normal");
              fieldLabel.style.flexGrow = 4;
              fieldLabel.innerHTML = `<label class="label is-size-6">${step.name}</label>`;
              field.appendChild(fieldLabel);

              const fieldBody = document.createElement("div");
              fieldBody.classList.add("field-body");

              const fieldControl = document.createElement("div");
              fieldControl.classList.add("field");

              const control = document.createElement("div");
              control.classList.add("control");

              if (
                step.finish != 1 ||
                (agent.trainingStatus === 2 &&
                  trainingData.order === highestOrder)
              ) {
                if (step.type === "checkbox") {
                  control.innerHTML = `<input type="checkbox" name="${stepKey}" ${
                    step.value ? "checked" : ""
                  } />`;
                } else if (step.type === "date") {
                  control.innerHTML = `<input type="date" name="${stepKey}" class="input is-size-6" value="${
                    step.value || ""
                  }" />`;
                } else if (step.type === "text") {
                  control.innerHTML = `<input type="text" name="${stepKey}" class="input is-size-6" value="${
                    step.value || ""
                  }" />`;
                }
              } else {
                if (step.type === "checkbox") {
                  control.innerHTML = `<input type="checkbox" disabled="true" name="${stepKey}" ${
                    step.value ? "checked" : ""
                  } />`;
                } else if (step.type === "date") {
                  control.innerHTML = `<input type="date" disabled="true" name="${stepKey}" class="input is-size-6" value="${
                    step.value || ""
                  }" />`;
                }
              }

              fieldControl.appendChild(control);
              fieldBody.appendChild(fieldControl);
              field.appendChild(fieldBody);
              trainingForm.appendChild(field);
            }
          }

          // Add save, cancel, and finish buttons
          trainingForm.innerHTML += `
            <button class="button is-success" type="submit">Save Changes</button>
            ${
              trainingData.order === highestOrder
                ? `${
                    trainingData.order !== 1
                      ? `<button class="button is-danger" type="button">Cancel ${trainingData.name}</button>`
                      : ""
                  }`
                : ""
            }
          `;

          trainingBox.appendChild(trainingForm);
          trainingDiv.appendChild(trainingBox);

          // Add event listener for save button
          trainingForm
            .querySelector(".button.is-success")
            .addEventListener("click", function (event) {
              event.preventDefault();
              saveTrainingUpdates(agent, trainingData.key, trainingForm);
            });

          // Add event listener for cancel button if it exists
          const cancelButton = trainingForm.querySelector(".button.is-danger");
          if (cancelButton) {
            cancelButton.addEventListener("click", function (event) {
              event.preventDefault();
              cancelTraining(
                agentId,
                trainingData.key,
                trainingData.order,
                agent.status
              );
            });
          }
        });

        let trainingButtonsHTML = "";
        let nextTrainingButtonActive = false;

        if (agent.trainingStatus !== 2 && agent.trainingLevel !== 5) {
          nextTrainingButtonActive = true;
          trainingButtonsHTML += `
            <button
              id="start-next-training-button"
              class="button is-link"
              type="submit"
            >
              Start 
              <span id="user-page-next-training-level">${
                trainingLevelNames[agent.trainingLevel + 1] || "Unknown"
              }</span
              > Training
            </button>`;
        }

        r_e("training-buttons").innerHTML = trainingButtonsHTML;

        // Add event listener for the start-next-training-button if it exists
        if (nextTrainingButtonActive) {
          r_e("start-next-training-button").addEventListener(
            "click",
            function () {
              startNextTraining(
                agentId,
                agent.trainingLevel,
                agent.status
              ).then(() => {
                showUserPage(agentId, agentStatus, "Training");
              });
            }
          );
        }

        if (!agent.departing) {
          r_e(
            "offboarding-div"
          ).innerHTML = `<button class="button is-danger" id="start-offboarding" type="button">Start Offboarding</button>`;
          r_e("start-offboarding").addEventListener("click", function () {
            startOffboarding(agentId).then(() => {
              showUserPage(agentId, agentStatus, "Offboarding");
            });
          });
        } else {
          const offboardingDiv = r_e("offboarding-div");
          offboardingDiv.innerHTML = ""; // Clear existing content

          // Create Offboarding box
          const genoffboardingBox = document.createElement("div");
          genoffboardingBox.classList.add("box");

          // Create Offboarding form
          const genoffboardingForm = document.createElement("form");
          genoffboardingForm.id = "offboardingForm";

          // Add Offboarding fields
          genoffboardingForm.innerHTML = `
  <div class="field">
    <label class="label">Last Day</label>
    <div class="control">
      <input class="input" type="date" name="lastDay" value="${
        agent.departing.lastDay || ""
      }">
    </div>
  </div>
  <div class="field">
    <label class="label">Reason</label>
    <div class="control">
      <div class="select">
        <select name="reason">
          <option value="" ${
            !agent.departing.reason ? "selected" : ""
          }></option>
          <option value="Graduation" ${
            agent.departing.reason === "Graduation" ? "selected" : ""
          }>Graduation</option>
          <option value="Resigned" ${
            agent.departing.reason === "Resigned" ? "selected" : ""
          }>Resigned</option>
          <option value="Hiatus" ${
            agent.departing.reason === "Hiatus" ? "selected" : ""
          }>Hiatus</option>
          <option value="Dismissed" ${
            agent.departing.reason === "Dismissed" ? "selected" : ""
          }>Dismissed</option>
        </select>
      </div>
    </div>
  </div>
  <div class="field">
    <label class="checkbox">
      <input type="checkbox" name="offboarded" ${
        agent.departing.offboarded ? "checked" : ""
      }>
      Offboarded
    </label>
  </div>
  <button class="button is-success" type="submit">Save Changes</button>
`;

          genoffboardingBox.appendChild(genoffboardingForm);
          offboardingDiv.appendChild(genoffboardingBox);

          // Add event listener for save button
          genoffboardingForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            // Extract data from form
            const lastDay = genoffboardingForm.querySelector(
              'input[name="lastDay"]'
            ).value;
            const reason = genoffboardingForm.querySelector(
              'select[name="reason"]'
            ).value;
            const offboarded = genoffboardingForm.querySelector(
              'input[name="offboarded"]'
            ).checked;

            // Update trainingLevel and trainingStatus for the agent in the main collection
            db.collection("agents")
              .doc(agentStatus)
              .update({
                [`${agentId}.departing.lastDay`]: lastDay,
                [`${agentId}.departing.reason`]: reason,
                [`${agentId}.departing.offboarded`]: offboarded,
              })
              .then(() => {
                db.collection("agents")
                  .doc(agentStatus)
                  .collection("data")
                  .doc(agentId)
                  .update({
                    [`departing.lastDay`]: lastDay,
                    [`departing.reason`]: reason,
                    [`departing.offboarded`]: offboarded,
                  })
                  .then(() => {
                    // Check changes in `offboarded` state and run appropriate function
                    if (!agent.departing.offboarded && offboarded) {
                      if (agent.departing.laptop && agent.departing.services) {
                        // If offboarded was not checked and now is checked
                        agentStatusChange(
                          agent.agent,
                          agent.status,
                          "inactive"
                        ).then(() => {
                          configure_message_bar("Agent made inactive.");
                          showUserPage(agent.agent, "inactive", "Offboarding");
                          displayAgentButtons();
                        });
                      } else {
                        // If offboarded was not checked and now is checked
                        agentStatusChange(
                          agent.agent,
                          agent.status,
                          "departing"
                        ).then(() => {
                          configure_message_bar("Agent made departing.");
                          showUserPage(agent.agent, "departing", "Offboarding");
                          displayAgentButtons();
                        });
                      }
                    } else if (agent.departing.offboarded && !offboarded) {
                      // If offboarded was checked and now is unchecked
                      agentStatusChange(
                        agent.agent,
                        agent.status,
                        "active"
                      ).then(() => {
                        configure_message_bar("Agent made active.");
                        showUserPage(agent.agent, "active", "Offboarding");
                        displayAgentButtons();
                      });
                    } else {
                      configure_message_bar("Offboarding data saved.");
                    }
                  });
              });
          });

          // Create Laptop box
          const laptopBox = document.createElement("div");
          laptopBox.classList.add("box", "collapsible");

          // Create laptop header
          const laptopHeader = document.createElement("a");
          laptopHeader.innerHTML = `
              <div class="columns is-mobile is-vcentered">
                <div class="column">
                  <h2 class="title is-size-5">Laptop</h2>
                </div>
                <div class="column has-text-left">
                  <h2 class="title is-size-6">
                    <span class="icon has-text-${
                      agent.departing.laptop == 0 ? "danger" : "success"
                    } is-size-7">
                      <i class="fas fa-circle"></i>
                    </span>
                    ${
                      agent.departing.laptop == 0
                        ? "Not Returned"
                        : `Returned ${
                            agent.departing.device.returnDate || "N/A"
                          }`
                    }
                  </h2>
                </div>
                <div class="column has-text-right is-one-fifth">
                  <h2 class="title is-size-5">
                    <i class="fas fa-caret-down"></i>
                  </h2>
                </div>
              </div>
            `;
          laptopBox.appendChild(laptopHeader);

          // Create Laptop form
          const laptopForm = document.createElement("form");
          laptopForm.classList.add("pt-5");
          laptopForm.id = "laptopForm";

          // Add Laptop fields
          laptopForm.innerHTML = `
            <div class="field">
              <label class="label">Serial Number</label>
              <div class="control">
                <input class="input" type="text" name="serialNumber" value="${
                  agent.departing.device.serial || ""
                }">
              </div>
            </div>
            <div class="field">
              <label class="checkbox">
                <input type="checkbox" name="returned" ${
                  agent.departing.laptop ? "checked" : ""
                }>
                Returned?
              </label>
            </div>
            <div class="field">
              <label class="label">Return Date</label>
              <div class="control">
                <input class="input" type="date" name="returnDate"  value="${
                  agent.departing.device.returnDate || ""
                }">
              </div>
            </div>
            <div class="field">
              <label class="label">Incident</label>
              <div class="control">
                <input class="input" type="text" name="incident"  value="${
                  agent.departing.device.incident || ""
                }">
              </div>
            </div>
            <div class="field">
              <label class="checkbox">
                <input type="checkbox" name="returnedInNOVA"  ${
                  agent.departing.device.rtnNova ? "checked" : ""
                }>
                Returned in NOVA
              </label>
            </div>
            <div class="field" id="emailedField" style="display: none;">
              <label class="checkbox">
                <input type="checkbox" name="emailed"  ${
                  agent.departing.device.email ? "checked" : ""
                }>
                Emailed?
              </label>
            </div>
            <div class="field" id="holdPlacedField" style="display: none;">
              <label class="checkbox">
                <input type="checkbox" name="holdPlaced" ${
                  agent.departing.device.hold ? "checked" : ""
                }>
                Hold Placed?
              </label>
            </div>
            <button class="button is-success" type="submit">Save Changes</button>
          `;

          laptopBox.appendChild(laptopForm);
          offboardingDiv.appendChild(laptopBox);

          // Function to toggle field visibility based on checkbox state
          function toggleFields() {
            const checkbox = laptopForm.querySelector('input[name="returned"]');
            const isChecked = checkbox.checked; // Use `checked` to determine checkbox state
            const emailedField = laptopForm.querySelector("#emailedField");
            const holdPlacedField =
              laptopForm.querySelector("#holdPlacedField");

            if (isChecked) {
              emailedField.style.display = "none";
              holdPlacedField.style.display = "none";
            } else {
              emailedField.style.display = "block";
              holdPlacedField.style.display = "block";
            }
          }
          toggleFields();

          // Attach event listener
          laptopForm
            .querySelector('input[name="returned"]')
            .addEventListener("change", toggleFields);

          // Add event listener for save button

          // Add event listener for save button
          laptopForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            // Extract data from form
            const serialNumber = laptopForm.querySelector(
              'input[name="serialNumber"]'
            ).value;
            const returned = laptopForm.querySelector(
              'input[name="returned"]'
            ).checked;
            const returnDate = laptopForm.querySelector(
              'input[name="returnDate"]'
            ).value;
            const incident = laptopForm.querySelector(
              'input[name="incident"]'
            ).value;
            const returnedInNOVA = laptopForm.querySelector(
              'input[name="returnedInNOVA"]'
            ).checked;
            const emailed = laptopForm.querySelector(
              'input[name="emailed"]'
            ).checked;
            const holdPlaced = laptopForm.querySelector(
              'input[name="holdPlaced"]'
            ).checked;

            // Update trainingLevel and trainingStatus for the agent in the main collection
            db.collection("agents")
              .doc(agentStatus)
              .update({
                [`${agentId}.departing.laptop`]: returned,
              })
              .then(() => {
                db.collection("agents")
                  .doc(agentStatus)
                  .collection("data")
                  .doc(agentId)
                  .update({
                    [`departing.laptop`]: returned,
                    [`departing.device.serial`]: serialNumber,
                    [`departing.device.returnDate`]: returnDate,
                    [`departing.device.incident`]: incident,
                    [`departing.device.rtnNova`]: returnedInNOVA,
                    [`departing.device.email`]: emailed,
                    [`departing.device.hold`]: holdPlaced,
                  })
                  .then(() => {
                    if (
                      agent.status == "departing" &&
                      agent.departing.services &&
                      agent.departing.offboarded &&
                      returned
                    ) {
                      agentStatusChange(
                        agent.agent,
                        agent.status,
                        "inactive"
                      ).then(() => {
                        configure_message_bar("Agent made inactive.");
                        showUserPage(agent.agent, "inactive", "Offboarding");
                        displayAgentButtons();
                      });
                    } else if (agent.status == "inactive" && !returned) {
                      agentStatusChange(
                        agent.agent,
                        agent.status,
                        "departing"
                      ).then(() => {
                        configure_message_bar("Agent made departing.");
                        showUserPage(agent.agent, "departing", "Offboarding");
                        displayAgentButtons();
                      });
                    } else if (
                      (!agent.departing.laptop && returned) ||
                      (agent.departing.laptop && !returned)
                    ) {
                      showUserPage(agent.agent, agent.status, "Offboarding");
                      configure_message_bar("Offboarding data saved.");
                    } else {
                      configure_message_bar("Offboarding data saved.");
                    }
                  });
              });
          });

          // Create offboarding box
          const offboardingBox = document.createElement("div");
          offboardingBox.classList.add("box", "collapsible");

          // Create offboarding header
          const offboardingHeader = document.createElement("a");
          offboardingHeader.innerHTML = `
              <div class="columns is-mobile is-vcentered">
                <div class="column">
                  <h2 class="title is-size-5">Services</h2>
                </div>
                <div class="column has-text-left">
                  <h2 class="title is-size-6">
                    <span class="icon has-text-${
                      !agent.departing.services ? "danger" : "success"
                    } is-size-7">
                      <i class="fas fa-circle"></i>
                    </span>
                    ${!agent.departing.services ? "Not Completed" : "Completed"}
                  </h2>
                </div>
                <div class="column has-text-right is-one-fifth">
                  <h2 class="title is-size-5">
                    <i class="fas fa-caret-down"></i>
                  </h2>
                </div>
              </div>
            `;
          offboardingBox.appendChild(offboardingHeader);

          // Create offboarding form
          const offboardingForm = document.createElement("form");
          offboardingForm.classList.add("pt-5");
          offboardingForm.classList.add("pl-5");
          offboardingForm.id = "offboardingForm";

          // Dynamically generate the form based on agent.departing.steps
          agent.departing.steps.forEach((step, index) => {
            const field = document.createElement("div");
            field.classList.add("field");

            if (step.type === "checkbox") {
              // Create a checkbox-style field
              const label = document.createElement("label");
              label.classList.add("checkbox");

              const input = document.createElement("input");
              input.type = "checkbox";
              input.name = step.name; // Use step name as the field name
              input.dataset.index = index; // Include the step's index

              if (step.value) {
                input.setAttribute("checked", "checked"); // Set the "checked" attribute for HTML
              }

              label.appendChild(input);
              label.append(` ${step.name}`); // Add step name as label text
              field.appendChild(label);
            } else {
              // Create a label and input-style field
              const label = document.createElement("label");
              label.classList.add("label");
              label.textContent = step.name;

              const control = document.createElement("div");
              control.classList.add("control");

              const input = document.createElement("input");
              input.classList.add("input");
              input.type = step.type === "date" ? "date" : "text"; // Determine input type
              input.name = step.name; // Use step name as the field name
              input.dataset.index = index; // Include the step's index
              input.value = step.value || ""; // Use the value field for the input value

              control.appendChild(input);
              field.appendChild(label);
              field.appendChild(control);
            }

            // Append the field to the form
            offboardingForm.appendChild(field);
          });

          // Add save buttons
          offboardingForm.innerHTML += `
    <button class="button is-success" type="submit">Save Changes</button>
  `;

          offboardingBox.appendChild(offboardingForm);
          offboardingDiv.appendChild(offboardingBox);

          // Add event listener for save button
          offboardingForm
            .querySelector(".button.is-success")
            .addEventListener("click", function (event) {
              event.preventDefault();

              // Prepare data for updating Firestore
              const updateData = { "departing.steps": [] }; // Initialize steps array in departing map
              let finished = true;
              offboardingForm.querySelectorAll(".field").forEach((field) => {
                const input = field.querySelector("input");
                if (input) {
                  const name = input.name;
                  const index = input.dataset.index;

                  if (
                    !(input.type === "checkbox" ? input.checked : input.value)
                  ) {
                    finished = false;
                  }
                  // Handle steps array data
                  const stepValue = {
                    name,
                    type: input.type === "checkbox" ? "checkbox" : input.type,
                    value:
                      input.type === "checkbox" ? input.checked : input.value,
                  };
                  updateData["departing.steps"][index] = stepValue;
                }
              });

              // update main collection and sub collection if change to finished
              if (
                (!agent.departing.services && finished) ||
                (agent.departing.services && !finished)
              ) {
                updateData["departing.services"] = finished;
                db.collection("agents")
                  .doc(agentStatus)
                  .update({
                    [`${agentId}.departing.services`]: finished,
                  });
              }

              // Update the Firestore document
              db.collection("agents")
                .doc(agentStatus)
                .collection("data")
                .doc(agentId)
                .update(updateData)
                .then(() => {
                  if (
                    agent.status == "departing" &&
                    agent.departing.laptop &&
                    agent.departing.offboarded &&
                    finished
                  ) {
                    agentStatusChange(
                      agent.agent,
                      agent.status,
                      "inactive"
                    ).then(() => {
                      configure_message_bar("Agent made inactive.");
                      showUserPage(agent.agent, "inactive", "Offboarding");
                      displayAgentButtons();
                    });
                  } else if (agent.status == "inactive" && !finished) {
                    agentStatusChange(
                      agent.agent,
                      agent.status,
                      "departing"
                    ).then(() => {
                      configure_message_bar("Agent made departing.");
                      showUserPage(agent.agent, "departing", "Offboarding");
                      displayAgentButtons();
                    });
                  } else if (
                    (!agent.departing.services && finished) ||
                    (agent.departing.services && !finished)
                  ) {
                    showUserPage(agent.agent, agent.status, "Offboarding");
                    configure_message_bar("Offboarding data saved.");
                  } else {
                    configure_message_bar("Offboarding data saved.");
                  }
                });
            });

          // Create the cancel button element
          const cancelButton = document.createElement("button");
          cancelButton.className = "button is-danger";
          cancelButton.id = "cancel-offboarding";
          cancelButton.type = "button";
          cancelButton.textContent = "Cancel Offboarding";
          offboardingDiv.appendChild(cancelButton);

          cancelButton.addEventListener("click", function () {
            cancelOffboarding(agentId, agentStatus).then(() => {
              showUserPage(agentId, agentStatus, "Offboarding");
            });
          });
        }
      }

      // Reinitialize collapsibles after adding new boxes
      initializeCollapsibles();

      closeAllModals();
      r_e("dashboard-div").classList.add("is-hidden");
      r_e("user-page-div").classList.remove("is-hidden");
    });
}

// Function to finish the current training and update the database
function finishTraining(
  agentId,
  trainingOrder,
  trainingKey,
  completedDate,
  agentStatus = "active"
) {
  const newTrainingLevel = trainingOrder;

  // Update the training level and status in the database
  const updates = {
    trainingLevel: newTrainingLevel,
    trainingStatus: 0,
    [`training.${trainingKey}.completedDate`]: completedDate,
  };

  // Update trainingLevel and trainingStatus for the agent in the main collection
  db.collection("agents")
    .doc(agentStatus)
    .update({
      [`${agentId}.trainingLevel`]: newTrainingLevel,
      [`${agentId}.trainingStatus`]: 0,
    })
    .then(() => {
      db.collection("agents")
        .doc(agentStatus)
        .collection("data")
        .doc(agentId)
        .update(updates)
        .then(() => {
          configure_message_bar(
            "Agent's training level and status updated in the main collection."
          );
          // Refresh the user page to reflect the changes
          showUserPage(agentId, agentStatus, "Training");
        })
        .catch((error) => {
          console.error(
            "Error updating agent's training level and status in the main collection: ",
            error
          );
          configure_message_bar(
            "Error updating agent's training level and status in the main collection."
          );
        });
    })
    .catch((error) => {
      console.error("Error updating training level and status: ", error);
      configure_message_bar("Error updating training level and status.");
    });
}

// Function to save training updates to the database
function saveTrainingUpdates(agent, trainingKey, form) {
  const updates = {};

  // Collect form data
  const formData = new FormData(form);
  formData.forEach((value, key) => {
    // Replace invalid characters in key
    const sanitizedKey = key.replace(/[~*/[\]]/g, "_");
    const stepIndex = parseInt(sanitizedKey, 10);
    updates[stepIndex] = value;
  });

  // Handle unchecked checkboxes
  form.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
    if (!checkbox.checked) {
      const sanitizedKey = checkbox.name.replace(/[~*/[\]]/g, "_");
      const stepIndex = parseInt(sanitizedKey, 10);
      updates[stepIndex] = ""; // Set the value to an empty string for unchecked checkboxes
    }
  });

  const data = agent;
  const steps = data.training[trainingKey].steps || [];

  // Track tasks to add or remove
  const tasksToAdd = [];
  const tasksToRemove = [];

  // Update the steps array
  Object.keys(updates).forEach((index) => {
    const stepIndex = parseInt(index, 10);
    const step = steps[stepIndex];
    const value = updates[index];

    if (step) {
      step.value = value;

      // Handle task creation for "scheduled" and "finish" steps
      if (
        (step.type === "date" && step.schedule) ||
        (step.type === "date" && step.finish)
      ) {
        const checkboxStep = steps[stepIndex + 1]; // Assuming the checkbox step follows the date step
        const taskId = `training-${trainingKey}-${stepIndex}`;
        const manager = firebase.auth().currentUser.email;

        // Use the updates object to check the submitted values
        const checkboxValue = updates[stepIndex + 1];

        agentId = agent.agent;
        agentStatus = agent.status;

        if (value && !checkboxValue) {
          tasksToAdd.push({
            agentId,
            taskId,
            taskSource: "training",
            taskName: step.name,
            taskDate: value,
            manager,
          });
        } else if (checkboxValue) {
          tasksToRemove.push({ agentId, taskId });
        }

        if (step.finish && checkboxValue) {
          // Prompt the user for confirmation before finishing training
          if (
            confirm(
              "Are you sure you want to finish this training? Training Completed date will not be able to be updated."
            )
          ) {
            finishTraining(
              agentId,
              data.training[trainingKey].order,
              trainingKey,
              value,
              agentStatus
            ); // Pass the finish date value here
          } else {
            // If the user cancels, uncheck the checkbox
            checkboxStep.value = "";
          }
        }
      }
    } else {
      steps[stepIndex] = { value };
    }
  });

  // Write the updated steps array back to Firestore
  db.collection("agents")
    .doc(agent.status)
    .collection("data")
    .doc(agentId)
    .update({
      [`training.${trainingKey}.steps`]: steps,
    })
    .then(() => {
      configure_message_bar("Training updates saved successfully.");
      displayAgentButtons(); // Update the cache of the main dashboard

      // Process tasks to add
      tasksToAdd.forEach((task) => {
        addTask(
          task.agentId,
          agent.status,
          task.taskId,
          task.taskSource,
          task.taskName,
          task.taskDate,
          task.manager
        );
      });

      // Process tasks to remove
      tasksToRemove.forEach((task) => {
        removeTask(task.agentId, agent.status, task.taskId);
      });

      // Update the local form data without refreshing
      updateLocalFormData(agentId, trainingKey, steps);
    })
    .catch((error) => {
      console.error("Error saving training updates: ", error);
      configure_message_bar("Error saving training updates.");
    });
}

// Function to update local form data without refreshing
function updateLocalFormData(agentId, trainingKey, steps) {
  const trainingForm = r_e("trainingForm");

  if (!trainingForm) {
    console.error("Error: trainingForm element not found.");
    configure_message_bar("Error: trainingForm element not found.");
    return;
  }

  // Update the form fields with the new steps data
  for (const stepKey in steps) {
    if (steps.hasOwnProperty(stepKey)) {
      const step = steps[stepKey];
      const input = trainingForm.querySelector(`[name="${stepKey}"]`);

      if (input) {
        if (input.type === "checkbox") {
          input.checked = step.value ? true : false;
        } else {
          input.value = step.value || "";
        }
      }
    }
  }
}

// Function to cancel training and update the database
function cancelTraining(agentId, trainingKey, trainingOrder, agentStatus) {
  const newTrainingLevel = trainingOrder - 1;

  // Remove the training section from the database
  const updates = {
    [`training.${trainingKey}`]: firebase.firestore.FieldValue.delete(),
    trainingLevel: newTrainingLevel,
    trainingStatus: 0,
  };

  db.collection("agents")
    .doc(agentStatus)
    .collection("data")
    .doc(agentId)
    .update(updates)
    .then(() => {
      // Get main collection data for task removal
      db.collection("agents")
        .doc(agentStatus)
        .get()
        .then((doc) => {
          let mainUpdates = {
            [`${agentId}.trainingLevel`]: newTrainingLevel,
            [`${agentId}.trainingStatus`]: 0,
          };

          mainAgentDoc = doc.data()[agentId];

          // Remove all tasks associated with this training level
          const tasks = mainAgentDoc.tasks || {};
          for (const taskId in tasks) {
            if (taskId.startsWith(`training-${trainingKey}-`)) {
              mainUpdates[`${agentId}.tasks.${taskId}`] =
                firebase.firestore.FieldValue.delete();
            }
          }
          // Update trainingLevel and trainingStatus for the agent in the main collection
          db.collection("agents")
            .doc(agentStatus)
            .update(mainUpdates)
            .then(() => {
              configure_message_bar(
                "Agent's training level and status updated in the main collection."
              );
              displayAgentButtons(); // Update the cache of the main dashboard

              // Refresh the user page to reflect the changes
              showUserPage(agentId, agentStatus, "Training");
            })
            .catch((error) => {
              console.error(
                "Error updating agent's training level and status in the main collection: ",
                error
              );
              configure_message_bar(
                "Error updating agent's training level and status in the main collection."
              );
            });
        });
    })
    .catch((error) => {
      console.error("Error removing training section: ", error);
      configure_message_bar("Error removing training section.");
    });
}

// Function to handle starting the next training level
function startNextTraining(agentId, currentLevel, agentStatus) {
  return new Promise((resolve, reject) => {
    const newTrainingLevel = currentLevel + 1;

    // Get the next training steps from the training collection
    db.collection("training")
      .doc("training")
      .get()
      .then((trainingDoc) => {
        if (trainingDoc.exists) {
          const trainingData = trainingDoc.data();
          let foundKey = null;
          let nextTraining = null;

          // Find the key and the corresponding training data
          for (const [key, value] of Object.entries(trainingData)) {
            if (value.order === newTrainingLevel) {
              foundKey = key;
              nextTraining = value;
              break;
            }
          }

          if (nextTraining) {
            // Process steps to handle "finish" and "schedule" types
            nextTraining.steps = nextTraining.steps.flatMap((step) => {
              if (step.type === "finish") {
                return [
                  { ...step, type: "date", finish: 1 },
                  { ...step, type: "checkbox", finish: 1 },
                ];
              } else if (step.type === "schedule") {
                return [
                  { ...step, type: "date", schedule: 1 },
                  { ...step, type: "checkbox", schedule: 1 },
                ];
              } else {
                return step;
              }
            });

            const updates = {
              [`training.${foundKey}`]: {
                name: nextTraining.name,
                order: nextTraining.order,
                steps: nextTraining.steps,
              },
              trainingStatus: 2,
            };

            // Update Firestore
            db.collection("agents")
              .doc(agentStatus)
              .collection("data")
              .doc(agentId)
              .update(updates)
              .then(() => {
                configure_message_bar(
                  "Training level and status updated successfully."
                );

                // Update trainingLevel and trainingStatus for the agent in the main collection
                db.collection("agents")
                  .doc(agentStatus)
                  .update({
                    [`${agentId}.trainingStatus`]: 2,
                  })
                  .then(() => {
                    configure_message_bar(
                      "Agent's training level and status updated."
                    );
                    displayAgentButtons(); // Update the cache of the main dashboard

                    resolve();
                  });
              });
          }
        }
      });
  });
}

function cancelOffboarding(agentId, agentStatus) {
  return new Promise((resolve, reject) => {
    // Update Firestore
    db.collection("agents")
      .doc(agentStatus)
      .collection("data")
      .doc(agentId)
      .update({
        departing: firebase.firestore.FieldValue.delete(),
        status: "active",
      })
      .then(() => {
        // Update  main collection
        db.collection("agents")
          .doc(agentStatus)
          .update({
            [`${agentId}.departing`]: firebase.firestore.FieldValue.delete(),
            status: "active",
          })
          .then(() => {
            configure_message_bar("Offboarding cancelled.");
            displayAgentButtons(); // Update the cache of the main dashboard
            resolve();
          });
      });
  });
}

// Function to handle starting the next training level
function startOffboarding(agentId) {
  return new Promise((resolve, reject) => {
    // Get the next training steps from the training collection
    db.collection("training")
      .doc("training")
      .get()
      .then((trainingDoc) => {
        if (trainingDoc.exists) {
          const trainingData = trainingDoc.data();
          let foundKey = null;
          let nextTraining = null;

          // Find the key and the corresponding training data
          for (const [key, value] of Object.entries(trainingData)) {
            if (value.order === 6) {
              foundKey = key;
              nextTraining = value;
              break;
            }
          }

          if (nextTraining) {
            // Process steps to handle "finish" and "schedule" types
            nextTraining.steps = nextTraining.steps.flatMap((step) => {
              if (step.type === "finish") {
                return [
                  { ...step, type: "date", finish: 1 },
                  { ...step, type: "checkbox", finish: 1 },
                ];
              } else if (step.type === "schedule") {
                return [
                  { ...step, type: "date", schedule: 1 },
                  { ...step, type: "checkbox", schedule: 1 },
                ];
              } else {
                return step;
              }
            });

            let mainUpdates = {
              offboarded: false,
              services: false,
              laptop: false,
              lastDay: "",
              reason: "",
            };

            let updates = {
              offboarded: false,
              services: false,
              laptop: false,
              lastDay: "",
              reason: "",
              steps: nextTraining.steps,
              device: {
                serial: "",
                returnDate: "",
                incident: "",
                rtnNova: "",
                email: "",
                hold: "",
              },
            };

            // Update Firestore
            db.collection("agents")
              .doc("active")
              .collection("data")
              .doc(agentId)
              .update({ [`departing`]: updates })
              .then(() => {
                // Update trainingLevel and trainingStatus for the agent in the main collection
                db.collection("agents")
                  .doc("active")
                  .update({
                    [`${agentId}.departing`]: mainUpdates,
                  })
                  .then(() => {
                    configure_message_bar("Offboarding process started.");
                    displayAgentButtons(); // Update the cache of the main dashboard

                    resolve();
                  });
              });
          }
        }
      });
  });
}

// Ad hoc function to pull all data from main collection and update subcollection
async function repairAgentData() {
  const docRef = db.collection("agents").doc("active");

  try {
    const doc = await docRef.get();
    if (doc.exists) {
      const agents = doc.data();

      // Update each agent's document in the subcollection
      for (const [agent, data] of Object.entries(agents)) {
        await docRef.collection("data").doc(agent).set(data, { merge: true });
      }

      console.log("Subcollection documents successfully updated!");
    } else {
      console.log("No such document!");
    }
  } catch (error) {
    console.error("Error updating documents:", error);
  }
}

function addTask(
  agentId,
  agentStatus,
  taskId,
  taskSource,
  taskName,
  taskDate,
  manager
) {
  let task = {
    name: taskName,
    date: taskDate,
    source: taskSource,
    assign: manager,
  };

  db.collection("agents")
    .doc(agentStatus)
    .update({
      [`${agentId}.tasks.${taskId}`]: task,
    });
}

function removeTask(agentId, agentStatus, taskId) {
  db.collection("agents")
    .doc(agentStatus)
    .update({
      [`${agentId}.tasks.${taskId}`]: firebase.firestore.FieldValue.delete(),
    });
}

// Function to add employee to Firestore
function addEmployee(
  employeeCode,
  hireDate,
  expGradYear,
  expGradSem,
  toshowUserPage = true
) {
  const agentId = employeeCode.toUpperCase();
  const newEmployeeData = {
    agent: agentId,
    hireDate: hireDate,
    graduation: `${expGradSem} ${expGradYear}`,
    trainingLevel: 0,
    trainingStatus: 2,
    status: "active",
  };

  // Add employee data to Firestore
  db.collection("agents")
    .doc("active")
    .collection("data")
    .doc(agentId)
    .set(newEmployeeData)
    .then(() => {
      // Update additional fields
      db.collection("agents")
        .doc("active")
        .update({
          [`${agentId}.agent`]: agentId,
          [`${agentId}.hireDate`]: hireDate,
          [`${agentId}.graduation`]: newEmployeeData["graduation"],
          [`${agentId}.trainingLevel`]: 0,
          [`${agentId}.trainingStatus`]: 0,
          [`${agentId}.status`]: "active",
        })
        .then(() => {
          // Start next training
          startNextTraining(agentId, 0, "active").then(() => {
            // Show user page if required
            if (toshowUserPage) {
              showUserPage(agentId);
            }
          });
        })
        .catch((error) => {
          console.error("Error updating document: ", error);
        });
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });
}

// Event listener for form submission
r_e("addemployee_form").addEventListener("submit", (event) => {
  event.preventDefault();

  const employeeCode = r_e("employee-code").value;
  const hireDate = r_e("hire-date").value;
  const expGradYear = r_e("exp-grad-year").value;
  const expGradSem = r_e("exp-grad-sem").querySelector("select").value;

  if (employeeCode && hireDate && expGradYear && expGradSem) {
    addEmployee(employeeCode, hireDate, expGradYear, expGradSem);
  } else {
    r_e("new-employee-error").textContent = "Please fill in all fields.";
  }
});

// Event listener for "Add Another" button
r_e("add-employee-new").addEventListener("click", (event) => {
  event.preventDefault();

  const employeeCode = r_e("employee-code").value;
  const hireDate = r_e("hire-date").value;
  const expGradYear = r_e("exp-grad-year").value;
  const expGradSem = r_e("exp-grad-sem").querySelector("select").value;

  if (employeeCode && hireDate && expGradYear && expGradSem) {
    addEmployee(employeeCode, hireDate, expGradYear, expGradSem, false);
    r_e("addemployee_form").reset();
  } else {
    r_e("new-employee-error").textContent = "Please fill in all fields.";
  }
});

// Event listener for the delete button
r_e("user-page-delete-button").addEventListener("click", () => {
  // Get the agentId of the open user
  const agentId = r_e("user-page-agent-name").innerHTML;
  const agentStatus = r_e("user-page-status").innerHTML;

  if (agentId) {
    // Confirm deletion
    if (confirm("Are you sure you want to delete this user?")) {
      // Delete the user document from Firestore
      db.collection("agents")
        .doc(agentStatus)
        .collection("data")
        .doc(agentId)
        .delete()
        .then(() => {
          db.collection("agents")
            .doc(agentStatus)
            .update({ [agentId]: firebase.firestore.FieldValue.delete() })
            .then(() => {
              configure_message_bar("User successfully deleted");
              displayAgentButtons();
              r_e("dashboard-div").classList.remove("is-hidden");
              r_e("user-page-div").classList.add("is-hidden");
            });
        })
        .catch((error) => {
          configure_message_bar("Error deleting user");
          console.error("Error removing document: ", error);
        });
    }
  } else {
    configure_message_bar("Error deleting user");
    console.error("No agent ID found for deletion.");
  }
});

r_e("user-page-edit-button").addEventListener("click", function () {
  // Get the data from the page
  const agentname = r_e("user-page-agent-name").textContent;
  const hireDate = r_e("user-page-hire-date").textContent;
  const graduation = r_e("user-page-graduation").textContent;
  const slpRole = r_e("user-page-slp").textContent;
  const flag = r_e("user-page-flag").textContent;

  // Map the SLP Role and Flag text to their corresponding values
  const slpRoleMap = {
    "": 0,
    "Student Team Lead": 1,
    "Student Developer": 2,
    "Data & Metrics Student Lead": 3,
  };

  const flagMap = {
    "": 0,
    "Attendance or performance concerns": 1,
    "Does not want to train up": 2,
  };

  // Populate the modal fields
  r_e("employee-code-edit").value = agentname;
  r_e("hire-date-edit").value = hireDate;
  r_e("exp-grad-year-edit").value = graduation.split(" ")[1];
  r_e("exp-grad-sem-edit").querySelector("select").value =
    graduation.split(" ")[0];
  r_e("slp-role-edit").querySelector("select").value = slpRoleMap[slpRole];
  r_e("flag-edit").querySelector("select").value = flagMap[flag];

  // Open the modal
  r_e("editemployeemodal").classList.add("is-active");
});

r_e("edit-employee").addEventListener("click", async function (event) {
  event.preventDefault(); // Prevent the default form submission

  // Get the form data
  const hireDate = r_e("hire-date-edit").value;
  const gradYear = r_e("exp-grad-year-edit").value;
  const gradSemester = r_e("exp-grad-sem-edit").querySelector("select").value;
  const slpRole = r_e("slp-role-edit").querySelector("select").value;
  const flag = r_e("flag-edit").querySelector("select").value;
  const agentStatus = r_e("user-page-status").textContent;

  // Validate the form data (optional)
  if (!hireDate || !gradYear || !gradSemester) {
    r_e("edit-employee-error").textContent = "Please fill out all fields.";
    return;
  }

  // Prepare the data to be saved
  const employeeData = {
    hireDate: hireDate,
    graduation: `${gradSemester} ${gradYear}`,
    slpRole: Number(slpRole),
    flag: Number(flag),
  };

  try {
    const agentId = r_e("employee-code-edit").value; // Assuming agentId is stored in this field

    // Save the data to Firestore
    await db
      .collection("agents")
      .doc(agentStatus)
      .collection("data")
      .doc(agentId)
      .update(employeeData);

    // Update additional fields
    await db
      .collection("agents")
      .doc(agentStatus)
      .update({
        [`${agentId}.hireDate`]: hireDate,
        [`${agentId}.graduation`]: employeeData["graduation"],
        [`${agentId}.slpRole`]: Number(slpRole),
        [`${agentId}.flag`]: Number(flag),
      });

    // Close the modal
    r_e("editemployeemodal").classList.remove("is-active");

    // Clear any previous error messages
    r_e("edit-employee-error").textContent = "";
    configure_message_bar("User successfully saved");
    showUserPage(agentId, agentStatus, "Keep");
    displayAgentButtons();
  } catch (error) {
    console.error("Error saving employee data: ", error);
    r_e("edit-employee-error").textContent =
      "Error saving data. Please try again.";
  }
});

function agentStatusChange(agentID, currentStatus, newStatus) {
  return new Promise((resolve, reject) => {
    db.collection("agents")
      .doc(currentStatus)
      .collection("data")
      .doc(agentID)
      .get()
      .then((doc) => {
        data = doc.data();
        data.status = newStatus;
        db.collection("agents")
          .doc(newStatus)
          .collection("data")
          .doc(agentID)
          .set(data)
          .then(() => {
            db.collection("agents")
              .doc(currentStatus)
              .collection("data")
              .doc(agentID)
              .delete()
              .then(() => {
                db.collection("agents")
                  .doc(currentStatus)
                  .get()
                  .then((doc) => {
                    data = doc.data()[agentID];
                    data.status = newStatus;
                    db.collection("agents")
                      .doc(newStatus)
                      .update({ [agentID]: data })
                      .then(() => {
                        db.collection("agents")
                          .doc(currentStatus)
                          .update({
                            [agentID]: firebase.firestore.FieldValue.delete(),
                          })
                          .then(() => {
                            resolve();
                          });
                      });
                  });
              });
          });
      });
  });
}
