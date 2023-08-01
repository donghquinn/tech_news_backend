import { ValidatorError } from "errors/validator.error";
import { StarRequest } from "types/bbc.type";
import { z } from "zod";

export const starValidator = async(request: StarRequest) => {
    try {
        const scheme = z.object({uuid: z.string()});

        const validated = await scheme.parseAsync(request);

        return validated;
    } catch (error) {
        throw new ValidatorError(
            "Star Request Validator",
            "Failed to Star",

        )
    }
}