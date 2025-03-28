import { extension_settings, getContext, loadExtensionSettings } from "../../../extensions.js";

import { saveSettingsDebounced, eventSource, event_types } from "../../../../script.js";


const extensionName = "chat-memory";
const extensionFolderPath = `scripts/extensions/third-party/${extensionName}`;
const extensionSettings = extension_settings[extensionName];


jQuery(async () => {
  extension_settings[extensionName] = extension_settings[extensionName] || {};
  if(Object.keys(extension_settings[extensionName]).length === 0) {
    Object.assign(extension_settings[extensionName], {
      chats: {}
    });
  }

  saveSettingsDebounced();

  $("body").prepend(
      await $.get(`${extensionFolderPath}/panel.html`)
  );

  const chatMemoryPanel = $("#chat-memory-panel");
  const chatMemoryPanelClose = $("#chat-memory-panel-close");

  chatMemoryPanel.fadeOut();

  const openMemoryButton = $(`<a id="option_chat_memory" class="interactable" tabindex="0">
<i class="fa-lg fa-solid fa-book"></i><span data-i18n="Close chat">Chat memory</span></a>`);

  $("#options .options-content").prepend(openMemoryButton);

  $("#option_chat_memory").on("click", () => {
    chatMemoryPanel.fadeIn();
  });

  chatMemoryPanelClose.on("click", () => {
    chatMemoryPanel.fadeOut();
  })

  const context = SillyTavern.getContext();

  eventSource.on(event_types.CHAT_CHANGED, (messageIndex) => {
    if(!extension_settings[extensionName].chats.hasOwnProperty(context.getCurrentChatId())) {
      extension_settings[extensionName].chats[context.getCurrentChatId()] = {
        currentContext: {
          test1: 1,
          test2: "asdad"
        },
        receive: "",
        sent: ""
      }
    }

    saveSettingsDebounced();
  });

  eventSource.on(event_types.MESSAGE_RECEIVED, (messageIndex) => {
    const comments = [...context.chat[messageIndex].mes.matchAll(/<!--(.*?)-->/g].map((comment) => {
      return comment.slice(3, comment.length - 1 - 3).split("\n")
    });

    console.log(comments);
  });

  eventSource.on(event_types.MESSAGE_SENT, (messageIndex) => {
    const currentContext = extension_settings[extensionName]
        .chats[context.getCurrentChatId()].currentContext;

    const contextComment = "<!--\n" + Object.keys(currentContext).map((key) => {
      return `${key}: ${currentContext[key].toString()}`;
    }).join("\n") + "\n-->\n";

    console.log("!!!", currentContext);

    context.chat[messageIndex].mes = contextComment + context.chat[messageIndex].mes;
  });
});
