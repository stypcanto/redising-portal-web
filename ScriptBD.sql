
-- Seleccionar toda la tabla de CENATE
SELECT * FROM personal_cenate;
SELECT * FROM CENATE_CENTRO_ASIS;
SELECT * FROM CENATE_RED_ASIS;
SELECT * FROM CENATE_CENTRO_ASIS;
SELECT * FROM CENATE_MATERIAL;
SELECT * FROM CENATE_CPMS;

-- Ver la estructura de una tabla específica
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'personal_cenate';

-- Ver todos los esquemas de la base de datos
SELECT schema_name FROM information_schema.schemata;

DROP TABLE IF EXISTS CENATE_CENTRO_ASIS CASCADE;

CREATE TABLE CENATE_CENTRO_ASIS (
    COD_RED_ASIS VARCHAR(255) PRIMARY KEY, 
    DESCRIPCION VARCHAR(255), 
    COD_CENTRO_ASIS VARCHAR(255), 
    COD_UBIGEO VARCHAR(255)
);

ALTER TABLE CENATE_CENTRO_ASIS 
ADD CONSTRAINT unique_cod_centro UNIQUE (COD_CENTRO_ASIS);


CREATE TABLE CENATE_RED_ASIS (
    ID BIGINT PRIMARY KEY,  
    COD_RED_ASIS VARCHAR(255) NOT NULL, 
    DESCRIPCION VARCHAR(255), 
    PACS VARCHAR(255), 
    MICRORED VARCHAR(255),
    CONSTRAINT fk_cenate_red_asis FOREIGN KEY (COD_RED_ASIS) 
        REFERENCES CENATE_CENTRO_ASIS(COD_RED_ASIS) 
        ON UPDATE CASCADE ON DELETE SET NULL
);

ALTER TABLE CENATE_RED_ASIS DROP COLUMN PACS;


CREATE TABLE CENATE_MATERIAL (
    COD_MAT VARCHAR(50) PRIMARY KEY,  -- Código del material (ajusta el tamaño si es necesario)
    DESCR_MAT VARCHAR(255),  -- Descripción del material
    UND_ATE VARCHAR(50),  -- Unidad de atención
    COD_CENTRO_ASIS VARCHAR(255) NOT NULL,  -- Relacionado con CENATE_CENTRO_ASIS
    CONSTRAINT fk_material_centro FOREIGN KEY (COD_CENTRO_ASIS) 
        REFERENCES CENATE_CENTRO_ASIS(COD_CENTRO_ASIS) 
        ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE CENATE_CPMS (
    COD_GRUPO VARCHAR(50),  -- Código del grupo
    NOMBRE_GRUPO VARCHAR(255),  -- Nombre del grupo
    COD_SECCION VARCHAR(50),  -- Código de la sección
    NOMBRE_SECCION VARCHAR(255),  -- Nombre de la sección
    COD_SUBSECCION VARCHAR(50),  -- Código de la subsección
    NOMBRE_SUBSECCION VARCHAR(255),  -- Nombre de la subsección
    COD_PROCEDIMIENTO VARCHAR(50) PRIMARY KEY,  -- Código del procedimiento (clave primaria)
    DENOMINACION_PROCEDIMIENTO VARCHAR(255),  -- Denominación del procedimiento
    COD_CENTRO_ASIS VARCHAR(255) NOT NULL,  -- Relación con CENATE_CENTRO_ASIS
    CONSTRAINT fk_cpms_centro FOREIGN KEY (COD_CENTRO_ASIS) 
        REFERENCES CENATE_CENTRO_ASIS(COD_CENTRO_ASIS) 
        ON UPDATE CASCADE ON DELETE CASCADE
);

ALTER TABLE personal_cenate ADD COLUMN rol VARCHAR(20) NOT NULL DEFAULT 'Usuario';


-- Para cambiar el perfil manualmente
UPDATE personal_cenate 
SET rol = 'Superadmin' 
WHERE dni = '44914706';


SELECT dni, password FROM Personal_CENATE WHERE dni = '44914706';
UPDATE personal_cenate SET rol = 'Superadmin' WHERE dni = '44914706';


SELECT id, dni, nombres, rol FROM personal_cenate

SELECT id, nombres, apellido_paterno, apellido_materno, dni, rol FROM personal_cenate;
SELECT id, nombres, apellido_paterno, apellido_materno, dni, rol FROM personal_cenate;
