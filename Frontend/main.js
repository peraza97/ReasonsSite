const instance = new AwsApi();
Object.freeze(instance);

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
        
        // Set the cookie 
        SetCookie("reasonsToken", result.AuthenticationResult.AccessToken, 1);

        // hide the login section
        document.getElementById("login").style.display = "none";

        // Show the reasons button
        document.getElementById("reasonsButtons").style.display = "block";
    }
    catch (error) {
        console.log(error)
        alert("Wrong username/or password")
    }
}

function ShowText(reasonTextBox, text){
    reasonTextBox.style.display = "block";
    reasonTextBox.innerHTML  = text
}

function ShowMaintenanceText(reasonTextBox){
    ShowText(reasonTextBox,"<img src=\"workingBean.png\" width=\"45\" height=\"35\" style=\"margin: 0px 10px;vertical-align: middle;\">Contact your nearest bean</img>");
}

function showPassword(){
    var x = document.getElementById("PassField");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
}

async function LoadReasonView()
{
    let reasonTextBox = document.getElementById("Reasonbox");
    ShowText(reasonTextBox, "...");

    let reason = await instance.GetReason();

    if (reason == ""){
        ShowMaintenanceText(reasonTextBox);
    }
    else {
        ShowText(reasonTextBox, reason);
    }
}

async function ResetReasonsView(){
    let reasonTextBox = document.getElementById("Reasonbox");
    ShowText(reasonTextBox, "Resetting reasons");

    var sucess = await instance.ResetReasons();
    if (!sucess) {
        ShowMaintenanceText(reasonTextBox);
    }
    else {
        ShowText(reasonTextBox, "");
    }
}
