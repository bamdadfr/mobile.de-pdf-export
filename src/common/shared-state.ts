// @ts-expect-error type import works
import {type LanguageCode} from '@sckt/translate';
import browser from 'webextension-polyfill';

interface StateKeys {
  isTriggered: boolean;
  language: LanguageCode;
}

const StateDefaults: StateKeys = {
  isTriggered: false,
  language: 'de',
};

export class SharedState {
  public static get state(): Promise<StateKeys> {
    return new Promise((resolve) => {
      browser.storage.local.get().then((state) => resolve(state as unknown as StateKeys));
    });
  }

  public static async init() {
    const state = await this.state;

    if (typeof state?.isTriggered === 'undefined') {
      await browser.storage.local.set({isTriggered: StateDefaults.isTriggered});
    }

    if (typeof state?.language === 'undefined') {
      await browser.storage.local.set({language: StateDefaults.language});
    }

    return await this.state;
  }

  public static async trig() {
    await browser.storage.local.set({isTriggered: true});
    await browser.tabs.reload();
  }

  public static async untrig() {
    await browser.storage.local.set({isTriggered: false});
  }

  public static async setLanguage(language: LanguageCode) {
    await browser.storage.local.set({language: language});
  }
}
