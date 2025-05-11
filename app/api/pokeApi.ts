import axios from 'axios';
import { Pokemon } from './pokemon.interface';

const pokeApi = axios.create({
   baseURL: 'https://pokemonveloxback-production.up.railway.app',
  // baseURL: 'http://localhost:3000'
});

pokeApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {   
    if (error.response && error.response.status === 400) {
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export const fetchPokemons = async (): Promise<Pokemon[]> => {
  const response = await pokeApi.get('/pokemon');
  return response.data;
};

export const fetchPokemon = async (id: string | number): Promise<Pokemon> => {
  const response = await pokeApi.get(`/pokemon/${id}`);
  return response.data;
};

export default pokeApi;
