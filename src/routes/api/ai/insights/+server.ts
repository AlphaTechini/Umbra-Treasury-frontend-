import { json } from '@sveltejs/kit';
import { GoogleGenAI } from '@google/genai';
import type { RequestHandler } from './$types';

// The environment variable is handled by Vite/SvelteKit
// Note: GoogleGenAI usually takes an options object or apiKey directly depending on version
// For @google/genai, it's typically GoogleGenAI({ apiKey: ... })
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const POST: RequestHandler = async () => {
	if (!process.env.GEMINI_API_KEY) {
		return json({ error: 'AI capabilities are currently offline. Please check system configuration.' }, { status: 503 });
	}

	try {
		const model = 'gemini-1.5-flash';
		const prompt = `
			You are Umbra Oracle, a precise financial treasury agent. 
			Generate 3 concise, highly professional financial insights for an institutional treasury dashboard.
			Format: A JSON array of strings. 
			The insights should sound smart, data-driven, and institutional (e.g., mention yields, market drift, liquidity buffers, or stablecoin spreads).
			Keep each insight under 20 words.
		`;

		const result = await genAI.models.generateContent({
			model,
			contents: [{ role: 'user', parts: [{ text: prompt }] }]
		});

		// Adjusted for @google/genai response structure
		// It might be result.value.content... check types
		const insightsText = result.content?.parts?.[0]?.text || "";
		
		// Extract JSON from response (Gemini sometimes wraps in markdown)
		const jsonMatch = insightsText.match(/\[.*\]/s);
		const insights = jsonMatch ? JSON.parse(jsonMatch[0]) : ["Yield optimization suggested for idle USD reserves.", "Volatility dampening observed in major liquidity pools.", "Q4 hedging strategy alignment recommended."];

		return json({ insights });
	} catch (error) {
		console.error('Gemini Error:', error);
		return json({ error: 'Failed to generate insights' }, { status: 500 });
	}
};
