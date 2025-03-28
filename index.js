import { extension_settings, getContext, loadExtensionSettings } from "../../../extensions.js";

import { saveSettingsDebounced, eventSource, event_types } from "../../../../script.js";


const extensionName = "chat-memory";
const extensionFolderPath = `scripts/extensions/third-party/${extensionName}`;
const extensionSettings = extension_settings[extensionName];
const defaultSettings = {
  selectedChats: []
};


jQuery(async () => {
  const context = SillyTavern.getContext();

  const settingsHtml = await $.get(`${extensionFolderPath}/example.html`);

  const availableChats = $("#chat_memory_available_chats");
  const saveButton = $("#chat_memory_save_settings_button");

  for(const c in context.characters) {
    availableChats.append(`<option value="${c.name}">${c.name}</option>`);
  }

  saveButton.on("click", () => {
    extensionSettings.selectedChats = availableChats.val();
    saveSettingsDebounced();
    toastr.info(``, "Saved!");
  });

  extension_settings[extensionName] = extension_settings[extensionName] || {};
  if (Object.keys(extension_settings[extensionName]).length === 0) {
    Object.assign(extension_settings[extensionName], defaultSettings);
  }

  availableChats.val(extension_settings[extensionName].selectedChats);

  $("#extensions_settings").append(settingsHtml);


  eventSource.on(event_types.MESSAGE_RECEIVED, (messageIndex) => {
    const message = context.chat[messageIndex].mes;
    console.log();
  });

  eventSource.on(event_types.MESSAGE_SENT, (messageIndex) => {
    console.log(data);
  });
});
