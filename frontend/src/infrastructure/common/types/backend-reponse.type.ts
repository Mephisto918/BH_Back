import { z } from "zod";

export interface ApiResponseType<T> {
  success: boolean;
  results: T;
  timestamp: string;
}
