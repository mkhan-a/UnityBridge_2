// The logged-in user's username (will come from the session later)
const myUsername = 'jordan_m';

// Mock conversations (will come from the database later)
// Each conversation is tied to a specific post and has an array of messages
const conversations = [
  {
    id: 1,
    withUser: 'john_doe',
    postTitle: 'Need a Ride to the Grocery Store',
    messages: [
      {
        from: 'john_doe',
        text: 'Hi! I saw your post about needing a ride this Saturday. I drive past several grocery stores in the morning — happy to help.',
        time: '9:14 AM'
      },
      {
        from: 'jordan_m',
        text: 'That would be amazing, thank you! Would 9 AM work for you?',
        time: '9:32 AM'
      },
      {
        from: 'john_doe',
        text: '9 AM works perfectly. Just send me your address and I will be there.',
        time: '9:45 AM'
      }
    ]
  },
  {
    id: 2,
    withUser: 'garden_grace',
    postTitle: 'Fresh Vegetables from My Garden',
    messages: [
      {
        from: 'jordan_m',
        text: 'Hi Grace! I saw your post about the vegetables. I would love some tomatoes if you still have them available.',
        time: 'Yesterday'
      },
      {
        from: 'garden_grace',
        text: 'Of course! I have plenty. Come by anytime this week between 2 and 6 PM. I also have fresh basil and zucchini.',
        time: 'Yesterday'
      }
    ]
  },
  {
    id: 3,
    withUser: 'walker_wendy',
    postTitle: 'Dog Walking – Weekday Mornings',
    messages: [
      {
        from: 'jordan_m',
        text: 'Hi Wendy! I have a golden retriever and I would love to have him walked on Tuesday and Thursday mornings if you are available.',
        time: '2 days ago'
      },
      {
        from: 'walker_wendy',
        text: 'That sounds wonderful! I love goldens. Tuesday and Thursday at 7:30 AM works perfectly for me.',
        time: '2 days ago'
      },
      {
        from: 'jordan_m',
        text: 'Perfect. His name is Biscuit and he is very friendly.',
        time: '2 days ago'
      },
      {
        from: 'walker_wendy',
        text: 'Ha, I love that name. See you Tuesday!',
        time: '2 days ago'
      }
    ]
  }
];

// Keeps track of which conversation is currently open
let activeConvoId = null;

// Builds the conversation list on the left side of the page
function renderConvoList() {
  let list = document.getElementById('convo-list');
  list.innerHTML = '';

  for (let i = 0; i < conversations.length; i++) {
    let convo = conversations[i];

    // Get the last message to use as a preview line
    let lastMsg = convo.messages[convo.messages.length - 1];
    let preview = lastMsg.text;

    // Create the conversation list item
    let item = document.createElement('div');
    item.className = 'convo-item';
    item.setAttribute('data-id', convo.id);
    item.innerHTML = `
      <div class="convo-name">@${convo.withUser}</div>
      <div class="convo-post">Re: ${convo.postTitle}</div>
      <div class="convo-preview">${preview}</div>
    `;

    // When clicked, open that conversation on the right side
    item.addEventListener('click', function() {
      openConversation(convo.id);
    });

    list.appendChild(item);
  }
}

// Opens a conversation and shows the full message thread on the right
function openConversation(convoId) {
  activeConvoId = convoId;

  // Find the conversation with the matching id
  let convo = null;
  for (let i = 0; i < conversations.length; i++) {
    if (conversations[i].id === convoId) {
      convo = conversations[i];
    }
  }

  if (convo === null) {
    return;
  }

  // Remove the active class from all conversation items, then add it to the clicked one
  let allItems = document.querySelectorAll('.convo-item');
  for (let i = 0; i < allItems.length; i++) {
    allItems[i].classList.remove('active');
    if (parseInt(allItems[i].getAttribute('data-id')) === convoId) {
      allItems[i].classList.add('active');
    }
  }

  // Hide the empty placeholder and show the thread panel
  document.getElementById('thread-empty').classList.add('hidden');
  document.getElementById('thread-content').classList.remove('hidden');

  // Fill in the header with who you are talking to and about what
  let header = document.getElementById('thread-header');
  header.innerHTML = `
    <div class="thread-header-name">@${convo.withUser}</div>
    <div class="thread-header-post">Re: ${convo.postTitle}</div>
  `;

  // Clear the message area and build each message bubble
  let messagesEl = document.getElementById('thread-messages');
  messagesEl.innerHTML = '';

  for (let i = 0; i < convo.messages.length; i++) {
    let msg = convo.messages[i];

    // Figure out if the message was sent by me or the other person
    let rowClass = 'msg-row theirs';
    let bubbleClass = 'msg-bubble theirs';
    if (msg.from === myUsername) {
      rowClass = 'msg-row mine';
      bubbleClass = 'msg-bubble mine';
    }

    let row = document.createElement('div');
    row.className = rowClass;
    row.innerHTML = `
      <div>
        <div class="${bubbleClass}">${msg.text}</div>
        <div class="msg-time">${msg.time}</div>
      </div>
    `;

    messagesEl.appendChild(row);
  }

  // Scroll to the bottom so the most recent message is visible
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

// Sends a reply and adds it to the current conversation
function sendReply() {
  let textArea = document.getElementById('replyText');
  let text = textArea.value.trim();

  if (text === '') {
    alert('Please write a message before sending.');
    return;
  }

  // Find the currently open conversation
  let convo = null;
  for (let i = 0; i < conversations.length; i++) {
    if (conversations[i].id === activeConvoId) {
      convo = conversations[i];
    }
  }

  if (convo === null) {
    return;
  }

  // Add the new message to the conversation's message list
  let newMessage = {
    from: myUsername,
    text: text,
    time: 'Just now'
  };
  convo.messages.push(newMessage);

  // Clear the text box
  textArea.value = '';

  // Re-render the thread so the new message appears
  openConversation(activeConvoId);
}

// Allow the user to press Enter to send (Shift+Enter adds a new line)
document.getElementById('replyText').addEventListener('keypress', function(event) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendReply();
  }
});

// Wire up the Send button
document.getElementById('sendBtn').addEventListener('click', function() {
  sendReply();
});

// Check if the user had dark mode turned on and apply it
let savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  document.documentElement.setAttribute('data-theme', 'dark');
}

// Wire logout button
document.querySelector('.sidebar-logout').addEventListener('click', function() {
  localStorage.removeItem('ub_session');
  window.location.href = 'Homepage.html';
});

// Build the conversation list when the page first loads
renderConvoList();
