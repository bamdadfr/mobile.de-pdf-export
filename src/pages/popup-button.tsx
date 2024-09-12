import {useCallback} from 'react';
import {SharedState} from 'src/common/shared-state';

export function PopupButton() {
  const handleClick = useCallback(() => {
    (async () => {
      await SharedState.trig();
    })();
  }, []);

  return (
    <button onClick={handleClick}>Export</button>
  );
}
