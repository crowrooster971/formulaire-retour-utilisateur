document.getElementById('retourForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const nom = document.getElementById('nom').value;
    const message = document.getElementById('message').value;
    const categorie = document.getElementById('categorie').value;

    const retour = { nom, message, categorie };

    const response = await fetch('/api/retours', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(retour)
    });

    if (response.ok) {
        document.getElementById('retourForm').reset();
        loadRetours();
    } else {
        alert('Erreur lors de la soumission du retour.');
    }
});

async function loadRetours() {
    const response = await fetch('/api/retours');
    const retours = await response.json();
    const retourList = document.getElementById('retourList');
    retourList.innerHTML = '';

    retours.forEach(retour => {
        const li = document.createElement('li');
        li.textContent = `${retour.nom} (${retour.categorie}): ${retour.message}`;
        retourList.appendChild(li);
    });
}

loadRetours();