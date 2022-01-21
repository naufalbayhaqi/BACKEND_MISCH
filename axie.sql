-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 21, 2022 at 12:25 PM
-- Server version: 10.4.21-MariaDB
-- PHP Version: 8.0.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `axie`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `nama` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `nowa` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `id` int(11) NOT NULL,
  `createdAt` date DEFAULT NULL,
  `updatedAt` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `formscholar`
--

CREATE TABLE `formscholar` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `createdAt` date DEFAULT NULL,
  `updatedAt` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `scholar`
--

CREATE TABLE `scholar` (
  `id` int(11) NOT NULL,
  `nama` varchar(255) DEFAULT NULL,
  `alias` varchar(255) DEFAULT NULL,
  `tenantId` int(11) NOT NULL,
  `tgllahir` date DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `nowa` varchar(255) DEFAULT NULL,
  `earningrating` varchar(255) DEFAULT NULL,
  `addressronin` varchar(255) DEFAULT NULL,
  `scholarpshare` int(11) DEFAULT NULL,
  `ownerpshare` int(11) DEFAULT NULL,
  `managerpshare` int(11) DEFAULT NULL,
  `createdAt` date DEFAULT NULL,
  `updatedAt` date DEFAULT NULL,
  `mmr` int(11) DEFAULT NULL,
  `ingameslp` int(11) DEFAULT NULL,
  `lastclaim` date DEFAULT NULL,
  `nextclaim` date DEFAULT NULL,
  `average` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `scholar`
--

INSERT INTO `scholar` (`id`, `nama`, `alias`, `tenantId`, `tgllahir`, `gender`, `email`, `nowa`, `earningrating`, `addressronin`, `scholarpshare`, `ownerpshare`, `managerpshare`, `createdAt`, `updatedAt`, `mmr`, `ingameslp`, `lastclaim`, `nextclaim`, `average`) VALUES
(7, '[value-2]', '[value-3]', 4, '0000-00-00', '[value-6]', '[value-7]', '[value-8]', 'high', 'ronin:2ada618bdfa72398721ab0e8fb6620875eb23703', 0, 0, 0, '0000-00-00', '2022-01-21', 1119, 1318, '2022-01-10', '2022-01-24', '109.83');

-- --------------------------------------------------------

--
-- Table structure for table `slp`
--

CREATE TABLE `slp` (
  `id` int(11) NOT NULL,
  `date` date DEFAULT NULL,
  `daily` int(11) DEFAULT NULL,
  `akumulasi` int(11) DEFAULT NULL,
  `tenantId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `slp`
--

INSERT INTO `slp` (`id`, `date`, `daily`, `akumulasi`, `tenantId`) VALUES
(1, '2022-01-21', 1318, 1318, 4);

-- --------------------------------------------------------

--
-- Table structure for table `tenant`
--

CREATE TABLE `tenant` (
  `id` int(11) NOT NULL,
  `nama` varchar(255) NOT NULL,
  `low` int(255) NOT NULL,
  `med` int(255) NOT NULL,
  `high` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tenant`
--

INSERT INTO `tenant` (`id`, `nama`, `low`, `med`, `high`) VALUES
(4, 'a', 25, 50, 100);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `formscholar`
--
ALTER TABLE `formscholar`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `scholar`
--
ALTER TABLE `scholar`
  ADD PRIMARY KEY (`id`),
  ADD KEY `scholar_ibfk_1` (`tenantId`);

--
-- Indexes for table `slp`
--
ALTER TABLE `slp`
  ADD PRIMARY KEY (`id`),
  ADD KEY `slp_ibfk_1` (`tenantId`);

--
-- Indexes for table `tenant`
--
ALTER TABLE `tenant`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `formscholar`
--
ALTER TABLE `formscholar`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `scholar`
--
ALTER TABLE `scholar`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `slp`
--
ALTER TABLE `slp`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `tenant`
--
ALTER TABLE `tenant`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `scholar`
--
ALTER TABLE `scholar`
  ADD CONSTRAINT `scholar_ibfk_1` FOREIGN KEY (`tenantId`) REFERENCES `tenant` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `slp`
--
ALTER TABLE `slp`
  ADD CONSTRAINT `slp_ibfk_1` FOREIGN KEY (`tenantId`) REFERENCES `tenant` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
