import { ForecastError } from "@errors/forecast.error";
import { ForecastRequest } from "types/forecast.type";
import { z } from "zod";

export const forecastValidator = async(request: ForecastRequest) => {
    try {
        const scheme = z.object({today: z.string()});

        const validated = await scheme.parseAsync(request);

        return validated;
    } catch (error) {
        throw new ForecastError(
            "Forecast Request Validator", 
            "Forecast Request Validator Failed",
            error instanceof Error ? error : new Error(JSON.stringify(error))
        )
    }
}
