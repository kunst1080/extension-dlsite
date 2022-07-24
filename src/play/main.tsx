import * as React from "react";
import * as ReactDOM from "react-dom";

import { TagComponent } from "./component/TagComponent";
import { ErrorComponent } from "./component/ErrorComponent";
import { FilterComponent } from "./component/FilterComponent";

import { onAppLoad, onWorkLoad } from "./PageEvent";
import { db } from "./model/db";
import { Purchase } from "./model/Purchase";
import { Mylist } from "./model/Mylist";

const findByQuery = (
    element: Element,
    queryString: string
): HTMLElement | null => element.querySelector<HTMLElement>(queryString);

const compareString = (a: string, b: string): number => {
    const max = Math.min(a.length, b.length);
    for (let i = 0; i < max; i++) {
        if (a.charCodeAt(i) > b.charCodeAt(i)) {
            return 1;
        } else if (a.charCodeAt(i) < b.charCodeAt(i)) {
            return -1;
        }
    }
    return 0;
};

const sortMylist = (lists: Mylist[]): Mylist[] =>
    lists.sort((a, b) => compareString(a.mylist_name, b.mylist_name));

Promise.all([db.purchase.findAll(), db.mylist.findAll().then(sortMylist)]).then(
    ([purchases, mylists]) => {
        const findWork = (element: Element): Purchase | undefined => {
            const workName = findByQuery(
                element,
                `[class*="_workName__"]`
            )?.innerText;
            const makerName = findByQuery(
                element,
                `[class*="_makerName__"]`
            )?.innerText;
            const work = purchases.find(
                (p) => p.maker_name === makerName && p.work_name === workName
            );
            return work;
        };

        const workMylistMap = mylists.reduce((acc, lst) => {
            lst.worknos.forEach((no) => {
                if (!acc.has(no)) acc.set(no, []);
                acc.get(no)?.push(lst);
            });
            return acc;
        }, new Map<string, Mylist[]>());

        const workElementMap = new Map<string, HTMLElement>();

        let selectedMylistIds: string[] = [];
        const filterElement = (e: HTMLElement, mylists: Mylist[]) => {
            if (
                selectedMylistIds.length == 0 ||
                (selectedMylistIds.includes("-1") && mylists.length == 0) ||
                mylists.some((l) =>
                    selectedMylistIds.includes(String(l.mylist_id))
                )
            ) {
                e.style.display = "";
            } else {
                e.style.display = "none";
            }
        };

        onWorkLoad((e: HTMLElement) => {
            if (e.attributes.getNamedItem("extension-dlsite")) return;
            e.attributes.setNamedItem(
                document.createAttribute("extension-dlsite")
            );
            const app = document.createElement("div");
            e.append(app);
            const work = findWork(e);
            if (work) {
                const lists = workMylistMap.get(work.workno) || [];
                ReactDOM.render(
                    <TagComponent mylists={sortMylist(lists)} />,
                    app
                );
                workElementMap.set(work.workno, e);
                filterElement(e, lists);
            } else {
                console.error(`Purchase not found`);
                console.error(e);
                ReactDOM.render(<ErrorComponent />, app);
            }
        });
        onAppLoad(() => {
            // Hide logout
            const logoutMenu = document.querySelector<HTMLElement>(
                `[class^="Menu_item__"]:last-of-type`
            );
            if (logoutMenu) logoutMenu.hidden = true;
            // Mylist Filter
            const app = document.createElement("div");
            document.querySelector(`[class^="Menu_nav__"]`)?.append(app);
            const onFilterChange = (values: string[]) => {
                selectedMylistIds = values;
                workElementMap.forEach((e, workno) => {
                    const lists = workMylistMap.get(workno) || [];
                    filterElement(e, lists);
                });
            };
            const options = [
                {
                    value: "-1",
                    label: "<マイリストなし>",
                },
            ].concat(
                mylists.map((m) => ({
                    value: m.mylist_id,
                    label: m.mylist_name,
                }))
            );
            ReactDOM.render(
                <FilterComponent options={options} onChange={onFilterChange} />,
                app
            );
        });
    }
);
