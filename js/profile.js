// ── Load logged-in user data ────────────────────────────────────────────────
var user = JSON.parse(localStorage.getItem('user'));

if (!user) {
  alert('You must be logged in to view your profile.');
  window.location.href = 'Homepage.html';
}

// Basic user values from login response
var firstName = user.firstName || '';
var lastName = user.lastName || '';
var userEmail = user.email || '';
var userZip = user.zipCode || '';
var userPhone = user.preferredPhone || '';
var userRole = user.userRole || 'User';

var initials =
    (firstName.charAt(0) || '') +
    (lastName.charAt(0) || '');

// ── Populate profile card ───────────────────────────────────────────────────
document.getElementById('avatarInitials').textContent = initials || 'U';
document.getElementById('profileName').textContent = (firstName + ' ' + lastName).trim() || 'UnityBridge User';

// Update profile ZIP card
var profileZip = document.querySelector('.profile-zip');
if (profileZip) {
  profileZip.textContent = userZip ? '📍 ZIP ' + userZip : '📍 ZIP not provided';
}

// Optional: update username display since your database does not have Username
var profileUsername = document.querySelector('.profile-username');
if (profileUsername) {
  profileUsername.textContent = userEmail || '@unitybridge_user';
}

// ── Account info rows ───────────────────────────────────────────────────────
function setInfoRow(label, value) {
  var rows = document.querySelectorAll('.info-row');

  for (var i = 0; i < rows.length; i++) {
    var labelElement = rows[i].querySelector('.info-label');
    var valueElement = rows[i].querySelector('.info-value');

    if (labelElement && valueElement && labelElement.textContent.trim() === label) {
      valueElement.textContent = value || 'Not provided';
      valueElement.setAttribute('data-field', label);
    }
  }
}

setInfoRow('First Name', firstName);
setInfoRow('Last Name', lastName);
setInfoRow('Username', 'Not used');
setInfoRow('Email', userEmail);
setInfoRow('Phone', userPhone || 'Not provided');
setInfoRow('ZIP Code', userZip);

// ── Edit Profile ────────────────────────────────────────────────────────────
// Note: This updates the browser's saved user only.
// It does NOT update SQL Server unless you later add a backend PUT route.
var editBtn = document.querySelector('.btn-edit');
var isEditing = false;

if (editBtn) {
  editBtn.addEventListener('click', function () {
    if (!isEditing) {
      startEditing();
    } else {
      saveEdits();
    }
  });
}

function startEditing() {
  isEditing = true;

  editBtn.textContent = 'Save Changes';
  editBtn.style.background = 'var(--accent)';
  editBtn.style.color = '#fff';
  editBtn.style.borderColor = 'var(--accent)';

  // Username is not in your SQL Server Users table, so I left it out.
  var editableFields = ['First Name', 'Last Name', 'Email', 'Phone', 'ZIP Code'];
  var rows = document.querySelectorAll('.info-row');

  for (var i = 0; i < rows.length; i++) {
    var label = rows[i].querySelector('.info-label').textContent.trim();

    if (editableFields.indexOf(label) !== -1) {
      var valueEl = rows[i].querySelector('.info-value');
      var current = valueEl.textContent;

      if (current === 'Not provided') {
        current = '';
      }

      valueEl.innerHTML = '<input type="text" class="edit-input" value="' + current + '">';
    }
  }
}

function saveEdits() {
  isEditing = false;

  editBtn.textContent = 'Edit Profile';
  editBtn.style.background = '';
  editBtn.style.color = '';
  editBtn.style.borderColor = '';

  var inputs = document.querySelectorAll('.edit-input');

  inputs.forEach(function (input) {
    var row = input.closest('.info-row');
    var label = row.querySelector('.info-label').textContent.trim();
    var val = input.value.trim();

    input.parentElement.textContent = val || 'Not provided';

    if (label === 'First Name') {
      user.firstName = val;
    }

    if (label === 'Last Name') {
      user.lastName = val;
    }

    if (label === 'Email') {
      user.email = val;
    }

    if (label === 'Phone') {
      user.preferredPhone = val;
    }

    if (label === 'ZIP Code') {
      user.zipCode = val;
    }
  });

  // Save updated user in localStorage
  localStorage.setItem('user', JSON.stringify(user));

  // Refresh displayed profile card
  firstName = user.firstName || '';
  lastName = user.lastName || '';
  userEmail = user.email || '';
  userZip = user.zipCode || '';
  userPhone = user.preferredPhone || '';

  initials =
      (firstName.charAt(0) || '') +
      (lastName.charAt(0) || '');

  document.getElementById('profileName').textContent = (firstName + ' ' + lastName).trim() || 'UnityBridge User';
  document.getElementById('avatarInitials').textContent = initials || 'U';

  if (profileZip) {
    profileZip.textContent = userZip ? '📍 ZIP ' + userZip : '📍 ZIP not provided';
  }

  if (profileUsername) {
    profileUsername.textContent = userEmail || '@unitybridge_user';
  }

  showToast('Profile updated locally.');
}

// Add input styling inline so it works without extra CSS
var style = document.createElement('style');
style.textContent =
    '.edit-input { width:100%; padding:5px 8px; border:1.5px solid var(--accent); border-radius:5px; font-family:Arial,sans-serif; font-size:0.86rem; background:var(--surface-2); color:var(--text-primary); outline:none; }';
document.head.appendChild(style);

// ── Deactivate Account ──────────────────────────────────────────────────────
// This only logs the user out locally.
// It does not deactivate the account in SQL Server yet.
var deactivateBtn = document.querySelectorAll('.setting-row .btn-outline')[0];

if (deactivateBtn) {
  deactivateBtn.addEventListener('click', function () {
    var confirmed = confirm('Are you sure you want to deactivate your account? You will be logged out.');

    if (!confirmed) {
      return;
    }

    localStorage.removeItem('user');
    alert('You have been logged out. Database deactivation is not connected yet.');
    window.location.href = 'Homepage.html';
  });
}

// ── Request Data Removal ────────────────────────────────────────────────────
// This only logs the user out locally.
// It does not delete from SQL Server yet.
var removeBtn = document.querySelectorAll('.setting-row .btn-outline')[1];

if (removeBtn) {
  removeBtn.addEventListener('click', function () {
    var confirmed = confirm('This will log you out. Full database removal is not connected yet. Continue?');

    if (!confirmed) {
      return;
    }

    localStorage.removeItem('user');
    alert('You have been logged out. Database deletion is not connected yet.');
    window.location.href = 'Homepage.html';
  });
}

// ── Dark mode ───────────────────────────────────────────────────────────────
function toggleTheme() {
  var toggle = document.getElementById('darkModeToggle');

  if (toggle.checked) {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
  }
}

function applyStoredTheme() {
  var saved = localStorage.getItem('theme');
  var toggle = document.getElementById('darkModeToggle');

  if (saved === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');

    if (toggle) {
      toggle.checked = true;
    }
  } else {
    document.documentElement.setAttribute('data-theme', 'light');

    if (toggle) {
      toggle.checked = false;
    }
  }
}

// ── User Posts from SQL Server ────────────────────────────────────────────────
var allPosts = [];

async function loadMyPosts() {
  try {
    if (!user || !user.userId) {
      console.error('No logged-in user found.');
      renderMyPosts();
      return;
    }

    var response = await fetch('http://localhost:3000/api/users/' + user.userId + '/posts');
    var data = await response.json();

    if (response.ok) {
      allPosts = data.posts.map(function (post) {
        return {
          id: post.PostID,
          type: post.PostType,
          title: post.Title,
          description: post.Description,
          zipCode: post.ZipCode,
          status: post.Status,
          datePosted: post.CreatedAt
        };
      });

      renderMyPosts();
    } else {
      console.error(data.message || 'Could not load posts.');
      renderMyPosts();
    }
  } catch (error) {
    console.error('Error loading user posts:', error);
    renderMyPosts();
  }
}

function renderMyPosts() {
  var container = document.getElementById('my-posts-container');
  var empty = document.getElementById('empty-mine');

  if (!container || !empty) {
    return;
  }

  container.innerHTML = '';

  if (allPosts.length === 0) {
    empty.classList.remove('hidden');
    return;
  }

  empty.classList.add('hidden');

  for (var i = 0; i < allPosts.length; i++) {
    var post = allPosts[i];

    var postType = (post.type || '').toLowerCase();
    var isRequest = postType === 'request';
    var isActive = post.status === 'Open' || post.status === 'open' || post.status === 'active';

    var cardClass = isRequest ? 'post-card type-request' : 'post-card';
    var badgeClass = isRequest ? 'post-badge badge-request' : 'post-badge badge-offer';
    var badgeText = isRequest ? 'Request' : 'Offer';
    var dotClass = isActive ? 'dot dot-active' : 'dot dot-done';
    var statusText = capitalize(post.status || 'Open');
    var dateText = formatDate(post.datePosted);

    var card = document.createElement('div');
    card.className = cardClass;

    card.innerHTML =
        '<div class="card-top">' +
        '<span class="' + badgeClass + '">' + badgeText + '</span>' +
        '<span class="post-status"><span class="' + dotClass + '"></span>' + statusText + '</span>' +
        '</div>' +
        '<div class="post-title">' + escapeHtml(post.title) + '</div>' +
        '<div class="post-desc">' + escapeHtml(post.description) + '</div>' +
        '<div class="post-meta">' +
        '<span>&#128205; ZIP ' + escapeHtml(post.zipCode) + '</span>' +
        '<span>&#128197; ' + dateText + '</span>' +
        '</div>' +
        '<div class="card-footer">' +
        '<div class="poster">Your post</div>' +
        '</div>';

    container.appendChild(card);
  }
}

function formatDate(dateStr) {
  var date = new Date(dateStr);

  if (isNaN(date.getTime())) {
    return 'Unknown date';
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function capitalize(str) {
  if (!str) {
    return '';
  }

  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function escapeHtml(value) {
  return String(value || '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
}

// ── Logout ──────────────────────────────────────────────────────────────────
var logoutBtn = document.querySelector('.sidebar-logout');

if (logoutBtn) {
  logoutBtn.addEventListener('click', function () {
    localStorage.removeItem('user');
    window.location.href = 'Homepage.html';
  });
}

// ── Utilities ───────────────────────────────────────────────────────────────
function showToast(message) {
  var toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;

  document.body.appendChild(toast);

  setTimeout(function () {
    toast.remove();
  }, 3000);
}

function formatDate(dateStr) {
  var date = new Date(dateStr);

  if (isNaN(date.getTime())) {
    return 'Unknown date';
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function capitalize(str) {
  if (!str) {
    return '';
  }

  return str.charAt(0).toUpperCase() + str.slice(1);
}

function escapeHtml(value) {
  return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
}

// ── Init ────────────────────────────────────────────────────────────────────
applyStoredTheme();
loadMyPosts();