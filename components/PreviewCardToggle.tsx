import * as React from "react";
import * as Tabs from "@radix-ui/react-tabs";

interface Tab {
  value: string; // Unique identifier for the tab
  label: string; // Text displayed on the tab trigger
  content: React.ReactNode; // Content displayed when the tab is active
}

interface TabsProps {
  defaultValue?: string; // Default active tab
  tabs: Tab[]; // Array of tabs
  ariaLabel?: string; // Accessibility label for the tab list
}

const TabsComponent: React.FC<TabsProps> = ({
  defaultValue,
  tabs,
  ariaLabel,
}) => {
  return (
    <Tabs.Root
      className="flex flex-col"
      defaultValue={defaultValue || tabs[0]?.value} // Default to the first tab if no defaultValue is provided
    >
      <Tabs.List
        className="flex shrink-0 border-b border-mauve6 w-fit"
        aria-label={ariaLabel}
      >
        {tabs.map((tab) => (
          <Tabs.Trigger
            key={tab.value}
            value={tab.value}
            className="flex-1 px-4 py-2 text-sm text-white hover:text-purple-600 data-[state=active]:text-purple-600"
          >
            {tab.label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>

      {tabs.map((tab) => (
        <Tabs.Content key={tab.value} value={tab.value} className="grow">
          {tab.content}
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
};

export default TabsComponent;
