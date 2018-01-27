# CS:GO Duo trade bot

[![Build Status](https://travis-ci.org/DevLyNinja/dev-csgoduo.svg?branch=master)](https://travis-ci.org/DevLyNinja/dev-csgoduo)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/518049531227459182b94c0927bf299a)](https://www.codacy.com/app/Hatollint/dev-csgoduo?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=Hatollint/dev-csgoduo&amp;utm_campaign=Badge_Grade)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
### Installation
NodeJS version is not less than 6.0.0
```bash
# Using Ubuntu
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs

# Using Debian, as root
curl -sL https://deb.nodesource.com/setup_8.x | bash -
apt-get install -y nodejs
```

Installing the necessary programs
```bash
npm install
npm install forever -g
```
You also need to configure the config files in /configs.

Starting the bot
```bash
forever start main.js
```

### Contributing to the project
[Contribution guide](https://github.com/Hatollint/dev-csgoduo/blob/master/.github/CONTRIBUTING.md)

### Node modules

| Name      |Version    |
|-----------|-----------|
| `miniprofiler-http` | ![NPM](https://img.shields.io/npm/v/miniprofiler.svg)|
| `steamcommunity` | ![NPM](https://img.shields.io/npm/v/steamcommunity.svg)|
| `steam-totp` | ![NPM](https://img.shields.io/npm/v/steam-totp.svg)|
| `mysql` | ![NPM](https://img.shields.io/npm/v/mysql.svg)|
| `log4js` | ![NPM](https://img.shields.io/npm/v/log4js.svg)|
| `steam-tradeoffers` | ![NPM](https://img.shields.io/npm/v/steam-tradeoffers.svg)|
| `async` | ![NPM](https://img.shields.io/npm/v/async.svg)|
