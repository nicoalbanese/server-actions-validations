"use client";
import { OptimisticAction } from "@/lib/utils";
import React, { useEffect, useState } from "react";

export function useOptimisticList<T extends { id: string }>(
  initialEntities: T[],
  ItemComponent: React.ComponentType<{ data: T }>,
  updateFn: (currentState: T[], action: OptimisticAction<T>) => T[],
) {
  const [entities, setEntities] = useState(initialEntities);

  const addEntity = (action: OptimisticAction<T>) => {
    setEntities((currentEntities) => updateFn(currentEntities, action));
  };

  useEffect(() => {
    console.log(entities);
  }, [entities]);

  const EntitiesList = () => {
    return (
      <ul>
        {entities.map((entity) => (
          <ItemComponent key={entity.id} data={entity} />
        ))}
      </ul>
    );
  };

  return { EntitiesList, addEntity, entities };
}
