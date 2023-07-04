import { jsx, render } from 'https://cdn.jsdelivr.net/npm/nano-jsx/+esm';
const { default: trans } = await import(window.origin + '/fe/lol-social/trans-player-behavior.json', { assert: { type: 'json' } });

let dateObj = new Date();
let month = dateObj.getUTCMonth() + 1;
let day = dateObj.getUTCDate();
let newdate = day + "/" + month

if (newdate == "1/4" && DataStore.get("April fool` joke")){
  const BanAlert = () => {
    const title = trans['player_behavior_login_ban_notification_header_unknown'];
    const message = trans['player_behavior_login_ban_notification_body_unknown_permaban'];
    const acceptText = trans['player_behavior_accept_notification_shutdown_text'];
    const shutdown = () => fetch('/process-control/v1/process/quit', { method: 'POST' });

    return jsx/*html*/`
      <div class="modal" style="position: absolute; inset: 0px; z-index: 850;">
        <lol-uikit-full-page-backdrop class="backdrop" style="display: flex; align-items: center; justify-content: center; position: absolute; inset: 0px;" />
        <div class="dialog-alert" style="display: flex; align-items: center; justify-content: center; position: absolute; inset: 0px;">
          <lol-uikit-dialog-frame class="dialog-frame" style="z-index: 0;">
            <div class="dialog-content">
              <lol-uikit-content-block class="player-behavior-ban-notification" type="dialog-medium">
                <h4>${title}</h4>
                <hr class="heading-spacer" />
                <p dangerouslySetInnerHTML=${{ __html: message }}></p>
              </lol-uikit-content-block>
            </div>
            <lol-uikit-flat-button-group type="dialog-frame">
              <lol-uikit-flat-button class="button-ok" tabindex="0" primary="true" onClick=${shutdown}>${acceptText}</lol-uikit-flat-button>
            </lol-uikit-flat-button-group>
          </lol-uikit-dialog-frame>
        </div>
      </div>
    `;
  }

  window.addEventListener('load', async () => {
    const delay = (t) => new Promise(r => setTimeout(r, t));
    const manager = () => document.getElementById('lol-uikit-layer-manager-wrapper');

    while (!manager()) {
      await delay(200);
    }

    const root = document.createElement('div');
    render(BanAlert, root);
    manager().appendChild(root);
  });
}