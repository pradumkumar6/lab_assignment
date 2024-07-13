// dashboard.js

// Function to handle form submission
function handleSubmit(event, dishId) {
  event.preventDefault();
  axios
    .post(`/api/dishes/${dishId}/toggle`)
    .then((response) => {
      const updatedDish = response.data;
      updateDishUI(updatedDish);
    })
    .catch((error) => console.error("Error toggling published status:", error));
}

// Function to update UI for a specific dish
function updateDishUI(updatedDish) {
  const dishCard = document.getElementById(`dish_${updatedDish._id}`);
  if (dishCard) {
    dishCard.querySelector(".text-gray-600").textContent = `Published: ${
      updatedDish.isPublished ? "Yes" : "No"
    }`;
  }
}

// Function to fetch updated data from backend
function fetchUpdatedDishes() {
  axios
    .get("/api/dishes")
    .then((response) => {
      const updatedDishes = response.data;
      updatedDishes.forEach((updatedDish) => {
        updateDishUI(updatedDish);
      });
    })
    .catch((error) => console.error("Error fetching updated dishes:", error));
}

// Initial fetch on page load
fetchUpdatedDishes();

// Poll for updates every 5 seconds
setInterval(fetchUpdatedDishes, 5000);

// Event delegation for form submissions
document.addEventListener("submit", function (event) {
  if (
    event.target &&
    event.target.tagName === "FORM" &&
    event.target.classList.contains("toggle-form")
  ) {
    const dishId = event.target.dataset.dishId;
    handleSubmit(event, dishId);
  }
});
