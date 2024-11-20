function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}
let username = getCookie("userAuth");
if (!username) {
  location.href = "/";
}

async function spørgBigJoe() {
    let spørgsmål = document.getElementById('spørgInput').value;
    try {
      let response = await fetch('/askJoe/AskJoe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: spørgsmål }),
      });
  
      if (response.ok) {
        const data = await response.json();
        document.getElementById('svar').innerHTML = data.content;
      }
  
    } catch (error) {
      console.error('Error:', error);
    }
  }