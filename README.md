# CS:GO Duo trade bot
[![Build Status](https://travis-ci.org/Hatollint/dev-csgoduo.svg?branch=master)](https://travis-ci.org/Hatollint/dev-csgoduo)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/518049531227459182b94c0927bf299a)](https://www.codacy.com/app/Hatollint/dev-csgoduo?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=Hatollint/dev-csgoduo&amp;utm_campaign=Badge_Grade)

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
| `miniprofiler-http` | ![NPM](https://img.shields.io/npm/v/miniprofiler.svg)|
| `steamcommunity` | ![NPM](https://img.shields.io/npm/v/steamcommunity.svg)|
| `steam-totp` | ![NPM](https://img.shields.io/npm/v/steam-totp.svg)|
| `mysql` | ![NPM](https://img.shields.io/npm/v/mysql.svg)|
| `log4js` | ![NPM](https://img.shields.io/npm/v/log4js.svg)|
| `steam-tradeoffers` | ![NPM](https://img.shields.io/npm/v/steam-tradeoffers.svg)|
| `async` | ![NPM](https://img.shields.io/npm/v/async.svg)|
