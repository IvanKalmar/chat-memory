import { extension_settings, getContext, loadExtensionSettings } from "../../../extensions.js";

import { saveSettingsDebounced, eventSource, event_types } from "../../../../script.js";


const extensionName = "chat-memory";
const extensionFolderPath = `scripts/extensions/third-party/${extensionName}`;
const extensionSettings = extension_settings[extensionName];
const defaultSettings = {};


jQuery(async () => {
  const settingsHtml = await $.get(`${extensionFolderPath}/example.html`);

  $("#extensions_settings").append(settingsHtml);

  $("#my_button").on("click", onButtonClick);
  $("#example_setting").on("input", onExampleInput);

  await loadSettings();

  const context = SillyTavern.getContext();

  eventSource.on(event_types.MESSAGE_RECEIVED, (messageIndex) => {
    console.log(context.chat[messageIndex]);
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
  saveSettingsDebounced();
}

function onButtonClick() {
  toastr.info(
    `The checkbox is ${extension_settings[extensionName].example_setting ? "checked" : "not checked"}`,
    "A popup appeared because you clicked the button!"
  );
}
