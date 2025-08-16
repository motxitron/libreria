import React, { useState, useEffect } from   'react';
 import API_URL from './config';
 import './EditBookModal.css'; // You'll need to create this CSS file

 function EditBookModal({ book, onSave, onClose}) {
   const [title, setTitle] = useState(book.title);
   const [author, setAuthor] = useState(book.author);
   const [category, setCategory] = useState(book.category);
   const [description, setDescription] = useState(book.description || '');
   const [rating, setRating] = useState(book.rating || '');
   const [hoverRating, setHoverRating] = useState(0);
   const [isRead, setIsRead] = useState(book.is_read || false);
   const [error, setError] = useState('');
   const [loading, setLoading] = useState(false
 );

   useEffect(() => {
     setTitle(book.title);
     setAuthor(book.author);
     setCategory(book.category);
     setDescription(book.description || '');
     setRating(book.rating || '');
     setIsRead(book.is_read || false);
   }, [book]);

   const handleSubmit = async (e) => {
     e.preventDefault();
     setError('');
     setLoading(true);
	 
	 console.log('handleSubmit called');
	 
	 console.log('API_URL:', API_URL);
	 console.log('book.id:', book.id);
	 console.log('Fecth URL:', `${API_URL}/books/${book.id}`);
	 console.log('Request Body:', JSON.stringify({title, author, category }));

     try {
       const response = await fetch(`${API_URL}/books/${book.id}`, {
         method: 'PUT',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({
           title,
           author,
           category,
           description,
           rating: isRead ? (parseFloat(rating) || null) : null, // Send rating only if isRead is true
           is_read: isRead
         }),
       });

       if (response.ok) {
         const updatedBook = await response.json ();
         onSave(updatedBook); // Pass the updated book back to the parent
       } else {
         const errorData = await response.json ();
         setError(errorData.detail || 'Error al actualizar el libro.');
       }
     } catch (err) {
       setError('Error de conexión al actualizar el libro.');
     } finally {
       setLoading(false);
     }
   };

   return (
     <div className="modal-overlay">
       <div className="modal-content">
         <h2>Editar Libro</h2>
         <form onSubmit={handleSubmit}>
           <div className="form-group">
             <label htmlFor="title">Título:</label>
             <input
               type="text"
               id="title"
               value={title}
               onChange={(e) => setTitle(e.target.value)}
               required
             />
           </div>
           <div className="form-group">
             <label htmlFor="author">Autor:</label>
             <input
               type="text"
               id="author"
               value={author}
               onChange={(e) => setAuthor(e.target.value)}
               required
             />
           </div>
           <div className="form-group">
             <label htmlFor="category">Categoría:</label>
             <input
               type="text"
               id="category"
               value={category}
               onChange={(e) => setCategory(e.target.value)}
               required
             />
           </div>
           <div className="form-group checkbox-group">
             <input
               type="checkbox"
               id="isRead"
               checked={isRead}
               onChange={(e) => {
                 const checked = e.target.checked;
                 setIsRead(checked);
                 if (!checked) {
                   setRating(null); // Set rating to null if not read
                 }
               }}
             />
             <label htmlFor="isRead">He leído este libro</label>
           </div>
           <div className="form-group">
             <label htmlFor="description">Descripción:</label>
             <textarea
               id="description"
               value={description}
               onChange={(e) => setDescription(e.target.value)}
               rows="4"
               placeholder="Introduce una breve descripción del libro..."
             ></textarea>
           </div>
           <div className="form-group">
             <label htmlFor="rating">Valoración (0-10):</label>
             <div className="star-rating" style={{ pointerEvents: isRead ? 'auto' : 'none', opacity: isRead ? 1 : 0.5 }}>
               {[...Array(11)].map((_, index) => {
                 const starValue = index;
                 return (
                   <span
                     key={starValue}
                     className={`star ${starValue <= (hoverRating || rating) ? 'filled' : ''}`}
                     onClick={() => isRead && setRating(starValue)}
                     onMouseEnter={() => isRead && setHoverRating(starValue)}
                     onMouseLeave={() => isRead && setHoverRating(0)}
                   >
                     ★
                   </span>
                 );
               })}
             </div>
             {rating > 0 && <span className="selected-rating-value">{rating}/10</span>}
           </div>
           {error && <p className="error-message">{error}</p>}
           <div className="modal-actions">
             <button type="submit" disabled={loading}>
			 {loading ? 'Guardando...' : 'Guardar Cambios'}
             </button>
             <button type="button" onClick={onClose} disabled={loading}>
               Cancelar
             </button>
           </div>
         </form>
       </div>
     </div>
   );
 }

 export default EditBookModal;