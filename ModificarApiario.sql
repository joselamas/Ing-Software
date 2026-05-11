-- 1. Agregar campo tipo_flora
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('apiario') AND name = 'tipo_flora')
BEGIN
    ALTER TABLE apiario ADD tipo_flora nvarchar(100) NULL;
END

-- 2. Agregar capacidad_maxima con su valor por defecto
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('apiario') AND name = 'capacidad_maxima')
BEGIN
    ALTER TABLE apiario ADD capacidad_maxima int NOT NULL CONSTRAINT DF_apiario_capacidad DEFAULT 20;
END

-- 3. Agregar fecha_creacion con la fecha actual por defecto
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('apiario') AND name = 'fecha_creacion')
BEGIN
    ALTER TABLE apiario ADD fecha_creacion datetime NOT NULL CONSTRAINT DF_apiario_fecha DEFAULT GETDATE();
END

-- 4. Agregar descripcion_acceso
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('apiario') AND name = 'descripcion_acceso')
BEGIN
    ALTER TABLE apiario ADD descripcion_acceso nvarchar(max) NULL;
END

PRINT 'Tabla [apiario] actualizada exitosamente sin pérdida de datos.';