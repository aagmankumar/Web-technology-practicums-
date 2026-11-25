
document.addEventListener("DOMContentLoaded", function() {

    // Common HTML Escape Function
    function escapeHTML(value) {
        return String(value).replace(/[&<>"']/g, function(character) {
            const characters = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            };
            return characters[character];
        });
    }

    // Dynamic DevOps Service Manager
    const managerServiceName = document.getElementById("managerServiceName");
    const managerServiceDescription = document.getElementById("managerServiceDescription");
    const addServiceButton = document.getElementById("addServiceButton");
    const updateServiceButton = document.getElementById("updateServiceButton");
    const managerMessage = document.getElementById("managerMessage");
    const managedServices = document.getElementById("managedServices");

    let services = [];
    let editingServiceId = null;

    function renderServices() {
        managedServices.innerHTML = "";

        if (services.length === 0) {
            managedServices.textContent = "No services have been added yet.";
            return;
        }

        services.forEach(function(service) {
            const card = document.createElement("div");
            card.className = "service-card";

            const heading = document.createElement("h3");
            heading.textContent = service.name;

            const description = document.createElement("p");
            description.textContent = service.description;

            const editButton = document.createElement("button");
            editButton.type = "button";
            editButton.textContent = "Edit";
            editButton.addEventListener("click", function() {
                managerServiceName.value = service.name;
                managerServiceDescription.value = service.description;
                editingServiceId = service.id;
                addServiceButton.hidden = true;
                updateServiceButton.hidden = false;
                managerMessage.textContent = "Edit the service details.";
            });

            const deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.textContent = "Delete";
            deleteButton.className = "delete-task-button";
            deleteButton.addEventListener("click", function() {
                services = services.filter(function(item) {
                    return item.id !== service.id;
                });
                renderServices();
                managerMessage.textContent = "Service deleted successfully.";
            });

            card.appendChild(heading);
            card.appendChild(description);
            card.appendChild(editButton);
            card.appendChild(deleteButton);
            managedServices.appendChild(card);
        });
    }

    addServiceButton.addEventListener("click", function() {
        const name = managerServiceName.value.trim();
        const description = managerServiceDescription.value.trim();

        if (name === "" || description === "") {
            managerMessage.textContent = "Please enter both service name and description.";
            return;
        }

        services.push({
            id: Date.now(),
            name: name,
            description: description
        });

        managerServiceName.value = "";
        managerServiceDescription.value = "";
        managerMessage.textContent = "Service added successfully.";
        renderServices();
    });

    updateServiceButton.addEventListener("click", function() {
        const name = managerServiceName.value.trim();
        const description = managerServiceDescription.value.trim();

        if (name === "" || description === "") {
            managerMessage.textContent = "Please enter both service name and description.";
            return;
        }

        const service = services.find(function(item) {
            return item.id === editingServiceId;
        });

        if (service) {
            service.name = name;
            service.description = description;
        }

        managerServiceName.value = "";
        managerServiceDescription.value = "";
        editingServiceId = null;
        addServiceButton.hidden = false;
        updateServiceButton.hidden = true;
        managerMessage.textContent = "Service updated successfully.";
        renderServices();
    });

    // Basic Request Form
    const basicRequestForm = document.getElementById("basicRequestForm");

    basicRequestForm.addEventListener("submit", function(event) {
        event.preventDefault();
        alert("Your DevOps service request has been submitted successfully.");
        basicRequestForm.reset();
    });

    // Validated Deployment Request Form
    const deploymentValidationForm = document.getElementById("deploymentValidationForm");

    const validationFields = [
        {
            id: "clientName",
            error: "clientNameError",
            message: "Enter a valid name containing 3 to 40 characters."
        },
        {
            id: "clientEmail",
            error: "clientEmailError",
            message: "Enter a valid email address."
        },
        {
            id: "clientPhone",
            error: "clientPhoneError",
            message: "Enter a valid 10-digit Indian mobile number."
        },
        {
            id: "teamSize",
            error: "teamSizeError",
            message: "Team size must be between 1 and 500."
        },
        {
            id: "deploymentEnvironment",
            error: "deploymentEnvironmentError",
            message: "Please select a deployment environment."
        },
        {
            id: "deploymentDate",
            error: "deploymentDateError",
            message: "Please select a deployment date."
        },
        {
            id: "deploymentDetails",
            error: "deploymentDetailsError",
            message: "Enter application details using 20 to 500 characters."
        }
    ];

    function validateField(field) {
        const input = document.getElementById(field.id);
        const error = document.getElementById(field.error);
        let valid = input.checkValidity();

        if (field.id === "deploymentDate" && input.value) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const selectedDate = new Date(input.value + "T00:00:00");

            if (selectedDate < today) {
                valid = false;
            }
        }

        if (!valid) {
            input.classList.add("invalid");
            error.textContent = field.id === "deploymentDate" && input.value
                ? "Deployment date cannot be in the past."
                : field.message;
        } else {
            input.classList.remove("invalid");
            error.textContent = "";
        }

        return valid;
    }

    validationFields.forEach(function(field) {
        const input = document.getElementById(field.id);

        input.addEventListener("input", function() {
            validateField(field);
        });

        input.addEventListener("change", function() {
            validateField(field);
        });
    });

    deploymentValidationForm.addEventListener("submit", function(event) {
        event.preventDefault();

        let formIsValid = true;

        validationFields.forEach(function(field) {
            if (!validateField(field)) {
                formIsValid = false;
            }
        });

        const successMessage = document.getElementById("validationSuccess");

        if (formIsValid) {
            successMessage.textContent = "Your deployment consultation request has been submitted successfully.";
            deploymentValidationForm.reset();

            validationFields.forEach(function(field) {
                document.getElementById(field.id).classList.remove("invalid");
                document.getElementById(field.error).textContent = "";
            });
        } else {
            successMessage.textContent = "Please correct the errors before submitting the form.";
        }
    });

    deploymentValidationForm.addEventListener("reset", function() {
        setTimeout(function() {
            validationFields.forEach(function(field) {
                document.getElementById(field.id).classList.remove("invalid");
                document.getElementById(field.error).textContent = "";
            });

            document.getElementById("validationSuccess").textContent = "";
        }, 0);
    });

    // GitHub API - DevOps Repository Explorer
    const loadDevOpsData = document.getElementById("loadDevOpsData");
    const apiStatus = document.getElementById("apiStatus");
    const apiLoading = document.getElementById("apiLoading");
    const apiError = document.getElementById("apiError");
    const devopsRepositoryBody = document.getElementById("devopsRepositoryBody");
    const apiResultCount = document.getElementById("apiResultCount");

    async function loadDevOpsRepositories() {
        apiLoading.hidden = false;
        apiError.hidden = true;
        loadDevOpsData.disabled = true;
        apiStatus.textContent = "Connecting to GitHub API...";
        apiResultCount.textContent = "";

        devopsRepositoryBody.innerHTML = "";

        try {
            const response = await fetch(
                "https://api.github.com/search/repositories?q=topic:devops&sort=stars&order=desc&per_page=10"
            );

            if (!response.ok) {
                throw new Error("Unable to retrieve repository information. Please try again.");
            }

            const data = await response.json();

            if (!data.items || data.items.length === 0) {
                devopsRepositoryBody.innerHTML =
                    '<tr><td colspan="5">No DevOps repositories were found.</td></tr>';
                apiStatus.textContent = "No repositories found.";
                return;
            }

            data.items.forEach(function(repository) {
                const row = document.createElement("tr");

                const repositoryCell = document.createElement("td");
                const repositoryLink = document.createElement("a");
                repositoryLink.href = repository.html_url;
                repositoryLink.textContent = repository.full_name;
                repositoryLink.target = "_blank";
                repositoryLink.rel = "noopener noreferrer";
                repositoryCell.appendChild(repositoryLink);

                const descriptionCell = document.createElement("td");
                descriptionCell.textContent = repository.description || "No description available";

                const languageCell = document.createElement("td");
                languageCell.textContent = repository.language || "Not specified";

                const starsCell = document.createElement("td");
                starsCell.textContent = repository.stargazers_count.toLocaleString();

                const updatedCell = document.createElement("td");
                updatedCell.textContent = new Date(repository.updated_at).toLocaleDateString();

                row.appendChild(repositoryCell);
                row.appendChild(descriptionCell);
                row.appendChild(languageCell);
                row.appendChild(starsCell);
                row.appendChild(updatedCell);

                devopsRepositoryBody.appendChild(row);
            });

            apiStatus.textContent = "DevOps repository information loaded successfully.";
            apiResultCount.textContent = "Showing " + data.items.length + " repositories.";
        } catch (error) {
            apiError.textContent = error.message;
            apiError.hidden = false;
            apiStatus.textContent = "Unable to load repository information.";
            devopsRepositoryBody.innerHTML =
                '<tr><td colspan="5">Repository data could not be loaded.</td></tr>';
        } finally {
            apiLoading.hidden = true;
            loadDevOpsData.disabled = false;
        }
    }

    loadDevOpsData.addEventListener("click", loadDevOpsRepositories);

    // Practicum 14: Deployment Alert Toggle and Local Storage
    const deploymentAlertToggle = document.getElementById("deploymentAlertToggle");
    const deploymentToggleStatus = document.getElementById("deploymentToggleStatus");
    const deploymentAlertMessage = document.getElementById("deploymentAlertMessage");

    const savedAlertSetting = localStorage.getItem("devopsDeploymentAlerts");

    deploymentAlertToggle.checked = savedAlertSetting === "true";

    function updateDeploymentSetting() {
        if (deploymentAlertToggle.checked) {
            deploymentToggleStatus.textContent = "Alerts are enabled.";
            deploymentToggleStatus.style.color = "#236b3d";
        } else {
            deploymentToggleStatus.textContent = "Alerts are disabled.";
            deploymentToggleStatus.style.color = "#a33b3b";
            deploymentAlertMessage.hidden = true;
        }

        localStorage.setItem(
            "devopsDeploymentAlerts",
            deploymentAlertToggle.checked
        );
    }

    function showDeploymentAlert(taskName) {
        deploymentAlertMessage.textContent =
            "Deployment Notification: The task \"" + taskName +
            "\" has been marked as completed successfully.";

        deploymentAlertMessage.hidden = false;
    }

    deploymentAlertToggle.addEventListener("change", updateDeploymentSetting);
    updateDeploymentSetting();

    // DevOps Task Manager
    const taskForm = document.getElementById("taskForm");
    const taskId = document.getElementById("taskId");
    const taskTitle = document.getElementById("taskTitle");
    const taskCategory = document.getElementById("taskCategory");
    const taskPriority = document.getElementById("taskPriority");
    const taskDueDate = document.getElementById("taskDueDate");
    const taskDescription = document.getElementById("taskDescription");
    const taskTableBody = document.getElementById("taskTableBody");
    const taskMessage = document.getElementById("taskMessage");
    const taskCount = document.getElementById("taskCount");
    const saveTaskButton = document.getElementById("saveTaskButton");
    const cancelEditButton = document.getElementById("cancelEditButton");

    // Task Search and Filter Elements
    const taskSearch = document.getElementById("taskSearch");
    const taskCategoryFilter = document.getElementById("taskCategoryFilter");
    const taskPriorityFilter = document.getElementById("taskPriorityFilter");
    const taskStatusFilter = document.getElementById("taskStatusFilter");
    const clearTaskFilters = document.getElementById("clearTaskFilters");
    const taskFilterResult = document.getElementById("taskFilterResult");

    let tasks = [];

    try {
        tasks = JSON.parse(localStorage.getItem("devopsTaskManagerTasks")) || [];
        if (!Array.isArray(tasks)) {
            tasks = [];
        }
    } catch (error) {
        tasks = [];
    }

    function saveTasks() {
        localStorage.setItem("devopsTaskManagerTasks", JSON.stringify(tasks));
    }

    function showTaskMessage(message) {
        taskMessage.textContent = message;
    }

    function resetTaskForm() {
        taskForm.reset();
        taskId.value = "";
        saveTaskButton.textContent = "Add Task";
        cancelEditButton.hidden = true;
    }

    function getFilteredTasks() {
        const searchText = taskSearch.value.toLowerCase().trim();
        const selectedCategory = taskCategoryFilter.value;
        const selectedPriority = taskPriorityFilter.value;
        const selectedStatus = taskStatusFilter.value;

        return tasks.filter(function(task) {
            const matchesSearch =
                task.title.toLowerCase().includes(searchText) ||
                task.description.toLowerCase().includes(searchText);

            const matchesCategory =
                selectedCategory === "All" || task.category === selectedCategory;

            const matchesPriority =
                selectedPriority === "All" || task.priority === selectedPriority;

            const matchesStatus =
                selectedStatus === "All" || task.status === selectedStatus;

            return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
        });
    }

    function renderTasks() {
        const filteredTasks = getFilteredTasks();
        taskTableBody.innerHTML = "";

        if (filteredTasks.length === 0) {
            const row = document.createElement("tr");
            const cell = document.createElement("td");
            cell.colSpan = 7;
            cell.textContent = tasks.length === 0
                ? "No tasks available. Add a task using the form above."
                : "No tasks match the selected search and filters.";
            row.appendChild(cell);
            taskTableBody.appendChild(row);
        } else {
            filteredTasks.forEach(function(task) {
                const row = document.createElement("tr");

                const titleCell = document.createElement("td");
                titleCell.textContent = task.title;

                const categoryCell = document.createElement("td");
                categoryCell.textContent = task.category;

                const priorityCell = document.createElement("td");
                priorityCell.textContent = task.priority;

                const dateCell = document.createElement("td");
                dateCell.textContent = task.dueDate;

                const statusCell = document.createElement("td");
                const statusSelect = document.createElement("select");

                ["Pending", "In Progress", "Completed"].forEach(function(status) {
                    const option = document.createElement("option");
                    option.value = status;
                    option.textContent = status;
                    statusSelect.appendChild(option);
                });

                statusSelect.value = task.status;
                statusSelect.addEventListener("change", function() {
                    updateTaskStatus(task.id, statusSelect.value);
                });

                statusCell.appendChild(statusSelect);

                const descriptionCell = document.createElement("td");
                descriptionCell.textContent = task.description || "-";

                const actionsCell = document.createElement("td");

                const editButton = document.createElement("button");
                editButton.type = "button";
                editButton.textContent = "Edit";
                editButton.className = "task-action-button";
                editButton.addEventListener("click", function() {
                    editTask(task.id);
                });

                const deleteButton = document.createElement("button");
                deleteButton.type = "button";
                deleteButton.textContent = "Delete";
                deleteButton.className = "task-action-button delete-task-button";
                deleteButton.addEventListener("click", function() {
                    deleteTask(task.id);
                });

                actionsCell.appendChild(editButton);
                actionsCell.appendChild(deleteButton);

                row.appendChild(titleCell);
                row.appendChild(categoryCell);
                row.appendChild(priorityCell);
                row.appendChild(dateCell);
                row.appendChild(statusCell);
                row.appendChild(descriptionCell);
                row.appendChild(actionsCell);

                taskTableBody.appendChild(row);
            });
        }

        taskCount.textContent =
            "Showing " + filteredTasks.length + " of " + tasks.length + " tasks.";

        taskFilterResult.textContent =
            filteredTasks.length + " matching task(s) found.";
    }

    // Add or Update Task
    taskForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const title = taskTitle.value.trim();
        const category = taskCategory.value;
        const priority = taskPriority.value;
        const dueDate = taskDueDate.value;
        const description = taskDescription.value.trim();

        if (!title || !category || !priority || !dueDate) {
            showTaskMessage("Please complete all required task fields.");
            return;
        }

        if (taskId.value) {
            const existingTask = tasks.find(function(task) {
                return task.id === Number(taskId.value);
            });

            if (existingTask) {
                existingTask.title = title;
                existingTask.category = category;
                existingTask.priority = priority;
                existingTask.dueDate = dueDate;
                existingTask.description = description;
                showTaskMessage("Task updated successfully.");
            }
        } else {
            const newTask = {
                id: Date.now(),
                title: title,
                category: category,
                priority: priority,
                dueDate: dueDate,
                description: description,
                status: "Pending"
            };

            tasks.push(newTask);
            showTaskMessage("Task added successfully.");
        }

        saveTasks();
        resetTaskForm();
        renderTasks();
    });

    // Edit Task
    function editTask(id) {
        const task = tasks.find(function(item) {
            return item.id === id;
        });

        if (task) {
            taskId.value = task.id;
            taskTitle.value = task.title;
            taskCategory.value = task.category;
            taskPriority.value = task.priority;
            taskDueDate.value = task.dueDate;
            taskDescription.value = task.description;

            saveTaskButton.textContent = "Update Task";
            cancelEditButton.hidden = false;
            showTaskMessage("Editing selected task.");
            taskForm.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }

    // Delete Task
    function deleteTask(id) {
        const confirmDelete = confirm("Are you sure you want to delete this task?");

        if (confirmDelete) {
            tasks = tasks.filter(function(task) {
                return task.id !== id;
            });

            saveTasks();
            renderTasks();
            showTaskMessage("Task deleted successfully.");

            if (Number(taskId.value) === id) {
                resetTaskForm();
            }
        }
    }

    // Update Task Status and Trigger Practicum 14 Notification
    function updateTaskStatus(id, newStatus) {
        const task = tasks.find(function(item) {
            return item.id === id;
        });

        if (task) {
            const previousStatus = task.status;
            task.status = newStatus;

            saveTasks();
            renderTasks();
            showTaskMessage("Task status updated successfully.");

            if (
                newStatus === "Completed" &&
                previousStatus !== "Completed" &&
                deploymentAlertToggle.checked
            ) {
                showDeploymentAlert(task.title);
            }
        }
    }

    // Search and Filter Event Listeners
    taskSearch.addEventListener("input", renderTasks);
    taskCategoryFilter.addEventListener("change", renderTasks);
    taskPriorityFilter.addEventListener("change", renderTasks);
    taskStatusFilter.addEventListener("change", renderTasks);

    // Clear All Filters
    clearTaskFilters.addEventListener("click", function() {
        taskSearch.value = "";
        taskCategoryFilter.value = "All";
        taskPriorityFilter.value = "All";
        taskStatusFilter.value = "All";

        renderTasks();
        showTaskMessage("All task filters have been cleared.");
    });

    // Cancel Task Editing
    cancelEditButton.addEventListener("click", function() {
        resetTaskForm();
        showTaskMessage("Task editing cancelled.");
    });

    // Initial Task Display
    renderTasks();

});
