// Generated by CoffeeScript 1.10.0

/**
 * 修改自 simple-virtual-dom
 * @date 2016-01-21 19:39:03
 */
'use strict';
var PROPS, REORDER, REPLACE, TEXT, applyPatches, dfsWalk, each, patch, ref, removeElementAttr, reorderChildren, setElementAttr, setProps, toArray;

REPLACE = 0;

REORDER = 1;

PROPS = 2;

TEXT = 3;

ref = require('./util'), setElementAttr = ref.setElementAttr, removeElementAttr = ref.removeElementAttr, toArray = ref.toArray, each = ref.each;

patch = function(node, patches) {
  var walker;
  walker = {
    index: 0
  };
  dfsWalk(node, walker, patches);
};

dfsWalk = function(node, walker, patches) {
  var child, currentPatches, i, len;
  currentPatches = patches[walker.index];
  len = node.childNodes ? node.childNodes.length : 0;
  if (node._component) {
    len = 0;
  }
  i = 0;
  while (i < len) {
    child = node.childNodes[i];
    walker.index++;
    dfsWalk(child, walker, patches);
    i++;
  }
  if (currentPatches) {
    applyPatches(node, currentPatches);
  }
};

applyPatches = function(node, currentPatches) {
  var currentPatch, j, len1;
  for (j = 0, len1 = currentPatches.length; j < len1; j++) {
    currentPatch = currentPatches[j];
    switch (currentPatch.type) {
      case REPLACE:
        node.parentNode.replaceChild(currentPatch.node.render(), node);
        break;
      case REORDER:
        reorderChildren(node, currentPatch.moves);
        break;
      case PROPS:
        setProps(node, currentPatch.props);
        break;
      case TEXT:
        if (node.textContent) {
          node.textContent = currentPatch.content;
        } else {
          node.nodeValue = currentPatch.content;
        }
        break;
      default:
        throw new Error('Unknown patch type ' + currentPatch.type);
    }
  }
};

setProps = function(node, props) {
  var key, results, value;
  results = [];
  for (key in props) {
    if (props[key] === void 0) {
      if (key !== '_mc') {
        results.push(removeElementAttr(node, key));
      } else {
        results.push(void 0);
      }
    } else {
      value = props[key];
      results.push(setElementAttr(node, key, value));
    }
  }
  return results;
};

reorderChildren = function(node, moves) {
  var maps, staticNodeList;
  staticNodeList = toArray(node.childNodes);
  maps = {};
  each(staticNodeList, function(node) {
    var key;
    if (node.nodeType === 1) {
      key = node.getAttribute('key');
    }
    if (key) {
      maps[key] = node;
    }
  });
  each(moves, function(move) {
    var el, index, insertNode;
    index = move.index;
    if (move.type === 0) {
      if (staticNodeList[index] === node.childNodes[index]) {
        el = node.childNodes[index];
        if (el._element && el._element.destroy) {
          el._element.destroy();
        }
        node.removeChild(el);
      }
      staticNodeList.splice(index, 1);
    } else if (move.type === 1) {
      insertNode = maps[move.item.key] ? maps[move.item.key] : typeof move.item === 'object' ? move.item.render() : document.createTextNode(move.item);
      staticNodeList.splice(index, 0, insertNode);
      node.insertBefore(insertNode, node.childNodes[index] || null);
    }
  });
};

patch.REPLACE = REPLACE;

patch.REORDER = REORDER;

patch.PROPS = PROPS;

patch.TEXT = TEXT;

module.exports = patch;
