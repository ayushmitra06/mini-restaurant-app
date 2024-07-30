document.addEventListener("DOMContentLoaded", () => {
  const menuItemsContainer = document.getElementById("menu-items");
  const prevPageButton = document.getElementById("prev-page");
  const nextPageButton = document.getElementById("next-page");
  const pageNumbers = document.getElementById("page-numbers");

  const itemsPerPage = 3;
  let currentPage = 1;
  let totalPages = 1;
  let menuItems = [];

  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "login.html";
    return;
  }

  async function fetchItems() {
    try {
      const response = await fetch(`https://server-app-std6.onrender.com/menu`);
      menuItems = await response.json();
      totalPages = Math.ceil(menuItems.length / itemsPerPage);
      renderMenuItems(menuItems);
      updatePaginationControls();
    } catch (e) {
      console.log("Error fetching menu items:", e.message);
    }
  }

  function renderMenuItems(items) {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const itemsToRender = items.slice(start, end);
    menuItemsContainer.innerHTML = "";
    itemsToRender.forEach((item) => {
      const menuItem = document.createElement("div");
      menuItem.classList.add("menu-item");

      menuItem.innerHTML = `
        <img src="${item.imageURL}" alt="${item.title}">
        <div class="menu-item-info">
          <h3>${item.title}</h3>
          <p>${item.description}</p>
          <p>Price: $${item.price}</p>
          <p>Ratings: ${item.ratings}</p>
          <button onclick="editMenuItem(${item.id})">Edit</button>
          <button onclick="deleteMenuItem(${item.id})">Delete</button>
        </div>`;

      menuItemsContainer.appendChild(menuItem);
    });
  }

  function updatePaginationControls() {
    pageNumbers.textContent = `Page ${currentPage} of ${totalPages}`;
    prevPageButton.disabled = currentPage === 1;
    nextPageButton.disabled = currentPage === totalPages;
  }

  prevPageButton.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderMenuItems(menuItems);
      updatePaginationControls();
    }
  });

  nextPageButton.addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderMenuItems(menuItems);
      updatePaginationControls();
    }
  });

  window.editMenuItem = async (id) => {
    try {
      const response = await fetch(`https://server-app-std6.onrender.com/menu/${id}`);
      const existingItem = await response.json();

      const title = prompt("Enter new title:", existingItem.title);
      const description = prompt("Enter new description:", existingItem.description);
      const price = prompt("Enter new price:", existingItem.price);
      const ratings = prompt("Enter new ratings:", existingItem.ratings);
      const imageURL = existingItem.imageURL;

      const updatedItem = {
        title,
        description,
        price,
        ratings,
        imageURL
      };

      const updateResponse = await fetch(`https://server-app-std6.onrender.com/menu/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedItem),
      });
      const result = await updateResponse.json();
      console.log(result);

      fetchItems();
    } catch (e) {
      console.error("Error editing menu item:", e.message);
    }
  };

  window.deleteMenuItem = async (id) => {
    if (confirm("Are you sure you want to delete this menu item?")) {
      try {
        const response = await fetch(`https://server-app-std6.onrender.com/menu/${id}`, {
          method: "DELETE",
        });
        const result = await response.json();
        console.log(result);
        fetchItems();
      } catch (e) {
        console.error("Error deleting menu item:", e.message);
      }
    }
  };

  fetchItems();
});
