function RequestsPagePreValidation() {
    CheckCookie()
}

//#region Requests Page
async function LoadIncompleteRequests() {
    let iclist = document.getElementById("RequestIncompleteList");
    iclist.replaceChildren('...')

    let reqs = await requestsInstance.GetRequests(false);
    console.log('Found ' + reqs.length + ' incomplete request(s)');
    iclist.replaceChildren('')

    reqs.forEach((req) => {
        let listItem = document.createElement("ul");
        listItem.id = req.requestId;

        // Item span
        let item = document.createElement("span")
        item.style.marginRight = "auto";
        item.style.textAlign = "left";
        item.innerText = req.requestTask;

        // Complete Button
        let completeButton = document.createElement("button");
        completeButton.innerText = "Complete"
        completeButton.addEventListener("click", async function() {
            completeButton.disabled = true;
            if (await CompleteRequest(listItem.id)) {
                listItem.remove();
            }
            else {
                item.style.color = "red";
            }
        });

        // Delete Button
        let deleteButton = document.createElement("button");
        deleteButton.innerText = "Delete"
        deleteButton.addEventListener("click", async function() {
            deleteButton.disabled = true;
            if (await RemoveRequest(listItem.id)) {
                listItem.remove();
            }
            else {
                item.style.color = "red";
            }
        });

        listItem.appendChild(item)
        listItem.appendChild(completeButton)
        listItem.appendChild(deleteButton)
        iclist.appendChild(listItem); 
      });
}

async function RefreshRequests() {
    await LoadIncompleteRequests();
}

async function AddRequest(request) {
    try {
        await requestsInstance.AddRequest(request);
        RefreshRequests()
    }
    catch(error) {
        console.log(error)
    }
}

async function CompleteRequest(requestId) {
    try {
        return await requestsInstance.CompleteRequest(requestId, true)
    }
    catch(error) {
        console.log(error)
    }
    return false;
}

async function RemoveRequest(requestId) {
    try {
        return await requestsInstance.DeleteRequest(requestId)
    }
    catch(error) {
        console.log(error)
    }
    return false;
}
//#endregion