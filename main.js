/*jshint -W069 */
/*Disable Warning Justification:
    Using bracket notation so Google Closure Compiler 
    ADVANCED_OPTIMIZATIONS will keep the original property names. */
var SteamCommunity = require('steamcommunity');
var SteamTotp = require('steam-totp');
var mysql = require('mysql');
var log4js = require('log4js');
var SteamTradeOffers = require('steam-tradeoffers');
var async = require('async');
var express = require('express');
var nconf = require('nconf');
var app = express();

nconf.file('configs/dev.json');

var pool  = mysql.createPool({
	connectionLimit : 10,
	database: nconf.get('db:database'),
	host: nconf.get('db:host'),
	user: nconf.get('db:user'),
	password: nconf.get('db:password')
});

var community = new SteamCommunity();
var offers = new SteamTradeOffers();

//logger setup
log4js.configure({
  appenders: {
    access: { type: 'dateFile', filename: 'log/access.log', pattern: '-yyyy-MM-dd' },
    app: { type: 'file', filename: 'log/app.log', maxLogSize: 10485760, numBackups: 3 },
    errorFile: { type: 'file', filename: 'log/errors.log' },
    errors: { type: 'logLevelFilter', level: 'error', appender: 'errorFile' }
  },
  categories: {
    default: { appenders: ['app', 'errors'], level: 'info' },
    http: { appenders: ['access'], level: 'info' }
  }
});

var logger = log4js.getLogger();

function query(sql, callback) {
	if (typeof callback === 'undefined') {
		callback = function() {};
	}
	pool.getConnection(function(err, connection) {
		if(err) return callback(err);
		logger.info('DB connection ID: '+connection.threadId);
		connection.query(sql, function(err, rows) {
			if(err) return callback(err);
			connection.release();
			return callback(null, rows);
		});
	});
}

function login(err, sessionID, cookies, steamguard) {
	if(err) {
		logger.error('Auth error');
		logger.debug(err);
		if(err.message === "SteamGuardMobile") {
			account.twoFactorCode = SteamTotp.generateAuthCode(account.shared_secret);
			logger.warn('Error in auth: '+account.twoFactorCode);
			setTimeout(function() {
				community.login(account, login);
			}, 5000);
			return;
		}
		process.exit(0);
	}
	logger.trace('Sucesfully auth');
	account.sessionID = sessionID;
	account.cookies = cookies;
	community.getWebApiKey('csgo-duo.ru', webApiKey);
	community.startConfirmationChecker(10000, account.identity_secret);
}

function webApiKey(err, key) {
	if(err) {
		logger.error('Cant make apikey');
		logger.debug(err);
		process.exit(0);
		return;
	}
	account.key = key;
	logger.trace('API key bot '+account.accountName+' '+account.key);
	offersSetup();
	community.loggedIn(checkLoggedIn);
}

function offersSetup() {
	logger.trace('Loaded steam-tradeoffers');
	offers.setup({
		sessionID: account.sessionID,
		webCookie: account.cookies,
		APIKey: account.key
	});
}

function checkLoggedIn(err, loggedIn, familyView) {
	if((err) || (!loggedIn)) {
		logger.error('We arent logged in');
		process.exit(0);
	} else {
		logger.trace('Logged in');
		account.auth = true;
	}
}

function makecode() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for(var i=0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function time() {
	return parseInt(new Date().getTime()/1000);
}

//express app and routing
app.get('/sendTrade/', function (req, res) {
	var assetids = req.query['assetids'];
	assetids = assetids.split(',');
	var partner = req.query['partner'];
	var token = req.query['token'];
	var checksum = req.query['checksum'];
	var steamid = req.query['steamid'];
	var senditems = [];
	for(var i = 0; i < assetids.length; i++) {
		if(assetids[i] === "") continue;
		senditems.push({
			appid: 730,
			contextid: 2,
			assetid: assetids[i]
		});
	}
	var code = makecode();
	console.log(partner, token, checksum, assetids, senditems);
	offers.makeOffer({
		partnerAccountId: partner,
		accessToken: token,
		itemsFromThem: senditems,
		itemsFromMe: [],
		message: 'Code: '+code
	}, function(err, r) {
		if(err) {
			logger.error('Error sending trade');
			logger.debug(err);
			res.json({
				success: false,
				error: err.toString()
			});
		} else {
			offers.loadPartnerInventory({
				partnerSteamId: steamid,
				tradeOfferId: r.tradeofferid,
				appId: 730,
				contextId: 2,
				language: 'russian'
			}, function(err, rr) {
				if(err) {
					logger.debug(err);
					res.json({
						success: false,
						error: err.toString()
					});
				} else {
					var names = [];
					for(var i = 0; i < senditems.length; i++) {
						for(var a = 0; a < rr.length; a++) {
							if((senditems[i].assetid === rr[a].id) && (!rr[a].ss)) {
								names.push({market_hash_name: rr[a].market_hash_name, icon_url: rr[a].icon_url});
								rr[a].ss = 1;
								continue;
							}
						}
					}
					res.json({
						success: true,
						code: code,
						amount: checksum,
						tid: r.tradeofferid,
						items: names
					});
				}
			});
		}
	});
});

app.get('/sendTradeMe/', function (req, res) {
	var names = req.query['names'];
	names = names.split(',');
	var partner = req.query['partner'];
	var token = req.query['token'];
	var checksum = req.query['checksum'];
	offers.loadMyInventory({
		appId: 730,
		contextId: 2
	}, function(err, items) {
		if(err) {
			logger.error('Error sending trade');
			logger.debug(err);
			res.json({
				success: false,
				error: err.toString()
			});
		} else {
			var senditems = [];
			for(var i = 0; i < names.length; i++) {
				for(var a = 0; a < items.length; a++) {
					if((names[i] === items[a].market_hash_name) && (!items[a].ss)) {
						senditems.push({
							appid: 730,
							contextid: 2,
							assetid: items[a].id
						});
						if(senditems.length == names.length-1) break;
						items[a].ss = 1;
						continue;
					}
					if(senditems.length == names.length-1) break;
				}
			}
			var code = makecode();
			console.log(partner, token, checksum, names, senditems);
			offers.makeOffer({
				partnerAccountId: partner,
				accessToken: token,
				itemsFromThem: [],
				itemsFromMe: senditems,
				message: 'Code: '+code
			}, function(err, r) {
				if(err) {
					logger.error('Error sending trade');
					logger.debug(err);
					res.json({
						success: false,
						error: err.toString()
					});
				} else {
					res.json({
						success: true,
						code: code,
						amount: -checksum,
						tid: r.tradeofferid,
						state: 2
					});
				}
			});
		}
	});
});

app.get('/checkTrade/', function (req, res) {
	var tid = req.query['tid'];
	offers.getOffer({
		tradeofferid: tid
	}, function(err, trade) {
		if(err) {
			logger.error('Error checking trade');
			logger.debug(err);
			res.json({
				success: false,
				error: err.toString()
			});
		} else {
			if(trade.response.offer.escrow_end_date === 0){
				logger.debug(trade);
				if(trade.response.offer.trade_offer_state == 3) {
					res.json({
						success: true,
						action: 'accept',
						result: 'Coins have been added to your balance'
					});
				} else if(trade.response.offer.trade_offer_state == 7) {
					res.json({
						success: true,
						result: 'You are declined trade',
						action: 'cross'
					});
				} else {
					res.json({
						success: false,
						error: 'You are not accept trade'
					});
				}
			} else {
				res.json({
						success: false,
						result: 'You are declined trade',
						action: 'cross'
					});
			}
		}
	});
});


//else functions
function cancelTrade(offerid) {
	offers.declineOffer({
		tradeOfferId: offerid
	}, function(err, log) {
		if (err) {
			logger.error('Не смогли отменить трейд #'+offerid);
			logger.debug(err);
			return;
		}
		logger.debug(log);
		logger.trace('Offer #'+offerid+' canceled');
	});
}

// mysql querys
query('SELECT * FROM `bots` WHERE `id` = '+pool.escape(nconf.get('bot_id') || 1), function(err, res) {
	if((err) || (!res[0])) {
		logger.error('Cant find account');
		process.exit(0);
		return;
	}
	account = res[0];
	app.listen(3000+account.id);
	logger.trace('We got account info');
	account.twoFactorCode = SteamTotp.generateAuthCode(account.shared_secret);
	account.auth = false;
	logger.debug(account);
	community.login(account, login);
});

//bypass steam guard
community.on('confKeyNeeded', function(tag, callback) {
    callback(null, time, SteamTotp.getConfirmationKey(account.identity_secret, time(), tag));
});

community.on('newConfirmation', function(confirmation) {
	var time = time();
	var key = SteamTotp.getConfirmationKey(account.identity_secret, time, 'allow');
	confirmation.respond(time, key, true, function(err) {
		if(err) {
			logger.error('Error on mobile auth');
			logger.debug(err);
			return;
		}
		logger.trace('Trade sucesfully confirmed');
	});
});
/*jshint +W069 */
