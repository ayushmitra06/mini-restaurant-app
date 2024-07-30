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

  const prevPageButton = document.getElementById("prev-page");
  const nextPageButton = document.getElementById("next-page");
  const pageNumbers = document.getElementById("page-numbers");

  const itemsPerPage = 3;
  let currentPage = 1;
  let totalPages = 1;

  let menuItems = [];

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
          <button onclick="">Order Now</button>
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
      const isAboveMinPrice = isNaN(minPrice) || price >= minPrice;
      const isBelowMaxPrice = isNaN(maxPrice) || price <= maxPrice;
      return isAboveMinPrice && isBelowMaxPrice;
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
