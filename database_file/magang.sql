-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 23, 2022 at 01:29 PM
-- Server version: 10.4.13-MariaDB
-- PHP Version: 7.4.7

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `magang`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `createdAt`, `updatedAt`) VALUES
(1, 'Elektronik', '2022-07-23 11:53:00', '2022-07-23 11:53:00'),
(2, 'Fashion Pria', '2022-07-23 11:53:00', '2022-07-23 11:53:00'),
(3, 'Fashion Wanita', '2022-07-23 11:53:44', '2022-07-23 11:53:44'),
(4, 'Handphone & Tablet', '2022-07-23 11:53:44', '2022-07-23 11:53:44'),
(5, 'Olahraga', '2022-07-23 11:53:44', '2022-07-23 11:53:44');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `Category_id` int(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `price` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `Category_id`, `name`, `slug`, `price`, `createdAt`, `updatedAt`) VALUES
(2, 1, 'Logitech H111 Headset Stereo Single Jack 3.5mm', 'Logitech-H111-Headset-Stereo-Single-Jack-3.5mm', 80000, '2022-07-23 04:57:48', '2022-07-23 04:57:48'),
(3, 1, 'Philips Rice Cooker - Inner Pot 2L Bakuhanseki - HD3110/33 ', 'Philips-Rice-Cooker---Inner-Pot-2L-Bakuhanseki---HD3110/33 ', 249000, '2022-07-23 05:01:51', '2022-07-23 05:01:51'),
(4, 4, 'Iphone 12 64Gb/128Gb/256Gb Garansi Resmi IBOX/TAM - Hitam, 64Gb ', 'Iphone-12-64Gb/128Gb/256Gb-Garansi-Resmi-IBOX/TAM---Hitam,-64Gb ', 11340000, '2022-07-23 05:02:47', '2022-07-23 05:02:47'),
(5, 5, 'Papan alat bantu Push Up Rack Board Fitness Workout Gym', 'Papan-alat-bantu-Push-Up-Rack-Board-Fitness-Workout-Gym', 90000, '2022-07-23 05:03:17', '2022-07-23 05:03:17'),
(6, 2, 'Jim Joker - Sandal Slide Kulit Pria Bold 2S Hitam - Hitam ', 'Jim-Joker---Sandal-Slide-Kulit-Pria-Bold-2S-Hitam---Hitam ', 305000, '2022-07-23 05:03:38', '2022-07-23 05:03:38');

-- --------------------------------------------------------

--
-- Table structure for table `products_assets`
--

CREATE TABLE `products_assets` (
  `id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `sequelizemeta`
--

CREATE TABLE `sequelizemeta` (
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `sequelizemeta`
--

INSERT INTO `sequelizemeta` (`name`) VALUES
('20220723034344-create-categories.js'),
('20220723035122-create-products.js'),
('20220723035316-create-products-assets.js');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Category_id` (`Category_id`);

--
-- Indexes for table `products_assets`
--
ALTER TABLE `products_assets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `sequelizemeta`
--
ALTER TABLE `sequelizemeta`
  ADD PRIMARY KEY (`name`),
  ADD UNIQUE KEY `name` (`name`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `products_assets`
--
ALTER TABLE `products_assets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`Category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `products_assets`
--
ALTER TABLE `products_assets`
  ADD CONSTRAINT `products_assets_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
