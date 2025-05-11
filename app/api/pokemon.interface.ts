export interface Tipo {
  id: number;
  nombre: string;
}

export interface Pokemon {
  id: number;
  nombre: string;
  imagen_url: string;
  cloudinary_public_id: string;
  tipos: Tipo[];
}
