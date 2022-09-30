function SetCookie(cname, cvalue, exHours) {
    const d = new Date();
    d.setTime(d.getTime() + (exHours * 60 * 60 * 1000));
    let expires = "expires="+d.toUTCString();
    const domain = "domain=peraza97.github.io;path=/";
    document.cookie = cname + "=" + cvalue + ";" + expires + ";" + domain;
}
  
function GetCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
        c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
        }
    }
    return "";
}

function IsCookiePresent(cname) {
    if (GetCookie(cname) == "") {
        console.log("Cookie not present");
        return false
    }
    return true
}