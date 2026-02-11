import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongodb";
import Portfolio from "@/lib/db/models/Portfolio";
import { getStaticPortfolio } from "@/data/portfolio";

// GET /api/portfolio - Fetch portfolio data
export async function GET() {
  try {
    await dbConnect();

    let portfolio = await Portfolio.findById("main").lean();

    // If no portfolio exists in DB, seed it with default data
    if (!portfolio) {
      const defaultData = getStaticPortfolio();
      portfolio = await Portfolio.create({
        _id: "main",
        ...defaultData,
      });
      portfolio = await Portfolio.findById("main").lean();
    }

    // Transform MongoDB document to match frontend interface
    const data = {
      profile: portfolio.profile,
      social: portfolio.social,
      about: portfolio.about,
      experience: portfolio.experience,
      projects: portfolio.projects,
      skills: portfolio.skills,
      timeline: portfolio.timeline,
      posts: portfolio.posts,
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/portfolio error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to fetch portfolio", details: message },
      { status: 500 }
    );
  }
}

// PUT /api/portfolio - Update entire portfolio
export async function PUT(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();

    // Validate required fields
    if (!body.profile || !body.profile.name) {
      return NextResponse.json(
        { error: "Invalid portfolio data" },
        { status: 400 }
      );
    }

    const portfolio = await Portfolio.findByIdAndUpdate(
      "main",
      {
        $set: {
          profile: body.profile,
          social: body.social,
          about: body.about,
          experience: body.experience,
          projects: body.projects,
          skills: body.skills,
          timeline: body.timeline,
          posts: body.posts,
        },
      },
      { new: true, upsert: true, lean: true }
    );

    const data = {
      profile: portfolio.profile,
      social: portfolio.social,
      about: portfolio.about,
      experience: portfolio.experience,
      projects: portfolio.projects,
      skills: portfolio.skills,
      timeline: portfolio.timeline,
      posts: portfolio.posts,
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error("PUT /api/portfolio error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to update portfolio", details: message },
      { status: 500 }
    );
  }
}

// PATCH /api/portfolio - Update specific field(s)
export async function PATCH(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { path, value } = body;

    if (!path) {
      return NextResponse.json(
        { error: "Path is required" },
        { status: 400 }
      );
    }

    // Build update object using dot notation
    const updateObj: Record<string, unknown> = {};
    updateObj[path] = value;

    const portfolio = await Portfolio.findByIdAndUpdate(
      "main",
      { $set: updateObj },
      { new: true, lean: true }
    );

    if (!portfolio) {
      return NextResponse.json(
        { error: "Portfolio not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, path, value });
  } catch (error) {
    console.error("PATCH /api/portfolio error:", error);
    return NextResponse.json(
      { error: "Failed to update portfolio field" },
      { status: 500 }
    );
  }
}
