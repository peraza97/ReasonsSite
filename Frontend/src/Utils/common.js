function NavigateToPage(htmlPage) {
    var newPage = htmlPage;
    const urlSearchParams = new URLSearchParams(window.location.search);
    const myParam = urlSearchParams.get('admin');
    if (myParam == 'true') {
        newPage += '?admin=true'
    }
    window.location = newPage
}

function IsLoggedIn() {
    // If cookie not present, go to login page
    if (!IsCookiePresent(COOKIENAME)) {
        if (window.location.pathname.split('/').pop() != 'index.html') {
            NavigateToPage('index.html')
        }
        return false;
    }
    return true;
}