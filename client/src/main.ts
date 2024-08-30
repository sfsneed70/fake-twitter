interface Tweet {
  id: number;
  body: string;
  user_id: number;
  username: string;
}
interface User {
  id: number;
  username: string;
  tweets?: Tweet[];
}

async function getAllUsers() {
  const response = await fetch("/api/users", {
    method: "GET",
  });

  if (!response.ok) {
    alert(`HTTP error! status: ${response.status}`);
    return;
  }
  return response.json();
}

async function getOneUser(id: number) {
  const response = await fetch(`/api/users/${id}`, {
    method: "GET",
  });

  if (!response.ok) {
    alert(`HTTP error! status: ${response.status}`);
    return;
  }
  return response.json();
}

async function getAllTweets() {
    const response = await fetch("/api/tweets", {
        method: "GET",
    });
    
    if (!response.ok) {
        alert(`HTTP error! status: ${response.status}`);
        return;
    }
    return response.json();
}

async function renderUsers(users: User[]) {
  const usersListEl = document.querySelector("#users-list");

  if (usersListEl) {
    users.forEach((user: User) => {
      const listItemEl = document.createElement("li");
      const userLinkEl = document.createElement("a");
      userLinkEl.href = `/users/?id=${user.id}`;
      userLinkEl.textContent = user.username;
      listItemEl.appendChild(userLinkEl);

      if (user.tweets) {
        const tweetsListEl = document.createElement("ul");
        user.tweets.forEach((tweet: Tweet) => {
          const tweetListItemEl = document.createElement("li");
          tweetListItemEl.textContent = tweet.body;
          tweetsListEl.appendChild(tweetListItemEl);
        });
        listItemEl.appendChild(tweetsListEl);
      }
      usersListEl.appendChild(listItemEl);
    });
  }
}

async function renderTweets(tweets: Tweet[]) {
    const tweetsListEl = document.querySelector("#tweets-list");
    
    if (tweetsListEl) {
        tweets.forEach((tweet: Tweet) => {
            const tweetListItemEl = document.createElement("li");
            tweetListItemEl.innerHTML = `${tweet.body} by <a href="/users?id=${tweet.user_id}">${tweet.username}</a>`;
            tweetsListEl.appendChild(tweetListItemEl);
        });
    }
}

document.addEventListener("DOMContentLoaded", async () => {
  // get current url
  const currentUrl = window.location.pathname;

  if (currentUrl.startsWith("/users")) {
    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get("id");
    const userIdFormEl: HTMLInputElement | null =
      document.querySelector("#user_id");
    const tweetFormEl: HTMLFormElement | null =
      document.querySelector("#tweet-form");

    if (id) {
      if (userIdFormEl && tweetFormEl) {
        userIdFormEl.value = id;
        tweetFormEl.style.display = "block";
      }
      // get one user

      const user = await getOneUser(parseInt(id));
      renderUsers(user);
    } else {
      // get all users
      const users = await getAllUsers();
      renderUsers(users);
    }
  } else if (currentUrl.startsWith("/tweets")) {
    // do the tweets thing
    const tweets = await getAllTweets();
    renderTweets(tweets);
  } else if (currentUrl === "/") {
    // do the homepage thing
    const userFormEl: HTMLFormElement | null =
      document.querySelector("#user-form");
    if (userFormEl) {
      userFormEl.style.display = "block";
    }
  }
});
