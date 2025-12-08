/**
 * Fetches all blog posts from the query index
 * @returns {Promise<Array>} Array of post objects with metadata
 */
async function fetchPosts() {
  try {
    const response = await fetch('/query-index.json');
    if (!response.ok) {
      throw new Error('Failed to fetch query index');
    }

    const data = await response.json();

    // Filter for posts in the /posts folder and sort by date (newest first)
    const posts = data.data
      .filter(page => page.path.startsWith('/posts/'))
      .map(page => ({
        title: page.title || 'Untitled',
        description: page.description || '',
        date: page.date || '',
        path: page.path,
        image: page.image || '',
      }))
      .sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB - dateA;
      });

    return posts;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

/**
 * Formats a date string into a readable format
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
function formatDate(dateString) {
  if (!dateString) return '';

  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

/**
 * Decorates the posts block
 * @param {Element} block - The posts block element
 */
export default async function decorate(block) {
  // Clear the block content
  block.innerHTML = '';

  // Fetch all posts
  const posts = await fetchPosts();

  if (posts.length === 0) {
    block.innerHTML = '<p>No posts found.</p>';
    return;
  }

  // Create posts container
  const postsContainer = document.createElement('div');
  postsContainer.className = 'posts-container';

  // Create post items
  posts.forEach(post => {
    const postItem = document.createElement('article');
    postItem.className = 'post-item';

    // Post date
    if (post.date) {
      const dateEl = document.createElement('div');
      dateEl.className = 'post-date';
      dateEl.textContent = formatDate(post.date);
      postItem.appendChild(dateEl);
    }

    // Post title
    const titleEl = document.createElement('h3');
    const linkEl = document.createElement('a');
    linkEl.href = post.path;
    linkEl.textContent = post.title;
    titleEl.appendChild(linkEl);
    postItem.appendChild(titleEl);

    // Post description/excerpt
    if (post.description) {
      const descEl = document.createElement('p');
      descEl.className = 'post-excerpt';
      descEl.textContent = post.description;
      postItem.appendChild(descEl);
    }

    postsContainer.appendChild(postItem);
  });

  block.appendChild(postsContainer);
}
