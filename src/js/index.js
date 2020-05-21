import Search from "./models/Search";
import Recipe from "./models/Recipe";
import List from "./models/List";
import Likes from "./models/Likes";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import * as listView from "./views/listView";
import * as likesView from "./views/likesView";
import { elements, renderLoader, clearLoader } from "./views/base";

// ---GLobal state of the app
// - Search object
// - Current recipe object
// - Shopping list object
// - Liked recipes

const state = {};

//-------------SEACH CONTROLLER----------
const controlSearch = async () => {
  // 1) Get query from view
  const query = searchView.getInput();

  if (query) {
    //2) New search object and add to state
    state.search = new Search(query);

    //3) Prepare UI for results
    searchView.clearInput(); // delete input after enter
    searchView.clearResults(); // new search - delete old search
    renderLoader(elements.searchRes); // loader
    try {
      //4) Search for recipes
      await state.search.getResults();

      //5) Render results on UI
      clearLoader(); // delete the loader after results are ready
      searchView.renderResults(state.search.result);
    } catch (err) {
      alert("something wrong with the search...");
      clearLoader();
    }
  }
};

elements.searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  controlSearch();
});

elements.searchResPages.addEventListener("click", (e) => {
  const btn = e.target.closest(".btn-inline");
  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10);
    searchView.clearResults();
    searchView.renderResults(state.search.result, goToPage);
  }
});

//-------------RECIPE CONTROLLER----------
const controlRecipe = async () => {
  // Get ID from url
  const id = window.location.hash.replace("#", "");
  // console.log(id);

  if (id) {
    // Prepare UI for changes
    recipeView.clearRecipe();
    renderLoader(elements.recipe);

    // Create new recipe object
    state.recipe = new Recipe(id);

    try {
      // Get recipe data
      await state.recipe.getRecipe();

      // Render recipe
      // console.log(state.recipe);
      clearLoader();
      recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
    } catch (err) {
      console.log(err);
      alert("Error processing recipe!");
    }
  }
};

// window.addEventListener("hashchange", controlRecipe);
// window.addEventListener("load", controlRecipe);
["hashchange", "load"].forEach((event) =>
  window.addEventListener(event, controlRecipe)
);

//-------------LIST CONTROLLER----------

const controlList = () => {
  //create a new list If there is none yet
  if (!state.list) state.list = new List();

  // Add ech ingredient to the list and UI
  state.recipe.ingredients.forEach((el) => {
    const item = state.list.addItem(el.amount, el.unit, el.name);
    listView.renderItem(item);
  });
};

//Hande delete and update list item events
elements.shopping.addEventListener("click", (e) => {
  const id = e.target.closest(".shopping__item").dataset.itemid;

  //Handle the delete button
  if (e.target.matches(".shopping__delete, .shopping__delete *")) {
    //delete from state
    state.list.deleteItem(id);

    //delete from UI
    listView.deleteItem(id);

    // handle the count update
  } else if (e.target.matches(".shopping__count-value")) {
    const val = parseFloat(e.target.value, 10);
    state.list.updateCount(id, val);
  }
});

//-------------LIKE CONTROLLER----------

const controlLike = () => {
  if (!state.likes) state.likes = new Likes();
  const currentID = state.recipe.id;
  //User has NOT yet liked curren recipe
  if (!state.likes.isLiked(currentID)) {
    //Add like to the state
    const newLike = state.likes.addLike(
      currentID,
      state.recipe.title,
      state.recipe.img
    );
    //Toggle the like button
    likesView.toggleLikeBtn(true);

    //Add like to UI list
    likesView.renderLike(newLike);

    //User HAS liked curren recipe
  } else {
    //Remove like to the state
    state.likes.deleteLike(currentID);

    //Toggle the like button
    likesView.toggleLikeBtn(false);

    //Remove like from UI list
    likesView.deleteLike(currentID);
  }
  likesView.toggleLikeMenu(state.likes.getNumLikes());
};

//Restore Liked recipes on page load
window.addEventListener("load", () => {
  state.likes = new Likes();

  // restore likes
  state.likes.readStorage();

  //toggle like menu button
  likesView.toggleLikeMenu(state.likes.getNumLikes());

  // Render the existing likes
  state.likes.likes.forEach((like) => likesView.renderLike(like));
});

elements.recipe.addEventListener("click", (e) => {
  if (e.target.matches(".recipe__btn--add, .recipe__btn--add *")) {
    //add igretients to shopping list
    controlList();
  } else if (e.target.matches(".recipe__love, .recipe__love *")) {
    // Like controller
    controlLike();
  }
});
