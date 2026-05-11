-- 1. Tabla Usuario (Usa acronimo como PK según tu imagen)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'usuario')
BEGIN
    CREATE TABLE dbo.usuario (
        acronimo nvarchar(10) NOT NULL PRIMARY KEY,
        clave nvarchar(255) NOT NULL,
        nombre nvarchar(50) NOT NULL,
        apellido nvarchar(50) NOT NULL,
        correo nvarchar(100) NOT NULL,
        telefono nvarchar(40) NOT NULL,
        localidad_asociada nvarchar(250) NOT NULL,
        permiso int NOT NULL,
        activo bit NOT NULL
    );
END;

-- 2. Tabla Apiario
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'apiario')
BEGIN
    CREATE TABLE dbo.apiario (
        id int IDENTITY(1,1) NOT NULL PRIMARY KEY,
        acronimo_usuario nvarchar(10) NOT NULL,
        nombre_referencia nvarchar(50) NOT NULL,
        coordenadas nvarchar(50) NOT NULL,
        msnm int NOT NULL,
        activo bit NOT NULL,
        tipo_flora nvarchar(100) NULL,
        capacidad_maxima int NOT NULL,
        fecha_creacion datetime NOT NULL,
        descripcion_acceso nvarchar(MAX) NULL
    );
END;

-- 3. Tabla Colmena
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'colmena')
BEGIN
    CREATE TABLE dbo.colmena (
        id int IDENTITY(1,1) NOT NULL PRIMARY KEY,
        usuario_acronimo nvarchar(10) NOT NULL,
        fecha_inicio date NOT NULL,
        es_enjambre bit NOT NULL,
        id_colmena_madre int NULL,
        activo bit NOT NULL,
        tipo_colmena nvarchar(100) NULL,
        fecha_inicio_reina datetime NULL,
        estado varchar(50) NULL,
        id_colmena_usuario nvarchar(50) NULL
    );
END;

-- 4. Tabla Registro Colmena Apiario (Tabla intermedia/histórica)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'registro_colmena_apiario')
BEGIN
    CREATE TABLE dbo.registro_colmena_apiario (
        id int IDENTITY(1,1) NOT NULL PRIMARY KEY,
        colmena_id int NOT NULL,
        apiario_id int NOT NULL,
        fecha_entrada date NOT NULL,
        fecha_salida date NULL,
        acronimo_usr nvarchar(50) NULL,
        activo bit NULL
    );
END;

-- 5. Tabla Control Alimentacion
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'control_alimentacion')
BEGIN
    CREATE TABLE dbo.control_alimentacion (
        id int IDENTITY(1,1) NOT NULL PRIMARY KEY,
        colmena_id int NOT NULL,
        fecha date NOT NULL,
        tipo_suministro varchar(50) NULL,
        detalle_mezcla nvarchar(20) NULL,
        cantidad decimal(10, 2) NULL,
        precio_total_insumo decimal(18, 2) NULL,
        observaciones nvarchar(MAX) NULL,
        fecha_registro_sistema datetime NULL
    );
END;

-- 6. Tabla Produccion Cosecha
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'produccion_cosecha')
BEGIN
    CREATE TABLE dbo.produccion_cosecha (
        id int IDENTITY(1,1) NOT NULL PRIMARY KEY,
        colmena_id int NOT NULL,
        fecha date NOT NULL,
        tipo_producto nvarchar(20) NOT NULL,
        tipo_origen nvarchar(20) NOT NULL,
        descripcion_flora nvarchar(100) NULL,
        cantidad_kg decimal(10, 2) NOT NULL,
        precio_aprox_kg decimal(18, 2) NOT NULL,
        fecha_registro_sistema datetime NULL
    );
END;