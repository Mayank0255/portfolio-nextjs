import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import dbConnect from "@/lib/db/mongodb";
import Portfolio from "@/lib/db/models/Portfolio";
import { getStaticPortfolio } from "@/data/portfolio";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function getPortfolioContext(): Promise<string> {
  try {
    await dbConnect();
    let portfolio = await Portfolio.findById("main").lean();
    if (!portfolio) {
      return JSON.stringify(getStaticPortfolio());
    }
    return JSON.stringify({
      profile: portfolio.profile,
      social: portfolio.social,
      about: portfolio.about,
      experience: portfolio.experience,
      projects: portfolio.projects,
      skills: portfolio.skills,
      timeline: portfolio.timeline,
      posts: portfolio.posts,
    });
  } catch {
    return JSON.stringify(getStaticPortfolio());
  }
}

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "Messages are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const portfolioData = await getPortfolioContext();

    const systemPrompt = `You are a friendly and professional AI assistant on Mayank Aggarwal's portfolio website. Your sole purpose is to answer questions about Mayank based on the portfolio data provided below.

PORTFOLIO DATA:
${portfolioData}

INSTRUCTIONS:
- Answer questions about Mayank's experience, skills, projects, education, and background conversationally and helpfully.
- Be concise — aim for 2-4 sentences unless the user asks for details.
- Use a warm, professional tone. You represent Mayank's personal brand.
- If asked about something not in the portfolio data, say you don't have that information and suggest the user reach out to Mayank directly via LinkedIn or email.
- If the user asks unrelated questions (coding help, general knowledge, etc.), politely redirect: "I'm here to help you learn about Mayank! Feel free to ask about his experience, projects, or skills."
- You may format responses with markdown (bold, lists, etc.) for readability.
- When mentioning Mayank's projects, you can reference that they are available on his GitHub.
- Never make up information that isn't in the portfolio data.`;

    const stream = await anthropic.messages.stream({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 512,
      system: systemPrompt,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`));
          }
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("POST /api/chat error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process chat message" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
