import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type Action = "create" | "update" | "delete";

export type OptimisticAction<T> = {
  action: Action;
  data: T;
};

// only need this if we are going to continue using context
export type AddOptimisticFn<T> = (action: OptimisticAction<T>) => void;

export function optimisticUpdateFn<T extends { id: string; userId?: string }>(
  currentState: T[],
  action: OptimisticAction<T>,
): T[] {
  const { data } = action;
  const optimisticEntity = {
    ...data,
    id: "optimistic",
    userId: data.userId || "",
  };

  switch (action.action) {
    case "create":
      return currentState.length === 0
        ? [optimisticEntity]
        : [...currentState, optimisticEntity];
    case "update":
      return currentState.map((item) =>
        item.id === data.id ? optimisticEntity : item,
      );
    case "delete":
      return currentState.map((item) =>
        item.id === data.id ? { ...item, id: "delete" } : item,
      );
    //     this way to use if you want it to be removed instantly from the ui
    //     case "delete":
    // return currentState.filter((item) => item.id !== data.id);
  }
}
