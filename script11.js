const deploymentForm = document.getElementById("deploymentValidationForm");
const successMessage = document.getElementById("validationSuccess");

const validationFields = [
    { id: "clientName", errorId: "clientNameError", message: "Enter a valid name using 3–40 characters." },
    { id: "clientEmail", errorId: "clientEmailError", message: "Enter a valid business email address." },
    { id: "clientPhone", errorId: "clientPhoneError", message: "Enter a valid 10-digit Indian mobile number starting with 6, 7, 8 or 9." },
    { id: "teamSize", errorId: "teamSizeError", message: "Team size must be between 1 and 500." },
    { id: "deploymentEnvironment", errorId: "deploymentEnvironmentError", message: "Select a deployment environment." },
    { id: "deploymentDate", errorId: "deploymentDateError", message: "Select a preferred deployment date." },
    { id: "deploymentDetails", errorId: "deploymentDetailsError", message: "Enter at least 20 characters describing your requirements." }
];

validationFields.forEach(function(fieldInfo) {
    const field = document.getElementById(fieldInfo.id);
    const error = document.getElementById(fieldInfo.errorId);

    field.addEventListener("input", function() {
        field.setCustomValidity("");

        if (field.validity.valid) {
            error.textContent = "";
        } else {
            error.textContent = fieldInfo.message;
        }

        successMessage.textContent = "";
    });

    field.addEventListener("change", function() {
        field.setCustomValidity("");
        if (field.validity.valid) {
            error.textContent = "";
        }
    });
});

document.getElementById("clientName").addEventListener("input", function() {
    if (this.value.trim().length > 0 && !/^[A-Za-z][A-Za-z .'-]{2,39}$/.test(this.value.trim())) {
        this.setCustomValidity("Name must contain 3–40 valid characters and begin with a letter.");
    } else {
        this.setCustomValidity("");
    }
});

document.getElementById("clientPhone").addEventListener("input", function() {
    if (this.value.length > 0 && !/^[6-9][0-9]{9}$/.test(this.value)) {
        this.setCustomValidity("Enter a 10-digit mobile number beginning with 6, 7, 8 or 9.");
    } else {
        this.setCustomValidity("");
    }
});

document.getElementById("teamSize").addEventListener("input", function() {
    const number = Number(this.value);
    if (this.value !== "" && (number < 1 || number > 500)) {
        this.setCustomValidity("Team size must be from 1 to 500.");
    } else {
        this.setCustomValidity("");
    }
});

document.getElementById("deploymentDetails").addEventListener("input", function() {
    if (this.value.trim().length > 0 && this.value.trim().length < 20) {
        this.setCustomValidity("Please provide at least 20 characters.");
    } else {
        this.setCustomValidity("");
    }
});

deploymentForm.addEventListener("submit", function(event) {
    event.preventDefault();

    validationFields.forEach(function(fieldInfo) {
        const field = document.getElementById(fieldInfo.id);
        const error = document.getElementById(fieldInfo.errorId);

        if (!field.validity.valid) {
            error.textContent = field.validationMessage || fieldInfo.message;
        } else {
            error.textContent = "";
        }
    });

    if (!deploymentForm.checkValidity()) {
        deploymentForm.reportValidity();
        successMessage.textContent = "";
        return;
    }

    successMessage.textContent = "Your DevOps deployment request has been validated and submitted successfully.";
    deploymentForm.reset();

    validationFields.forEach(function(fieldInfo) {
        document.getElementById(fieldInfo.errorId).textContent = "";
    });
});

deploymentForm.addEventListener("reset", function() {
    successMessage.textContent = "";
    validationFields.forEach(function(fieldInfo) {
        document.getElementById(fieldInfo.errorId).textContent = "";
        document.getElementById(fieldInfo.id).setCustomValidity("");
    });
});
