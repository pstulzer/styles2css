// import { colorToRgb, rgbToHex } from "./colorUtility";

function convertToDegree(matrix) {
    const values = [...matrix[0], ...matrix[1]];
    const a = values[0];
    const b = values[1];
    const angle = Number(((Math.atan2(b, a) * (180 / Math.PI)) + 90).toFixed(2));

    return angle <= 0 ? angle + 360 : angle;
}

function getDegreeForMatrix(matrix) {
    const degrees = convertToDegree(matrix) || 0;
    return `${degrees}deg`;
}

function getGradientStopByAlpha(color) {
    if (color.a == 1) {
        return rgbToHex(color.r, color.g, color.b);
    } else {
        return colorToRgb(color, color.a);
    }
}

function getGradientStop(stops) {
    const colors = stops.map( stop => {
        // console.log(stop.position)
        const position = Math.round(stop.position * 100 * 100) / 100
        const color = getGradientStopByAlpha(stop.color);
        return color + " " + position + "%";
    }).join(',\n');
    return colors
}

export function cssGradient(paint) {
    // console.log("in css Gradient");
    // console.log(paint);

    const { gradientTransform, gradientStops } = paint;
    const gradientTransformString = getDegreeForMatrix(gradientTransform);

    const gradientStopString = "Stops"; //getGradientStop(gradientStops)


    // console.log(gradientStopString);

    return `linear-gradient( ${gradientTransformString},\n${gradientStopString})`;
}
