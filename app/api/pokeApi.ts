import axios from 'axios';
import { Pokemon } from './pokemon.interface';

const pokeApi = axios.create({
  baseURL: 'https://pokemonveloxback-production.up.railway.app', 
});

export const fetchPokemons = async (): Promise<Pokemon[]> => {
  const response = await pokeApi.get('/pokemon');
  return response.data;
};

export const fetchPokemon = async (id: string | number): Promise<Pokemon> => {
  const response = await pokeApi.get(`/pokemon/${id}`);
  return response.data;
};

export default pokeApi;