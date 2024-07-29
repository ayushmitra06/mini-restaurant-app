document.addEventListener("DOMContentLoaded", () => {
  const menuForm = document.getElementById("menu-form");
  const token = localStorage.getItem("token");
  const logoutBtn = document.getElementById("logout");
  const menuItemsContainer = document.getElementById("menu-items"); 

  if (!token) {
    window.location.href = "login.html";
    return;
  }


  logoutBtn.addEventListener("click", function logout() {
    localStorage.removeItem("token");
    window.location.href = 'login.html'
  });

  menuForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const newItem = {
      imageURL: document.getElementById("imageURL").value,
      title: document.getElementById("title").value,
      description: document.getElementById("description").value,
      price: document.getElementById("price").value,
      ratings: document.getElementById("ratings").value,
    };

    try {
      const response = await fetch(`https://server-app-std6.onrender.com/menu`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newItem),
      });
      // const addItem = await response.json();
      menuForm.reset();
    } catch (error) {
      console.error("Error adding menu item:", error);
    }
  });


});
