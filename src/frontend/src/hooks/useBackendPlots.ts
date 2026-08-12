import { createActor } from "@/backend";
import type { Plot, PlotId, PlotInput } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const PLOTS_KEY = ["plots"] as const;

export function useListPlots() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Plot[]>({
    queryKey: PLOTS_KEY,
    queryFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.listPlots();
      return result as Plot[];
    },
    enabled: !!actor && !isFetching,
    retry: 2,
    staleTime: 30_000,
  });
}

export function useGetPlot(plotId: PlotId | null) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Plot | null>({
    queryKey: ["plot", plotId?.toString()],
    queryFn: async () => {
      if (!actor || plotId === null) return null;
      return actor.getPlot(plotId) as Promise<Plot | null>;
    },
    enabled: !!actor && !isFetching && plotId !== null,
  });
}

export function useCreatePlot() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation<PlotId, Error, PlotInput>({
    mutationFn: async (input) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.createPlot(input) as Promise<PlotId>;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: PLOTS_KEY }),
    onError: (err) => {
      console.error("[useCreatePlot] mutation failed:", err);
    },
  });
}

export function useSaveDraftPlot() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation<PlotId, Error, PlotInput>({
    mutationFn: async (input) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.saveDraftPlot(input) as Promise<PlotId>;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: PLOTS_KEY }),
    onError: (err) => {
      console.error("[useSaveDraftPlot] autosave failed:", err);
    },
  });
}

export function useUpdatePlot() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation<void, Error, { plotId: PlotId; input: PlotInput }>({
    mutationFn: async ({ plotId, input }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updatePlot(plotId, input) as Promise<void>;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: PLOTS_KEY }),
  });
}

export function useDeletePlot() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation<void, Error, PlotId>({
    mutationFn: async (plotId) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deletePlot(plotId) as Promise<void>;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: PLOTS_KEY }),
  });
}

export function useExportPlot() {
  const { actor } = useActor(createActor);
  return useMutation<Plot | null, Error, PlotId>({
    mutationFn: async (plotId) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.exportPlot(plotId) as Promise<Plot | null>;
    },
  });
}
