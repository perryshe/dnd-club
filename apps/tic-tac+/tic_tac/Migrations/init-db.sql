CREATE TABLE IF NOT EXISTS "__EFMigrationsHistory" (
    "MigrationId" character varying(150) NOT NULL,
    "ProductVersion" character varying(32) NOT NULL,
    CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY ("MigrationId")
);

START TRANSACTION;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260611060720_InitialCreate') THEN
    CREATE TABLE games (
        "Id" uuid NOT NULL,
        "Board" jsonb NOT NULL,
        "State" text NOT NULL,
        "GameType" text NOT NULL,
        "PlayerXId" uuid,
        "PlayerOId" uuid,
        CONSTRAINT "PK_games" PRIMARY KEY ("Id")
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260611060720_InitialCreate') THEN
    CREATE TABLE users (
        "Id" uuid NOT NULL,
        "Login" character varying(50) NOT NULL,
        "Password" text NOT NULL,
        CONSTRAINT "PK_users" PRIMARY KEY ("Id")
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260611060720_InitialCreate') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20260611060720_InitialCreate', '9.0.1');
    END IF;
END $EF$;
COMMIT;

