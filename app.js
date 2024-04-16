firebase.initializeApp(firebaseConfig);

// Get a reference to the database service
const database = firebase.database();
const storage = firebase.storage();

// Add book to reading list
const addBookForm = document.getElementById('add-book-form');
addBookForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const title = document.getElementById('book-title').value;
    const author = document.getElementById('author-name').value;
    const genre = document.getElementById('genre').value;
    const coverImageFile = document.getElementById('cover-image').files[0];

    // Upload cover image to Firebase Storage
    const storageRef = storage.ref();
    const coverImageRef = storageRef.child('book_covers/' + coverImageFile.name);
    await coverImageRef.put(coverImageFile);
    const coverImageUrl = await coverImageRef.getDownloadURL();

    // Add book details to Firebase Realtime Database
    database.ref('reading_list').push({
        title: title,
        author: author,
        genre: genre,
        coverImageUrl: coverImageUrl
    });

    addBookForm.reset();
});

// Display reading list from Firebase Realtime Database
const readingListRef = database.ref('reading_list');
readingListRef.on('value', (snapshot) => {
    const readingListDiv = document.getElementById('reading-list');
    readingListDiv.innerHTML = '';

    snapshot.forEach((childSnapshot) => {
        const book = childSnapshot.val();
        const bookDiv = document.createElement('div');
        bookDiv.innerHTML = `
            <div class="book">
                <img src="${book.coverImageUrl}" alt="Book Cover">
                <h3>${book.title}</h3>
                <p>${book.author}</p>
                <p>${book.genre}</p>
            </div>
        `;
        readingListDiv.appendChild(bookDiv);
    });
});