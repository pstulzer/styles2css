import {CustomTimeout} from "./customTimeout";

const getUniqueIDs = (ids = []) => {
    // keep only unique style IDs
    return ids.filter((elem, index, self) => {
        return index == self.indexOf(elem);
    });
};

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
};

export const GetAllIDs = async (node, ids, counter = 0) => {
    counter++;

    ids.paint = getUniqueIDs(ids.paint.concat(getStyleIDs(node, 'fillStyleId')));
    ids.paint = getUniqueIDs(ids.paint.concat(getStyleIDs(node, 'strokeStyleId')));
    ids.effect = getUniqueIDs(ids.effect.concat(getStyleIDs(node, 'effectStyleId')));
    ids.text = getUniqueIDs(ids.text.concat(getStyleIDs(node, 'textStyleId')));

    if ("children" in node) {
        let children = node.children;
        for (let x = 0; x < children.length; x = x + 1) {
            await GetAllIDs(children[x], ids, counter);
        }
        return ids;
    } else {
        return ids;
    }
}
