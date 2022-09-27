const requestsInstance = new RequestsController();
Object.freeze(requestsInstance);

function RequestsPagePreValidation() {
    CheckCookie()
}

//#region Requests Page
async function AddRequestView(request) {
    try {
        await requestsInstance.AddRequest(request);
    }
    catch(error) {
        console.log(error)
    }
}

async function LoadIncompleteRequests() {
    let reqs = await requestsInstance.GetRequests(false);
    console.log('Found ' + reqs.length + ' incomplete request(s)');

    let iclist = document.getElementById("RequestIncompleteList");
    iclist.replaceChildren()

    reqs.forEach((item) => {
        let li = document.createElement("ul");
        li.style.margin = "5px";
        li.style.textAlign = "center";
        li.innerText = item.requestTask;
        iclist.appendChild(li);
      });
}

async function LoadCompleteRequests() {
    let reqs = await requestsInstance.GetRequests(true);
    console.log('Found ' + reqs.length + ' complete request(s)');

    let clist = document.getElementById("RequestCompleteList");
    clist.replaceChildren()

    reqs.forEach((item) => {
        let li = document.createElement("ul");
        li.style.margin = "5px";
        li.style.textAlign = "center";
        li.innerHTML = item.requestTask.strike();
        clist.appendChild(li);
        });    
}

async function RefreshRequests() {
    await Promise.all([LoadIncompleteRequests(), LoadCompleteRequests()]);
}
//#endregion