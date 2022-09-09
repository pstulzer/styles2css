import {PaintStyles} from "./paintStyles";
import {TextClassOutput, TextStyles} from "./textStyles";
import {BuildColorOutput} from "./buildColorOutput";

export const BuildCss = (figma, setup, styles) => {

    let stylesOutput = "";
    if (setup.lang === "CSS") {
        stylesOutput = stylesOutput + ":root {\n";
    }

    // get the color styles
    stylesOutput = stylesOutput + PaintStyles(figma, setup, styles.paint);

    // get the text styles
    const ts = TextStyles(figma, setup, styles.text);
    setup.useVars = true
    if (setup.useVars === true) {
        stylesOutput = stylesOutput + BuildColorOutput(setup, ts);
    }

    if (setup.lang === "CSS") {
        stylesOutput = stylesOutput + "}";
    }

    stylesOutput = stylesOutput + TextClassOutput(setup, ts);

    console.log("BuildCss", stylesOutput);

    return stylesOutput;

}
