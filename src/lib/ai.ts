import Anthropic from "@anthropic-ai/sdk";

let _client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!_client) {
    _client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
  }
  return _client;
}

const MODEL = "claude-sonnet-4-20250514";

export async function generateDishDescription(input: {
  name: string;
  ingredients: string;
  cuisine: string;
  tone: "elegant" | "casual" | "playful";
  language: "fr" | "en";
}): Promise<string> {
  const client = getClient();
  const msg = await client.messages.create({
    model: MODEL,
    max_tokens: 500,
    messages: [
      {
        role: "user",
        content: `You are a world-class restaurant copywriter. Write a compelling menu description for this dish.

Dish: ${input.name}
Ingredients: ${input.ingredients}
Cuisine type: ${input.cuisine}
Tone: ${input.tone}
Language: ${input.language === "fr" ? "French" : "English"}

Write ONLY the description, 2-3 sentences max. Make it appetizing and evocative.`,
      },
    ],
  });

  return (msg.content[0] as { type: "text"; text: string }).text;
}

export async function analyzeMenuEngineering(input: {
  dishes: Array<{
    name: string;
    price: number;
    costPrice: number;
    popularity: number;
  }>;
  currency: string;
  language: "fr" | "en";
}): Promise<string> {
  const client = getClient();
  const dishList = input.dishes
    .map(
      (d) =>
        `- ${d.name}: price=${d.price}${input.currency}, cost=${d.costPrice}${input.currency}, popularity=${d.popularity}/5`
    )
    .join("\n");

  const msg = await client.messages.create({
    model: MODEL,
    max_tokens: 2000,
    messages: [
      {
        role: "user",
        content: `You are an expert restaurant consultant specializing in menu engineering. Analyze this menu using the BCG matrix method (Stars, Puzzles, Plowhorses, Dogs).

Menu items:
${dishList}

Language: ${input.language === "fr" ? "French" : "English"}

Provide:
1. Classification of each dish (Star/Puzzle/Plowhorse/Dog)
2. Overall menu health score (0-100)
3. Top 3 actionable recommendations to improve profitability
4. Dishes to consider removing or repricing

Format your response in clean markdown with sections.`,
      },
    ],
  });

  return (msg.content[0] as { type: "text"; text: string }).text;
}

export async function generateReviewResponse(input: {
  review: string;
  rating: number;
  restaurantName: string;
  tone: "professional" | "warm" | "apologetic";
  language: "fr" | "en";
}): Promise<string> {
  const client = getClient();
  const msg = await client.messages.create({
    model: MODEL,
    max_tokens: 500,
    messages: [
      {
        role: "user",
        content: `You are a restaurant owner responding to a customer review. Write a personalized response.

Restaurant: ${input.restaurantName}
Review rating: ${input.rating}/5
Review text: "${input.review}"
Tone: ${input.tone}
Language: ${input.language === "fr" ? "French" : "English"}

Write ONLY the response. Be genuine, address specific points from the review. 3-5 sentences max.`,
      },
    ],
  });

  return (msg.content[0] as { type: "text"; text: string }).text;
}

export async function generateSocialPost(input: {
  platform: "instagram" | "facebook" | "tiktok";
  topic: string;
  restaurantName: string;
  cuisine: string;
  language: "fr" | "en";
}): Promise<string> {
  const client = getClient();
  const msg = await client.messages.create({
    model: MODEL,
    max_tokens: 500,
    messages: [
      {
        role: "user",
        content: `You are a social media manager for restaurants. Create an engaging post.

Platform: ${input.platform}
Restaurant: ${input.restaurantName}
Cuisine: ${input.cuisine}
Topic/occasion: ${input.topic}
Language: ${input.language === "fr" ? "French" : "English"}

Write the post with appropriate hashtags for the platform. Make it engaging and on-brand. Include emoji suggestions in parentheses.`,
      },
    ],
  });

  return (msg.content[0] as { type: "text"; text: string }).text;
}

export async function translateMenu(input: {
  items: Array<{ name: string; description: string }>;
  fromLanguage: string;
  toLanguage: string;
}): Promise<Array<{ name: string; description: string }>> {
  const client = getClient();
  const itemList = input.items
    .map((i, idx) => `${idx + 1}. Name: ${i.name}\n   Description: ${i.description}`)
    .join("\n");

  const msg = await client.messages.create({
    model: MODEL,
    max_tokens: 2000,
    messages: [
      {
        role: "user",
        content: `Translate these menu items from ${input.fromLanguage} to ${input.toLanguage}. Keep culinary terms authentic when appropriate.

${itemList}

Respond ONLY with a JSON array of objects with "name" and "description" keys. No markdown, no explanation.`,
      },
    ],
  });

  const text = (msg.content[0] as { type: "text"; text: string }).text;
  return JSON.parse(text);
}

export async function analyzeMargins(input: {
  dishes: Array<{
    name: string;
    price: number;
    costPrice: number;
    category: string;
  }>;
  currency: string;
  language: "fr" | "en";
}): Promise<string> {
  const client = getClient();
  const dishList = input.dishes
    .map(
      (d) =>
        `- ${d.name} [${d.category}]: sell=${d.price}${input.currency}, cost=${d.costPrice}${input.currency}, margin=${(((d.price - d.costPrice) / d.price) * 100).toFixed(1)}%`
    )
    .join("\n");

  const msg = await client.messages.create({
    model: MODEL,
    max_tokens: 2000,
    messages: [
      {
        role: "user",
        content: `You are a restaurant financial consultant. Analyze these dish margins and provide actionable insights.

Dishes:
${dishList}

Currency: ${input.currency}
Language: ${input.language === "fr" ? "French" : "English"}

Provide:
1. Overall margin health (average, median, range)
2. Category-by-category breakdown
3. Dishes with dangerously low margins (<30%)
4. Dishes with excellent margins (>70%)
5. Top 5 specific recommendations to improve overall profitability
6. Estimated revenue impact of your recommendations

Format in clean markdown with sections and use bold for key figures.`,
      },
    ],
  });

  return (msg.content[0] as { type: "text"; text: string }).text;
}
