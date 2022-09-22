import {GetPaintStyleProperties} from "./paintStyles";
import {GetEffectStyleProperties} from "./effectStyles";
import {GetTextStyleProperties} from "./textStyles";

const addStyle = async (setup, style, ids, type) => {
    if (style in ids === false) {
        let myStyle = await figma.getStyleById(style);
        if (myStyle !== null && myStyle !== undefined && "id" in myStyle && "name" in myStyle && myStyle.name.charAt(0) !== "_" && myStyle.name.charAt(0) !== ".") {
            let props = [];
            if (type === "paint") {
                props = GetPaintStyleProperties(setup, myStyle);
            }
            if (type === "effect") {
                props = GetEffectStyleProperties(setup, myStyle);
            }
            if (type === "text") {
                props = GetTextStyleProperties(setup, myStyle);
            }
            if ("cssname" in props && props.cssname !== "") {
                ids[style] = props;
            }
        }
    }
    return ids;
}
export const ProcessStyles = async (setup, ids, nodeids) => {
    for (const style of nodeids.fill) {
        ids = await addStyle(setup, style, ids, "paint");
    }
    for (const style of nodeids.stroke) {
        ids = await addStyle(setup, style, ids, "paint");
    }
    for (const style of nodeids.effect) {
        ids = await addStyle(setup, style, ids, "effect");
    }
    for (const style of nodeids.text) {
        ids = await addStyle(setup, style, ids, "text");
    }
    return ids;
}
