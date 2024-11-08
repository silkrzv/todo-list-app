-- Create the "permalist" database
CREATE DATABASE permalist;

-- Create the "items" table with the required columns
CREATE TABLE items (
    id SERIAL PRIMARY KEY,         
    title VARCHAR(255) NOT NULL,   
    category VARCHAR(100) NOT NULL 
);
