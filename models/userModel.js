var crypto = require('crypto');
var rdb = require('../db');
var r_keys = require('../redis_lookup');

class UserModel {
	
	constructor(){

		// console.log('stampam iz konstruktora UserModel-a');
		// console.log(data);
		this.id;
		this.profilePic;
		this.username;
		this.email;
		this.firstName;
		this.lastName;
		this.password;
		this.lastTimeActive;
		this.groupIds;
		this.friend_ids;
		this.friendRequestIds;
		this.status;
	}

	create(data){
		return new Promise((resolve, reject) => {
			var new_user_data = data;
			new_user_data.password = md5(JSON.stringify(new_user_data.password));
			UserModel.generateClientId()
				.then((cid) => {

					rdb.hset(r_keys.client+cid, 'id', cid);
					for (var key in new_user_data) {
						rdb.hset(r_keys.client+cid, key, new_user_data[key]);
					}
					rdb.sadd(r_keys.client_ids, cid);
					rdb.hset(r_keys.client_id_uname_pairs, new_user_data.username, cid);
					rdb.hset(r_keys.client_uname_email_pairs, new_user_data.username, new_user_data.email);
					resolve(true);
				})
				.catch(error => {
					console.log(error);
					reject('An error occurred while generating id.');
				});
		});
	}

	save(){}

	delete(){}

	update(){}

	static generateClientId(){
		return new Promise((resolve, reject) => {
			var id = Math.floor(Math.random() * 99999999);
			rdb.sismember(r_keys.client_ids, id, function(err, exists){
				if (exists === 0) {
					resolve(id);
				} else {
					self.generateClientId();
				}
			});  
		});
    }

    static checkExistance(email, username = undefined, ){
    	
    	if (username !== undefined) {
	    	return new Promise((resolve, reject) => {
		    	rdb.hexists(r_keys.client_uname_email_pairs, username, function(err, uname_exists){
					if (uname_exists === 1){
						reject('Desired username is taken, please choose another one.');
					}

					rdb.hvals(r_keys.client_uname_email_pairs, function(err, data){
						if (data.includes(email)){
							reject('Desired email is already associated with one of accounts, please choose another one.');
						}

						resolve(true);
					});
				});
		    });
    	} else {

    		return new Promise((resolve, reject) => {
		    	rdb.hvals(r_keys.client_uname_email_pairs, function(err, emails){
					if (!emails.includes(email)){
						reject('There are no users with entered email.');
					}
					
					resolve(true);
				});
		    });
    	}
    }

    static get(id){
    	return new Promise((resolve, reject) => {
	    	rdb.hgetall(r_keys.client+id, function(err, user_data){
				resolve(user_data);
			});
		});
    }

    static setKey(id, key, value){

    	rdb.hset(r_keys.client+id, key, value);
    }

    static setStatus(id, value){
    	console.log(r_keys.client+id);
    	console.log(value);
    	rdb.hset(r_keys.client+id, 'status', value);
    }

    static find(email, password){
    	return new Promise((resolve, reject) => {
	    	password = md5(JSON.stringify(password));
	    	rdb.hget(r_keys.client_id_uname_pairs, username, function(err, id){
				
				if (id === null) {
					reject('There is no account with enetered username');
				}

				rdb.hget(r_keys.client+id, 'password', function(err, found_password){

					if (password === found_password){
						resolve(id);
					} else {
						reject('Wrong password');
					}
				});
			});
	    });
    }
}

function md5(user) {
	var data = user;
	return crypto.createHash('md5').update(data).digest("hex");
}

module.exports = UserModel;