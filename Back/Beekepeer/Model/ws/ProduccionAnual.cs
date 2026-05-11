namespace Beekepeer.Model.ws
{
    public class ProduccionAnual
    {
        public int Anio { get; set; }

        // --- SECCIÓN MIEL ---
        public float MielKg { get; set; }
        public float JarabeKg { get; set; } // Suministro líquido
        public float MielValor { get; set; } // Ingreso estimado por miel
        public float JarabeValor { get; set; } // Costo del jarabe
        public float RelacionNetaMiel { get; set; } // Eficiencia biológica (MielKg / JarabeKg)
        public float RelacionEconomicaMiel { get; set; } // ROI Miel (MielValor / JarabeValor)

        // --- SECCIÓN POLEN ---
        public float PolenKg { get; set; }
        public float TortaKg { get; set; } // Suministro sólido
        public float PolenValor { get; set; } // Ingreso estimado por polen
        public float TortaValor { get; set; } // Costo de la torta
        public float RelacionNetaPolen { get; set; } // Eficiencia biológica (PolenKg / TortaKg)
        public float RelacionEconomicaPolen { get; set; } // ROI Polen (PolenValor / TortaValor)
    }
}