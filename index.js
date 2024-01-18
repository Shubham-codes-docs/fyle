const getRepoLanguage = (e) => {
  console.log(e);
};

let filterString = "";
const filterRepo = (e) => {
  if (e.data == null)
    filterString = filterString.slice(0, filterString.length - 1);
  else filterString = filterString.concat(e.data);
  const articles = Array.from(document.getElementsByClassName("repo"));
  articles.forEach((a) => {
    const articleName = a.querySelector(".repo-name").textContent;
    if (!articleName.toLowerCase().includes(filterString.toLowerCase())) {
      console.log(a);
      a.classList.toggle("d-none");
    } else {
      a.classList.remove("d-none");
    }
  });
};

const getUserRepos = async (repoUrl) => {
  const loader = document.getElementById("loader");
  loader.classList.remove("d-none");
  // const res = await fetch(repoUrl);
  // const data = await res.json();
  // console.log(data);
  loader.classList.add("d-none");
  const repos = document.getElementsByClassName("repo-wrapper")[0];
  repos.innerHTML = "";
  const data = repoUrl.forEach(async (repo) => {
    // const tags = await fetch(
    //   `https://api.github.com/repos/${repo.owner.login}/${repo.name}/languages`
    // );
    // let tagData = await tags.json();
    // console.log(tagData);
    const article = document.createElement("article");
    article.className += " repo px-4 py-4 mb-4";
    article.innerHTML = `<div class="repo-info">
    <h4 class="repo-name">
    <a href=${repo.html_url}>
    ${repo.name}
    </a>
    </h4>
    <p class="repo-desc">
      ${repo.description || "No description available for the repository..."}
    </p>
  </div>
  <div class="tags d-flex flex-wrap gap-2 mb-4">
    <span class="tag">${repo.language}</span>
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
  });
};

const getUserDetails = async (e) => {
  e.preventDefault();
  const userName = document.getElementById("userName").value;
  if (userName === "" || !userName) {
    alert("Please enter a username");
    return;
  }

  const loader = document.getElementById("loader");
  loader.classList.remove("d-none");

  // const res = await fetch(`https://api.github.com/users/${userName}`);
  const res = await fetch("./proxy.json");
  const user = await res.json();
  console.log(user);
  loader.classList.add("d-none");
  const data = user[0].user;
  if (!data) {
    alert("User not found");
    return;
  }
  userAvatar.src = data.avatar_url;
  fullName.textContent = data.name;
  profile.href = data.html_url;
  profile.textContent = data.login;
  getUserRepos(user[1].repos);
};

const userForm = document.getElementById("user-form");
const fullName = document.getElementById("user-name");
const userAvatar = document.getElementById("user-avatar");
const profile = document.getElementById("user-profile");
const repoFilter = document.getElementById("repoFilter");

userForm.addEventListener("submit", getUserDetails);
repoFilter.addEventListener("input", filterRepo);
