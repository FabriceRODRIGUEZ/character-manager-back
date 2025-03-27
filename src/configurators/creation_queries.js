export const users_creation = `CREATE TABLE Users (
    username VARCHAR(20),
    email VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(20) NOT NULL,
    visibility VARCHAR(7) NOT NULL DEFAULT 'private',
    
    CONSTRAINT pk_users PRIMARY KEY(username),
    CONSTRAINT ck_users_visibility CHECK(visibility = 'private' OR visibility = 'public')
)`

export const characters_creation = `CREATE TABLE Characters (
    id SERIAL,
    owner VARCHAR(20),
    first_name VARCHAR(20) NOT NULL,
    last_name VARCHAR(20),
    gender CHAR(1) NOT NULL DEFAULT 'M',
    work TEXT NOT NULL,
    actor VARCHAR(50),
    voice_actor VARCHAR(50),
    profile TEXT,
    comment TEXT,
    appreciation INTEGER NOT NULL DEFAULT 1,
    
    CONSTRAINT pk_characters PRIMARY KEY(id),
    CONSTRAINT fk_characters FOREIGN KEY(owner) REFERENCES Users(username),
    CONSTRAINT uq_characters UNIQUE(owner, first_name, last_name, work),
    CONSTRAINT ck_characters_gender CHECK(gender = 'M' OR gender = 'F'),
    CONSTRAINT ck_characters_appreciation CHECK(appreciation IN (1, 2, 3))
)`