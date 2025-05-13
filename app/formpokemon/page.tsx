"use client";

import React, { useState, useEffect } from 'react';
import pokeApi from '../api/pokeApi';
import toast from 'react-hot-toast';
import AddTipoModal from '../components/AddTipoModal';
import { useRouter } from 'next/navigation';

interface Tipo {
  id: number;
  nombre: string;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
      code?: string;
    };
  };
}

const AddPokemonForm = () => {
  const [nombre, setNombre] = useState('');
  const [tiposDisponibles, setTiposDisponibles] = useState<Tipo[]>([]);
  const [imagen, setImagen] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [createdPokemonId, setCreatedPokemonId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchTipos = async () => {
      try {
        const response = await pokeApi.get('/pokemon/tipos');
        setTiposDisponibles(response.data);
      } catch (error) {
        console.error("Error cargando tipos:", error);
        toast.error('Error al cargar tipos');
      } finally {
        setLoading(false);
      }
    };

    fetchTipos();
  }, []);

  function isApiError(error: unknown): error is ApiError {
    if (typeof error !== 'object' || error === null) {
      return false;
    }

    const apiError = error as ApiError;
    return (
      'response' in apiError &&
      apiError.response !== undefined &&
      apiError.response !== null &&
      'data' in apiError.response &&
      apiError.response.data !== undefined
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre) {
      toast.error('El nombre es requerido');
      return;
    }
    if (!imagen) {
      toast.error('La imagen es requerida');
      return;
    }

    if (imagen) {
      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validImageTypes.includes(imagen.type)) {
        toast.error('Solo se admiten archivos de imagen (JPEG, PNG, GIF, WEBP)');
        return;
      }
    }

    const formData = new FormData();
    formData.append('nombre', nombre);
    if (imagen) formData.append('imagen', imagen);

    try {
      const response = await pokeApi.post('/pokemon', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('Pokémon creado exitosamente!');
      setCreatedPokemonId(response.data.id);
      setIsModalOpen(true);

      setNombre('');
      setImagen(null);
    } catch (error) {
      console.error("Error:", error);
      if (isApiError(error)) {
        const apiError = error as ApiError;
        if (apiError.response?.data?.message) {
          toast.error(apiError.response.data.message);
        } else if (apiError.response?.data?.code === 'ER_DUP_ENTRY') {
          toast.error('El Pokémon ya existe en la base de datos');
        } else {
          toast.error('Error al crear Pokémon');
        }
      } else {
        toast.error('Error al crear Pokémon');
      }
    }
  };

  const handleTipoAdded = () => {
    setCreatedPokemonId(null);
    router.push('/');
  };

  if (loading) return <div className="text-white">Cargando tipos...</div>;

  return (
    <>
      <div className="mt-30 max-w-2xl mx-auto p-6 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-yellow-300 mb-6">Nuevo Pokémon</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white/80 mb-2">Nombre:</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded focus:ring-2 focus:ring-yellow-300"
              required
            />
          </div>
          <div>
            <label className="block text-white/80 mb-2">Imagen:</label>
            <input
              type="file"
              onChange={(e) => setImagen(e.target.files?.[0] || null)}
              className="block w-full text-sm text-white/80 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-yellow-400/20 file:text-yellow-300 hover:file:bg-yellow-400/30"
              accept="image/*"
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="px-6 py-2 text-white bg-gray-600 rounded-md hover:bg-gray-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-black bg-yellow-400 rounded-md hover:bg-yellow-300 disabled:opacity-50"
            >
              Nuevo Pokémon
            </button>
          </div>
        </form>
      </div>

      {createdPokemonId && (
        <AddTipoModal
          isOpen={isModalOpen}
          closeModal={() => setIsModalOpen(false)}
          pokemonId={createdPokemonId}
          tiposDisponibles={tiposDisponibles}
          onTipoAdded={handleTipoAdded}
        />
      )}
    </>
  );
};

export default AddPokemonForm;
