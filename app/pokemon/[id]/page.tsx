"use client";
import { fetchPokemon } from "@/app/api/pokeApi";
import { Pokemon } from "@/app/api/pokemon.interface";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const PokemonDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPokemonData = async () => {
      try {
        if (!params.id) {
          throw new Error("ID no proporcionado");
        }
        const id = Array.isArray(params.id) ? params.id[0] : params.id;

        const data = await fetchPokemon(id);
        setPokemon(data);
      } catch (err) {
        console.error("Error al obtener datos del Pokémon:", err);
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchPokemonData();
  }, [params.id]);

  if (loading) return <div className="text-white">Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!pokemon) return <div className="text-white">Pokémon no encontrado</div>;

  return (
    <div className="mt-30 max-w-4xl mx-auto p-4">
      <button
        onClick={() => router.back()}
        className="mb-6 px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-md transition-colors flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Volver
      </button>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <img
            src={pokemon.imagen_url}
            alt={pokemon.nombre}
            className="w-full max-w-md mx-auto"
          />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold capitalize mb-4">
            {pokemon.nombre}
          </h1>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Tipos:</h2>
            <div className="flex gap-2">
              {pokemon.tipos.map((tipo, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full"
                >
                  {tipo.nombre}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonDetailPage;