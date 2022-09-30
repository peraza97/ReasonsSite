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