import {ConcatStyleName} from "./concatStyleName";
import {GetRGBvalue} from "./getRGBvalue";
import {GetColorObject} from "./getColorObject";

import {decomposeTSR, applyToPoint} from 'transformation-matrix';

import {inv, multiply} from "mathjs";

const identityMatrixHandlePositions = [
    [0, 1, 0],
    [0.5, 0.5, 1],
    [1, 1, 1]
]

const convertTransformToGradientHandles = (transform) => {
    const inverseTransform = inv(transform)

    // point matrix
    const mp = multiply(inverseTransform, identityMatrixHandlePositions)

    return [
        { x: mp[0][0], y: mp[1][0] },
        { x: mp[0][1], y: mp[1][1] },
        { x: mp[0][2], y: mp[1][2] }
    ]
};

// import {applyMatrixToPoint} from "@figma-plugin/helpers";

// https://ch.mathworks.com/de/discovery/affine-transformation.html
// https://www.figma.com/plugin-docs/api/Transform


const convertToDegree = (matrix) => {
    const values = [...matrix[0], ...matrix[1]];
    const a = values[0];
    const b = values[1];
    const angle = Number(((Math.atan2(b, a) * (180 / Math.PI)) + 90).toFixed(2));

    return angle <= 0 ? angle + 360 : angle;
}

const getDegreeForMatrix = (matrix) => {
    const degrees = convertToDegree(matrix) || 0;
    return `${degrees}deg`;
}

export const GetPaintStyleProperties = (setup, style) => {
    const ret = {
        id: "",
        cssname: "",
        type: "color",
        color: {},
        cssvalue: ""
    }

    let blendStyles = [];
    blendStyles = style.paints.filter(item => {

        /* TODO: add gradient handler
            IMAGE
            GRADIENT_LINEAR
            GRADIENT_DIAMOND
            GRADIENT_RADIAL
            GRADIENT_ANGULAR
         */

        if (item.type === "GRADIENT_LINEAR") {
            // background: linear-gradient(135deg, rgba(255,50,54,1) 0%,rgba(44,114,28,0) 100%);
            // console.log("blendStyles", item);
            const matrix = {
                a: item.gradientTransform[0][0], c: item.gradientTransform[0][1], e: item.gradientTransform[0][2],
                b: item.gradientTransform[1][0], d: item.gradientTransform[1][1], f: item.gradientTransform[1][2]
            }

            let test = applyToPoint(matrix, [0,1]);
            // console.log("blendStyles", item.gradientTransform[0], item.gradientTransform[1], style.name);
            const stops = item.gradientStops.map(stop => {
                const color = GetRGBvalue(stop).toString();
                const position =  Math.round(stop.position * 100) ;
                return color + " " + `${position}%`;
            });

            // const test = extractLinearGradientParamsFromTransform(item.gradientTransform);

            const deg = getDegreeForMatrix(item.gradientTransform);
            const dec = decomposeTSR(matrix);
            const rot = Number(dec.rotation.angle * (180/Math.PI) + 90);

            // console.log("convertToDegree", style.name, deg, dec.translate, dec.scale, dec.rotation.angle);

            // console.log("blendStyles", style.name, deg, stops, test);
            // console.log("Test", convertTransformToGradientHandles(item.gradientTransform));


/*
Gradient/Linear/Left-Right
[0.9999997019767761, -2.5533894592341504e-14, 0]
[3.2659767207706856e-15, 5.989549160003662, 0.5]

Gradient/Linear/Top-Bottom
[7.318608652440162e-8, 1, 3.6637359812630166e-15]
[-11.60742473602295, 3.459282140738651e-7, 0.5]

Gradient/Linear/TopLeft-BottomRight
[0.4999999701976776, 0.5, 5.551115123125783e-17]
[-0.17087316513061523, 0.17087316513061523, 0.5]


Gradient/Linear/BottomLeft-TopRight
[1.6410281658172607, 0.5342448949813843, -0.6180725693702698]
[0.15381531417369843, 0.2244238406419754, 0.30459892749786377]
*/

/*
{
    "type": "GRADIENT_LINEAR",
    "visible": true,
    "opacity": 1,
    "blendMode": "NORMAL",
    "gradientStops": [
        {
            "color": {
                "r": 0.9718533158302307,
                "g": 0.02915559895336628,
                "b": 0,
                "a": 1
            },
            "position": 0
        },
        {
            "color": {
                "r": 0.2600601315498352,
                "g": 0.8126881122589111,
                "b": 0,
                "a": 0
            },
            "position": 1
        }
    ],
    "gradientTransform": [
        [
            0.7518820762634277,
            0.8086519241333008,
            1.249000902703301e-16
        ],
        [
            -0.8086519241333008,
            0.3061760365962982,
            0.5
        ]
    ]
}
*/
        }
        if (item.type === "GRADIENT_DIAMOND") {
            // radial-gradient(56.1% 122.79% at 50% 53.05%, #FFC701 0%, rgba(255, 227, 78, 0) 100%);
            // console.log("Diamond", item);
        }
        if (item.type === "GRADIENT_RADIAL") {
            // radial-gradient(49.39% 49.39% at 42.8% 45.73%, #01C2FF 0%, rgba(78, 138, 255, 0) 100%);
            // console.log("Radial", item);
        }
        if (item.type === "GRADIENT_ANGULAR") {
            // conic-gradient(from 189.71deg at 50% 53.05%, #8F01FF 0deg, rgba(78, 138, 255, 0) 360deg);
            // console.log("Angular", item);
        }


        if (item.type === "SOLID") {
            return item.type.toUpperCase() === "SOLID";
        }
    });

    // console.log("blendStyles", blendStyles);
    if (blendStyles.length > 0) {
        ret["id"] = style.id;
        ret["cssname"] = ConcatStyleName(setup, style.name);
        blendStyles = blendStyles.map(item => {
            return GetRGBvalue(item);
        });
        ret["color"] = GetColorObject(blendStyles);
        ret["cssvalue"] = ret["color"].toString();
    }

    return ret;
}
