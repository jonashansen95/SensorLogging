CREATE SCHEMA sensorLogging;

USE sensorLogging;

CREATE TABLE user (
  id     INT(11)               AUTO_INCREMENT PRIMARY KEY,
  name   VARCHAR(128),
  apiKey VARCHAR(256) NOT NULL,
  active TINYINT(1)   NOT NULL DEFAULT TRUE
)
  CHARACTER SET = utf8mb4;

CREATE TABLE climate (
  id       INT(11)  AUTO_INCREMENT PRIMARY KEY,
  temp     INT(11) NOT NULL,
  humidity INT(11),
  created  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_id  INT(11) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES user (id)
)