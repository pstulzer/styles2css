import {ConcatStyleName} from "./concatStyleName";
import {GetRGBvalue} from "./getRGBvalue";
import {GetColorObject} from "./getColorObject";
import {BuildColorOutput} from "./buildColorOutput";

const getPaintStyleProperties = (setup, style) => {
    const ret = {
        id: "",
        cssname: "",
        type: "color",
        color: {},
        cssvalue: ""
    }

    let blendStyles = [];
    blendStyles = style.paints.filter(item => {
        /*
        // TODO: add gradient handler
        if (item.type === "GRADIENT_LINEAR") {
            console.log("blendStyles", item);
        }
        */
        return item.type.toUpperCase() === "SOLID";
    });

    if (blendStyles.length > 0) {
        ret["id"] = style.id;
        ret["cssname"] = ConcatStyleName(setup, style.name);
        blendStyles = blendStyles.map(item => {
            return GetRGBvalue(item);
        });
        ret["color"] = GetColorObject(blendStyles);
        ret["cssvalue"] = ret["color"].toString();
    }

    return ret;
}

export const PaintStyles = (figma, setup, styles) => {
    // get the paint styles
    let paintStyles = [];
    styles.forEach(item => {
        let myStyle = figma.getStyleById(item);
        if (myStyle !== null && myStyle !== undefined && "id" in myStyle) {
            let props = getPaintStyleProperties(setup, myStyle);
            // console.log(props);

            if (props.cssname !== "") {
                let addProp = true;

                paintStyles.filter(item => {
                    if (item.cssname === props.cssname) {
                        addProp = false;
                    }
                })

                if (addProp) {
                    paintStyles.push(props);
                }
            }
        }
    });

    let sortedPaintStyles = paintStyles.sort((a, b) => (a.cssname > b.cssname) ? 1 : -1);
    return "/* color styles */\n" + BuildColorOutput(setup, sortedPaintStyles);
}
