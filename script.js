document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const newCollectionBtn = document.getElementById("new-collection-btn");
  const collectionForm = document.getElementById("collection-form");
  const createCollectionBtn = document.getElementById("create-collection-btn");
  const collectionList = document.querySelector(".collection-list");

  // Initialize an empty array to store collections
  let collections = [];

  // Show the collection form when "Új gyűjtemény létrehozása" button is clicked
  newCollectionBtn.addEventListener("click", () => {
    collectionForm.style.display = "block";
  });

  // Handle new collection creation
  createCollectionBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const title = document.getElementById("collection-title").value;
    const topic = document.getElementById("collection-topic").value;
    const date = document.getElementById("collection-date").value;

    // Check if all fields are filled
    if (title && topic && date) {
      // Create a new collection object
      const collection = {
        id: Date.now(), //The current date
        title,
        topic,
        date,
        items: [], //Array to store the items
      };
      collections.push(collection); // Add the new collection to the collections array
      renderCollections(); // Render the collections to the DOM
      collectionForm.reset(); //Reset the form to empty
      collectionForm.style.display = "none"; //Hide the form back
    } else {
      alert("Minden mezőt ki kell tölteni!"); //Alert if any field is empty
    }
  });

  function renderCollections() {
    collectionList.innerHTML = "";
    collections.forEach((collection) => {
      // Create a new collection card
      const collectionDiv = document.createElement("div");
      collectionDiv.classList.add("collection-item");
      collectionDiv.innerHTML = `
          <div class="card mb-3">
            <div class="card-header">
              <p class="card-text"><strong>Gyűjtemény:</strong> ${
                collection.title
              }</p>
              <p class="card-text"><strong>Témakör:</strong> ${
                collection.topic
              }</p>
              <p class="card-text"><strong>Dátum:</strong> ${
                collection.date
              }</p>
              <button class="btn btn-secondary rename-collection-btn" data-id="${
                collection.id
              }">Átnevezés</button>
              <button class="btn btn-primary add-item-btn" data-id="${
                collection.id
              }">Új elem hozzáadása</button>
              <ul class="list-group item-list" data-id="${collection.id}">
                ${collection.items
                  .map(
                    (item) => `
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                    <p class="card-text"><strong>Cím:</strong> ${item.title}</p>
                      <div class="dropdown">
                        <button class="btn btn-secondary dropdown-toggle" type="button" data-toggle="dropdown">
                          Műveletek
                        </button>
                        <div class="dropdown-menu">
                          <a class="dropdown-item move-item" href="#" data-item-id="${item.id}" data-collection-id="${collection.id}">Áthelyezés</a>
                          <a class="dropdown-item rename-item" href="#" data-item-id="${item.id}" data-collection-id="${collection.id}">Átnevezés</a>
                          <a class="dropdown-item delete-item" href="#" data-item-id="${item.id}" data-collection-id="${collection.id}">Törlés</a>
                        </div>
                      </div>
                    </li>
                  `
                  )
                  .join("")}
              </ul>
            </div>
          </div>
        `;
      // Append the collection card to the collection list
      collectionList.appendChild(collectionDiv);
    });
  }

  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("add-item-btn")) {
      // Handle adding a new item to a collection
      const collectionId = e.target.getAttribute("data-id");
      const itemTitle = prompt("Adja meg az elem címét:");
      if (itemTitle) {
        const collection = collections.find((c) => c.id == collectionId);
        collection.items.push({
          id: Date.now(),
          title: itemTitle,
        });
        renderCollections();
      }
    } else if (e.target.classList.contains("rename-collection-btn")) {
      // Handle renaming a collection
      const collectionId = e.target.getAttribute("data-id");
      const newCollectionTitle = prompt("Új gyűjtemény neve:");
      if (newCollectionTitle) {
        const collection = collections.find((c) => c.id == collectionId);
        collection.title = newCollectionTitle;
        renderCollections();
      }
    } else if (e.target.classList.contains("rename-item")) {
      // Handle renaming an item
      const collectionId = e.target.getAttribute("data-collection-id");
      const itemId = e.target.getAttribute("data-item-id");
      const newItemTitle = prompt("Új cím:");
      if (newItemTitle) {
        const collection = collections.find((c) => c.id == collectionId);
        const item = collection.items.find((i) => i.id == itemId);
        item.title = newItemTitle;
        renderCollections();
      }
    } else if (e.target.classList.contains("delete-item")) {
      // Handle deleting an item
      const collectionId = e.target.getAttribute("data-collection-id");
      const itemId = e.target.getAttribute("data-item-id");
      const collection = collections.find((c) => c.id == collectionId);
      collection.items = collection.items.filter((i) => i.id != itemId);
      renderCollections();
    } else if (e.target.classList.contains("move-item")) {
      // Handle moving an item to another collection by topic
      const collectionId = e.target.getAttribute("data-collection-id");
      const itemId = e.target.getAttribute("data-item-id");
      const newCollectionTopic = prompt("Új gyűjtemény témája:");
      if (newCollectionTopic) {
        const collection = collections.find((c) => c.id == collectionId);
        const item = collection.items.find((i) => i.id == itemId);
        const newCollection = collections.find(
          (c) => c.topic.toLowerCase() === newCollectionTopic.toLowerCase()
        );
        if (newCollection) {
          collection.items = collection.items.filter((i) => i.id != itemId);
          newCollection.items.push(item);
          renderCollections();
        } else {
          alert("Érvénytelen gyűjtemény téma!"); //Alert if there is no id match
        }
      }
    }
  });
});
