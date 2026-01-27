import { generateText } from "ai";
import { inngest } from "./client";
import { google } from "@ai-sdk/google";
import {firecrawl} from "@/lib/firecrawl";

const URL_REGEX = /(https?:\/\/[^\s]+)/g;

export const demoGenerate = inngest.createFunction(
  { id: "demo-generate" },
  { event: "demo/generate" },
  async ({ event, step }) => {
    const { prompt } = event.data as { prompt: string };

    const urls = (await step.run("extract-urls", async () => {
      return prompt.match(URL_REGEX) || [];
    })) as string[];

    const scrappedContent = await step.run("scrape-urls", async () => {
      const results = await Promise.all(
        urls.map(async (url) => {
          const result = await firecrawl.scrape(
            url,
            { formats: ["markdown"] },
          );
          return result.markdown || null;
        }),
      );
      return results.filter(Boolean).join("\n\n");
    });

    const finalPrompt = scrappedContent
      ? `Content:\n${scrappedContent}\n\nQuestion: ${prompt}`
      : prompt;
    await step.run("generate-text", async () => {
      return await generateText({
        model: google("gemini-2.0-flash"),
        prompt: finalPrompt,
      });
    });
  },
);

function async(value: string, index: number, array: string[]): unknown {
  throw new Error("Function not implemented.");
}
