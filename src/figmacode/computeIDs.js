const getStyleIDs = (node, type) => {
    let nodeWithID = [];
    if (type in node && node[type].length > 0) {
        nodeWithID.push(node[type]);
    }

    if (nodeWithID.length > 0) {
        let styleID = nodeWithID.map(item => {
            return item;
        });
        return styleID;
    }
    return [];
};
export const ProcessIDs = (node) => {
    return {
        "fill": getStyleIDs(node, 'fillStyleId'),
        "stroke": getStyleIDs(node, 'strokeStyleId'),
        "effect": getStyleIDs(node, 'effectStyleId'),
        "text": getStyleIDs(node, 'textStyleId')
    };
}
