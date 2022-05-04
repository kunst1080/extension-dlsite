import * as React from "react";
import * as ReactDOM from "react-dom";

import { TagComponent } from "./component/TagComponent";
import { onAppLoad, onWorkLoad } from "./PageEvent";
import { db } from "./model/db";

onWorkLoad((e) => {
    if (e.attributes.getNamedItem("extension-dlsite")) return;
    e.attributes.setNamedItem(document.createAttribute("extension-dlsite"));
    const app = document.createElement("div");
    e.append(app);
    ReactDOM.render(<TagComponent />, app);
});
onAppLoad((e) => {
    console.log("app init");
    db.purchase.findAll().then((c) => console.log(c[0]));
});
