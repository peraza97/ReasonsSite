class AwsApi {
    constructor() {
        if(! AwsApi.instance){
            AwsApi.instance = this;
          }
       
          return AwsApi.instance;
    }

    async GetReason() {
        // Get the cookie
        let token = GetCookie("reasonsToken")

        if (token == ""){
            console.log("Login first");
            return "";
        }

        try {
            let response = await fetch('https://ipbvxha6wf.execute-api.us-east-2.amazonaws.com/Development/reasons', {
                headers: {
                    'Authorization' : token
                }
            });

            let jsonResult = await response.json(); 
            let reasons = JSON.parse(jsonResult.body);

            // validate the result is valid
            if (!Array.isArray(reasons) || !reasons.length) {
                console.log("Missing reason");
                console.log("data: " + reasons);
                return "";
            }

            // validate we can mark reason as seen before displaying
            if (await this.MarkReason(reasons[0].reasonId, true)) {
                console.log("Updated reason: " + reasons[0].reason);
                return reasons[0].reason;
            } 
            else {
                console.log("Failed to update reason");
                return "";
            }
        }
        catch (error) {
            console.log(error);
        }

        return "";
    }

    async MarkReason(reasonId, seen){
        // Get the cookie
        let token = GetCookie("reasonsToken")

        if (token == ""){
            console.log("Login first");
            return false;
        }

        // Validate input
        if (reasonId == "" || typeof seen !== 'boolean'){
            console.log(reasonId + ' ' + seen);
            return false;
        }

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
            return result.statusCode == 200;
        }
        catch (error){
            console.log(error)
        }
    
        return false;
    }

    async ResetReasons(){ 
        // Get the cookie
        let token = GetCookie("reasonsToken")

        if (token == ""){
            console.log("Login first");
            return false;
        }

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
    
                // Validate the input
                if (!Array.isArray(reasons) || !reasons.length){
                    console.log("no more reasons");
                    done = true;
                }
                else{
                    console.log("resetting " + reasons.length);
                    for (const reason of reasons){
                        await this.MarkReason(reason.reasonId, false);
                    }
                }
            }
    
            return true;
        }
        catch (error){
            console.log(error);
            return false;
        }
        
        return true;
    }

    async AddReason(reason){   
        // Get the cookie
        let token = GetCookie("reasonsToken")

        if (token == ""){
            console.log("Login first");
            return false;
        }
        
        if (reason == ""){
            console.log("Cant add empty reason");
            return false;
        }
    
        let response = await fetch('https://ipbvxha6wf.execute-api.us-east-2.amazonaws.com/Development/reasons/',
        {
            method : "POST",
            headers: {
                'Authorization' : token,
                'Content-Type' : "application/json"
            },
            body : JSON.stringify( { "reason" : reason} ),
        });
    
        let result = await response.json(); 
        return result.statusCode == 200;
    }
}