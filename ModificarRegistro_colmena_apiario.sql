IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('registro_colmena_apiario') AND name = 'acronimo_usr')
BEGIN
    ALTER TABLE registro_colmena_apiario ADD acronimo_usr NVARCHAR(50);
END

-- 2. Agregar campo activo (para trazabilidad de movimientos vigentes)
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('registro_colmena_apiario') AND name = 'activo')
BEGIN
    ALTER TABLE registro_colmena_apiario ADD activo BIT CONSTRAINT DF_registro_activo DEFAULT 1;
END