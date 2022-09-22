import Prism from "prismjs";
import {ProcessIDs} from "./computeIDs";
import {ProcessStyles} from "./computeStyles";
import {BuildCss} from "./buildCss";
import {CustomTimeout} from "./customTimeout";

const setup = {
    style: "kebab-case",
    lang: "CSS",
    addNodes: false,
    useVars: false,
    baseSize: 16
}

const main = async (setup) => {
    try {
        let styles = await mainLoop(setup, figma.root);
        let output = await BuildCss(figma, setup, styles);
        figma.ui.postMessage({type: "Code", data: Prism.highlight(output, Prism.languages.css, 'css')});
    } catch (err) {
        console.error("main", err);
    }
}

const mainLoop = async (setup, node, ids = {}) => {
    let nodeids = ProcessIDs(node);
    ids = await ProcessStyles(setup, ids, nodeids);
    let counter = Object.keys(ids).length;
    if (counter > 0) {
        figma.ui.postMessage({type: "STYLES", value: counter});
    }

    await CustomTimeout(1)
        .then(async () => {
            if ("children" in node) {
                for (const child of node.children) {
                    await mainLoop(setup, child, ids);
                }
            }
        })
        .catch(err => {
            return new Error("Sorry " + err);
        });
    return ids;
};

figma.showUI(__html__, {width: 500, height: 600});
figma.ui.onmessage = msg => {
    if (msg.type === 'generate') {
        if ("data" in msg) {
            setup.style = msg.data.style;
            setup.lang = msg.data.lang;
            setup.useVars = msg.data.usevars;
        }
        main(setup);
    }

    if (msg.type === 'getname') {
        figma.ui.postMessage({type: "Name", data: figma.root.name})
    }

    if (msg.type === 'cancel') {
        figma.closePlugin();
    }
};
figma.on("currentpagechange", () => {
    // console.log("currentpagechange");
});
figma.on("run", () => {
    // console.log("run");
});
