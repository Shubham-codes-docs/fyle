const getUserRepos = async (repoUrl) => {
  const res = await fetch(repoUrl);
  const data = await res.json();
  console.log(data);
  const repos = document.getElementsByClassName("repo-wrapper")[0];
  repos.innerHTML = "";
  data.forEach(async (repo) => {
    const tags = await fetch(
      `https://api.github.com/repos/${repo.owner.login}/${repo.name}/languages`
    );
    let tagData = await tags.json();
    console.log(tagData);
    const article = document.createElement("article");
    article.className += " repo px-4 py-4";
    article.innerHTML = `<div class="repo-info">
    <h4 class="repo-name">${repo.name}</h4>
    <p class="repo-desc">
      ${repo.description}
    </p>
  </div>
  <div class="tags d-flex flex-wrap gap-2 mb-4">
    <span class="tag">HTML</span>
    <span class="tag">CSS</span>
    <span class="tag">JAVASCRIPT</span>
  </div>
  <div class="repo-stats d-flex align-content-center gap-2">
    <div class="repo-stat">
      <img src="./assets/icons/stars.svg" alt="stars" />
      <span class="repo-stat-value">1</span>
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

  const res = await fetch(`https://api.github.com/users/${userName}`);
  const data = await res.json();
  console.log(data);
  if (!data) {
    alert("User not found");
    return;
  }
  userAvatar.src = data.avatar_url;
  fullName.textContent = data.name;
  profile.href = data.html_url;
  profile.textContent = data.login;
  getUserRepos(data.repos_url);
};

const userForm = document.getElementById("user-form");
const fullName = document.getElementById("name");
const userAvatar = document.getElementById("user-avatar");
const profile = document.getElementById("profile");

userForm.addEventListener("submit", getUserDetails);
