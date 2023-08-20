import { MachineLearningError } from "errors/machine.error";
import { HackerNewsStarRequest } from "types/hackers.type";
import { ScrapeRequest } from "types/request.type";

import { z } from "zod";

export const machineLearningValidator = async(request: ScrapeRequest) => {
    try {
        const scheme = z.object({today: z.string()});

        const validated = await scheme.parseAsync(request);

        return validated;
    } catch (error) {
        throw new MachineLearningError(
            "MachineLearning News Request Validator", 
            "MachineLearning News Request Validator Failed",
            error instanceof Error ? error : new Error(JSON.stringify(error))
        )
    }
}

export const machineLearningStarValidator = async(request: HackerNewsStarRequest ) => {
    try {
        const scheme = z.object({uuid: z.string()});

        const validated = await scheme.parseAsync(request);

        return validated;
    } catch (error) {
        throw new MachineLearningError(
            "MachineLearning News Star Request Validator", 
            "MachineLearning News Star Request Validator Failed",
            error instanceof Error ? error : new Error(JSON.stringify(error))
        )
    }
}