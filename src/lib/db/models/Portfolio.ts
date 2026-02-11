import mongoose, { Schema } from "mongoose";

// Post sub-schema
const PostSchema = new Schema({
  id: { type: String, required: true },
  slug: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  content: { type: String, required: true },
  date: { type: String, required: true },
  categories: [{ type: String }],
  tags: [{ type: String }],
  pin: { type: Boolean, default: false },
  workTime: { type: String },
  image: {
    src: { type: String },
    alt: { type: String },
  },
});

// Experience sub-schema
const ExperienceSchema = new Schema({
  id: { type: String, required: true },
  company: { type: String, required: true },
  role: { type: String, required: true },
  period: { type: String, required: true },
  workType: { type: String },
  description: { type: String, required: true },
  technologies: [{ type: String }],
});

// Project sub-schema
const ProjectSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  link: { type: String, required: true },
  stars: { type: Number },
  technologies: [{ type: String }],
});

// Skill sub-schema
const SkillSchema = new Schema({
  category: { type: String, required: true },
  items: [{ type: String }],
});

// Timeline sub-schema
const TimelineSchema = new Schema({
  id: { type: String, required: true },
  date: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: {
    type: String,
    enum: ["education", "work", "achievement", "certification", "publication"],
    required: true,
  },
});

// Main Portfolio schema
const PortfolioSchema = new Schema(
  {
    // Use a fixed identifier for the single portfolio document
    _id: { type: String, default: "main" },
    profile: {
      name: { type: String, required: true },
      title: { type: String, required: true },
      avatar: { type: String, required: true },
      bio: { type: String },
    },
    social: {
      github: { type: String },
      linkedin: { type: String },
      medium: { type: String },
      email: { type: String },
    },
    about: { type: String },
    experience: [ExperienceSchema],
    projects: [ProjectSchema],
    skills: [SkillSchema],
    timeline: [TimelineSchema],
    posts: [PostSchema],
  },
  {
    timestamps: true,
    _id: false, // Use our custom _id
  }
);

export interface IPortfolio {
  _id: string;
  profile: {
    name: string;
    title: string;
    avatar: string;
    bio: string;
  };
  social: {
    github: string;
    linkedin: string;
    medium: string;
    email: string;
  };
  about: string;
  experience: {
    id: string;
    company: string;
    role: string;
    period: string;
    workType: string;
    description: string;
    technologies: string[];
  }[];
  projects: {
    id: string;
    name: string;
    description: string;
    link: string;
    stars?: number;
    technologies: string[];
  }[];
  skills: {
    category: string;
    items: string[];
  }[];
  timeline: {
    id: string;
    date: string;
    title: string;
    description: string;
    type: "education" | "work" | "achievement" | "certification" | "publication";
  }[];
  posts: {
    id: string;
    slug: string;
    title: string;
    description?: string;
    content: string;
    date: string;
    categories: string[];
    tags: string[];
    pin?: boolean;
    workTime?: string;
    image?: { src: string; alt?: string };
  }[];
}

// Prevent model recompilation in development
export default mongoose.models.Portfolio ||
  mongoose.model<IPortfolio>("Portfolio", PortfolioSchema);
