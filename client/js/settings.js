import * as httpRequest from "./http-to-server.js";

// Change Password Form
async function submitChangePasswordForm(event) {
	try {
		event.preventDefault();

		const password = $("#current-password").val();
		const newPassword = $("#new-password").val();
		const confirm = $("#new-password-con").val();

		if (newPassword !== confirm) {
			window.alert("Passwords do not match");
			return false;
		}

		const res = await httpRequest.changePassword({ password, newPassword });
		if (res.error) {
			window.alert(res.error);
		}
		else {
			window.alert("Password changed!");
			$("#current-password").val("");
			$("#new-password").val("");
			$("#new-password-con").val("");
		}

		return false;
	}
	catch(error) {
		console.log(error);
	}
}

// Delete User Form
async function submitDeleteUserForm(event) {
	try {
		event.preventDefault();

		const confirmed = confirm("Are you sure you want to delete your account? You will not be able to recover it if you do.");
		if (!confirmed) return;
		
		const res = await httpRequest.deleteUser();
		if (res.error) {
			window.alert(res.error);
		}
		else {
			window.alert("Account deleted!");
			window.location.pathname = "/signin";
		}

		return false;
	}
	catch(error) {
		console.log(error);
	}
}

// Main routine - runs when document has loaded
$(function() {
	$("#change-password-form").submit(submitChangePasswordForm);
	$("#delete-user-form").submit(submitDeleteUserForm);
});
