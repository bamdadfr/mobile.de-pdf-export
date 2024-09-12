import {Ad} from 'src/common/ad';
import {SharedState} from 'src/common/shared-state';

window.addEventListener('load', async () => {
  const state = await SharedState.init();

  if (!state.isTriggered) {
    return;
  }

  const ad = new Ad();
  await ad.build();
  ad.export();
  await SharedState.untrig();
});
