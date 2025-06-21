import { z } from "zod";

export const StatisticsSchema = z.object({
  xp_frontend: z.number().optional(),
  xp_backend: z.number().optional(),
  xp_negocios: z.number().optional(),
  xp_arquitetura: z.number().optional(),
  xp_design: z.number().optional(),
  xp_data_analysis: z.number().optional(),
  total_throughput: z.number().optional(),
  deltatime_predict: z.number().optional(),
  average_daily: z.number().optional(),
});

export type StatisticsDto = z.infer<typeof StatisticsSchema>;
