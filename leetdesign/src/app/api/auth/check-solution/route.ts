import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { 
      userSolution, 
      referenceSolution, 
      problemTitle, 
      problemDescription, 
      functionalRequirements, 
      nonFunctionalRequirements 
    } = body;

    // Validate required fields
    if (!userSolution || !referenceSolution) {
      return NextResponse.json(
        { error: 'User solution and reference solution are required' },
        { status: 400 }
      );
    }

    // Create a prompt for GPT to compare the solutions
    const prompt = `
You are an expert code reviewer. Compare the user's solution with the reference solution for the following problem:

Problem Title: ${problemTitle}
Problem Description: ${problemDescription}

Functional Requirements:
${functionalRequirements.map((req: string) => `- ${req}`).join('\n')}

Non-Functional Requirements:
${nonFunctionalRequirements.map((req: string) => `- ${req}`).join('\n')}

User's Solution:
${userSolution}

Reference Solution:
${referenceSolution}

Please analyze the user's solution compared to the reference solution and provide:
1. A match percentage (0-100) based on how well the user's solution addresses the problem requirements and matches the approach of the reference solution. Don't require exact word matching, focus on the approach and key concepts.
2. Detailed feedback explaining the match percentage, highlighting strengths and areas for improvement.

Format your response as JSON:
{
  "matchPercentage": number,
  "feedback": "detailed feedback here"
}
`;

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert code reviewer who provides accurate and helpful feedback on solutions."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    // Parse the response
    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No content in OpenAI response');
    }

    // Parse the JSON response
    const result = JSON.parse(content);

    // Return the result
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error checking solution:', error);
    return NextResponse.json(
      { error: 'Failed to check solution' },
      { status: 500 }
    );
  }
} 