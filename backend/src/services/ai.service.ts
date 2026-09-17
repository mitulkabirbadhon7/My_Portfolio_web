import { ai } from '../config/gemini';
import { AppError } from '../utils/AppError';
import { projectRepository, ProjectRepository } from '../repositories/project.repository';
import { skillRepository, SkillRepository } from '../repositories/skill.repository';
import { experienceRepository, ExperienceRepository } from '../repositories/experience.repository';
import { settingsRepository, SettingsRepository } from '../repositories/settings.repository';

export interface IChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export class AiService {
  constructor(
    private readonly projectRepo: ProjectRepository = projectRepository,
    private readonly skillRepo: SkillRepository = skillRepository,
    private readonly expRepo: ExperienceRepository = experienceRepository,
    private readonly settingsRepo: SettingsRepository = settingsRepository,
  ) {}

  private async buildPortfolioContext(): Promise<string> {
    try {
      const [projects, skills, experiences, settings] = await Promise.all([
        this.projectRepo.findPublished(),
        this.skillRepo.findAllGrouped(),
        this.expRepo.findAllChronological(),
        this.settingsRepo.getOrCreate(),
      ]);

      const skillsFormatted = skills.length > 0
        ? skills.map((s) => `- ${s.name} (${s.category}, Proficiency: ${s.proficiency}%)`).join('\n')
        : 'No skills listed currently.';

      const projectsFormatted = projects.length > 0
        ? projects.map((p) => {
            const stack = p.techStack?.length ? `[Stack: ${p.techStack.join(', ')}]` : '';
            const links = [p.demoUrl ? `Demo: ${p.demoUrl}` : null, p.repoUrl ? `Code: ${p.repoUrl}` : null].filter(Boolean).join(' | ');
            return `### ${p.title} (${p.slug})\n${p.description}\n${stack}\n${links}`.trim();
          }).join('\n\n')
        : 'No published projects listed currently.';

      const expFormatted = experiences.length > 0
        ? experiences.map((e) => {
            const period = `${new Date(e.startDate).getFullYear()} - ${e.current ? 'Present' : e.endDate ? new Date(e.endDate).getFullYear() : 'N/A'}`;
            const bullets = e.description?.length ? e.description.map((b) => `  * ${b}`).join('\n') : '';
            return `* **${e.role}** at ${e.company} (${period})\n${bullets}`.trim();
          }).join('\n\n')
        : 'No work experience listed currently.';

      const contactFormatted = `
- Contact Email: ${settings.contactEmail || 'Available via contact form'}
- GitHub: ${settings.githubUrl || 'N/A'}
- LinkedIn: ${settings.linkedinUrl || 'N/A'}
- CV: ${settings.cvUrl ? 'Available for download on the portfolio' : 'Available upon request'}
`.trim();

      return `
# PORTFOLIO KNOWLEDGE BASE (LIVE SOURCE OF TRUTH)

## Technical Skills
${skillsFormatted}

## Featured Projects
${projectsFormatted}

## Professional Experience & Education
${expFormatted}

## Contact & Social Profiles
${contactFormatted}
`.trim();
    } catch (error) {
      return 'Knowledge base currently unavailable due to database maintenance.';
    }
  }

  private async executeWithFallback(primaryModel: string, systemInstruction: string, contents: any[]): Promise<string> {
    const fallbackModel = 'gemini-1.5-flash';
    const modelsToTry = primaryModel !== fallbackModel ? [primaryModel, fallbackModel] : [primaryModel];

    for (const model of modelsToTry) {
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          const response = await ai.models.generateContent({
            model,
            contents,
            config: {
              systemInstruction,
              maxOutputTokens: 500,
              temperature: 0.5,
            },
          });

          if (response.text) return response.text;
        } catch (error: any) {
          const is503 = error?.status === 503 || error?.message?.includes('503') || error?.message?.includes('UNAVAILABLE') || error?.message?.includes('high demand');

          if (is503 && attempt === 1) {
            await new Promise((res) => setTimeout(res, 1500)); // Wait 1.5s then retry
            continue;
          }
          if (is503 && model !== fallbackModel) {
            console.warn(`[AI Warning] ${model} unavailable (503). Retrying with ${fallbackModel}...`);
            break; // Break attempt loop to move to the fallback model
          }

          if (error?.status === 400 || error?.message?.includes('API key')) throw new AppError('Invalid Gemini API credentials', 500);
          if (error?.status === 429) throw new AppError('AI rate limit reached.', 429);
          throw new AppError(`AI Service Error: ${error?.message || 'Unknown failure'}`, 500);
        }
      }
    }
    throw new AppError('AI service is temporarily busy. Please try again shortly.', 503);
  }

  async generateChatResponse(message: string, history: IChatMessage[] = []): Promise<string> {
    if (!process.env.GEMINI_API_KEY) throw new AppError('AI service is not configured', 500);

    const primaryModel = process.env.GEMINI_MODEL || 'gemini-3.6-flash';
    const portfolioContext = await this.buildPortfolioContext();

    const systemInstruction = `
You are the interactive AI Ambassador representing a Software Engineer on their personal portfolio website.

OBJECTIVES:
1. Speak on behalf of the developer in a helpful, articulate, confident, and professional tone.
2. Ground all factual assertions STRICTLY in the provided PORTFOLIO KNOWLEDGE BASE below.
3. If a visitor asks about a project, skill, or experience not present in the knowledge base, state politely that the information is not on record.
4. Keep answers concise, highly scannable, and formatted in Markdown.
5. NEVER break character or invent projects, technologies, or past jobs.

${portfolioContext}
`.trim();

    const formattedHistory = history.slice(-6).map((msg) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    const contents = [...formattedHistory, { role: 'user', parts: [{ text: message }] }];

    return await this.executeWithFallback(primaryModel, systemInstruction, contents);
  }
}

export const aiService = new AiService();