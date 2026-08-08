const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const puppeteer = require("puppeteer")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})


// ============================================================
// INTERVIEW REPORT SCHEMA
// ============================================================

const technicalQuestionSchema = z.object({
    question: z.string(),
    intention: z.string(),
    answer: z.string()
})

const behavioralQuestionSchema = z.object({
    question: z.string(),
    intention: z.string(),
    answer: z.string()
})

const skillGapSchema = z.object({
    skill: z.string(),
    severity: z.enum(["low", "medium", "high"])
})

const preparationDaySchema = z.object({
    day: z.number(),
    focus: z.string(),
    tasks: z.array(z.string())
})

const interviewReportSchema = z.object({
    matchScore: z.number(),
    title: z.string(),

    technicalQuestions: z.array(
        technicalQuestionSchema
    ),

    behavioralQuestions: z.array(
        behavioralQuestionSchema
    ),

    skillGaps: z.array(
        skillGapSchema
    ),

    preparationPlan: z.array(
        preparationDaySchema
    )
})


// ============================================================
// GENERATE INTERVIEW REPORT
// ============================================================

async function generateInterviewReport({
    resume,
    selfDescription,
    jobDescription
}) {

    const prompt = `
You are an expert technical interviewer.

Analyze the following candidate information and job description.

Your task is to generate a complete interview preparation report.

IMPORTANT:

Return ONLY valid JSON.

The response MUST contain exactly these fields:

{
    "matchScore": 82,
    "title": "Frontend Software Engineer",

    "technicalQuestions": [
        {
            "question": "How does React Virtual DOM work?",
            "intention": "To evaluate the candidate's React fundamentals.",
            "answer": "Explain Virtual DOM, reconciliation and efficient UI updates."
        }
    ],

    "behavioralQuestions": [
        {
            "question": "Tell me about yourself.",
            "intention": "To understand the candidate's background.",
            "answer": "Give a concise summary of education, skills, projects and career goals."
        }
    ],

    "skillGaps": [
        {
            "skill": "TypeScript",
            "severity": "medium"
        }
    ],

    "preparationPlan": [
        {
            "day": 1,
            "focus": "React fundamentals",
            "tasks": [
                "Revise React hooks",
                "Practice component design"
            ]
        }
    ]
}

VERY IMPORTANT:

technicalQuestions MUST be an array of objects.

Correct:

[
    {
        "question": "...",
        "intention": "...",
        "answer": "..."
    }
]

WRONG:

[
    "question",
    "...",
    "intention",
    "...",
    "answer",
    "..."
]

behavioralQuestions MUST also contain objects.

skillGaps MUST contain objects.

preparationPlan MUST contain objects.

Generate:

- At least 5 technical questions
- At least 5 behavioral questions
- At least 5 skill gaps
- At least 5 preparation days
- At least 2 tasks for every preparation day

matchScore must be a number between 0 and 100.

title must be a string.

Do not omit any field.

Do not add any field.

Candidate Resume:
${resume || "No resume provided"}

Candidate Self Description:
${selfDescription || "No self description provided"}

Job Description:
${jobDescription}
`


    try {

        // --------------------------------------------------------
        // IMPORTANT:
        // We are using a plain JSON schema here.
        // This avoids Zod -> JSON schema conversion problems.
        // --------------------------------------------------------

        const responseSchema = {
            type: "OBJECT",

            properties: {

                matchScore: {
                    type: "NUMBER"
                },

                title: {
                    type: "STRING"
                },

                technicalQuestions: {
                    type: "ARRAY",

                    items: {
                        type: "OBJECT",

                        properties: {
                            question: {
                                type: "STRING"
                            },

                            intention: {
                                type: "STRING"
                            },

                            answer: {
                                type: "STRING"
                            }
                        },

                        required: [
                            "question",
                            "intention",
                            "answer"
                        ]
                    }
                },

                behavioralQuestions: {
                    type: "ARRAY",

                    items: {
                        type: "OBJECT",

                        properties: {
                            question: {
                                type: "STRING"
                            },

                            intention: {
                                type: "STRING"
                            },

                            answer: {
                                type: "STRING"
                            }
                        },

                        required: [
                            "question",
                            "intention",
                            "answer"
                        ]
                    }
                },

                skillGaps: {
                    type: "ARRAY",

                    items: {
                        type: "OBJECT",

                        properties: {
                            skill: {
                                type: "STRING"
                            },

                            severity: {
                                type: "STRING",

                                enum: [
                                    "low",
                                    "medium",
                                    "high"
                                ]
                            }
                        },

                        required: [
                            "skill",
                            "severity"
                        ]
                    }
                },

                preparationPlan: {
                    type: "ARRAY",

                    items: {
                        type: "OBJECT",

                        properties: {

                            day: {
                                type: "NUMBER"
                            },

                            focus: {
                                type: "STRING"
                            },

                            tasks: {
                                type: "ARRAY",

                                items: {
                                    type: "STRING"
                                }
                            }
                        },

                        required: [
                            "day",
                            "focus",
                            "tasks"
                        ]
                    }
                }
            },

            required: [
                "matchScore",
                "title",
                "technicalQuestions",
                "behavioralQuestions",
                "skillGaps",
                "preparationPlan"
            ]
        }


        // --------------------------------------------------------
        // GEMINI REQUEST
        // --------------------------------------------------------

        const response = await ai.models.generateContent({

            model: "gemini-3.6-flash",

            contents: prompt,

            config: {

                responseMimeType: "application/json",

                responseSchema: responseSchema
            }
        })


        // --------------------------------------------------------
        // RAW RESPONSE
        // --------------------------------------------------------

    


        if (!response.text) {
            throw new Error("Gemini returned an empty response.")
        }


        // --------------------------------------------------------
        // PARSE JSON
        // --------------------------------------------------------

        let report

        try {

            report = JSON.parse(response.text)

        } catch (error) {

            console.error("❌ JSON PARSE ERROR")
            console.error(response.text)

            throw new Error(
                "Gemini returned invalid JSON."
            )
        }


        // --------------------------------------------------------
        // VALIDATE WITH ZOD
        // --------------------------------------------------------

        const validatedReport =
            interviewReportSchema.parse(report)


        // --------------------------------------------------------
        // CHECK ARRAY LENGTHS
        // --------------------------------------------------------

        if (
            validatedReport.technicalQuestions.length < 5
        ) {
            throw new Error(
                "Gemini returned fewer than 5 technical questions."
            )
        }

        if (
            validatedReport.behavioralQuestions.length < 5
        ) {
            throw new Error(
                "Gemini returned fewer than 5 behavioral questions."
            )
        }

        if (
            validatedReport.skillGaps.length < 5
        ) {
            throw new Error(
                "Gemini returned fewer than 5 skill gaps."
            )
        }

        if (
            validatedReport.preparationPlan.length < 5
        ) {
            throw new Error(
                "Gemini returned fewer than 5 preparation days."
            )
        }


        // --------------------------------------------------------
        // FINAL LOG
        // --------------------------------------------------------

    
        console.dir(validatedReport, {
            depth: null
        })


        return validatedReport


    } catch (error) {

        console.error("")
        console.error("❌ AI SERVICE ERROR")
        console.error(error)
        console.error("")

        throw error
    }
}


// ============================================================
// HTML → PDF
// ============================================================

async function generatePdfFromHtml(htmlContent) {

    const browser = await puppeteer.launch()

    try {

        const page = await browser.newPage()

        await page.setContent(
            htmlContent,
            {
                waitUntil: "networkidle0"
            }
        )

        const pdfBuffer = await page.pdf({

            format: "A4",

            margin: {
                top: "20mm",
                bottom: "20mm",
                left: "15mm",
                right: "15mm"
            }
        })

        return pdfBuffer

    } finally {

        await browser.close()
    }
}


// ============================================================
// GENERATE RESUME PDF
// ============================================================

async function generateResumePdf({
    resume,
    selfDescription,
    jobDescription
}) {

    const resumeSchema = {

        type: "OBJECT",

        properties: {

            html: {
                type: "STRING"
            }
        },

        required: [
            "html"
        ]
    }


    const prompt = `
You are a professional resume editor.

Your task is to create an ATS-friendly HTML resume using the candidate's EXISTING information.

========================
IMPORTANT IDENTITY RULES
========================

The Candidate Resume is the SOURCE OF TRUTH for the candidate's identity.

You MUST preserve the candidate's personal information exactly as provided.

NEVER invent, replace, modify, or hallucinate:

- Candidate name
- Phone number
- Email address
- Location
- LinkedIn URL
- GitHub URL
- Portfolio URL
- College / University
- Degree
- Company names
- Job titles
- Employment dates
- Project names
- Certifications

If a piece of information is not available in the candidate's information, DO NOT invent it.

Instead, omit that information.

NEVER use fictional names such as:
- Aarav Sharma
- Rohan Sharma
- Rahul Kumar
- John Doe
- Jane Doe

The generated resume MUST belong to the SAME candidate whose information appears in the Candidate Resume.

========================
CONTENT RULES
========================

You may improve:

- Grammar
- Sentence structure
- Bullet-point wording
- Professional presentation
- ATS optimization
- Keyword relevance
- Organization of sections

You may NOT change factual information.

Do not create fake companies, fake internships, fake projects, fake achievements, fake education, or fake experience.

Do not add experience simply because it appears in the Job Description.

The Job Description should ONLY be used to identify relevant keywords and skills that already exist in the candidate's information.

========================
CANDIDATE RESUME
========================

${resume || "No resume provided"}

========================
SELF DESCRIPTION
========================

${selfDescription || "No self description provided"}

========================
JOB DESCRIPTION
========================

${jobDescription}

========================
OUTPUT
========================

Return ONLY valid JSON.

The JSON must contain exactly:

{
    "html": "complete HTML resume"
}

The HTML should:

- Be professional
- Be ATS friendly
- Be 1-2 pages
- Use clean semantic HTML
- Highlight relevant existing skills
- Highlight relevant existing projects
- Tailor wording toward the job description
- Preserve all candidate identity information exactly
- Not mention that it was generated by AI
- Not contain markdown
- Not contain explanations outside the HTML

FINAL CHECK BEFORE RESPONDING:

Verify that the candidate's name, email, phone number, education, experience, projects and other personal information come from the provided candidate information.

If information is missing, omit it.

NEVER guess.
NEVER invent.
NEVER replace the candidate's identity.
`;


    const response = await ai.models.generateContent({

        model: "gemini-3.6-flash",

        contents: prompt,

        config: {

            responseMimeType: "application/json",

            responseSchema: resumeSchema
        }
    })


    const jsonContent =
        JSON.parse(response.text)


    if (!jsonContent.html) {

        throw new Error(
            "AI did not return resume HTML."
        )
    }


    const pdfBuffer =
        await generatePdfFromHtml(
            jsonContent.html
        )


    return pdfBuffer
}


// ============================================================
// EXPORT
// ============================================================

module.exports = {
    generateInterviewReport,
    generateResumePdf
}