// Practicum 13 - DevOps Task Manager: CRUD operations and Local Storage
const taskForm=document.getElementById("taskForm");
const taskIdInput=document.getElementById("taskId");
const taskTitleInput=document.getElementById("taskTitle");
const taskCategoryInput=document.getElementById("taskCategory");
const taskPriorityInput=document.getElementById("taskPriority");
const taskDueDateInput=document.getElementById("taskDueDate");
const taskDescriptionInput=document.getElementById("taskDescription");
const taskTableBody=document.getElementById("taskTableBody");
const taskStatusFilter=document.getElementById("taskStatusFilter");
const taskMessage=document.getElementById("taskMessage");
const taskCount=document.getElementById("taskCount");
const taskFormHeading=document.getElementById("taskFormHeading");
const saveTaskButton=document.getElementById("saveTaskButton");
const cancelEditButton=document.getElementById("cancelEditButton");
const TASK_STORAGE_KEY="devopsTaskManagerTasks";
let tasks=[];

function loadTasks(){
    const savedTasks=localStorage.getItem(TASK_STORAGE_KEY);
    if(savedTasks){
        try{tasks=JSON.parse(savedTasks);if(!Array.isArray(tasks))tasks=[];}
        catch(error){tasks=[];}
    }
}
function saveTasks(){localStorage.setItem(TASK_STORAGE_KEY,JSON.stringify(tasks));}
function showTaskMessage(message){taskMessage.textContent=message;}
function resetTaskForm(){taskForm.reset();taskIdInput.value="";taskFormHeading.textContent="Add a DevOps Task";saveTaskButton.textContent="Add Task";cancelEditButton.hidden=true;}

function renderTasks(){
    taskTableBody.textContent="";
    const selectedStatus=taskStatusFilter.value;
    const visibleTasks=selectedStatus==="All"?tasks:tasks.filter(function(task){return task.status===selectedStatus;});
    if(visibleTasks.length===0){
        const emptyRow=document.createElement("tr");
        const emptyCell=document.createElement("td");
        emptyCell.colSpan=6;
        emptyCell.textContent=tasks.length===0?"No tasks added yet. Use the form above to create your first task.":"No tasks match the selected status.";
        emptyRow.appendChild(emptyCell);taskTableBody.appendChild(emptyRow);
    }
    visibleTasks.forEach(function(task){
        const row=document.createElement("tr");row.dataset.taskId=task.id;
        const titleCell=document.createElement("td");titleCell.textContent=task.title+(task.description?" - "+task.description:"");
        const categoryCell=document.createElement("td");categoryCell.textContent=task.category;
        const priorityCell=document.createElement("td");priorityCell.textContent=task.priority;
        const dateCell=document.createElement("td");dateCell.textContent=task.dueDate||"Not set";
        const statusCell=document.createElement("td");
        const statusSelect=document.createElement("select");statusSelect.className="task-status-select";statusSelect.dataset.action="status";statusSelect.dataset.taskId=task.id;
        ["Pending","In Progress","Completed"].forEach(function(status){const option=document.createElement("option");option.value=status;option.textContent=status;if(task.status===status)option.selected=true;statusSelect.appendChild(option);});
        statusCell.appendChild(statusSelect);
        const actionsCell=document.createElement("td");
        const editButton=document.createElement("button");editButton.type="button";editButton.textContent="Edit";editButton.className="edit-task";editButton.dataset.action="edit";editButton.dataset.taskId=task.id;
        const deleteButton=document.createElement("button");deleteButton.type="button";deleteButton.textContent="Delete";deleteButton.className="delete-task";deleteButton.dataset.action="delete";deleteButton.dataset.taskId=task.id;
        actionsCell.appendChild(editButton);actionsCell.appendChild(deleteButton);
        row.appendChild(titleCell);row.appendChild(categoryCell);row.appendChild(priorityCell);row.appendChild(dateCell);row.appendChild(statusCell);row.appendChild(actionsCell);
        taskTableBody.appendChild(row);
    });
    taskCount.textContent="Total tasks: "+tasks.length+" | Showing: "+visibleTasks.length;
}

taskForm.addEventListener("submit",function(event){
    event.preventDefault();
    const title=taskTitleInput.value.trim();
    if(!title){showTaskMessage("Please enter a task name.");return;}
    const editingId=taskIdInput.value;
    if(editingId){
        const existingTask=tasks.find(function(task){return task.id===editingId;});
        if(existingTask){
            existingTask.title=title;existingTask.category=taskCategoryInput.value;existingTask.priority=taskPriorityInput.value;
            existingTask.dueDate=taskDueDateInput.value;existingTask.description=taskDescriptionInput.value.trim();
            saveTasks();renderTasks();resetTaskForm();showTaskMessage("Task updated successfully.");
        }
    }else{
        const newTask={id:Date.now().toString(),title:title,category:taskCategoryInput.value,priority:taskPriorityInput.value,dueDate:taskDueDateInput.value,description:taskDescriptionInput.value.trim(),status:"Pending"};
        tasks.push(newTask);saveTasks();renderTasks();resetTaskForm();showTaskMessage("New DevOps task added successfully.");
    }
});

taskTableBody.addEventListener("click",function(event){
    const button=event.target.closest("button[data-action]");if(!button)return;
    const taskId=button.dataset.taskId;const action=button.dataset.action;
    const selectedTask=tasks.find(function(task){return task.id===taskId;});if(!selectedTask)return;
    if(action==="edit"){
        taskIdInput.value=selectedTask.id;taskTitleInput.value=selectedTask.title;taskCategoryInput.value=selectedTask.category;
        taskPriorityInput.value=selectedTask.priority;taskDueDateInput.value=selectedTask.dueDate;taskDescriptionInput.value=selectedTask.description;
        taskFormHeading.textContent="Edit DevOps Task";saveTaskButton.textContent="Update Task";cancelEditButton.hidden=false;taskTitleInput.focus();
        showTaskMessage("Edit the task details and select Update Task.");
    }
    if(action==="delete"&&confirm("Are you sure you want to delete this task?")){
        const taskRow=button.closest("tr");if(taskRow)taskRow.remove();
        tasks=tasks.filter(function(task){return task.id!==taskId;});saveTasks();renderTasks();showTaskMessage("Task deleted successfully.");
        if(taskIdInput.value===taskId)resetTaskForm();
    }
});

taskTableBody.addEventListener("change",function(event){
    if(event.target.matches('select[data-action="status"]')){
        const taskId=event.target.dataset.taskId;
        const task=tasks.find(function(item){return item.id===taskId;});
        if(task){task.status=event.target.value;saveTasks();renderTasks();showTaskMessage("Task status updated to "+task.status+".");}
    }
});
taskStatusFilter.addEventListener("change",renderTasks);
cancelEditButton.addEventListener("click",function(){resetTaskForm();showTaskMessage("Editing cancelled.");});
loadTasks();renderTasks();
