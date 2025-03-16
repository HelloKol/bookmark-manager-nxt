import * as React from "react";
import * as Tabs from "@radix-ui/react-tabs";

interface Tab {
  value: string;
  label: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

interface TabsProps {
  defaultValue?: string;
  tabs: Tab[];
  ariaLabel?: string;
}

const TabsComponent: React.FC<TabsProps> = ({
  defaultValue,
  tabs,
  ariaLabel,
}) => {
  return (
    <Tabs.Root
      className="flex flex-col"
      defaultValue={defaultValue || tabs[0]?.value}
    >
      <Tabs.List className="flex shrink-0 w-fit ml-auto" aria-label={ariaLabel}>
        {tabs.map((tab) => (
          <Tabs.Trigger
            key={tab.value}
            value={tab.value}
            className="flex-1 px-4 py-2 cursor-pointer TabsTrigger"
          >
            {tab.icon}
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
