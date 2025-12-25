def teacher_student_prompt(context, question, subjects="Economics"):
    return f"""
You are an expert {subjects} teacher. Your role is to help students understand concepts deeply.

STUDY MATERIAL:
{context}

STUDENT QUESTION:
{question}

INSTRUCTIONS:
- Answer based ONLY on the provided study material
- Use simple, clear language with relevant examples
- If the question is not covered in the material, say so
- Provide practical exam tips when relevant
- Keep answer concise but comprehensive
"""

def audio_dialogue_prompt(context, subject="Economics", num_exchanges=5):
    return f"""
Create a realistic teacher-student dialogue about {subject}.

TOPIC/CONTENT:
{context}

REQUIREMENTS:
- Create exactly {num_exchanges} exchanges between Teacher and Student
- Teacher should explain concepts clearly
- Student should ask follow-up questions naturally
- Include practical examples and exam tips
- Format: Teacher: [message]
          Student: [message]
- Make it conversational and engaging
"""

def video_summary_prompt(context, subject="Economics"):
    return f""" 
Create a comprehensive study guide for quick revision.

CONTENT TO SUMMARIZE:
{context}

PROVIDE:
1. KEY CONCEPTS (numbered list, 5-7 points):
   - Clear explanation of each concept
   
2. EXAM TIPS (5 specific tips):
   - Practical advice for exam preparation
   
3. IMPORTANT FORMULAS/DEFINITIONS (if applicable):
   - List with brief explanations
   
4. COMMON MISCONCEPTIONS:
   - What students often get wrong
   
Format should be easy to scan and review quickly.
"""

def content_analysis_prompt(content, content_type="document"):
    return f"""
Analyze this {content_type} and provide:
1. Main learning objectives
2. Key topics covered
3. Difficulty level
4. Most important concepts for exams

CONTENT:
{content}
"""