import { extension_settings, getContext, loadExtensionSettings } from "../../../extensions.js";

import { saveSettingsDebounced, eventSource, event_types } from "../../../../script.js";


const extensionName = "chat-memory";
const extensionFolderPath = `scripts/extensions/third-party/${extensionName}`;
const extensionSettings = extension_settings[extensionName];
const defaultSettings = {};


jQuery(async () => {
  const context = SillyTavern.getContext();

  const openMemoryButton = $(`<a id="option_close_chat" class="displayNone interactable" tabindex="0">
<i class="fa-lg fa-solid fa-book"></i>
<span data-i18n="Close chat">Chat memory</span></a>`);
  $("div.options-content").prepend(openMemoryButton);

  $("#movingDivs").append(
      await $.get(`${extensionFolderPath}/panel.html`)
  );

  const chatMemoryPanel = $("#chat-memory");
  const chatMemoryClose = $("#chat-memory-close");

  openMemoryButton.on("click", () => {
    chatMemoryPanel.fadeToggle();
  });

  chatMemoryClose.on("click", () => {
    chatMemoryPanel.fadeOut();
  });

  eventSource.on(event_types.MESSAGE_RECEIVED, (messageIndex) => {

    const message = context.chat[messageIndex].mes;
  });

  eventSource.on(event_types.MESSAGE_SENT, (messageIndex) => {
    const message = context.chat[messageIndex].mes;
    context.chat[messageIndex].mes = context.chat[messageIndex].mes + "123123123123"
  });
});
