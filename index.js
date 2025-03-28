import { extension_settings, getContext, loadExtensionSettings } from "../../../extensions.js";

import { saveSettingsDebounced, eventSource, event_types } from "../../../../script.js";


const extensionName = "chat-memory";
const extensionFolderPath = `scripts/extensions/third-party/${extensionName}`;
const extensionSettings = extension_settings[extensionName];
const defaultSettings = {
  selectedChats: []
};


jQuery(async () => {
  const settingsHtml = await $.get(`${extensionFolderPath}/views/settings.html`);
  $("#extensions_settings").append(settingsHtml);

  const enabledChats = $("#chat_memory_enabled_chats");
  const availableChats = $("#chat_memory_available_chats");
  const addChatButton = $("#chat_memory_add_chat_button");
  const removeChatButton = $("#chat_memory_remove_chat_button");
  const saveButton = $("#chat_memory_save_settings_button");

  const updateChats = () => {
    console.log(extension_settings[extensionName].selectedChats);

    enabledChats.empty();

    for(const chat of extension_settings[extensionName].selectedChats) {
      enabledChats.append(`<pre>${chat}</pre>`)
    }

    if(extension_settings[extensionName].selectedChats.length === 0) {
      enabledChats.append("<pre>Empty</pre>")
    }
  }

  extension_settings[extensionName] = extension_settings[extensionName] || {};
  if (Object.keys(extension_settings[extensionName]).length === 0) {
    Object.assign(extension_settings[extensionName], defaultSettings);
  }

  updateChats();

  const context = SillyTavern.getContext();
  console.log(context);

  eventSource.on(event_types.CHARACTER_PAGE_LOADED, () => {
    availableChats.empty();

    for(const c of Array.from(context.characters)) {
      availableChats.append(new Option(c.name, c.name));
    }
  })


  addChatButton.on("click", () => {
    const selectedChats = new Set(extensionSettings.selectedChats);
    selectedChats.add(availableChats.val());
    extensionSettings.selectedChats = Array.from(selectedChats);

    updateChats();
  });

  removeChatButton.on("click", () => {
    const selectedChats = new Set(extensionSettings.selectedChats);
    selectedChats.delete(availableChats.val());
    extensionSettings.selectedChats = Array.from(selectedChats);

    updateChats();
  });

  saveButton.on("click", () => {
    saveSettingsDebounced();
    toastr.info(``, "Saved!");
  });


  const memoryHtml = await $.get(`${extensionFolderPath}/views/memory.html`);
  $("#movingDivs").append(memoryHtml);

  const openMemoryButton = $(`<div id="openMemory" class="drawer-icon fa-solid fa-book fa-fw interactable openIcon" 
style="position: absolute; top: 3px; left: 3px;"></div>`);
  openMemoryButton.on("click", () => {
    openMemoryButton.hide();
    memoryHtml.show();
  })

  $("body").prepend(openMemoryButton);

  eventSource.on(event_types.MESSAGE_RECEIVED, (messageIndex) => {
    let userFind = false;
    const selectedChats = new Set(extensionSettings.selectedChats);
    for(const user of new Set(context.chat.map(msg => msg.name))) {
      if(selectedChats.has(user)) {
        userFind = true;
        break;
      }
    }

    if(!userFind) {
      return;
    }

    const message = context.chat[messageIndex].mes;
  });

  eventSource.on(event_types.MESSAGE_SENT, (messageIndex) => {
    let userFind = false;
    const selectedChats = new Set(extensionSettings.selectedChats);
    for(const user of new Set(context.chat.map(msg => msg.name))) {
      if(selectedChats.has(user)) {
        userFind = true;
        break;
      }
    }

    if(!userFind) {
      return;
    }
    const message = context.chat[messageIndex].mes;
    context.chat[messageIndex].mes = context.chat[messageIndex].mes + "123123123123"
  });
});
