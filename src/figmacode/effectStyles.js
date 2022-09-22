import {ConcatStyleName} from "./concatStyleName";
import {GetRGBvalue} from "./getRGBvalue";

import {inv, multiply} from "mathjs";

const identityMatrixHandlePositions = [
    [0, 1, 0],
    [0.5, 0.5, 1],
    [1, 1, 1]
]

const convertTransformToGradientHandles = (transform) => {
    const inverseTransform = inv(transform)

    // point matrix
    const mp = multiply(inverseTransform, identityMatrixHandlePositions)

    return [
        {x: mp[0][0], y: mp[1][0]},
        {x: mp[0][1], y: mp[1][1]},
        {x: mp[0][2], y: mp[1][2]}
    ]
};

// import {applyMatrixToPoint} from "@figma-plugin/helpers";

// https://ch.mathworks.com/de/discovery/affine-transformation.html
// https://www.figma.com/plugin-docs/api/Transform


const convertToDegree = (matrix) => {
    const values = [...matrix[0], ...matrix[1]];
    const a = values[0];
    const b = values[1];
    const angle = Number(((Math.atan2(b, a) * (180 / Math.PI)) + 90).toFixed(2));

    return angle <= 0 ? angle + 360 : angle;
}

const getDegreeForMatrix = (matrix) => {
    const degrees = convertToDegree(matrix) || 0;
    return `${degrees}deg`;
}

export const GetEffectStyleProperties = (setup, style) => {
    const ret = {
        id: style.id,
        cssname: ConcatStyleName(setup, style.name),
        type: "effect",
        properties: []
    }

    for (const item of style.effects) {
        if (item.type === "BACKGROUND_BLUR" || item.type === "LAYER_BLUR") {
            let value = Number(item.radius / 2);
            if (value > 0) {
                value = value + "px ";
            }

            if (item.type === "BACKGROUND_BLUR") {
                // return "backdrop-filter: blur(" + value + ")";
                ret["properties"].push({
                    "cssproperty": "backdrop-filter",
                    "cssname": ConcatStyleName(setup, style.name + "--backdrop-filter"),
                    "cssvalue": "blur(" + value + ")"
                });
            }

            if (item.type === "LAYER_BLUR") {
                // return "filter: blur(" + value + ")";
                ret["properties"].push({
                    "cssproperty": "filter",
                    "cssname": ConcatStyleName(setup, style.name + "--filter"),
                    "cssvalue": "blur(" + value + ")"
                });
            }
        }
        if (item.type === "INNER_SHADOW" || item.type === "DROP_SHADOW") {
            let x = item.offset.x;
            if (x > 0) {
                x = x + "px ";
            } else {
                x = x + " ";
            }
            let y = item.offset.y;
            if (y > 0) {
                y = y + "px ";
            } else {
                y = y + " ";
            }
            let r = item.radius;
            if (r > 0) {
                r = r + "px ";
            } else {
                r = r + " ";
            }
            let s = item.spread;
            if (s > 0) {
                s = s + "px ";
            } else {
                s = "";
            }
            let value = x + y + r + s + GetRGBvalue(item);

            if (ret["properties"].length > 0) {
                let prop = ret["properties"].pop();
                value = value + ", " + prop.cssvalue;
            }

            if (item.type === "INNER_SHADOW") {
                value = "inset " + value;
            }

            ret["properties"].push({
                "cssproperty": "box-shadow",
                "cssname": ConcatStyleName(setup, style.name + "--box-shadow"),
                "cssvalue": value
            });
        }
    }
    // console.log("blendStyles", ret);

    return ret;
}

export const EffectClassOutput = (setup, arr = []) => {
    let ret = "";
    if (Array.isArray(arr) && arr.length > 0) {
        for (let index in arr) {
            if (arr[index].type === "effect") {
                if (setup.lang === "SCSS") {
                    ret = ret + "@mixin " + arr[index].cssname + " {\n";
                }
                if (setup.lang === "LESS") {
                    ret = ret + "." + arr[index].cssname + "() {\n";
                }
                if (setup.lang === "CSS") {
                    ret = ret + "." + arr[index].cssname + " {\n";
                }

                for (let prop in arr[index].properties) {
                    let name = arr[index].properties[prop].cssname;
                    let property = arr[index].properties[prop].cssproperty;
                    let value = arr[index].properties[prop].cssvalue;
                    if (arr[index].properties[prop].cssproperty === "font-family") {
                        value = "\"" + arr[index].properties[prop].cssvalue + "\"";
                    }

                    if (setup.useVars === "on") {
                        if (setup.lang === "CSS") {
                            ret = ret + "\t" + property + ": " + "var(--" + name + ");\n";
                        }
                        if (setup.lang === "LESS") {
                            ret = ret + "\t" + property + ": " + "@" + name + ";\n";
                        }
                        if (setup.lang === "SCSS") {
                            ret = ret + "\t" + property + ": " + "$" + name + ";\n";
                        }
                    } else {
                        ret = ret + "\t" + property + ": " + value + ";\n";
                    }
                }

                ret = ret + "}\n\n";
            }
        }
    }

    return ret;
}

