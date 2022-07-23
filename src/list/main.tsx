import * as React from "react";
import * as ReactDOM from "react-dom";

import { FilterTextComponnet } from "./component/FilterTextComponent";

class Item {
    private ref: HTMLElement;

    price: number;
    isPurchased: boolean;
    isFavorited: boolean;
    waribikiRate: number;

    constructor(ref: HTMLElement) {
        this.ref = ref;
        this.price = parseInt(
            ref
                .querySelector<HTMLElement>(".work_price")
                ?.textContent?.replace(",", "") || "0"
        );
        this.isPurchased = ref.querySelector(".btn_dl") != null;
        this.isFavorited = ref.querySelector(".btn_favorite_in") != null;
        this.waribikiRate = parseInt(
            ref.querySelector<HTMLElement>(".type_sale")?.textContent || "0"
        );
    }

    addClass(className: string) {
        this.ref.classList.add(className);
    }

    removeClass(className: string) {
        this.ref.classList.remove(className);
    }
}

const main = () => {
    const allItems: Item[] = [];
    document
        .querySelectorAll<HTMLElement>(
            "#search_result_img_box > li, #wishlist_work tr, .n_worklist tr, .n_worklist_item"
        )
        .forEach((e) => {
            // init
            const it = new Item(e);
            if (it.isPurchased) {
                it.addClass("mask-purchased");
            } else if (
                !location.pathname.includes("/wishlist/") &&
                it.isFavorited
            ) {
                it.addClass("mask-favorited");
            }
            allItems.push(it);
        });

    const filterPrice = (text: string) => {
        const className = "mask-price";
        const v = parseInt(text);
        allItems.forEach((it) => {
            if (v > 0 && (it.price > v || it.isPurchased)) {
                it.addClass(className);
            } else {
                it.removeClass(className);
            }
        });
    };
    const filterWaribiki = (text: string) => {
        const className = "mask-waribiki";
        const v = parseInt(text);
        allItems.forEach((it) => {
            if (v > 0 && (it.waribikiRate < v || it.isPurchased)) {
                it.addClass(className);
            } else {
                it.removeClass(className);
            }
        });
    };

    const app = document.createElement("div");
    app.className = "custom-filter";
    document.querySelector("#header")?.append(app);
    ReactDOM.render(
        <div>
            <FilterTextComponnet onUpdate={filterPrice}>
                販売価格
            </FilterTextComponnet>
            <FilterTextComponnet onUpdate={filterWaribiki}>
                割引率
            </FilterTextComponnet>
        </div>,
        app
    );
};

window.addEventListener("load", main, false);
