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
        let token = await GetCookie("reasonsToken");

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
        console.log('GET: ' + jsonResult.statusCode)
        let requests = JSON.parse(jsonResult.body);

        // validate the result is valid
        if (!Array.isArray(requests)) {
            console.log("data: " + requests);
            throw "InvalidData";
        }

        return requests
    }

    async AddRequest(request) {   
        // Get the cookie
        let token = await GetCookie("reasonsToken");

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
        console.log('POST: ' + result.statusCode)
        return result.statusCode == 200;
    }

    async CompleteRequest(requestId, complete) {
        // Get the cookie
        let token = await GetCookie("reasonsToken");

        if (requestId == "") {
            console.log("Cant complete empty requestId");
            throw "EmptyRequestId";
        }

        let response = await fetch(this.baseUri + '/' + requestId,
        {
            method : "PUT",
            headers: {
                'Authorization' : token,
                'Content-Type' : "application/json"
            },
            body : JSON.stringify( { "complete" : complete} ),
        });
        let result = await response.json(); 
        console.log('PUT: ' + result.statusCode)
        return result.statusCode == 200;
    }

    async DeleteRequest(requestId) {   
        // Get the cookie
        let token = await GetCookie("reasonsToken");

        if (token == "") {
            console.log("Login first");
            throw "LoginFirst";
        }
        
        if (requestId == "") {
            console.log("Cant delete empty requestId");
            throw "EmptyRequestId";
        }
    
        let response = await fetch(this.baseUri + '/' + requestId, {
            method : "DELETE",
            headers: {
                'Authorization' : token,
                'Content-Type' : "application/json"
            }
        });
    
        let result = await response.json(); 
        console.log('DELETE: ' + result.statusCode)
        return result.statusCode == 200;
    }

    BuildGetUri(complete) {
        let uri = this.baseUri
        let paramsUri = new URLSearchParams();

        // Validate input
        if (typeof complete === 'boolean') {
            paramsUri.append("complete", complete);
        }

        console.log(paramsUri);
        return uri + '?' + paramsUri;
    }
}

const requestsInstance = new RequestsController();
Object.freeze(requestsInstance);