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

async function GetReason() 
{
    // Get the cookie
    let token = GetCookie("reasonsToken")

    if (token == ""){
        alert("Login first");
        return;
    }

    let reasonTextBox = document.getElementById("Reasonbox");
    ShowText(reasonTextBox, "...");

    try{
        let response = await fetch('https://ipbvxha6wf.execute-api.us-east-2.amazonaws.com/Development/reasons', {
            headers: {
                'Authorization' : token
            }
        });

        let jsonResult = await response.json(); 
        let reasons = JSON.parse(jsonResult.body);

        if (!Array.isArray(reasons) || !reasons.length){
            console.log("Missing reason");
            console.log("data: " + reasons);
            ShowMaintenanceText(reasonTextBox);
            return;
        }

        if (await MarkReason(reasons[0].reasonId, true)){
            console.log("Updated reason: " + reasons[0].reason);
            ShowText(reasonTextBox, reasons[0].reason);
        } 
        else{
            console.log("Failed to update reason");
            ShowMaintenanceText(reasonTextBox);
            return;
        }
    }
    catch (error){
        console.log(error);
        ShowMaintenanceText(reasonTextBox);
    }
}

async function MarkReason(reasonId, seen){
    // Get the cookie
    let token = GetCookie("reasonsToken")

    if (token == ""){
        console.log("missing token");
        return false;
    }

    if (reasonId == "" || typeof seen !== 'boolean'){
        console.log(reasonId + ' ' + seen);
        return false;
    }

    let success = false;
    try{
        let response = await fetch('https://ipbvxha6wf.execute-api.us-east-2.amazonaws.com/Development/reasons/' + reasonId,
        {
            method : "PUT",
            headers: {
                'Authorization' : token,
                'Content-Type' : "application/json"
            },
            body : JSON.stringify( { "seen" : seen} ),
        });

        let result = await response.json(); 
        success = (result.statusCode == 200);
    }
    catch (error){
        console.log(error)
    }

    return success;
}

async function ResetReasons(){
    // Get the cookie
    let token = GetCookie("reasonsToken")

    if (token == ""){
        console.log("missing token");
        return false;
    }

    let reasonTextBox = document.getElementById("Reasonbox");

    ShowText(reasonTextBox, "Resetting reasons");
    try{
        let done = false
        while (!done){
            let response = await fetch('https://ipbvxha6wf.execute-api.us-east-2.amazonaws.com/Development/reasons?count=10&seen=true', {
                headers: {
                    'Authorization' : token
                }
            });

            let jsonResult = await response.json(); 
            let reasons = JSON.parse(jsonResult.body);

            if (!Array.isArray(reasons) || !reasons.length){
                console.log("no more reasons");
                done = true;
            }
            else{
                console.log("resetting " + reasons.length);
                for (const reason of reasons){
                    await MarkReason(reason.reasonId, false);
                }
            }
        }
    }
    catch (error){
        console.log(error);
        ShowMaintenanceText(reasonTextBox);
    }
    
    ShowText(reasonTextBox, "");
    return;
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