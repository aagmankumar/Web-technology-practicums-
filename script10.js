const serviceNameInput = document.getElementById("managerServiceName");
const serviceDescriptionInput = document.getElementById("managerServiceDescription");
const addServiceButton = document.getElementById("addServiceButton");
const updateServiceButton = document.getElementById("updateServiceButton");
const managedServices = document.getElementById("managedServices");
const managerMessage = document.getElementById("managerMessage");

let serviceRecords = [
    { id: 1, name: "CI/CD", description: "Automates software building, testing and delivery." },
    { id: 2, name: "Containers", description: "Packages applications for consistent environments." },
    { id: 3, name: "Monitoring", description: "Tracks application and server performance." },
    { id: 4, name: "Deployment", description: "Releases applications with minimum downtime." }
];

let editingServiceId = null;

function displayManagedServices() {
    managedServices.innerHTML = "";

    serviceRecords.forEach(function(service) {
        const card = document.createElement("div");
        card.className = "managed-service";
        card.setAttribute("data-service-id", service.id);

        const heading = document.createElement("h3");
        heading.textContent = service.name;

        const description = document.createElement("p");
        description.textContent = service.description;

        const status = document.createElement("span");
        status.className = "service-status";
        status.textContent = "Active Service";

        const editButton = document.createElement("button");
        editButton.className = "edit-service";
        editButton.textContent = "Edit";
        editButton.setAttribute("data-id", service.id);

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-service";
        deleteButton.textContent = "Delete";
        deleteButton.setAttribute("data-id", service.id);

        card.appendChild(heading);
        card.appendChild(description);
        card.appendChild(status);
        card.appendChild(editButton);
        card.appendChild(deleteButton);
        managedServices.appendChild(card);
    });
}

function clearServiceForm() {
    serviceNameInput.value = "";
    serviceDescriptionInput.value = "";
    editingServiceId = null;
    addServiceButton.hidden = false;
    updateServiceButton.hidden = true;
}

addServiceButton.addEventListener("click", function() {
    const name = serviceNameInput.value.trim();
    const description = serviceDescriptionInput.value.trim();

    if (name === "" || description === "") {
        managerMessage.textContent = "Please enter both the service name and description.";
        return;
    }

    const newService = {
        id: Date.now(),
        name: name,
        description: description
    };

    serviceRecords.push(newService);
    displayManagedServices();
    clearServiceForm();
    managerMessage.textContent = "New DevOps service added successfully.";
});

managedServices.addEventListener("click", function(event) {
    const editButton = event.target.closest(".edit-service");
    const deleteButton = event.target.closest(".delete-service");

    if (editButton) {
        const selectedId = Number(editButton.getAttribute("data-id"));
        const selectedService = serviceRecords.find(function(service) {
            return service.id === selectedId;
        });

        if (selectedService) {
            serviceNameInput.value = selectedService.name;
            serviceDescriptionInput.value = selectedService.description;
            editingServiceId = selectedId;
            addServiceButton.hidden = true;
            updateServiceButton.hidden = false;
            managerMessage.textContent = "Modify the details and select Update Service.";
        }
    }

    if (deleteButton) {
        const selectedId = Number(deleteButton.getAttribute("data-id"));
        const selectedCard = deleteButton.closest(".managed-service");

        serviceRecords = serviceRecords.filter(function(service) {
            return service.id !== selectedId;
        });

        if (selectedCard) {
            selectedCard.remove();
        }

        managerMessage.textContent = "Service removed successfully.";

        if (editingServiceId === selectedId) {
            clearServiceForm();
        }
    }
});

updateServiceButton.addEventListener("click", function() {
    const name = serviceNameInput.value.trim();
    const description = serviceDescriptionInput.value.trim();

    if (name === "" || description === "") {
        managerMessage.textContent = "Please enter both the service name and description.";
        return;
    }

    const selectedService = serviceRecords.find(function(service) {
        return service.id === editingServiceId;
    });

    if (selectedService) {
        selectedService.name = name;
        selectedService.description = description;
        displayManagedServices();
        clearServiceForm();
        managerMessage.textContent = "Service details updated successfully.";
    }
});

const managerHeading = document.querySelector("#service-manager h2");
managerHeading.textContent = "Dynamic DevOps Service Manager";

displayManagedServices();
