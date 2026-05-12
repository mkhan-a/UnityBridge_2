function showTab(tab) {
  document.getElementById('request-form').classList.remove('active');
  document.getElementById('offer-form').classList.remove('active');

  document.querySelectorAll('.tab-btn').forEach(function (btn) {
    btn.classList.remove('active');
  });

  document.getElementById(tab + '-form').classList.add('active');

  var buttons = document.querySelectorAll('.tab-btn');

  if (tab === 'request') {
    buttons[0].classList.add('active');
  }

  if (tab === 'offer') {
    buttons[1].classList.add('active');
  }
}

function showFeedback(elementId, message, type) {
  var el = document.getElementById(elementId);
  el.textContent = message;
  el.className = 'feedback ' + type;
}

function validateFields(fields) {
  for (var label in fields) {
    if (!fields[label] || fields[label].trim() === '') {
      return 'Please fill in: ' + label;
    }
  }

  return null;
}

async function submitRequest() {
  var btn = document.getElementById('req-submit-btn');

  var user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    alert('You must be logged in to create a post.');
    window.location.href = 'Homepage.html';
    return;
  }

  var data = {
    userId: user.userId,
    title: document.getElementById('req-title').value.trim(),
    description: document.getElementById('req-description').value.trim(),
    zipCode: document.getElementById('req-location').value.trim()
  };

  var error = validateFields({
    'Title': data.title,
    'Description': data.description,
    'ZIP Code': data.zipCode
  });

  if (error) {
    showFeedback('req-feedback', error, 'error');
    return;
  }

  if (!/^\d{5}$/.test(data.zipCode)) {
    showFeedback('req-feedback', 'Please enter a valid 5-digit ZIP code.', 'error');
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Posting...';

  try {
    var response = await fetch('http://localhost:3000/api/requests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    var result = await response.json();

    if (response.ok) {
      showFeedback('req-feedback', '✅ Your request was posted!', 'success');
      clearForm('request');
    } else {
      showFeedback('req-feedback', result.message || 'Could not create request post.', 'error');
    }
  } catch (error) {
    console.error('Request post error:', error);
    showFeedback('req-feedback', 'Could not connect to backend.', 'error');
  }

  btn.disabled = false;
  btn.textContent = 'Post My Request';
}

async function submitOffer() {
  var btn = document.getElementById('off-submit-btn');

  var user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    alert('You must be logged in to create a post.');
    window.location.href = 'Homepage.html';
    return;
  }

  var data = {
    userId: user.userId,
    title: document.getElementById('off-title').value.trim(),
    description: document.getElementById('off-description').value.trim(),
    zipCode: document.getElementById('off-location').value.trim()
  };

  var error = validateFields({
    'Title': data.title,
    'Description': data.description,
    'ZIP Code': data.zipCode
  });

  if (error) {
    showFeedback('off-feedback', error, 'error');
    return;
  }

  if (!/^\d{5}$/.test(data.zipCode)) {
    showFeedback('off-feedback', 'Please enter a valid 5-digit ZIP code.', 'error');
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Posting...';

  try {
    var response = await fetch('http://localhost:3000/api/offers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    var result = await response.json();

    if (response.ok) {
      showFeedback('off-feedback', '✅ Your offer was posted!', 'success');
      clearForm('offer');
    } else {
      showFeedback('off-feedback', result.message || 'Could not create offer post.', 'error');
    }
  } catch (error) {
    console.error('Offer post error:', error);
    showFeedback('off-feedback', 'Could not connect to backend.', 'error');
  }

  btn.disabled = false;
  btn.textContent = 'Post My Offer';
}

function clearForm(type) {
  var prefix = type === 'request' ? 'req' : 'off';

  document.getElementById(prefix + '-username').value = '';
  document.getElementById(prefix + '-contact').value = '';
  document.getElementById(prefix + '-title').value = '';
  document.getElementById(prefix + '-description').value = '';
  document.getElementById(prefix + '-category').value = '';
  document.getElementById(prefix + '-location').value = '';
}