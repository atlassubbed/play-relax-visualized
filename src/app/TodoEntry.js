import { diff } from "atlas-relax";
import { t } from "atlas-relax-jsx-pragmas"; /**@jsx t */
import { val, obs } from "atlas-munchlax";
import { update, remove } from "./todos";
import "./todo-entry.css";

/** use flexbox to get this design:

      ------------------------------
      | date, priority  | edit     |
      | text            | complete |
      |                 | remove   |
      ------------------------------

    use munchlax to get this behavior:

      when edit is clicked 
        1. the button should change to say "save"
        2. priority and text should become input fields
      when complete is clicked
        1. should automatically save if in editing state
        2. should move it to completed state
      when remove is clicked
        1. should remove the item regardless of whether or not it is being edited

    completed todos cannot be edited, but their complete button should say "undo"
    so they can be moved back to pending.

    date should not be changed when edits are saved
*/

const TodoEntry = obs(({data: { todo }}, node) => {
  const { text, date, priority, isDone } = todo();
  const isEditing = !isDone && (node.edit = node.edit || val(!text))();
  const toggleEdit = () => node.edit(!isEditing);
  const toggleDone = () => {
    update(todo, {isDone: !isDone});
  }
  const saveText = e => update(todo, {text: e.target.value})
  const savePriority = e => update(todo, {priority: e.target.value})
  const destroy = () => remove(isDone, entry => entry === todo)
  return (
    <div class="todo-container">
      <div class="todo-info">
        <div class="todo-stats">
          <span>
            <label for="priority-input">priority: </label>
            {isEditing ? 
              <input
                id="priority-input"
                type="number"
                value={priority}
                onInput={savePriority}/> :
              <span>{priority}</span>           
            }
          </span>
          <span>{date.toLocaleString()}</span> 
        </div>
        {isEditing ? 
          <textarea
            id="text-input"
            value={text}
            onInput={saveText}/> :
          <div class="todo-text">
            {text}
          </div>
        }
      </div>
      <div class="todo-action">
        {isDone || <button class="todo-button" onClick={toggleEdit}>
          {isEditing ? "save" : "edit"}
        </button>}
        <button class="todo-button blue" onClick={toggleDone}>
          {isDone ? "undo" : "complete"}
        </button>
        <button class="todo-button red" onClick={destroy}>
          remove
        </button>
      </div>
    </div>
  )
})

export default TodoEntry;
