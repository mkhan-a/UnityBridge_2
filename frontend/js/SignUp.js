/* document.getElementById('signupForm').addEventListener('submit', storeData);

function storeData(event) {
  event.preventDefault();

  const user = {
    firstName:    document.getElementById('first').value.trim(),
    lastName:     document.getElementById('last').value.trim(),
    email:    document.getElementById('email').value.trim().toLowerCase(),
    password: document.getElementById('password').value,
    zipCode:      document.getElementById('zipcode').value.trim()
  };

  const users = JSON.parse(localStorage.getItem('ub_users') || '[]');

  if (users.find(function(u) { return u.email === user.email; })) {
    alert('An account with that email already exists. Please log in.');
    return;
  }

  users.push(user);
  localStorage.setItem('ub_users', JSON.stringify(users));
  alert('Account created successfully! Please log in.');
  window.location.href = 'Homepage.html';
}
*/

document.getElementById('signupForm').addEventListener('submit', signUpUser);

async function signUpUser(event) {
  event.preventDefault();

  const user = {
    firstName: document.getElementById('first').value.trim(),
    lastName: document.getElementById('last').value.trim(),
    email: document.getElementById('email').value.trim().toLowerCase(),
    password: document.getElementById('password').value,
    zipCode: document.getElementById('zipcode').value.trim()
  };

  try {
    const response = await fetch('http://localhost:3000/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    });

    const data = await response.json();

    if (response.ok) {
      alert('Account created successfully! Please log in.');
      window.location.href = 'Homepage.html';
    } else {
      alert(data.message || 'Signup failed.');
    }
  } catch (error) {
    console.error('Signup error:', error);
    alert('Could not connect to the backend. Make sure your server is running.');
  }
}