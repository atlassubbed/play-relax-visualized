import { diff } from "atlas-relax";
import { t } from "atlas-relax-jsx-pragmas"; /**@jsx t */
import { val, obs } from "atlas-munchlax";
import TodoEntry from "./TodoEntry";
import "./todo-entry.css";
import "./todo-entries.css";

// don't want getting id and sort to trigger dependency
const DumbEntries = ({data: { todos, sort }}) => {
  return !todos.length ? `there are no ${name} todos` :
    todos
      .sort((a, b) => b()[sort] - a()[sort])
      .map(todo => <TodoEntry key={todo().id} todo={todo}/>)
}

const TodoEntries = obs(({data: { todos, name, create }}, node) => {
  const sort = (node.sort = node.sort || val("date"))();
  const toggleSort = () => node.sort(sort === "date" ? "priority" : "date")
  return [
    <h3 class="todo-list-header">{name} todos</h3>,
    create && <button class="todo-button blue" onClick={create}>
      add
    </button>,
    <button class="todo-button" onClick={toggleSort}>
      sorting by {sort}
    </button>,
    <button class="todo-button red" onClick={() => todos([])}>
      clear
    </button>,
    <div class="todo-list-container">
      <DumbEntries todos={todos()} sort={sort} name={name}/>
    </div>
  ]
})

export default TodoEntries;
