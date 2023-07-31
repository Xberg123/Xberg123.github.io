document.addEventListener('DOMContentLoaded', () => {
  const journalForm = document.getElementById('journal-form');
  const entriesList = document.getElementById('entries-list');
  let editEntryId = null;
  let entries = [];

  journalForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const entryTitle = document.getElementById('entry-title').value;
    const entryContent = document.getElementById('entry-content').value;
    if (editEntryId !== null) {
      // Editing an existing entry
      entries[editEntryId].title = entryTitle;
      entries[editEntryId].content = entryContent;
      editEntryId = null;
    } else {
      // Creating a new entry
      const entry = { title: entryTitle, content: entryContent };
      entries.push(entry);
    }
    saveEntries();
    displayEntries();
    journalForm.reset();
  });

  function saveEntries() {
    localStorage.setItem('entries', JSON.stringify(entries));
  }

  function loadEntries() {
    const storedEntries = localStorage.getItem('entries');
    if (storedEntries) {
      entries = JSON.parse(storedEntries);
    }
  }

  function displayEntries() {
    entriesList.innerHTML = '';
    entries.forEach((entry, index) => {
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
      const entryToEdit = entries[index];
      document.getElementById('entry-title').value = entryToEdit.title;
      document.getElementById('entry-content').value = entryToEdit.content;
    });

    deleteButton.addEventListener('click', () => {
      entries.splice(index, 1);
      saveEntries();
      displayEntries();
    });

    li.appendChild(titleElement);
    li.appendChild(contentElement);
    li.appendChild(editButton);
    li.appendChild(deleteButton);

    return li;
  }

  loadEntries();
  displayEntries();
});
