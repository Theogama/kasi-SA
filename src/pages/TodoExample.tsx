import { useSupabaseData } from "@/hooks/useSupabaseData";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";

interface Todo {
  id: string;
  title: string;
  completed?: boolean;
  created_at?: string;
}

const TodoExample = () => {
  const { data: todos, loading, error } = useSupabaseData<Todo>("todos");

  if (loading) {
    return (
      <div className="space-y-3 p-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-destructive/10 border border-destructive rounded-lg flex gap-2">
        <AlertCircle size={20} className="text-destructive flex-shrink-0" />
        <p className="text-destructive text-sm">{error}</p>
      </div>
    );
  }

  if (!todos || todos.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        No todos found
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h2 className="text-xl font-bold">Todos</h2>
      <ul className="space-y-2">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="p-3 bg-secondary rounded-lg flex items-center gap-2"
          >
            {todo.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoExample;
