-- Drop existing tables to ensure clean slate (in correct order due to FKs)
IF OBJECT_ID('OrderItems', 'U') IS NOT NULL DROP TABLE OrderItems;
IF OBJECT_ID('ProductSizes', 'U') IS NOT NULL DROP TABLE ProductSizes;
IF OBJECT_ID('Cart', 'U') IS NOT NULL DROP TABLE Cart;
IF OBJECT_ID('Orders', 'U') IS NOT NULL DROP TABLE Orders;
IF OBJECT_ID('Products', 'U') IS NOT NULL DROP TABLE Products;

-- Create Products Table
CREATE TABLE Products (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    category NVARCHAR(100),
    image_url NVARCHAR(MAX),
    description NVARCHAR(MAX),
    details NVARCHAR(MAX)
);

-- Insert Data (Original Products)
INSERT INTO Products (name, price, category, image_url, description, details)
VALUES 
('Charcoal Wool Overcoat', 1450, 'Outerwear', 'https://lh3.googleusercontent.com/aida-public/AB6AXuA1QKeY-H1fG5BcctyuHY5ZyYGj38IMAuCZK3wXI6tkcBp9DMT9iWlKiFPoVtlFKEkTi7hEssWC2f3_z3DrbcyCeGTjGPEA43XG6u18oZa1UdwM9PZ1B_ZzGv2e1PW7BaSlKJGfwHuCD5QJbfSHLxtFzsyXqanX96CZkwomjjd60yK8942iYkAf__jem6FmKzoizIzgmB99oK2CNPEau2CTUE_KtBkgzYzTh_FvdESj5M8jrsPONuYfm0e7rqQ8VNFhrnKObyLDhOZx', 'Minimalist wool overcoat in charcoal grey. Expertly tailored for a structured yet comfortable fit.', '100% Wool. Dry clean only. Imported.'),
('Pure Cashmere Mock Neck', 890, 'Knitwear', 'https://lh3.googleusercontent.com/aida-public/AB6AXuC1lN_YragHUnVuwjAeg4-Zh5R03hA_9tk3wLvKRdHquCaC8ZxytUCrnAm46xDgQBzZITXUl2bu4FmJJ1I5LLoBHxaBDVqZBzbH3hPdfHbXMexCdg7dxKgEOvE0uAEv1UAGDFmA3aG6Q54w13VM6x56USSHOrl0CBEzTFer4n_zXpBDPckw_posZIFHEwPQEzOvLTjrcm1-zNyIHVODRe9kH059C-9tdLy5bZbBzQUjFjV7NvAOYBBgPFXOzfNf0DWgwYOfLBMJwy89', 'Luxuriously soft pure cashmere mock neck sweater in a versatile beige hue.', '100% Cashmere. Hand wash cold or dry clean.'),
('Heritage Leather Boot', 650, 'Footwear', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWkV88s3Q2m5YV5pPTBow43pOfir0F-DXXYIX8V5Nv1-_Zm1-Niw-TW8ZLjgAPaE3hLXHWOFSF7bVWPW2x-Ndkqk5rnP8u7lTXzZONZA-9xAXLBfVTQWUR1wRoBsnyWtQBEMfnVHmd_3Vf4nMLSWePmDloJrAK28ekGTFP-51CnFOJlgf5R2-kIbhLKlDgpDrnFVsYy5hFVCWnQB_Gbpm4lYWogky9pGrtYsdFhv7y_b9z98U8H3OKoQ9mHk_XZdpKBjrVH1NzIaFp', 'Classic Chelsea boots crafted from premium leather with indefinite durability and style.', '100% Leather upper and sole. Handmade.'),
('Heavyweight Cotton Tee', 125, 'Essentials', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxYfaqFtonPEwNu8wL-GiYyiQ8dJ7Vl4IN7bAPN86GwDttcZ3xEmnbxrGmZqaV1YDjoS4KUxL6oHcK8TM2XCGkduUmLHYkw4-qRVBY47JD6qFy07j0bksbHd_KQNLqa6WeuZnqpgIJ8KYDPakGBMQrMQofmAYmGyiCsqIwQftmB8zBv_GeULZVuRrJaavMdZ7yUKk0HASpafyj1W57c_bml4wwfmQOLDMiVKKgQdCHLEbZQbwlr-nKeAXopZy5bzSt1lX_yZUQUKiT', 'A structured black cotton t-shirt that serves as the perfect foundation for any outfit.', '100% Heavyweight Cotton. Machine wash cold.'),
('Classic Trench Coat', 1800, 'Outerwear', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCvrD8KYzbmu515mwvxIus07026j0IiK2AStvdjKIC2raDFUh3LY6TtmKdkLuZ6op8rVixgJIpuePLH6lyGfOe2rCN2NCd7i3Swhh0oNlR4JZXC8fhW7ZvwYaz7otzNCcDZ7Z2eBcgXuuAepARhPDLjmsDYJgafB5GQ8YgOB07zKyEwJdoKqpe3RFSssGkchjEkBtPCSZHnI5GjgIXQSDV8Gnh9gjrsSDpAmX_K-9pZbE_hkZzqbRuJevwQ269mSa2h6jr7vghOl4zY', 'Double breasted beige trench coat. A timeless icon updated for the modern wardrobe.', 'Cotton Gabardine. Water-resistant. Dry clean.'),
('Silk Blend Knit Polo', 420, 'Knitwear', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCcaTO3fac833cGYSUgbsxW0SnS2Md7WCXegif_MFm0lyUinrxwBcuBSosi4DyLSHp4YwOyjCukjzFAiMQ0Rktk6JEH1rX-M5AiaEqmuMBBdNBWkNqSJoFsK1mABfy7UOS5TBqR3sSbcKSmRK4_S9MOoGL6VP-crX8OrIV0kNHgOL2jeN6XamTYN76j_eJPbA3Wsq5D5rEVgUbx2LRghAHQQK3PewaCJm9SAqN6YT3EGzMQ6FGmbZVDEr9NwDYRmakkR10DY3VS4fQV', 'Cream knit polo shirt made from a breathable silk blend. Perfect for transitional weather.', '60% Silk, 40% Cotton. Hand wash flat.'),
('Signature Silk Wrap Blouse', 450, 'Tops', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAYRp3CV33FYhoP87M38YC76pPQC0DOSvONA8F7i-vZArGNtJZC26xrm7E2npg91KJU8cis2Uec5hi_IyGPyWvQej-bps41BTlWBLNXgYVIHJWd4RSHiTCO-q_Ivg_1yPz99Tt3xRsvP5AvOHkk9gDsgTke41eRfHNtqF_ZnBl3kRYMCmOlpn-3RUcmluWXsXrD51WHuvwd3BXUvcu0vEXh3Eb6XswYR-aulZg10zAcl6pwGw9_9hcTjM1Ag4uGGdxaEswxuE-A7h27', 'Expertly crafted from 100% heavy-weight mulberry silk, this wrap blouse features an elegant draped neckline and elongated cuffs.', '100% Silk. Dry clean only. Iron on low heat.');

-- Create Orders Table
CREATE TABLE Orders (
    id INT IDENTITY(1,1) PRIMARY KEY,
    userId NVARCHAR(128) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status NVARCHAR(50) DEFAULT 'Pending',
    created_at DATETIME2 DEFAULT GETDATE()
);

-- Create OrderItems Table
CREATE TABLE OrderItems (
    id INT IDENTITY(1,1) PRIMARY KEY,
    order_id INT FOREIGN KEY REFERENCES Orders(id),
    productId INT FOREIGN KEY REFERENCES Products(id),
    size NVARCHAR(10),
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);

-- Create Cart Table
CREATE TABLE Cart (
    id INT IDENTITY(1,1) PRIMARY KEY,
    userId NVARCHAR(128) NOT NULL,
    productId INT FOREIGN KEY REFERENCES Products(id),
    size NVARCHAR(10),
    quantity INT NOT NULL
);

-- Create ProductSizes Table
CREATE TABLE ProductSizes (
    id INT IDENTITY(1,1) PRIMARY KEY,
    product_id INT FOREIGN KEY REFERENCES Products(id),
    size NVARCHAR(10) NOT NULL,
    stock INT DEFAULT 100
);

-- Seed ProductSizes (S, M, L, XL for all products)
INSERT INTO ProductSizes (product_id, size, stock)
SELECT id, 'S', 100 FROM Products
UNION ALL
SELECT id, 'M', 100 FROM Products
UNION ALL
SELECT id, 'L', 100 FROM Products
UNION ALL
SELECT id, 'XL', 100 FROM Products;
