-- 1. Agregar campo tipo_flora
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('colmena') AND name = 'tipo_colmena')
BEGIN
    ALTER TABLE colmena ADD tipo_colmena nvarchar(100) NULL;
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('colmena') AND name = 'fecha_inicio_reina')
BEGIN
    -- Agregamos la columna. Usamos NULL inicialmente si ya tienes datos, 
    -- o DEFAULT GETDATE() si quieres que tome la fecha actual por defecto.
    ALTER TABLE colmena 
    ADD fecha_inicio_reina DATETIME NOT NULL 
    CONSTRAINT DF_colmena_fecha_reina DEFAULT GETDATE();
END
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('colmena') AND name = 'estado')
BEGIN
    ALTER TABLE colmena 
    ADD estado VARCHAR(50) NOT NULL 
    CONSTRAINT DF_colmena_estado DEFAULT 'Crecimiento';
END

ALTER TABLE colmena
ALTER COLUMN fecha_inicio_reina DATETIME NULL;

ALTER TABLE colmena
ALTER COLUMN id_colmena_madre INT NULL;
PRINT 'Tabla [colmena] actualizada exitosamente sin pérdida de datos.';

