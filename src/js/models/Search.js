import axios from "axios";
import { apiKey } from "../config";

export default class Search {
  constructor(query) {
    this.query = query;
  }
  async getResults() {
    try {
      const res = await axios(
        `https://api.spoonacular.com/recipes/search?query=${this.query}&number=100&apiKey=${apiKey}`
      );
      this.result = res.data.results;
      // console.log(this.result);
      console.log(res);
    } catch (error) {
      alert(error);
    }
  }
}
