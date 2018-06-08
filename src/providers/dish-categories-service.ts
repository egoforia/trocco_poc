import { Injectable } from '@angular/core';

@Injectable()
export class DishCategoriesService {
    categories: Array<any>;

    findAll(dishes) {
        this.categories = dishes.map((dish) => dish.category);
        this.categories = Array.from(new Set(this.categories));
        return this.categories;
    }

    findDishesByCategory(category, dishesCollection) {
        return dishesCollection.filter((dish) => dish.category === category);
    }
}
