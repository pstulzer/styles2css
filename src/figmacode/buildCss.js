import {EffectClassOutput} from "./effectStyles";
import {TextClassOutput} from "./textStyles";
import {BuildColorOutput} from "./buildColorOutput";

export const BuildCss = async (figma, setup, styles) => {
    let stylesOutput = "";
    if (setup.lang === "CSS") {
        stylesOutput = stylesOutput + ":root {\n";
    }

    let myStyles = {
        color: [],
        effect: [],
        text: []
    };

    for (const style of Object.values(styles)) {
        if ("type" in style) {
            if (style.type === "color") {
                myStyles.color.push(style);
            }
            if (style.type === "effect") {
                myStyles.effect.push(style);
            }
            if (style.type === "text") {
                myStyles.text.push(style);
            }
        }
    }

    myStyles.color = myStyles.color.sort((a, b) => (a.cssname > b.cssname) ? 1 : -1);
    myStyles.effect = myStyles.effect.sort((a, b) => (a.cssname > b.cssname) ? 1 : -1);
    myStyles.text = myStyles.text.sort((a, b) => (a.cssname > b.cssname) ? 1 : -1);

    // get the color styles
    if (myStyles.color.length > 0) {
        stylesOutput = stylesOutput + "\n/* color variables */\n" + BuildColorOutput(setup, myStyles.color);
    }

    // get the text styles
    if (setup.useVars === "on") {
        if (myStyles.text.length > 0) {
            stylesOutput = stylesOutput + "\n/* text variables */\n" + BuildColorOutput(setup, myStyles.text);
        }
        if (myStyles.effect.length > 0) {
            stylesOutput = stylesOutput + "\n/* effect variables */\n" + BuildColorOutput(setup, myStyles.effect);
        }
    }
    if (setup.lang === "CSS") {
        stylesOutput = stylesOutput + "}\n";
    }
    if (myStyles.text.length > 0) {
        stylesOutput = stylesOutput + "\n/* text classes for your convenience */\n" + TextClassOutput(setup, myStyles.text);
    }
    if (myStyles.effect.length > 0) {
        stylesOutput = stylesOutput + "\n/* effect classes for your convenience */\n" + EffectClassOutput(setup, myStyles.effect);
    }

    return stylesOutput;
}
