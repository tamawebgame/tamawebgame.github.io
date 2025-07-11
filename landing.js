(async () => {
  const getPosts = async () => {
    const res = await fetch("https://tamawebgame.github.io/blog/posts.json");
    const posts = res.json();
    return posts;
  };

  const createPostElements = (posts) => {
    const postsContainer = document.querySelector(".posts");
    const cloneable = document.querySelector(".cloneable > .postContainer");
    posts.forEach((post) => {
      const component = cloneable.cloneNode(true);
      const image = component.querySelector(
        ".postContainer__imageContainer > img"
      );
      const subTitle = component.querySelector(
        ".postContainer__infoContainer__subTitle"
      );
      const title = component.querySelector(
        ".postContainer__infoContainer__title"
      );

      // image.src = `assets/post-images/${post.image ?? "lg.png"}`;
      image.src = `https://tamawebgame.github.io/blog/post-images/${post.image ?? "lg.png"}`;
      subTitle.textContent = post.subTitle;
      title.textContent = post.title;

      component.onclick = () => {
        window.location.href = `blog?post=${post.title}`;
      };

      postsContainer.appendChild(component);
    });
  };

  const initializeFeedback = () => {
    const FORM_URL =
      "https://docs.google.com/forms/d/e/1FAIpQLSenonpIhjHL8BYJbnOHqF2KudJiDciEveJG56BdGsvJ01-rTA/formResponse?usp=pp_url&entry.1753365981=%%UID%%&entry.233513152=%%TEXT%%";

    const [
      usernameInput,
      textInput,
      submitBtn,
      feedbackInProgressMessage,
      feedbackDoneMessage,
    ] = document.querySelectorAll(
      "#feedback__username, #feedback__text, #feedback__submit, #feedback__in-progress, #feedback__done"
    );

    textInput.oninput = (event) => {
      const value = event.target.value?.trim();
      submitBtn.disabled = !value;
    };

    submitBtn.onclick = () => {
      const url = FORM_URL.replace(
        "%%UID%%",
        usernameInput.value?.trim()
      ).replace("%%TEXT%%", textInput.value?.trim());

      textInput.disabled = true;
      usernameInput.disabled = true;
      submitBtn.disabled = true;
      feedbackDoneMessage.classList.add("hidden");
      feedbackInProgressMessage.classList.remove("hidden");

      fetch(url)
        .catch((e) => {})
        .finally(() => {
          setTimeout(() => {
            textInput.disabled = false;
            usernameInput.disabled = false;

            textInput.value = "";
            usernameInput.value = "";

            feedbackDoneMessage.classList.remove("hidden");
            feedbackInProgressMessage.classList.add("hidden");
          }, 1000 + (Math.random() * 3000));
        });
    };
  };

  const populateDiscordMemberCount = async () => {
    const discordInviteId = '2Gaepf3Vhv';
    const endpoint = `https://discord.com/api/v9/invites/${discordInviteId}?with_counts=true&with_expiration=true`;
    const response = await fetch(endpoint);
    const json = await response.json();
    document.querySelector('#discord-member-count').textContent = `${json.approximate_member_count}`
  }

  initializeFeedback();
  populateDiscordMemberCount();
  const posts = await getPosts();
  createPostElements(posts);
})();
