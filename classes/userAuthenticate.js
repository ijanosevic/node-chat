const crypto = require('crypto');
const database = require('./database');

function md5(string_val) {
	return crypto.createHash('md5').update(string_val).digest("hex");
}


class UserAuthenticate {
	static login(email, password){
		return new Promise((resolve, reject) => {
			function scan(cursor = '0'){
				database.db.scan(cursor, 'MATCH', 'u:*', 'COUNT', '100000', (err, res) => {

					if (err) throw(err)
					let cursor = res[0];
					const user_keys = res[1];
					for (let i = 0; i < user_keys.length; i++) {

						database.db.hgetall(user_keys[i], (err, account) => {

							if (err) throw(err)
							if (email === account.email && md5(password) === account.password) {
								resolve(account);
							}
							if (i === user_keys.length - 1) {
								if (cursor !== '0') {
									scan(cursor);
								} else {
									reject(false);
								}
							}
						});
					}
					
				});	
			}

			scan();
		});
	}
}

module.exports = UserAuthenticate;