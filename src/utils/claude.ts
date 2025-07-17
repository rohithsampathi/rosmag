// src/utils/claude.ts

import { Roster, AIAnalysis } from '@/lib/types';

export async function analyzeRosterWithClaude(
  roster: Roster,
  question: string = "Analyze this roster for rule violations and optimization opportunities"
): Promise<AIAnalysis> {
  try {
    const apiKey = process.env.CLAUDE_API_KEY;
    
    if (!apiKey) {
      console.warn('Claude API key not configured, using simulation');
      return await simulateClaudeAnalysis(roster, question);
    }

    const prompt = `
You are an expert hospital roster analyst. Analyze the following roster data and provide insights.

Roster Data:
${JSON.stringify(roster, null, 2)}

Question: ${question}

Please analyze for:
1. Rule violations (max hours, minimum rest, senior coverage requirements)
2. Staff affinity and preferences alignment
3. Optimization opportunities
4. Overall roster quality score (0-100)

Respond with a JSON object in this exact format:
{
  "status": "OK" | "VIOLATION" | "SUGGESTION",
  "explanation": "detailed explanation of findings",
  "actions": [
    {
      "type": "warning" | "suggestion" | "swap" | "assign",
      "warning": "warning message if applicable",
      "swap": ["personId1", "personId2"] for suggested swaps,
      "assign": {"personId": "id", "shiftId": "shift"} for assignments
    }
  ],
  "score": number between 0-100
}

Be specific about which shifts have issues and provide actionable recommendations.
`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.content[0].text;
    
    try {
      return JSON.parse(content);
    } catch (parseError) {
      console.error('Error parsing Claude response:', parseError);
      return await simulateClaudeAnalysis(roster, question);
    }

  } catch (error) {
    console.error('Error calling Claude API:', error);
    return await simulateClaudeAnalysis(roster, question);
  }
}

async function simulateClaudeAnalysis(roster: Roster, question: string): Promise<AIAnalysis> {
  // Enhanced simulation with more detailed analysis
  const violations: string[] = [];
  const suggestions: any[] = [];
  let score = 100;

  // Check for rule violations
  for (const shift of roster.shifts) {
    // Check senior coverage
    const hasSenior = shift.assignments.some(a => a.tags.senior);
    if (roster.meta.seniorCoverage && !hasSenior) {
      violations.push(`Shift ${shift.shiftId} lacks required senior coverage`);
      score -= 15;
      suggestions.push({
        type: 'warning',
        warning: `Assign a senior staff member to ${shift.shiftId}`
      });
    }

    // Check minimum staffing
    if (shift.assignments.length < 2) {
      violations.push(`Shift ${shift.shiftId} appears understaffed`);
      score -= 10;
    }

    // Check for good staff affinity
    for (const assignment of shift.assignments) {
      const affinityKeys = Object.keys(roster.meta.affinityWeights)
        .filter(key => key.includes(assignment.personId));
      
      if (affinityKeys.length > 0) {
        score += 5;
      }
    }
  }

  // Calculate total assigned hours
  const staffHours: Record<string, number> = {};
  roster.shifts.forEach(shift => {
    const shiftDuration = (new Date(shift.endUtc).getTime() - new Date(shift.startUtc).getTime()) / (1000 * 60 * 60);
    shift.assignments.forEach(assignment => {
      staffHours[assignment.personId] = (staffHours[assignment.personId] || 0) + shiftDuration;
    });
  });

  // Check for hour violations
  Object.entries(staffHours).forEach(([personId, hours]) => {
    if (hours > roster.meta.maxHours7d) {
      violations.push(`${personId} assigned ${hours}h, exceeds limit of ${roster.meta.maxHours7d}h`);
      score -= 20;
    }
  });

  // Simulate thinking delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  return {
    status: violations.length > 0 ? "VIOLATION" : score > 85 ? "OK" : "SUGGESTION",
    explanation: violations.length > 0 
      ? `Found ${violations.length} issues: ${violations.join('; ')}`
      : score > 85 
        ? "Roster is well-optimized with good staff allocation and no rule violations"
        : "Roster is acceptable but could be optimized for better staff affinity and coverage",
    actions: suggestions,
    score: Math.max(0, score)
  };
}