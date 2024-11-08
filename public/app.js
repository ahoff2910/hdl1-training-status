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
  r_e("departedmodal").classList.add("is-active");
});

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
r_e("openMyAccountModal").addEventListener("click", () => {
  const user = firebase.auth().currentUser;
  if (user) {
    const userDoc = db.collection("users").doc(user.uid).get();
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
r_e("view-users-button").addEventListener("click", () => {
  const usersTableBody = r_e("users-table-body");
  usersTableBody.innerHTML = "";

  const usersSnapshot = db.collection("users").get();
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
            button.style.color = "red";
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
function showUserPage(agentId) {
  closeAllModals();
  r_e("dashboard-div").classList.add("is-hidden");
  r_e("user-page-div").classList.remove("is-hidden");

  // Reference to Firestore
  const db = firebase.firestore();

  // Get the agent data from Firestore
  db.collection("agents")
    .doc("active")
    .collection("data")
    .doc(agentId)
    .get()
    .then((doc) => {
      if (doc.exists) {
        const agent = doc.data();

        // Populate user page elements with agent data
        document.getElementById("user-page-agent-name").textContent =
          agent.agent;
        document.getElementById("user-page-training-level").textContent =
          trainingLevelNames[agent.trainingLevel] || "Unknown";
        document.getElementById("user-page-hire-date").textContent =
          agent.hireDate;
        document.getElementById("user-page-graduation").textContent =
          agent.graduation;
        document.getElementById("user-page-next-training-level").textContent =
          trainingLevelNames[agent.trainingLevel + 1] || "Unknown";
        document.getElementById("user-page-last-reviewed").textContent =
          agent.lastReviewed || "Never";
        document.getElementById(
          "user-page-last-reviewed-duration"
        ).textContent = calculateDuration(agent.lastReviewed) || "∞";

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
        const highestOrder =
          trainingArray.length > 0
            ? trainingArray[trainingArray.length - 1].order
            : 0;

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
                ? `<button class="button is-danger" type="button">Cancel ${
                    trainingData.name
                  }</button>${
                    agent.trainingStatus === 2 &&
                    trainingData.order === highestOrder
                      ? '<button class="button is-primary mx-1" type="button">Finish Training</button>'
                      : ""
                  }
                   `
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
              saveTrainingUpdates(agentId, trainingData.key, trainingForm);
            });

          // Add event listener for cancel button if it exists
          const cancelButton = trainingForm.querySelector(".button.is-danger");
          if (cancelButton) {
            cancelButton.addEventListener("click", function (event) {
              event.preventDefault();
              cancelTraining(agentId, trainingData.key, trainingData.order);
            });
          }

          // Add event listener for finish button if it exists
          const finishButton = trainingForm.querySelector(".button.is-primary");
          if (finishButton) {
            finishButton.addEventListener("click", function (event) {
              event.preventDefault();
              finishTraining(agentId, trainingData.order);
            });
          }
        });

        // Reinitialize collapsibles after adding new boxes
        initializeCollapsibles();

        // Add event listener for the start-next-training-button
        r_e("start-next-training-button").addEventListener(
          "click",
          function () {
            startNextTraining(agentId);
          }
        );
      } else {
        console.error("No such document!");
      }
    })
    .catch((error) => {
      console.error("Error getting agent data: ", error);
    });
}

// Function to finish the current training and update the database
function finishTraining(agentId, trainingOrder) {
  // Get the agent data to update training level and status
  db.collection("agents")
    .doc("active")
    .collection("data")
    .doc(agentId)
    .get()
    .then((doc) => {
      if (doc.exists) {
        const agent = doc.data();
        const newTrainingLevel = trainingOrder;

        // Update the training level and status in the database
        const updates = {
          trainingLevel: newTrainingLevel,
          trainingStatus: 0,
        };

        db.collection("agents")
          .doc("active")
          .collection("data")
          .doc(agentId)
          .update(updates)
          .then(() => {
            configure_message_bar(
              "Training level and status updated successfully."
            );

            // Update trainingLevel and trainingStatus for the agent in the main collection
            db.collection("agents")
              .doc("active")
              .update({
                [`${agentId}.trainingLevel`]: newTrainingLevel,
                [`${agentId}.trainingStatus`]: 0,
              })
              .then(() => {
                configure_message_bar(
                  "Agent's training level and status updated in the main collection."
                );
                displayAgentButtons(); // Update the cache of the main dashboard

                // Refresh the user page to reflect the changes
                showUserPage(agentId);
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
      } else {
        console.error("No such document!");
        configure_message_bar("No such document!");
      }
    })
    .catch((error) => {
      console.error("Error getting agent data: ", error);
      configure_message_bar("Error getting agent data.");
    });
}

// Function to save training updates to the database
function saveTrainingUpdates(agentId, trainingKey, form) {
  const db = firebase.firestore();
  const updates = {};

  // Collect form data
  const formData = new FormData(form);
  formData.forEach((value, key) => {
    // Replace invalid characters in key
    const sanitizedKey = key.replace(/[~*/[\]]/g, "_");
    const stepIndex = parseInt(sanitizedKey, 10);
    updates[stepIndex] = value;
  });

  // Read the current steps array
  db.collection("agents")
    .doc("active")
    .collection("data")
    .doc(agentId)
    .get()
    .then((doc) => {
      if (doc.exists) {
        const data = doc.data();
        const steps = data.training[trainingKey].steps || [];

        // Update the steps array
        Object.keys(updates).forEach((index) => {
          const stepIndex = parseInt(index, 10);
          if (steps[stepIndex]) {
            steps[stepIndex].value = updates[index];
          } else {
            steps[stepIndex] = { value: updates[index] };
          }
        });

        // Write the updated steps array back to Firestore
        db.collection("agents")
          .doc("active")
          .collection("data")
          .doc(agentId)
          .update({
            [`training.${trainingKey}.steps`]: steps,
          })
          .then(() => {
            configure_message_bar("Training updates saved successfully.");
            displayAgentButtons(); // Update the cache of the main dashboard
          })
          .catch((error) => {
            console.error("Error saving training updates: ", error);
            configure_message_bar("Error saving training updates.");
          });
      } else {
        console.error("No such document!");
        configure_message_bar("Error: No such document.");
      }
    })
    .catch((error) => {
      console.error("Error getting document: ", error);
      configure_message_bar("Error getting document.");
    });
}

// Function to cancel training and update the database
function cancelTraining(agentId, trainingKey, trainingOrder) {
  const db = firebase.firestore();

  // Get the agent data to update training level and status
  db.collection("agents")
    .doc("active")
    .collection("data")
    .doc(agentId)
    .get()
    .then((doc) => {
      if (doc.exists) {
        const agent = doc.data();
        const newTrainingLevel = trainingOrder - 1;

        // Remove the training section from the database
        const updates = {
          [`training.${trainingKey}`]: firebase.firestore.FieldValue.delete(),
          trainingLevel: newTrainingLevel,
          trainingStatus: 0,
        };

        db.collection("agents")
          .doc("active")
          .collection("data")
          .doc(agentId)
          .update(updates)
          .then(() => {
            configure_message_bar(
              "Training section removed and training level updated."
            );

            // Update trainingLevel and trainingStatus for the agent in the main collection
            db.collection("agents")
              .doc("active")
              .update({
                [`${agentId}.trainingLevel`]: newTrainingLevel,
                [`${agentId}.trainingStatus`]: 0,
              })
              .then(() => {
                configure_message_bar(
                  "Agent's training level and status updated in the main collection."
                );
                displayAgentButtons(); // Update the cache of the main dashboard

                // Refresh the user page to reflect the changes
                showUserPage(agentId);
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
            console.error("Error removing training section: ", error);
            configure_message_bar("Error removing training section.");
          });
      } else {
        console.error("No such document!");
        configure_message_bar("No such document!");
      }
    })
    .catch((error) => {
      console.error("Error getting agent data: ", error);
      configure_message_bar("Error getting agent data.");
    });
}

// Function to handle starting the next training level
function startNextTraining(agentId) {
  // Get the agent data to update training level and status
  db.collection("agents")
    .doc("active")
    .collection("data")
    .doc(agentId)
    .get()
    .then((doc) => {
      if (doc.exists) {
        const agent = doc.data();
        const newTrainingLevel = agent.trainingLevel + 1;

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
                  .doc("active")
                  .collection("data")
                  .doc(agentId)
                  .update(updates)
                  .then(() => {
                    configure_message_bar(
                      "Training level and status updated successfully."
                    );

                    // Update trainingLevel and trainingStatus for the agent in the main collection
                    db.collection("agents")
                      .doc("active")
                      .update({
                        [`${agentId}.trainingStatus`]: 2,
                      })
                      .then(() => {
                        configure_message_bar(
                          "Agent's training level and status updated."
                        );
                        displayAgentButtons(); // Update the cache of the main dashboard

                        // Refresh the user page to reflect the changes
                        showUserPage(agentId);
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
                    console.error(
                      "Error updating training level and status: ",
                      error
                    );
                    configure_message_bar(
                      "Error updating training level and status."
                    );
                  });
              } else {
                console.error("No such training level!");
                configure_message_bar("No such training level!");
              }
            } else {
              console.error("No training data found!");
              configure_message_bar("No training data found!");
            }
          })
          .catch((error) => {
            console.error("Error getting training data: ", error);
            configure_message_bar("Error getting training data.");
          });
      } else {
        console.error("No such document!");
        configure_message_bar("No such document!");
      }
    })
    .catch((error) => {
      console.error("Error getting agent data: ", error);
      configure_message_bar("Error getting agent data.");
    });
}

// Ad hoc function to pull all data from main collection and update subcollection
async function updateAgentData() {
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
