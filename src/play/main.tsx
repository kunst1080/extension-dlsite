import * as React from "react";
import * as ReactDOM from "react-dom";

import { TagComponent } from "./component/TagComponent";
import { onAppLoad, onWorkLoad } from "./PageEvent";
import { db } from "./model/db";
import { Purchase } from "./model/Purchase";
import { Mylist } from "./model/Mylist";

const findByQuery = (element: Element, queryString: string): string =>
    (element.querySelector(queryString) as HTMLElement).innerText;

Promise.all([
    db.purchase.findAll(),
    db.mylist.findAll(),
    db.mylistWork.findAll(),
]).then(([purchases, mylists, mylistWorks]) => {
    const findWork = (element: Element): Purchase | undefined => {
        const workName = findByQuery(element, ".work-name");
        const makerNmaae = findByQuery(element, ".maker-name");
        const work = purchases.find(
            (p) => p.maker_name === makerNmaae && p.work_name === workName
        );
        return work;
    };
    const searchMylists = (workno: string): Mylist[] =>
        mylistWorks
            .filter((lw) => lw.workno === workno)
            .flatMap((lw) =>
                mylists.filter((ml) =>
                    ml.mylist_work_ids.includes(lw.mylist_work_id)
                )
            );

    onWorkLoad((e) => {
        if (e.attributes.getNamedItem("extension-dlsite")) return;
        e.attributes.setNamedItem(document.createAttribute("extension-dlsite"));
        const app = document.createElement("div");
        e.append(app);
        const work = findWork(e);
        const lists = work ? searchMylists(work.workno) : [];
        ReactDOM.render(<TagComponent mylists={lists} />, app);
    });
    onAppLoad((e) => {
        console.log("app init");
    });
});
