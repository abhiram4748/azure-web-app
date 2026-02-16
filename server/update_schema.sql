-- Ensure Cart table exists
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Cart' AND xtype='U')
CREATE TABLE Cart (
    id INT IDENTITY(1,1) PRIMARY KEY,
    userId NVARCHAR(128) NOT NULL, -- Firebase UID
    productId INT FOREIGN KEY REFERENCES Products(id),
    quantity INT NOT NULL,
    created_at DATETIME2 DEFAULT GETDATE()
);

-- Add size column to Cart if not exists
IF NOT EXISTS(SELECT * FROM sys.columns WHERE Name = N'size' AND Object_ID = Object_ID(N'Cart'))
BEGIN
    ALTER TABLE Cart ADD size NVARCHAR(10);
END

-- Add stock column to ProductSizes if not exists
IF NOT EXISTS(SELECT * FROM sys.columns WHERE Name = N'stock' AND Object_ID = Object_ID(N'ProductSizes'))
BEGIN
    ALTER TABLE ProductSizes ADD stock INT DEFAULT 0;
END

-- Add size column to OrderItems if not exists
IF NOT EXISTS(SELECT * FROM sys.columns WHERE Name = N'size' AND Object_ID = Object_ID(N'OrderItems'))
BEGIN
    ALTER TABLE OrderItems ADD size NVARCHAR(10);
END

-- Clear existing ProductSizes to avoid duplicates when re-seeding
DELETE FROM ProductSizes;

-- Seed ProductSizes for all products with S, M, L, XL and 100 stock
INSERT INTO ProductSizes (product_id, size, stock)
SELECT id, 'S', 100 FROM Products
UNION ALL
SELECT id, 'M', 100 FROM Products
UNION ALL
SELECT id, 'L', 100 FROM Products
UNION ALL
SELECT id, 'XL', 100 FROM Products;

-- Update Products table to ensure they are "in stock" if there's a flag (optional, but good practice if logic depends on it)
-- (Assuming no specific 'in_stock' column on Products based on database.sql, but usually stock is checked via ProductSizes now)
