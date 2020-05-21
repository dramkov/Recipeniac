import uniqid from "uniqid";

export default class List {
  constructor() {
    this.items = [];
  }

  addItem(amount, unit, name) {
    const item = {
      id: uniqid(),
      amount,
      unit,
      name,
    };
    this.items.push(item);
    return item;
  }

  deleteItem(id) {
    const index = this.items.findIndex((el) => el.id === id);
    // [2,4,8] splice(1,2) -> returns [4,8] orginal array is [2]
    // [2,4,8] slice(1,1) -> returns 4, orginal array is [2,4,8]
    this.items.splice(index, 1);
  }

  updateCount(id, newCount) {
    this.items.find((el) => el.id === id).amount = newCount;
  }
}
