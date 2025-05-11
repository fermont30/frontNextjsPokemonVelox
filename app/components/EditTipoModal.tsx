"use client";
import { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import toast from 'react-hot-toast';
import pokeApi from '../api/pokeApi';

interface Tipo {
  id: number;
  nombre: string;
}

interface EditTipoModal {
  isOpen: boolean;
  closeModal: () => void;
  pokemonId: number;
  tiposDisponibles: Tipo[];
  onTipoUpdated: () => void;
}

export default function EditTipoModal({
  isOpen,
  closeModal,
  pokemonId,
  tiposDisponibles,
  onTipoUpdated,
}: EditTipoModal) {
  const [selectedTipos, setSelectedTipos] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchPokemonTipos = async () => {
      try {
        const response = await pokeApi.get<{ tipos: Tipo[] }>(`/pokemon/${pokemonId}`);
        setSelectedTipos(response.data.tipos.map(tipo => tipo.id));
      } catch (error) {
        console.error("Error cargando tipos del Pokémon:", error);
        toast.error('Error al cargar los tipos del Pokémon');
      }
    };

    if (isOpen) {
      fetchPokemonTipos();
    }
  }, [isOpen, pokemonId]);

  const handleTipoChange = (tipoId: number) => {
    setSelectedTipos(prev =>
      prev.includes(tipoId)
        ? prev.filter(id => id !== tipoId)
        : [...prev, tipoId]
    );
  };

  const handleSubmit = async () => {
    if (selectedTipos.length === 0) {
      toast.error('Selecciona al menos un tipo');
      return;
    }

    setIsSubmitting(true);
    try {
      await pokeApi.patch(`/pokemon/${pokemonId}`, {
        tipos: selectedTipos,
      });
      toast.success('Tipos actualizados correctamente');
      onTipoUpdated();
      closeModal();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al actualizar tipos');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-75" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-yellow-300"
                >
                  Actualizar Tipos del Pokémon
                </Dialog.Title>

                <div className="mt-4">
                  <div className="grid grid-cols-2 gap-3">
                    {tiposDisponibles.map(tipo => (
                      <label key={tipo.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedTipos.includes(tipo.id)}
                          onChange={() => handleTipoChange(tipo.id)}
                          className="h-5 w-5 text-yellow-400 rounded focus:ring-yellow-300"
                        />
                        <span className="text-white/80 capitalize">{tipo.nombre}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-500"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="px-4 py-2 text-sm font-medium text-black bg-yellow-400 rounded-md hover:bg-yellow-300 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Actualizando...' : 'Actualizar Tipos'}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
