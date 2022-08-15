import * as httpRequest from "./http-to-server.js";

// Signup Form
async function submitRegisterForm(event) {
	try {
		event.preventDefault();
		const username = $("#register-username").val();
		const password = $("#register-password").val();
		const confirm = $("#register-confirm").val();
		
		if (password !== confirm) {
			window.alert("Passwords do not match.");
			return false;
		}
		
		const res = await httpRequest.signUp({ username, password });
		if (res.error) {
			window.alert(res.error);
		}
		else {
			window.location.pathname = "/";
		}
		return false;
	}
	catch(error) {
		console.log(error);
	}
}

// Login Form
async function submitLoginForm(event) {
	try {
		event.preventDefault();
		const username = $("#login-username").val();
		const password = $("#login-password").val();
		
		const res = await httpRequest.signIn({ username, password });
		if (res.error) {
			window.alert(res.error);
		}
		else {
			window.location.pathname = "/";
		}
		return false;
	}
	catch(error) {
		console.log(error);
	}
}

//LOGIN PAGE SHOW/HIDE
function showHideLogin() {
	$("#login-form-container").toggleClass("hidden");
	$("#register-form-container").toggleClass("hidden");
}

// Main routine - runs when document has loaded
$(function() {
	$(".auth-form-toggle").click(showHideLogin);
	$("#register-form").submit(submitRegisterForm);
	$("#login-form").submit(submitLoginForm);
});
