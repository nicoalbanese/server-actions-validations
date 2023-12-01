import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type OptimisticAction<T> = { action: "create" | "update" | "delete"; data: T };
export type AddOptimisticFn<T> = (action: OptimisticAction<T>) => void;

function isOptimisticAction<T>(action: unknown): action is OptimisticAction<T> {
  return (
    typeof action === "object" &&
    action !== null &&
    "action" in action &&
    "data" in action
  );
}

export function optimisticUpdateFn<T extends { id: string; userId?: string }>(
  currentState: T[],
  action: OptimisticAction<T>, // Accept action of type unknown
): T[] {
  // Check if the action is of the expected type
  if (!isOptimisticAction<T>(action)) {
    throw new Error("Invalid action type");
  }

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
      console.log("updating", optimisticEntity);
      return currentState.map((item) =>
        item.id === data.id ? optimisticEntity : item,
      );
    case "delete":
      return currentState.filter((item) => item.id !== data.id);
  }
}
