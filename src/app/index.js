import { diff } from "atlas-relax";
import { t } from "atlas-relax-jsx-pragmas"; /**@jsx t */
import TodoEntry from "./TodoEntry";
import TodoEntries from "./TodoEntries";
import { completed, pending, create } from "./todos";

const App = () => [
  <TodoEntries name="pending" todos={pending}
    create={() => create()}/>,
  <TodoEntries name="completed" todos={completed}/>
]

export default App;
