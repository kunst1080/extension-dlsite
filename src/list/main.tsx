import * as React from "react";
import * as ReactDOM from "react-dom";

import { FilterTextComponnet } from "./component/FilterTextComponent";
import { FilterCheckComponnet } from "./component/FilterCheckComponent";

class Item {
    private ref: HTMLElement;

    price: number;
    isPurchased: boolean;
    isFavorited: boolean;
    waribikiRate: number;
    typeName: string;

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
        this.typeName = ref.querySelector(".work_category")?.textContent || "";
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
        const className = "hide-price";
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
        const className = "hide-waribiki";
        const v = parseInt(text);
        allItems.forEach((it) => {
            if (v > 0 && (it.waribikiRate < v || it.isPurchased)) {
                it.addClass(className);
            } else {
                it.removeClass(className);
            }
        });
    };
    const filterType =
        (className: string, typeName: string) => (checked: boolean) => {
            const regexp = new RegExp(typeName);
            allItems.forEach((it) => {
                if (!checked && it.typeName.match(typeName)) {
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
            <FilterCheckComponnet
                onUpdate={filterType("hide-manga", "マンガ")}
                defaultChecked={true}
            >
                マンガ
            </FilterCheckComponnet>
            <FilterCheckComponnet
                onUpdate={filterType("hide-cg", "CG")}
                defaultChecked={true}
            >
                CG・イラスト
            </FilterCheckComponnet>
            <FilterCheckComponnet
                onUpdate={filterType("hide-voice", "ボイス")}
                defaultChecked={true}
            >
                ボイス・ASMR
            </FilterCheckComponnet>
            <FilterCheckComponnet
                onUpdate={filterType("hide-novel", "ノベル")}
                defaultChecked={true}
            >
                ノベル
            </FilterCheckComponnet>
            <FilterCheckComponnet
                onUpdate={filterType(
                    "hide-game",
                    "シミュレーション|ロールプレイング|動画|アドベンチャー|音楽"
                )}
                defaultChecked={true}
            >
                ゲーム・動画
            </FilterCheckComponnet>
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

const includePaths = ["/wishlist"];
const excludePaths = ["/work/", "/mypage", "/cart", "/pay/", "/download/"];
if (
    includePaths.some((p) => location.pathname.includes(p)) ||
    !excludePaths.some((p) => location.pathname.includes(p))
) {
    window.addEventListener("load", main, false);
}
