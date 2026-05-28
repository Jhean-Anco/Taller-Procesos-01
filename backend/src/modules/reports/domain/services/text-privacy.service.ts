export class TextPrivacyService {
  maskSensitiveText(text: string): string {
    return text
      .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[correo]')
      .replace(/\b(?:\+?\d[\s-]?){7,}\b/g, '[numero]')
      .replace(/\b\d{8,}\b/g, '[documento]')
      .replace(/\b[A-Z\u00C1\u00C9\u00CD\u00D3\u00DA\u00D1][a-z\u00E1\u00E9\u00ED\u00F3\u00FA\u00F1]+(?:\s+[A-Z\u00C1\u00C9\u00CD\u00D3\u00DA\u00D1][a-z\u00E1\u00E9\u00ED\u00F3\u00FA\u00F1]+){1,3}\b/g, '[nombre]');
  }

  buildNonSensitiveSummary(text: string, maxLength = 260): string {
    const masked = this.maskSensitiveText(text).replace(/\s+/g, ' ').trim();
    if (masked.length <= maxLength) {
      return masked;
    }
    return `${masked.slice(0, maxLength - 3)}...`;
  }

  sanitizeSignals(signals: string[]): string[] {
    return signals
      .map((signal) => this.maskSensitiveText(signal).trim())
      .filter(Boolean)
      .slice(0, 8);
  }
}
