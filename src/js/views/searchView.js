import { elements, elementStrings } from "./base";

export const getInput = () => {
  return elements.searchInput.value;
};

// delete input after enter
export const clearInput = () => {
  elements.searchInput.value = "";
};

// new search - delete old search
export const clearResults = () => {
  elements.searchResList.innerHTML = "";
  elements.searchResPages.innerHTML = "";
};

// Set the limit length of the Tittle
export const limitRecipeTitle = (title, limit = 17) => {
  const newTitle = [];
  if (title.length > limit) {
    title.split(" ").reduce((acc, cur) => {
      if (acc + cur.length <= limit) {
        newTitle.push(cur);
      }
      return acc + cur.length;
    }, 0);
    // return the result
    return `${newTitle.join(" ")} ...`;
  }
  return title;
};

// show the recipe search
const renderRecipe = (recipe) => {
  const markup = `
    <li>
        <a class="results__link" href="#${recipe.id}">
            <figure class="results__fig">
                <img src="https://spoonacular.com/recipeImages/${
                  recipe.image
                }" alt="${recipe.title}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
              </div>
        </a>
    </li>
    `;
  elements.searchResList.insertAdjacentHTML("beforeend", markup);
};

//type: 'prev' or 'next'
const createButton = (page, type) =>
  `<button class="btn-inline results__btn--${type}" data-goto=${
    type === "prev" ? page - 1 : page + 1
  }>
        <span>Page ${type === "prev" ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${
              type === "prev" ? "left" : "right"
            }"></use>
        </svg>
        </button>
`;

const renderButtons = (page, numResults, resPerPage) => {
  const pages = Math.ceil(numResults / resPerPage);
  let button;
  if (page === 1 && pages > 1) {
    // only Button to go to next page
    button = createButton(page, "next");
  } else if (page < pages) {
    // Both Buttons
    button = `${createButton(page, "prev")}
            ${createButton(page, "next")}`;
  } else if (page === pages && pages > 1) {
    // only Button to go to the prev page
    button = createButton(page, "prev");
  }

  elements.searchResPages.insertAdjacentHTML("afterbegin", button);
};

// show all recipes in the search
export const renderResults = (recipes, page = 1, resPerPage = 10) => {
  //render results of current page
  const start = (page - 1) * resPerPage;
  const end = page * resPerPage;

  recipes.slice(start, end).forEach(renderRecipe);
  renderButtons(page, recipes.length, resPerPage);
};
