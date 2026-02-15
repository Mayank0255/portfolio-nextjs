import dbConnect from "@/lib/db/mongodb";
import Portfolio from "@/lib/db/models/Portfolio";
import { getStaticPortfolio, PortfolioData } from "@/data/portfolio";

export async function getPortfolioData(): Promise<PortfolioData> {
  try {
    await dbConnect();
    const portfolio = await Portfolio.findById("main").lean();
    if (portfolio) {
      return {
        profile: portfolio.profile,
        social: portfolio.social,
        about: portfolio.about,
        experience: portfolio.experience,
        projects: portfolio.projects,
        skills: portfolio.skills,
        timeline: portfolio.timeline,
        posts: portfolio.posts,
      } as PortfolioData;
    }
  } catch {
    // Fall back to static data if DB unavailable
  }
  return getStaticPortfolio();
}
