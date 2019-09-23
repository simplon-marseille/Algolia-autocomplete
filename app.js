//fonction d'affichage de la carte Google maps
//==> à remplacer par Openstreetmap

function initMap() {
  document.getElementById('map').style.display = 'block';
  //On récupère les coordonnées GPS contenue dans l'élément HTML
  const latitude = document.querySelector('a').getAttribute("data-lat");
  const longitude = document.querySelector('a').getAttribute("data-lng");
  var dataFromHTML = {
    lat: parseFloat(latitude),
    lng: parseFloat(longitude)
  };
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 7,
    center: dataFromHTML
  });
  var marker = new google.maps.Marker({
    position: dataFromHTML,
    map: map
  });
}

//fonction permettant d'envoyer une requête HTTP à chaque appuie sur une touche.
const searchAlgoliaPlaces = (event) => {
    fetch("https://places-dsn.algolia.net/1/places/query", {
    method: "POST",
    body: JSON.stringify({ query: event.currentTarget.value })
  })
  .then(response => response.json())
  .then((data) => {
    list.innerHTML = '';
    input.value.length === 0 ? list.style.display = 'none' : list.style.display = 'block';
    data.hits.forEach((item) => {
      //insertion du lien dans la page HTML
      //on insert les coordonnées GPS dans les attributs HTML data-lat et data-lng
      list.insertAdjacentHTML('beforeend', `
    <li>
    <a href id="${item.objectID}" data-lat="${item._geoloc.lat}" data-lng="${item._geoloc.lng}">${item.locale_names.default[0]}</a>
    </li>
      `)
    });

    //On récupère chaque liens et y ajoute un micro permettant d'écouter le click
    //On récupère les lat et long des attributs HTML (data-lat et data-lng)
    const ids = document.querySelectorAll('a');
    ids.forEach((id) => {
        console.log(id);
        let lat = id.getAttribute('data-lat');
        let lng = id.getAttribute('data-lng');
        id.addEventListener('click', (event) => {
            event.preventDefault();
            list.style.display = 'none';
            search.classList.add('search-xs');
            search.classList.remove('search');
            //document.getElementById('map').classList.add('');
            input.value = event.currentTarget.innerText;
            initMap();
        });
    });
  });
  };

  //déclaration de variables
  const search = document.querySelector('.search');
  const list = document.querySelector('#autocomplete');
  const input = document.querySelector("#userInput");

  //On déclenche la fonction 'searchAlgoliaPlaces' lorsque l'utilisateur appuie sur une touche
  input.addEventListener("keyup", searchAlgoliaPlaces);

  //On efface les reponses quand on click n'importe où dans la fenêtre
  document.addEventListener('click', (event) => {
    list.style.display = 'none';
  });

  // Je vous laisse deviner...
  input.addEventListener('focus', (event) => {
    search.classList.add('search');
    search.classList.remove('search-xs');
    input.value = '';
  });
