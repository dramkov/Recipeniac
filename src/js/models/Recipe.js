import axios from "axios";
import { apiKey } from "../config";

export default class Recipe {
  constructor(id) {
    this.id = id;
  }
  async getRecipe() {
    try {
      const res = await axios(
        `https://api.spoonacular.com/recipes/informationBulk?ids=${this.id}&apiKey=${apiKey}`
      );
      this.title = res.data[0].title;
      this.minutes = res.data[0].readyInMinutes;
      this.servings = res.data[0].servings;
      this.img = res.data[0].image;
      this.url = res.data[0].sourceUrl;
      this.ingredients = res.data[0].extendedIngredients;
      //   console.log(res);
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  }

  // parseIngredients () {
  //   const unitsLong = ['tablespoons']
  //   const newIngredients = this.ingredients.map(el => {
  //     // 1) Uniform units

  //     // 2) Remove parentheses

  //     // 3) Parse ingredients into count, unit and ingredient
  //   });
  //   this.ingredients = newIngredients
  //   }
}
