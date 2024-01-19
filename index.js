//global variables
let globalUser = "";
let filterString = "";
let currentPage = 1;
let totalPages;
let items_per_page = 10;
let totalRepos;

//getting dom elements for manipulation
const userForm = document.getElementById("user-form");
const userBio = document.getElementById("user-bio-para");
const fullName = document.getElementById("user-name");
const userAvatar = document.getElementById("user-avatar");
const profile = document.getElementById("user-profile");
const repoFilter = document.getElementById("repoFilter");
const pagination = document.getElementById("pagination");
const itemsPerPage = document.getElementById("items_per_page");
const welcomeText = document.getElementsByClassName("welcome-text")[0];
const userRepos = document.getElementById("user-repos");

const changeItemCount = (e) => {
  items_per_page = e.target.value;
  currentPage = 1;
  totalPages = Math.ceil(totalRepos / items_per_page);
  paginateResult();
  getUserRepos();
};

const filterRepo = (e) => {
  if (e.data == null)
    filterString = filterString.slice(0, filterString.length - 1);
  else filterString = filterString.concat(e.data);
  const articles = Array.from(document.getElementsByClassName("repo"));
  articles.forEach((a) => {
    const articleName = a.querySelector(".repo-name").textContent;
    if (!articleName.toLowerCase().includes(filterString.toLowerCase())) {
      a.classList.add("d-none");
    } else {
      a.classList.remove("d-none");
    }
  });
};

const getUserRepos = async (repoUrl = globalUser) => {
  userRepos.classList.remove("d-none");
  const loader = document.getElementById("repo-loader");
  loader.classList.remove("d-none");
  const res = await fetch(
    `${repoUrl}?per_page=${items_per_page}&page=${currentPage}`
  );
  const data = await res.json();
  loader.classList.add("d-none");
  const repos = document.getElementsByClassName("repo-wrapper")[0];
  repos.innerHTML = "";
  data.forEach(async (repo) => {
    const article = document.createElement("article");
    article.className += " repo px-4 py-4 mb-4";
    article.innerHTML = `<div class="repo-info">
    <h4 class="repo-name">
    <a href=${repo.html_url} target="_blank">
    ${repo.name}
    </a>
    </h4>
    <p class="repo-desc">
      ${repo.description || "No description available for the repository..."}
    </p>
  </div>
  <div class="tags d-flex flex-wrap gap-2 mb-4">
  </div>
  <div class="repo-stats d-flex align-content-center gap-2">
    <div class="repo-stat">
      <img src="./assets/icons/stars.svg" alt="stars" />
      <span class="repo-stat-value">${repo.stargazers_count}</span>
      <span class="repo-stat-name">Stars</span>
    </div>
    <div class="repo-stat">
      <img src="./assets/icons/git-fork.svg" alt="github-forks" />
      <span class="repo-stat-value">${repo.forks_count}</span>
      <span class="repo-stat-name">Forks</span>
    </div>
    <div class="repo-stat">
      <img src="./assets/icons/eye.svg" alt="watchers" />
      <span class="repo-stat-value">${repo.watchers_count}</span>
      <span class="repo-stat-name">Watching</span>
    </div>
  </div>`;
    repos.appendChild(article);
    const tags = document.querySelector(".tags");
    repo.topics.length > 0 &&
      repo.topics.forEach((topic) => {
        const span = document.createElement("span");
        span.classList.add("tag");
        span.textContent = topic;
        tags.append(span);
      });
  });
};

const paginateResult = (e) => {
  filterString = "";
  if (e) page = e.target.value;
  else page = 1;
  currentPage = page;
  const prevLink = document.querySelector("#previousLi");
  const nextLink = document.querySelector("#nextLi");
  const currentLink = document.querySelector("#currentLi");
  if (page - 1 < 1) {
    prevLink.classList.add("d-none");
  } else {
    prevLink.classList.remove("d-none");
    prevLink.value = currentPage - 1;
  }

  currentLink.textContent = currentPage;

  if (currentPage + 1 > totalPages) {
    nextLink.classList.add("d-none");
  } else {
    nextLink.classList.remove("d-none");
    nextLink.value = currentPage + 1;
  }

  getUserRepos();
};

const getUserDetails = async (e) => {
  e.preventDefault();
  const userName = document.getElementById("userName").value;
  if (userName === "" || !userName) {
    const nameAlert = document.getElementById("user-alert");
    nameAlert.classList.remove("d-none");
    setTimeout(() => {
      nameAlert.classList.add("d-none");
    }, 5000);
    return;
  }

  //removing the previous pagination links
  const oldPrevLink = document.querySelector("#previousLi");
  if (oldPrevLink) {
    const prevParent = oldPrevLink.parentNode;
    prevParent.removeChild(oldPrevLink);
  }

  const oldCurrentLink = document.querySelector("#currentLi");
  if (oldCurrentLink) {
    const currParent = oldCurrentLink.parentNode;
    currParent.removeChild(oldCurrentLink);
  }

  const oldNextLink = document.querySelector("#nextLi");
  if (oldNextLink) {
    const nextParent = oldNextLink.parentNode;
    nextParent.removeChild(oldNextLink);
  }

  welcomeText.classList.add("d-none");
  const loader = document.getElementById("user-loader");
  loader.classList.remove("d-none");
  const userInfo = document.getElementsByClassName("user-info-section")[0];
  userInfo.classList.add("d-none");
  currentPage = 1;
  filterString = "";

  const res = await fetch(`https://api.github.com/users/${userName}`);
  const data = await res.json();
  loader.classList.add("d-none");
  userInfo.classList.remove("d-none");
  if (!data) {
    const nameAlert = document.getElementById("user-alert");
    nameAlert.textContent = "No user with the given userName found...";
    nameAlert.classList.remove("d-none");
    setTimeout(() => {
      nameAlert.classList.add("d-none");
    }, 5000);
    return;
  }
  globalUser = data.repos_url;
  userAvatar.src = data.avatar_url;
  fullName.textContent = data.name;
  userBio.textContent = data.bio || "No bio Available!";
  profile.href = data.html_url;
  profile.textContent = data.login;
  const total_pages = Math.ceil(data.public_repos / items_per_page);
  totalRepos = data.public_repos;
  totalPages = total_pages;

  //generating pagination links
  const previousLi = document.createElement("li");
  previousLi.id = "previousLi";
  previousLi.classList.add("page-item");
  previousLi.classList.add("page-link");
  currentPage - 1 < 1
    ? previousLi.classList.add("d-none")
    : previousLi.classList.remove("d-none");
  previousLi.value = currentPage - 1;
  previousLi.textContent = "<";
  previousLi.onclick = paginateResult;
  pagination.append(previousLi);

  const currentLi = document.createElement("li");
  currentLi.id = "currentLi";
  currentLi.classList.add("page-item");
  currentLi.classList.add("page-link");
  currentLi.value = currentPage;
  currentLi.textContent = currentPage;
  currentLi.onclick = paginateResult;
  pagination.append(currentLi);

  const nextLi = document.createElement("li");
  nextLi.id = "nextLi";
  nextLi.classList.add("page-item");
  nextLi.classList.add("page-link");
  currentPage + 1 > total_pages
    ? nextLi.classList.add("d-none")
    : nextLi.classList.remove("d-none");
  nextLi.value = currentPage + 1;
  nextLi.textContent = ">";
  nextLi.onclick = paginateResult;
  pagination.append(nextLi);
  getUserRepos(data.repos_url);
};

//connecting event listeners
userForm.addEventListener("submit", getUserDetails);
repoFilter.addEventListener("input", filterRepo);
itemsPerPage.addEventListener("change", changeItemCount);
