const instance = new AwsApi();
Object.freeze(instance);

function CheckCookie() {
    if (GetCookie("reasonsToken") == ""){
        console.log("Cookie not present");
    }
    else {
        console.log("Cookie present");
        HideLoginScreen();
    }
}

async function Login(userName, password) {
    let token = GetToken(userName, password);

    if (token == "") {
        alert("Wrong username/or password");
    }
    else {
        // Set the cookie 
        SetCookie("reasonsToken", token, 1);
        HideLoginScreen();
    }
}

function HideLoginScreen() {
    // hide the login section
    document.getElementById("login").style.display = "none";

    admin = location.href.substring(location.href.lastIndexOf("?")+1);

    if (admin == "admin") {
        // Show the admin buttons
        document.getElementById("AdminSection").style.display = "block";
    }
    // Show the reasons buttons
    document.getElementById("ReasonSection").style.display = "block";
}

function ShowText(reasonTextBox, text) {
    reasonTextBox.style.display = "block";
    reasonTextBox.innerHTML  = text
}

function ShowMaintenanceText(reasonTextBox) {
    ShowText(reasonTextBox,"<img src=\"imgs/workingBean.png\" width=\"45\" height=\"35\" style=\"margin: 0px 10px;vertical-align: middle;\">Contact your nearest bean</img>");
}

function showPassword() {
    var x = document.getElementById("PassField");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
}

async function LoadReasonView() {
    let reasonTextBox = document.getElementById("Reasonbox");
    ShowText(reasonTextBox, "...");

    try {
        let reason = await instance.GetReason();
        ShowText(reasonTextBox, reason);
    }
    catch(error) {
        console.log(error)
        ShowMaintenanceText(reasonTextBox);
    }
}

async function ResetReasonsView() {
    let reasonTextBox = document.getElementById("Reasonbox");
    ShowText(reasonTextBox, "Resetting reasons");

    try {
        await instance.ResetReasons();
        ShowText(reasonTextBox, "");
    }
    catch(error) {
        console.log(error)
        ShowMaintenanceText(reasonTextBox);
    }
}

async function AddReasonView(reason) {
    let reasonTextBox = document.getElementById("Reasonbox");
    try {
        await instance.AddReason(reason);
        ShowText(reasonTextBox, "Reason Added");
    }
    catch(error) {
        console.log(error)
        ShowMaintenanceText(reasonTextBox);
    }
    
    document.getElementById('AddField').value = ''
}

async function GetToken(userName, password) {
    try{
        const _body = {
            "AuthParameters": {
                "USERNAME" : userName,
                "PASSWORD" : password
            },
            "AuthFlow" : "USER_PASSWORD_AUTH",
            "ClientId" : "5e5jou42audpmnpnj666f0fk93"
        }
        const response = await fetch('https://cognito-idp.us-east-2.amazonaws.com:443',{
            method : "POST",
            headers : {
                "Content-type": "application/x-amz-json-1.1",
                "X-Amz-Target": "AWSCognitoIdentityProviderService.InitiateAuth"
            },
            body : JSON.stringify(_body),
        });

        const result = await response.json(); 
        
        return result.AuthenticationResult.AccessToken;
    }
    catch (error) {
        console.log(error)
    }

    return "";
}