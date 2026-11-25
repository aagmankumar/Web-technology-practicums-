
const loadDataButton = document.getElementById("loadDevOpsData");
const repositoryBody = document.getElementById("devopsRepositoryBody");
const apiLoading = document.getElementById("apiLoading");
const apiError = document.getElementById("apiError");
const apiStatus = document.getElementById("apiStatus");
const apiResultCount = document.getElementById("apiResultCount");

async function loadDevOpsRepositories() {
    apiLoading.hidden = false;
    apiError.hidden = true;
    apiError.textContent = "";
    apiResultCount.textContent = "";
    apiStatus.textContent = "Connecting to the GitHub API...";
    loadDataButton.disabled = true;
    loadDataButton.textContent = "Loading...";

    try {
        const endpoint = "https://api.github.com/search/repositories?q=topic:devops&sort=stars&order=desc&per_page=10";
        const response = await fetch(endpoint);

        if (!response.ok) {
            throw new Error("The server returned status " + response.status + ". Please try again later.");
        }

        const data = await response.json();

        if (!data.items || data.items.length === 0) {
            throw new Error("The API did not return any DevOps repositories.");
        }

        repositoryBody.textContent = "";

        data.items.forEach(function(repository) {
            const row = document.createElement("tr");

            const nameCell = document.createElement("td");
            nameCell.textContent = repository.full_name || "Name unavailable";

            const descriptionCell = document.createElement("td");
            descriptionCell.textContent = repository.description || "No description provided";

            const languageCell = document.createElement("td");
            languageCell.textContent = repository.language || "Not specified";

            const starsCell = document.createElement("td");
            starsCell.textContent = Number(repository.stargazers_count || 0).toLocaleString();

            const updatedCell = document.createElement("td");
            updatedCell.textContent = repository.updated_at
                ? new Date(repository.updated_at).toLocaleDateString()
                : "Not available";

            row.appendChild(nameCell);
            row.appendChild(descriptionCell);
            row.appendChild(languageCell);
            row.appendChild(starsCell);
            row.appendChild(updatedCell);
            repositoryBody.appendChild(row);
        });

        apiStatus.textContent = "DevOps technology information loaded successfully.";
        apiResultCount.textContent = "Repositories displayed: " + data.items.length;
    } catch (error) {
        repositoryBody.textContent = "";

        const errorRow = document.createElement("tr");
        const errorCell = document.createElement("td");
        errorCell.setAttribute("colspan", "5");
        errorCell.textContent = "Repository information could not be displayed.";
        errorRow.appendChild(errorCell);
        repositoryBody.appendChild(errorRow);

        apiError.textContent = "Unable to load DevOps information. " + error.message;
        apiError.hidden = false;
        apiStatus.textContent = "Data retrieval failed.";
    } finally {
        apiLoading.hidden = true;
        loadDataButton.disabled = false;
        loadDataButton.textContent = "Load DevOps Data";
    }
}

loadDataButton.addEventListener("click", loadDevOpsRepositories);


/* DevOps Task Manager - CRUD Operations */

const taskForm = document.getElementById("taskForm");
const taskId = document.getElementById("taskId");
const taskTitle = document.getElementById("taskTitle");
const taskCategory = document.getElementById("taskCategory");
const taskPriority = document.getElementById("taskPriority");
const taskDueDate = document.getElementById("taskDueDate");
const taskDescription = document.getElementById("taskDescription");
const taskTableBody = document.getElementById("taskTableBody");
const taskStatusFilter = document.getElementById("taskStatusFilter");
const taskMessage = document.getElementById("taskMessage");
const taskCount = document.getElementById("taskCount");
const saveTaskButton = document.getElementById("saveTaskButton");
const cancelEditButton = document.getElementById("cancelEditButton");

/* Search and Filter Elements */
const taskSearch = document.getElementById("taskSearch");
const taskCategoryFilter = document.getElementById("taskCategoryFilter");
const taskPriorityFilter = document.getElementById("taskPriorityFilter");
const clearTaskFilters = document.getElementById("clearTaskFilters");
const taskFilterResult = document.getElementById("taskFilterResult");

let tasks = JSON.parse(localStorage.getItem("devopsTaskManagerTasks")) || [];

function saveTasks() {
    localStorage.setItem("devopsTaskManagerTasks", JSON.stringify(tasks));
}

function showTaskMessage(message) {
    taskMessage.textContent = message;

    setTimeout(function() {
        taskMessage.textContent = "";
    }, 3000);
}

function resetTaskForm() {
    taskForm.reset();
    taskId.value = "";
    saveTaskButton.textContent = "Add Task";
    cancelEditButton.hidden = true;
}

function renderTasks() {
    taskTableBody.textContent = "";

    const searchValue = taskSearch.value.trim().toLowerCase();
    const selectedStatus = taskStatusFilter.value;
    const selectedCategory = taskCategoryFilter.value;
    const selectedPriority = taskPriorityFilter.value;

    const filteredTasks = tasks.filter(function(task) {
        const matchesSearch =
            task.title.toLowerCase().includes(searchValue) ||
            (task.description || "").toLowerCase().includes(searchValue);

        const matchesStatus =
            selectedStatus === "All" || task.status === selectedStatus;

        const matchesCategory =
            selectedCategory === "All" || task.category === selectedCategory;

        const matchesPriority =
            selectedPriority === "All" || task.priority === selectedPriority;

        return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
    });

    if (filteredTasks.length === 0) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");

        cell.setAttribute("colspan", "7");

        if (tasks.length === 0) {
            cell.textContent = "No tasks available. Add a task using the form above.";
        } else {
            cell.textContent = "No tasks match the selected search and filters.";
        }

        row.appendChild(cell);
        taskTableBody.appendChild(row);
    }

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

        statusSelect.className = "task-status-select";

        ["Pending", "In Progress", "Completed"].forEach(function(status) {
            const option = document.createElement("option");
            option.value = status;
            option.textContent = status;

            if (task.status === status) {
                option.selected = true;
            }

            statusSelect.appendChild(option);
        });

        statusSelect.addEventListener("change", function() {
            updateTaskStatus(task.id, statusSelect.value);
        });

        statusCell.appendChild(statusSelect);

        const descriptionCell = document.createElement("td");
        descriptionCell.textContent = task.description || "No description";

        const actionCell = document.createElement("td");

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.className = "edit-task";
        editButton.type = "button";

        editButton.addEventListener("click", function() {
            editTask(task.id);
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-task";
        deleteButton.type = "button";

        deleteButton.addEventListener("click", function() {
            deleteTask(task.id);
        });

        actionCell.appendChild(editButton);
        actionCell.appendChild(deleteButton);

        row.appendChild(titleCell);
        row.appendChild(categoryCell);
        row.appendChild(priorityCell);
        row.appendChild(dateCell);
        row.appendChild(statusCell);
        row.appendChild(descriptionCell);
        row.appendChild(actionCell);

        taskTableBody.appendChild(row);
    });

    taskCount.textContent = "Total Tasks: " + tasks.length +
        " | Pending: " + tasks.filter(function(task) {
            return task.status === "Pending";
        }).length +
        " | In Progress: " + tasks.filter(function(task) {
            return task.status === "In Progress";
        }).length +
        " | Completed: " + tasks.filter(function(task) {
            return task.status === "Completed";
        }).length;

    taskFilterResult.textContent =
        "Showing " + filteredTasks.length + " of " + tasks.length + " tasks.";
}

taskForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const taskData = {
        id: taskId.value || Date.now().toString(),
        title: taskTitle.value.trim(),
        category: taskCategory.value,
        priority: taskPriority.value,
        dueDate: taskDueDate.value,
        description: taskDescription.value.trim(),
        status: "Pending"
    };

    if (!taskData.title || !taskData.category || !taskData.priority || !taskData.dueDate) {
        showTaskMessage("Please complete all required fields.");
        return;
    }

    if (taskId.value) {
        const existingTask = tasks.find(function(task) {
            return task.id === taskId.value;
        });

        if (existingTask) {
            existingTask.title = taskData.title;
            existingTask.category = taskData.category;
            existingTask.priority = taskData.priority;
            existingTask.dueDate = taskData.dueDate;
            existingTask.description = taskData.description;
        }

        showTaskMessage("Task updated successfully.");
    } else {
        tasks.push(taskData);
        showTaskMessage("Task added successfully.");
    }

    saveTasks();
    resetTaskForm();
    renderTasks();
});

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

        taskTitle.focus();
        showTaskMessage("Editing selected task.");
    }
}

function deleteTask(id) {
    const confirmDelete = confirm("Are you sure you want to delete this task?");

    if (confirmDelete) {
        tasks = tasks.filter(function(task) {
            return task.id !== id;
        });

        saveTasks();
        renderTasks();
        showTaskMessage("Task deleted successfully.");

        if (taskId.value === id) {
            resetTaskForm();
        }
    }
}

function updateTaskStatus(id, newStatus) {
    const task = tasks.find(function(item) {
        return item.id === id;
    });

    if (task) {
        task.status = newStatus;
        saveTasks();
        renderTasks();
        showTaskMessage("Task status updated successfully.");
    }
}

/* Interactive Search and Filter Event Listeners */

taskSearch.addEventListener("input", renderTasks);

taskCategoryFilter.addEventListener("change", renderTasks);

taskPriorityFilter.addEventListener("change", renderTasks);

taskStatusFilter.addEventListener("change", renderTasks);

/* Clear All Filters */

clearTaskFilters.addEventListener("click", function() {
    taskSearch.value = "";
    taskCategoryFilter.value = "All";
    taskPriorityFilter.value = "All";
    taskStatusFilter.value = "All";

    renderTasks();
    showTaskMessage("All filters have been cleared.");
});

cancelEditButton.addEventListener("click", function() {
    resetTaskForm();
    showTaskMessage("Task editing cancelled.");
});

renderTasks();
