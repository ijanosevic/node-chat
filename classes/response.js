class Response {

	constructor(type){
		this.type = type;
		this.data = {};
	}

	addData(data){
		if (this.type === 'user_info'){
			delete data.id;
			delete data.password;
			delete data.fr_ids;
			delete data.status;
		}
		this.data = data;
	}
}

module.exports = Response;