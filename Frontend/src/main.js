//#region validation of page login
function CheckCookie() {
    if (GetCookie("reasonsToken") == ""){
        console.log("Cookie not present");
        if (window.location.pathname.split('/').pop() != 'index.html') {
            NavigateToPage('index.html')
        }
        return false
    }

    return true
}

// Validation for index.html
function LoginPagePreValidation() {
    if (CheckCookie() == true) {
        CompleteLogin();
    }
}

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
        SetCookie("reasonsToken", token, 1);
        CompleteLogin();
    }
}

function CompleteLogin(){
    // hide the login section
    document.getElementById("login").style.display = "none";
    
    // Show the reasons buttons
    document.getElementById("menu").style.display = "block";
}
//#endregion

function NavigateToPage(htmlPage) {
    var newPage = htmlPage;
    const urlSearchParams = new URLSearchParams(window.location.search);
    const myParam = urlSearchParams.get('admin');
    if (myParam == 'true') {
        newPage += '?admin=true'
    }
    window.location = newPage
}