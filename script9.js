const infoButtons = document.querySelectorAll(".animation-info-btn");
const deploymentButton = document.getElementById("deploymentButton");
const deploymentStatus = document.getElementById("deploymentStatus");
const noticeButton = document.getElementById("noticeButton");
const animationNotice = document.getElementById("animationNotice");

infoButtons.forEach(function(button) {
    button.addEventListener("click", function() {
        const information = button.nextElementSibling;
        information.classList.toggle("show");

        if (information.classList.contains("show")) {
            button.textContent = "Hide Details";
        } else {
            button.textContent = "View Details";
            information.classList.remove("show");
        }
    });
});

deploymentButton.addEventListener("click", function() {
    deploymentStatus.classList.remove("success");
    deploymentStatus.classList.add("active");
    deploymentStatus.textContent = "Deployment in progress...";
    deploymentButton.disabled = true;

    setTimeout(function() {
        deploymentStatus.classList.remove("active");
        deploymentStatus.classList.add("success");
        deploymentStatus.textContent = "Deployment completed successfully!";
        deploymentButton.disabled = false;
    }, 2500);
});

noticeButton.addEventListener("click", function() {
    animationNotice.textContent = "Your DevOps notification: All services are ready to use.";
    animationNotice.classList.add("show");

    setTimeout(function() {
        animationNotice.classList.remove("show");
    }, 3000);
});
