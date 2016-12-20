-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 20-12-2016 a las 20:55:58
-- Versión del servidor: 10.1.13-MariaDB
-- Versión de PHP: 5.6.23

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `pizzeria`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `locales`
--

CREATE TABLE `locales` (
  `id` int(10) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `direccion` varchar(100) NOT NULL,
  `tel` int(50) NOT NULL,
  `latitud` varchar(500) NOT NULL,
  `longitud` varchar(500) NOT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `locales`
--

INSERT INTO `locales` (`id`, `nombre`, `direccion`, `tel`, `latitud`, `longitud`, `estado`) VALUES
(1, 'Argenta Belgrano', 'Av cabildo 2572, caba', 45214488, '-34.5578315', '-58.4603841', 1),
(2, 'Argenta Nuñez', 'Av San Isidro 4456, caba', 45798467, '-34.5438606', '-58.47363630000001', 1),
(3, 'Argenta Villa Urquiza', 'Av Monroe 4647, caba', 48754986, '-34.571391', '-58.4813436', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `locales_fotos`
--

CREATE TABLE `locales_fotos` (
  `id` int(10) NOT NULL,
  `id_local` int(10) NOT NULL,
  `foto` varchar(500) NOT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `locales_fotos`
--

INSERT INTO `locales_fotos` (`id`, `id_local`, `foto`, `estado`) VALUES
(15, 1, '1-2016-12-10_22-52-35-0.jpeg', 1),
(16, 1, '1-2016-12-10_22-52-35-1.jpeg', 1),
(17, 1, '1-2016-12-10_22-52-35-2.jpeg', 1),
(18, 2, '2-2016-12-10_22-53-30-0.jpeg', 1),
(19, 2, '2-2016-12-10_22-53-30-1.jpeg', 1),
(20, 2, '2-2016-12-10_22-53-30-2.jpeg', 1),
(21, 3, '3-2016-12-10_22-53-43-0.jpeg', 1),
(22, 3, '3-2016-12-10_22-53-43-1.jpeg', 1),
(23, 3, '3-2016-12-10_22-53-43-2.jpeg', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `locales_plantilla`
--

CREATE TABLE `locales_plantilla` (
  `id` int(10) NOT NULL,
  `id_local` int(10) NOT NULL,
  `id_usuario` int(10) DEFAULT NULL,
  `id_rol` int(10) NOT NULL,
  `estado` tinyint(4) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `locales_plantilla`
--

INSERT INTO `locales_plantilla` (`id`, `id_local`, `id_usuario`, `id_rol`, `estado`) VALUES
(1, 1, 2, 2, 1),
(2, 1, 3, 3, 1),
(3, 1, 4, 3, 1),
(5, 2, 61, 2, 1),
(6, 3, 62, 2, 1),
(7, 2, 63, 3, 1),
(8, 2, 64, 3, 1),
(9, 3, 65, 3, 1),
(10, 3, 66, 3, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `locales_productos`
--

CREATE TABLE `locales_productos` (
  `id` int(10) NOT NULL,
  `id_local` int(10) NOT NULL,
  `descripcion` varchar(500) NOT NULL,
  `ingredientes` varchar(500) DEFAULT NULL,
  `precio` decimal(10,2) NOT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `locales_productos`
--

INSERT INTO `locales_productos` (`id`, `id_local`, `descripcion`, `ingredientes`, `precio`, `estado`) VALUES
(1, 1, 'Pizza Muzzarella', 'mozzarella, salsa tomate, aceitunas', '100.00', 1),
(2, 2, 'Pizza Muzzarella', 'mozzarella, salsa tomate, aceitunas', '100.00', 1),
(3, 3, 'Pizza Muzzarella', 'mozzarella, salsa tomate, aceitunas', '100.00', 1),
(4, 1, 'Pizza Fugazzeta', 'mozzarella, cebolla, ajo', '120.00', 1),
(5, 2, 'Pizza Fugazzeta', 'mozzarella, cebolla, ajo', '120.00', 1),
(6, 3, 'Pizza Fugazzeta', 'mozzarella, cebolla, ajo', '120.00', 1),
(7, 1, 'Pizza Napolitana', 'mozzarella, salsa tomate, tomates, aceitunas', '160.00', 1),
(8, 2, 'Pizza Napolitana', 'mozzarella, salsa tomate, tomates, aceitunas', '160.00', 1),
(9, 3, 'Pizza Napolitana', 'mozzarella, salsa tomate, tomates, aceitunas', '160.00', 1),
(10, 1, 'Porción de Fainá', 'garbanzos, aceite de oliva', '15.00', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `logins`
--

CREATE TABLE `logins` (
  `id` int(255) NOT NULL,
  `id_usuario` int(10) NOT NULL,
  `fecha` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `logins`
--

INSERT INTO `logins` (`id`, `id_usuario`, `fecha`) VALUES
(2, 1, '2016-12-14 23:50:02'),
(3, 2, '2016-12-14 23:50:24'),
(4, 2, '2016-12-14 23:56:12'),
(5, 2, '2016-12-15 00:04:14'),
(6, 2, '2016-12-15 00:06:28'),
(7, 1, '2016-12-15 00:09:19'),
(8, 1, '2016-12-15 00:10:28'),
(9, 2, '2016-12-15 00:10:36'),
(10, 2, '2016-12-15 00:18:26'),
(11, 2, '2016-12-15 00:20:15'),
(12, 1, '2016-12-15 00:20:26'),
(13, 1, '2016-12-15 00:21:04'),
(14, 1, '2016-12-15 00:22:21'),
(15, 1, '2016-12-15 00:23:25'),
(16, 2, '2016-12-15 00:23:59'),
(17, 2, '2016-12-15 00:27:04'),
(18, 2, '2016-12-15 00:29:08'),
(19, 2, '2016-12-15 00:31:25'),
(20, 1, '2016-12-15 00:31:31'),
(21, 3, '2016-12-15 00:31:40'),
(22, 1, '2016-12-15 00:36:25'),
(23, 2, '2016-12-15 00:36:30'),
(24, 3, '2016-12-15 00:36:41'),
(25, 3, '2016-12-15 00:37:40'),
(26, 3, '2016-12-15 00:38:03'),
(27, 1, '2016-12-15 00:38:10'),
(28, 3, '2016-12-15 00:38:21'),
(29, 2, '2016-12-15 00:41:53'),
(30, 3, '2016-12-15 00:42:01'),
(31, 1, '2016-12-15 00:48:33'),
(32, 2, '2016-12-15 00:48:40'),
(33, 3, '2016-12-15 00:48:46'),
(34, 3, '2016-12-15 00:50:13'),
(35, 2, '2016-12-15 00:50:52'),
(36, 3, '2016-12-15 00:52:52'),
(37, 2, '2016-12-15 00:53:00'),
(38, 1, '2016-12-15 00:55:39'),
(39, 2, '2016-12-15 00:55:44'),
(40, 3, '2016-12-15 00:55:51'),
(41, 3, '2016-12-15 00:56:58'),
(42, 2, '2016-12-15 00:57:12'),
(43, 1, '2016-12-15 00:57:24'),
(44, 3, '2016-12-15 00:58:19'),
(45, 2, '2016-12-15 00:58:27'),
(46, 3, '2016-12-15 00:58:49'),
(47, 1, '2016-12-15 01:03:35'),
(48, 1, '2016-12-15 01:04:21'),
(49, 2, '2016-12-15 01:04:30'),
(50, 3, '2016-12-15 01:04:40'),
(51, 60, '2016-12-15 01:13:40'),
(52, 2, '2016-12-15 01:18:24'),
(53, 60, '2016-12-15 01:18:58'),
(54, 60, '2016-12-15 01:22:48'),
(55, 60, '2016-12-15 01:23:41'),
(56, 60, '2016-12-15 01:24:59'),
(57, 1, '2016-12-15 01:32:29'),
(58, 1, '2016-12-15 01:33:49'),
(59, 1, '2016-12-15 01:34:41'),
(60, 1, '2016-12-15 01:35:04'),
(61, 1, '2016-12-15 01:36:25'),
(62, 1, '2016-12-15 01:37:58'),
(63, 1, '2016-12-15 01:38:53'),
(64, 1, '2016-12-15 01:41:11'),
(65, 1, '2016-12-15 01:41:33'),
(66, 1, '2016-12-15 01:42:35'),
(67, 1, '2016-12-15 01:45:46'),
(68, 1, '2016-12-15 01:46:11'),
(69, 1, '2016-12-15 01:46:40'),
(70, 1, '2016-12-15 01:47:31'),
(71, 1, '2016-12-15 01:49:34'),
(72, 60, '2016-12-15 01:50:29'),
(73, 60, '2016-12-15 01:53:03'),
(74, 1, '2016-12-15 01:53:54'),
(75, 2, '2016-12-15 01:54:00'),
(76, 3, '2016-12-15 01:55:46'),
(77, 60, '2016-12-15 01:56:05'),
(78, 60, '2016-12-15 01:59:07'),
(79, 2, '2016-12-15 01:59:48'),
(80, 1, '2016-12-15 02:00:11'),
(81, 2, '2016-12-15 02:05:54'),
(82, 1, '2016-12-15 02:06:01'),
(83, 1, '2016-12-15 02:11:47'),
(84, 1, '2016-12-15 02:12:25'),
(85, 1, '2016-12-15 02:38:07'),
(86, 1, '2016-12-15 02:40:09'),
(87, 1, '2016-12-15 02:41:15'),
(88, 1, '2016-12-15 02:42:38'),
(89, 1, '2016-12-15 02:43:25'),
(90, 1, '2016-12-15 02:50:28'),
(91, 1, '2016-12-15 02:51:08'),
(92, 1, '2016-12-15 02:52:05'),
(93, 1, '2016-12-15 02:58:45'),
(94, 1, '2016-12-15 02:59:18'),
(95, 1, '2016-12-15 14:33:04'),
(96, 1, '2016-12-15 14:49:34'),
(97, 1, '2016-12-15 14:50:43'),
(98, 1, '2016-12-15 14:51:06'),
(99, 1, '2016-12-15 14:51:59'),
(100, 1, '2016-12-15 14:52:36'),
(101, 1, '2016-12-15 14:53:55'),
(102, 1, '2016-12-15 14:54:22'),
(103, 1, '2016-12-15 15:05:13'),
(104, 1, '2016-12-15 15:14:16'),
(105, 1, '2016-12-15 15:50:08'),
(106, 1, '2016-12-15 15:53:20'),
(107, 1, '2016-12-15 15:56:36'),
(108, 1, '2016-12-15 15:57:17'),
(109, 1, '2016-12-15 15:59:58'),
(110, 1, '2016-12-15 16:01:55'),
(111, 1, '2016-12-15 16:05:46'),
(112, 1, '2016-12-15 16:06:07'),
(113, 1, '2016-12-15 16:06:37'),
(114, 1, '2016-12-15 16:08:45'),
(115, 1, '2016-12-15 16:12:12'),
(116, 1, '2016-12-15 16:12:54'),
(117, 1, '2016-12-15 16:14:34'),
(118, 1, '2016-12-15 16:16:04'),
(119, 1, '2016-12-15 16:16:35'),
(120, 1, '2016-12-15 16:17:58'),
(121, 1, '2016-12-15 16:20:00'),
(122, 1, '2016-12-15 16:26:39'),
(123, 1, '2016-12-15 16:27:27'),
(124, 1, '2016-12-15 16:27:39'),
(125, 1, '2016-12-15 16:28:13'),
(126, 1, '2016-12-15 16:28:38'),
(127, 1, '2016-12-15 16:29:11'),
(128, 1, '2016-12-15 16:29:26'),
(129, 1, '2016-12-15 16:30:40'),
(130, 1, '2016-12-15 16:39:29'),
(131, 1, '2016-12-15 16:40:21'),
(132, 1, '2016-12-15 16:40:52'),
(133, 1, '2016-12-15 16:43:50'),
(134, 1, '2016-12-15 16:59:14'),
(135, 1, '2016-12-15 16:59:51'),
(136, 1, '2016-12-15 17:00:39'),
(137, 1, '2016-12-15 17:01:45'),
(138, 1, '2016-12-15 17:02:52'),
(139, 1, '2016-12-15 17:03:57'),
(140, 1, '2016-12-15 17:04:27'),
(141, 1, '2016-12-15 17:06:26'),
(142, 1, '2016-12-15 17:07:15'),
(143, 61, '2016-12-15 17:08:54'),
(144, 62, '2016-12-15 17:09:14'),
(145, 63, '2016-12-15 17:09:27'),
(146, 60, '2016-12-15 17:10:17'),
(147, 1, '2016-12-15 17:10:29'),
(148, 61, '2016-12-15 17:10:43'),
(149, 2, '2016-12-15 17:12:51'),
(150, 61, '2016-12-15 17:13:06'),
(151, 61, '2016-12-15 17:20:16'),
(152, 61, '2016-12-15 17:22:16'),
(153, 2, '2016-12-15 17:23:45'),
(154, 62, '2016-12-15 17:26:16'),
(155, 61, '2016-12-15 17:29:22'),
(156, 61, '2016-12-15 17:29:41'),
(157, 61, '2016-12-15 17:31:38'),
(158, 61, '2016-12-15 17:36:13'),
(159, 60, '2016-12-15 17:36:30'),
(160, 61, '2016-12-15 17:37:23'),
(161, 63, '2016-12-15 17:38:04'),
(162, 3, '2016-12-15 17:38:59'),
(163, 4, '2016-12-15 17:39:23'),
(164, 1, '2016-12-15 17:40:07'),
(165, 64, '2016-12-15 17:41:51'),
(166, 62, '2016-12-15 17:43:36'),
(167, 65, '2016-12-15 17:44:02'),
(168, 66, '2016-12-15 17:47:07'),
(169, 60, '2016-12-15 17:48:42'),
(170, 1, '2016-12-15 19:34:13'),
(171, 2, '2016-12-15 19:34:51'),
(172, 2, '2016-12-15 19:37:16'),
(173, 1, '2016-12-15 19:41:03'),
(174, 1, '2016-12-15 19:44:39'),
(175, 1, '2016-12-15 19:52:00'),
(176, 2, '2016-12-15 19:58:30'),
(177, 60, '2016-12-15 20:05:20'),
(178, 1, '2016-12-15 20:07:50'),
(179, 60, '2016-12-15 20:08:38'),
(180, 1, '2016-12-20 16:46:57'),
(181, 60, '2016-12-20 16:53:38');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedidos`
--

CREATE TABLE `pedidos` (
  `id` int(50) NOT NULL,
  `id_local` int(10) NOT NULL,
  `id_cliente` int(10) NOT NULL,
  `fecha` datetime NOT NULL,
  `importe_total` decimal(10,2) NOT NULL,
  `id_estado` int(5) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `pedidos`
--

INSERT INTO `pedidos` (`id`, `id_local`, `id_cliente`, `fecha`, `importe_total`, `id_estado`) VALUES
(1, 1, 60, '2016-12-12 17:37:39', '245.00', 4),
(2, 1, 60, '2016-12-12 18:55:32', '160.00', 4),
(4, 1, 60, '2016-12-12 22:49:46', '320.00', 4),
(5, 1, 68, '2016-12-15 00:30:23', '420.00', 4),
(6, 1, 70, '2016-12-15 00:59:13', '480.00', 4),
(7, 1, 60, '2016-12-15 01:18:42', '300.00', 4),
(8, 2, 60, '2016-12-15 01:59:29', '240.00', 4),
(9, 2, 69, '2016-12-15 17:37:39', '360.00', 4),
(10, 2, 72, '2016-12-15 17:38:24', '800.00', 4),
(11, 2, 67, '2016-12-15 17:38:44', '100.00', 4),
(12, 1, 67, '2016-12-15 17:39:13', '75.00', 4),
(13, 1, 69, '2016-12-15 17:39:45', '100.00', 4),
(14, 2, 70, '2016-12-15 17:42:07', '160.00', 4),
(15, 2, 60, '2016-12-15 17:42:53', '640.00', 4),
(16, 3, 68, '2016-12-15 17:43:51', '600.00', 4),
(17, 3, 72, '2016-12-15 17:44:23', '300.00', 4),
(18, 3, 67, '2016-12-15 17:47:23', '360.00', 4),
(19, 1, 69, '2016-12-15 20:01:53', '160.00', 2),
(20, 2, 60, '2016-12-15 20:07:07', '100.00', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedidos_detalles`
--

CREATE TABLE `pedidos_detalles` (
  `id` int(10) NOT NULL,
  `id_pedido` int(50) NOT NULL,
  `id_producto` int(10) NOT NULL,
  `precio_unitario` decimal(10,2) NOT NULL,
  `cantidad` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `pedidos_detalles`
--

INSERT INTO `pedidos_detalles` (`id`, `id_pedido`, `id_producto`, `precio_unitario`, `cantidad`) VALUES
(1, 1, 10, '15.00', 3),
(2, 1, 1, '100.00', 2),
(3, 2, 7, '160.00', 1),
(5, 4, 7, '160.00', 2),
(6, 5, 7, '160.00', 2),
(7, 5, 1, '100.00', 1),
(8, 6, 4, '120.00', 4),
(9, 7, 1, '100.00', 3),
(10, 8, 5, '120.00', 2),
(11, 9, 5, '120.00', 3),
(12, 10, 8, '160.00', 5),
(13, 11, 2, '100.00', 1),
(14, 12, 10, '15.00', 5),
(15, 13, 1, '100.00', 1),
(16, 14, 8, '160.00', 1),
(17, 15, 8, '160.00', 1),
(18, 15, 5, '120.00', 4),
(19, 16, 3, '100.00', 6),
(20, 17, 3, '100.00', 3),
(21, 18, 6, '120.00', 3),
(22, 19, 10, '15.00', 4),
(23, 19, 1, '100.00', 1),
(24, 20, 2, '100.00', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedidos_estados`
--

CREATE TABLE `pedidos_estados` (
  `id` int(11) NOT NULL,
  `descripcion` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `pedidos_estados`
--

INSERT INTO `pedidos_estados` (`id`, `descripcion`) VALUES
(1, 'pendiente'),
(2, 'preparando'),
(3, 'terminado'),
(4, 'entregado'),
(5, 'cancelado');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedidos_plantilla`
--

CREATE TABLE `pedidos_plantilla` (
  `id` int(50) NOT NULL,
  `id_pedido` int(50) NOT NULL,
  `id_usuario` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `pedidos_plantilla`
--

INSERT INTO `pedidos_plantilla` (`id`, `id_pedido`, `id_usuario`) VALUES
(1, 1, 2),
(2, 2, 2),
(4, 4, 2),
(5, 5, 2),
(6, 6, 3),
(7, 7, 2),
(8, 9, 61),
(9, 10, 63),
(10, 11, 63),
(11, 12, 3),
(12, 13, 4),
(13, 14, 64),
(14, 15, 64),
(15, 16, 62),
(16, 17, 65),
(17, 18, 66),
(18, 19, 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos_fotos`
--

CREATE TABLE `productos_fotos` (
  `id` int(10) NOT NULL,
  `id_producto` int(10) NOT NULL,
  `foto` varchar(500) NOT NULL,
  `estado` tinyint(4) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `productos_fotos`
--

INSERT INTO `productos_fotos` (`id`, `id_producto`, `foto`, `estado`) VALUES
(10, 1, '1-2016-12-10_23-21-17-0.jpeg', 1),
(11, 1, '1-2016-12-10_23-21-17-1.jpeg', 1),
(12, 1, '1-2016-12-10_23-21-17-2.jpeg', 1),
(13, 2, '2-2016-12-10_23-21-24-0.jpeg', 1),
(14, 2, '2-2016-12-10_23-21-24-1.jpeg', 1),
(15, 2, '2-2016-12-10_23-21-24-2.jpeg', 1),
(16, 3, '3-2016-12-10_23-21-33-0.jpeg', 1),
(17, 3, '3-2016-12-10_23-21-33-1.jpeg', 1),
(18, 3, '3-2016-12-10_23-21-33-2.jpeg', 1),
(19, 4, '4-2016-12-10_23-42-50-0.jpeg', 1),
(20, 4, '4-2016-12-10_23-42-50-1.jpeg', 1),
(21, 4, '4-2016-12-10_23-42-50-2.jpeg', 1),
(22, 5, '5-2016-12-10_23-43-00-0.jpeg', 1),
(23, 5, '5-2016-12-10_23-43-00-1.jpeg', 1),
(24, 5, '5-2016-12-10_23-43-00-2.jpeg', 1),
(25, 6, '6-2016-12-10_23-43-18-0.jpeg', 1),
(26, 6, '6-2016-12-10_23-43-18-1.jpeg', 1),
(27, 6, '6-2016-12-10_23-43-18-2.jpeg', 1),
(28, 7, '7-2016-12-10_23-45-27-0.jpeg', 1),
(29, 7, '7-2016-12-10_23-45-27-1.jpeg', 1),
(30, 7, '7-2016-12-10_23-45-27-2.jpeg', 1),
(31, 8, '8-2016-12-10_23-45-37-0.jpeg', 1),
(32, 8, '8-2016-12-10_23-45-37-1.jpeg', 1),
(33, 8, '8-2016-12-10_23-45-37-2.jpeg', 1),
(34, 9, '9-2016-12-10_23-45-49-0.jpeg', 1),
(35, 9, '9-2016-12-10_23-45-49-1.jpeg', 1),
(36, 9, '9-2016-12-10_23-45-49-2.jpeg', 1),
(37, 10, '10-2016-12-12_15-51-31-0.jpeg', 1),
(38, 10, '10-2016-12-12_15-51-31-1.jpeg', 1),
(39, 10, '10-2016-12-12_15-51-31-2.jpeg', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `id` int(10) NOT NULL,
  `descripcion` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id`, `descripcion`) VALUES
(1, 'admin'),
(2, 'encargado'),
(3, 'empleado'),
(4, 'cliente');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(10) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `tel` double NOT NULL,
  `password` varchar(50) NOT NULL,
  `foto` varchar(500) DEFAULT 'defaultPerfil.jpeg',
  `fecha_alta` datetime NOT NULL,
  `id_rol` int(10) DEFAULT '2',
  `estado` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre`, `apellido`, `email`, `tel`, `password`, `foto`, `fecha_alta`, `id_rol`, `estado`) VALUES
(1, 'Juan Pablo', 'Torrellas', 'admin@argenta.com', 1544558877, '123', '1-2016-12-15_19-54-15.png', '2016-11-16 00:00:00', 1, 1),
(2, 'Luis', 'Molina', 'enc.loc1@argenta.com', 4222456789, '123', '2-2016-12-14_23-28-12.png', '2016-11-16 00:00:00', 2, 1),
(3, 'Soledad', 'Figoli', 'emp1.loc1@argenta.com', 4233456789, '123', '3-2016-12-14_23-28-44.png', '2016-11-16 18:27:46', 3, 1),
(4, 'Carlos', 'Buldain', 'emp2.loc1@argenta.com', 455578666, '123', 'defaultPerfil.jpeg', '2016-11-02 00:00:00', 3, 1),
(60, 'Alberto', 'lopez', 'cliente1@argenta.com', 1566688899, '123', '60-2016-12-14_23-31-20.png', '2016-11-30 22:09:58', 4, 1),
(61, 'Victor', 'Gatcher', 'enc.loc2@argenta.com', 1566688899, '123', 'defaultPerfil.jpeg', '2016-12-14 23:14:39', 2, 1),
(62, 'Jesus', 'Aechu', 'enc.loc3@argenta.com', 1566644444, '123', '62-2016-12-14_23-28-31.png', '2016-12-14 23:16:55', 2, 1),
(63, 'Jose', 'Castañeda', 'emp1.loc2@argenta.com', 1535724578, '123', '63-2016-12-14_23-30-09.png', '2016-12-14 23:18:50', 3, 1),
(64, 'Alejandro', 'Gutierrez', 'emp2.loc2@argenta.com', 1566688855, '123', 'defaultPerfil.jpeg', '2016-12-14 23:20:39', 3, 1),
(65, 'Tomas', 'Riveira', 'emp1.loc3@argenta.com', 1566688899, '123', '65-2016-12-14_23-30-38.png', '2016-12-14 23:21:27', 3, 1),
(66, 'Gustavo', 'Cerati', 'emp2.loc3@argenta.com', 1566688321, '123', 'defaultPerfil.jpeg', '2016-12-14 23:22:41', 3, 1),
(67, 'Natalia', 'Oriana', 'oriana@argenta.com', 1525846815, '123', '67-2016-12-14_23-29-05.png', '2016-12-14 23:23:58', 4, 1),
(68, 'Matias', 'Toscano', 'toscano@argenta.com', 1564927354, '123', 'defaultPerfil.jpeg', '2016-12-14 23:24:48', 4, 1),
(69, 'Federico', 'Romanelli', 'romanelli@argenta.com', 1544873548, '123', 'defaultPerfil.jpeg', '2016-12-14 23:25:16', 4, 1),
(70, 'Patricio', 'Remirez', 'remirez@argenta.com', 47884358, '123', '70-2016-12-14_23-31-01.png', '2016-12-14 23:25:56', 4, 1),
(72, 'Pedro', 'Martinez', 'martinez@argenta.com', 1566688429, '123', 'defaultPerfil.jpeg', '2016-12-15 00:13:22', 4, 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `locales`
--
ALTER TABLE `locales`
  ADD PRIMARY KEY (`id`),
  ADD KEY `estado` (`estado`);

--
-- Indices de la tabla `locales_fotos`
--
ALTER TABLE `locales_fotos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_local` (`id_local`),
  ADD KEY `estado` (`estado`);

--
-- Indices de la tabla `locales_plantilla`
--
ALTER TABLE `locales_plantilla`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_local` (`id_local`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_rol` (`id_rol`),
  ADD KEY `estado` (`estado`);

--
-- Indices de la tabla `locales_productos`
--
ALTER TABLE `locales_productos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `estado` (`estado`),
  ADD KEY `id_local` (`id_local`);

--
-- Indices de la tabla `logins`
--
ALTER TABLE `logins`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_local` (`id_local`),
  ADD KEY `id_usuario` (`id_cliente`),
  ADD KEY `id_estado` (`id_estado`),
  ADD KEY `id_cliente` (`id_cliente`),
  ADD KEY `id_local_2` (`id_local`),
  ADD KEY `fecha` (`fecha`),
  ADD KEY `importe_total` (`importe_total`);

--
-- Indices de la tabla `pedidos_detalles`
--
ALTER TABLE `pedidos_detalles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_pedido` (`id_pedido`),
  ADD KEY `id_producto` (`id_producto`);

--
-- Indices de la tabla `pedidos_estados`
--
ALTER TABLE `pedidos_estados`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `pedidos_plantilla`
--
ALTER TABLE `pedidos_plantilla`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `productos_fotos`
--
ALTER TABLE `productos_fotos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_producto` (`id_producto`),
  ADD KEY `estado` (`estado`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email_2` (`email`),
  ADD KEY `estado` (`estado`),
  ADD KEY `id_rol` (`id_rol`),
  ADD KEY `email` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `locales`
--
ALTER TABLE `locales`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT de la tabla `locales_fotos`
--
ALTER TABLE `locales_fotos`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;
--
-- AUTO_INCREMENT de la tabla `locales_plantilla`
--
ALTER TABLE `locales_plantilla`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
--
-- AUTO_INCREMENT de la tabla `locales_productos`
--
ALTER TABLE `locales_productos`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
--
-- AUTO_INCREMENT de la tabla `logins`
--
ALTER TABLE `logins`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=182;
--
-- AUTO_INCREMENT de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  MODIFY `id` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;
--
-- AUTO_INCREMENT de la tabla `pedidos_detalles`
--
ALTER TABLE `pedidos_detalles`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;
--
-- AUTO_INCREMENT de la tabla `pedidos_estados`
--
ALTER TABLE `pedidos_estados`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT de la tabla `pedidos_plantilla`
--
ALTER TABLE `pedidos_plantilla`
  MODIFY `id` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;
--
-- AUTO_INCREMENT de la tabla `productos_fotos`
--
ALTER TABLE `productos_fotos`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;
--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=74;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
