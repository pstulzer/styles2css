import Color from "color";
import {overlay} from "color-blend";

export const GetColorObject = (arr = [], color = null) => {
    if (color === null) {
        color = arr.shift();
    }
    if (arr.length === 0) return color;

    const bgColor = color.object();
    bgColor.a = 1;
    if ("alpha" in bgColor) {
        bgColor.a = bgColor.alpha;
        delete bgColor.alpha;
    }

    let fgColor = arr.shift();
    fgColor = fgColor.object();
    fgColor.a = 1;
    if ("alpha" in fgColor) {
        fgColor.a = fgColor.alpha;
        delete fgColor.alpha;
    }

    const mixColor = overlay(fgColor, bgColor);
    mixColor.alpha = Math.round(mixColor.a * 1000) / 1000;
    delete mixColor.a;

    return GetColorObject(arr, Color.rgb(mixColor));
}
