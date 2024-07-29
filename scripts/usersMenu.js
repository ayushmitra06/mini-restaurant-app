document.addEventListener("DOMContentLoaded", () => {
  const menuItemsContainer = document.getElementById("menu-items");
  const sortPriceSelect = document.getElementById("sort-price");
  const sortRatingsSelect = document.getElementById("sort-ratings");
  const priceRangeSlider = new Slider('#price-range', {
    formatter: function(value) {
      return '$' + value[0] + ' - $' + value[1];
    }
  });
  const priceRangeLabel = document.getElementById("price-range-label");
  const applyFilterButton = document.getElementById("apply-filter");

  let menuItems = [];

  async function fetchItems() {
    try {
      const response = await fetch(`https://server-app-std6.onrender.com/menu`);
      menuItems = await response.json();
      renderMenuItems(menuItems);
    } catch (e) {
      console.log("Error fetching menu items:", e.message);
    }
  }

  function renderMenuItems(items) {
    menuItemsContainer.innerHTML = "";
    items.forEach((item) => {
      const menuItem = document.createElement("div");
      menuItem.classList.add("menu-item", "card", "mb-3");

      menuItem.innerHTML = `
        <img src="${item.imageURL}" alt="${item.title}" class="card-img-top">
        <div class="menu-item-info card-body">
          <h3 class="card-title">${item.title}</h3>
          <p class="card-text">${item.description}</p>
          <p class="card-text">Price: $${item.price}</p>
          <p class="card-text">Ratings: ${item.ratings}</p>
        </div>`;

      menuItemsContainer.appendChild(menuItem);
    });
  }

  function sortItems(items, key, order) {
    if (order === "asc") {
      return items.sort((a, b) => a[key] - b[key]);
    } else if (order === "desc") {
      return items.sort((a, b) => b[key] - a[key]);
    }
    return items;
  }

  function filterItems(items, minPrice, maxPrice) {
    return items.filter(item => {
      const price = parseFloat(item.price);
      return (isNaN(minPrice) || price >= minPrice) && (isNaN(maxPrice) || price <= maxPrice);
    });
  }

  sortPriceSelect.addEventListener("change", () => {
    const sortedItems = sortItems([...menuItems], "price", sortPriceSelect.value);
    renderMenuItems(sortedItems);
  });

  sortRatingsSelect.addEventListener("change", () => {
    const sortedItems = sortItems([...menuItems], "ratings", sortRatingsSelect.value);
    renderMenuItems(sortedItems);
  });

  applyFilterButton.addEventListener("click", () => {
    const priceRange = priceRangeSlider.getValue();
    priceRangeLabel.textContent = `Price range: $${priceRange[0]} - $${priceRange[1]}`;
    const filteredItems = filterItems(menuItems, priceRange[0], priceRange[1]);
    renderMenuItems(filteredItems);
  });

  fetchItems();
});
