import translateFork from '@sckt/translate';
import {SharedState} from 'src/common/shared-state';
import translate from 'translate';

translate.engine = 'google';

export class Translator {
  public static async translateFork(text: string) {
    const {language} = await SharedState.state;

    if (language === 'de') {
      return text;
    }

    return await translateFork(text, {
      engine: 'simplytranslate',
      from: 'de',
      to: language,
    });
  }

  public static async translate(text: string): Promise<string> {
    const {language} = await SharedState.state;

    if (language === 'de') {
      return text;
    }

    return await translate(text, {
      from: 'de',
      to: language,
    });
  }

  public static async translateArray(texts: string[]): Promise<string[]> {
    const separator = '\n';
    const payload = texts.join(separator);
    const results = await this.translate(payload);
    return results.split(separator);
  }
}
