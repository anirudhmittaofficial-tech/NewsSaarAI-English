const { GoogleGenAI } = require('@google/genai');

const PROMPT_TEMPLATE = `You are an Expert English News Editor and SEO Specialist.
Your task is to analyze the following English news article and generate a structured analysis for digital publishing, newsletters, and social media.

Provide the output strictly as a JSON object matching this exact schema, without any markdown formatting or code blocks outside the JSON:

{
  "shortSummary": "1-2 sentences article summary",
  "detailedSummary": "Comprehensive summary covering all key aspects",
  "bulletHighlights": ["highlight 1", "highlight 2", "highlight 3"],
  "keyPoints": ["key point 1", "key point 2", "key point 3"],
  "newsletterFormat": "A quick-read engaging format suitable for email newsletters",
  "headlines": {
    "editorial": ["headline 1", "headline 2", "headline 3"],
    "seo": ["seo title 1", "seo title 2", "seo title 3"],
    "social": ["headline 1", "headline 2", "headline 3"]
  },
  "metaDescriptions": ["meta desc 1", "meta desc 2", "meta desc 3"],
  "quotes": [
    { "quote": "The actual quote", "speaker": "Speaker Name", "source": "Context or Source" }
  ],
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "socialMedia": {
    "twitter": "Twitter post content with hashtags",
    "facebook": "Facebook post content",
    "instagram": "Instagram caption",
    "linkedin": "Professional LinkedIn post"
  }
}

Article Content:
"""
{{ARTICLE_TEXT}}
"""
`;

async function analyzeArticleText(articleText) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured.');
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const prompt = PROMPT_TEMPLATE.replace('{{ARTICLE_TEXT}}', articleText);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    // In @google/genai v2+, response.text is a property, not a function
    const rawText = response.text;
    return JSON.parse(rawText);
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to analyze article with Gemini AI: ' + error.message);
  }
}

module.exports = {
  analyzeArticleText
};
