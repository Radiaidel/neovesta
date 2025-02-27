CREATE TABLE users (
                       id UUID PRIMARY KEY,
                       email VARCHAR(255) NOT NULL UNIQUE,
                       password VARCHAR(255) NOT NULL,
                       first_name VARCHAR(255),
                       last_name VARCHAR(255),
                       phone_number VARCHAR(255),
                       role VARCHAR(50) NOT NULL,
                       created_at TIMESTAMP NOT NULL,
                       updated_at TIMESTAMP,
                       status BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE super_admins (
    id UUID PRIMARY KEY REFERENCES users(id)
);

CREATE TABLE admins (
    id UUID PRIMARY KEY REFERENCES users(id)
);

CREATE TABLE residence_managers (
                                    id UUID PRIMARY KEY REFERENCES users(id),
                                    residence_id UUID
);

CREATE TABLE sub_residence_managers (
                                        id UUID PRIMARY KEY REFERENCES users(id),
                                        residence_manager_id UUID REFERENCES residence_managers(id)
);

CREATE TABLE refresh_tokens (
                                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                                user_id UUID NOT NULL REFERENCES users(id),
                                token VARCHAR(255) NOT NULL UNIQUE,
                                expiry_date TIMESTAMP NOT NULL,
                                revoked BOOLEAN NOT NULL DEFAULT false,
                                CONSTRAINT fk_refresh_token_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE password_reset_tokens (
                                       id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                                       user_id UUID NOT NULL REFERENCES users(id),
                                       token VARCHAR(255) NOT NULL UNIQUE,
                                       expiry_date TIMESTAMP NOT NULL,
                                       used BOOLEAN NOT NULL DEFAULT false,
                                       CONSTRAINT fk_password_reset_user FOREIGN KEY (user_id) REFERENCES users(id)
);