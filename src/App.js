import "./App.css";
import React, { useState, useEffect } from 'react';

const API_URL = 'https://book-finder1.p.rapidapi.com/api/search';
const API_KEY = '4f9418fcb8mshc3b4b51ead58bc8p18c1cajsn4308719df641';

function App() {
  const [books, setBooks] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [page, setPage] = useState(1);
  const [reading, setReading] = useState(false);
  const [author, setAuthor] = useState('');
  const [title, setTitle] = useState('');
  const [buttonText, setButtonText] = useState('Dark Mode');
  const [showFavoritesMenu, setShowFavoritesMenu] = useState(false);
  const [button2Text, setButton2Text] = useState('Show Favorites');

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    setPage(page + 1);
  };

  const toggleColors = () => {
    setIsDarkMode(!isDarkMode);
    !isDarkMode ? setButtonText('Dark Mode') : setButtonText('Light Mode');
  };

  useEffect(() => {
    fetchBooks();
  }, [page, author, title]);
  
  const readText = (quote) => {
    let msg = new SpeechSynthesisUtterance();
    msg.text = quote;
    
    if (!reading) { 
      window.speechSynthesis.speak(msg);
      setReading(true);
    } else { 
      window.speechSynthesis.cancel();
      setReading(false);
    }
  };

  const handleNameSearch = (event) => {
    setTitle(event.target.value);
  }

  const handleAuthorSearch = (event) => {
    setAuthor(event.target.value);
  }

  const fetchBooks = async () => {
    let url = `${API_URL}?lexile_min=600&lexile_max=800&results_per_page=24&page=${page}`;
    
    if (author.trim() !== '') {
      url += `&author=${author}`;
    }
    
    if (title.trim() !== '') {
      url += `&title=${title}`;
    }

    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': 'book-finder1.p.rapidapi.com'
      }
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      console.log('Fetched data:', data);
      setBooks(data.results);
    } catch (error) {
      console.error(error);
    }
  };

  const toggleFavorite = (book) => {
    if (favorites.some(fav => fav.work_id === book.work_id)) {
      setFavorites(favorites.filter(fav => fav.work_id !== book.work_id));
    } else {
      setFavorites([...favorites, book]);
    }
  };

  const handleShowFavoritesMenu = () => {
    setShowFavoritesMenu(!showFavoritesMenu);
    if (!showFavoritesMenu) {
      setBooks(favorites);
      setButton2Text('Main Menu');
    } else {
      fetchBooks(); 
      setButton2Text('Show Favorites');
    }
  };

  return (
    <div className="mainBody" style={{ backgroundColor: isDarkMode ? 'white' : '#121315' }}>
      <div className='header' style={{ color: !isDarkMode ? 'white' : '#121315' }}>
        <div className="titleName">LibIT</div>
        <button className="button1" style={{ color: !isDarkMode ? 'white' : '#121315' }} onClick={toggleColors}>{buttonText}</button>

        <button className="button1" style={{ color: !isDarkMode ? 'white' : '#121315' }} onClick={handleShowFavoritesMenu}>{button2Text}</button>
        <div className="searchBarMain">
          <input className="searchBar" type="search" style={{color : !isDarkMode ? 'white' : '#121315' }} onChange={handleNameSearch} value={title} placeholder="Search by Name"/>
          <input className="searchBar" type="search" style={{color : !isDarkMode ? 'white' : '#121315' }} onChange={handleAuthorSearch} value={author} placeholder="Search by Author"/>
        </div>
      </div>

      <div className="bookCard" style={{ color: !isDarkMode ? 'white' : 'black' }}>
        {books && books.length > 0 ? (
          books
            .filter(book => book.published_works[0].isbn)
            .map(book => (
              <div key={book.work_id} className="bookCardBox">
                <h2>{book.title}</h2>
                <img
                  className="coverImg"
                  src={`https://s3.amazonaws.com/mm-static-media/books/cover-art/${book.published_works[0].isbn}.jpeg`}
                  alt={book.title }
                />
                <p>Author: {book.authors[0]}</p>
                <p>Published: {book.published_works[0].copyright}</p>
                {book.categories && book.categories.length >= 2 && (
                  <p className="summary">{book.categories[1]}</p>
                )}
                <p>{book.book_type ? "Genre :" + book.book_type : ''}</p>
                <button className="readBtn" onClick={() => readText(book.summary ? book.summary : "Summary not Found")}>
                  Read Summary
                </button>
                <button className="favoriteBtn" onClick={() => toggleFavorite(book)}>
                  {favorites.some(fav => fav.work_id === book.work_id) ? "Remove from Favorites" : "Add to Favorites"}
                </button>
              </div>
            ))
        ) : (
          <p>Loading...</p>
        )}
      </div>
     
      <div className="footer">
        <button className="btn1" type="button" style={{ color: !isDarkMode ? 'white' : '#121315' }} onClick={handlePreviousPage} disabled={page === 1}>PREVIOUS</button>
        <button className="btn1" type="button" style={{ color: !isDarkMode ? 'white' : '#121315' }} onClick={handleNextPage}>NEXT</button>
      </div>
    </div>
  );
}

export default App;