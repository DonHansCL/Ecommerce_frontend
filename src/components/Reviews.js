import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

function Reviews({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [comentario, setComentario] = useState('');
  const [calificacion, setCalificacion] = useState(5);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/products/${productId}/reviews`);
      if (!res.ok) throw new Error('Error al cargar las reseñas.');
      const data = await res.json();
      setReviews(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!comentario) {
      toast.error('El comentario no puede estar vacío.');
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ comentario, calificacion }),
      });
      if (!res.ok) throw new Error('Error al agregar la reseña.');
      const newReview = await res.json();
      setReviews([newReview, ...reviews]);
      setComentario('');
      setCalificacion(5);
      toast.success('Reseña agregada exitosamente.');
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">Reseñas de Clientes</h3>
      {/* Formulario para agregar reseña */}
      <form onSubmit={handleSubmitReview} className="mb-6">
        <textarea
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          placeholder="Escribe tu reseña aquí..."
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none"
          required
        ></textarea>
        <div className="flex items-center mt-2">
          <label className="mr-2">Calificación:</label>
          <select value={calificacion} onChange={(e) => setCalificacion(parseInt(e.target.value))} className="p-2 border border-gray-300 rounded-md">
            {[5,4,3,2,1].map((star) => (
              <option key={star} value={star}>{star} Estrellas</option>
            ))}
          </select>
          <button type="submit" className="ml-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
            Enviar
          </button>
        </div>
      </form>
      {/* Lista de reseñas */}
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <div key={review.id} className="mb-4 p-4 border border-gray-200 rounded-md">
            <div className="flex items-center mb-2">
              <span className="text-yellow-500 mr-2">{'★'.repeat(review.calificacion)}{'☆'.repeat(5 - review.calificacion)}</span>
              <span className="text-gray-700">{review.usuario.nombre}</span>
            </div>
            <p className="text-gray-600">{review.comentario}</p>
          </div>
        ))
      ) : (
        <p className="text-gray-600">No hay reseñas aún. ¡Sé el primero en reseñar este producto!</p>
      )}
    </div>
  );
}

export default Reviews;