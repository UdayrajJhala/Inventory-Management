CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);

INSERT INTO products (name, category, quantity, price) VALUES
('Apple iPhone 14', 'Electronics', 50, 999.99),
('Samsung Galaxy S23', 'Electronics', 30, 899.99),
('Nike Air Max', 'Footwear', 100, 149.99);