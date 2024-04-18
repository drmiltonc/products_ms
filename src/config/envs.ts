import * as dotenv from 'dotenv';
import * as joi from 'joi';

// Load environment variables from .env file
dotenv.config();

// Define environment variables schema  
const envVarsSchema = joi.object({
    PORT: joi.number()
        .required(),
    /* NODE_ENV: joi.string()
        .valid('development', 'production')
        .required(),
    DB_HOST: joi.string()
        .required(),
    DB_PORT: joi.number()
        .required(),
    DB_NAME: joi.string()
        .required(),
    DB_USER: joi.string()
        .required(),
    DB_PASSWORD: joi.string()
        .required(), */
}).unknown(true);

// Validate environment variables
const { error, value: envVars } = envVarsSchema.validate(process.env);

// Throw an error if environment variables are not valid
if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

// Export environment variables
export default envVars; 