export default defineAppConfig({
  toaster: {
    position: 'bottom-right' as const,
    expand: true,
    duration: 5000,
  },
  ui: {
    icons: {
      caution: 'i-carbon-warning-alt',
      copy: 'i-carbon-copy',
      dark: 'i-carbon-moon',
      document: 'i-carbon-document',
      external: 'i-carbon-launch',
      hash: 'i-carbon-hashtag',
      light: 'i-carbon-sun',
      menu: 'i-carbon-menu',
      next: 'i-carbon-arrow-right',
      note: 'i-carbon-information',
      prev: 'i-carbon-arrow-left',
      system: 'i-carbon-computer',
      tip: 'i-carbon-lightbulb',
      warning: 'i-carbon-warning',
      chevronDoubleLeft: 'i-carbon-chevron-double-left',
      chevronDoubleRight: 'i-carbon-chevron-double-right',
      chevronDown: 'i-carbon-chevron-down',
      chevronLeft: 'i-carbon-chevron-left',
      chevronRight: 'i-carbon-chevron-right',
      arrowLeft: 'i-carbon-arrow-left',
      arrowRight: 'i-carbon-arrow-right',
      check: 'i-carbon-checkmark',
      close: 'i-carbon-close',
      ellipsis: 'i-carbon-overflow-menu-horizontal',
      loading: 'i-carbon-loading',
      minus: 'i-carbon-subtract',
      search: 'i-carbon-search',
    },
    navigationMenu: {
      slots: {
        item: '!py-0',
        link: 'flex flex-col items-center justify-start w-full gap-0.5 w-[90px]',
        linkLabel: 'text-xs',
        linkTrailing: 'absolute right-2 top-2',
        linkTrailingIcon: 'size-4 text-[var(--ui-text-dimmed)]',
        // inner menu
        childList: '!grid-cols-5',
        childLink: 'flex flex-col items-center justify-start w-full gap-0.5s',
        childLinkLabel: 'text-[10px] text-center text-[var(--ui-text-muted)]',
        childLinkIcon: 'size-6 !text-blue-300',
      },
    },
    colors: {
      primary: 'blue',
      neutral: 'slate',
    },
    contentNavigation: {
      slots: {
        list: 'space-y-2',
        listWithChildren: 'border-none transform mb-5',
      },
      variants: {
        active: {
          true: {
            link: 'text-[var(--ui-text-toned)] after:-left-[1px] font-semibold rounded-[10px] after:rounded-[10px] after:w-full after:h-full after:absolute after:bottom-0 after:block after:bg-[var(--ui-bg-elevated)]/50 after:shadow-xs',
          },
          false: {
            link: 'text-[var(--ui-text-toned)]',
            linkLeadingIcon: 'text-[var(--ui-text-dimmed)]',
          },
        },
      },
      compoundVariants: [
        {
          color: 'primary',
          variant: 'pill',
          active: true,
          class: {
            link: 'text-[var(--ui-text-highlighted)] ',
          },
        },
      ],
    },
    prose: {
      codeIcon: {
        'robots.txt': 'vscode-icons:file-type-robots',
      },
      a: {
        base: [
          'relative border-none underline underline-offset-4 text-[var(--ui-text)] decoration-transition-all decoration-opacity-70 decoration-[0.1rem] decoration-[var(--ui-text-dimmed)]',
          // set a :after border under the link
          'transition-all',
          'hover:text-[var(--ui-text-dimmed)] decoration-opacity-100 hover:underline-offset-1 hover:decoration-[0.1rem]',
        ],
      },
    },
  },
})
