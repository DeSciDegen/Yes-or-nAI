import { elizaLogger, IAgentRuntime, Memory, Action, HandlerCallback, State, generateText, ModelClass } from "@elizaos/core";
import axios from 'axios';
import type { AxiosError } from 'axios';

export const digestAction: Action = {
    name: "digest",
    description: "get information from a source",
    handler: async (
        runtime: IAgentRuntime,
        _message: Memory,
        _state: State,
        options: Record<string, unknown>,
        callback?: HandlerCallback
    ) => {
        try {

            // TODO: process a text input instead of a URL
            const url = await generateText({
                runtime: runtime,
                context: `Extract the URL from this message: ${_message}. Only return the URL in the response`,
                modelClass: ModelClass.SMALL,
            });

            const result = await search(url);
            elizaLogger.info('Result:', result);

            // TODO: store the result in the agent memory
            
            return true;
        } catch (error) {
            console.error("Error in vote handler:", error.message);
            if (callback) {
                callback({ text: `Error: ${error.message}` });
            }
            return false;
        }
    },

    validate: async (runtime: IAgentRuntime) => {
        return true;
    },

    examples: [
        [
            {
                user: "user",
                content: {
                    text: "Store this information for further voting",
                    action: "STORE_INFORMATION",
                },
            },
        ],
        [
            {
                user: "user",
                content: {
                    text: "Get info from this source: https://example.com",
                    action: "STORE_INFORMATION",
                },
            },
        ],
        [
            {
                user: "user",
                content: {
                    text: "Digest data from: https://example.com",
                    action: "STORE_INFORMATION",
                },
            },
        ],
    ],
    similes: ["STORE_INFORMATION", "GET_DATA", "DIGEST_INFO", "DIGEST_DATA"],
};


const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;
const RATE_LIMIT_DELAY_MS = 334; // Ensure we don't exceed 3 requests per second

const api = axios.create({
    timeout: 10000,
    headers: {
        'Accept': 'application/json'
    }
});

async function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function search(
    endpoint: string,
): Promise<{ result: {} }> {
    elizaLogger.log('Starting search with endpoint:', endpoint);

    let retryCount = 0;
    const handleWithRetry = async (): Promise<{ result: {} }> => {
        try {
            // Rate limiting delay
            await delay(RATE_LIMIT_DELAY_MS);

            const response = await api.get(endpoint, {
                params: {}
            });

            if (!response) {
                throw new Error(`Error: ${response}`);
            }

            // Rate limiting delay before summary request
            await delay(RATE_LIMIT_DELAY_MS);

            return {
                result: response.data,
            };

        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }

            const axiosError = error as AxiosError;
            if (axiosError.response?.status === 429 || axiosError.code === 'ECONNABORTED') {
                if (retryCount < MAX_RETRIES) {
                    retryCount++;
                    const delayMs = RETRY_DELAY_MS * Math.pow(2, retryCount - 1);
                    elizaLogger.log(`Retrying after ${delayMs}ms (attempt ${retryCount}/${MAX_RETRIES})`);
                    await delay(delayMs);
                    return handleWithRetry();
                }
            }

            throw new Error(
                'Failed to fetch',
                error
            );
        }
    };

    return handleWithRetry();
}

