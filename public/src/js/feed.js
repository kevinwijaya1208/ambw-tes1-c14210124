var shareImageButton = document.querySelector('#install');
var createPostArea = document.querySelector('#create-post');
// var closeCreatePostModalButton = document.querySelector('#close-create-post-modal-btn');
var sharedMomentsArea = document.querySelector('#shared-moments');

function openCreatePostModal() {
  if (deferredPrompt) {
    deferredPrompt.prompt();

    deferredPrompt.userChoice.then(function (choiceResult) {
      console.log(choiceResult.outcome);

      if (choiceResult.outcome === 'dismissed') {
        console.log('User cancelled installation');
      } else {
        console.log('User added to home screen');
      }
    });

    deferredPrompt = null;
  }

  // if ('serviceWorker' in navigator) {
  //   navigator.serviceWorker.getRegistrations()
  //     .then(function(registrations) {
  //       for (var i = 0; i < registrations.length; i++) {
  //         registrations[i].unregister();
  //       }
  //     })
  // }
}

function closeCreatePostModal() {
  createPostArea.style.display = 'none';
}

shareImageButton.addEventListener('click', openCreatePostModal);



// Currently not in use, allows to save assets in cache on demand otherwise
function onSaveButtonClicked(event) {
  console.log('clicked');
  if ('caches' in window) {
    caches.open('user-requested')
      .then(function (cache) {
        cache.add('https://httpbin.org/get');
        cache.add('/src/images/sf-boat.jpg');
      });
  }
}

function clearCards() {
  while (sharedMomentsArea.hasChildNodes()) {
    sharedMomentsArea.removeChild(sharedMomentsArea.lastChild);
  }
}

// function createCard(data) {
//   var cardWrapper = document.createElement('div');
//   cardWrapper.className = 'shared-moment-card mdl-card mdl-shadow--2dp';
//   var cardTitle = document.createElement('div');
//   cardTitle.className = 'mdl-card__title';
//   cardTitle.style.backgroundImage = 'url(' + data.image + ')';
//   cardTitle.style.backgroundSize = 'cover';
//   cardTitle.style.height = '180px';
//   cardWrapper.appendChild(cardTitle);
//   var cardTitleTextElement = document.createElement('h2');
//   cardTitleTextElement.style.color = 'white';
//   cardTitleTextElement.className = 'mdl-card__title-text';
//   cardTitleTextElement.textContent = data.title;
//   cardTitle.appendChild(cardTitleTextElement);
//   var cardSupportingText = document.createElement('div');
//   cardSupportingText.className = 'mdl-card__supporting-text';
//   cardSupportingText.textContent = data.location;
//   cardSupportingText.style.textAlign = 'center';
//   // var cardSaveButton = document.createElement('button');
//   // cardSaveButton.textContent = 'Save';
//   // cardSaveButton.addEventListener('click', onSaveButtonClicked);
//   // cardSupportingText.appendChild(cardSaveButton);
//   cardWrapper.appendChild(cardSupportingText);
//   componentHandler.upgradeElement(cardWrapper);
//   sharedMomentsArea.appendChild(cardWrapper);
// }

function createCard(data) {
  var cardWrapper = document.createElement('div');
  cardWrapper.className = 'col';

  var card = document.createElement('div');
  card.className = 'card border-danger';

  var cardImage = document.createElement('img');
  cardImage.src = data.image;
  cardImage.className = 'card-img-top image-fluid';
  cardImage.style.width = "180.91xpx"
  cardImage.style.height = "200px"

  cardImage.alt = '...';
  card.appendChild(cardImage);

  var cardBody = document.createElement('div');
  cardBody.className = 'card-body border-top border-danger';
  // cardBody.style.borderTop = "border border-danger"

  var cardTitle = document.createElement('h5');
  cardTitle.className = 'card-title';
  cardTitle.textContent = data.location;
  cardBody.appendChild(cardTitle);

  var cardButton = document.createElement('button');
  cardButton.type = 'button';
  cardButton.className = 'btn btn-danger';
  cardButton.textContent = 'Description';
  cardBody.appendChild(cardButton);

  card.appendChild(cardBody);

  cardWrapper.appendChild(card);

  sharedMomentsArea.appendChild(cardWrapper);

  card.addEventListener('click', function () {
    const idParam = encodeURIComponent(data.id)
    const locationParam = encodeURIComponent(data.location);
    const imageParam = encodeURIComponent(data.image);
    const descriptionParam = encodeURIComponent(data.description);

    //   // Store data in localStorage
    //   // localStorage.setItem('id', idParam);
    //   // localStorage.setItem('location', locationParam);
    //   // localStorage.setItem('image', imageParam);
    //   // localStorage.setItem('description', descriptionParam);
    const dataObject = {
      id: idParam,
      location: locationParam,
      image: imageParam,
      description: descriptionParam
    };
    localStorage.setItem(idParam, JSON.stringify(dataObject));

    const url = `detail.html?id=${idParam}`;
    window.location.href = url;
  });
}


function updateUI(data) {
  clearCards();
  for (var i = 0; i < data.length; i++) {
    createCard(data[i]);
  }
}

var url = 'https://whatdoiknow-f2429-default-rtdb.firebaseio.com/posts.json';
var networkDataReceived = false;

fetch(url)
  .then(function (res) {
    return res.json();
  })
  .then(function (data) {
    networkDataReceived = true;
    console.log('From web', data);
    var dataArray = [];
    for (var key in data) {
      dataArray.push(data[key]);
    }
    updateUI(dataArray);
  });

if ('indexedDB' in window) {
  readAllData('posts')
    .then(function (data) {
      if (!networkDataReceived) {
        console.log('From cache', data);
        updateUI(data);
      }
    });
}
