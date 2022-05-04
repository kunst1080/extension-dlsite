import * as React from "react";
import * as ReactDOM from "react-dom";

import { TagComponent } from "./component/TagComponent";
import { onAppLoad, onWorkLoad } from "./PageEvent";

const delayMain = () => {
    console.log("aaa");
    const works = document.querySelectorAll(
        "#app .page-content .list-work .work"
    );
    const dbname = localStorage.dbnames.match(/"(\w*)"/)[1];
    console.log(dbname);
    const request = indexedDB.open(dbname);
    request.onsuccess = (event) => {
        const db = (event.target as IDBRequest).result as IDBDatabase;
        const trans = db.transaction("Mylist", "readonly");
        const store = trans.objectStore("Mylist");
        const request = store.openCursor();
        request.onsuccess = (event) => {
            const cur = (event.target as IDBRequest)
                .result as IDBCursorWithValue;
            if (cur) {
                console.log(cur.key);
                cur.continue();
            }
        };
    };
};

onWorkLoad((e) => {
    if (e.attributes.getNamedItem("extension-dlsite")) return;
    e.attributes.setNamedItem(document.createAttribute("extension-dlsite"));
    const app = document.createElement("div");
    e.append(app);
    ReactDOM.render(<TagComponent />, app);
});
onAppLoad((e) => {
    console.log(e);
});
