class AwsApi {
    constructor() {
        if(! AwsApi.instance){
            AwsApi.instance = this;
            this.baseUri = 'https://ipbvxha6wf.execute-api.us-east-2.amazonaws.com/Development/reasons';
          }
       
          return AwsApi.instance;
    }

    async GetReasons(count, seen) {
        // Get the cookie
        let token = GetCookie("reasonsToken")

        if (token == ""){
            console.log("Login first");
            throw  "LoginFirst";
        }

        let response = await fetch(this.BuildGetUri(count, seen), {
            headers: {
                'Authorization' : token
            }
        });

        let jsonResult = await response.json(); 
        let reasons = JSON.parse(jsonResult.body);

        // validate the result is valid
        if (!Array.isArray(reasons)) {
            console.log("data: " + reasons);
            throw "InvalidData";
        }

        return reasons
    }

    async GetReason() {

        let reasons = await this.GetReasons();

        if (!reasons.length) {
            throw "MissingData";
        }

        // validate we can mark reason as seen before displaying
        if (await this.MarkReason(reasons[0].reasonId, true)) {
            console.log("Updated reason: " + reasons[0].reason);
            return reasons[0].reason;
        } 
        else {
            console.log("Failed to update reason");
            throw "FailedUpdateReason";
        }
    }

    async MarkReason(reasonId, seen){
        // Get the cookie
        let token = GetCookie("reasonsToken")

        if (token == ""){
            console.log("Login first");
            throw "LoginFirst";
        }

        // Validate input
        if (reasonId == "" || typeof seen !== 'boolean'){
            console.log(reasonId + ' ' + seen);
            return "ReasonSeenArgumentValidationFailure";
        }

        let response = await fetch(this.baseUri + '/' + reasonId,
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

    async ResetReasons(){ 
        // Get the cookie
        let token = GetCookie("reasonsToken")

        if (token == ""){
            console.log("Login first");
            throw "LoginFirst";
        }

        let done = false
        while (!done){
            let reasons = await this.GetReasons(10, true);

            if (!reasons.length){
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
    }

    async AddReason(reason){   
        // Get the cookie
        let token = GetCookie("reasonsToken")

        if (token == "") {
            console.log("Login first");
            throw "LoginFirst";
        }
        
        if (reason == "") {
            console.log("Cant add empty reason");
            throw "EmptyReason";
        }
    
        let response = await fetch(this.baseUri, {
            method : "POST",
            headers: {
                'Authorization' : token,
                'Content-Type' : "application/json"
            },
            body : JSON.stringify( { "reason" : reason } ),
        });
    
        let result = await response.json(); 
        return result.statusCode == 200;
    }

    BuildGetUri(count, seen) {
        let uri = this.baseUri;
        let params = new URLSearchParams();
        
        // Validate input
        if (count && count.length !== 0 ) {
            params.append("count", count);
        }

        if (typeof seen === 'boolean') {
            params.append("seen", seen);
        }

        let paramStr = params.toString();
        
        if (paramStr.length === 0) {
            uri = this.baseUri;
        }
        else {
            uri = this.baseUri + '?' + paramStr;
        }

        console.log(uri);
        return uri;
    }
}