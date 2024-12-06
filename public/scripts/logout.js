logout();

function logout() {
    document.cookie = "userAuth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    localStorage.removeItem('cart');
    alert("Du er nu logget ud");
    window.location.href = "/";
}
