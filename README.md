# CS:GO Duo trade bot

Данный бот представлен сообществу на доработку.

## Demonstration

На данном сайте можно увидить его работу (прием и обработка обменов Steam).

## Installation (Ubuntu)

```bash
$ apt-get install nodejs
$ npm install forever -g
```
Далее нужно переместить все файлы в любую папку (для удобства /bot).

```bash
$ cd /bot
$ forever start bot.js [id]
```
[id] - Номер бота в БД.

## Node modules

| Name      |Version    |
|-----------|-----------|
| `miniprofiler-http` | ![NPM](https://img.shields.io/npm/v/miniprofiler-http.svg)|
| `steamcommunity` | ![NPM](https://img.shields.io/npm/v/miniprofiler-http.svg)|
| `steam-totp` | ![NPM](https://img.shields.io/npm/v/miniprofiler-http.svg)|
| `mysql` | ![NPM](https://img.shields.io/npm/v/miniprofiler-http.svg)|
| `log4js` | ![NPM](https://img.shields.io/npm/v/miniprofiler-http.svg)|
| `steam-tradeoffers` | ![NPM](https://img.shields.io/npm/v/miniprofiler-http.svg)|
| `async` | ![NPM](https://img.shields.io/npm/v/miniprofiler-http.svg)|
