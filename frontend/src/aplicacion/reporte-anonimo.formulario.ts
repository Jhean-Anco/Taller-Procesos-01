import type {
  AnonymousReportPayload,
  EmotionalFormPayload,
} from "./tipos";

export const initialEmotionalForm: EmotionalFormPayload = {
  fear: false,
  sadness: false,
  anxiety: false,
  isolation: false,
  school_insecurity: false,
};

export function validateAnonymousReportMessage(messageText: string):
  | { valid: true; trimmedMessage: string }
  | { valid: false; message: string } {
  const trimmedMessage = messageText.trim();

  if (!trimmedMessage) {
    return {
      valid: false,
      message: "Describe la situación antes de enviar el reporte.",
    };
  }

  if (trimmedMessage.length < 30) {
    return {
      valid: false,
      message: "El reporte debe contener al menos 30 caracteres.",
    };
  }

  if (trimmedMessage.length > 500) {
    return {
      valid: false,
      message: "El reporte no puede superar los 500 caracteres.",
    };
  }

  return { valid: true, trimmedMessage };
}

export function buildAnonymousReportPayload(
  emotionalForm: EmotionalFormPayload,
  messageText: string,
): AnonymousReportPayload {
  return {
    emotional_form: {
      fear: emotionalForm.fear,
      sadness: emotionalForm.sadness,
      anxiety: emotionalForm.anxiety,
      isolation: emotionalForm.isolation,
      school_insecurity: emotionalForm.school_insecurity,
    },
    message_text: messageText.trim(),
    consent_accepted: true,
  };
}
