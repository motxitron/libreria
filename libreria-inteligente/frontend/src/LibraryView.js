import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import API_URL from './config';
import './LibraryView.css';
import EditBookModal from './EditBookModal'; 

// Hook personalizado para debounce
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
};

// Componente para la portada (con fallback a genérica)
const BookCover = ({ src, alt, title }) => {
  const [hasError, setHasError] = useState(false);
  useEffect(() => { setHasError(false); }, [src]);
  const handleError = () => { setHasError(true); };

  if (hasError || !src) {
    const initial = title ? title[0].toUpperCase() : '?';
    return (
      <div className="generic-cover">
        <span className="generic-cover-initial">{initial}</span>
      </div>
    );
  }
  return <img src={src} alt={alt} className="book-cover" onError={handleError} />;
};

function LibraryView() {
  const [books, setBooks] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false); // New state for mobile detection
  const [showEditModal, setShowEditModal] = useState(false); // New state for modal visibility
  const [bookToEdit, setBookToEdit] = useState(null);
  const [languages, setLanguages] = useState([]);
  const [kindleStatus, setKindleStatus] = useState({}); // Para el estado de envío a Kindle

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await fetch(`${API_URL}/languages/`);
        if (response.ok) {
          const data = await response.json();
          setLanguages(data);
        }
      } catch (error) {
        console.error("Error fetching languages:", error);
      }
    };
    fetchLanguages();
  }, []);

  // Effect to detect mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Adjust breakpoint as needed
    };

    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleAuthorClick = (author) => {
    setSearchTerm(''); // Clear general search term
    setSearchParams({ author: author }); // Use 'author' parameter
  };

  const handleCategoryClick = (category) => {
    setSearchParams({ category: category });
  };

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    setError('');

    const params = new URLSearchParams();
    const category = searchParams.get('category');
    const author = searchParams.get('author');
    const language = searchParams.get('language');

    if (category) {
      params.append('category', category);
    }
    if (author) {
      params.append('author', author);
    }
    if (language) {
      params.append('language', language);
    } else if (debouncedSearchTerm) {
      params.append('search', debouncedSearchTerm);
    }

    const url = `${API_URL}/books/?${params.toString()}`;

    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setBooks(data);
      } else {
        setError('No se pudieron cargar los libros.');
      }
    } catch (err) {
      setError('Error de conexión al cargar la biblioteca.');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchTerm, searchParams]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleDeleteBook = async (bookId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este libro?')) {
      try {
        const response = await fetch(`${API_URL}/books/${bookId}`, { method: 'DELETE' });
        if (response.ok) {
          setBooks(prevBooks => prevBooks.filter(b => b.id !== bookId));
        } else {
          alert('No se pudo eliminar el libro.');
        }
      } catch (err) {
        alert('Error de conexión al intentar eliminar el libro.');
      }
    }
  };

  const handleSendToKindle = async (bookId, title) => {
    if (kindleStatus[bookId] === 'Enviando...') return;

    if (!window.confirm(`¿Estás seguro de que quieres enviar "${title}" a tu Kindle?`)) {
      return;
    }
    
    setKindleStatus(prev => ({ ...prev, [bookId]: 'Enviando...' }));

    try {
      const response = await fetch(`${API_URL}/books/${bookId}/send-to-kindle`, { method: 'POST' });
      const result = await response.json();
      if (response.ok) {
        setKindleStatus(prev => ({ ...prev, [bookId]: '¡Enviado con éxito!' }));
      } else {
        setKindleStatus(prev => ({ ...prev, [bookId]: `Error: ${result.detail}` }));
      }
    } catch (err) {
      setKindleStatus(prev => ({ ...prev, [bookId]: 'Error de conexión.' }));
    }

    setTimeout(() => {
      setKindleStatus(prev => {
        const newStatus = { ...prev };
        delete newStatus[bookId];
        return newStatus;
      });
    }, 6000);
  };

  const handleEditClick = (book) => {
    setBookToEdit(book);
    setShowEditModal(true);
  };

  const handleUpdateBook = (updatedBook) => {
    setBooks(prevBooks => prevBooks.map(book =>
      book.id === updatedBook.id ? updatedBook : book
    ));
    setShowEditModal(false);
    setBookToEdit(null);
  };

  return (
    <div className="library-container">
      <h2>Mi Biblioteca</h2>

      <div className="controls-container">
        <input
          type="text"
          placeholder="Buscar por título, autor o categoría..."
          className="search-bar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="language-filter"
          onChange={(e) => setSearchParams({ language: e.target.value })}
          value={searchParams.get('language') || ''}
        >
          <option value="">Todos los idiomas</option>
          {languages.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="error-message">{error}</p>}
      {loading && <p>Cargando libros...</p>}
      {!loading && books.length === 0 && !error && <p>No se encontraron libros que coincidan con tu búsqueda.</p>}

      <div className="book-grid">
        {books.map((book) => (
          <div key={book.id} className="book-card">
            <div className="card-top-icons">
                <div className="card-top-left">
                    {book.is_read && <span className="is-read-icon" title="Leído">Leído</span>}
                </div>
                <div className="card-top-right">
                    <button onClick={() => handleDeleteBook(book.id)} className="delete-book-btn" title="Eliminar libro">×</button>
                </div>
            </div>
            <BookCover
              src={book.cover_image_url ? `${API_URL}/${book.cover_image_url}` : ''}
              alt={`Portada de ${book.title}`}
              title={book.title}
            />
            <div className="book-card-info">
              <h3>{book.title}</h3>
              <p className="clickable-text" onClick={() => handleAuthorClick(book.author)}>{book.author}</p>
              <span className="clickable-text" onClick={() => handleCategoryClick(book.category)}>{book.category}</span>
              {book.language && <p className="book-language">{book.language}</p>}
              {book.description && <p className="book-description">{book.description}</p>}
              {book.rating !== null && book.rating !== undefined && <p className="book-rating">Valoración: {book.rating}/10</p>}
            </div>
            <div className="book-card-actions">
                <button onClick={() => handleEditClick(book)} className="card-action-button edit-book-button-bottom">Editar libro</button>
                {book.file_path.toLowerCase().endsWith('.pdf') ? (
                  <>
                    <a
                      href={`${API_URL}/books/download/${book.id}`}
                      className="card-action-button download-button"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Abrir PDF
                    </a>
                    {isMobile && ( // Conditionally render download button for mobile
                      <a
                        href={`${API_URL}/books/download/${book.id}`}
                        className="card-action-button download-button"
                        download // This attribute suggests download
                      >
                        Descargar PDF
                      </a>
                    )}
                  </>
                ) : (
                  <>
                    <Link to={`/leer/${book.id}`} className="card-action-button download-button">Leer EPUB</Link>
                    <button 
                      onClick={() => handleSendToKindle(book.id, book.title)} 
                      className="card-action-button kindle-button"
                      disabled={kindleStatus[book.id] === 'Enviando...'}
                    >
                      {kindleStatus[book.id] === 'Enviando...' ? 'Enviando...' : 'Enviar a Kindle'}
                    </button>
                    {isMobile && ( // Conditionally render download button for mobile
                      <a
                        href={`${API_URL}/books/download/${book.id}`}
                        className="card-action-button download-button"
                        download // This attribute suggests download
                      >Descargar EPUB</a>
                    )}
                    {kindleStatus[book.id] && <p className="kindle-status-message">{kindleStatus[book.id]}</p>}
                  </>
                )}
            </div>
          </div>
        ))}
      </div>

      {showEditModal && (
        <EditBookModal
          book={bookToEdit}
          onSave={handleUpdateBook}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </div>
  );
}

export default LibraryView;