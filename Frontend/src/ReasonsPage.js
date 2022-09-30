const defaultErrorMessage = 'Oops... Something went wrong' 

function ReasonsPageLoginValidation() {
    if (IsLoggedIn() == true) {
        const urlSearchParams = new URLSearchParams(window.location.search);
        const myParam = urlSearchParams.get('admin');
        if (myParam == 'true') {
            document.getElementById("AdminSection").style.display = "block";
        }
    }
}

function ShowReasonBoxText(reasonTextBox, text) {
    reasonTextBox.style.display = "block";
    reasonTextBox.innerHTML  = text
}

function ShowReasonBoxErrorText(reasonTextBox, str) {
    let message = "<img src=\"imgs/workingBean.png\" width=\"45\" height=\"35\" style=\"margin: 0px 10px;vertical-align: middle;\">" + str + "</img>";
    ShowReasonBoxText(reasonTextBox, message);
}

async function LoadAReason() {
    let reasonTextBox = document.getElementById("Reasonbox");
    ShowReasonBoxText(reasonTextBox, "...");

    try {
        let reason = await reasonsInstance.GetReason();
        if (reason == null) {
            ShowReasonBoxErrorText(reasonTextBox, 'Come back soon for a new reason');
        }
        else {
            ShowReasonBoxText(reasonTextBox, reason);
        }
    }
    catch(error) {
        console.log(error)
        ShowReasonBoxErrorText(reasonTextBox, defaultErrorMessage);
    }
}

async function ResetReasons() {
    let reasonTextBox = document.getElementById("Reasonbox");
    ShowReasonBoxText(reasonTextBox, "Resetting reasons");

    try {
        await reasonsInstance.ResetReasons();
        ShowReasonBoxText(reasonTextBox, "");
    }
    catch(error) {
        console.log(error)
        ShowReasonBoxErrorText(reasonTextBox, defaultErrorMessage);
    }
}

async function AddAReason(reason) {
    let reasonTextBox = document.getElementById("Reasonbox");
    try {
        await reasonsInstance.AddReason(reason);
        ShowReasonBoxText(reasonTextBox, "Reason Added");
    }
    catch(error) {
        console.log(error)
        ShowReasonBoxErrorText(reasonTextBox, defaultErrorMessage);
    }
    
    document.getElementById('AddField').value = ''
}