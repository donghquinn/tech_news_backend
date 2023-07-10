import { Logger } from "@nestjs/common";
import { ValidatorError } from "errors/validator.error";
import { ListRequest, MatchingDataRequest } from "types/list.type";
import { z } from "zod";

export const listRequestValidator = async (request: ListRequest) => {
    try {
        const scheme = z.object({ date: z.string() }).strict();

        const validated = await scheme.parseAsync(request);

        return validated;
    } catch (error) {
        Logger.error(error);

        throw new ValidatorError("List Request Validator", "Validation Error")
    }
}

export const dataRequestValidator = async (request: MatchingDataRequest) => {
    try {
        const scheme = z.object({ today: z.string() }).strict();

        const validated = await scheme.parseAsync(request);

        return validated;
    } catch (error) {
        Logger.error(error);

        throw new ValidatorError("List Request Validator", "Validation Error")
    }
}

export const listValidator = async(request: MatchingDataRequest) => {
    try {
        const scheme = z.object({today: z.string()}).strict();

        const validated = await scheme.parseAsync(request);

        return validated;
    } catch (error) {
        Logger.error(error);

        throw new ValidatorError("List Request Validator", "Validation Error")
    }
}