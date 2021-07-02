const Color = require('color');
const {overlay} = require('color-blend')
const Prism = require('prismjs');
// const PrismLess = require('prismjs/components/prism-less');
// const PrismSass = require('prismjs/components/prism-sass')(Prism);

// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (see documentation).

// This shows the HTML page in "ui.html".
// figma.showUIOptions({ width: 640, height: 120 });
figma.showUI(__html__, {width: 500, height: 600});

const setup = {
    style: "kebab-case",
    lang: "CSS",
    addNodes: false,
    useVars: false,
    baseSize: 16
}

// kebab-case
// camelCase
// PascalCase
// snake_case
const concatName = (str = "") => {
    const regSlash = /(\s*\/\s*)/gmi;
    const regDash = /(\s*-\s*)/gmi;
    const regWhite = /\s+/gmi;
    str = str.replace(regSlash, "-").replace(regDash, "-").replace(regWhite, "-");
    let arr = str.split("-");
    if (setup.style === "kebab-case" || setup.style === "snake_case") {
        arr = arr.map(item => {
            return item.toLowerCase();
        });

        if (setup.style === "kebab-case") {
            return arr.join("-");
        }
        return arr.join("_");
    }
    if (setup.style === "PascalCase" || setup.style === "camelCase") {
        arr = arr.map((item, index) => {
            item = item.toLowerCase();
            if (setup.style === "camelCase" && index === 0) {
                return item;
            }
            return item.charAt(0).toUpperCase() + item.slice(1);
        });
        return arr.join("");
    }
}

// SCSS
// LESS
// CSS
const createColorOutput = (arr = []) => {
    let ret = "";
    if (Array.isArray(arr) && arr.length > 0) {
        for (let index in arr) {
            if (arr[index].type === "color") {
                // console.log("createOutput", arr[index]);
                if (setup.lang === "SCSS") {
                    ret = ret + "$";
                }
                if (setup.lang === "LESS") {
                    ret = ret + "@";
                }
                if (setup.lang === "CSS") {
                    ret = ret + "  --";
                }
                ret = ret + arr[index].cssname + ": " + arr[index].cssvalue + ";\n";
            }
            if (arr[index].type === "text") {
                for (let prop in arr[index].properties) {
                    if (setup.lang === "SCSS") {
                        ret = ret + "$";
                    }
                    if (setup.lang === "LESS") {
                        ret = ret + "@";
                    }
                    if (setup.lang === "CSS") {
                        ret = ret + "  --";
                    }

                    let name = arr[index].properties[prop].cssname;
                    let value = arr[index].properties[prop].cssvalue;

                    if (arr[index].properties[prop].cssproperty === "font-family") {
                        value = "\"" + arr[index].properties[prop].cssvalue + "\"";
                    }
                    ret = ret + name + ": " + value + ";\n";
                }
            }
        }
    }
    return ret;
}

const getValue = (value) => parseFloat(value.replace(/[^0-9.]/g, "").trim());
const getUnit = (value) => value.slice(getValue(value).toString().length).trim();
const getRemValue = (value = "", base = null) => {
    const globalFontSize = "100%";
    if (base === null) {
        base = globalFontSize;
    }
    let ratio = getValue(base);
    let result = getValue(value);

    if (getUnit(base) === "%") {
        ratio = (getValue(base) / 100) * 16;
    }

    if (getUnit(base) === "rem") {
        ratio = getValue(base) * 16;
    }

    // console.log("ratio", getUnit(base), getValue(base), ratio);

    if (getUnit(value) === "em") {
        result = result * ratio;
    }

    if (getUnit(value) != "rem") {
        result = result / ratio;
    }

    return Math.round(result * 10000) / 10000 + "rem";
}
const getDezimalValue = (c) => Math.round(c * 255);
const getFloatValue = (n) => Math.round(n * 1000) / 1000;
const getRGBAValue = (i) => {
    if (typeof i === 'object' && i !== null && "color" in i) {
        return Color.rgb([getDezimalValue(i.color.r), getDezimalValue(i.color.g), getDezimalValue(i.color.b), getFloatValue(i.opacity)])
    }
}
const getColorObject = (arr = [], color = null) => {
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

    return getColorObject(arr, Color.rgb(mixColor));
}
const getPaintStyleProperties = (style) => {
    const ret: { id: string, cssname: string, type: string, color: object, cssvalue: string } = {
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
        ret["cssname"] = concatName(style.name);
        blendStyles = blendStyles.map(item => {
            return getRGBAValue(item);
        });
        ret["color"] = getColorObject(blendStyles);
        ret["cssvalue"] = ret["color"].toString();
    }

    return ret;
}

const figmaUnit2css = (u = "") => {
    switch (u.toLowerCase()) {
        case "pixel":
            return "px"
            break
        case "percent":
            return "%"
            break
        default:
            return "px"
            break
    }
}
const getTextCase = (c = "") => {
    switch (c.toLowerCase()) {
        case "title":
            return "capitalize"
            break
        case "upper":
            return "uppercase"
            break
        case "lower":
            return "lowercase"
            break
        default:
            return "none"
            break
    }
}
const getTextDecoration = (d = "") => {
    switch (d.toLowerCase()) {
        case "strikethrough":
            return "line-through"
            break
        case "underline":
            return "underline"
            break
        default:
            return "none"
            break
    }
}
const getFontStyle = (s = "") => {
    let style = s.split(" ")

    if (style.length > 1) {
        switch (style[1].toLowerCase()) {
            case "italic":
                return "italic"
                break
            case "oblique":
                return "oblique"
                break
            default:
                return "normal"
                break
        }
    } else {
        return "normal"
    }
}
const getFontWeight = (w = "") => {
    let weight = w.split(" ")
    /*
    100	fein	        Thin        (Hairline)
    200	extraleicht	    Extra Light (Ultra Light)
    300	leicht	        Light
    400	normal	        Normal      (Regular)
    500	medium	        Medium
    600	halbfett	    Semi Bold   (Demi Bold)
    700	fett	        Bold
    800	extrafett	    Extra Bold  (Ultra Bold)
    900	schwarz 	    Black       (Heavy)
    950	extraschwarz	Extra Black (Ultra Black)

     */
    switch (weight[0].toLowerCase()) {
        case "fein":
            return 100
            break
        case "haarlinie":
            return 100
            break
        case "thin":
            return 100
            break
        case "extraleicht":
            return 200
            break
        case "extra light":
            return 200
            break
        case "leicht":
            return 300
            break
        case "light":
            return 300
            break
        case "normal":
            return 400
            break
        case "regular":
            return 400
            break
        case "medium":
            return 500
            break
        case "halbfett":
            return 600
            break
        case "semi bold":
            return 600
            break
        case "demi bold":
            return 600
            break
        case "fett":
            return 700
            break
        case "bold":
            return 700
            break
        case "extrafett":
            return 800
            break
        case "extra bold":
            return 800
            break
        case "ultra bold":
            return 800
            break
        case "schwarz":
            return 900
            break
        case "black":
            return 900
            break
        case "heavy":
            return 900
            break
        case "extraschwarz":
            return 950
            break
        case "extra black":
            return 950
            break
        case "ultra black":
            return 950
            break
        default:
            return 400
            break
    }
}
const getTextStyleProperties = (style) => {
    const ret = {}
    if (style !== null && style !== undefined && "id" in style) {
        ret["id"] = style.id;
        ret["type"] = "text";
        ret["cssname"] = concatName(style.name);
        ret["properties"] = [];

        // fontName - family, style
        ret["properties"].push({
            "cssproperty": "font-family",
            "cssname": concatName(style.name + "--font-family"),
            "cssvalue": style.fontName.family
        });

        // fontWeight - family, style
        ret["properties"].push({
            "cssproperty": "font-weight",
            "cssname": concatName(style.name + "--font-weight"),
            "cssvalue": getFontWeight(style.fontName.style)
        });

        // fontStyle - family, style
        ret["properties"].push({
            "cssproperty": "font-style",
            "cssname": concatName(style.name + "--font-style"),
            "cssvalue": getFontStyle(style.fontName.style)
        });

        // fontSize
        let fontSize = style.fontSize + figmaUnit2css();
        if (setup.baseSize !== null) {
            fontSize = getRemValue(fontSize, setup.baseSize.toString());
        }
        ret["properties"].push({
            "cssproperty": "font-size",
            "cssname": concatName(style.name + "--font-size"),
            "cssvalue": fontSize
        });

        // letterSpacing - unit, value - letter-spacing
        if ("letterSpacing" in style && "value" in style.letterSpacing && style.letterSpacing.value !== 0) {
            let ls = Math.round(style.letterSpacing.value * 100) / 100 + figmaUnit2css(style.letterSpacing.unit)
            if (style.letterSpacing.unit.toLowerCase() === 'percent') {
                ls = ((Math.round(style.fontSize * 100) / 100) / 100) * (Math.round(style.letterSpacing.value * 100) / 100) + figmaUnit2css()
            }
            // console.log("linletterSpacingeHeight", style.letterSpacing.value, style.letterSpacing.unit, ls);
            ret["properties"].push({
                "cssproperty": "letter-spacing",
                "cssname": concatName(style.name + "--letter-spacing"),
                "cssvalue": ls
            });
        }

        // lineHeight - unit, value - line-height
        if ("lineHeight" in style && "value" in style.lineHeight && style.lineHeight.value !== 0) {
            let lh = Math.round(style.lineHeight.value) + figmaUnit2css(style.lineHeight.unit)
            if (style.lineHeight.unit.toLowerCase() === 'percent') {
                lh = (Math.round(style.lineHeight.value) / 100).toString()
            }
            ret["properties"].push({
                "cssproperty": "line-height",
                "cssname": concatName(style.name + "--line-height"),
                "cssvalue": lh
            });
        }
        // paragraphIndent - text-indent
        if ("paragraphIndent" in style && style.paragraphIndent !== 0) {
            ret["properties"].push({
                "cssproperty": "text-indent",
                "cssname": concatName(style.name + "--text-indent"),
                "cssvalue": Math.round(style.paragraphIndent * 100) / 100 + figmaUnit2css()
            });
        }
        // paragraphSpacing - margin-bottom
        if ("paragraphSpacing" in style && style.paragraphSpacing !== 0) {
            ret["properties"].push({
                "cssproperty": "margin-bottom",
                "cssname": concatName(style.name + "--margin-bottom"),
                "cssvalue": Math.round(style.paragraphSpacing * 100) / 100 + figmaUnit2css()
            });
        }
        // textCase  / text-transform: uppercase | lowercase | capitalize;
        if (style.textCase.toLowerCase() !== "original") {
            ret["properties"].push({
                "cssproperty": "text-transform",
                "cssname": concatName(style.name + "--text-transform"),
                "cssvalue": getTextCase()
            });
        }
        // textDecoration / text-decoration: overline |  line-through | underline | underline overline;
        if (style.textDecoration.toLowerCase() !== "none") {
            ret["properties"].push({
                "cssproperty": "text-decoration",
                "cssname": concatName(style.name + "--text-decoration"),
                "cssvalue": getTextDecoration()
            });
        }
    }
    return ret;
}
const createTextClassOutput = (arr = []) => {
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

                    if (setup.useVars === true) {
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

const nodes: SceneNode[] = [];
let lastName = "";
let xPos = 0;
let yPos = 0;
const addNodes = (styles) => {
    if (setup.addNodes === true) {
        let counter = 0;
        styles.forEach(style => {
            if ("color" in style) {


                let name = style.cssname.split("-")[1];
                let color = style.color.object();
                let rgbColor: { r: number, g: number, b: number, alpha: number } = {r: 0, g: 0, b: 0, alpha: 1};
                rgbColor.r = Math.round((color.r / 255) * 1000) / 1000;
                rgbColor.g = Math.round((color.g / 255) * 1000) / 1000;
                rgbColor.b = Math.round((color.b / 255) * 1000) / 1000;

                let fillOpacity = rgbColor.alpha;
                delete rgbColor.alpha;

                const rect = figma.createRectangle();
                rect.resize(20, 100);
                xPos = xPos + 25;
                if (lastName === "") {
                    lastName = name;
                    xPos = 0;
                }
                if (lastName !== name) {
                    lastName = name;
                    xPos = 0;
                    yPos = yPos + 105;
                }
                rect.x = xPos;
                rect.y = yPos;
                rect.fills = [{
                    blendMode: "NORMAL",
                    type: 'SOLID',
                    color: rgbColor,
                    opacity: fillOpacity,
                    visible: true
                }];
                figma.currentPage.appendChild(rect);
                nodes.push(rect);
                counter++;
            }
        })
    }
}

const getUniqueIDs = (ids = []) => {
    // keep only unique style IDs
    return ids.filter((elem, index, self) => {
        return index == self.indexOf(elem);
    });
}

let textStyleIDs = [];
let paintStyleIDs = [];
let effectStyleIDs = [];
const getStyleIDs = (node, type) => {
    // keep only the ones with a style ID
    let nodeWithID = [];
    if (type in node && node[type].length > 0) {
        nodeWithID.push(node[type]);
    }

    if (nodeWithID.length > 0) {
        // keep only the style IDs
        let styleID = nodeWithID.map(item => {
            return item;
        });
        return styleID;
    }
    return [];
}

const walkNodes = (node) => {
    paintStyleIDs = getUniqueIDs(paintStyleIDs.concat(getStyleIDs(node, 'fillStyleId')));
    paintStyleIDs = getUniqueIDs(paintStyleIDs.concat(getStyleIDs(node, 'strokeStyleId')));
    effectStyleIDs = getUniqueIDs(effectStyleIDs.concat(getStyleIDs(node, 'effectStyleId')));
    textStyleIDs = getUniqueIDs(textStyleIDs.concat(getStyleIDs(node, 'textStyleId')));

    if ("children" in node) {
        for (const child of node.children) {
            walkNodes(child)
        }
    }
}

const main = () => {
    walkNodes(figma.root);

    console.log("1rem", getRemValue("10px", "62.5%"));
    console.log("0.625rem", getRemValue("10px", "100%"));
    console.log("0.625rem", getRemValue("10px", "16px"));
    console.log("0.5556rem", getRemValue("10px", "18px"));
    console.log("1rem", getRemValue("10px", "10px"));
    console.log("0.625rem???", getRemValue("10px", "1rem"));

    let stylesOutput = "";
    if (setup.lang === "CSS") {
        stylesOutput = stylesOutput + ":root {\n";
    }

    // get the paint styles
    let paintStyles = [];
    paintStyleIDs.forEach(item => {
        let myStyle = figma.getStyleById(item);
        if (myStyle !== null && myStyle !== undefined && "id" in myStyle) {
            let props = getPaintStyleProperties(myStyle);

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
    addNodes(sortedPaintStyles);
    stylesOutput = stylesOutput + "/* color styles */\n" + createColorOutput(sortedPaintStyles);

    // get the text styles
    let textStyles = textStyleIDs.map(item => {
        return getTextStyleProperties(figma.getStyleById(item));
    });


    if (setup.useVars === true) {
        stylesOutput = stylesOutput + createColorOutput(textStyles);
    }
    if (setup.lang === "CSS") {
        stylesOutput = stylesOutput + "}";
    }
    stylesOutput = stylesOutput + "\n/* text styles */\n";
    stylesOutput = stylesOutput + createTextClassOutput(textStyles);

    figma.ui.postMessage({type: "Code", data: Prism.highlight(stylesOutput, Prism.languages.css, 'css')})

    if (setup.addNodes === true) {
        figma.currentPage.selection = nodes;
        figma.viewport.scrollAndZoomIntoView(nodes);
    }
}

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = msg => {
    // One way of distinguishing between different types of messages sent from
    // your HTML page is to use an object with a "type" property like this.

    if (msg.type === 'generate') {
        figma.ui.postMessage({type: "Code", data: ""})

        if ("data" in msg) {
            setup.style = msg.data.style;
            setup.lang = msg.data.lang;
        }
        main();
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
