
import { Character, ModelProviderName, settings } from "@elizaos/core";

export function getTokenForProvider(
  provider: ModelProviderName,
  character: Character
) {
  switch (provider) {
    case ModelProviderName.OPENAI:
      return (
        character.settings?.secrets?.OPENAI_API_KEY || settings.OPENAI_API_KEY
      );
    case ModelProviderName.OPENROUTER:
      return (
        character.settings?.secrets?.OPENROUTER || settings.OPENROUTER_API_KEY
      );
  }
}
