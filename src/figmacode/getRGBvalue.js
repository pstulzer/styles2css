import Color from "color";
import {GetDezimalVaue} from "./getDezimalVaue";
import {GetFloatValue} from "./getFloatValue";

export const GetRGBvalue = (i) => {
    if (typeof i === 'object' && i !== null && "color" in i) {
        let o = null;
        if ("opacity" in i) {
            o = i.opacity;
        }
        if ("a" in i.color) {
            o = i.color.a;
        }
        return Color.rgb([GetDezimalVaue(i.color.r), GetDezimalVaue(i.color.g), GetDezimalVaue(i.color.b), GetFloatValue(o)]);
    }
}
