import { useState, useEffect } from 'react';
// import { apiService } from '../../webService/WS_colmena';

export const useVerColmenas = (usr) => {
    const [colmenas, setColmenas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchColmenas = async () => {
            setCargando(true);
            try {
                // DATOS SIMULADOS (Mock Data) según los campos requeridos
                const mockData = [
                    {
                        id: 101,
                        apiario: "Apiario Central",
                        usuario_acronimo: usr?.acronimo || "USR",
                        fecha_inicio: "2023-10-15",
                        es_enjambre: true,
                        id_colmena_madre: null,
                        activo: true,
                        tipo_colmena: "Langstroth",
                        fecha_inicio_reina: null,
                        estado: "Crecimiento"
                    },
                    {
                        id: 102,
                        apiario: "Apiario Central",
                        usuario_acronimo: usr?.acronimo || "USR",
                        fecha_inicio: "2024-02-20",
                        es_enjambre: false,
                        id_colmena_madre: 101,
                        activo: true,
                        tipo_colmena: "Dadant",
                        fecha_inicio_reina: "2024-02-10",
                        estado: "Mantenimiento"
                    }
                ];

                // Simulación de delay de red
                await new Promise(resolve => setTimeout(resolve, 800));
                setColmenas(mockData);
                
                // Descomentar cuando el WS esté listo:
                // const data = await apiService.obtenerColmenas(usr);
                // setColmenas(data);
            } catch (err) {
                setError("Error al cargar el listado de colmenas.");
            } finally {
                setCargando(false);
            }
        };
        fetchColmenas();
    }, [usr]);

    return { colmenas, cargando, error };
};