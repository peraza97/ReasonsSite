//#region Login
function showPassword() {
    var x = document.getElementById("PassField");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
}

async function Login(userName, password) {
    let token = await GetToken(userName, password);

    if (token == "") {
        alert("Wrong username/or password");
    }
    else {
        // Set the cookie 
        SetCookie(COOKIENAME, token, 1);
        CompleteLogin();
    }
}

function CompleteLogin(){
    // hide the login section
    document.getElementById("login").style.display = "none";
    
    // Show the reasons buttons
    document.getElementById("menu").style.display = "block";
}

// Validation for index.html
function CheckLogin() {
    if (IsLoggedIn() == true) {
        CompleteLogin();
    }
}