import * as React from "react";
import * as ReactDOM from "react-dom";

import { TagComponent } from "./component/TagComponent";
import { ErrorComponent } from "./component/ErrorComponent";
import { FilterComponent, Item } from "./component/FilterComponent";

import { onAppLoad, onWorkLoad } from "./PageEvent";
import { db } from "./model/db";
import { Purchase } from "./model/Purchase";
import { Mylist } from "./model/Mylist";

const findByQuery = (element: Element, queryString: string): HTMLElement =>
    element.querySelector(queryString) as HTMLElement;

Promise.all([
    db.purchase.findAll(),
    db.mylist
        .findAll()
        .then((o) =>
            o.sort((a, b) => a.mylist_name.localeCompare(b.mylist_name))
        ),
    db.mylistWork.findAll(),
]).then(([purchases, mylists, mylistWorks]) => {
    const findWork = (element: Element): Purchase | null => {
        const workName = findByQuery(element, ".work-name").innerText;
        const makerNmaae = findByQuery(element, ".maker-name").innerText;
        const work = purchases.find(
            (p) => p.maker_name === makerNmaae && p.work_name === workName
        );
        return work as Purchase;
    };

    const workMylistMap = mylistWorks.reduce((acc, lw) => {
        if (!acc.has(lw.workno)) acc.set(lw.workno, []);
        const ml = mylists.filter((lst) =>
            lst.mylist_work_ids.includes(lw.mylist_work_id)
        );
        if (ml.length !== 1)
            throw new Error("MylistWork structure is unexpected");
        acc.get(lw.workno)?.push(ml[0]);
        return acc;
    }, new Map<string, Mylist[]>());

    const workElementMap = new Map<string, Element>();

    let selectedMylistIds: string[] = [];
    const filterElement = (e: Element, mylists: Mylist[]) => {
        if (
            selectedMylistIds.length == 0 ||
            mylists.some((l) => selectedMylistIds.includes(String(l.mylist_id)))
        ) {
            (e as HTMLElement).style.display = "";
        } else {
            (e as HTMLElement).style.display = "none";
        }
    };

    onWorkLoad((e) => {
        if (e.attributes.getNamedItem("extension-dlsite")) return;
        e.attributes.setNamedItem(document.createAttribute("extension-dlsite"));
        const app = document.createElement("div");
        e.append(app);
        const work = findWork(e);
        if (work) {
            const lists = workMylistMap.get(work.workno) || [];
            ReactDOM.render(<TagComponent mylists={lists} />, app);
            workElementMap.set(work.workno, e);
            filterElement(e, lists);
        } else {
            console.error(`Purchase not found`);
            console.error(e);
            ReactDOM.render(<ErrorComponent />, app);
        }
    });
    onAppLoad((e) => {
        // Hide logout
        const logoutMenu = document.querySelector(
            "nav.slide-menu .page-content > div:last-of-type"
        ) as HTMLElement | null;
        if (logoutMenu) logoutMenu.hidden = true;
        // Playlist Filter
        const app = document.createElement("div");
        document.querySelector("nav.slide-menu .page-content")?.append(app);
        const onFilterChange = (values: string[]) => {
            selectedMylistIds = values;
            workElementMap.forEach((e, workno) => {
                const lists = workMylistMap.get(workno) || [];
                filterElement(e, lists);
            });
        };
        ReactDOM.render(
            <FilterComponent
                items={mylists.map((m) => ({
                    value: m.mylist_id,
                    label: m.mylist_name,
                }))}
                onChange={onFilterChange}
            />,
            app
        );
    });
});
