function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
}
  
  let username = getCookie("userAuth");
  if (!username) {
    location.href = "/";
}


visKurv();

function visKurv() {
    let kurv = JSON.parse(localStorage.getItem('cart')) || [];
    let total = 0;
    let kurvDiv = document.getElementById('kurv');
    kurvDiv.innerHTML = '';

    for (let vare of kurv) {
        let vareDiv = document.createElement('div');
        vareDiv.classList.add('product-item-cart');

        let vareDetailsDiv = document.createElement('div');
        vareDetailsDiv.classList.add('product-details');
        vareDetailsDiv.innerHTML = `
            <span>${vare.productName}</span>
            <span>${vare.price} kr</span>
        `;

        let removeButton = document.createElement('button');
        removeButton.innerHTML = 'Fjern';
        removeButton.addEventListener('click', function () {
            fjernFraKurv(vare.productName);
        });

        vareDiv.appendChild(vareDetailsDiv);
        vareDiv.appendChild(removeButton);
        kurvDiv.appendChild(vareDiv);

        total += vare.price;
    }

    let totalDiv = document.createElement('div');
    totalDiv.classList.add('total-container');
    totalDiv.innerHTML = `<span>Total: </span> <span>${total} kr</span>`;
    kurvDiv.appendChild(totalDiv);
}

function fjernFraKurv(productName) {
    let kurv = JSON.parse(localStorage.getItem('cart')) || [];
    kurv = kurv.filter(vare => vare.productName !== productName);
    localStorage.setItem('cart', JSON.stringify(kurv));
    visKurv();
}


async function checkUd() {
    let telefonnummer = document.getElementById('telefonnummer').value;

    try {
        let response = await fetch('/product/checkUd', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ phone: telefonnummer })
        });

        if (response.ok) {
            alert('Tak for din bestilling');
            localStorage.removeItem('cart');
            telefonnummer.value = '';
            visKurv();
        } else {
            alert('Der skete en fejl');
        }

    } catch (error) {
        console.error('Der skete en fejl', error);
    }
}