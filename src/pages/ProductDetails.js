import React, { useContext, useState, useEffect } from 'react';
import { CartContext } from '../context/CartContext';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Features from '../components/Features';
import ImageCarousel from '../components/ImageCarousel';
import RelatedProducts from '../components/RelatedProducts';
import Specifications from '../components/Specifications';
import SocialShare from '../components/SocialShare';
import { FiShoppingCart, FiHeart } from 'react-icons/fi';
import { formatPrice } from '../utils/formatPrice';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [cantidad, setCantidad] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_URL}/api/products/${id}`);
        if (!res.ok) throw new Error('Producto no encontrado.');
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <div className="text-center mt-8">Cargando detalles del producto...</div>;
  if (error) return <div className="text-center text-red-500 mt-8">{error}</div>;
  if (!product) return null;


  const handleAddToCart = async () => {
    if (cantidad < 1) {
      setError('La cantidad debe ser al menos 1.');
      return;
    }

    try {
      await addToCart(product, cantidad);
      toast.success('Producto agregado al carrito', { toastId: `add-${product.id}` });
      navigate('/cart');
    } catch (err) {
      setError('Error al agregar el producto al carrito.');
    }
  };

  if (error) return <div className="container mx-auto p-4 text-red-500">{error}</div>;
  if (!product) return <div className="container mx-auto p-4 flex justify-center items-center">Cargando...</div>;


  const getStockStatus = (stock) => {
    if (stock > 20) {
      return {
        text: 'En Stock',
        className: 'bg-green-100 text-green-800'
      };
    } else if (stock > 0) {
      return {
        text: `Bajo Stock: ${stock} unidades`,
        className: 'bg-yellow-100 text-yellow-800'
      };
    }
    return {
      text: 'Agotado',
      className: 'bg-red-100 text-red-800'
    };
  };


  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
          {/* Image gallery */}
          <div className="flex flex-col">
            <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden">
              <img
                src={`${API_URL}/${product.imagenes[selectedImage]}`}
                alt={product.nombre}
                className="w-full h-full object-center object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            {/* Image selector */}
            <div className="mt-4 grid grid-cols-4 gap-2">
              {product.imagenes.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative rounded-md overflow-hidden ${selectedImage === index ? 'ring-2 ring-indigo-500' : ''
                    }`}
                >
                  <img
                    src={`${API_URL}/${image}`}
                    alt={`Vista ${index + 1}`}
                    className="w-full h-16 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product info */}
          <div className="mt-10 lg:mt-0 lg:ml-8">
            <h1 className="text-3xl font-bold text-gray-900">{product.nombre}</h1>
            <div className="mt-4">
              <p className="text-3xl text-gray-900">{formatPrice(product.precio)}</p>
              {/* Stock status */}
              <div className="mt-4">
                <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStockStatus(product.cantidadEnStock).className}`}>
                  {getStockStatus(product.cantidadEnStock).text}
                </span>
              </div>
            </div>

            {/* Quantity selector */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cantidad
              </label>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                  className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 hover:bg-indigo-100 transition-colors duration-200"
                >
                  -
                </button>
                <span className="w-16 text-center font-medium text-gray-700">{cantidad}</span>
                <button
                  onClick={() => setCantidad(Math.min(product.cantidadEnStock, cantidad + 1))}
                  className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 hover:bg-indigo-100 transition-colors duration-200"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to cart button */}
            <div className="mt-8 flex space-x-4">
              <button
                onClick={() => addToCart(product, cantidad)}
                className="flex-1 bg-indigo-600 py-3 px-8 rounded-md text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center justify-center"
              >
                <FiShoppingCart className="w-5 h-5 mr-2" />
                Agregar al Carrito
              </button>
              <button className="p-3 rounded-md border border-gray-300 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <FiHeart className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Social Share */}
            <div className="mt-8 border-t pt-8">
              <p className="text-sm text-gray-600 mb-4">Compartir este producto:</p>
              <SocialShare product={product} />
            </div>
          </div>
        </div>

        {/* Product description */}
        <div className="mt-16">
          <div className="border-t border-gray-200 pt-10">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Descripción del Producto</h3>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <p className="text-gray-600 leading-relaxed">{product.descripcion}</p>
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="mt-6">
          <div className=" border-gray-200 pt-10">
            <Specifications specs={product.especificaciones} />
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-6 border-t border-gray-200 pt-10">
        <RelatedProducts categoriaId={product.categoriaId} currentProductId={product.id} />
        </div>

        {/* Features */}
        <div className="mt-6">
          <Features />
        </div>
      </div>
    </div>

  );
}

export default ProductDetails;
