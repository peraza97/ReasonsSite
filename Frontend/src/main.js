const instance = new AwsApi();
Object.freeze(instance);

//#region Login
function showPassword() {
    var x = document.getElementById("PassField");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
}

function CheckCookie() {
    if (GetCookie("reasonsToken") == ""){
        console.log("Cookie not present");
        if (window.location.pathname.split('/').pop() != 'index.html') {
            NavigateToPage('index.html')
        }
        return false
    }

    return true
}

async function Login(userName, password) {
    let token = await GetToken(userName, password);

    if (token == "") {
        alert("Wrong username/or password");
    }
    else {
        // Set the cookie 
        SetCookie("reasonsToken", token, 1);
        CompleteLogin();
    }
}

function CompleteLogin(){
    // hide the login section
    document.getElementById("login").style.display = "none";
    
    // Show the reasons buttons
    document.getElementById("menu").style.display = "block";
}
//#endregion

//#region validation of page login
// Validation for index.html
function IndexPagePreValidation() {
    if (CheckCookie() == true) {
        CompleteLogin();
    }
}

// Validation for index.html
function ReasonsPagePreValidation() {
    if (CheckCookie() == true) {
        const urlSearchParams = new URLSearchParams(window.location.search);
        const myParam = urlSearchParams.get('admin');
        if (myParam == 'true') {
            document.getElementById("AdminSection").style.display = "block";
        }
    }
}
//#endregion

//#region Reasons Page
function ShowText(reasonTextBox, text) {
    reasonTextBox.style.display = "block";
    reasonTextBox.innerHTML  = text
}

function ShowMaintenanceText(reasonTextBox) {
    ShowText(reasonTextBox,"<img src=\"imgs/workingBean.png\" width=\"45\" height=\"35\" style=\"margin: 0px 10px;vertical-align: middle;\">Contact your nearest bean</img>");
}

async function LoadReasonView() {
    let reasonTextBox = document.getElementById("Reasonbox");
    ShowText(reasonTextBox, "...");

    try {
        let reason = await instance.GetReason();
        ShowText(reasonTextBox, reason);
    }
    catch(error) {
        console.log(error)
        ShowMaintenanceText(reasonTextBox);
    }
}

async function ResetReasonsView() {
    let reasonTextBox = document.getElementById("Reasonbox");
    ShowText(reasonTextBox, "Resetting reasons");

    try {
        await instance.ResetReasons();
        ShowText(reasonTextBox, "");
    }
    catch(error) {
        console.log(error)
        ShowMaintenanceText(reasonTextBox);
    }
}

async function AddReasonView(reason) {
    let reasonTextBox = document.getElementById("Reasonbox");
    try {
        await instance.AddReason(reason);
        ShowText(reasonTextBox, "Reason Added");
    }
    catch(error) {
        console.log(error)
        ShowMaintenanceText(reasonTextBox);
    }
    
    document.getElementById('AddField').value = ''
}
//#endregion

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

function NavigateToPage(htmlPage) {
    var newPage = htmlPage;
    const urlSearchParams = new URLSearchParams(window.location.search);
    const myParam = urlSearchParams.get('admin');
    if (myParam == 'true') {
        newPage += '?admin=true'
    }
    window.location = newPage
}