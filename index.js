import { extension_settings, getContext, loadExtensionSettings } from "../../../extensions.js";

import { saveSettingsDebounced, eventSource, event_types } from "../../../../script.js";


const extensionName = "chat-memory";
const extensionFolderPath = `scripts/extensions/third-party/${extensionName}`;
const extensionSettings = extension_settings[extensionName];
const defaultSettings = {};


jQuery(async () => {
  const context = SillyTavern.getContext();

  const settingsHtml = await $.get(`${extensionFolderPath}/example.html`);

  const charactersList = context.characters.map((character) => {
    console.log(character);
    return $("option").text(1);
  })

  $("#extensions_settings").append(settingsHtml);

  $("#chat_memory_available_chats").append()

  $("#chat_memory_save_settings_button").on("click", () => {
    toastr.info(``, "Saved!");

    saveSettingsDebounced();
  });

  await loadSettings();


  eventSource.on(event_types.MESSAGE_RECEIVED, (messageIndex) => {
    const message = context.chat[messageIndex].mes;
    console.log();
  });

  eventSource.on(event_types.MESSAGE_SENT, (messageIndex) => {
    console.log(data);
  });
});


async function loadSettings() {
  extension_settings[extensionName] = extension_settings[extensionName] || {};
  if (Object.keys(extension_settings[extensionName]).length === 0) {
    Object.assign(extension_settings[extensionName], defaultSettings);
  }

  $("#example_setting").prop("checked", extension_settings[extensionName].example_setting).trigger("input");
}

function onExampleInput(event) {
  const value = Boolean($(event.target).prop("checked"));
  extension_settings[extensionName].example_setting = value;

}
