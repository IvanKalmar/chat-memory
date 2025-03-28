import { extension_settings, getContext, loadExtensionSettings } from "../../../extensions.js";

import { saveSettingsDebounced, eventSource, event_types } from "../../../../script.js";


const extensionName = "chat-memory";
const extensionFolderPath = `scripts/extensions/third-party/${extensionName}`;
const extensionSettings = extension_settings[extensionName];
const defaultSettings = {
  selectedChats: []
};


jQuery(async () => {
  const settingsHtml = await $.get(`${extensionFolderPath}/example.html`);
  $("#extensions_settings").append(settingsHtml);

  const availableChats = $("#chat_memory_available_chats");
  const saveButton = $("#chat_memory_save_settings_button");

  saveButton.on("click", () => {
    extensionSettings.selectedChats = availableChats.val();
    saveSettingsDebounced();
    toastr.info(``, "Saved!");
  });

  extension_settings[extensionName] = extension_settings[extensionName] || {};
  if (Object.keys(extension_settings[extensionName]).length === 0) {
    Object.assign(extension_settings[extensionName], defaultSettings);
  }

  const context = SillyTavern.getContext();

  eventSource.on(event_types.CHARACTER_PAGE_LOADED, () => {
    availableChats.empty();

    for(const c in context.characters) {
      console.log(c.name);
      availableChats.append(new Option(c.name, c.name));
    }

    availableChats.val(extension_settings[extensionName].selectedChats);
  })

  eventSource.on(event_types.MESSAGE_RECEIVED, (messageIndex) => {
    const message = context.chat[messageIndex].mes;
    console.log(message);
  });

  eventSource.on(event_types.MESSAGE_SENT, (messageIndex) => {
    const message = context.chat[messageIndex].mes;
    console.log(message);
  });
});
