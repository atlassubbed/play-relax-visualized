import { val, comp } from "atlas-munchlax";
import { asap } from "./util";

let id = 0;
// only update if the number changed
const shouldUpd = (p, n) => p.length !== n.length;
const completed = val([], shouldUpd);
const pending = val([], shouldUpd);
const remove = (isDone, query, tau) => {
  const todos = isDone ? completed : pending;
  todos(todos().filter(t => !query(t)), tau);
}
const add = (isDone, todo, tau) => {
  const todos = isDone ? completed : pending;
  todos([todo, ...todos()], tau);
}

// using an autorun to automatically keep completed and pending lists up-to-date
const create = (isDone=false) => {
  const todo = val({id: id++, text: "", date: new Date, priority: 1, isDone});
  add(isDone, todo);
  comp(() => {
    const { isDone: nextIsDone } = todo();
    if (nextIsDone !== isDone){
      remove(isDone, t => t === todo, asap);
      add(nextIsDone, todo, asap);
      isDone = nextIsDone;
    }
  })
  return todo;
}
const update = (todo, fields={}, tau) => todo(Object.assign(todo(), fields), tau);

export { completed, pending, add, remove, create, update };
