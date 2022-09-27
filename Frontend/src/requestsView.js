//#region Requests Page
function LoadRequests() {
    const fruits = ['Apple', 'Banana', 'Banana', 'Banana','Apple'];
    return fruits
}

function RefreshRequests() {
    let list = document.getElementById("RequestList");
    list.replaceChildren()

    let reqs = LoadRequests();
    reqs.forEach((item) => {
        let li = document.createElement("ul");
        li.style.margin = "5px";
        li.style.textAlign = "center";
        li.innerText = item;
        list.appendChild(li);
      });
}
//#endregion