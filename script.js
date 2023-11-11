document.addEventListener('DOMContentLoaded', () => {
  const authSection = document.getElementById('auth-section');
  const journalSection = document.getElementById('journal-section');
  const userInfo = document.getElementById('user-info');

  const journalForm = document.getElementById('journal-form');
  const entriesList = document.getElementById('entries-list');
  let editEntryId = null;
  let currentUser = null;
  let users = []; // Declare and initialize the 'users' array

  function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
      currentUser = user;
      showJournalSection();
    } else {
      alert('Invalid credentials');
    }
  }

  function signup() {
    const newUsername = document.getElementById('new-username').value;
    const newPassword = document.getElementById('new-password').value;

    if (users.some(u => u.username === newUsername)) {
      alert('Username is already taken');
      return;
    }

    const newUser = { username: newUsername, password: newPassword, journals: [] };
    users.push(newUser);
    currentUser = newUser;

    showJournalSection();
  }

  function showJournalSection() {
    authSection.style.display = 'none';
    journalSection.style.display = 'block';
    userInfo.innerHTML = `<p>Welcome, ${currentUser.username}!</p><button id="logout-button">Logout</button>`;
    document.getElementById('logout-button').addEventListener('click', logout);
    loadEntries();
    displayEntries();
  }

  function logout() {
    authSection.style.display = 'block';
    journalSection.style.display = 'none';
    userInfo.innerHTML = '';
    currentUser = null;
  }

  journalForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const entryTitle = document.getElementById('entry-title').value;
    const entryContent = document.getElementById('entry-content').value;
    if (editEntryId !== null) {
      currentUser.journals[editEntryId].title = entryTitle;
      currentUser.journals[editEntryId].content = entryContent;
      editEntryId = null;
    } else {
      const entry = { title: entryTitle, content: entryContent };
      currentUser.journals.push(entry);
    }
    saveEntries();
    displayEntries();
    clearForm();
  });

  function saveEntries() {
    try {
      localStorage.setItem('users', JSON.stringify(users));
    } catch (error) {
      console.error('Error saving users to local storage:', error);
    }
  }

  function loadEntries() {
    try {
      const storedUsers = localStorage.getItem('users');
      if (storedUsers) {
        users = JSON.parse(storedUsers);
        currentUser = users.find(u => u.username === currentUser?.username) || null;
      }
    } catch (error) {
      console.error('Error loading users from local storage:', error);
    }
  }

  function displayEntries() {
    entriesList.innerHTML = '';
    currentUser?.journals.forEach((entry, index) => {
      const li = createEntryElement(entry.title, entry.content, index);
      entriesList.appendChild(li);
    });
  }

  function createEntryElement(title, content, index) {
    const li = document.createElement('li');
    const titleElement = document.createElement('h3');
    const contentElement = document.createElement('p');
    const editButton = document.createElement('button');
    const deleteButton = document.createElement('button');

    titleElement.textContent = title;
    contentElement.textContent = content;
    editButton.textContent = 'Edit';
    deleteButton.textContent = 'Delete';

    editButton.addEventListener('click', () => {
      editEntryId = index;
      const entryToEdit = currentUser.journals[index];
      document.getElementById('entry-title').value = entryToEdit.title;
      document.getElementById('entry-content').value = entryToEdit.content;
    });

    deleteButton.addEventListener('click', () => {
      const confirmation = window.confirm('Are you sure you want to delete this entry?');
      if (confirmation) {
        currentUser.journals.splice(index, 1);
        saveEntries();
        displayEntries();
        clearForm();
      }
    });

    li.appendChild(titleElement);
    li.appendChild(contentElement);
    li.appendChild(editButton);
    li.appendChild(deleteButton);

    return li;
  }

  function clearForm() {
    document.getElementById('entry-title').value = '';
    document.getElementById('entry-content').value = '';
    editEntryId = null;
  }

  document.getElementById('login-button').addEventListener('click', login);
  document.getElementById('signup-button').addEventListener('click', signup);

  // Load entries and display on initial page load
  loadEntries();
  displayEntries();
});
