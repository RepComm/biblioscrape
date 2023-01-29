export function xmlFilter(meta, accept) {
  let currentNode = meta.node;
  let currentType = meta.type;
  meta.includeNode = false;
  meta.parseChildren = false;
  accept(meta);
  if (meta.includeNode) {
    meta.result.push(currentNode);
  }
  if (meta.parseChildren) {
    if (currentNode instanceof Array) {
      console.log("is Array");
    } else {
      for (let key in currentNode) {
        // if (key.startsWith("@_")) {
        //   if (currentNode.attributes === undefined) currentNode.attributes = {};

        //   currentNode.attributes[key.substring(2)] = currentNode[key];
        // } else {
        meta.type = key;
        meta.node = currentNode[key];
        // meta.node.tagName = key;

        xmlFilter(meta, accept);
        // }
      }
    }
  }

  return meta;
}