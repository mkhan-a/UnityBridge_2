document.getElementById('loginForm').addEventListener('submit', loginUser);

async function loginUser(event) {
  event.preventDefault();

  const loginData = {
    email: document.getElementById('email').value.trim().toLowerCase(),
    password: document.getElementById('password').value
  };

  try {
    const response = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginData)
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('user', JSON.stringify(data.user));
      alert('Login successful!');
      window.location.href = 'dashboard.html';
    } else {
      alert(data.message || 'Invalid email or password.');
    }

  } catch (error) {
    console.error('Login error:', error);
    alert('Could not connect to the backend. Make sure your server is running.');
  }
}