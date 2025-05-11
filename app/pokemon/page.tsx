"use client";
import pokeApi from "@/app/api/pokeApi";
import { Pokemon } from "@/app/api/pokemon.interface";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

const PokemonPage = () => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    pokemonId: 0,
    pokemonName: "",
  });

  useEffect(() => {
    fetchPokemons();
  }, []);

  const fetchPokemons = async () => {
    try {
      const response = await pokeApi.get("/pokemon");
      setPokemons(response.data);
      setLoading(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An error occurred in the API"
      );
      setLoading(false);
    }
  };

  const openDeleteModal = (id: number, name: string) => {
    setDeleteModal({
      isOpen: true,
      pokemonId: id,
      pokemonName: name,
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      pokemonId: 0,
      pokemonName: "",
    });
  };

  const handleDelete = async () => {
    try {
      await pokeApi.delete(`/pokemon/${deleteModal.pokemonId}`);
      toast.success(`${deleteModal.pokemonName} eliminado correctamente`);
      setPokemons(pokemons.filter((p) => p.id !== deleteModal.pokemonId));
    } catch (err) {
      toast.error(`Error al eliminar ${deleteModal.pokemonName}`);
      console.error(err);
    } finally {
      closeDeleteModal();
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <section className="text-white/80 body-font">
        <div className="container px-5 py-24 mx-auto">
          <h1 className="text-3xl font-bold mb-8">Pokémon List</h1>
          <div className="flex flex-wrap -m-4">
            {pokemons.map((pokemon) => (
              <div
                key={pokemon.id}
                className="lg:w-1/4 md:w-1/2 p-4 w-full group relative"
              >
                <div className="block relative h-48 rounded overflow-hidden">
                  {pokemon.imagen_url && (
                    <img
                      alt={pokemon.nombre}
                      className="object-cover object-center w-full h-full block group-hover:opacity-75 transition-opacity"
                      src={pokemon.imagen_url}
                    />
                  )}
                </div>
                <div className="mt-4">
                  <Link href={`/pokemon/${pokemon.id}`} className="block">
                    <h2 className="text-white/80 title-font text-lg font-medium hover:text-yellow-300 transition-colors">
                      {pokemon.nombre}
                    </h2>
                    <p className="mt-1 text-yellow-300 title-font">
                      Tipo:{" "}
                      {pokemon.tipos.map((tipo) => tipo.nombre).join(", ")}
                    </p>
                    <button
                      className="absolute top-5 left-5 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-all shadow-lg hover:scale-110"
                      title="Ver Pokémon"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path
                          fillRule="evenodd"
                          d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </Link>

                  {/* Botón de Edición */}
                  <Link
                    href={`/pokemon/edit/${pokemon.id}`}
                    className="absolute top-5 right-16 p-2 bg-green-600 hover:bg-green-700 text-white rounded-full transition-all shadow-lg hover:scale-110"
                    title="Editar Pokémon"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </Link>

                  {/* Botón de Eliminar */}
                  <button
                    onClick={() => openDeleteModal(pokemon.id, pokemon.nombre)}
                    className="absolute top-5 right-5 p-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition-all shadow-lg hover:scale-110"
                    title="Eliminar Pokémon"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        closeModal={closeDeleteModal}
        onConfirm={handleDelete}
        pokemonName={deleteModal.pokemonName}
      />
    </>
  );
};

export default PokemonPage;
