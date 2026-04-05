// La URL base centralizada. Si mañana se sube el backend a un servidor real, solo se cambia aquí.
const BASE_URL = 'https://localhost:7153/api';

export const apiService = {
    // Servicio para obtener los apiarios
    obtenerApiarios: async (usr) => {
        const url = usr 
            ? `${BASE_URL}/Apiario/list?usuarioAcronimo=${usr.acronimo}`
            : `${BASE_URL}/Apiario/list`;
            
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Error al conectar con la base de datos de Apiarios');
        }
        return await response.json();
    },

    // Servicio para insertar una colmena
    insertarColmena: async (nuevaColmena) => {
        const response = await fetch(`${BASE_URL}/Colmena/insert`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevaColmena)
        });

        if (!response.ok) {
            throw new Error('Error al registrar la colmena en la base de datos.');
        }
        return response;
    },

    // Servicio para buscar colmenas
    obtenerColmenas: async (usr) => {
        const url = usr 
            ? `${BASE_URL}/Colmena/list?usuarioAcronimo=${usr.acronimo}`
            : `${BASE_URL}/Colmena/list`;

        const response = await fetch(url);
        if (!response.ok) throw new Error('Error al conectar con la base de datos de Beekeeper');
        return await response.json();
    },

    // Servicio para desactivar una colmena
    desactivarColmena: async (id) => {
        const response = await fetch(`${BASE_URL}/Colmena/desactivate/${id}`, {
            method: 'PUT' 
        });

        if (!response.ok) {
            throw new Error('No se pudo desactivar la colmena.');
        }
        return response;
    }
};