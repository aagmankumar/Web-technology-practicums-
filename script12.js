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
