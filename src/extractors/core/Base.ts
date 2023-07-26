import { NativeModules, Platform } from 'react-native';

import { Match } from '../../utils';
import type { Patterns, PDFExtractor, TextResult } from '../../types';

const PdfExtractor = Platform.select({
  android: NativeModules.PdfExtractor,
  ios: {},
}) as PDFExtractor;

export class BaseExtractor {
  static async getUri(): Promise<string | undefined> {
    return PdfExtractor.getUri();
  }

  static async isEncrypted(): Promise<boolean> {
    return PdfExtractor.isEncrypted();
  }

  static async setUri(uri: string): Promise<string | undefined> {
    return PdfExtractor.setUri(uri);
  }

  static async getNumberOfPages(password?: string): Promise<number> {
    return PdfExtractor.getNumberOfPages(password);
  }

  static async canIExtract(): Promise<boolean> {
    return PdfExtractor.canIExtract();
  }

  static async getText(password?: string): Promise<string[]> {
    const data = await PdfExtractor.getText(password);
    return [...new Set(data?.split('\n') || [])] as string[];
  }

  static async getAllText(password?: string): Promise<string[]> {
    const data = await PdfExtractor.getText(password);
    return [...(data?.split('\n') || [])] as string[];
  }  

  static async getTextWithPattern(
    pattern: Patterns,
    password?: string
  ): Promise<TextResult> {
    const patterns = Array.isArray(pattern) ? pattern : [pattern];
    const data = await this.getText(password);
    const matches = patterns.map((regex) => Match(regex, data));
    return [...new Set(matches)].flat();
  }
}
