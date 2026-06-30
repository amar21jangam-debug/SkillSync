export const TID = {
  // landing / auth
  landingGetStartedBtn: "landing-get-started-btn",
  landingLoginBtn: "landing-login-btn",
  authEmailInput: "auth-email-input",
  authPasswordInput: "auth-password-input",
  authNameInput: "auth-name-input",
  authSubmitBtn: "auth-submit-btn",
  authSwitchBtn: "auth-switch-mode-btn",

  // onboarding
  onbStep: (n) => `onboarding-step-${n}`,
  onbGoalCard: (g) => `onb-goal-${g}`,
  onbPersonalityChip: (p) => `onb-personality-${p}`,
  onbConnectChip: (c) => `onb-connect-${c}`,
  onbPersonalityText: "onb-personality-text",
  onbConnectText: "onb-connect-text",
  onbNextBtn: "onb-next-btn",
  onbBackBtn: "onb-back-btn",
  onbFinishBtn: "onb-finish-btn",

  // sidebar
  sidebarLink: (key) => `sidebar-${key}`,
  sidebarLogout: "sidebar-logout-btn",

  // dashboard
  streakValue: "stat-streak",
  levelBadge: "stat-level",
  xpValue: "stat-xp",

  // roadmap
  roadmapStep: (i) => `roadmap-step-${i}`,

  // practice
  problemRow: (id) => `problem-row-${id}`,
  problemOpenBtn: (id) => `problem-open-${id}`,
  imStuckBtn: "im-stuck-btn",
  solvedBtn: "mark-solved-btn",

  // ai chat
  aiFloatBtn: "ai-float-btn",
  aiInput: "ai-chat-input",
  aiSendBtn: "ai-send-btn",
  aiModeBtn: (m) => `ai-mode-${m}`,

  // groups
  groupCard: (id) => `group-card-${id}`,
  enterGroupBtn: (id) => `enter-group-${id}`,
  startMeetBtn: "start-meet-btn",
  groupChatInput: "group-chat-input",
  groupChatSendBtn: "group-chat-send",

  // connect
  connectCard: (id) => `connect-card-${id}`,
  connectRequestBtn: (id) => `connect-request-${id}`,
  aiMatchBtn: "ai-match-btn",

  // messages
  messageContact: (id) => `msg-contact-${id}`,
  messageInput: "msg-input",
  messageSendBtn: "msg-send-btn",
  profileOpenBtn: (id) => `profile-open-${id}`,
  profileDrawer: "profile-drawer",

  // level switcher (demo)
  levelSwitcherBtn: "level-switcher-btn",
  levelOption: (lvl) => `level-option-${lvl}`,

  // mentors booking
  mentorBookBtn: (id) => `mentor-book-${id}`,
  mentorSlotBtn: (slot) => `mentor-slot-${slot}`,
  mentorConfirmBookBtn: "mentor-confirm-book-btn",

  // certificates
  certificateCard: (id) => `cert-card-${id}`,
  certificateDownloadBtn: (id) => `cert-download-${id}`,
};
