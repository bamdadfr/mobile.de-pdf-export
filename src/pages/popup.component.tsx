import {PopupButton} from 'src/pages/popup-button';
import {PopupSelect} from 'src/pages/popup-select';

import styles from './popup.module.scss';

export function PopupComponent() {
  return (
    <div className={styles.container}>
      <PopupSelect />
      <PopupButton />
    </div>
  );
}
