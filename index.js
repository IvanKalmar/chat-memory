import { extension_settings, getContext, loadExtensionSettings } from "../../../extensions.js";

import { saveSettingsDebounced, eventSource, event_types } from "../../../../script.js";


const extensionName = "chat-memory";
const extensionFolderPath = `scripts/extensions/third-party/${extensionName}`;
const extensionSettings = extension_settings[extensionName];
const defaultSettings = {};


jQuery(async () => {
  $("body").append(
      await $.get(`${extensionFolderPath}/panel.html`)
  );

  const chatMemoryPanel = $("#chat-memory-panel");
  chatMemoryPanel.fadeOut();

  const appendButton = () => {
    const openMemoryButton = $(`<a id="option_chat_memory" class="interactable" tabindex="0">
<i class="fa-lg fa-solid fa-book"></i><span data-i18n="Close chat">Chat memory</span></a>`);

    $("#options .options-content").prepend(openMemoryButton);

    $("#option_chat_memory").on("click", () => {
      chatMemoryPanel.toggleFade();
    });
  }

  appendButton();

  eventSource.on(event_types.CHAT_CHANGED, (messageIndex) => {
    appendButton();
  });

  eventSource.on(event_types.MESSAGE_RECEIVED, (messageIndex) => {
    const message = context.chat[messageIndex].mes;
  });

  eventSource.on(event_types.MESSAGE_SENT, (messageIndex) => {
    const message = context.chat[messageIndex].mes;
    context.chat[messageIndex].mes = context.chat[messageIndex].mes + "123123123123"
  });
});
