const allItems = document.querySelectorAll<HTMLElement>(
    "#search_result_img_box > li, #wishlist_work tr, .n_worklist tr, .n_worklist_item, .swiper-slide"
);

// init
allItems.forEach((e) => {
    if (e.querySelector(".btn_dl")) {
        e.classList.add("mask-purchased");
    }
});
