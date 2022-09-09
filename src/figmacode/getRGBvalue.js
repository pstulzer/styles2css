import Color from "color";
import {GetDezimalVaue} from "./getDezimalVaue";
import {GetFloatValue} from "./getFloatValue";

export const GetRGBvalue = (i) => {
    if (typeof i === 'object' && i !== null && "color" in i) {
        return Color.rgb([GetDezimalVaue(i.color.r), GetDezimalVaue(i.color.g), GetDezimalVaue(i.color.b), GetFloatValue(i.opacity)])
    }
}
