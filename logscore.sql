-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Хост: localhost
-- Время создания: Ноя 12 2025 г., 12:26
-- Версия сервера: 8.0.43-0ubuntu0.24.04.2
-- Версия PHP: 8.3.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `logscore`
--

-- --------------------------------------------------------

--
-- Структура таблицы `logscore_admins`
--

CREATE TABLE `logscore_admins` (
  `id` int UNSIGNED NOT NULL,
  `login` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_login` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `logscore_api_keys`
--

CREATE TABLE `logscore_api_keys` (
  `api_key` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `uses` bigint UNSIGNED NOT NULL DEFAULT '0',
  `last_use` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `expires_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `logscore_data`
--

CREATE TABLE `logscore_data` (
  `id` bigint UNSIGNED NOT NULL,
  `log_id` bigint UNSIGNED NOT NULL,
  `data_key` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `data_value` text COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `logscore_logs`
--

CREATE TABLE `logscore_logs` (
  `id` bigint UNSIGNED NOT NULL,
  `log_type` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `server_id` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `datetime` datetime NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `logscore_servers`
--

CREATE TABLE `logscore_servers` (
  `server_id` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `server_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `logscore_types`
--

CREATE TABLE `logscore_types` (
  `log_type` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `server_id` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `format` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `human_format` text COLLATE utf8mb4_unicode_ci,
  `expires` int NOT NULL DEFAULT '30',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `logscore_types_data`
--

CREATE TABLE `logscore_types_data` (
  `id` bigint UNSIGNED NOT NULL,
  `log_type` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `server_id` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type_data` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `data_type` enum('string','number','boolean','datetime') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'string',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `logscore_admins`
--
ALTER TABLE `logscore_admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `login` (`login`),
  ADD KEY `idx_login` (`login`);

--
-- Индексы таблицы `logscore_api_keys`
--
ALTER TABLE `logscore_api_keys`
  ADD PRIMARY KEY (`api_key`),
  ADD KEY `idx_expires` (`expires_at`);

--
-- Индексы таблицы `logscore_data`
--
ALTER TABLE `logscore_data`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_log_key` (`log_id`,`data_key`),
  ADD KEY `idx_key_value` (`data_key`,`data_value`(255));

--
-- Индексы таблицы `logscore_logs`
--
ALTER TABLE `logscore_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_server_type` (`server_id`,`log_type`),
  ADD KEY `idx_datetime` (`datetime`),
  ADD KEY `idx_expires` (`expires_at`),
  ADD KEY `idx_log_type` (`log_type`),
  ADD KEY `fk_logs_types` (`log_type`,`server_id`);

--
-- Индексы таблицы `logscore_servers`
--
ALTER TABLE `logscore_servers`
  ADD PRIMARY KEY (`server_id`),
  ADD KEY `idx_server_name` (`server_name`);

--
-- Индексы таблицы `logscore_types`
--
ALTER TABLE `logscore_types`
  ADD PRIMARY KEY (`log_type`,`server_id`),
  ADD KEY `idx_server_type` (`server_id`,`log_type`);

--
-- Индексы таблицы `logscore_types_data`
--
ALTER TABLE `logscore_types_data`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_type_data` (`log_type`,`server_id`,`type_data`),
  ADD KEY `idx_type_server` (`log_type`,`server_id`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `logscore_admins`
--
ALTER TABLE `logscore_admins`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `logscore_data`
--
ALTER TABLE `logscore_data`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `logscore_logs`
--
ALTER TABLE `logscore_logs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `logscore_types_data`
--
ALTER TABLE `logscore_types_data`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `logscore_data`
--
ALTER TABLE `logscore_data`
  ADD CONSTRAINT `logscore_data_ibfk_1` FOREIGN KEY (`log_id`) REFERENCES `logscore_logs` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `logscore_logs`
--
ALTER TABLE `logscore_logs`
  ADD CONSTRAINT `fk_logs_types` FOREIGN KEY (`log_type`,`server_id`) REFERENCES `logscore_types` (`log_type`, `server_id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `logscore_types`
--
ALTER TABLE `logscore_types`
  ADD CONSTRAINT `logscore_types_ibfk_1` FOREIGN KEY (`server_id`) REFERENCES `logscore_servers` (`server_id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `logscore_types_data`
--
ALTER TABLE `logscore_types_data`
  ADD CONSTRAINT `fk_types_data_types` FOREIGN KEY (`log_type`,`server_id`) REFERENCES `logscore_types` (`log_type`, `server_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
