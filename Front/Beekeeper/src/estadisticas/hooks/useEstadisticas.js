import { useState, useEffect } from 'react';

export const useEstadisticas = (usr) => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            // Datos harcodeados basados en los registros de producción y alimentación
            const data = {
                roi: {
                    ingresos: 12500, 
                    egresos: 4200,   
                    beneficio: 8300,
                    porcentaje: 197 
                },
                produccionTotal: {
                    miel: 850, 
                    polen: 120  
                },
                gastoTotal: {
                    liquido: 1250,
                    solido: 2950
                },
                rankingElite: Array.from({ length: 50 }, (_, i) => {
                    const apiarios = ["Pedregosa", "Mesa de los indios", "La Montaña", "La Loma", "El Mirador"];
                    const saludOpciones = ["Excelente", "Buena", "Regular"];
                    return {
                        id_colmena: `COL-${100 + i}`,
                        apiario: apiarios[i % apiarios.length],
                        msnm: 800 + (i * 30),
                        fechaInicio: `2023-0${(i % 9) + 1}-15`,
                        produccion: parseFloat((50 - (i * 0.8)).toFixed(1)),
                        salud: saludOpciones[i % 3]
                    };
                }),
                comparativaMeses: [
                    { mes: "Ene", miel: 40, polen: 15, liquido: 80, solido: 95 },
                    { mes: "Feb", miel: 55, polen: 18, liquido: 70, solido: 80 },
                    { mes: "Mar", miel: 85, polen: 25, liquido: 40, solido: 55 },
                    { mes: "Abr", miel: 120, polen: 35, liquido: 25, solido: 30 },
                    { mes: "May", miel: 155, polen: 45, liquido: 10, solido: 15 },
                    { mes: "Jun", miel: 140, polen: 40, liquido: 15, solido: 20 },
                    { mes: "Jul", miel: 115, polen: 30, liquido: 35, solido: 45 },
                    { mes: "Ago", miel: 95, polen: 25, liquido: 55, solido: 65 },
                    { mes: "Sep", miel: 135, polen: 42, liquido: 25, solido: 35 },
                    { mes: "Oct", miel: 165, polen: 50, liquido: 10, solido: 15 },
                    { mes: "Nov", miel: 105, polen: 32, liquido: 45, solido: 60 },
                    { mes: "Dic", miel: 55, polen: 18, liquido: 85, solido: 100 }
                ]
            };

            setTimeout(() => {
                setStats(data);
                setLoading(false);
            }, 800);
        };

        if (usr) fetchStats();
    }, [usr]);

    const formatMoneda = (val) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(val);
    };

    return { stats, loading, formatMoneda };
};