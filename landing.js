(async () => {
    const getPosts = async () => {
        const res = await fetch('assets/posts.json');
        const posts = res.json();
        return posts;
    }

    const createPostElements = (posts) => {
        const postsContainer = document.querySelector('.posts');
        const cloneable = document.querySelector('.cloneable > .postContainer');
        posts.forEach(post => {
            const component = cloneable.cloneNode(true);
            const image = component.querySelector('.postContainer__imageContainer > img');
            const subTitle = component.querySelector('.postContainer__infoContainer__subTitle');
            const title = component.querySelector('.postContainer__infoContainer__title');

            image.src = `assets/post-images/${post.image ?? 'lg.png'}`;
            subTitle.textContent = post.subTitle;
            title.textContent = post.title;

            component.onclick = () => {
                window.location.href = (`blog?post=${post.title}`);
            }

            postsContainer.appendChild(component)
        })
    }

    const posts = await getPosts();
    createPostElements(posts);
})();


