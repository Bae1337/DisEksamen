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