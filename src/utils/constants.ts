import ROUTES from "./routes";

export const ORG_NAVITEMS = [
  {
    href: ROUTES.HOME,
    label: "Dashboard",
    // icon: mdiHomeVariantOutline,
    titleIcon: "",
    children: [],
  },
  {
    href: ROUTES.HOME,
    label: "Dashboard",
    // icon: mdiHomeVariantOutline,
    titleIcon: "",
    children: [],
  },
  {
    href: ROUTES.HOME,
    label: "Dashboard",
    // icon: mdiHomeVariantOutline,
    titleIcon: "",
    children: [
      {
        childrenHref: ROUTES.HOME,
        label: "Artworks",
      },
    ],
  },
  {
    href: ROUTES.HOME,
    label: "Dashboard",
    // icon: mdiHomeVariantOutline,
    titleIcon: "",
    children: [],
  },
  // {
  //   href: '',
  //   label: 'Inventory',
  //   icon: mdiImageOutline,
  //   titleIcon: mdiChevronDown,
  //   children: [
  //     {
  //       childrenHref: ROUTES.ORG_INVENTORY,
  //       label: 'Artworks',
  //     },
  //     {
  //       childrenHref: ROUTES.ORG_COLLECTION,
  //       label: 'Collections',
  //     },
  //     // {
  //     //   childrenHref: ROUTES.ORG_INVENTORY,
  //     //   label: 'Private Rooms',
  //     //   icon: mdiHomeVariantOutline,
  //     // },
  //   ],
  // },
  // {
  //   href: ROUTES.ORG_EVENTS,
  //   label: 'Events',
  //   icon: mdiCalendarBlankOutline,
  //   // children: [],
  // },
  // {
  //   href: ROUTES.ORG_ORDERS,
  //   label: 'Orders',
  //   icon: mdiShoppingOutline,
  //   titleIcon: '',
  //   // children: [],
  // },
  // {
  //   href: ROUTES.ORG_INVOICE,
  //   label: 'Invoices',
  //   icon: mdiNoteTextOutline,
  // },
  // {
  //   href: ROUTES.CONTACTS,
  //   label: 'Contacts',
  //   icon: mdiAccount,
  // },
  // {
  //   href: ROUTES.FINANCE,
  //   label: 'Payouts',
  //   icon: mdiWalletOutline,
  //   titleIcon: '',
  //   // children: [],
  // },
  // {
  //   href: ROUTES.ORG_LOCATIONS,
  //   label: 'Locations',
  //   icon: mdiDomain,
  //   titleIcon: '',
  //   // children: [],
  // },
];
