var userFormEl = document.querySelector("#user-form"); // get <form> id
var nameInputEl = document.querySelector("#username"); // get text <input> id
var repoContainerEl = document.querySelector("#repos-container"); // get <div>
var repoSearchTerm = document.querySelector("#repo-search-term"); // get <span> search term
var languageButtonsEl = document.querySelector("#language-buttons") // get <div> id

var getUserRepos = function(user) {
    // format the github api url
    var apiUrl = "https://api.github.com/users/" + user + "/repos";

    // make a request to the url
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                displayRepos(data, user);
            });
        } 
        else {
            alert("Error: GitHub User Not Found");
        }
    })
    
    .catch(function(error) {
        // chain `.catch()` onto the end of the `.then()` method
        alert("Unable to connect to GitHub");
    });
    
};

var formSubmitHandler = function(event) {
    event.preventDefault();
    
    // get value from input element
    var username = nameInputEl.value.trim();

    if (username) {
        getUserRepos(username);
        // reset form
        nameInputEl.value = "";
    }
    else {
        alert("Please enter a GitHub username");
    }

};

var displayRepos = function(repos, searchTerm) {
    // check if api returned any repos
    if (repos.length === 0) {
        repoContainerEl.textContent = "No repositories found.";
        return;
    }

    repoContainerEl.textContent = "";
    repoSearchTerm.textContent = searchTerm;

    // loop over repos
    for (var i = 0; i < repos.length; i++) {
        // format repo name
        var repoName = repos[i].owner.login + "/" + repos[i].name;
    
        // create a container for each repo
        var repoEl = document.createElement("a");
        repoEl.classList = "list-item flex-row justify-space-between align-center";
        repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);
    
        // create a span element to hold repository name
        var titleEl = document.createElement("span");
        titleEl.textContent = repoName;
    
        // append to container
        repoEl.appendChild(titleEl);

        // create a status element
        var statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";

        // check if current repo has issues or not
        if (repos[i].open_issues_count > 0) {
            statusEl.innerHTML =
                "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
        }
        else {
            statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
        }

        // append to container
        repoEl.appendChild(statusEl);
    
        // append container to the dom
        repoContainerEl.appendChild(repoEl);
    }

};

var getFeaturedRepos = function(language) {
    // create API endpoint
    var apiUrl = "https://api.github.com/search/repositories?q=" + language + "+is:featured&sort=help-wanted-issues";

    // make HTTP request to endpoint
    fetch(apiUrl).then(function(res) {
        if (res.ok) {
            // extract JSON from the response, parse response
            res.json().then(function(data) {
                displayRepos(data.items, language);
            });
        }
        else {
            alert("Error: GH user not found");
        }

    });

};

var buttonClickHandler = function(event) {
    var language = event.target.getAttribute("data-language");

    if (language) {
        // get repos
        getFeaturedRepos(language);
      
        // clear old content
        repoContainerEl.textContent = "";
    }

    console.log(language);
};

userFormEl.addEventListener("submit", formSubmitHandler);

languageButtonsEl.addEventListener("click", buttonClickHandler);