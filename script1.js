
// SERVICE CARD INTERACTION

const infoButtons = document.querySelectorAll(".info-btn");

infoButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        const card = button.parentElement;
        const information = card.querySelector(".card-info");

        information.classList.toggle("show-info");

        if (information.classList.contains("show-info")) {
            button.textContent = "Show Less";
        } else {
            button.textContent = "Learn More";
        }

    });

});


// DEPLOYMENT NOTIFICATION

const deployBtn = document.getElementById("deployBtn");
const notification = document.getElementById("notification");

deployBtn.addEventListener("click", function() {

    notification.classList.remove("hide-notification");

    notification.classList.add("show-notification");

    deployBtn.textContent = "Deployment Successful";

    setTimeout(function() {

        notification.classList.remove("show-notification");

        notification.classList.add("hide-notification");

        deployBtn.textContent = "Deploy Application";

    }, 3000);

});


// WORKFLOW SHOW AND HIDE

const workflowBtn = document.getElementById("workflowBtn");
const workflowDetails = document.getElementById("workflowDetails");

workflowBtn.addEventListener("click", function() {

    workflowDetails.classList.toggle("workflow-open");

    if (workflowDetails.classList.contains("workflow-open")) {

        workflowBtn.textContent = "Hide Workflow Details";

    } else {

        workflowBtn.textContent = "Show Workflow Details";

    }

});
