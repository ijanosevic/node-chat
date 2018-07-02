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
		this.friendIds;
		this.friendRequestIds;
		this.status;
	}

	create(data){
		return new Promise((resolve, reject) => {
			var new_user_data = data;
			new_user_data.password = md5(JSON.stringify(new_user_data.password));
			UserModel.generateClientId()
				.then((cid) => {

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

    static find(username, password){
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

    static addFriend(user_id, friendEmail){
    	return new Promise((resolve, reject) => {
    		rdb.hgetall(r_keys.client_uname_email_pairs, function(err, data){
    			
    			let friendUsername = '';
				for (let key in data){
					if (data[key] === friendEmail) {
						friendUsername = key;
						break;
					}
				}

				rdb.hget(r_keys.client_id_uname_pairs, friendUsername, function(err, id){

					const friendKey = r_keys.client+id;
				  	rdb.hget(friendKey, r_keys.friend_request_ids, function(err, friend_request_ids){
				  		if (friend_request_ids === null){
				  			rdb.hset(friendKey, r_keys.friend_request_ids, user_id);
				  			resolve('You have successfully sent friend request to this user.');

				  		} else {
				  			
				  			friend_request_ids = friend_request_ids.split(':');
				  			if (friend_request_ids.includes(user_id)){
								reject('You have already sent request to this user.');
							} else {
								friend_request_ids.push(user_id);
								friend_request_ids = friend_request_ids.join(':');
								rdb.hset(friendKey, r_keys.friend_request_ids, friend_request_ids);
								resolve('You have successfully sent friend request to this user.');
							}
				  		}
					});
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