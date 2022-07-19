const main = () => {
    const allItems = document.querySelectorAll<HTMLElement>(
        "#search_result_img_box > li, #wishlist_work tr, .n_worklist tr, .n_worklist_item"
    );

    // init
    allItems.forEach((e) => {
        if (e.querySelector(".btn_dl")) {
            e.classList.add("mask-purchased");
        } else if (
            !location.pathname.includes("/wishlist/") &&
            e.querySelector(".btn_favorite_in")
        ) {
            e.classList.add("mask-favorited");
        }
    });
};

window.addEventListener("load", main, false);
