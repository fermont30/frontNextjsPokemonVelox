"use client";
import React, { useState, useEffect } from "react";
import pokeApi from "@/app/api/pokeApi";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";
import { Tipo, Pokemon } from "@/app/api/pokemon.interface";
import EditTipoModal from "@/app/components/EditTipoModal";

const Edit = () => {
  const { id } = useParams();
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [tiposDisponibles, setTiposDisponibles] = useState<Tipo[]>([]);
  const [imagenActual, setImagenActual] = useState("");
  const [nuevaImagen, setNuevaImagen] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchPokemonData = async () => {
      try {
        const pokemonResponse = await pokeApi.get<Pokemon>(`/pokemon/${id}`);
        const { nombre, imagen_url } = pokemonResponse.data;

        setNombre(nombre);
        setImagenActual(imagen_url || "");

        const tiposResponse = await pokeApi.get<Tipo[]>("/pokemon/tipos");
        setTiposDisponibles(tiposResponse.data);
      } catch (error) {
        console.error("Error cargando datos:", error);
        toast.error("Error al cargar los datos del Pokémon");
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    fetchPokemonData();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!nombre) {
      toast.error("El nombre es requerido");
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append("nombre", nombre);
    if (nuevaImagen) formData.append("imagen", nuevaImagen);

    try {
      await pokeApi.patch(`/pokemon/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Pokémon actualizado exitosamente!");
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al actualizar Pokémon");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTipoUpdated = () => {
    router.push("/");
  };

  if (loading) return <div className="text-white">Cargando datos...</div>;

  return (
    <>
      <div className="mt-22 max-w-2xl mx-auto p-6 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-yellow-300 mb-6">
          Editar Pokémon
        </h2>

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
            {imagenActual && (
              <div className="mb-4">
                <p className="text-white/60 mb-2">Imagen actual:</p>
                <img
                  src={imagenActual}
                  alt={`Imagen de ${nombre}`}
                  className="h-32 object-contain rounded"
                />
              </div>
            )}
            <input
              type="file"
              onChange={(e) => setNuevaImagen(e.target.files?.[0] || null)}
              className="block w-full text-sm text-white/80 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-yellow-400/20 file:text-yellow-300 hover:file:bg-yellow-400/30"
              accept="image/*"
            />
            <p className="text-white/60 mt-1 text-sm">
              {nuevaImagen
                ? `Nueva imagen seleccionada: ${nuevaImagen.name}`
                : "Selecciona una nueva imagen (opcional)"}
            </p>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.push("/pokemon")}
              className="px-6 py-2 text-white bg-gray-600 rounded-md hover:bg-gray-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 text-black bg-yellow-400 rounded-md hover:bg-yellow-300 disabled:opacity-50"
            >
              {isSubmitting ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>

      <EditTipoModal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        pokemonId={Number(id)}
        tiposDisponibles={tiposDisponibles}
        onTipoUpdated={handleTipoUpdated}
      />
    </>
  );
};

export default Edit;
