// @ts-expect-error type import works
import {type LanguageCode, Languages} from '@sckt/translate';
import {type ChangeEvent, useCallback, useEffect, useState} from 'react';
import {SharedState} from 'src/common/shared-state';

const codes = Languages.getAllCodes();
const names = Languages.getAllNames();

export function PopupSelect() {
  const [code, setCode] = useState<LanguageCode | null>(null);

  useEffect(() => {
    (async () => {
      const {language} = await SharedState.state;
      setCode(language);
    })();
  }, []);

  const handleChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    const targetCode: LanguageCode = e.target.value;

    if (targetCode === code) {
      return;
    }

    (async () => {
      await SharedState.setLanguage(targetCode);
    })();
  }, [code]);

  if (code === null) {
    return;
  }

  return (
    <select onChange={handleChange} name="language" id="language" defaultValue={code}>
      {codes.map((c, i) => (
        <option key={c} value={c}>{names[i]}</option>
      ))}
    </select>
  );
}
