import os
import logging
from pathlib import Path
from typing import Type, TypeVar
from pydantic import BaseModel
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv(Path(__file__).resolve().parent / ".env")

logger = logging.getLogger("llm_client")
T = TypeVar("T", bound=BaseModel)

class LLMClient:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY", "")
        self.model = os.getenv("GEMINI_MODEL", "gemini-3.1-flash-lite")

        if not self.api_key:
            logger.warning("GEMINI_API_KEY is not set in environment variables.")

        # Initialize the GenAI Client
        self.client = genai.Client(api_key=self.api_key)

    def call(self, system_prompt: str, user_prompt: str, schema: Type[T]) -> T:
        """
        Executes single-turn prompt to Gemini using native structured output schema.
        Retries AT MOST ONCE if an unexpected error occurs.
        """
        max_attempts = 2
        last_exception = None

        config = types.GenerateContentConfig(
            system_instruction=system_prompt,
            temperature=0.1,
            response_mime_type="application/json",
            response_schema=schema,  # Directly pass Pydantic class to Gemini
        )

        for attempt in range(1, max_attempts + 1):
            try:
                response = self.client.models.generate_content(
                    model=self.model,
                    contents=user_prompt,
                    config=config,
                )
                
                # Gemini structured output guarantees response.text matches schema
                parsed_data = schema.model_validate_json(response.text)
                return parsed_data

            except Exception as e:
                logger.warning(f"Gemini API Attempt {attempt} failed: {str(e)}")
                last_exception = e
                if attempt == max_attempts:
                    logger.error("Max retries exceeded for Gemini client invocation.")
                    raise RuntimeError(f"Gemini scoring failed after retry: {str(last_exception)}") from last_exception

# Singleton instance
llm_client = LLMClient()