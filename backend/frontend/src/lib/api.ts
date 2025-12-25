const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

export type ChatResponse = {
  success: boolean;
  answer: string;
  question: string;
};

export const chatApi = async (
  question: string,
  contextId?: string,
  contextType?: 'pdf' | 'video' | 'chapter'
): Promise<ChatResponse> => {
  const payload: Record<string, any> = { question };
  if (contextId) payload.context_id = contextId;
  if (contextType) payload.context_type = contextType;

  const response = await fetch(`${API_BASE_URL}/chat/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  
  if (!response.ok) {
    throw new Error('Failed to get chat response');
  }
  
  return response.json();
};

export const getAudioDialogue = async (): Promise<{ dialogue: { speaker: string; message: string; order: number; }[]; raw_script?: string; success: boolean }> => {
  const response = await fetch(`${API_BASE_URL}/audio-dialogue/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to get audio dialogue');
  }
  
  return response.json();
};

export const getVideoSummary = async (): Promise<{ key_points: string; exam_tips: string; title?: string; success: boolean }> => {
  const response = await fetch(`${API_BASE_URL}/video-summary/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to get video summary');
  }
  
  return response.json();
};

export const uploadPdf = async (file: File, title?: string): Promise<{ message?: string; success?: boolean; chapter_id?: number; }> => {
  const formData = new FormData();
  formData.append('file', file);
  if (title) formData.append('title', title);

  const response = await fetch(`${API_BASE_URL}/upload-chapter/`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to upload PDF');
  }

  return response.json();
};

export const addYoutubeVideo = async (
  url: string,
  title?: string,
): Promise<{ message?: string; success?: boolean; video_id?: number; transcript_length?: number }> => {
  const response = await fetch(`${API_BASE_URL}/add-video/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url, title }),
  });

  if (!response.ok) {
    throw new Error('Failed to add YouTube video');
  }

  return response.json();
};

export const getStudyMaterial = async (): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/study-material/`);
  if (!response.ok) {
    throw new Error('Failed to fetch study material');
  }
  return response.json();
};
