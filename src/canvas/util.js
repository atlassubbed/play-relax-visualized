let curId = 0;

const id = () => ++curId;
const isFn = x => typeof x === "function";
const getName = n => isFn(n) ? n.name || "g-el" : n || "text"

export { id, getName };
