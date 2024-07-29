document.addEventListener("DOMContentLoaded", () => {
  const menuItemsContainer = document.getElementById("menu-items");

  const token = localStorage.getItem("token");;

  if(!token){
    window.location.href = "login.html";
    return;
  }

  async function fetchItems() {
    try {
      const response = await fetch(`https://server-app-std6.onrender.com/menu`);
      const menuItems = await response.json();
      // console.log(menuItems);
      renderMenuItems(menuItems);
    } catch (e) {
      console.log("Error fetching menu items:", e.message);
    }
  }

  function renderMenuItems(menuItems) {
    menuItemsContainer.innerHTML = "";
    menuItems.forEach((item) => {
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
        // console.log(result);
        fetchItems();
      } catch (e) {
        console.error("Error deleting menu item:", e.message);
      }
    }
  };

  fetchItems();
});
