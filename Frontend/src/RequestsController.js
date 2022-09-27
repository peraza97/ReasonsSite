class RequestsController {
    constructor() {
        if(! RequestsController.instance){
            RequestsController.instance = this;
            this.baseUri = 'https://lq3b28bkba.execute-api.us-east-2.amazonaws.com/Development/requests';
          }
       
          return RequestsController.instance;
    }

    async GetRequests(complete) {
        // Get the cookie
        let token = GetCookie("reasonsToken")

        if (token == ""){
            console.log("Login first");
            throw  "LoginFirst";
        }

        let response = await fetch(this.BuildGetUri(complete), {
            headers: {
                'Authorization' : token
            }
        });

        let jsonResult = await response.json(); 
        let requests = JSON.parse(jsonResult.body);

        // validate the result is valid
        if (!Array.isArray(requests)) {
            console.log("data: " + requests);
            throw "InvalidData";
        }

        return requests
    }

    async AddRequest(request){   
        // Get the cookie
        let token = GetCookie("reasonsToken")

        if (token == "") {
            console.log("Login first");
            throw "LoginFirst";
        }
        
        if (request == "") {
            console.log("Cant add empty request");
            throw "EmptyRequest";
        }
    
        let response = await fetch(this.baseUri, {
            method : "POST",
            headers: {
                'Authorization' : token,
                'Content-Type' : "application/json"
            },
            body : JSON.stringify( { "request" : request } ),
        });
    
        let result = await response.json(); 
        return result.statusCode == 200;
    }

    BuildGetUri(complete) {
        let uri = this.baseUri;
        let params = new URLSearchParams();
        
        // Validate input
        if (typeof complete === 'boolean') {
            params.append("complete", complete);
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