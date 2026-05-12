// Stores all posts loaded from the database
let allPosts = [];

// Keeps track of what the user is currently filtering by
let currentFilter = {
  type: 'all',
  zip: ''
};

// Loads posts from SQL Server through the backend
async function loadPostsFromDatabase() {
  try {
    let response = await fetch('http://localhost:3000/api/posts');

    if (!response.ok) {
      throw new Error('Could not load posts');
    }

    let databasePosts = await response.json();

    allPosts = databasePosts.map(function (p) {
      return {
        id: p.PostID,
        type: p.PostType,
        title: p.Title,
        description: p.Description,
        zipCode: p.ZipCode,
        status: p.Status,
        datePosted: p.CreatedAt,
        postedBy: p.FirstName + ' ' + p.LastName
      };
    });

    applyFilters();
  } catch (error) {
    console.error('Error loading posts:', error);

    let countEl = document.getElementById('results-count');
    let emptyState = document.getElementById('empty-state');

    if (countEl) {
      countEl.textContent = 'Could not load posts.';
    }

    if (emptyState) {
      emptyState.classList.remove('hidden');
    }
  }
}

// Takes an array of posts and displays them on the page
function renderPosts(posts) {
  let container = document.getElementById('posts-container');
  let emptyState = document.getElementById('empty-state');
  let countEl = document.getElementById('results-count');

  // Clear whatever was shown before
  container.innerHTML = '';

  // If no posts matched the filter, show the empty message and stop
  if (posts.length === 0) {
    emptyState.classList.remove('hidden');
    countEl.textContent = 'No posts found';
    return;
  }

  // Otherwise hide the empty message
  emptyState.classList.add('hidden');

  // Update the results count label
  if (posts.length === 1) {
    countEl.textContent = '1 post in your area';
  } else {
    countEl.textContent = posts.length + ' posts in your area';
  }

  // Loop through each post and build a card for it
  for (let i = 0; i < posts.length; i++) {
    let post = posts[i];

    // Set active/done status
    let isActive = false;

    if (post.status === 'Open') {
      isActive = true;
    }

    // Set the card's CSS class — requests get a different left border color
    let cardClass = 'post-card';

    if (post.type === 'Request') {
      cardClass = 'post-card type-request';
    }

    // Set the badge label and color class
    let badgeClass = 'post-badge badge-offer';
    let badgeText = 'Offer';

    if (post.type === 'Request') {
      badgeClass = 'post-badge badge-request';
      badgeText = 'Request';
    }

    // Set the status dot color
    let dotClass = 'dot dot-active';

    if (!isActive) {
      dotClass = 'dot dot-done';
    }

    // Format values before putting them into the card
    let statusText = post.status;
    let dateText = formatDate(post.datePosted);

    // Create the card element and fill in the HTML
    let card = document.createElement('div');
    card.className = cardClass;

    card.innerHTML = `
      <div class="card-top">
        <span class="${badgeClass}">${badgeText}</span>
        <span class="post-status">
          <span class="${dotClass}"></span>
          ${statusText}
        </span>
      </div>

      <div class="post-title">${post.title}</div>

      <div class="post-desc">${post.description}</div>

      <div class="post-meta">
        <span>&#128205; ${post.zipCode}</span>
        <span>&#128197; ${dateText}</span>
      </div>

      <div class="card-footer">
        <div class="poster">by <strong>${post.postedBy}</strong></div>
        <button type="button" class="btn-msg">Message</button>
      </div>
    `;

    // Attach the click event to the Message button after the card is built
    let messageBtn = card.querySelector('.btn-msg');

    messageBtn.addEventListener('click', function () {
      openModal(post.postedBy, post.title);
    });

    container.appendChild(card);
  }
}

// Applies whatever filters are currently set and re-renders the posts
function applyFilters() {
  let filtered = [];

  for (let i = 0; i < allPosts.length; i++) {
    filtered.push(allPosts[i]);
  }

  // Filter by type if one is selected
  if (currentFilter.type !== 'all') {
    let typeFiltered = [];

    for (let i = 0; i < filtered.length; i++) {
      if (filtered[i].type === currentFilter.type) {
        typeFiltered.push(filtered[i]);
      }
    }

    filtered = typeFiltered;
  }

  // Filter by ZIP code if one was entered
  if (currentFilter.zip !== '') {
    let zipFiltered = [];

    for (let i = 0; i < filtered.length; i++) {
      if (filtered[i].zipCode === currentFilter.zip) {
        zipFiltered.push(filtered[i]);
      }
    }

    filtered = zipFiltered;
  }

  renderPosts(filtered);
}

// Reads the ZIP code input and applies the filter
function filterByZip() {
  let zip = document.getElementById('zipInput').value.trim();

  // Make sure the ZIP code is exactly 5 characters if they typed something
  if (zip !== '' && zip.length !== 5) {
    alert('Please enter a valid 5-digit ZIP code.');
    return;
  }

  currentFilter.zip = zip;
  applyFilters();
}

// Clears the ZIP filter and shows all posts again
function clearFilter() {
  document.getElementById('zipInput').value = '';
  currentFilter.zip = '';
  applyFilters();
}

// Updates which type tab is active and filters the posts
function filterByType(type, clickedBtn) {
  if (type === 'request') {
    currentFilter.type = 'Request';
  } else if (type === 'offer') {
    currentFilter.type = 'Offer';
  } else {
    currentFilter.type = 'all';
  }

  // Remove the active class from all tab buttons
  let allTabs = document.querySelectorAll('.tab');

  for (let i = 0; i < allTabs.length; i++) {
    allTabs[i].classList.remove('active');
  }

  // Add the active class to whichever tab was clicked
  if (clickedBtn) {
    clickedBtn.classList.add('active');
  }

  applyFilters();
}

// Opens the message modal with the recipient's name and post title filled in
function openModal(recipient, postTitle) {
  document.getElementById('modal-recipient').textContent = recipient;
  document.getElementById('modal-post-title').textContent = postTitle;
  document.getElementById('messageText').value = '';
  document.getElementById('messageModal').classList.remove('hidden');
}

// Hides the message modal
function closeModal() {
  document.getElementById('messageModal').classList.add('hidden');
}

// Validates the message and closes the modal on success
function sendMessage() {
  let text = document.getElementById('messageText').value.trim();

  if (text === '') {
    alert('Please write a message before sending.');
    return;
  }

  closeModal();
  showToast('Message sent!');
}

// Close the modal if the user clicks on the dark background behind it
document.getElementById('messageModal').addEventListener('click', function (event) {
  if (event.target === this) {
    closeModal();
  }
});

// Shows a brief success message at the bottom of the screen
function showToast(message) {
  let toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);

  // Remove the toast from the page after 3 seconds
  setTimeout(function () {
    toast.remove();
  }, 3000);
}

// Formats a date string like "2026-04-25" into "Apr 25, 2026"
function formatDate(dateStr) {
  let date = new Date(dateStr);

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

// Allow the user to press Enter in the ZIP field instead of clicking Search
document.getElementById('zipInput').addEventListener('keypress', function (event) {
  if (event.key === 'Enter') {
    filterByZip();
  }
});

// Check if the user had dark mode turned on last time and apply it
let savedTheme = localStorage.getItem('theme');

if (savedTheme === 'dark') {
  document.documentElement.setAttribute('data-theme', 'dark');
}

// Wire logout button
document.querySelector('.sidebar-logout').addEventListener('click', function () {
  localStorage.removeItem('ub_session');
  window.location.href = 'Homepage.html';
});

// Wire the Post Request / Post Offer buttons to the Post page
let headerButtons = document.querySelectorAll('.header-actions button');

if (headerButtons[0]) {
  headerButtons[0].addEventListener('click', function () {
    window.location.href = 'Post.html';
  });
}

if (headerButtons[1]) {
  headerButtons[1].addEventListener('click', function () {
    window.location.href = 'Post.html';
  });
}

// Load posts from the database when the dashboard opens
loadPostsFromDatabase();