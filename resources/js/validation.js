var register_form = document.forms.register_form;
var login_form = document.forms.login_form;

register_form.querySelector('a').addEventListener('click', registerUser);
login_form.querySelector('a').addEventListener('click', loginUser);

function loginUser(e){
	e.preventDefault();
	var form = validateLoginForm();
	if (form !== false) {
		postData('http://localhost:3000/auth/login', form)
			.then(user_id => {
				docCookies.setItem("user_id", user_id);
			})
			.catch(error => {
				console.error(error);
			});			
	}
}

function registerUser(e){
	e.preventDefault();
	var form = validateRegisterForm();
	if (form.valid === true) {
		checkUsernameAvailability(register_form)
			.then(available => {

				if (available !== true) {
					alert(available);
					return;
				} else {
					postData('http://localhost:3000/auth/register', form.fields)
						.then(data => {
							alert('Your account has been successfully created, enjoy chatting.');
						})
						.catch(error => {
							console.error(error);
						});
				}
			});

	}
}

function checkUsernameAvailability(form_data){
	var payload = {
		username: form_data.username.value,
		email: form_data.email.value,
	}
	return postData('http://localhost:3000/auth/check-username-availability', payload)
			.then(data => {
				return data;
			})
			.catch(error => {
				console.error(error);
			});
}

function validateLoginForm(){
	
	var username = login_form.querySelector('#l_username');
	var password = login_form.querySelector('#l_password');

	if (username.value == "") {
        username.style.background = 'Yellow';
        error = "You didn't enter a username.\n";
        alert(error);
        return false;
 
    } else if (password.value == "") {
        password.style.background = 'Yellow';
        error = "You didn't enter a password.\n";
        alert(error);
        return false;
 
    } else {
    	var result = {
				username: username.value,
				password: password.value
			}
    	return result;
    }
}

function validateRegisterForm(e){
	var username = register_form.querySelector('#username');
	var email = register_form.querySelector('#email');
	var password = register_form.querySelector('#password');
	var retype_password = register_form.querySelector('#retype_password');

	var fields = [username, email, password];
	var form_valid = fields.map(field => {
		if (field.id === 'username') {
			return validateUsername(field);

		} else if (field.id === 'email') {
			return validateEmail(field);

		} else if (field.id === 'password') {
			return validatePasswords(field, retype_password);

		}
	});

	return {
		valid: !form_valid.includes(false),
		fields: {
			username: username.value,
			email: email.value,
			password: password.value
		}
	}
}

function validateUsername(fld) {

    var error = "";
    var illegalChars = /\W/; // allow letters, numbers, and underscores
 
    if (fld.value == "") {
        fld.style.background = 'Yellow';
        error = "You didn't enter a username.\n";
        alert(error);
        return false;
 
    } else if ((fld.value.length < 5) || (fld.value.length > 25)) {
        fld.style.background = 'Yellow';
        error = "The username is the wrong length.\n";
		alert(error);
		return false;
 
    } else if (illegalChars.test(fld.value)) {
        fld.style.background = 'Yellow';
        error = "The username contains illegal characters.\n";
		alert(error);
		return false;
 
    } else {

    	fld.style.background = 'White';
	    return true;
    }
}

function validateEmail(fld) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    
    if (fld.value == "") {
        fld.style.background = 'Yellow';
        error = "You didn't enter a email.\n";
        alert(error);
        return false;
 
    } else if (!re.test(String(fld.value).toLowerCase())) {
    	fld.style.background = 'Yellow';
        error = "Please enter email address in right format.\n";
        alert(error);
        return false;

    } else {
    	fld.style.backgroundColor = 'white';
    }
    return true;
}

function validatePasswords(password, retype_password) {
	if (password.value == "") {
        password.style.background = 'Yellow';
        error = "You didn't enter a password.\n";
        alert(error);
        return false;
 
    } else if ((password.value.length < 5) || (password.value.length > 25)) {
        password.style.background = 'Yellow';
        error = "The password is the wrong length.\n";
		alert(error);
		return false;
 
    } else if (retype_password.value == "") {
        retype_password.style.background = 'Yellow';
        error = "You didn't retype the password.\n";
        alert(error);
        return false;
 
    } else if ((retype_password.value.length < 5) || (retype_password.value.length > 25)) {
        retype_password.style.background = 'Yellow';
        error = "The password is the wrong length.\n";
		alert(error);
		return false;
 
    } else if (password.value !== retype_password.value) {
 		retype_password.style.background = 'Yellow';
        error = "Passwords do not match.\n";
		alert(error);
		return false;   	
    } else {
    	password.style.backgroundColor = 'white';
    	retype_password.style.backgroundColor = 'white';
    }
	return true;
}

function postData(url, data) {
	// Default options are marked with *
	return fetch(url, {
		body: JSON.stringify(data), // must match 'Content-Type' header
		cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
		credentials: 'same-origin', // include, same-origin, *omit
		headers: {
			'user-agent': 'Mozilla/4.0 MDN Example',
			'content-type': 'application/json'
		},
		method: 'POST', // *GET, POST, PUT, DELETE, etc.
		mode: 'cors', // no-cors, cors, *same-origin
		redirect: 'follow', // manual, *follow, error
		referrer: 'no-referrer', // *client, no-referrer
	})
	.then(response => {
		return response.json()
	}); // parses response to JSON
}

function maxAgeToGMT (nMaxAge) {

	return nMaxAge === Infinity ? "Fri, 31 Dec 9999 23:59:59 GMT" : (new Date(nMaxAge * 1e3 + Date.now())).toUTCString();
}