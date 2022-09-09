import Color from "color";

const blendColors = (colors = []) => {
    if (!Array.isArray(colors))
        return false;
    const args = colors;
    let base = [0, 0, 0, 0];
    let mix;
    let added;
    while (added = args.shift()) {
        if (typeof added[3] === 'undefined') {
            added[3] = 1;
        }
        // check if both alpha channels exist.
        if (base[3] && added[3]) {
            mix = [0, 0, 0, 0];
            // alpha
            mix[3] = 1 - (1 - added[3]) * (1 - base[3]);
            // red
            mix[0] = Math.round((added[0] * added[3] / mix[3]) + (base[0] * base[3] * (1 - added[3]) / mix[3]));
            // green
            mix[1] = Math.round((added[1] * added[3] / mix[3]) + (base[1] * base[3] * (1 - added[3]) / mix[3]));
            // blue
            mix[2] = Math.round((added[2] * added[3] / mix[3]) + (base[2] * base[3] * (1 - added[3]) / mix[3]));
        }
        else if (added) {
            mix = added;
        }
        else {
            mix = base;
        }
        base = mix;
    }
    return mix;
};

const rgb2hex = (color, opacity = 1) => {
    let r = color.r * 255 / 1;
    let g = color.g * 255 / 1;
    let b = color.b * 255 / 1;
    return Color.rgb([r, g, b]).alpha(opacity).hex();
}

const rgbValues = async (localStyles, values = []) => {
    const style = localStyles.pop();
    if ("paints" in style) {
        const localValues = style.paints.map(item => {
            if ("type" in item && item.type === "SOLID") {
                let colorName = "";
                if ("name" in style) {
                    colorName = style.name;
                }
                return {
                    rgb: rgb2hex(item.color),
                    rgba: rgb2hex(item.color, item.opacity),
                    opacity: item.opacity,
                    name: colorName
                }

                // return [item.color.r, item.color.g, item.color.b, item.opacity];
            }

            return;
        });

        if (localValues.length > 0 && localValues[0] !== undefined) {
            values = values.concat(localValues);
        }
    }

    if (localStyles.length === 0) {
        return values;
    } else {
        return await rgbValues(localStyles, values);
    }
}
export const LocalPaintStyles = async (figma) => {
    try {
        const localStyles = figma.getLocalPaintStyles();
        if (Array.isArray(localStyles) && localStyles.length < 1) {
            figma.ui.postMessage({type: "ShowError", value: "No local styles found."});
            return localStyles;
        }
        return await rgbValues(localStyles);
    } catch (err) {
        console.error("processPages Error", err);
        figma.ui.postMessage({type: "ShowError", value: err});
    }
};
