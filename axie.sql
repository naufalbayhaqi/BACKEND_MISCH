-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 16, 2022 at 07:35 PM
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
  `tenant` varchar(255) DEFAULT NULL,
  `alias` varchar(255) DEFAULT NULL,
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

INSERT INTO `scholar` (`id`, `nama`, `tenant`, `alias`, `tgllahir`, `gender`, `email`, `nowa`, `earningrating`, `addressronin`, `scholarpshare`, `ownerpshare`, `managerpshare`, `createdAt`, `updatedAt`, `mmr`, `ingameslp`, `lastclaim`, `nextclaim`, `average`) VALUES
(8, 'tes', 'tes', 'a', '2022-01-15', 'Male', 'a@b.cd', '123', NULL, '0x2ada618bdfa72398721ab0e8fb6620875eb23703', 50, 50, 0, '2022-01-15', '2022-01-15', 1203, 812, '2022-01-10', '2022-01-24', '115.86'),
(9, 'Tes', 'tes', 'ABC', '2022-01-15', 'Male', 'tot@markotot.gmail', 'asd', NULL, '0x335a277d86f8731f3bcb46ead044342b6a9532db', 75, 25, 0, '2022-01-15', '2022-01-15', 1074, 859, '2022-01-10', '2022-01-24', '122.71'),
(10, 'a', 'tos', 'b', '2022-01-15', 'Male', 's@d.nc', '123', NULL, '0xe4e62a3ffdb6963ae2ac3b98355926dbc9043a7a', 25, 75, 0, '2022-01-15', '2022-01-15', 1156, 886, '2022-01-09', '2022-01-23', '110.63');

-- --------------------------------------------------------

--
-- Table structure for table `slp`
--

CREATE TABLE `slp` (
  `date` date DEFAULT NULL,
  `daily` int(11) DEFAULT NULL,
  `akumulasi` int(11) DEFAULT NULL,
  `tenant` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `slp`
--

INSERT INTO `slp` (`date`, `daily`, `akumulasi`, `tenant`) VALUES
('2022-01-15', 100, 100, 'memek'),
('2022-01-15', 150, 150, 'kontol'),
('2022-01-16', 151, 151, 'kontol'),
('2022-01-16', 150, 150, 'memek'),
('2022-01-17', 155, 155, 'memek'),
('2022-01-17', 165, 165, 'kontol');

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
