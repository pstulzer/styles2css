import {ConcatStyleName} from "./concatStyleName";
import {GetFontWeight} from "./getFontWeight";
import {GetFontStyle} from "./getFontStyle";
import {FigmaUnit2css} from "./figmaUnit2css";
import {GetTextCase} from "./getTextCase";
import {GetTextDecoration} from "./getTextDecoration";
import {GetRemValue} from "./getRemValue";

export const GetTextStyleProperties = (setup, style) => {
    const ret = {}
    // console.log("getTextStyleProperties", style);
    ret["id"] = style.id;
    ret["type"] = "text";
    ret["cssname"] = ConcatStyleName(setup, style.name);
    ret["properties"] = [];

    // fontName - family, style
    ret["properties"].push({
        "cssproperty": "font-family",
        "cssname": ConcatStyleName(setup, style.name + "--font-family"),
        "cssvalue": style.fontName.family
    });

    // fontWeight - family, style
    ret["properties"].push({
        "cssproperty": "font-weight",
        "cssname": ConcatStyleName(setup, style.name + "--font-weight"),
        "cssvalue": GetFontWeight(style.fontName.style)
    });

    // fontStyle - family, style
    ret["properties"].push({
        "cssproperty": "font-style",
        "cssname": ConcatStyleName(setup, style.name + "--font-style"),
        "cssvalue": GetFontStyle(style.fontName.style)
    });

    // fontSize
    let fontSize = style.fontSize + FigmaUnit2css();
    if (setup.baseSize !== null) {
        fontSize = GetRemValue(fontSize, setup.baseSize.toString());
    }
    ret["properties"].push({
        "cssproperty": "font-size",
        "cssname": ConcatStyleName(setup, style.name + "--font-size"),
        "cssvalue": fontSize
    });

    // letterSpacing - unit, value - letter-spacing
    if ("letterSpacing" in style && "value" in style.letterSpacing && style.letterSpacing.value !== 0) {
        let ls = Math.round(style.letterSpacing.value * 100) / 100 + FigmaUnit2css(style.letterSpacing.unit)
        if (style.letterSpacing.unit.toLowerCase() === 'percent') {
            ls = ((Math.round(style.fontSize * 100) / 100) / 100) * (Math.round(style.letterSpacing.value * 100) / 100) + FigmaUnit2css()
        }
        // console.log("linletterSpacingeHeight", style.letterSpacing.value, style.letterSpacing.unit, ls);
        ret["properties"].push({
            "cssproperty": "letter-spacing",
            "cssname": ConcatStyleName(setup, style.name + "--letter-spacing"),
            "cssvalue": ls
        });
    }

    // lineHeight - unit, value - line-height
    if ("lineHeight" in style && "value" in style.lineHeight && style.lineHeight.value !== 0) {
        let lh = Math.round(style.lineHeight.value) + FigmaUnit2css(style.lineHeight.unit)
        if (style.lineHeight.unit.toLowerCase() === 'percent') {
            lh = (Math.round(style.lineHeight.value) / 100).toString()
        }
        ret["properties"].push({
            "cssproperty": "line-height",
            "cssname": ConcatStyleName(setup, style.name + "--line-height"),
            "cssvalue": lh
        });
    }
    // paragraphIndent - text-indent
    if ("paragraphIndent" in style && style.paragraphIndent !== 0) {
        ret["properties"].push({
            "cssproperty": "text-indent",
            "cssname": ConcatStyleName(setup, style.name + "--text-indent"),
            "cssvalue": Math.round(style.paragraphIndent * 100) / 100 + FigmaUnit2css()
        });
    }
    // paragraphSpacing - margin-bottom
    if ("paragraphSpacing" in style && style.paragraphSpacing !== 0) {
        ret["properties"].push({
            "cssproperty": "margin-bottom",
            "cssname": ConcatStyleName(setup, style.name + "--margin-bottom"),
            "cssvalue": Math.round(style.paragraphSpacing * 100) / 100 + FigmaUnit2css()
        });
    }
    // textCase  / text-transform: uppercase | lowercase | capitalize;
    if (style.textCase.toLowerCase() !== "original") {
        ret["properties"].push({
            "cssproperty": "text-transform",
            "cssname": ConcatStyleName(setup, style.name + "--text-transform"),
            "cssvalue": GetTextCase()
        });
    }
    // textDecoration / text-decoration: overline |  line-through | underline | underline overline;
    if (style.textDecoration.toLowerCase() !== "none") {
        ret["properties"].push({
            "cssproperty": "text-decoration",
            "cssname": ConcatStyleName(setup, style.name + "--text-decoration"),
            "cssvalue": GetTextDecoration()
        });
    }
    return ret;
}

export const TextClassOutput = (setup, arr = []) => {
    let ret = "";
    if (Array.isArray(arr) && arr.length > 0) {
        for (let index in arr) {
            if (arr[index].type === "text") {
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
