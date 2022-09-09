import Prism from "prismjs";
import {GetAllIDs} from "./computeIDs";
import {BuildCss} from "./buildCss";

const setup = {
    style: "kebab-case",
    lang: "CSS",
    addNodes: false,
    useVars: false,
    baseSize: 16
}

const main = async (setup) => {
    try {
        let styles = await GetAllIDs(figma.root, {paint: [], effect: [], text: []});
        let output = BuildCss(figma, setup, styles);
        figma.ui.postMessage({type: "Code", data: Prism.highlight(output, Prism.languages.css, 'css')});
    } catch (err) {
        console.error("main", err);
    }
}

figma.showUI(__html__, {width: 500, height: 600});
figma.ui.onmessage = msg => {
    if (msg.type === 'generate') {
        figma.ui.postMessage({type: "Code", data: ""})

        if ("data" in msg) {
            setup.style = msg.data.style;
            setup.lang = msg.data.lang;
        }

        main(setup);
    }

    if (msg.type === 'getname') {
        figma.ui.postMessage({type: "Name", data: figma.root.name})
    }

    if (msg.type === 'cancel') {
        // Make sure to close the plugin when you're done. Otherwise the plugin will
        // keep running, which shows the cancel button at the bottom of the screen.
        figma.closePlugin();
    }
};
figma.on("currentpagechange", () => {
    // console.log("currentpagechange");
});
figma.on("run", async () => {
    // const localStyles = await LocalPaintStyles(figma);
    /*
    if (localStyles.length > 0) {
        figma.ui.postMessage(localStyles.length);
    }

     */
});
