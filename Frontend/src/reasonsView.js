const defaultErrorMessage = 'Contact your nearest bean' 

// Validation
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

function ShowMaintenanceText(reasonTextBox, str) {
    ShowText(reasonTextBox,"<img src=\"imgs/workingBean.png\" width=\"45\" height=\"35\" style=\"margin: 0px 10px;vertical-align: middle;\">" + str + "</img>");
}

async function LoadReasonView() {
    let reasonTextBox = document.getElementById("Reasonbox");
    ShowText(reasonTextBox, "...");

    try {
        let reason = await reasonsInstance.GetReason();
        if (reason == null) {
            ShowMaintenanceText(reasonTextBox, 'Come back soon for a new reason');
        }
        else {
            ShowText(reasonTextBox, reason);
        }
    }
    catch(error) {
        console.log(error)
        ShowMaintenanceText(reasonTextBox, defaultErrorMessage);
    }
}

async function ResetReasonsView() {
    let reasonTextBox = document.getElementById("Reasonbox");
    ShowText(reasonTextBox, "Resetting reasons");

    try {
        await reasonsInstance.ResetReasons();
        ShowText(reasonTextBox, "");
    }
    catch(error) {
        console.log(error)
        ShowMaintenanceText(reasonTextBox, defaultErrorMessage);
    }
}

async function AddReasonView(reason) {
    let reasonTextBox = document.getElementById("Reasonbox");
    try {
        await reasonsInstance.AddReason(reason);
        ShowText(reasonTextBox, "Reason Added");
    }
    catch(error) {
        console.log(error)
        ShowMaintenanceText(reasonTextBox, defaultErrorMessage);
    }
    
    document.getElementById('AddField').value = ''
}
//#endregion
