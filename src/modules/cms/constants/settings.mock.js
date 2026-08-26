// Mock rows for the `settings` table. value_type drives which control the Site settings page renders.
// value_type: 'text' | 'textarea' | 'image' | 'select' | 'menu' | 'url'
// In future all data will come from the database.
export const SETTINGS = [
  // General
  { id: "s-site-title", key: "site_title", value: "BWIN Consultants", value_type: "text", group: "General", label: "Site title", description: "Shown in the browser tab and used as the default page title.", is_secret: false, is_system: true, updated_at: "2026-08-12 09:20" },
  { id: "s-fab-icon", key: "fab_icon", value: "assets/logo/bwin-icon.png", value_type: "image", group: "General", label: "Favicon", description: "Small icon shown in the browser tab. Square PNG, 512×512 works best.", is_secret: false, is_system: true, updated_at: "2026-08-12 09:20" },
  { id: "s-default-language", key: "default_language", value: "English", value_type: "select", options: ["English", "Bangla"], group: "General", label: "Default language", description: "Language visitors see by default across the public site.", is_secret: false, is_system: false, updated_at: "2026-07-30 14:05" },
  {
    id: "s-site-chat", key: "site_chat", value: "1", value_type: "select",
    options: [
      { value: "0", label: "Disable" },
      { value: "1", label: "Messenger" },
      { value: "2", label: "WhatsApp" },
      { value: "3", label: "Both" },
    ],
    group: "General", label: "Live chat widget", description: "Chat bubble shown to visitors on the public site.", is_secret: false, is_system: false, updated_at: "2026-08-01 11:40",
  },

  // Header
  { id: "s-header-email", key: "email", value: "hello@bwinconsultants.com", value_type: "text", group: "Header", label: "Contact email", description: "Displayed in the site header.", is_secret: false, is_system: false, updated_at: "2026-06-18 10:12" },
  { id: "s-header-phone", key: "phone", value: "+1 555 010 0134", value_type: "text", group: "Header", label: "Contact phone", description: "Displayed in the site header, next to the contact email.", is_secret: false, is_system: false, updated_at: "2026-06-18 10:12" },
  { id: "s-light-logo", key: "light_logo", value: "assets/logo/bwin-logo.png", value_type: "image", group: "Header", label: "Header logo (light)", description: "Logo shown on the light header background.", is_secret: false, is_system: true, updated_at: "2026-05-02 08:55" },

  // Footer
  { id: "s-dark-logo", key: "dark_logo", value: "", value_type: "image", group: "Footer", label: "Footer logo (dark)", description: "Logo shown on the dark footer background.", is_secret: false, is_system: true, updated_at: "2026-05-02 08:55" },
  { id: "s-about-section", key: "about_section", value: "BWIN Consultants helps growing teams train their people, run consultancy engagements, and automate the busywork in between.", value_type: "textarea", group: "Footer", label: "About section", description: "Short blurb shown in the footer.", is_secret: false, is_system: false, updated_at: "2026-07-02 16:30" },
  { id: "s-footer-menu-1", key: "footer_menu_1", value: "menu-company", value_type: "menu", group: "Footer", label: "Footer menu 1", description: "A published menu to display as the first footer column.", is_secret: false, is_system: false, updated_at: "2026-07-02 16:30" },
  { id: "s-footer-menu-2", key: "footer_menu_2", value: "menu-resources", value_type: "menu", group: "Footer", label: "Footer menu 2", description: "A published menu to display as the second footer column.", is_secret: false, is_system: false, updated_at: "2026-07-02 16:30" },
  { id: "s-fb-page-url", key: "fb_page_url", value: "https://facebook.com/bwinconsultants", value_type: "url", group: "Footer", label: "Facebook page URL", description: "Used for the Messenger chat widget and footer link.", is_secret: false, is_system: false, updated_at: "2026-07-02 16:30" },
  { id: "s-payment-gateway-image", key: "payment_gateway_image", value: "", value_type: "image", group: "Footer", label: "Payment gateway image", description: "Row of accepted payment logos shown in the footer.", is_secret: false, is_system: false, updated_at: "2026-04-11 13:00" },
  { id: "s-footer-text-1", key: "footer_text_1", value: "© 2026 BWIN Consultants. All rights reserved.", value_type: "text", group: "Footer", label: "Footer text 1", description: "First line of small print in the footer.", is_secret: false, is_system: false, updated_at: "2026-04-11 13:00" },
  { id: "s-footer-text-2", key: "footer_text_2", value: "Made with care for growing teams.", value_type: "text", group: "Footer", label: "Footer text 2", description: "Second line of small print in the footer.", is_secret: false, is_system: false, updated_at: "2026-04-11 13:00" },

  // Social media
  { id: "s-facebook-url", key: "facebook_url", value: "https://facebook.com/bwinconsultants", value_type: "url", group: "Social media", label: "Facebook", description: "", is_secret: false, is_system: false, updated_at: "2026-03-20 09:00" },
  { id: "s-youtube-url", key: "youtube_url", value: "https://youtube.com/@bwinconsultants", value_type: "url", group: "Social media", label: "YouTube", description: "", is_secret: false, is_system: false, updated_at: "2026-03-20 09:00" },
  { id: "s-linkedin-url", key: "linkedin_url", value: "https://linkedin.com/company/bwinconsultants", value_type: "url", group: "Social media", label: "LinkedIn", description: "", is_secret: false, is_system: false, updated_at: "2026-03-20 09:00" },
  { id: "s-x-url", key: "x_url", value: "", value_type: "url", group: "Social media", label: "X (Twitter)", description: "", is_secret: false, is_system: false, updated_at: "2026-03-20 09:00" },
];

// Site menus available to pick for footer menu slots (mirrors Menu CMS module).
export const SITE_MENUS = [
  { value: "menu-company", label: "Company" },
  { value: "menu-resources", label: "Resources" },
  { value: "menu-legal", label: "Legal" },
  { value: "menu-services", label: "Services" },
];
