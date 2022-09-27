const requestsInstance = new RequestsController ();
Object.freeze(requestsInstance);

function RequestsPagePreValidation() {
    CheckCookie()
}

//#region Requests Page
async function AddRequestView(request) {
    try {
        await requestsInstance.AddRequest(request);
        RefreshRequests()
    }
    catch(error) {
        console.log(error)
    }
}

async function LoadIncompleteRequests() {
    let iclist = document.getElementById("RequestIncompleteList");
    iclist.replaceChildren('...')

    let reqs = await requestsInstance.GetRequests(false);
    console.log('Found ' + reqs.length + ' incomplete request(s)');
    iclist.replaceChildren('')

    reqs.forEach((item) => {
        let li = document.createElement("ul");
        li.style.margin = "5px";
        li.style.textAlign = "center";
        li.innerText = item.requestTask;
        iclist.appendChild(li);
      });
}

async function RefreshRequests() {
    await LoadIncompleteRequests();
}
//#endregion