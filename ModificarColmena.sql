-- 1. Agregar campo tipo_flora
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('colmena') AND name = 'tipo_colmena')
BEGIN
    ALTER TABLE colmena ADD tipo_colmena nvarchar(100) NULL;
END



PRINT 'Tabla [colmena] actualizada exitosamente sin pérdida de datos.';