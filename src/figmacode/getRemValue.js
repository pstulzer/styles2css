import {ExtractUnit} from "./extractUnit";
import {ExtractValue} from "./extractValue";

export const GetRemValue = (value = "", base = null) => {
    const globalFontSize = "100%";
    if (base === null) {
        base = globalFontSize;
    }
    let ratio = ExtractValue(base);
    let result = ExtractValue(value);

    if (ExtractUnit(base) === "%") {
        ratio = (ExtractValue(base) / 100) * 16;
    }

    if (ExtractUnit(base) === "rem") {
        ratio = ExtractValue(base) * 16;
    }

    // console.log("ratio", getUnit(base), getValue(base), ratio);

    if (ExtractUnit(value) === "em") {
        result = result * ratio;
    }

    if (ExtractUnit(value) != "rem") {
        result = result / ratio;
    }

    return Math.round(result * 10000) / 10000 + "rem";
}
